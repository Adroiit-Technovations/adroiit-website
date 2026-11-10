
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/login";

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Redirect unauthenticated visitors to login.
  if (userError || !user) {
    if (isLoginPage) {
      return supabaseResponse;
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";

    const requestedPath = pathname + request.nextUrl.search;

    loginUrl.searchParams.set("redirectedFrom", requestedPath);

    return redirectPreservingCookies(loginUrl, supabaseResponse);
  }

  // Verify administrator authorization.
  const {
    data: isAdmin,
    error: adminError,
  } = await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    if (adminError) {
      console.error("Administrator authorization failed:", adminError);
    } else {
      console.warn("Unauthorized admin access attempt:", {
        userId: user.id,
        pathname,
      });
    }

    if (isLoginPage) {
      return supabaseResponse;
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("access", "restricted");

    return redirectPreservingCookies(loginUrl, supabaseResponse);
  }

  // Authenticated administrators visiting login go to Store Overview.
  if (isLoginPage) {
    const storeUrl = request.nextUrl.clone();
    storeUrl.pathname = "/store";
    storeUrl.search = "";

    return redirectPreservingCookies(storeUrl, supabaseResponse);
  }

  // The admin root URL also opens Store Overview.
  if (pathname === "/") {
    const storeUrl = request.nextUrl.clone();
    storeUrl.pathname = "/store";
    storeUrl.search = "";

    return redirectPreservingCookies(storeUrl, supabaseResponse);
  }

  return supabaseResponse;
}

function redirectPreservingCookies(
  url: URL,
  sourceResponse: NextResponse
) {
  const redirectResponse = NextResponse.redirect(url);

  sourceResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}
