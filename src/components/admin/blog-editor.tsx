"use client";

import { useRef, useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, ImagePlus, Italic, Loader2, Underline } from "lucide-react";

export function BlogEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const savedRange = useRef<Range | null>(null);
  const [uploading, setUploading] = useState(false);

  const command = (name: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(name, false, argument);
    onChange(editorRef.current?.innerHTML || "");
  };

  const rememberSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount) savedRange.current = selection.getRangeAt(0).cloneRange();
  };

  const insertImage = (url: string) => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection && savedRange.current) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
    document.execCommand("insertImage", false, url);
    onChange(editorRef.current?.innerHTML || "");
  };

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    rememberSelection();
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/v1/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      insertImage(data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b bg-slate-50 p-2">
        <select onChange={(e) => command("fontName", e.target.value)} className="rounded-lg border bg-white px-2 py-1.5 text-xs">
          <option value="Inter">Inter</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option>
        </select>
        <select onChange={(e) => command("fontSize", e.target.value)} className="rounded-lg border bg-white px-2 py-1.5 text-xs">
          <option value="3">16px</option><option value="4">18px</option><option value="5">24px</option><option value="6">32px</option>
        </select>
        {[["bold", Bold], ["italic", Italic], ["underline", Underline], ["justifyLeft", AlignLeft], ["justifyCenter", AlignCenter], ["justifyRight", AlignRight]] .map(([name, Icon]) => {
          const ToolIcon = Icon as typeof Bold;
          return <button type="button" key={name as string} onMouseDown={(e) => e.preventDefault()} onClick={() => command(name as string)} className="rounded-lg p-2 hover:bg-slate-200"><ToolIcon className="h-4 w-4" /></button>;
        })}
        <input type="color" title="Màu chữ" onChange={(e) => command("foreColor", e.target.value)} className="h-8 w-8 cursor-pointer rounded border p-0.5" />
        <label className="cursor-pointer rounded-lg p-2 hover:bg-slate-200" title="Chèn ảnh">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          <input type="file" accept="image/*" hidden disabled={uploading} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>
      <div
        ref={(node) => {
          editorRef.current = node;
          if (node && !initializedRef.current) {
            node.innerHTML = value;
            initializedRef.current = true;
          }
        }}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const file = Array.from(e.dataTransfer.files).find((item) => item.type.startsWith("image/")); if (file) upload(file); }}
        onPaste={(e) => { const file = Array.from(e.clipboardData.files).find((item) => item.type.startsWith("image/")); if (file) { e.preventDefault(); upload(file); } }}
        className="min-h-[420px] max-w-none p-5 text-base leading-8 outline-none [&_img]:my-5 [&_img]:max-w-full [&_img]:rounded-xl"
      />
      <p className="border-t bg-blue-50 px-4 py-2 text-xs text-blue-700">Kéo ảnh vào, paste ảnh từ clipboard hoặc nhấn biểu tượng ảnh để tự động upload.</p>
    </div>
  );
}
