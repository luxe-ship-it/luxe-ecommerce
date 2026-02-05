import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  byline: string;
  category: "shoes" | "purses" | "other" | string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  discount: number;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}



export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if item is in wishlist
  const { data: wishlistQuery } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      try {
        return await apiRequest("GET", "/wishlist");
      } catch {
        return { items: [] };
      }
    }
  });

  const isWishlisted = wishlistQuery?.items?.some((item: any) => item.product.id === product.id) || false;

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      if (isWishlisted) {
        await apiRequest("DELETE", `/wishlist/items/${product.id}`);
      } else {
        await apiRequest("POST", "/wishlist/items", { productId: product.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ title: isWishlisted ? "Removed from wishlist" : "Added to wishlist" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Action failed", description: error.message || "Please login first" });
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/cart/items", { productId: product.id, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to cart" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to add to cart", description: error.message || "Please login first" });
    }
  });

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white border aspect-square mb-4">
        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && (
            <span className="bg-accent text-primary px-3 py-1 rounded text-xs font-semibold">
              NEW
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlistMutation.mutate();
            }}
            className={`p-2 rounded-full transition-colors ${isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/90 text-foreground hover:bg-white"
              }`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCartMutation.mutate();
            }}
            className="p-2 rounded-full bg-accent text-primary hover:bg-accent/90 transition-colors"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-1">
          {product.byline}
        </p>


        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(product.rating)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
