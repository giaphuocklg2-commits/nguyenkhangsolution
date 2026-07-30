"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogEditor } from "./blog-editor";
import { useToast } from "@/components/providers/toast-provider";

type Form = { title: string; slug: string; excerpt: string; content: string; featuredImage: string; authorName: string; status: string };
const empty: Form = { title: "", slug: "", excerpt: "", content: "", featuredImage: "", authorName: "NKS Electric", status: "DRAFT" };

export function BlogPostForm({ postId }: { postId?: string }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(postId));
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/v1/admin/blog/${postId}`).then((r) => r.json()).then((data) => {
      if (data.success) setForm({ ...data.data, featuredImage: data.data.featuredImage || "" });
    }).finally(() => setLoading(false));
  }, [postId]);

  const uploadCover = async (file: File) => {
    const body = new FormData(); body.append("file", file);
    const response = await fetch("/api/v1/upload", { method: "POST", body });
    const data = await response.json();
    if (data.success) setForm((current) => ({ ...current, featuredImage: data.url }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true);
    try {
      const response = await fetch(postId ? `/api/v1/admin/blog/${postId}` : "/api/v1/admin/blog", {
        method: postId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      toast({ title: postId ? "Đã cập nhật bài viết" : "Đã tạo bài viết", variant: "success" });
      router.push("/admin/blog"); router.refresh();
    } catch (error) {
      toast({ title: "Không thể lưu", description: error instanceof Error ? error.message : "Có lỗi xảy ra", variant: "error" });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="py-20 text-center text-slate-500">Đang tải bài viết...</div>;
  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-black">{postId ? "Chỉnh sửa bài viết" : "Thêm bài viết"}</h1><p className="text-sm text-slate-500">Soạn nội dung chuẩn SEO cho trang tin tức.</p></div><button disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "Đang lưu..." : "Lưu bài viết"}</button></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5 rounded-2xl border bg-white p-6">
          <label className="block text-sm font-bold">Tiêu đề<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full rounded-xl border p-3 font-normal" /></label>
          <label className="block text-sm font-bold">Slug URL<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Tự tạo từ tiêu đề nếu để trống" className="mt-2 w-full rounded-xl border p-3 font-normal" /></label>
          <label className="block text-sm font-bold">Mô tả ngắn / Meta description<textarea required maxLength={300} rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="mt-2 w-full resize-none rounded-xl border p-3 font-normal" /></label>
          <div><p className="mb-2 text-sm font-bold">Nội dung bài viết</p><BlogEditor value={form.content} onChange={(content) => setForm((current) => ({ ...current, content }))} /></div>
        </div>
        <aside className="space-y-5">
          <div className="space-y-4 rounded-2xl border bg-white p-5">
            <label className="block text-sm font-bold">Trạng thái<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-2 w-full rounded-xl border p-3 font-normal"><option value="DRAFT">Bản nháp</option><option value="PUBLISHED">Xuất bản</option></select></label>
            <label className="block text-sm font-bold">Tác giả<input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="mt-2 w-full rounded-xl border p-3 font-normal" /></label>
          </div>
          <div className="rounded-2xl border bg-white p-5"><p className="mb-3 text-sm font-bold">Ảnh đại diện</p>{form.featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.featuredImage} alt="" className="mb-3 aspect-video w-full rounded-xl object-cover" />
          )}<label className="block cursor-pointer rounded-xl border-2 border-dashed p-5 text-center text-sm text-slate-500">Chọn hoặc kéo ảnh<input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])} /></label></div>
        </aside>
      </div>
    </form>
  );
}
