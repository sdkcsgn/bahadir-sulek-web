import { NextResponse } from "next/server";
import { prisma } from "@/prisma/lib/prisma";

export async function GET() {
  try {
    let content = await prisma.siteContent.findFirst();

    if (!content) {
      content = await prisma.siteContent.create({
        data: {},
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Site content GET error:", error);

    return NextResponse.json(
      { error: "İçerik alınamadı." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const existing =
      await prisma.siteContent.findFirst();

    const data = {
      companyName:
        body.companyName !== undefined
          ? String(body.companyName)
          : existing?.companyName ?? "BAHADIR SÜLEK",

      subTitle:
        body.subTitle !== undefined
          ? String(body.subTitle)
          : existing?.subTitle ??
            "SOĞUK HAVA & MEYVE PAKETLEME DEPOSU",

      mainTitle:
        body.mainTitle !== undefined
          ? String(body.mainTitle)
          : existing?.mainTitle ??
            "Doğadan Sofranıza Güvenle.",

      description:
        body.description !== undefined
          ? String(body.description)
          : existing?.description ?? "",

      coldRooms:
        body.coldRooms !== undefined
          ? Number(body.coldRooms)
          : existing?.coldRooms ?? 7,

      storageCapacity:
        body.storageCapacity !== undefined
          ? Number(body.storageCapacity)
          : existing?.storageCapacity ?? 200,

      antalyaHal:
        body.antalyaHal !== undefined
          ? Number(body.antalyaHal)
          : existing?.antalyaHal ?? 59,

      heroImage:
        body.heroImage !== undefined
          ? String(body.heroImage)
          : existing?.heroImage ?? "/images/meyveler.png",

      phone:
        body.phone !== undefined
          ? String(body.phone)
          : existing?.phone ?? "",

      whatsapp:
        body.whatsapp !== undefined
          ? String(body.whatsapp)
          : existing?.whatsapp ?? "",

      email:
        body.email !== undefined
          ? String(body.email)
          : existing?.email ?? "",

      address:
        body.address !== undefined
          ? String(body.address)
          : existing?.address ??
            "Çandır Mahallesi, Çandır Bulvarı No:19 - Serik / Antalya",

      instagram:
        body.instagram !== undefined
          ? String(body.instagram)
          : existing?.instagram ?? "",
    };

    const content = existing
      ? await prisma.siteContent.update({
          where: {
            id: existing.id,
          },
          data,
        })
      : await prisma.siteContent.create({
          data,
        });

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Site content PUT error:", error);

    return NextResponse.json(
      {
        error: "Değişiklikler kaydedilemedi.",
      },
      { status: 500 }
    );
  }
}