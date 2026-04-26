"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { resolveImageUrl } from "@/lib/api";

type Props = {
  product: Product;
  lang: "en" | "fa";
};

export function ProductCard({ product, lang }: Props) {
  // Track which url failed so we don't keep state stale across product updates.
  const [erroredUrl, setErroredUrl] = useState<string | undefined>(undefined);
  const titleKey = lang === "fa" ? "titleFa" : "titleEn";
  const descKey = lang === "fa" ? "descFa" : "descEn";
  const fallbackTitleKey = lang === "fa" ? "titleEn" : "titleFa";
  const currency = lang === "fa" ? "تومان" : "Toman";

  const hasDiscount = !!product.discount && product.discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(product.price * (1 - (product.discount as number) / 100))
    : product.price;

  const imageUrl = resolveImageUrl(product.image);
  const showPlaceholder = !imageUrl || erroredUrl === imageUrl;

  const formatPrice = (n: number) =>
    lang === "fa" ? n.toLocaleString("fa-IR") : n.toLocaleString("en-US");

  const title = product[titleKey] || product[fallbackTitleKey] || "";
  const description = product[descKey];

  return (
    <article className="group flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0">
        {showPlaceholder ? (
          <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7"
            >
              <path d="M3 7h13a4 4 0 0 1 0 8h-1" />
              <path d="M3 7v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7Z" />
              <path d="M6 2v3M10 2v3M14 2v3" />
            </svg>
            <span className="text-[10px] mt-0.5">
              {lang === "fa" ? "بدون تصویر" : "No image"}
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full rounded-xl object-cover"
            onError={() => setErroredUrl(imageUrl)}
          />
        )}
        {hasDiscount && (
          <span
            className={`absolute -top-1.5 ${
              lang === "fa" ? "-left-1.5" : "-right-1.5"
            } text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white shadow-sm`}
          >
            {lang === "fa"
              ? `${product.discount}٪ تخفیف`
              : `${product.discount}% off`}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-sm sm:text-[15px] text-gray-900 leading-snug truncate">
              {title}
            </h3>
            {product.special && (
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                {lang === "fa" ? "ویژه" : "Special"}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div
          className={`mt-1 flex items-end ${
            lang === "fa" ? "justify-start" : "justify-end"
          }`}
        >
          <div className="flex flex-col items-start text-xs">
            {hasDiscount ? (
              <>
                <span className="line-through text-gray-400 text-[11px]">
                  {formatPrice(product.price)} {currency}
                </span>
                <span className="font-bold text-gray-900 text-[13px] sm:text-sm">
                  {formatPrice(finalPrice)} {currency}
                </span>
              </>
            ) : (
              <span className="font-bold text-gray-900 text-[13px] sm:text-sm">
                {formatPrice(product.price)} {currency}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
