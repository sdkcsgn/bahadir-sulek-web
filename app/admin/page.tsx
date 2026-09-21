export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            BAHADIR SÜLEK
          </p>

          <h1 className="mt-2 text-4xl font-black text-[#07572e]">
            Yönetim Paneli
          </h1>

          <p className="mt-2 text-gray-600">
            Web sitesi içeriklerini buradan yönetebilirsiniz.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <a
            href="/admin/anasayfa"
            className="block rounded-3xl bg-[#07572e] p-6 text-white shadow-lg transition hover:scale-[1.02]"
          >
            <div className="text-3xl">🏠</div>

            <h2 className="mt-4 text-xl font-black">
              Ana Sayfa
            </h2>

            <p className="mt-2 text-sm text-white/70">
              Başlıklar, açıklamalar ve istatistikler
            </p>
          </a>

          <a
            href="/admin/urunler"
            className="block rounded-3xl bg-orange-500 p-6 text-white shadow-lg transition hover:scale-[1.02]"
          >
            <div className="text-3xl">🍊</div>

            <h2 className="mt-4 text-xl font-black">
              Ürünler
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Ürün ekle, düzenle ve kaldır
            </p>
          </a>

          <a
            href="/admin/gorseller"
            className="block rounded-3xl bg-red-600 p-6 text-white shadow-lg transition hover:scale-[1.02]"
          >
            <div className="text-3xl">🖼️</div>

            <h2 className="mt-4 text-xl font-black">
              Görseller
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Site fotoğraflarını ve galeriyi yönet
            </p>
          </a>

          <a
            href="/admin/ayarlar"
            className="block rounded-3xl bg-white p-6 shadow-lg transition hover:scale-[1.02]"
          >
            <div className="text-3xl">⚙️</div>

            <h2 className="mt-4 text-xl font-black text-[#07572e]">
              Site Ayarları
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Telefon, WhatsApp, adres ve sosyal medya
            </p>
          </a>

        </div>
      </div>
    </main>
  );
}