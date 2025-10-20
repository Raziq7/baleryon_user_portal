import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Checkbox } from "../../components/ui/checkbox";
import { ProductListCard } from "../../components/items/productCard";
import type { ProductDetail } from "../../store/types/product";
import { fetchProductsFiltered } from "../../api/productApi";
import {
  fetchPublicCategories,
  type PublicCategory,
} from "../../api/categoryApi";

function ShopPage() {
  const [productList, setProductList] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // dynamic categories (tree) & selected filters
  const [catTree, setCatTree] = useState<PublicCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // store slugs
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // price + sort
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<"" | "price_asc" | "price_desc">("");

  // ---- Fetch categories (public) ----
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const tree = await fetchPublicCategories();
        if (alive) setCatTree(tree);
      } catch {
        // non-fatal
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ---- Build a flat list (root + level-1 children) for filters ----
  const flatCats = useMemo(() => {
    const out: { slug: string; name: string }[] = [];
    const pushNode = (n: PublicCategory) => {
      out.push({ slug: n.slug, name: n.name });
      (n.children ?? []).forEach((c) =>
        out.push({ slug: c.slug, name: `— ${c.name}` })
      );
    };
    catTree.forEach(pushNode);
    return out;
  }, [catTree]);

  // ---- Toggle helpers ----
  const toggleStrInArray = (
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // ---- Fetch products whenever filters change ----
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { products } = await fetchProductsFiltered({
          page: 1,
          limit: 12,
          categories: selectedCategories,
          colors: selectedColors,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          sort: sort || undefined,
        });

        if (!alive) return;
        setProductList(products);
        if (!products.length)
          setError("No products found for the selected filters.");
      } catch (e) {
        if (!alive) return;
        setError("An error occurred while fetching the products.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [selectedCategories, selectedColors, minPrice, maxPrice, sort]);

  // ---- Render helpers ----
  const renderCheck = (
    id: string,
    label: string,
    checked: boolean,
    onToggle: () => void
  ) => (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none cursor-pointer"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="px-4 md:px-8">
      <div className="mt-6 md:mt-10 mb-10 text-center">
        <h2 className="text-2xl md:text-3xl">SHOP BY CATEGORIES</h2>
        <p className="text-[#7A7879] text-sm md:text-base">
          Our new cozy collection is made for you
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Filters */}
        <aside className="border border-[#C7C7C7] rounded p-3 w-full md:w-[320px]">
          <Accordion type="single" collapsible>
            {/* Category */}
            <AccordionItem value="category">
              <AccordionTrigger className="text-base md:text-lg">
                Category
              </AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col gap-2">
                  {flatCats.map((c) => (
                    <li key={c.slug}>
                      {renderCheck(
                        c.slug,
                        c.name,
                        selectedCategories.includes(c.slug),
                        () => toggleStrInArray(c.slug, setSelectedCategories)
                      )}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>

            {/* Color */}
            <AccordionItem value="color">
              <AccordionTrigger className="text-base md:text-lg">
                Color
              </AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col gap-2">
                  {["RED", "BLUE", "BLACK", "GREEN", "WHITE"].map((clr) => (
                    <li key={clr}>
                      {renderCheck(
                        `color-${clr}`,
                        clr,
                        selectedColors.includes(clr),
                        () => toggleStrInArray(clr, setSelectedColors)
                      )}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>

            {/* Price */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-base md:text-lg">
                Price
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min={0}
                  />
                  <span className="text-gray-500">–</span>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min={0}
                  />
                </div>
                <button
                  className="mt-2 text-xs underline text-gray-600"
                  type="button"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  Clear price
                </button>
              </AccordionContent>
            </AccordionItem>

            {/* Sort */}
            <AccordionItem value="sort">
              <AccordionTrigger className="text-base md:text-lg">
                Sort
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {renderCheck(
                    "sort-l2h",
                    "Price: Low to High",
                    sort === "price_asc",
                    () => setSort((s) => (s === "price_asc" ? "" : "price_asc"))
                  )}
                  {renderCheck(
                    "sort-h2l",
                    "Price: High to Low",
                    sort === "price_desc",
                    () =>
                      setSort((s) => (s === "price_desc" ? "" : "price_desc"))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        {/* Results */}
        <main className="flex-1">
          {/* Error */}
          {error && !loading && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {/* Skeletons */}
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`s-${i}`} className="animate-pulse">
                  <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl" />
                  <div className="mt-3 h-4 bg-gray-200 rounded" />
                  <div className="mt-2 h-4 w-1/3 bg-gray-200 rounded" />
                </div>
              ))}

            {/* Items */}
            {!loading &&
              productList.map((pd) => (
                <ProductListCard key={pd._id} productDetail={pd} />
              ))}
          </div>

          {/* Empty (no error, no loading, no items) */}
          {!loading && !error && productList.length === 0 && (
            <div className="text-center py-10 text-gray-600">
              No products found. Try adjusting your filters.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ShopPage;
