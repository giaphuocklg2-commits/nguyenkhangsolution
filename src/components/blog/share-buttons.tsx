"use client";

import { Link2, Share2 } from "lucide-react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const share = async () => {
    if (navigator.share) await navigator.share({ title, url });
    else await navigator.clipboard.writeText(url);
  };
  return (
    <div className="ml-auto flex items-center gap-2">
      <span className="hidden font-semibold sm:inline">Chia sẻ:</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ Facebook" className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-black text-blue-700">f</a>
      <button onClick={share} aria-label="Chia sẻ bài viết" className="rounded-lg bg-slate-100 p-2 text-slate-700"><Share2 className="h-4 w-4" /></button>
      <button onClick={() => navigator.clipboard.writeText(url)} aria-label="Sao chép liên kết" className="rounded-lg bg-slate-100 p-2 text-slate-700"><Link2 className="h-4 w-4" /></button>
    </div>
  );
}
