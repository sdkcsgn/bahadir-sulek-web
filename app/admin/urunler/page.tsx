"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  active: boolean;
};

export default function UrunlerPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadProducts() {
    try {
      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Ürünler alınamadı.");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Ürünler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function clearForm() {
    setName("");
    setCategory("");
    setDescription("");
    setEditingId(null);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setDescription(product.description);
    setMessage("✏️ Düzenleme modu açıldı.");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage(
      editingId ? "Güncelleniyor..." : "Kaydediliyor..."
    );

    try {
      const response = await fetch("/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          name,
          category,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            (editingId
              ? "Ürün güncellenemedi."
              : "Ürün kaydedilemedi.")
        );
        return;
      }

      setMessage(
        editingId
          ? "✅ Ürün başarıyla güncellendi."
          : "✅ Ürün başarıyla kaydedildi."
      );

      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      setMessage("❌ İşlem sırasında hata oluştu.");
    }
  }

  async function deleteProduct(id: number, productName: string) {
    const approved = window.confirm(
      `${productName} ürününü silmek istediğinize emin misiniz?`
    );

    if (!approved) {
      return;
    }

    try {
      setMessage("Siliniyor...");

      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Ürün silinemedi.");
        return;
      }

      if (editingId === id) {
        clearForm();
      }

      setMessage("✅ Ürün başarıyla silindi.");
      await loadProducts();
    } catch (error) {
      console.error(error);
      setMessage("❌ Ürün silinirken hata oluştu.");
    }
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
            BAHADIR SÜLEK
          </p>

          <h1 className="mt-2 text-4xl font-black text-[#07572e]">
            Ürün Yönetimi
          </h1>

          <p className="mt-2 text-gray-600">
            Ürünlerinizi buradan ekleyebilir, düzenleyebilir ve
            silebilirsiniz.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-black text-[#07572e]">
            {editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Ürün Adı
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Örn: Portakal"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Kategori
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="Örn: Narenciye"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Açıklama
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="Ürün hakkında kısa açıklama..."
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-orange-500 px-8 py-4 font-black text-white shadow-lg transition hover:bg-orange-600"
              >
                {editingId
                  ? "💾 Değişiklikleri Kaydet"
                  : "🍊 Ürünü Kaydet"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    clearForm();
                    setMessage("Düzenleme iptal edildi.");
                  }}
                  className="rounded-full bg-gray-200 px-8 py-4 font-black text-gray-700"
                >
                  İptal
                </button>
              )}
            </div>

            {message && (
              <div className="rounded-xl bg-gray-100 p-4 font-bold">
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-black text-[#07572e]">
            Kayıtlı Ürünler
          </h2>

          {loading ? (
            <p>Ürünler yükleniyor...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">
              Henüz kayıtlı ürün bulunmuyor.
            </p>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                      <h3 className="text-xl font-black text-[#07572e]">
                        🍊 {product.name}
                      </h3>

                      <p className="mt-1 font-bold text-orange-500">
                        {product.category}
                      </p>

                      <p className="mt-3 text-gray-600">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="rounded-full bg-[#07572e] px-5 py-3 font-bold text-white"
                      >
                        ✏️ Düzenle
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(product.id, product.name)
                        }
                        className="rounded-full bg-red-600 px-5 py-3 font-bold text-white"
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}