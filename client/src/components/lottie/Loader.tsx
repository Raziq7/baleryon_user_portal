import React from "react";
import Lottie from "lottie-react";
import animationData from "./baleryon_loader_full.json";

const LoaderLottie: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
       <div className="animate-blink">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 180, height: "auto" }}
        rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
            imagePreserveAspectRatio: "xMidYMid slice",
          }}
      />
      </div>
    </div>
  );
};

export default LoaderLottie;
