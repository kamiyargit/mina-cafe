"use client";

import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

type Props = {
  products: Product[];
  lang: "en" | "fa";
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
};

export function ProductList({ products, lang, onLoadMore, hasMore, loading }: Props) {
  const showInitialSkeletons = loading && products.length === 0;
  const showAppendSkeletons = loading && products.length > 0;
  const showEmpty = !loading && products.length === 0;

  return (
    <div className="space-y-3">
      {products.map((p, idx) => (
        <div
          key={p.id}
          className="animate-card-rise"
          style={{ animationDelay: `${Math.min(idx, 8) * 35}ms` }}
        >
          <ProductCard product={p} lang={lang} />
        </div>
      ))}

      {showAppendSkeletons && <ProductSkeleton count={2} />}
      {showInitialSkeletons && <ProductSkeleton count={5} />}

      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-14 h-14 mb-3 text-gray-300"
            aria-hidden="true"
          >
            <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <path d="M6 1v3M10 1v3M14 1v3" />
          </svg>
          <p className="text-sm font-medium text-gray-500">
            {lang === "fa" ? "چیزی پیدا نشد" : "Nothing here yet"}
          </p>
          <p className="mt-1 text-xs text-gray-400 max-w-[16rem] text-center leading-relaxed">
            {lang === "fa"
              ? "می‌توانی جستجو یا دسته‌ی دیگری را امتحان کنی"
              : "Try a different search term or category"}
          </p>
        </div>
      )}

      {!loading && hasMore && products.length > 0 && (
        <div className="flex justify-center py-3">
          <button
            type="button"
            onClick={onLoadMore}
            className="px-5 py-2 text-xs sm:text-sm rounded-full border border-gray-300 bg-white hover:border-gray-900 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          >
            {lang === "fa" ? "موارد بیشتر" : "Load more"}
          </button>
        </div>
      )}

      {!loading && !hasMore && products.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-3 pb-1 text-[11px] text-gray-400">
          <span className="h-px w-8 bg-gray-200" />
          <span>{lang === "fa" ? "همه‌چی همینه — نوش جان" : "That's our menu — enjoy"}</span>
          <span className="h-px w-8 bg-gray-200" />
        </div>
      )}
    </div>
  );
}

function ProductSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 animate-pulse"
        >
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-gray-100 flex-shrink-0" />
          <div className="flex flex-col justify-between flex-1 py-1">
            <div className="space-y-2">
              <div className="h-3 w-2/3 rounded bg-gray-100" />
              <div className="h-2.5 w-full rounded bg-gray-100" />
              <div className="h-2.5 w-4/5 rounded bg-gray-100" />
            </div>
            <div className="h-3 w-20 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </>
  );
}
