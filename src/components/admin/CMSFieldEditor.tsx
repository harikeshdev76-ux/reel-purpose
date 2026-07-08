"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ContentType } from "@prisma/client";

const FIELD_CLASS =
  "w-full rounded border border-[rgba(255,255,255,0.08)] bg-[#222840] px-3 py-2 text-sm text-[#f0e6d3] focus:border-[#c9a84c] focus:outline-none";

export default function CMSFieldEditor({
  contentKey,
  label,
  value: initialValue,
  type,
}: {
  contentKey: string;
  label: string;
  value: string;
  type: ContentType;
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function save() {
    setError(null);
    if (!value.trim()) {
      setError("Value cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cms/${encodeURIComponent(contentKey)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      setValue(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const isLong = initialValue.length > 100;

  return (
    <div className="px-5 py-4">
      <label className="mb-2 block font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.6)]">
        {label}
      </label>

      {type === "IMAGE" ? (
        <div>
          {value && (
            <div className="relative mb-2 h-20 w-[120px] overflow-hidden rounded border border-[rgba(201,168,76,0.2)]">
              <Image
                src={value}
                alt={label}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-condensed text-xs uppercase tracking-widest text-[#c9a84c] hover:text-[#b8952e]"
          >
            {uploading ? "Uploading…" : "Replace Image"}
          </button>
          <p className="mt-1 truncate font-mono text-xs text-[rgba(240,230,211,0.3)]">
            {value}
          </p>
        </div>
      ) : isLong ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${FIELD_CLASS} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={FIELD_CLASS}
        />
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || uploading}
          className="rounded bg-[#c9a84c] px-4 py-1.5 font-condensed text-xs font-bold uppercase tracking-widest text-[#0f1117] transition-colors hover:bg-[#b8952e] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && (
          <span className="font-condensed text-xs uppercase tracking-widest text-[#4ade80]">
            Saved ✓
          </span>
        )}
        {error && <span className="font-body text-xs text-[#f87171]">{error}</span>}
      </div>
    </div>
  );
}
