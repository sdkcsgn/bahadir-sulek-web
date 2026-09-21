import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/prisma/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Görsel bulunamadı." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Yalnızca resim dosyası yükleyebilirsiniz." },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Görsel en fazla 8 MB olabilir." },
        { status: 400 }
      );
    }

    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    const extension = extensions[file.type] || "jpg";
    const fileName = `hero-${Date.now()}.${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await mkdir(uploadDirectory, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(
      path.join(uploadDirectory, fileName),
      buffer
    );

    const imagePath = `/uploads/${fileName}`;

    const existing = await prisma.siteContent.findFirst();

    const content = existing
      ? await prisma.siteContent.update({
          where: { id: existing.id },
          data: {
            heroImage: imagePath,
          },
        })
      : await prisma.siteContent.create({
          data: {
            heroImage: imagePath,
          },
        });

    return NextResponse.json({
      success: true,
      imagePath,
      content,
    });
  } catch (error) {
    console.error("HERO UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Görsel yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}