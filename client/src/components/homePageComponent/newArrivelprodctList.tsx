import React from "react";
import { useSelector } from "react-redux";
import { ProductCard2 } from "../items/productCard";
import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../store/slices/productSlice";

const NewArrivelprodctList: React.FC = () => {
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {error && (
        <div className="text-center text-red-600 py-8">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={`s-${i}`} className="animate-pulse">
              <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl" />
              <div className="mt-3 h-4 bg-gray-200 rounded" />
              <div className="mt-2 h-4 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}

        {!loading && (!products || products.length === 0) && (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center text-gray-600 py-8">
            No products found.
          </div>
        )}

        {!loading &&
          products?.map((p, ind) => (
            <ProductCard2
              key={p._id}
              index={ind}
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
};

export default NewArrivelprodctList;
