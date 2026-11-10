import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: NextRequest) {
  try {
    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Authentication is required.",
        },
        {
          status: 401,
        }
      );
    }

    const accessToken =
      authorization.replace(
        "Bearer ",
        ""
      ).trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Authentication token is missing.",
        },
        {
          status: 401,
        }
      );
    }

    const supabaseAdmin =
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    /*
     * Verify the currently authenticated user.
     */

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(
        accessToken
      );

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "Your session is invalid or has expired.",
        },
        {
          status: 401,
        }
      );
    }

    const userId = user.id;

    /*
     * Find the customer record.
     *
     * We retain the customer/order relationship so
     * existing orders are not broken.
     */

    const {
      data: customer,
      error: customerLookupError,
    } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (customerLookupError) {
      return NextResponse.json(
        {
          error:
            customerLookupError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Remove the authentication link from the
     * customer record first.
     *
     * Existing orders can continue referencing
     * customers.id.
     */

    if (customer?.id) {
      const {
        error: unlinkError,
      } = await supabaseAdmin
        .from("customers")
        .update({
          user_id: null,
          is_active: false,
        })
        .eq(
          "id",
          customer.id
        );

      if (unlinkError) {
        return NextResponse.json(
          {
            error:
              unlinkError.message,
          },
          {
            status: 500,
          }
        );
      }
    }

    /*
     * Remove customer-specific saved data.
     */

    const {
      error: addressDeleteError,
    } = await supabaseAdmin
      .from("customer_addresses")
      .delete()
      .eq(
        "user_id",
        userId
      );

    if (addressDeleteError) {
      return NextResponse.json(
        {
          error:
            addressDeleteError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Remove the customer profile.
     */

    const {
      error: profileDeleteError,
    } = await supabaseAdmin
      .from("customer_profiles")
      .delete()
      .eq(
        "id",
        userId
      );

    if (profileDeleteError) {
      return NextResponse.json(
        {
          error:
            profileDeleteError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Finally permanently delete the Supabase
     * authentication account.
     */

    const {
      error: deleteUserError,
    } =
      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

    if (deleteUserError) {
      return NextResponse.json(
        {
          error:
            deleteUserError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Your account has been permanently deleted.",
    });
  } catch (error) {
    console.error(
      "Delete customer account error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete your account.",
      },
      {
        status: 500,
      }
    );
  }
}