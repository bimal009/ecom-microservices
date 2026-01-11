"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@repo/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductInteraction = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: ProductType;
  selectedSize: string;
  selectedColor: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCartStore();

  const handleTypeChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });
    toast.success("Product added to cart")
  };
  
  return (
    <div className="flex flex-col gap-6">
      {/* SIZE */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-black uppercase tracking-wide">Size</span>
        <div className="flex items-center gap-2">
          {product.sizes.map((size) => (
            <button
              className={`cursor-pointer border-2 transition-all duration-200 rounded-lg ${
                selectedSize === size 
                  ? "border-black bg-black text-white" 
                  : "border-black bg-white text-black hover:bg-gray-100"
              }`}
              key={size}
              onClick={() => handleTypeChange("size", size)}
            >
              <div className="w-12 h-12 flex items-center justify-center font-bold text-sm">
                {size.toUpperCase()}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* COLOR */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-black uppercase tracking-wide">Color</span>
        <div className="flex items-center gap-2">
          {product.colors.map((color) => (
            <button
              className={`cursor-pointer rounded-full p-1 transition-all duration-200 ${
                selectedColor === color 
                  ? "ring-2 ring-black ring-offset-2" 
                  : "ring-2 ring-gray-300 hover:ring-black"
              }`}
              key={color}
              onClick={() => handleTypeChange("color", color)}
            >
              <div 
                className="w-8 h-8 rounded-full border border-black" 
                style={{ backgroundColor: color }} 
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* QUANTITY */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-black uppercase tracking-wide">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            className="cursor-pointer border-2 border-black rounded-lg p-2 hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleQuantityChange("decrement")}
            disabled={quantity === 1}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="font-bold text-xl min-w-[3ch] text-center">{quantity}</span>
          <button
            className="cursor-pointer border-2 border-black rounded-lg p-2 hover:bg-black hover:text-white transition-all duration-200"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* BUTTONS */}
      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer text-base font-bold active:scale-98 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add to Cart
        </button>
        <button className="border-2 border-black bg-white text-black px-6 py-4 rounded-lg flex items-center justify-center cursor-pointer gap-2 text-base font-bold hover:bg-black hover:text-white transition-all duration-200">
          <ShoppingCart className="w-5 h-5" />
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInteraction;