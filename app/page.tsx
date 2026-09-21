import { prisma } from "@/prisma/lib/prisma";
import { connection } from "next/server";

export default async function Home() {
  await connection();

  const siteContent = await prisma.siteContent.findFirst();

  const galleryImages = await prisma.galleryImage.findMany({
    where: {
      active: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        id: "desc",
      },
    ],
    take: 9,
  });

  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const companyName =
    siteContent?.companyName ?? "BAHADIR SÜLEK";

  const subTitle =
    siteContent?.subTitle ??
    "SOĞUK HAVA & MEYVE PAKETLEME DEPOSU";

  const mainTitle =
    siteContent?.mainTitle ??
    "Doğadan Sofranıza Güvenle.";

  const description =
    siteContent?.description ??
    "Meyvelerinizi modern soğuk hava depolarımızda özenle muhafaza ediyor, işleme ve paketleme hattımızda sevkiyata hazır hale getiriyoruz.";

  const coldRooms =
    siteContent?.coldRooms ?? 7;

  const storageCapacity =
    siteContent?.storageCapacity ?? 200;

  const antalyaHal =
    siteContent?.antalyaHal ?? 59;

  const heroImage =
    siteContent?.heroImage ??
    "/images/meyveler.png";

  const phone =
    siteContent?.phone ?? "";

  const whatsapp =
    siteContent?.whatsapp ?? "";

  const email =
    siteContent?.email ?? "";

  const address =
    siteContent?.address ??
    "Çandır Mahallesi, Çandır Bulvarı No:19 - Serik / Antalya";

  const instagram =
    siteContent?.instagram ?? "";

  const whatsappNumber =
    whatsapp.replace(/\D/g, "");

  const whatsappMessage =
    encodeURIComponent(
      "Merhaba, Bahadır Sülek Soğuk Hava ve Meyve Paketleme hakkında bilgi almak istiyorum."
    );

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : "#iletisim";

  const teklifMailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        "Teklif Talebi - Bahadır Sülek"
      )}&body=${encodeURIComponent(
        `Merhaba,

Ürünleriniz ve hizmetleriniz hakkında teklif almak istiyorum.

Firma / Ad Soyad:
Telefon:
E-posta:
Talep edilen ürün veya hizmet:
Miktar:
Teslimat / Sevkiyat bilgisi:

Teşekkürler.`
      )}`
    : "#iletisim";

  return (
    <main className="min-h-screen bg-white text-slate-950">

      {/* ÜST İLETİŞİM ŞERİDİ */}
      <div className="bg-[#07572e] text-white">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-6 py-2 text-[13px] font-semibold">

          <div>
            📍 {address}
          </div>

          <div className="hidden items-center gap-6 md:flex">

            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="transition hover:text-orange-300"
              >
                📞 {phone}
              </a>
            )}

            {whatsappNumber && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-orange-300"
              >
                WhatsApp
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="transition hover:text-orange-300"
              >
                ✉️ {email}
              </a>
            )}

            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-orange-300"
              >
                Instagram
              </a>
            )}

            <span>TR⌄</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="relative z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1250px] items-center justify-between gap-4 px-6 py-3">

          <a
            href="#anasayfa"
            className="shrink-0"
          >
            <img
              src="/images/bs_logo.png"
              alt="Bahadır Sülek"
              className="h-[115px] w-auto object-contain"
            />
          </a>

          <nav className="hidden items-center gap-7 text-[14px] font-bold xl:flex">

            <a
              href="#anasayfa"
              className="border-b-2 border-[#d71920] pb-2 text-[#d71920]"
            >
              Ana Sayfa
            </a>

            <a
              href="#kurumsal"
              className="transition hover:text-[#d71920]"
            >
              Kurumsal
            </a>

            <a
              href="#tesis"
              className="transition hover:text-[#d71920]"
            >
              Tesisimiz
            </a>

            <a
              href="#urunler"
              className="transition hover:text-[#d71920]"
            >
              Ürünlerimiz
            </a>

            <a
              href="#paketleme"
              className="transition hover:text-[#d71920]"
            >
              Paketleme
            </a>

            <a
              href="#galeri"
              className="transition hover:text-[#d71920]"
            >
              Galeri
            </a>

            <a
              href="#iletisim"
              className="transition hover:text-[#d71920]"
            >
              İletişim
            </a>
          </nav>

          {/* TEKLİF AL - DOĞRUDAN E-POSTA */}
          <a
            href={teklifMailLink}
            className="rounded-full bg-[#d71920] px-7 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#b90f18]"
          >
            📄 TEKLİF AL
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        id="anasayfa"
        className="relative isolate bg-[#064d29]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,174,0,.22),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(65,180,75,.25),transparent_35%)]" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#064425] via-[#075b30]/95 to-[#124b24]/80" />

        <div className="relative mx-auto grid min-h-[690px] max-w-[1450px] grid-cols-1 items-center gap-10 px-6 pb-28 pt-14 lg:grid-cols-[1.15fr_.85fr]">

          {/* SOL */}
          <div className="relative z-10">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur">
              🍊 {antalyaHal} Antalya Hal
            </div>

            <h1 className="text-[48px] font-black leading-[0.95] tracking-tight text-white sm:text-[65px] lg:text-[76px]">
              <span
                className="block text-[#d71920]"
                style={{
                  textShadow:
                    "0 0 3px white, 0 0 8px rgba(255,255,255,.9), 0 5px 12px rgba(0,0,0,.25)",
                }}
              >
                {companyName}
              </span>
            </h1>

            <div className="mt-4 text-xl font-black text-white md:text-2xl">
              {subTitle}
            </div>

            <div className="mt-9 border-l-4 border-orange-400 pl-6">
              <h2 className="text-5xl font-black leading-[1.03] text-white md:text-6xl">

                {mainTitle
                  .replace(
                    "Sofranıza Güvenle.",
                    ""
                  )
                  .trim()}

                <span className="block text-[#ff9800]">
                  {mainTitle.includes("Sofranıza")
                    ? "Sofranıza Güvenle."
                    : ""}
                </span>

              </h2>
            </div>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/90">
              {description}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#tesis"
                className="rounded-full bg-[#ff7a00] px-8 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#ff8c1a]"
              >
                ❄ Tesisimizi Keşfedin →
              </a>

              <a
                href={whatsappLink}
                target={whatsappNumber ? "_blank" : undefined}
                rel={whatsappNumber ? "noopener noreferrer" : undefined}
                className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                ☎ Bize Ulaşın
              </a>

            </div>
          </div>

          {/* SAĞ HERO KARTI */}
          <div className="relative z-10 hidden lg:block">

            <div className="relative min-h-[480px] overflow-hidden rounded-[65px_65px_65px_180px] border-[4px] border-[#ff8a00] bg-gradient-to-br from-[#ffa000] via-[#ff7600] to-[#ed4a00] shadow-2xl">

              <<div className="absolute left-[15px] top-[95px] flex w-[60%] items-center justify-center">
  <img
    src={heroImage}
    alt="Bahadır Sülek meyve ve tesis görseli"
    className="w-full max-w-[430px] object-contain drop-shadow-2xl"
  />
</div>

              <div className="absolute inset-y-0 right-0 w-[42%] bg-gradient-to-l from-[#ef4b00] via-[#f45d00]/95 to-transparent" />

              <div className="absolute left-[50%] top-10 w-[360px] text-white">

                <h3 className="whitespace-nowrap text-[24px] font-black leading-tight">
                  Tazelik. Kalite. Güven.
                </h3>

                <div className="my-5 h-[2px] w-10 bg-white" />

                <div className="ml-[70px] space-y-3 text-base font-semibold">

                  <div className="flex items-center gap-4">
                    <span className="text-3xl">❄</span>
                    Soğuk Depolama
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl">⚙</span>
                    Meyve İşleme
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl">📦</span>
                    Paketleme
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🚚</span>
                    Sevkiyat
                  </div>

                </div>

                <div className="ml-[70px] mt-6 rotate-[-4deg] text-xl italic leading-tight">
                  Doğal Lezzet
                  <br />
                  Her Zaman
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* İSTATİSTİKLER */}
        <div className="absolute bottom-[-75px] left-1/2 z-30 w-[min(1200px,90%)] -translate-x-1/2">

          <div className="grid overflow-hidden rounded-[30px] bg-white shadow-2xl md:grid-cols-3">

            <div className="flex items-center justify-center gap-6 px-8 py-7">
              <div className="text-4xl text-[#07572e]">
                ❄
              </div>

              <div className="text-center">
                <div className="text-5xl font-black text-[#d71920]">
                  {coldRooms}
                </div>

                <div className="mt-1 font-black text-[#07572e]">
                  Soğuk Hava Odası
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 border-y border-gray-200 px-8 py-7 md:border-x md:border-y-0">

              <div className="text-4xl">
                ▤
              </div>

              <div className="text-center">
                <div className="text-5xl font-black text-[#d71920]">
                  {storageCapacity}
                </div>

                <div className="mt-1 font-black text-[#07572e]">
                  Ton Toplam Depolama Kapasitesi
                </div>
              </div>

            </div>

            <div className="flex items-center justify-center gap-6 px-8 py-7">

              <div className="text-4xl text-[#07572e]">
                ⌖
              </div>

              <div className="text-center">
                <div className="text-5xl font-black text-[#d71920]">
                  {antalyaHal}
                </div>

                <div className="mt-1 font-black text-[#07572e]">
                  Antalya Hal
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* KURUMSAL */}
      <section
        id="kurumsal"
        className="mx-auto max-w-[1300px] px-6 pb-24 pt-44"
      >
        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div>

            <div className="font-black uppercase tracking-[.25em] text-[#ff7a00]">
              Bahadır Sülek
            </div>

            <h2 className="mt-4 text-4xl font-black leading-tight text-[#092d1c] md:text-5xl">
              Tazeliği koruyan
              <span className="block text-[#0b6536]">
                güçlü altyapı.
              </span>
            </h2>

            <p className="mt-7 text-lg leading-8 text-gray-600">
              Antalya Serik&apos;te bulunan tesisimizde
              meyvelerin depolanması, işlenmesi,
              paketlenmesi ve sevkiyata hazırlanması
              süreçlerini titizlikle yürütüyoruz.
            </p>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              {coldRooms} ayrı soğuk hava odamızda toplam{" "}
              {storageCapacity} ton depolama kapasitesi
              sunuyor, modern meyve işleme ve paketleme
              hattımızla ürünleri sevkiyata hazırlıyoruz.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-5">

            <div className="rounded-3xl bg-[#07572e] p-8 text-white">
              <div className="text-4xl">❄️</div>
              <h3 className="mt-12 text-xl font-black">
                Soğuk Hava
              </h3>
              <p className="mt-2 text-white/70">
                Kontrollü muhafaza ve depolama.
              </p>
            </div>

            <div className="mt-10 rounded-3xl bg-[#ff7900] p-8 text-white">
              <div className="text-4xl">🍊</div>
              <h3 className="mt-12 text-xl font-black">
                Meyve İşleme
              </h3>
              <p className="mt-2 text-white/80">
                Modern işleme altyapısı.
              </p>
            </div>

            <div className="-mt-10 rounded-3xl bg-[#c91520] p-8 text-white">
              <div className="text-4xl">📦</div>
              <h3 className="mt-12 text-xl font-black">
                Paketleme
              </h3>
              <p className="mt-2 text-white/75">
                Özenli ürün hazırlama.
              </p>
            </div>

            <div className="rounded-3xl bg-[#f3f5f2] p-8 text-[#07572e]">
              <div className="text-4xl">🚚</div>
              <h3 className="mt-12 text-xl font-black">
                Sevkiyat
              </h3>
              <p className="mt-2 text-gray-500">
                Sevkiyata hazır ürünler.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ÜRÜNLER */}
      <section
        id="urunler"
        className="bg-[#f6f7f2] py-24"
      >
        <div className="mx-auto max-w-[1300px] px-6">

          <div className="text-center">

            <div className="font-black uppercase tracking-[.25em] text-[#ff7a00]">
              Ürünlerimiz
            </div>

            <h2 className="mt-4 text-4xl font-black text-[#092d1c] md:text-5xl">
              Doğanın tazeliğini işliyoruz.
            </h2>

          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-[30px] bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="text-6xl">
                    🍊
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-[#07572e]">
                    {product.name}
                  </h3>

                  <div className="mt-2 font-bold text-orange-500">
                    {product.category}
                  </div>

                  <p className="mt-4 leading-7 text-gray-500">
                    {product.description}
                  </p>

                </div>
              ))
            ) : (
              <div className="col-span-full rounded-[30px] bg-white p-10 text-center shadow-sm">
                <p className="font-bold text-gray-500">
                  Henüz ürün eklenmedi.
                </p>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* TESİS */}
      <section
        id="tesis"
        className="bg-white py-24"
      >
        <div className="mx-auto max-w-[1300px] px-6">

          <div className="text-center">

            <div className="font-black uppercase tracking-[.25em] text-[#ff7a00]">
              Tesisimiz
            </div>

            <h2 className="mt-4 text-4xl font-black text-[#092d1c] md:text-5xl">
              Modern Depolama & Paketleme Tesisi
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Antalya Serik&apos;te bulunan tesisimizde
              ürünlerin depolanması, işlenmesi,
              paketlenmesi ve sevkiyata hazırlanması
              süreçlerini titizlikle yürütüyoruz.
            </p>

          </div>

          <div className="group relative mt-14 overflow-hidden rounded-[35px] shadow-2xl">

            <img
              src="/images/tesis_dis.jpeg"
              alt="Bahadır Sülek Soğuk Hava ve Meyve Paketleme Tesisi"
              className="h-[550px] w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 p-10 text-white">

              <div className="text-sm font-black uppercase tracking-[.25em] text-orange-400">
                Bahadır Sülek
              </div>

              <h3 className="mt-2 text-3xl font-black md:text-4xl">
                Soğuk Hava & Meyve Paketleme
              </h3>

              <p className="mt-2 text-white/80">
                {address}
              </p>

            </div>
          </div>

          {/* TESİS GALERİ */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">

            {galleryImages.length > 0 ? (
              galleryImages.slice(0, 6).map((image) => (
                <div
                  key={image.id}
                  className="group overflow-hidden rounded-[28px] bg-white shadow-lg"
                >
                  <div className="overflow-hidden">

                    <img
                      src={image.imagePath}
                      alt={image.title || "Bahadır Sülek tesis görseli"}
                      className="h-[330px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  </div>

                  <div className="p-6">

                    <h3 className="text-xl font-black text-[#07572e]">
                      {image.title
                        ? image.title.replace(/_/g, " ")
                        : "Tesis Fotoğrafı"}
                    </h3>

                    <p className="mt-2 text-gray-500">
                      Bahadır Sülek Soğuk Hava ve Meyve
                      Paketleme tesisinden görüntüler.
                    </p>

                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-[28px] bg-[#f7f7f2] p-10 text-center">
                <p className="font-bold text-gray-500">
                  Henüz galeri fotoğrafı eklenmedi.
                </p>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* PAKETLEME */}
      <section
        id="paketleme"
        className="overflow-hidden bg-[#07572e] py-24 text-white"
      >
        <div className="mx-auto max-w-[1300px] px-6">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>

              <div className="font-black uppercase tracking-[.25em] text-orange-400">
                İşleme & Paketleme
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                Bahçeden gelen ürün,
                <span className="block text-orange-400">
                  sevkiyata hazır hale gelir.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/80">
                Tesisimize gelen ürünler özenle kontrol edilir,
                seçilir, işlenir ve paketleme hattımızda
                sevkiyata hazırlanır.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">

                {[
                  [
                    "01",
                    "Ürün Kabul",
                    "Tesise gelen meyvelerin kontrollü kabulü.",
                  ],
                  [
                    "02",
                    "Seçim & İşleme",
                    "Ürünlerin kalite kriterlerine göre ayrılması.",
                  ],
                  [
                    "03",
                    "Paketleme",
                    "Ürünlerin satış ve sevkiyata uygun hazırlanması.",
                  ],
                  [
                    "04",
                    "Sevkiyat",
                    "Hazırlanan ürünlerin sevkiyata çıkarılması.",
                  ],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur"
                  >
                    <div className="text-3xl font-black text-orange-400">
                      {number}
                    </div>

                    <h3 className="mt-3 text-xl font-black">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {text}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            <div className="relative">

              <div className="rounded-[40px] bg-white/10 p-4 shadow-2xl backdrop-blur">

                <img
                  src="/images/paketleme_makinasi.jpeg"
                  alt="Bahadır Sülek meyve işleme ve paketleme hattı"
                  className="h-[520px] w-full rounded-[32px] object-cover"
                />

              </div>

              <div className="absolute -bottom-6 -left-6 rounded-3xl bg-orange-500 px-8 py-6 shadow-2xl">

                <div className="text-3xl font-black">
                  Modern
                </div>

                <div className="font-bold text-white/80">
                  İşleme & Paketleme
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GALERİ */}
      <section
        id="galeri"
        className="bg-[#f6f7f2] py-24"
      >
        <div className="mx-auto max-w-[1300px] px-6">

          <div className="text-center">

            <div className="font-black uppercase tracking-[.25em] text-[#ff7a00]">
              Galeri
            </div>

            <h2 className="mt-4 text-4xl font-black text-[#092d1c] md:text-5xl">
              Tesisimizden görüntüler.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Soğuk hava depolarımız, paketleme hattımız
              ve tesisimizden güncel görüntüler.
            </p>

          </div>

          {galleryImages.length > 0 ? (
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-[28px] bg-white shadow-lg"
                >
                  <img
                    src={image.imagePath}
                    alt={image.title || "Bahadır Sülek Galeri"}
                    className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />

                  <div className="absolute bottom-0 left-0 p-6 text-white">

                    <h3 className="text-xl font-black">
                      {image.title
                        ? image.title.replace(/_/g, " ")
                        : "Tesisimiz"}
                    </h3>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="mt-14 rounded-3xl bg-white p-12 text-center shadow-sm">
              <p className="font-bold text-gray-500">
                Galeri fotoğrafları yönetim panelinden eklenebilir.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* İLETİŞİM */}
      <section
        id="iletisim"
        className="bg-[#092d1c] py-24 text-white"
      >
        <div className="mx-auto max-w-[1300px] px-6">

          <div className="grid gap-12 lg:grid-cols-2">

            {/* SOL */}
            <div>

              <div className="font-black uppercase tracking-[.25em] text-orange-400">
                İletişim
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                Ürün ve hizmetlerimiz
                <span className="block text-orange-400">
                  hakkında konuşalım.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                Soğuk hava depolama, meyve işleme,
                paketleme ve ürün tedariki hakkında bilgi
                almak için bizimle iletişime geçebilirsiniz.
              </p>

              <div className="mt-10 space-y-5">

                <div className="flex gap-4 rounded-2xl bg-white/10 p-5">

                  <div className="text-2xl">
                    📍
                  </div>

                  <div>
                    <div className="font-black">
                      Adres
                    </div>

                    <div className="mt-1 text-white/70">
                      {address}
                    </div>
                  </div>

                </div>

                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex gap-4 rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
                  >
                    <div className="text-2xl">
                      📞
                    </div>

                    <div>
                      <div className="font-black">
                        Telefon
                      </div>

                      <div className="mt-1 text-white/70">
                        {phone}
                      </div>
                    </div>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex gap-4 rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
                  >
                    <div className="text-2xl">
                      ✉️
                    </div>

                    <div>
                      <div className="font-black">
                        E-posta
                      </div>

                      <div className="mt-1 text-white/70">
                        {email}
                      </div>
                    </div>
                  </a>
                )}

              </div>
            </div>

            {/* SAĞ */}
            <div className="rounded-[35px] bg-white p-8 text-slate-900 shadow-2xl md:p-10">

              <div className="text-sm font-black uppercase tracking-[.25em] text-orange-500">
                Teklif & Bilgi
              </div>

              <h3 className="mt-3 text-3xl font-black text-[#07572e]">
                Size nasıl yardımcı olabiliriz?
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Teklif almak için e-posta gönderebilir,
                WhatsApp üzerinden iletişime geçebilir
                veya doğrudan bizi arayabilirsiniz.
              </p>

              <div className="mt-8 grid gap-4">

                {/* TEKLİF İÇİN E-POSTA */}
                {email && (
                  <a
                    href={teklifMailLink}
                    className="flex items-center justify-center gap-3 rounded-full bg-orange-500 px-7 py-4 font-black text-white shadow-lg transition hover:scale-[1.02]"
                  >
                    ✉️ Teklif İçin E-posta Gönder
                  </a>
                )}

                {whatsappNumber && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-7 py-4 font-black text-white shadow-lg transition hover:scale-[1.02]"
                  >
                    💬 WhatsApp ile İletişime Geç
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-3 rounded-full bg-[#07572e] px-7 py-4 font-black text-white"
                  >
                    📞 Telefonla Ara
                  </a>
                )}

                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 rounded-full border-2 border-[#07572e] px-7 py-4 font-black text-[#07572e]"
                  >
                    📸 Instagram
                  </a>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#061f14] px-6 py-10 text-white">

        <div className="mx-auto flex max-w-[1300px] flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <div className="text-xl font-black">
              Bahadır Sülek
            </div>

            <div className="mt-1 text-sm text-white/60">
              Soğuk Hava & Meyve Paketleme
            </div>
          </div>

          <div className="text-sm text-white/55">
            © 2026 Bahadır Sülek Soğuk Hava &
            Meyve Paketleme Deposu Ltd. Şti.
          </div>

        </div>
      </footer>

      {/* SABİT WHATSAPP */}
      {whatsappNumber && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp ile iletişime geç"
          className="fixed bottom-7 right-7 z-[100] flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition duration-300 hover:scale-110"
        >
          <svg
            viewBox="0 0 32 32"
            className="h-12 w-12 fill-current"
            aria-hidden="true"
          >
            <path d="M16.04 3C9.42 3 4.05 8.37 4.05 14.99c0 2.31.66 4.56 1.9 6.49L4 28.6l7.3-1.91a11.93 11.93 0 0 0 4.73.96h.01c6.61 0 12-5.38 12-11.99C28.04 9.04 22.66 3 16.04 3Zm0 22.62h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.21-4.33 1.14 1.16-4.22-.24-.39a9.94 9.94 0 0 1-1.53-5.29c0-5.49 4.47-9.96 9.97-9.96 5.49 0 9.96 4.47 9.96 9.96 0 5.49-4.47 9.96-9.96 9.96Zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
          </svg>
        </a>
      )}

    </main>
  );
}