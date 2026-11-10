import { createClient } from "@/lib/supabase/server";
import WishlistClient from "./WishlistClient";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const supabase = await createClient();

  const [productsResponse, imagesResponse] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          "id,name,slug,sku,category_id,short_description,description,price,compare_at_price,stock_quantity,low_stock_threshold,is_active,is_featured,sort_order"
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),

      supabase
        .from("product_images")
        .select(
          "id,product_id,image_url,alt_text,sort_order"
        )
        .order("sort_order", { ascending: true }),
    ]);

  return (
    <WishlistClient
      initialProducts={productsResponse.data ?? []}
      initialProductImages={imagesResponse.data ?? []}
      initialError={
        productsResponse.error?.message ??
        imagesResponse.error?.message ??
        null
      }
    />
  );
}