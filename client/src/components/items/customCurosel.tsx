import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import type { CarouselApi } from "../../components/ui/carousel";

import { cn } from "../../lib/utils.js"; // Utility function

import api from "../../utils/baseUrl"; // Axios instance (make sure it works in plain React)

interface Banner {
  _id: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CustomCurosel: React.FC = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get("/api/user/setting/banner");
        setBanners(data);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };

    fetchBanners();
  }, []);

  // Update current slide index
  useEffect(() => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () =>
      setCurrent(carouselApi.selectedScrollSnap())
    );
  }, [carouselApi]);

  return (
    <div className="relative w-full h-full">
      <Carousel className="w-full" setApi={setCarouselApi}>
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner._id}>
              <Card className="w-full relative border-0">
                <CardContent className="p-0">
                  <div className="w-full aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] lg:aspect-[16/5] overflow-hidden rounded-md">
                    <img
                      src={banner?.image}
                      data-src={banner?.image}
                      loading="lazy"
                      alt="Banner"
                      className="object-cover w-full h-full transition-transform duration-500 ease-in-out transform hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel controls */}
        <div className="absolute inset-y-[45%] left-2 flex items-center">
          <CarouselPrevious className="relative left-0 h-8 w-8" />
        </div>
        <div className="absolute inset-y-[45%] right-2 flex items-center">
          <CarouselNext className="relative right-0 h-8 w-8" />
        </div>
      </Carousel>

      {/* Dot navigation */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {banners.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              current === index ? "bg-primary w-4" : "bg-muted-foreground/30"
            )}
            onClick={() => carouselApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomCurosel;
