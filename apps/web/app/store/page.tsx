import StoreClient from "./StoreClient";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const supabase = await createClient();

  const [
    categoriesResponse,
    productsResponse,
    imagesResponse,
  ] = await Promise.all([
    supabase
      .from("categories")
      .select(
        "id,name,slug,description,image_url,is_active,sort_order"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),

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

  const initialError =
    categoriesResponse.error?.message ??
    productsResponse.error?.message ??
    imagesResponse.error?.message ??
    null;

  const initialCategories = categoriesResponse.data ?? [];
  const initialProducts = productsResponse.data ?? [];
  const initialProductImages = imagesResponse.data ?? [];

  return (
    <div className="min-h-screen w-full">
      <StoreClient
        initialCategories={initialCategories}
        initialProducts={initialProducts}
        initialProductImages={initialProductImages}
        initialError={initialError}
      />
    </div>
  );
}