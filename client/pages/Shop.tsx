import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [sortBy, setSortBy] = useState("featured");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", category, searchParams.get("search"), sortBy],
    queryFn: async () => {
      let query = `/products?`;
      const search = searchParams.get("search");

      if (category) query += `category=${category}&`;
      if (search) query += `search=${search}&`;

      // Handle sort mapping
      if (sortBy === 'price-low') query += `sort=price_asc&`;
      else if (sortBy === 'price-high') query += `sort=price_desc&`;
      else if (sortBy === 'newest') query += `sort=newest&`;
      // 'featured' sort doesn't filter, just default order or could add explicit sort logic if backed supports it. 
      // Current backend default is fine for 'all products'.

      const res = await apiRequest("GET", query);
      return res.map((p: any) => ({
        id: p.id,
        name: p.name,
        byline: p.description?.substring(0, 50) + (p.description?.length > 50 ? "..." : "") || p.category?.name || "Luxury Item",
        category: p.category?.name || "other",
        price: Number(p.basePrice),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : 0,
        rating: 4.5, // Placeholder
        reviewCount: 0,
        image: p.images?.[0] || "https://images.unsplash.com/photo-1549298916-b41d501d3772", // Fallback
        discount: p.originalPrice && p.basePrice
          ? Math.round(((Number(p.originalPrice) - Number(p.basePrice)) / Number(p.originalPrice)) * 100)
          : 0,
        isNew: new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }));
    }
  });

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-2">
            {searchParams.get("search") ? `Search Results: "${searchParams.get("search")}"` : (category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Products")}
          </h1>
          <p className="text-muted-foreground">
            Showing {products.length} products
          </p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} className="text-accent" />
                  <h3 className="font-semibold text-foreground">Filters</h3>
                </div>

                {/* Sort */}
                <div className="mb-8 pb-8 border-b border-border">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div>Loading...</div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No products found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
