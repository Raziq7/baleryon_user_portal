import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProductsThunk } from "../../store/thunks/productThunks";
import type { AppDispatch } from "@/store/store.js";
import CustomCurosel from "../../components/items/customCurosel";
import NewArrivelprodctList from "../../components/homePageComponent/newArrivelprodctList";
import OurCollectionsProductList from "../../components/homePageComponent/ourCollectionsProductList";

export default function Home() {
 const dispatch = useDispatch<AppDispatch>();

   useEffect(() => {
      dispatch(fetchProductsThunk());
    }, [dispatch]);

  return (
    <main className="px-3 lg:px-8 py-6">
      {/* Hero Carousel */}
      <div>
        <CustomCurosel />
      </div>

      {/* Our Collection Section */}
      <section className="mt-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">OUR COLLECTION</h1>
        <p className="text-[#565455] mb-6">Step into a new fashion</p>
        <div className="bg-black h-[1px] w-full mb-8"></div>
        <OurCollectionsProductList />
      </section>

      {/* Explore Section */}
      <section
        className="mt-24 px-4 sm:px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-8 bg-cover bg-center"
        style={{ backgroundImage: "url('/exploreBg.png')" }}
      >
        <img
          src="/exploreimg.png"
          alt="Explore"
          className="w-auto h-auto max-w-[60%] lg:max-w-none"
          width={350}
          height={450}
        />
        <p
          className="text-4xl sm:text-6xl lg:text-8xl text-white text-center lg:text-left"
          style={{ fontFamily: "var(--font-irish-grover)" }}
        >
          LIGHT UP <br /> YOUR <br /> STYLE
        </p>
        <div className="flex flex-col items-center lg:items-start">
          <button className="border border-white text-white px-8 py-3 rounded-md w-[180px] h-[50px] hover:bg-white hover:text-black transition-all duration-200">
            Explore Now
          </button>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="mt-24 text-center">
        <h3 className="text-xl sm:text-2xl font-semibold">NEW ARRIVALS</h3>
        <p className="text-[#7C7C7C]">Style elegant</p>
        <NewArrivelprodctList />
      </section>

      {/* Latest Product */}
      {/* <section className="mt-20 text-center">
        <h3 className="text-xl sm:text-2xl font-semibold">LATEST PRODUCT</h3>
        <p className="text-[#7C7C7C] mb-4">Comfort with your style</p>
        <div className="flex">
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div
              className="absolute px-2 py-1 rounded-lg top-3 right-3 text-xs sm:text-sm"
              style={{
                background:
                  "linear-gradient(0deg, rgba(217,217,217,1) 0%, rgba(115,115,115,1) 100%)",
              }}
            >
              <span className="text-white">20% off</span>
            </div>
            <img
              src="/lastProduct1.png"
              alt="Latest Product"
              className="w-full h-auto"
              width={404}
              height={692}
            />
          </div>
        </div>
      </section> */}

      {/* Subscribe Section */}
      <section
        className="mt-20 h-auto py-12 px-4 flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/subscribe.png')" }}
      >
        <p
          className="text-3xl sm:text-5xl lg:text-6xl text-white font-bold mb-6"
          style={{ fontFamily: "var(--font-inria-serif)" }}
        >
          GET 15% OFF YOUR <br />
          FIRST ORDER
        </p>
        <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter your email"
            className="border border-white p-2 bg-transparent text-white flex-1"
          />
          <button className="bg-white text-black px-6 py-2">Subscribe</button>
        </div>
      </section>
    </main>
  );
}
