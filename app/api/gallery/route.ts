import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs/promises";
import path from "path";
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
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "bahadir-sulek/gallery",
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

    stream.end(buffer);
  });
}

function getCloudinaryPublicId(
  imageUrl: string
) {
  try {
    if (
      !imageUrl.includes(
        "res.cloudinary.com"
      )
    ) {
      return null;
    }

    const marker = "/upload/";
    const parts = imageUrl.split(marker);

    if (parts.length < 2) {
      return null;
    }

    let publicId = parts[1];

    publicId = publicId.replace(
      /^v\d+\//,
      ""
    );

    publicId = publicId.replace(
      /\.[^/.]+$/,
      ""
    );

    return decodeURIComponent(publicId);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const images =
      await prisma.galleryImage.findMany({
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
      });

    return NextResponse.json(images);
  } catch (error) {
    console.error(
      "Gallery GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Galeri görselleri alınamadı.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    if (
      !process.env
        .CLOUDINARY_CLOUD_NAME ||
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

    const file =
      formData.get("file");

    const title =
      String(
        formData.get("title") ?? ""
      ).trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Görsel seçilmedi.",
        },
        { status: 400 }
      );
    }

    if (
      !file.type.startsWith("image/")
    ) {
      return NextResponse.json(
        {
          error:
            "Sadece görsel dosyası yükleyebilirsiniz.",
        },
        { status: 400 }
      );
    }

    const maxSize =
      8 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error:
            "Görsel en fazla 8 MB olabilir.",
        },
        { status: 400 }
      );
    }

    const lastImage =
      await prisma.galleryImage.findFirst(
        {
          orderBy: {
            sortOrder: "desc",
          },
        }
      );

    const sortOrder =
      (lastImage?.sortOrder ?? 0) + 1;

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const imageUrl =
      await uploadToCloudinary(
        buffer
      );

    const image =
      await prisma.galleryImage.create({
        data: {
          title,
          imagePath: imageUrl,
          sortOrder,
          active: true,
        },
      });

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error(
      "Gallery POST error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Galeri görseli yüklenemedi.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const body =
      await request.json();

    const id =
      Number(body.id);

    const title =
      String(
        body.title ?? ""
      ).trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Geçerli görsel ID bulunamadı.",
        },
        { status: 400 }
      );
    }

    const existing =
      await prisma.galleryImage.findUnique(
        {
          where: {
            id,
          },
        }
      );

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Galeri görseli bulunamadı.",
        },
        { status: 404 }
      );
    }

    const image =
      await prisma.galleryImage.update({
        where: {
          id,
        },
        data: {
          title,
        },
      });

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error(
      "Gallery PUT error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Galeri başlığı güncellenemedi.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const body =
      await request.json();

    const id =
      Number(body.id);

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Geçerli görsel ID bulunamadı.",
        },
        { status: 400 }
      );
    }

    const existing =
      await prisma.galleryImage.findUnique(
        {
          where: {
            id,
          },
        }
      );

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Galeri görseli bulunamadı.",
        },
        { status: 404 }
      );
    }

    await prisma.galleryImage.delete({
      where: {
        id,
      },
    });

    // Yeni Cloudinary görselleri
    const publicId =
      getCloudinaryPublicId(
        existing.imagePath
      );

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(
          publicId
        );
      } catch (error) {
        console.error(
          "Cloudinary delete error:",
          error
        );
      }
    }

    // Eski /uploads/gallery görselleri
    if (
      existing.imagePath.startsWith(
        "/uploads/gallery/"
      )
    ) {
      try {
        const filePath = path.join(
          process.cwd(),
          "public",
          existing.imagePath
        );

        await unlink(filePath);
      } catch {
        // Dosya Render'da artık yoksa sorun değil.
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Gallery DELETE error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Galeri görseli silinemedi.",
      },
      { status: 500 }
    );
  }
}