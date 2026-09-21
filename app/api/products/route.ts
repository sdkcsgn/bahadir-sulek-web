import { NextResponse } from "next/server";
import { prisma } from "@/prisma/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const category = String(body.category ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!name || !category || !description) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        description,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("PRODUCT POST ERROR:", error);

    return NextResponse.json(
      { error: "Ürün kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCT GET ERROR:", error);

    return NextResponse.json(
      { error: "Ürünler alınamadı." },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);
    const name = String(body.name ?? "").trim();
    const category = String(body.category ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!id || !name || !category || !description) {
      return NextResponse.json(
        { error: "Eksik bilgi gönderildi." },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        description,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT PUT ERROR:", error);

    return NextResponse.json(
      { error: "Ürün güncellenemedi." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { error: "Ürün ID bulunamadı." },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PRODUCT DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Ürün silinemedi." },
      { status: 500 }
    );
  }
}