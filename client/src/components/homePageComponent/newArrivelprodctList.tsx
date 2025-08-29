import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type {ProductDetail}  from "../../store/types/product.ts";
import { ProductCard2 } from "../items/productCard";
import LoaderLottie from "../lottie/Loader";

import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../store/slices/productSlice";


// ----------- NewArrivelprodctList Component --------------

const NewArrivelprodctList: React.FC = () => {
 
  // const [productList, setProductList] = useState<ProductDetail[]>([]);
    const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);



 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-center gap-x-16 gap-y-16 mx-auto w-full">
      {loading && <LoaderLottie />}
      {products?.map((product, ind) => (
        <ProductCard2
          key={product._id}
          index={ind}
          prodctname={product.productName}
          prodctID={product._id}
          price={product.price}
          image={product.image[0]}
          productDetail={product}
        />
      ))}
    </div>
  );
};

export default NewArrivelprodctList;
