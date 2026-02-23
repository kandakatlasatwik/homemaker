import React from "react";
import ProductCard from "../ui/ProductCard";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const handleSofaClick = () => {
    navigate("/select-texture");
  };
  return (
    <section className="w-full  bg-white ">
      <div className="container mx-auto px-4 grid grid-cols-1   gap-8 items-center min-h-[350px]">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mt-8">Welcome to Homemakers</h1>
          <p className="text-lg text-gray-600 text-center">Your one-stop shop for home essentials.</p>
          <div className="grid grid-cols-1 gap-2  sm:grid sm:grid-cols-2">
            <ProductCard onClick={handleSofaClick} />
            <ProductCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
