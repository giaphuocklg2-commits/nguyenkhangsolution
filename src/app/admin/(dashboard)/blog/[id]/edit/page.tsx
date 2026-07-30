import { BlogPostForm } from "@/components/admin/blog-post-form";
export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  return <BlogPostForm postId={(await params).id} />;
}
