"use client";

import { useEffect, useState } from "react";

type SiteContent = {
  companyName: string;
  subTitle: string;
  mainTitle: string;
  description: string;
  coldRooms: number;
  storageCapacity: number;
  antalyaHal: number;
};

export default function AnaSayfaYonetimi() {
  const [form, setForm] = useState<SiteContent>({
    companyName: "",
    subTitle: "",
    mainTitle: "",
    description: "",
    coldRooms: 0,
    storageCapacity: 0,
    antalyaHal: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch("/api/site-content", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Bilgiler alınamadı.");
        }

        const data = await response.json();

        setForm({
          companyName: data.companyName ?? "",
          subTitle: data.subTitle ?? "",
          mainTitle: data.mainTitle ?? "",
          description: data.description ?? "",
          coldRooms: Number(data.coldRooms ?? 0),
          storageCapacity: Number(data.storageCapacity ?? 0),
          antalyaHal: Number(data.antalyaHal ?? 0),
        });
      } catch (error) {
        console.error(error);
        setMessage("❌ Bilgiler yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  function changeText(
    field: "companyName" | "subTitle" | "mainTitle" | "description",
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function changeNumber(
    field: "coldRooms" | "storageCapacity" | "antalyaHal",
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: Number(value),
    }));
  }

  async function saveContent() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kaydetme işlemi başarısız.");
      }

      setForm({
        companyName: data.companyName ?? "",
        subTitle: data.subTitle ?? "",
        mainTitle: data.mainTitle ?? "",
        description: data.description ?? "",
        coldRooms: Number(data.coldRooms ?? 0),
        storageCapacity: Number(data.storageCapacity ?? 0),
        antalyaHal: Number(data.antalyaHal ?? 0),
      });

      setMessage("✅ Değişiklikler başarıyla kaydedildi.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Değişiklikler kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-5xl">
          <p className="font-bold text-[#07572e]">Bilgiler yükleniyor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        <a
          href="/admin"
          className="mb-6 inline-block font-bold text-[#07572e]"
        >
          ← Yönetim Paneline Dön
        </a>

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Bahadır Sülek
          </p>

          <h1 className="mt-2 text-4xl font-black text-[#07572e]">
            Ana Sayfa Yönetimi
          </h1>

          <p className="mt-2 text-gray-600">
            Ana sayfada görünen yazıları ve istatistikleri buradan
            düzenleyebilirsiniz.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-black text-[#07572e]">
            Ana Bölüm
          </h2>

          <div className="grid gap-6">
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Firma Adı
              </label>

              <input
                type="text"
                value={form.companyName}
                onChange={(e) => changeText("companyName", e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Alt Başlık
              </label>

              <input
                type="text"
                value={form.subTitle}
                onChange={(e) => changeText("subTitle", e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Ana Başlık
              </label>

              <input
                type="text"
                value={form.mainTitle}
                onChange={(e) => changeText("mainTitle", e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Açıklama
              </label>

              <textarea
                value={form.description}
                onChange={(e) => changeText("description", e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          <h2 className="mb-6 text-2xl font-black text-[#07572e]">
            İstatistikler
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Soğuk Hava Odası
              </label>

              <input
                type="number"
                value={form.coldRooms}
                onChange={(e) => changeNumber("coldRooms", e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Toplam Depolama Kapasitesi
              </label>

              <input
                type="number"
                value={form.storageCapacity}
                onChange={(e) =>
                  changeNumber("storageCapacity", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Antalya Hal
              </label>

              <input
                type="number"
                value={form.antalyaHal}
                onChange={(e) => changeNumber("antalyaHal", e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-4"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={saveContent}
            disabled={saving}
            className="mt-8 rounded-full bg-[#07572e] px-8 py-4 font-black text-white shadow-lg transition hover:bg-[#064525] disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "💾 Değişiklikleri Kaydet"}
          </button>

          {message && (
            <div className="mt-5 rounded-xl bg-gray-100 p-4 font-bold">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}