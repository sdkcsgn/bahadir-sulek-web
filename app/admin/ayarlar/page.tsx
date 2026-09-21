"use client";

import { FormEvent, useEffect, useState } from "react";

export default function AyarlarPage() {
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/site-content", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Site ayarları alınamadı.");
        }

        const data = await response.json();

        setPhone(data.phone ?? "");
        setWhatsapp(data.whatsapp ?? "");
        setEmail(data.email ?? "");
        setAddress(data.address ?? "");
        setInstagram(data.instagram ?? "");
      } catch (error) {
        console.error(error);
        setMessage("❌ Site ayarları yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function saveSettings(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("Değişiklikler kaydediliyor...");

      const response = await fetch("/api/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          whatsapp,
          email,
          address,
          instagram,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "❌ Ayarlar kaydedilemedi."
        );
        return;
      }

      setMessage(
        "✅ Site ayarları başarıyla kaydedildi."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Ayarlar kaydedilirken bir hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-10 shadow-lg">
            <p className="font-bold text-gray-500">
              Site ayarları yükleniyor...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">

        <a
          href="/admin"
          className="mb-6 inline-block font-bold text-[#07572e]"
        >
          ← Yönetim Paneline Dön
        </a>

        <div className="rounded-3xl bg-white p-8 shadow-lg md:p-10">

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
              Bahadır Sülek
            </p>

            <h1 className="mt-2 text-4xl font-black text-[#07572e]">
              Site Ayarları
            </h1>

            <p className="mt-2 text-gray-500">
              İletişim ve sosyal medya
              bilgilerini buradan
              değiştirebilirsiniz.
            </p>
          </div>

          <form
            onSubmit={saveSettings}
            className="space-y-6"
          >

            {/* TELEFON */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                📞 Telefon
              </label>

              <input
                type="text"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="Örn: +90 532 000 00 00"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            {/* WHATSAPP */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                💬 WhatsApp
              </label>

              <input
                type="text"
                value={whatsapp}
                onChange={(event) =>
                  setWhatsapp(event.target.value)
                }
                placeholder="Örn: 905320000000"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />

              <p className="mt-2 text-sm text-gray-400">
                Ülke koduyla yazabilirsiniz.
                Örnek: 905320000000
              </p>
            </div>

            {/* E-POSTA */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                ✉️ E-posta
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Örn: info@bahadirsulek.com"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            {/* ADRES */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                📍 Adres
              </label>

              <textarea
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                rows={4}
                placeholder="Firma adresi"
                className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            {/* INSTAGRAM */}
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                📸 Instagram
              </label>

              <input
                type="text"
                value={instagram}
                onChange={(event) =>
                  setInstagram(event.target.value)
                }
                placeholder="Örn: https://instagram.com/bahadirsulek"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            {/* MESAJ */}
            {message && (
              <div className="rounded-xl bg-gray-100 p-4 font-bold text-gray-700">
                {message}
              </div>
            )}

            {/* KAYDET */}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[#07572e] px-6 py-4 font-black text-white transition hover:bg-[#064526] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Kaydediliyor..."
                : "💾 Site Ayarlarını Kaydet"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}