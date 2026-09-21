"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type GalleryImage = {
  id: number;
  title: string;
  imagePath: string;
  sortOrder: number;
  active: boolean;
};

export default function GorsellerPage() {
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [currentHero, setCurrentHero] = useState<string | null>(null);

  const [heroMessage, setHeroMessage] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryMessage, setGalleryMessage] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [titleSaving, setTitleSaving] = useState(false);

  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function loadHeroImage() {
    try {
      const response = await fetch("/api/site-content", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      if (data.heroImage) {
        setCurrentHero(data.heroImage);
      }
    } catch (error) {
      console.error("Hero görseli alınamadı:", error);
    }
  }

  async function loadGalleryImages() {
    try {
      const response = await fetch("/api/gallery", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Galeri alınamadı.");
      }

      const data = await response.json();

      setGalleryImages(data);
    } catch (error) {
      console.error("Galeri yükleme hatası:", error);

      setGalleryMessage(
        "❌ Galeri görselleri yüklenemedi."
      );
    }
  }

  useEffect(() => {
    loadHeroImage();
    loadGalleryImages();
  }, []);

  function selectHeroImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir resim dosyası seçin.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Görsel en fazla 8 MB olabilir.");
      return;
    }

    setHeroFile(file);
    setHeroMessage("");

    const previewUrl = URL.createObjectURL(file);

    setHeroPreview(previewUrl);
  }

  async function saveHeroImage() {
    if (!heroFile) {
      setHeroMessage("❌ Önce bir görsel seçin.");
      return;
    }

    try {
      setHeroUploading(true);

      setHeroMessage(
        "Görsel siteye kaydediliyor..."
      );

      const formData = new FormData();

      formData.append("file", heroFile);

      const response = await fetch(
        "/api/upload/hero",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setHeroMessage(
          data.error || "❌ Görsel kaydedilemedi."
        );

        return;
      }

      setCurrentHero(data.imagePath);
      setHeroPreview(null);
      setHeroFile(null);

      if (heroInputRef.current) {
        heroInputRef.current.value = "";
      }

      setHeroMessage(
        "✅ Ana sayfa görseli başarıyla kaydedildi."
      );
    } catch (error) {
      console.error("Hero kayıt hatası:", error);

      setHeroMessage(
        "❌ Görsel yüklenirken bir hata oluştu."
      );
    } finally {
      setHeroUploading(false);
    }
  }

  function selectGalleryImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    if (selectedFiles.length === 0) return;

    const validFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 8 * 1024 * 1024
    );

    if (
      validFiles.length !== selectedFiles.length
    ) {
      alert(
        "Bazı dosyalar resim olmadığı veya 8 MB'dan büyük olduğu için seçilmedi."
      );
    }

    setGalleryFiles(validFiles);
    setGalleryMessage("");

    const previews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setGalleryPreviews(previews);
  }

  async function saveGalleryImages() {
    if (galleryFiles.length === 0) {
      setGalleryMessage(
        "❌ Önce en az bir fotoğraf seçin."
      );

      return;
    }

    try {
      setGalleryUploading(true);

      setGalleryMessage(
        `${galleryFiles.length} fotoğraf yükleniyor...`
      );

      for (const file of galleryFiles) {
        const formData = new FormData();

        formData.append("file", file);

        const title = file.name.replace(
          /\.[^/.]+$/,
          ""
        );

        formData.append("title", title);

        const response = await fetch(
          "/api/gallery",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              `${file.name} yüklenemedi.`
          );
        }
      }

      setGalleryFiles([]);
      setGalleryPreviews([]);

      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }

      await loadGalleryImages();

      setGalleryMessage(
        "✅ Tesis fotoğrafları başarıyla kaydedildi."
      );
    } catch (error) {
      console.error(
        "Galeri kayıt hatası:",
        error
      );

      setGalleryMessage(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Fotoğraflar yüklenirken hata oluştu."
      );
    } finally {
      setGalleryUploading(false);
    }
  }

  function startEditing(image: GalleryImage) {
    setEditingId(image.id);
    setEditingTitle(image.title || "");
    setGalleryMessage("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function saveGalleryTitle(id: number) {
    try {
      setTitleSaving(true);

      const response = await fetch(
        "/api/gallery",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id,
            title: editingTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setGalleryMessage(
          data.error ||
            "❌ Başlık güncellenemedi."
        );

        return;
      }

      await loadGalleryImages();

      setEditingId(null);
      setEditingTitle("");

      setGalleryMessage(
        "✅ Fotoğraf başlığı başarıyla güncellendi."
      );
    } catch (error) {
      console.error(
        "Başlık güncelleme hatası:",
        error
      );

      setGalleryMessage(
        "❌ Başlık güncellenirken hata oluştu."
      );
    } finally {
      setTitleSaving(false);
    }
  }

  async function deleteGalleryImage(
    id: number
  ) {
    const approved = window.confirm(
      "Bu fotoğrafı silmek istediğinize emin misiniz?"
    );

    if (!approved) return;

    try {
      setGalleryMessage(
        "Fotoğraf siliniyor..."
      );

      const response = await fetch(
        "/api/gallery",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setGalleryMessage(
          data.error ||
            "❌ Fotoğraf silinemedi."
        );

        return;
      }

      await loadGalleryImages();

      setGalleryMessage(
        "✅ Fotoğraf başarıyla silindi."
      );
    } catch (error) {
      console.error(
        "Fotoğraf silme hatası:",
        error
      );

      setGalleryMessage(
        "❌ Fotoğraf silinirken hata oluştu."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
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
            Görsel Yönetimi
          </h1>

          <p className="mt-2 text-gray-600">
            Site üzerindeki fotoğrafları ve
            görselleri buradan
            değiştirebilirsiniz.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-5xl">
              🏠
            </div>

            <h2 className="text-2xl font-black text-[#07572e]">
              Ana Sayfa Görseli
            </h2>

            <p className="mt-2 text-gray-500">
              Ana sayfadaki büyük görseli
              değiştir.
            </p>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center">
              {heroPreview ? (
                <>
                  <p className="mb-3 font-bold text-orange-500">
                    Yeni seçilen görsel
                  </p>

                  <img
                    src={heroPreview}
                    alt="Yeni seçilen görsel"
                    className="mx-auto max-h-[260px] w-full rounded-2xl object-contain"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    {heroFile?.name}
                  </p>
                </>
              ) : currentHero ? (
                <>
                  <p className="mb-3 font-bold text-[#07572e]">
                    Şu anda kullanılan görsel
                  </p>

                  <img
                    src={currentHero}
                    alt="Mevcut ana sayfa görseli"
                    className="mx-auto max-h-[260px] w-full rounded-2xl object-contain"
                  />
                </>
              ) : (
                <p className="font-bold text-gray-500">
                  Henüz görsel bulunamadı
                </p>
              )}

              <input
                ref={heroInputRef}
                type="file"
                accept="image/*"
                onChange={selectHeroImage}
                className="hidden"
              />

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    heroInputRef.current?.click()
                  }
                  className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white"
                >
                  📷 Görsel Seç
                </button>

                {heroFile && (
                  <button
                    type="button"
                    onClick={saveHeroImage}
                    disabled={heroUploading}
                    className="rounded-full bg-[#07572e] px-6 py-3 font-bold text-white disabled:opacity-50"
                  >
                    {heroUploading
                      ? "Kaydediliyor..."
                      : "💾 Siteye Kaydet"}
                  </button>
                )}
              </div>

              {heroMessage && (
                <div className="mt-5 rounded-xl bg-gray-100 p-4 font-bold">
                  {heroMessage}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-5xl">
              🏢
            </div>

            <h2 className="text-2xl font-black text-[#07572e]">
              Tesis Görselleri
            </h2>

            <p className="mt-2 text-gray-500">
              Soğuk hava deposu ve paketleme
              tesisi fotoğraflarını yönet.
            </p>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center">
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={
                  selectGalleryImages
                }
                className="hidden"
              />

              {galleryPreviews.length ===
              0 ? (
                <p className="font-bold text-gray-500">
                  Bir veya birden fazla
                  fotoğraf seçebilirsiniz.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {galleryPreviews.map(
                    (preview, index) => (
                      <img
                        key={preview}
                        src={preview}
                        alt={`Seçilen fotoğraf ${
                          index + 1
                        }`}
                        className="h-32 w-full rounded-xl object-cover"
                      />
                    )
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    galleryInputRef.current?.click()
                  }
                  className="rounded-full bg-[#07572e] px-6 py-3 font-bold text-white"
                >
                  🖼️ Fotoğraf Ekle
                </button>

                {galleryFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={
                      saveGalleryImages
                    }
                    disabled={
                      galleryUploading
                    }
                    className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white disabled:opacity-50"
                  >
                    {galleryUploading
                      ? "Yükleniyor..."
                      : `💾 ${galleryFiles.length} Fotoğrafı Kaydet`}
                  </button>
                )}
              </div>

              {galleryMessage && (
                <div className="mt-5 rounded-xl bg-gray-100 p-4 font-bold">
                  {galleryMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-black text-[#07572e]">
            Kayıtlı Tesis Fotoğrafları
          </h2>

          {galleryImages.length === 0 ? (
            <p className="text-gray-500">
              Henüz tesis fotoğrafı eklenmedi.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {galleryImages.map(
                (image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <img
                      src={image.imagePath}
                      alt={
                        image.title ||
                        "Tesis görseli"
                      }
                      className="h-52 w-full object-cover"
                    />

                    <div className="p-4">
                      {editingId === image.id ? (
                        <>
                          <label className="mb-2 block text-sm font-bold text-gray-600">
                            Fotoğraf Başlığı
                          </label>

                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(event) =>
                              setEditingTitle(
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
                            placeholder="Örn: Meyve Paketleme Hattımız"
                          />

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                saveGalleryTitle(
                                  image.id
                                )
                              }
                              disabled={titleSaving}
                              className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white disabled:opacity-50"
                            >
                              {titleSaving
                                ? "Kaydediliyor..."
                                : "💾 Kaydet"}
                            </button>

                            <button
                              type="button"
                              onClick={
                                cancelEditing
                              }
                              className="rounded-full bg-gray-200 px-5 py-2 font-bold text-gray-700"
                            >
                              İptal
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-[#07572e]">
                            {image.title ||
                              "Tesis Fotoğrafı"}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                startEditing(
                                  image
                                )
                              }
                              className="rounded-full bg-[#07572e] px-5 py-2 font-bold text-white transition hover:bg-[#064525]"
                            >
                              ✏️ Düzenle
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteGalleryImage(
                                  image.id
                                )
                              }
                              className="rounded-full bg-red-600 px-5 py-2 font-bold text-white transition hover:bg-red-700"
                            >
                              🗑️ Sil
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}