import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import type { CarouselApi } from "../../components/ui/carousel";
import { cn } from "../../lib/utils";
import api from "../../utils/baseUrl";

interface Banner {
  _id: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent";
const aspect = "aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] lg:aspect-[16/5]";

const CustomCurosel: React.FC = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [errored, setErrored] = useState<Record<string, boolean>>({});

  // Fetch banners
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/api/user/setting/banner");
        if (!alive) return;
        setBanners(data || []);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Update current slide index
  useEffect(() => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
    const onSelect = () => setCurrent(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
  }, [carouselApi]);

  // Preload the next 2 images for snappier swipes
  useEffect(() => {
    const nextIdxs = [current + 1, current + 2].filter(
      (i) => i < banners.length
    );
    nextIdxs.forEach((i) => {
      const b = banners[i];
      if (!b || loaded[b._id] || errored[b._id]) return;
      const img = new Image();
      img.src = b.image;
      img.onload = () => setLoaded((s) => ({ ...s, [b._id]: true }));
      img.onerror = () => setErrored((s) => ({ ...s, [b._id]: true }));
    });
  }, [current, banners, loaded, errored]);

  // Skeleton items while fetching
  if (!banners.length) {
    return (
      <div className="relative w-full h-full">
        <div className={cn("w-full rounded-md bg-gray-200", shimmer, aspect)} />
      </div>
    );
  }

  // Derive srcSet for faster responsive delivery (works with most CDNs; harmless if ignored)
  const srcSetFor = (url: string) =>
    [
      `${url}?w=480 480w`,
      `${url}?w=768 768w`,
      `${url}?w=1024 1024w`,
      `${url}?w=1440 1440w`,
      `${url}?w=1920 1920w`,
    ].join(", ");
  const sizes =
    "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw";

  return (
    <div className="relative w-full h-full">
      <Carousel className="w-full" setApi={setCarouselApi}>
        <CarouselContent>
          {banners.map((banner, index) => {
            const isLoaded = !!loaded[banner._id];
            const isError = !!errored[banner._id];
            const priority = index === 0; // first slide: eager + high priority

            return (
              <CarouselItem key={banner._id}>
                <Card className="w-full relative border-0">
                  <CardContent className="p-0">
                    <div className={cn("w-full overflow-hidden rounded-md", aspect)}>
                      {/* Skeleton placeholder */}
                      {!isLoaded && !isError && (
                        <div className={cn("w-full h-full bg-gray-200", shimmer)} />
                      )}

                      {/* Image (blur-up until loaded) */}
                      {!isError && (
                        <img
                          src={`${banner.image}${priority ? "?fmt=webp" : ""}`}
                          srcSet={srcSetFor(banner.image)}
                          sizes={sizes}
                          alt={`Banner ${index + 1}`}
                          loading={priority ? "eager" : "lazy"}
                          fetchPriority={priority ? "high" : "auto"}
                          decoding="async"
                          onLoad={() =>
                            setLoaded((s) => ({ ...s, [banner._id]: true }))
                          }
                          onError={() =>
                            setErrored((s) => ({ ...s, [banner._id]: true }))
                          }
                          className={cn(
                            "object-cover w-full h-full transition duration-500 ease-out",
                            isLoaded
                              ? "opacity-100 blur-0"
                              : "opacity-0 blur-md",
                            "group-hover:scale-[1.02]"
                          )}
                        />
                      )}

                      {/* Fallback if image fails */}
                      {isError && (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                          Image unavailable
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
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
