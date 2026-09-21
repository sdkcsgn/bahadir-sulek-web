const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // SITE CONTENT
  const siteContent = await prisma.siteContent.findFirst();

  if (!siteContent) {
    await prisma.siteContent.create({
      data: {
        companyName: "BAHADIR SÜLEK",
        subTitle: "SOĞUK HAVA & MEYVE PAKETLEME DEPOSU",
        mainTitle: "Doğadan Sofranıza Güvenle.",
        description:
          "Meyvelerinizi modern soğuk hava depolarımızda özenle muhafaza ediyor, işleme ve paketleme hattımızda sevkiyata hazır hale getiriyoruz.",
        coldRooms: 7,
        storageCapacity: 200,
        antalyaHal: 59,
        heroImage: "/uploads/hero-1789982468965.jpg",
        email: "info@bahadirsulek.com",
        address:
          "Çandır Mahallesi, Çandır Bulvarı No:19 - Serik / Antalya",
      },
    });
  }

  // PRODUCTS
  const productCount = await prisma.product.count();

  if (productCount === 0) {
    await prisma.product.create({
      data: {
        name: "Portakal",
        category: "Narenciye",
        description: "Taze ve kaliteli Antalya portakalı",
        price: 0,
        unit: "kg",
        active: true,
      },
    });
  }

  // GALLERY
  const galleryCount = await prisma.galleryImage.count();

  if (galleryCount === 0) {
    await prisma.galleryImage.createMany({
      data: [
        {
          title: "Paketleme Hattı",
          imagePath:
            "/uploads/gallery/gallery-1789983264161.jpg",
          sortOrder: 1,
          active: true,
        },
        {
          title: "Paketlenmiş Ürünler",
          imagePath:
            "/uploads/gallery/gallery-1789983450194.jpg",
          sortOrder: 2,
          active: true,
        },
        {
          title: "Tesisimiz",
          imagePath:
            "/uploads/gallery/gallery-1789983450241.jpg",
          sortOrder: 3,
          active: true,
        },
        {
          title: "Tesis Dış Görünüm",
          imagePath:
            "/uploads/gallery/gallery-1789983450306.jpg",
          sortOrder: 4,
          active: true,
        },
      ],
    });
  }

  console.log("PostgreSQL başlangıç verileri hazır.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });