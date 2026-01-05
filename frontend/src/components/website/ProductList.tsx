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
  return (
    <div className="space-y-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} lang={lang} />
      ))}

      {/* Empty state - only show when not loading and no products */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm">
            {lang === "fa" ? "محصولی یافت نشد" : "No products found"}
          </p>
        </div>
      )}

      {/* Load more button - only show when there are products AND more to load */}
      {hasMore && products.length > 0 && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={onLoadMore}
            className="px-4 py-2 text-xs rounded-full border border-gray-300"
          >
            {lang === "fa" ? "موارد بیشتر" : "Load more"}
          </button>
        </div>
      )}

      {/* End of list message */}
      {!hasMore && products.length > 0 && (
        <p className="text-center text-xs text-gray-400 pb-4">
          {lang === "fa" ? "تمام شد" : "No more items"}
        </p>
      )}
    </div>
  );
}


