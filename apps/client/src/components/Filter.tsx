"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-end gap-3 text-sm my-6">
      <span className="font-medium text-gray-700">Sort by:</span>
      <select
        name="sort"
        id="sort"
        className="border border-black rounded-lg px-4 py-2 bg-white text-black font-medium cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-all"
        onChange={(e) => handleFilter(e.target.value)}
        defaultValue={searchParams.get("sort") || "newest"}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>
  );
};

export default Filter;