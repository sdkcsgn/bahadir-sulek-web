"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  id: number | string;
  imagePath: string;
  title: string;
};

type GalleryLightboxProps = {
  items: GalleryItem[];
  description: string;
};

export default function GalleryLightbox({
  items,
  description,
}: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isOpen = selectedIndex !== null;
  const selected = selectedIndex !== null ? items[selectedIndex] : null;

  function close() {
    setSelectedIndex(null);
  }

  function previous() {
    if (selectedIndex === null || items.length === 0) return;

    setSelectedIndex(
      selectedIndex === 0 ? items.length - 1 : selectedIndex - 1
    );
  }

  function next() {
    if (selectedIndex === null || items.length === 0) return;

    setSelectedIndex(
      selectedIndex === items.length - 1 ? 0 : selectedIndex + 1
    );
  }

  useEffect(() => {
    if (!isOpen) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }

      if (event.key === "ArrowLeft") {
        previous();
      }

      if (event.key === "ArrowRight") {
        next();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = oldOverflow;
    };
  }, [isOpen, selectedIndex, items.length]);

  return (
    <>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((image, index) => (
          <article
            key={image.id}
            className="group overflow-hidden rounded-[28px] bg-white shadow-lg"
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="block w-full cursor-zoom-in overflow-hidden text-left"
              aria-label={`${image.title} fotoğrafını büyüt`}
            >
              <img
                src={image.imagePath}
                alt={image.title}
                className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[330px]"
              />

              <div className="pointer-events-none absolute hidden" />
            </button>

            <div className="p-6">
              <h3 className="text-xl font-black text-[#07572e]">
                {image.title}
              </h3>
              <p className="mt-2 text-gray-500">{description}</p>
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="mt-4 font-black text-orange-500 transition hover:text-orange-600"
              >
                🔍 Büyüt
              </button>
            </div>
          </article>
        ))}
      </div>

      {isOpen && selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="fixed right-4 top-4 z-[10001] flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl font-black text-black shadow-xl transition hover:scale-105 sm:right-7 sm:top-7"
          >
            ×
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previous();
                }}
                aria-label="Önceki fotoğraf"
                className="fixed left-3 top-1/2 z-[10001] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-4xl font-black text-black shadow-xl transition hover:scale-105 sm:left-7 sm:h-14 sm:w-14"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                aria-label="Sonraki fotoğraf"
                className="fixed right-3 top-1/2 z-[10001] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-4xl font-black text-black shadow-xl transition hover:scale-105 sm:right-7 sm:h-14 sm:w-14"
              >
                ›
              </button>
            </>
          )}

          <div
            className="flex max-h-[92vh] max-w-[94vw] flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selected.imagePath}
              alt={selected.title}
              className="max-h-[80vh] max-w-[94vw] rounded-2xl object-contain shadow-2xl"
            />

            <div className="mt-3 rounded-full bg-black/60 px-5 py-2 text-center text-sm font-bold text-white sm:text-base">
              {selected.title}
              {items.length > 1 && selectedIndex !== null && (
                <span className="ml-3 text-white/70">
                  {selectedIndex + 1} / {items.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
