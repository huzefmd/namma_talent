"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, BENGALURU_AREAS } from "@/lib/constants";
import type { Talent } from "@/lib/types";

export default function ProfileEditClient() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    name: string;
    category: string;
    location: string;
    bio: string;
    price_range: string;
    contact_phone: string;
  }>({
    name: "",
    category: CATEGORIES[0].slug,
    location: BENGALURU_AREAS[0],
    bio: "",
    price_range: "",
    contact_phone: "",
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login");
        return;
      }
      setUserId(auth.user.id);

      const { data: talent } = await supabase
        .from("talents")
        .select("*")
        .eq("user_id", auth.user.id)
        .maybeSingle();

      if (talent) {
        const t = talent as Talent;
        setForm({
          name: t.name ?? "",
          category: t.category ?? CATEGORIES[0].slug,
          location: t.location ?? BENGALURU_AREAS[0],
          bio: t.bio ?? "",
          price_range: t.price_range ?? "",
          contact_phone: t.contact_phone ?? "",
        });
        setImages(t.portfolio_images ?? []);
      }
      setLoading(false);
    })();
  }, [router, supabase]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!userId || !e.target.files?.length) return;
    setUploading(true);
    setError(null);

    const uploaded: string[] = [];
    for (const file of Array.from(e.target.files)) {
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(path, file);

      if (uploadError) {
        setError(`Couldn't upload ${file.name}: ${uploadError.message}`);
        continue;
      }
      const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError(null);

    const { error: saveError } = await supabase
      .from("talents")
      .update({ ...form, portfolio_images: images })
      .eq("user_id", userId);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    router.push("/lister/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-mist">
        <p className="mx-auto max-w-2xl px-5 py-16 text-ink/50">Loading your profile…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mist">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Your talent profile
        </h1>
        <p className="mt-2 text-sm text-ink/50">
          This is what buyers see. Fill it in fully — profiles with photos and a
          clear price range get more contacts.
        </p>

        <form onSubmit={handleSave} className="mt-7 flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <div>
            <label className="text-sm font-semibold text-ink/70">Display name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ananya Rao Photography"
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-ink/70">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/70">Area</label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
              >
                {BENGALURU_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/70">Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell buyers what you do and what makes your work stand out."
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-ink/70">Price range</label>
              <input
                value={form.price_range}
                onChange={(e) => setForm({ ...form, price_range: e.target.value })}
                placeholder="e.g. ₹5,000 – ₹15,000"
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/70">Contact phone</label>
              <input
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-mist px-4 py-3 text-sm focus:border-brand focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/70">Portfolio images</label>
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((url) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-mist">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Portfolio item" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-1 top-1 rounded-full bg-ink/70 px-2 py-0.5 text-xs font-semibold text-white opacity-0 group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand/30 text-xs font-bold text-brand hover:bg-brand-50">
                {uploading ? "Uploading…" : "+ Add photos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-pop transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </main>
  );
}