"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import type { Category, Product } from "@/types";
import { Header } from "@/components/website/Header";
import { SearchBox } from "@/components/website/SearchBox";
import { CategoryFilter } from "@/components/website/CategoryFilter";
import { ProductList } from "@/components/website/ProductList";

const PAGE_SIZE = 10;

export default function WebsitePage() {
  const [lang, setLang] = useState<"en" | "fa">("fa");
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    document.documentElement.setAttribute(
      "dir",
      lang === "fa" ? "rtl" : "ltr"
    );
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  // Debounce search input -> committed search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchProducts = useCallback(
    async (
      nextPage: number,
      opts: { replace?: boolean; category?: string; search?: string } = {}
    ) => {
      const myReqId = ++requestIdRef.current;
      setLoading(true);
      try {
        const params: Record<string, string | number | boolean> = {
          page: nextPage,
          limit: PAGE_SIZE,
        };
        const cat = opts.category ?? activeCategory;
        const q = opts.search ?? search;
        if (cat) params.category = cat;
        if (q) params.search = q;

        const res = await api.get<{
          items: Product[];
          total: number;
          page: number;
          limit: number;
        }>("/products", { params });

        // Drop stale responses (a newer request superseded this one)
        if (myReqId !== requestIdRef.current) return;

        setProducts((prev) =>
          opts.replace ? res.data.items : [...prev, ...res.data.items]
        );
        const loaded =
          (nextPage - 1) * res.data.limit + res.data.items.length;
        setHasMore(loaded < res.data.total);
        setPage(nextPage);
      } catch {
        // ignore — keep current list
      } finally {
        if (myReqId === requestIdRef.current) setLoading(false);
      }
    },
    [activeCategory, search]
  );

  // Reset and refetch whenever category or committed search changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    void fetchProducts(1, { replace: true, category: activeCategory, search });
    // Bring the user back to the top of the list when filters change so they
    // see the new results right away. Smooth scroll on user-driven changes,
    // instant on the very first mount.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, search]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    void fetchProducts(page + 1);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-xl">
        <div className="px-4 pt-3 sm:pt-5">
          <Header lang={lang} onLangChange={setLang} />
        </div>

        {/* Sticky search + categories — stays visible as user scrolls products */}
        <div className="sticky top-0 z-30 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-gray-100">
          <div className="px-4 pt-3 pb-2 space-y-2">
            <SearchBox
              value={searchInput}
              onChange={setSearchInput}
              onClear={() => setSearchInput("")}
              placeholder={lang === "fa" ? "جستجو در منو…" : "Search menu…"}
              lang={lang}
            />
            <CategoryFilter
              categories={categories}
              activeId={activeCategory}
              onChange={setActiveCategory}
              lang={lang}
            />
          </div>
        </div>

        <div className="px-4 pt-3 pb-10 space-y-3">
          <ProductList
            products={products}
            lang={lang}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </div>
  );
}
