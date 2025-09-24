// src/components/lists/OurCollectionsProductList.tsx
import { useSelector } from "react-redux";
import { ProductCard } from "../items/productCard";
import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../store/slices/productSlice";

function OurCollectionsProductList() {
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl" />
              <div className="mt-3 h-4 bg-gray-200 rounded" />
              <div className="mt-2 h-4 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        {error}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12 text-gray-600">
        No products found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile: 2 cols; Tablet: 3; Desktop: 4 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            prodctname={p.productName}
            prodctID={p._id}
            price={p.price}
            image={p.image?.[0]}
            productDetail={p}
          />
        ))}
      </div>
    </div>
  );
}

export default OurCollectionsProductList;
