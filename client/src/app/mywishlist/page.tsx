import { useEffect, useState } from "react";
import { WishListCard } from "../../components/items/productCard";
import { Button } from "../../components/ui/button";
import type {ProductDetail } from "../../store/types/product";

// interface WishlistPageProps {}

const WishlistPage = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [productList, setProductList] = useState<ProductDetail[]>([]);

  const getProductFromWishList = (): void => {
    try {
      const wishlist = localStorage.getItem("wishlist");
      const items: ProductDetail[] = wishlist ? JSON.parse(wishlist) : [];
      setProductList(items);
    } catch (error) {
      console.error("Failed to parse wishlist:", error);
    }
  };

  const removeProductFromWishlist = (product: ProductDetail): void => {
    try {
      const wishlist = localStorage.getItem("wishlist");
      const items: ProductDetail[] = wishlist ? JSON.parse(wishlist) : [];
      const updated = items.filter((item) => item._id !== product._id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setProductList(updated);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    getProductFromWishList();
  }, []);

  if (!isClient) return null;

  return (
    <div className="my-12">
      {!token ? (
        <div className="text-center">
          <img
            src="/itemNotfound.png"
            alt="Login required"
            width={450}
            height={450}
            className="mx-auto"
          />
          <p className="text-2xl text-black font-bold mt-4">
            Please login to view your wishlist
          </p>
          <p className="text-base text-gray-400 mb-6">
            Login to access your wishlist and easily move items to cart.
          </p>
        </div>
      ) : productList.length === 0 ? (
        <div className="text-center">
          <img
            src="/itemNotfound.png"
            alt="Empty wishlist"
            width={450}
            height={450}
            className="mx-auto"
          />
          <p className="text-2xl text-black font-bold mt-4">
            Your wishlist is lonely and looking for love.
          </p>
          <p className="text-base text-gray-400 mb-6">
            Add products to your wishlist, review them anytime and easily move
            to cart.
          </p>
        </div>
      ) : (
        <div className="px-6 md:px-24 mb-24">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">Wishlist</h1>
            <p className="text-gray-400">
              {productList.length} item{productList.length > 1 ? "s" : ""} in
              your wishlist
            </p>
          </div>
          {/* in WishlistPage */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productList.map((product) => (
              <WishListCard
                key={product._id}
                productDetail={product}
                removeProduct={() => removeProductFromWishlist(product)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-5 mt-8">
        <Button
          onClick={() => (window.location.href = "/products")}
          variant="outline"
        >
          Continue Shopping
        </Button>
        {!token && (
          <Button onClick={() => (window.location.href = "/login")}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
