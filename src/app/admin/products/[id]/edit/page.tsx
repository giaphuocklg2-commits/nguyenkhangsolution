import AdminProductForm from "@/components/admin/admin-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminProductForm productId={(await params).id} />;
}
