"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const searchValue = searchParams.get("search");
    if (searchValue) {
      setValue(searchValue);
    }
  }, [searchParams]);

  const handleSearch = (searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setValue("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div 
      className={`
        hidden sm:flex items-center gap-2.5 
        rounded-lg px-3 py-1.5
        bg-white
        transition-all duration-200 ease-in-out
        ${isFocused 
          ? 'ring-2 ring-gray-500 shadow-lg' 
          : 'ring-1 ring-gray-300 shadow-sm hover:shadow-md hover:ring-gray-400'
        }
      `}
    >
      <Search 
        className={`w-4 h-4 transition-colors duration-200 ${
          isFocused ? 'text-gray-500' : 'text-gray-400'
        }`} 
      />
      <input
        id="search"
        placeholder="Search products..."
        value={value}
        className="text-sm outline-none flex-1 min-w-[200px] text-gray-900 placeholder:text-gray-400"
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(value);
          } else if (e.key === "Escape") {
            handleClear();
          }
        }}
      />
      {value && (
        <button
          onClick={handleClear}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-150 group"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;