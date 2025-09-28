"use client";

import { useState } from "react";
import { allProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFavorites } from "@/context/favorites-context";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("all");

  // Vietnamese coffee shop categories as requested by manager
  const categories = [
    "all",
    "favorites",
    "ca-phe-truyen-thong", // Cà phê truyền thống Việt Nam
    "ca-phe-pha-may", // Cà phê pha máy (Espresso-based)
    "tra-tra-sua", // Trà và trà sữa
    "da-xay-smoothie", // Đá xay (Blended/Smoothie)
    "soda-nuoc-giai-khat", // Soda & nước giải khát khác
    "mon-an-kem", // Món ăn kèm
  ];

  // Category display names (Vietnamese/English)
  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, { vi: string; en: string }> = {
      all: { vi: "Tất Cả", en: "All" },
      favorites: { vi: "Yêu Thích", en: "Favorites" },
      "ca-phe-truyen-thong": {
        vi: "Cà Phê Truyền Thống VN",
        en: "Traditional Vietnamese Coffee",
      },
      "ca-phe-pha-may": { vi: "Cà Phê Pha Máy", en: "Espresso-Based Coffee" },
      "tra-tra-sua": { vi: "Trà & Trà Sữa", en: "Tea & Milk Tea" },
      "da-xay-smoothie": { vi: "Đá Xay/Smoothie", en: "Blended/Smoothie" },
      "soda-nuoc-giai-khat": {
        vi: "Soda & Nước Giải Khát",
        en: "Soda & Beverages",
      },
      "mon-an-kem": { vi: "Món Ăn Kèm", en: "Food & Snacks" },
    };
    return categoryNames[category] || { vi: category, en: category };
  };

  const { favorites } = useFavorites();

  let filteredProducts;
  if (activeTab === "all") {
    filteredProducts = allProducts;
  } else if (activeTab === "favorites") {
    filteredProducts = allProducts.filter((p) => favorites.includes(p.id));
  } else {
    filteredProducts = allProducts.filter((p) => p.category === activeTab);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl text-primary">
          Thực Đơn / Our Menu
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          <span className="block">
            Khám phá đa dạng thức uống và món ăn đặc sắc của chúng tôi
          </span>
          <span className="block text-sm md:text-base mt-2 opacity-80">
            Explore our diverse selection of specialty beverages and authentic
            Vietnamese coffee culture
          </span>
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col items-center mb-12"
      >
        {/* Scrollable tabs for better mobile/tablet experience */}
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex h-auto w-max min-w-full justify-start gap-2 p-2 bg-muted rounded-lg">
            {categories.map((category) => {
              const displayName = getCategoryDisplayName(category);
              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex-shrink-0 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold leading-tight">
                      {displayName.vi}
                    </span>
                    <span className="text-xs opacity-75 leading-tight">
                      {displayName.en}
                    </span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Category indicator for mobile */}
        <div className="mt-4 text-center lg:hidden">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">
              {getCategoryDisplayName(activeTab).vi}
            </span>
            {" • "}
            <span className="text-xs">
              {getCategoryDisplayName(activeTab).en}
            </span>
          </p>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-16">
            {activeTab === "favorites" ? (
              <div>
                <p className="text-lg">Chưa có sản phẩm yêu thích!</p>
                <p className="text-sm mt-1">
                  No favorites yet! Heart products to add them here!
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg">Không tìm thấy sản phẩm.</p>
                <p className="text-sm mt-1">No products found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
