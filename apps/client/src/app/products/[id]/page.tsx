import ProductInteraction from "@/components/ProductInteraction";
import { ProductType } from "@repo/types";
import Image from "next/image";

const fetchProduct = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`
  );
  const data: ProductType = await res.json();
  return data;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

  const product = await fetchProduct(id);
  return {
    title: product.name,
    describe: product.description,
  };
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color: string; size: string }>;
}) => {
  const { size, color } = await searchParams;
  const { id } = await params;

  const product = await fetchProduct(id);

  const selectedSize = size || (product.sizes[0] as string);
  const selectedColor = color || (product.colors[0] as string);
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-16 mt-12 max-w-7xl mx-auto px-4">
      {/* IMAGE */}
      <div className="w-full lg:w-1/2">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <Image
            src={
              (product.images as Record<string, string>)?.[selectedColor] || ""
            }
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      {/* DETAILS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed text-base">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="py-4 border-y border-gray-200">
          <h2 className="text-3xl font-bold tracking-tight">
            ${product.price.toFixed(2)}
          </h2>
        </div>

        {/* Product Interaction */}
        <ProductInteraction
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />

    
        {/* Terms */}
        <div className="pt-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            By clicking Pay Now, you agree to our{" "}
            <a href="#" className="underline hover:text-black font-medium transition-colors">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-black font-medium transition-colors">
              Privacy Policy
            </a>
            . You authorize us to charge your selected payment method for the
            total amount shown. All sales are subject to our return and{" "}
            <a href="#" className="underline hover:text-black font-medium transition-colors">
              Refund Policies
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;