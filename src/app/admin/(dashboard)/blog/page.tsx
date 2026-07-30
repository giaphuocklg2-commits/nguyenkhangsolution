"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, FileText, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

type Post = { id: string; title: string; slug: string; status: string; authorName: string; updatedAt: string };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await fetch("/api/v1/admin/blog").then((r) => r.json()); if (data.success) setPosts(data.data); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Xóa vĩnh viễn bài viết này?")) return;
    const response = await fetch(`/api/v1/admin/blog/${id}`, { method: "DELETE" });
    if (response.ok) { toast({ title: "Đã xóa bài viết", variant: "success" }); await load(); }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-6">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-3 text-blue-600"><FileText className="h-5 w-5" /></span><div><h1 className="text-xl font-black">Quản trị Blog</h1><p className="text-xs text-slate-500">Quản lý nội dung hiển thị tại /tin-tuc</p></div></div>
        <Link href="/admin/blog/new" className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Thêm bài viết</Link>
      </header>
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Bài viết</th><th className="p-4">Tác giả</th><th className="p-4">Trạng thái</th><th className="p-4">Cập nhật</th><th className="p-4 text-right">Thao tác</th></tr></thead>
          <tbody className="divide-y">{loading ? <tr><td colSpan={5} className="p-12 text-center">Đang tải...</td></tr> : posts.length === 0 ? <tr><td colSpan={5} className="p-12 text-center text-slate-400">Chưa có bài viết</td></tr> : posts.map((post) => <tr key={post.id} className="hover:bg-slate-50"><td className="p-4"><p className="font-bold">{post.title}</p><p className="text-xs text-slate-400">/{post.slug}</p></td><td className="p-4">{post.authorName}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${post.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{post.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}</span></td><td className="p-4 text-slate-500">{new Date(post.updatedAt).toLocaleDateString("vi-VN")}</td><td className="p-4"><div className="flex justify-end gap-2"><Link href={`/admin/blog/${post.id}/edit`} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Edit3 className="h-4 w-4" /></Link><button onClick={() => remove(post.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
}
