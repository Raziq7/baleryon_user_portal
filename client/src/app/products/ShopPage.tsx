import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Checkbox } from "../../components/ui/checkbox";
import { ProductListCard } from "../../components/items/productCard";
import type { ProductDetail } from "../../store/types/product";
import api from "../../utils/baseUrl";

function ShopPage() {
  const [productList, setProductList] = useState<ProductDetail[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFilter = (
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  useEffect(() => {
    let alive = true;
    const fetchProductList = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams();
        query.append("page", "1");
        query.append("limit", "12");
        if (selectedCategories.length) query.append("category", selectedCategories.join(","));
        if (selectedColors.length) query.append("color", selectedColors.join(","));

        const { data } = await api.get(`/api/user/product/getProducts?${query.toString()}`);
        if (!alive) return;

        const items: ProductDetail[] = data?.products || [];
        setProductList(items);
        if (!items.length) setError("No products found for the selected filters.");
      } catch (e) {
        if (!alive) return;
        setError("An error occurred while fetching the products.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProductList();
    return () => { alive = false; };
  }, [selectedCategories, selectedColors]);

  const renderCheckbox = (
    label: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={label}
        checked={state.includes(label)}
        onCheckedChange={() => toggleFilter(label, setState)}
      />
      <label htmlFor={label} className="text-sm font-medium leading-none">
        {label}
      </label>
    </div>
  );

  return (
    <div className="px-4 md:px-8">
      <div className="mt-6 md:mt-10 mb-10 text-center">
        <h2 className="text-2xl md:text-3xl">SHOP BY CATEGORIES</h2>
        <p className="text-[#7A7879] text-sm md:text-base">Our new cozy collection is made for you</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Filters */}
        <aside className="border border-[#C7C7C7] rounded p-3 w-full md:w-[320px]">
          <Accordion type="single" collapsible>
            <AccordionItem value="category">
              <AccordionTrigger className="text-base md:text-lg">Category</AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col gap-2">
                  {["oversized-t-shirts","full-sleev","t-shirt","hoodie"].map((cat) => (
                    <li key={cat}>
                      {renderCheckbox(cat.toLowerCase(), selectedCategories, setSelectedCategories)}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="color">
              <AccordionTrigger className="text-base md:text-lg">Color</AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col gap-2">
                  {["RED","BLUE","BLACK","GREEN","WHITE"].map((color) => (
                    <li key={color}>
                      {renderCheckbox(color, selectedColors, setSelectedColors)}
                    </li>
                  ))}
                </ol>
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
              ))
            }

            {/* Items */}
            {!loading &&
              productList.map((productDetail) => (
                <ProductListCard key={productDetail._id} productDetail={productDetail} />
              ))
            }
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
