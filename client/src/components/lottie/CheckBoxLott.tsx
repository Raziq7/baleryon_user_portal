import React from "react";
import animationData from "./checkout-lottie.json";
import { useLottie } from "lottie-react";

function CheckBoxLott() {
  const defaultOptions = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);
  return (
    <div className=" relative h-[350px]">
      <div className="w-[700px] h-[700px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">{View}</div>
    </div>
  );
}

export default CheckBoxLott;
