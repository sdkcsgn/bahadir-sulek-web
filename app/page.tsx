import { prisma } from "@/prisma/lib/prisma";
import { connection } from "next/server";
import { translations, type SiteLanguage } from "@/app/lib/site-translations";

type HomeProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

function getLanguage(value?: string): SiteLanguage {
  if (value === "en" || value === "ru") return value;
  return "tr";
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function phoneHref(value: string) {
  const number = digitsOnly(value);
  return number ? `tel:+${number}` : "#";
}

function instagramHref(value: string) {
  const clean = value.trim();
  if (!clean) return "#";
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  return `https://instagram.com/${clean.replace(/^@/, "")}`;
}

function productEmoji(name: string) {
  const normalized = name.toLocaleLowerCase("tr-TR");
  if (normalized.includes("portakal")) return "🍊";
  if (normalized.includes("mandalina")) return "🍊";
  if (normalized.includes("limon")) return "🍋";
  if (normalized.includes("greyfurt") || normalized.includes("grapefruit")) return "🍊";
  if (normalized.includes("nar")) return "🍎";
  return "🍃";
}

function translatedProductName(name: string, lang: SiteLanguage) {
  if (lang === "tr") return name;

  const normalized = name.toLocaleLowerCase("tr-TR").trim();

  const names: Record<string, { en: string; ru: string }> = {
    portakal: { en: "Orange", ru: "Апельсин" },
    mandalina: { en: "Mandarin", ru: "Мандарин" },
    limon: { en: "Lemon", ru: "Лимон" },
    greyfurt: { en: "Grapefruit", ru: "Грейпфрут" },
    grapefruit: { en: "Grapefruit", ru: "Грейпфрут" },
    nar: { en: "Pomegranate", ru: "Гранат" },
  };

  return names[normalized]?.[lang] ?? name;
}

function translatedCategory(category: string, lang: SiteLanguage) {
  if (lang === "tr") return category;

  const normalized = category.toLocaleLowerCase("tr-TR").trim();

  if (normalized === "narenciye") {
    return lang === "en" ? "Citrus" : "Цитрусовые";
  }

  if (normalized === "meyve") {
    return lang === "en" ? "Fruit" : "Фрукты";
  }

  return category;
}

export default async function Home({ searchParams }: HomeProps) {
  await connection();

  const params = await searchParams;
  const lang = getLanguage(params.lang);
  const t = translations[lang];

  const [siteContent, galleryImages, products] = await Promise.all([
    prisma.siteContent.findFirst(),
    prisma.galleryImage.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      take: 9,
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { id: "asc" },
    }),
  ]);

  const companyName = siteContent?.companyName?.trim() || t.hero.company;

  const subtitle =
    lang === "tr"
      ? siteContent?.subTitle?.trim() || t.hero.subtitle
      : t.hero.subtitle;

  const description =
    lang === "tr"
      ? siteContent?.description?.trim() || t.hero.description
      : t.hero.description;

  const heroImage =
    siteContent?.heroImage?.trim() || "/images/meyveler.png";

  const coldRooms = siteContent?.coldRooms ?? 7;
  const storageCapacity = siteContent?.storageCapacity ?? 200;
  const antalyaHal = siteContent?.antalyaHal ?? 59;

  const phone = siteContent?.phone?.trim() || "";
  const whatsapp = siteContent?.whatsapp?.trim() || "";
  const email = siteContent?.email?.trim() || "";
  const address =
    siteContent?.address?.trim() ||
    "Çandır Mahallesi, Çandır Bulvarı No:19 - Serik / Antalya";
  const instagram = siteContent?.instagram?.trim() || "";

  const whatsappNumber = digitsOnly(whatsapp);

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        t.contact.whatsappMessage
      )}`
    : "#";

  const mailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        t.contact.emailSubject
      )}&body=${encodeURIComponent(t.contact.emailBody)}`
    : "#";

  const currentYear = new Date().getFullYear();

  return (
    <main id="anasayfa" className="min-h-screen bg-[#f7f7f3] text-[#0b3b2b]">
      <div className="bg-[#07572e] text-white">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-4 px-5 py-2 text-[12px] font-bold lg:px-8">
          <div className="hidden truncate md:block">📍 {address}</div>

          <div className="ml-auto flex items-center gap-3 whitespace-nowrap md:gap-5">
            {phone && (
              <a href={phoneHref(phone)} className="transition hover:text-orange-300">
                📞 {phone}
              </a>
            )}

            {whatsappNumber && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden transition hover:text-orange-300 sm:inline"
              >
                WhatsApp
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="hidden transition hover:text-orange-300 md:inline"
              >
                ✉ {email}
              </a>
            )}

            <div className="flex items-center gap-2">
              <a
                href="/?lang=tr"
                className={
                  lang === "tr"
                    ? "font-black text-orange-300"
                    : "transition hover:text-orange-300"
                }
              >
                TR
              </a>

              <span className="text-white/40">|</span>

              <a
                href="/?lang=en"
                className={
                  lang === "en"
                    ? "font-black text-orange-300"
                    : "transition hover:text-orange-300"
                }
              >
                EN
              </a>

              <span className="text-white/40">|</span>

              <a
                href="/?lang=ru"
                className={
                  lang === "ru"
                    ? "font-black text-orange-300"
                    : "transition hover:text-orange-300"
                }
              >
                RU
              </a>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-6 px-5 py-4 lg:px-8">
          <a href={`/?lang=${lang}`} className="shrink-0">
            <img
              src="/images/bs_logo.png"
              alt="Bahadır Sülek"
              className="h-[72px] w-auto object-contain md:h-[88px]"
            />
          </a>

          <nav className="hidden items-center gap-7 text-[14px] font-black text-black lg:flex">
            <a
              href="#anasayfa"
              className="border-b-2 border-red-500 pb-3 text-red-600"
            >
              {t.nav.home}
            </a>
            <a href="#kurumsal" className="transition hover:text-red-600">
              {t.nav.corporate}
            </a>
            <a href="#tesis" className="transition hover:text-red-600">
              {t.nav.facility}
            </a>
            <a href="#urunler" className="transition hover:text-red-600">
              {t.nav.products}
            </a>
            <a href="#paketleme" className="transition hover:text-red-600">
              {t.nav.packaging}
            </a>
            <a href="#galeri" className="transition hover:text-red-600">
              {t.nav.gallery}
            </a>
            <a href="#iletisim" className="transition hover:text-red-600">
              {t.nav.contact}
            </a>
          </nav>

          <a
            href={mailLink}
            className="rounded-full bg-red-600 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-700"
          >
            📄 {t.nav.quote}
          </a>
        </div>

        <div className="border-t border-black/5 bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-[1450px] gap-5 overflow-x-auto whitespace-nowrap text-sm font-bold">
            <a href="#kurumsal">{t.nav.corporate}</a>
            <a href="#tesis">{t.nav.facility}</a>
            <a href="#urunler">{t.nav.products}</a>
            <a href="#paketleme">{t.nav.packaging}</a>
            <a href="#galeri">{t.nav.gallery}</a>
            <a href="#iletisim">{t.nav.contact}</a>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-[#07572e] via-[#086032] to-[#064925] text-white">
        <div className="mx-auto grid max-w-[1300px] gap-12 px-6 pb-24 pt-12 lg:grid-cols-2 lg:items-center lg:pb-28">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black">
              🍊 {lang === "tr" ? `${antalyaHal} Antalya Hal` : t.hero.badge}
            </div>

            <h1 className="mt-7 text-[48px] font-black uppercase leading-[0.95] tracking-tight text-red-500 drop-shadow-[0_2px_3px_rgba(255,255,255,0.5)] md:text-[70px]">
              {companyName}
            </h1>

            <div className="mt-4 text-xl font-black uppercase tracking-wide md:text-2xl">
              {subtitle}
            </div>

            <div className="mt-10 border-l-4 border-orange-400 pl-6">
              <div className="text-5xl font-black leading-none md:text-6xl">
                {t.hero.line1}
              </div>
              <div className="mt-1 text-5xl font-black leading-none text-orange-400 md:text-6xl">
                {t.hero.line2}
              </div>
            </div>

            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/90">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#tesis"
                className="rounded-full bg-orange-500 px-7 py-4 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                ❄ {t.hero.discover} →
              </a>

              <a
                href="#iletisim"
                className="rounded-full border border-white/30 bg-white/10 px-7 py-4 font-black text-white transition hover:bg-white/20"
              >
                ☎ {t.hero.contact}
              </a>
            </div>
          </div>

          <div className="relative mx-auto h-[430px] w-full max-w-[540px] overflow-hidden rounded-[56px] border-4 border-orange-400 bg-gradient-to-r from-orange-400 to-orange-600 shadow-2xl">
            <div className="absolute left-[45px] top-[115px] flex h-[300px] w-[48%] items-center justify-center">
              <img
                src={heroImage}
                alt="Bahadır Sülek"
                className="max-h-[350px] w-auto max-w-full object-contain drop-shadow-2xl"
              />
            </div>

            <div className="absolute inset-y-0 right-0 w-[48%] bg-gradient-to-r from-orange-500/70 to-orange-600 px-7 py-9">
              <div className="text-2xl font-black leading-tight">
                {t.hero.freshness}
              </div>

              <div className="my-5 h-px w-10 bg-white/80" />

              <div className="space-y-5 font-black">
                <div>❄️ &nbsp; {t.hero.coldStorage}</div>
                <div>⚙️ &nbsp; {t.hero.processing}</div>
                <div>📦 &nbsp; {t.hero.packaging}</div>
                <div>🚚 &nbsp; {t.hero.shipping}</div>
              </div>

              <div className="mt-8 text-xl italic leading-tight text-white">
                {t.hero.naturalTaste}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto -mb-[66px] grid max-w-[1000px] overflow-hidden rounded-[28px] bg-white text-[#07572e] shadow-2xl md:grid-cols-3">
          <div className="flex min-h-[135px] items-center justify-center gap-6 border-b p-7 md:border-b-0 md:border-r">
            <div className="text-3xl">❄</div>
            <div className="text-center">
              <div className="text-5xl font-black text-red-600">{coldRooms}</div>
              <div className="mt-1 font-black">{t.stats.coldRooms}</div>
            </div>
          </div>

          <div className="flex min-h-[135px] items-center justify-center gap-6 border-b p-7 md:border-b-0 md:border-r">
            <div className="text-3xl">▤</div>
            <div className="text-center">
              <div className="text-5xl font-black text-red-600">
                {storageCapacity}
              </div>
              <div className="mt-1 max-w-[220px] font-black">
                {t.stats.capacity}
              </div>
            </div>
          </div>

          <div className="flex min-h-[135px] items-center justify-center gap-6 p-7">
            <div className="text-3xl">⌖</div>
            <div className="text-center">
              <div className="text-5xl font-black text-red-600">{antalyaHal}</div>
              <div className="mt-1 font-black">{t.stats.antalyaMarket}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="kurumsal" className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-[1300px]">
          <div className="text-center">
            <div className="font-black uppercase tracking-[0.35em] text-orange-500">
              {t.corporate.eyebrow}
            </div>
            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight text-[#063f2d] md:text-5xl">
              {t.corporate.title}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              {t.corporate.description}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[30px] bg-[#07572e] p-8 text-white shadow-lg">
              <div className="text-4xl">❄️</div>
              <h3 className="mt-5 text-2xl font-black">{t.corporate.card1Title}</h3>
              <p className="mt-3 leading-7 text-white/75">{t.corporate.card1Text}</p>
            </div>

            <div className="rounded-[30px] bg-orange-500 p-8 text-white shadow-lg">
              <div className="text-4xl">🍊</div>
              <h3 className="mt-5 text-2xl font-black">{t.corporate.card2Title}</h3>
              <p className="mt-3 leading-7 text-white/80">{t.corporate.card2Text}</p>
            </div>

            <div className="rounded-[30px] bg-white p-8 shadow-lg">
              <div className="text-4xl">📦</div>
              <h3 className="mt-5 text-2xl font-black text-[#07572e]">
                {t.corporate.card3Title}
              </h3>
              <p className="mt-3 leading-7 text-gray-500">{t.corporate.card3Text}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="urunler" className="bg-[#f2f3ee] px-6 py-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="text-center">
            <div className="font-black uppercase tracking-[0.35em] text-orange-500">
              {t.products.eyebrow}
            </div>
            <h2 className="mt-4 text-4xl font-black text-[#063f2d] md:text-5xl">
              {t.products.title}
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-[28px] bg-white p-7 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="text-6xl">{productEmoji(product.name)}</div>
                  <h3 className="mt-4 text-2xl font-black text-[#07572e]">
                    {translatedProductName(product.name, lang)}
                  </h3>

                  {product.category && (
                    <div className="mt-2 font-bold text-orange-500">
                      {translatedCategory(product.category, lang)}
                    </div>
                  )}

                  {product.description && (
                    <p className="mt-5 leading-7 text-gray-500">
                      {product.description}
                    </p>
                  )}

                  {product.price > 0 && (
                    <div className="mt-5 rounded-full bg-[#07572e]/5 px-4 py-2 font-black text-[#07572e]">
                      {t.products.price}: {product.price} / {product.unit}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[28px] bg-white p-10 text-center shadow">
              <p className="font-bold text-gray-500">{t.products.empty}</p>
            </div>
          )}
        </div>
      </section>

      <section id="tesis" className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="font-black uppercase tracking-[0.35em] text-orange-500">
              {t.facility.eyebrow}
            </div>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#063f2d] md:text-5xl">
              {t.facility.title}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t.facility.description}
            </p>

            <div className="mt-8 space-y-4">
              {[t.facility.feature1, t.facility.feature2, t.facility.feature3].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl bg-[#f4f6f1] p-5 font-black text-[#07572e]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
                      ✓
                    </span>
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-[36px] shadow-2xl">
            <img
              src="/images/tesis_dis.jpeg"
              alt={t.facility.title}
              className="h-[480px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="paketleme" className="bg-[#07572e] px-6 py-24 text-white">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-[36px] shadow-2xl">
              <img
                src="/images/paketleme_makinasi.jpeg"
                alt={t.packaging.title}
                className="h-[480px] w-full object-cover"
              />
            </div>

            <div>
              <div className="font-black uppercase tracking-[0.35em] text-orange-400">
                {t.packaging.eyebrow}
              </div>
              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                {t.packaging.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/75">
                {t.packaging.description}
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  ["01", t.packaging.step1Title, t.packaging.step1Text],
                  ["02", t.packaging.step2Title, t.packaging.step2Text],
                  ["03", t.packaging.step3Title, t.packaging.step3Text],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="text-2xl font-black text-orange-400">
                      {number}
                    </div>
                    <div>
                      <div className="text-xl font-black">{title}</div>
                      <div className="mt-1 text-white/65">{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="galeri" className="bg-[#f2f3ee] px-6 py-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="text-center">
            <div className="font-black uppercase tracking-[0.35em] text-orange-500">
              {t.gallery.eyebrow}
            </div>
            <h2 className="mt-4 text-4xl font-black text-[#063f2d] md:text-5xl">
              {t.gallery.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t.gallery.description}
            </p>
          </div>

          {galleryImages.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group overflow-hidden rounded-[28px] bg-white shadow-lg"
                >
                  <div className="overflow-hidden">
                    <img
                      src={image.imagePath}
                      alt={image.title || t.gallery.defaultTitle}
                      className="h-[330px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black text-[#07572e]">
                      {image.title
                        ? image.title.replaceAll("_", " ")
                        : t.gallery.defaultTitle}
                    </h3>
                    <p className="mt-2 text-gray-500">{t.gallery.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[28px] bg-white p-12 text-center shadow-sm">
              <p className="font-bold text-gray-500">{t.gallery.empty}</p>
            </div>
          )}
        </div>
      </section>

      <section id="iletisim" className="bg-[#092d1c] px-6 py-24 text-white">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="font-black uppercase tracking-[0.25em] text-orange-400">
                {t.contact.eyebrow}
              </div>
              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                {t.contact.title1}
                <span className="block text-orange-400">{t.contact.title2}</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                {t.contact.description}
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex gap-4 rounded-2xl bg-white/10 p-5">
                  <div className="text-2xl">📍</div>
                  <div>
                    <div className="font-black">{t.contact.address}</div>
                    <div className="mt-1 text-white/70">{address}</div>
                  </div>
                </div>

                {phone && (
                  <a
                    href={phoneHref(phone)}
                    className="flex gap-4 rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
                  >
                    <div className="text-2xl">📞</div>
                    <div>
                      <div className="font-black">{t.contact.phone}</div>
                      <div className="mt-1 text-white/70">{phone}</div>
                    </div>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex gap-4 rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
                  >
                    <div className="text-2xl">✉️</div>
                    <div>
                      <div className="font-black">{t.contact.email}</div>
                      <div className="mt-1 text-white/70">{email}</div>
                    </div>
                  </a>
                )}

                {instagram && (
                  <a
                    href={instagramHref(instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
                  >
                    <div className="text-2xl">📷</div>
                    <div>
                      <div className="font-black">{t.contact.instagram}</div>
                      <div className="mt-1 text-white/70">{instagram}</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 text-[#07572e] shadow-2xl md:p-10">
              <div className="font-black uppercase tracking-[0.25em] text-orange-500">
                {t.contact.offerEyebrow}
              </div>
              <h3 className="mt-4 text-3xl font-black">{t.contact.offerTitle}</h3>
              <p className="mt-4 leading-7 text-gray-600">
                {t.contact.offerDescription}
              </p>

              <div className="mt-8 space-y-4">
                {email && (
                  <a
                    href={mailLink}
                    className="flex items-center justify-center rounded-full bg-orange-500 px-6 py-4 text-center font-black text-white shadow-lg transition hover:bg-orange-600"
                  >
                    ✉️ {t.contact.emailButton}
                  </a>
                )}

                {whatsappNumber && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full bg-[#25D366] px-6 py-4 text-center font-black text-white shadow-lg transition hover:brightness-95"
                  >
                    💬 {t.contact.whatsappButton}
                  </a>
                )}

                {phone && (
                  <a
                    href={phoneHref(phone)}
                    className="flex items-center justify-center rounded-full border-2 border-[#07572e] px-6 py-4 text-center font-black text-[#07572e] transition hover:bg-[#07572e] hover:text-white"
                  >
                    ☎ {t.contact.callButton}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#061f14] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-[1300px] flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="text-xl font-black">{t.footer.company}</div>
            <div className="mt-1 text-sm text-white/60">{t.footer.description}</div>
          </div>

          <div className="text-sm text-white/55">
            © {currentYear} {t.footer.copyright}
          </div>
        </div>
      </footer>

      {whatsappNumber && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="fixed bottom-7 right-7 z-[100] flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105"
        >
          <svg
            viewBox="0 0 32 32"
            className="h-12 w-12 fill-current"
            aria-hidden="true"
          >
            <path d="M16.04 3C9.42 3 4.05 8.37 4.05 14.99c0 2.31.66 4.56 1.9 6.49L4 28.617l7.311-1.911a11.93 11.93 0 0 0 4.73.96h.005c6.61 0 11.99-5.378 11.99-11.994C28.036 9.37 22.66 3 16.04 3Zm0 22.64h-.004a9.95 9.95 0 0 1-5.07-1.39l-.363-.216-4.338 1.135 1.158-4.227-.236-.37a9.96 9.96 0 0 1-1.53-5.303c0-5.512 4.485-9.996 9.998-9.996 2.669 0 5.178 1.04 7.065 2.928a9.93 9.93 0 0 1 2.927 7.067c-.002 5.512-4.488 9.998-9.997 9.998Zm5.482-7.49c-.3-.15-1.775-.876-2.05-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.49-.892-.795-1.494-1.777-1.669-2.077-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.626-.925-2.227-.244-.586-.492-.507-.675-.516l-.575-.01c-.2 0-.525.075-.8.375-.275.3-1.05 1.026-1.05 2.502 0 1.476 1.075 2.902 1.225 3.102.15.2 2.115 3.228 5.122 4.527.715.309 1.273.493 1.708.631.718.228 1.371.196 1.887.119.575-.086 1.775-.726 2.025-1.427.25-.7.25-1.301.175-1.426-.075-.125-.275-.2-.575-.35Z" />
          </svg>
        </a>
      )}
    </main>
  );
}
