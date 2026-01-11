"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@repo/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [productTypes, setProductTypes] = useState({
    size: product.sizes[0],
    color: product.colors[0],
  });
  const [isHovered, setIsHovered] = useState(false);

  const { addToCart } = useCartStore();

  const handleProductType = ({
    type,
    value,
  }: {
    type: "size" | "color";
    value: string;
  }) => {
    setProductTypes((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: productTypes.size || '',
      selectedColor: productTypes.color || '',
    });
    toast.success("Product added to cart")
  };

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <Image
            src={
              (product.images as Record<string, string>)?.[
                productTypes.color || ''
              ] || ""
            }
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>
      </Link>
      
      {/* PRODUCT DETAIL */}
      <div className="flex flex-col gap-4 p-5">
        {/* Title and Description */}
        <div className="space-y-2">
          <h1 className="font-semibold text-base tracking-tight line-clamp-1">
            {product.name}
          </h1>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>
        
        {/* PRODUCT TYPES */}
        <div className="flex items-start gap-6">
          {/* SIZES */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Size
            </label>
            <select
              name="size"
              id="size"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-black font-medium cursor-pointer hover:border-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
              onChange={(e) =>
                handleProductType({ type: "size", value: e.target.value })
              }
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          {/* COLORS */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Color
            </label>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => (
                <button
                  className={`relative rounded-full p-0.5 transition-all duration-200 ${
                    productTypes.color === color
                      ? "ring-2 ring-black ring-offset-2"
                      : "ring-1 ring-gray-300 hover:ring-gray-400"
                  }`}
                  key={color}
                  onClick={() =>
                    handleProductType({ type: "color", value: color })
                  }
                  aria-label={`Select ${color} color`}
                >
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* PRICE AND ADD TO CART BUTTON */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Price</span>
            <p className="font-bold text-xl tracking-tight">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer hover:bg-gray-900 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;