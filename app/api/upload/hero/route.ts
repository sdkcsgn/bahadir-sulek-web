import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/prisma/lib/prisma";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function uploadToCloudinary(
  buffer: Buffer
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "bahadir-sulek/hero",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result?.secure_url) {
            reject(
              new Error(
                "Cloudinary görsel adresi oluşturulamadı."
              )
            );
            return;
          }

          resolve(result.secure_url);
        }
      );

    uploadStream.end(buffer);
  });
}

export async function POST(request: Request) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          error:
            "Cloudinary bağlantı bilgileri eksik.",
        },
        { status: 500 }
      );
    }

    const formData =
      await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Görsel seçilmedi.",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "Sadece görsel dosyası yükleyebilirsiniz.",
        },
        { status: 400 }
      );
    }

    const maxSize = 8 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            "Görsel en fazla 8 MB olabilir.",
        },
        { status: 400 }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const imageUrl =
      await uploadToCloudinary(buffer);

    const existing =
      await prisma.siteContent.findFirst();

    const content = existing
      ? await prisma.siteContent.update({
          where: {
            id: existing.id,
          },
          data: {
            heroImage: imageUrl,
          },
        })
      : await prisma.siteContent.create({
          data: {
            heroImage: imageUrl,
          },
        });

    return NextResponse.json({
      success: true,
      imagePath: imageUrl,
      content,
    });
  } catch (error) {
    console.error(
      "Cloudinary hero upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Hero görseli yüklenemedi.",
      },
      { status: 500 }
    );
  }
}