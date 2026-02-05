import React from "react";
import HeroSlideshow from "./HeroSlideshow";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import hero12 from "../assets/Herophotos/h12.jpeg";

import {
  Truck,
  Shield,
  RotateCcw,
  Award,
  Instagram,
  Star,
} from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    city: "Mumbai",
    rating: 5,
    comment:
      "The quality is exceptional! Luxury at affordable prices. Highly recommended.",
  },
  {
    name: "Rahul Patel",
    city: "Bangalore",
    rating: 5,
    comment:
      "Fast delivery and premium packaging. My shoes fit perfectly and look amazing.",
  },
  {
    name: "Anjali Desai",
    city: "Delhi",
    rating: 5,
    comment:
      "Best purse I've ever owned. The craftsmanship is incredible for the price.",
  },
];

export default function Home() {
  const transformProduct = (p: any) => {
    const avgRating = p.reviews && p.reviews.length > 0
      ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length
      : 0;

    return {
      id: p.id,
      name: p.name,
      byline: p.description?.substring(0, 50) + (p.description?.length > 50 ? "..." : "") || "Luxury Item",
      category: p.category?.name || "General",
      price: Number(p.basePrice),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : 0,
      rating: avgRating,
      reviewCount: p.reviews?.length || 0,
      image: p.images?.[0] || hero12, // Fallback image
      discount: p.originalPrice && p.basePrice
        ? Math.round(((Number(p.originalPrice) - Number(p.basePrice)) / Number(p.originalPrice)) * 100)
        : 0,
      isNew: new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // New if < 7 days
    };
  };

  const { data: featuredProducts } = useQuery({
    queryKey: ["products-featured"],
    queryFn: async () => apiRequest("GET", "/products?featured=true"),
    select: (data) => data.map(transformProduct)
  });

  const { data: newArrivals } = useQuery({
    queryKey: ["products-new"],
    queryFn: async () => apiRequest("GET", "/products?sort=newest"),
    select: (data) => data.map(transformProduct)
  });


  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/20 via-background to-primary/5 pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-playfair font-bold text-primary leading-tight mb-4">
                  Luxury at Affordable Prices
                </h1>
                <p className="text-lg text-muted-foreground">
                  Discover premium unisex shoes and purses designed for the modern Indian
                  shopper. Quality, elegance, and value combined.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop?category=shoes"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors text-center"
                >
                  Shop Shoes
                </Link>
                <Link
                  to="/shop?category=purses"
                  className="px-8 py-3 border-2 border-primary text-primary rounded font-semibold hover:bg-primary/5 transition-colors text-center"
                >
                  Shop Purses
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <Shield size={24} className="text-accent" />
                  <div>
                    <p className="text-sm font-semibold">Secure Payments</p>
                    <p className="text-xs text-muted-foreground">
                      100% encrypted & safe
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={24} className="text-accent" />
                  <div>
                    <p className="text-sm font-semibold">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">
                      3-Day Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <HeroSlideshow />     {/* **************** USP ****************** */}

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-3">
              Featured Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked luxury pieces that define elegance and comfort
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
            {featuredProducts?.slice(0, 12).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {(!featuredProducts || featuredProducts.length === 0) && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Featured products coming soon. Check back later!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-playfair font-bold text-primary mb-12 text-center">
            Shop by Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shoes Category */}
            <Link
              to="/shop?category=shoes"
              className="relative group overflow-hidden rounded-lg h-96"
            >
              <img
                src={hero12}
                alt="Shoes"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-4xl font-playfair font-bold text-white mb-3">
                    Premium Shoes
                  </h3>
                  <p className="text-white/90 mb-4">
                    Unisex collection for every occasion
                  </p>
                  <button className="px-6 py-2 bg-accent text-primary rounded font-semibold hover:bg-accent/90 transition-colors">
                    Explore
                  </button>
                </div>
              </div>
            </Link>

            {/* Purses Category */}
            <Link
              to="/shop?category=purses"
              className="relative group overflow-hidden rounded-lg h-96"
            >
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop"
                alt="Purses"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-4xl font-playfair font-bold text-white mb-3">
                    Luxury Purses
                  </h3>
                  <p className="text-white/90 mb-4">
                    Elegant designs for the modern woman
                  </p>
                  <button className="px-6 py-2 bg-accent text-primary rounded font-semibold hover:bg-accent/90 transition-colors">
                    Explore
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-3">
              New Arrivals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fresh styles added weekly to keep your wardrobe current
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
            {newArrivals?.slice(0, 12).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {(!newArrivals || newArrivals.length === 0) && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                New arrivals coming soon.
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-block px-8 py-3 border-2 border-primary text-primary rounded font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-3">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4">{review.comment}</p>
                <div>
                  <p className="font-semibold text-foreground">
                    {review.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{review.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Truck size={40} className="text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                Free Shipping
              </h3>
              <p className="text-sm text-muted-foreground">
                On orders above ₹999 across India
              </p>
            </div>

            <div className="text-center">
              <RotateCcw size={40} className="text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                7-Day Returns
              </h3>
              <p className="text-sm text-muted-foreground">
                Hassle-free return policy
              </p>
            </div>

            <div className="text-center">
              <Shield size={40} className="text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                Secure Payments
              </h3>
              <p className="text-sm text-muted-foreground">
                Multiple payment methods including UPI
              </p>
            </div>

            <div className="text-center">
              <Award size={40} className="text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                Premium Quality
              </h3>
              <p className="text-sm text-muted-foreground">
                Certified and authentic products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Preview */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Instagram size={28} className="text-accent" />
              <h2 className="text-4xl font-playfair font-bold text-primary">
                @luxe.in
              </h2>
            </div>
            <p className="text-muted-foreground">
              Follow us on Instagram for style inspiration and exclusive offers
            </p>
          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/*[1, 2, 3, 4].map((idx) => (
              <a
                key={idx}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={`https://images.unsplash.com/photo-154${2 + idx}291026-7eec264c27ff?w=400&h=400&fit=crop`}
                  alt={`Instagram post ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Instagram size={32} className="text-white" />
                </div>
              </a>
            ))*/}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-accent text-primary rounded font-semibold hover:bg-accent/90 transition-colors"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Limited Time Offers Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary via-primary to-primary/80 p-12 text-center text-primary-foreground">
            <div className="relative z-10">
              <h2 className="text-4xl font-playfair font-bold mb-3">
                Limited Time Offer
              </h2>
              <p className="text-lg mb-6">
                Upto flat 70% OFF on all items. {/*Use code: LUXE50*/}
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-accent text-primary rounded font-semibold hover:bg-accent/90 transition-colors"
              >
                Shop Now
              </Link>
            </div>
            <div className="absolute top-0 right-0 text-accent/10 text-9xl font-playfair font-bold">
              70%
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
