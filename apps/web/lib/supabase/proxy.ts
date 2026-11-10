
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              supabaseResponse.cookies.set({
                name,
                value,
                ...options,
              });
            }
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isAdminLogin =
    pathname === "/admin/login";

  /*
   * The admin login page itself is always public.
   *
   * Authorization is performed after successful
   * authentication by app/admin/login/page.tsx.
   */
  if (isAdminLogin) {
    return supabaseResponse;
  }

  /*
   * Nothing to protect outside /admin.
   */
  if (!isAdminRoute) {
    return supabaseResponse;
  }

  /*
   * Validate the current Supabase authentication.
   */
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  /*
   * No authenticated user.
   */
  if (userError || !user) {
    const url = request.nextUrl.clone();

    url.pathname = "/admin/login";
    url.search = "";

    url.searchParams.set(
      "redirectedFrom",
      pathname
    );

    return NextResponse.redirect(url);
  }

  /*
   * The user is authenticated.
   *
   * Check administrator authorization using
   * the SECURITY DEFINER RPC.
   *
   * This avoids the admin_users RLS problem.
   */
  const {
    data: isAdmin,
    error: adminError,
  } = await supabase.rpc("is_admin");

  /*
   * Authorization query failed.
   */
  if (adminError) {
    console.error(
      "Admin authorization RPC failed:",
      adminError
    );

    const url = request.nextUrl.clone();

    url.pathname = "/admin/login";
    url.search = "";

    url.searchParams.set(
      "access",
      "restricted"
    );

    return NextResponse.redirect(url);
  }

  /*
   * Authenticated customer attempting to access
   * an admin route.
   */
  if (isAdmin !== true) {
    console.warn(
      "Unauthorized admin access attempt:",
      {
        userId: user.id,
        email: user.email,
        pathname,
      }
    );

    const url = request.nextUrl.clone();

    url.pathname = "/admin/login";
    url.search = "";

    url.searchParams.set(
      "access",
      "restricted"
    );

    return NextResponse.redirect(url);
  }

  /*
   * Authenticated administrator.
   */
  return supabaseResponse;
}
