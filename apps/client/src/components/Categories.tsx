"use client";
import {
  Footprints,
  Glasses,
  Briefcase,
  Shirt,
  ShoppingBasket,
  Hand,
  User,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
  {
    name: "All",
    icon: ShoppingBasket,
    slug: "all",
  },
  {
    name: "T-shirts",
    icon: Shirt,
    slug: "t-shirts",
  },
  {
    name: "Shoes",
    icon: Footprints,
    slug: "shoes",
  },
  {
    name: "Accessories",
    icon: Glasses,
    slug: "accessories",
  },
  {
    name: "Bags",
    icon: Briefcase,
    slug: "bags",
  },
  {
    name: "Dresses",
    icon: User,
    slug: "dresses",
  },
  {
    name: "Jackets",
    icon: Shirt,
    slug: "jackets",
  },
  {
    name: "Gloves",
    icon: Hand,
    slug: "gloves",
  },
];

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex items-center gap-2 pb-2 min-w-max">
        {categories.map((category) => {
          const isSelected = category.slug === selectedCategory;
          const Icon = category.icon;
          
          return (
            <button
              key={category.slug}
              onClick={() => handleChange(category.slug)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg
                whitespace-nowrap text-sm font-medium
                transition-all duration-200 ease-in-out
                ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100 border border-black"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;