import { NextResponse } from "next/server";
import {
  mkdir,
  writeFile,
  unlink,
} from "fs/promises";
import path from "path";
import { prisma } from "@/prisma/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
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
    console.error("GALLERY GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Galeri görselleri alınamadı.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const title = String(
      formData.get("title") ?? ""
    ).trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Fotoğraf bulunamadı.",
        },
        {
          status: 400,
        }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "Yalnızca resim dosyası yükleyebilirsiniz.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        {
          error:
            "Fotoğraf en fazla 8 MB olabilir.",
        },
        {
          status: 400,
        }
      );
    }

    const extensions: Record<
      string,
      string
    > = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    const extension =
      extensions[file.type] || "jpg";

    const fileName =
      `gallery-${Date.now()}.${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "gallery"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const bytes =
      await file.arrayBuffer();

    await writeFile(
      path.join(
        uploadDirectory,
        fileName
      ),
      Buffer.from(bytes)
    );

    const imagePath =
      `/uploads/gallery/${fileName}`;

    const lastImage =
      await prisma.galleryImage.aggregate({
        _max: {
          sortOrder: true,
        },
      });

    const image =
      await prisma.galleryImage.create({
        data: {
          title,
          imagePath,
          sortOrder:
            (lastImage._max.sortOrder ??
              0) + 1,
        },
      });

    return NextResponse.json(
      image,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "GALLERY POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Fotoğraf yüklenirken hata oluştu.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const body =
      await request.json();

    const id = Number(body.id);
    const title = String(
      body.title ?? ""
    ).trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Fotoğraf ID bulunamadı.",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.galleryImage.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Fotoğraf bulunamadı.",
        },
        {
          status: 404,
        }
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
      "GALLERY PUT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Fotoğraf başlığı güncellenirken hata oluştu.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const body =
      await request.json();

    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Fotoğraf ID bulunamadı.",
        },
        {
          status: 400,
        }
      );
    }

    const image =
      await prisma.galleryImage.findUnique({
        where: {
          id,
        },
      });

    if (!image) {
      return NextResponse.json(
        {
          error:
            "Fotoğraf bulunamadı.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.galleryImage.delete({
      where: {
        id,
      },
    });

    if (
      image.imagePath.startsWith(
        "/uploads/gallery/"
      )
    ) {
      const filePath = path.join(
        process.cwd(),
        "public",
        image.imagePath.replace(
          /^\/+/,
          ""
        )
      );

      try {
        await unlink(filePath);
      } catch (fileError) {
        console.error(
          "Dosya silinemedi:",
          fileError
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "GALLERY DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Fotoğraf silinirken hata oluştu.",
      },
      {
        status: 500,
      }
    );
  }
}