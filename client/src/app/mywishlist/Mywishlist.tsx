import { useEffect, useState, useCallback } from "react";
import { WishListCard } from "../../components/items/productCard";
import { Button } from "../../components/ui/button";
import type { ProductDetail } from "../../store/types/product";
import { toast } from "react-hot-toast";
import { getWishlist, removeFromWishlist, removeAllWishList } from "../../api/wishlistApi";

type WishlistAPIItem =
  | {
      productId: (ProductDetail & { _id: string }) | string | null | undefined;
    }
  | null;

type WishlistAPIResponse =
  | {
      _id?: string;
      userId?: string;
      items?: WishlistAPIItem[];
    }
  | { items: [] }
  | null
  | undefined;

const WishlistPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState<ProductDetail[]>([]);

  const hydrateFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      const res: WishlistAPIResponse = await getWishlist();
      const items = res?.items ?? [];
      const mapped: ProductDetail[] = items
        .map((it) => {
          const pid = it?.productId as any;
          if (!pid) return null;
          return typeof pid === "string" ? null : (pid as ProductDetail);
        })
        .filter(Boolean) as ProductDetail[];
      setProductList(mapped);
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setProductList([]);
      } else {
        toast.error("Failed to load wishlist");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRemoveOne = async (product: ProductDetail) => {
    try {
      await removeFromWishlist(product._id);
      setProductList((prev) => prev.filter((p) => p._id !== product._id));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Unable to remove item");
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await removeAllWishList();
      setProductList([]);
      toast.success("Wishlist cleared");
    } catch (err) {
      toast.error("Unable to clear wishlist");
      console.error(err);
    }
  };

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("auth_token");
    setToken(storedToken);
    if (storedToken) void hydrateFromAPI();
  }, [hydrateFromAPI]);

  if (!isClient) return null;

  return (
    <div className="my-12">
      {!token ? (
        <div className="text-center">
          <img src="/itemNotfound.png" alt="Login required" width={450} height={450} className="mx-auto" />
          <p className="text-2xl text-black font-bold mt-4">Please login to view your wishlist</p>
          <p className="text-base text-gray-400 mb-6">
            Login to access your wishlist and easily move items to cart.
          </p>

          <div className="flex justify-center gap-5 mt-8">
            <Button onClick={() => (window.location.href = "/products")} variant="outline">
              Continue Shopping
            </Button>
            <Button onClick={() => (window.location.href = "/login")}>Login</Button>
          </div>
        </div>
      ) : (
        <>
          {!loading && productList.length === 0 ? (
            <div className="text-center">
              <img src="/itemNotfound.png" alt="Empty wishlist" width={450} height={450} className="mx-auto" />
              <p className="text-2xl text-black font-bold mt-4">Your wishlist is lonely and looking for love.</p>
              <p className="text-base text-gray-400 mb-6">
                Add products to your wishlist, review them anytime and easily move to cart.
              </p>

              <div className="flex justify-center gap-5 mt-8">
                <Button onClick={() => (window.location.href = "/products")} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-6 md:px-24 mb-24">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">Wishlist</h1>
                  <p className="text-gray-400">
                    {productList.length} item{productList.length > 1 ? "s" : ""} in your wishlist
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => (window.location.href = "/products")}>
                    Continue Shopping
                  </Button>
                  {productList.length > 0 && (
                    <Button variant="destructive" onClick={handleClearAll}>
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {productList.map((product) => (
                  <WishListCard key={product._id} productDetail={product} removeProduct={() => handleRemoveOne(product)} />
                ))}
              </div>

              {loading && <div className="text-center text-sm text-gray-500 mt-6">Loading…</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WishlistPage;
