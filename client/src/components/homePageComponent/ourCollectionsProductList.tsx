// src/components/lists/OurCollectionsProductList.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store"; // if you have typed dispatch
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

  // useEffect(() => {
  //   dispatch(fetchProductsThunk());
  // }, [dispatch]);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-center gap-x-16 gap-y-16 mx-auto w-full">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          prodctname={product.productName}
          prodctID={product._id}
          price={product.price}
          image={product.image?.[0]}
          productDetail={product}
        />
      ))}
    </div>
  );
}

export default OurCollectionsProductList;
