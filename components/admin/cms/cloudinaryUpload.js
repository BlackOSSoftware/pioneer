"use client";

export async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Upload failed");
  }
  return data.url;
}
