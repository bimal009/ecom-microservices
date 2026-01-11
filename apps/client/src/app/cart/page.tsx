"use client";

import ShippingForm from "@/components/ShippingForm";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import useCartStore from "@/stores/cartStore";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "Shopping Cart",
  },
  {
    id: 2,
    title: "Shipping Address",
  },
  {
    id: 3,
    title: "Payment Method",
  },
];

const CartPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();

  const activeStep = parseInt(searchParams.get("step") || "1");

  const { cart, removeFromCart } = useCartStore();
  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12 px-4 max-w-7xl mx-auto">
      {/* TITLE */}
      <h1 className="text-4xl font-bold tracking-tight">Your Shopping Cart</h1>
      
      {/* STEPS */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            <div
              className={`flex items-center gap-3 pb-2 border-b-4 transition-all duration-300 ${
                step.id === activeStep ? "border-black" : "border-gray-300"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold transition-all duration-300 ${
                  step.id === activeStep ? "bg-black" : "bg-gray-400"
                }`}
              >
                {step.id}
              </div>
              <p
                className={`text-sm font-bold transition-all duration-300 ${
                  step.id === activeStep ? "text-black" : "text-gray-400"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-gray-300 hidden lg:block" />
            )}
          </div>
        ))}
      </div>
      
      {/* STEPS & DETAILS */}
      <div className="w-full flex flex-col lg:flex-row gap-8">
        {/* STEPS */}
        <div className="w-full lg:w-7/12 border-2 border-black p-8 rounded-2xl flex flex-col gap-8 bg-white">
          {activeStep === 1 ? (
            cart.length > 0 ? (
              cart.map((item) => (
                <div
                  className="flex items-center justify-between pb-6 border-b-2 border-gray-200 last:border-0 last:pb-0"
                  key={item.id + item.selectedSize + item.selectedColor}
                >
                  {/* IMAGE AND DETAILS */}
                  <div className="flex gap-6">
                    {/* IMAGE */}
                    <div className="relative w-24 h-24 border-2 border-black rounded-xl overflow-hidden bg-white">
                      <Image
                        src={
                          (item.images as Record<string, string>)?.[
                            item.selectedColor
                          ] || ""
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* ITEM DETAILS */}
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-bold">{item.name}</p>
                        <p className="text-sm text-black">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-black">
                          Size: {item.selectedSize.toUpperCase()}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-black">Color:</span>
                          <div
                            className="w-4 h-4 rounded-full border-2 border-black"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      </div>
                      <p className="font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => removeFromCart(item)}
                    className="w-10 h-10 rounded-full border-2 border-black hover:bg-black hover:text-white transition-all duration-200 text-black flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-xl font-bold text-black">Your cart is empty</p>
                <p className="text-sm text-gray-600 mt-2">Add some items to get started!</p>
              </div>
            )
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 && shippingForm ? (
            <StripeCheckoutForm ShippingForm={shippingForm} />
          ) : (
            <p className="text-center text-black font-medium py-8">
              Please fill in the shipping form to continue.
            </p>
          )}
        </div>
        
        {/* DETAILS */}
        <div className="w-full lg:w-5/12 border-2 border-black p-8 rounded-2xl flex flex-col gap-6 h-max bg-white sticky top-24">
          <h2 className="font-bold text-2xl tracking-tight">Order Summary</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-base">
              <p className="text-black">Subtotal</p>
              <p className="font-bold">
                $
                {cart
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between text-base">
              <p className="text-black">Discount (10%)</p>
              <p className="font-bold text-green-600">-$10.00</p>
            </div>
            <div className="flex justify-between text-base">
              <p className="text-black">Shipping Fee</p>
              <p className="font-bold">$10.00</p>
            </div>
            <hr className="border-2 border-black my-2" />
            <div className="flex justify-between text-lg">
              <p className="text-black font-bold">Total</p>
              <p className="font-bold text-2xl">
                $
                {cart
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
          {activeStep === 1 && (
            <button
              onClick={() => router.push("/cart?step=2", { scroll: false })}
              disabled={cart.length === 0}
              className="w-full bg-black hover:bg-gray-900 transition-all duration-200 text-white py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
            >
              Continue to Shipping
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;