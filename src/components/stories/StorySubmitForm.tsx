"use client";

import { useRef, useState } from "react";

const INPUT_CLASS =
  "w-full rounded border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.05)] px-4 py-2.5 font-body text-[#f0e6d3] placeholder:text-[rgba(240,230,211,0.35)] focus:border-[#c9a84c] focus:outline-none";
const LABEL_CLASS =
  "mb-1 block font-condensed text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_STORY = 1000;

export default function StorySubmitForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [story, setStory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function selectFile(f: File | null) {
    setError(null);
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!ALLOWED.includes(f.type)) {
      setError("Unsupported image type. Use JPG, PNG, or WebP.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Image too large (max 5MB).");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit() {
    setError(null);
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (story.trim().length < 20) {
      setError("Your story must be at least 20 characters.");
      return;
    }

    setStatus("submitting");
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("location", location.trim());
      fd.append("story", story.trim());
      if (file) fd.append("image", file);

      const res = await fetch("/api/stories/submit", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setSubmittedName(name.trim());
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <p className="font-display text-2xl text-[#4ade80]">
          🎣 Thank you, {submittedName}!
        </p>
        <p className="mt-3 font-body text-[rgba(240,230,211,0.7)]">
          Your story has been submitted and is pending review. We&apos;ll have
          it live soon!
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";
  const buttonLabel = submitting
    ? file
      ? "Uploading..."
      : "Submitting..."
    : "Share My Story →";

  return (
    <div className="space-y-4">
      <div>
        <label className={LABEL_CLASS}>Your Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Tampa Bay, FL"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>Your Story *</label>
        <textarea
          rows={5}
          maxLength={MAX_STORY}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Tell us about a memorable fishing experience, why you fish, or what Reel Purpose means to you..."
          className={`${INPUT_CLASS} resize-y`}
        />
        <p className="mt-1 text-right text-xs text-[rgba(240,230,211,0.4)]">
          {story.length}/{MAX_STORY}
        </p>
      </div>

      <div>
        <label className={LABEL_CLASS}>Add a Photo (optional)</label>
        {preview ? (
          <div className="relative overflow-hidden rounded border border-[rgba(201,168,76,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                selectFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute right-2 top-2 rounded bg-[rgba(13,17,23,0.8)] px-2 py-1 font-condensed text-xs uppercase text-[#f87171]"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              selectFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className={`flex w-full flex-col items-center justify-center rounded border border-dashed px-4 py-8 text-center transition-colors ${
              dragOver
                ? "border-[#c9a84c] bg-[rgba(201,168,76,0.08)]"
                : "border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            <span className="font-condensed text-sm uppercase tracking-widest text-[rgba(240,230,211,0.6)]">
              Click or drag to upload
            </span>
            <span className="mt-1 font-body text-xs text-[rgba(240,230,211,0.4)]">
              JPG, PNG, WebP — max 5MB
            </span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && <p className="text-sm text-[#f87171]">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full rounded-full bg-[#c9a84c] px-8 py-3 font-condensed font-bold uppercase tracking-widest text-[#0d1117] transition-colors hover:bg-[#b8952e] disabled:opacity-70"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
