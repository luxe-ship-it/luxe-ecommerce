import { Layout } from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle loading state and errors gracefully
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/wishlist");
        return res;
      } catch (e) {
        return { items: [] }; // Fallback to empty
      }
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("DELETE", `/wishlist/items/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ title: "Removed from wishlist" });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  });

  const items = wishlist?.items || [];

  return (
    <Layout>
      <section className="py-12 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-playfair font-bold text-primary mb-8">My Wishlist</h1>

          {isLoading ? (
            <div>Loading...</div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item: any) => (
                <div key={item.id} className="relative group">
                  <button
                    className="absolute top-2 right-2 z-10 bg-white/80 p-1.5 rounded-full hover:bg-white text-red-500 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlistMutation.mutate(item.product.id);
                    }}
                  >
                    <X size={18} />
                  </button>
                  {/* Reuse ProductCard but map fields carefully */}
                  <ProductCard product={{
                    id: item.product.id,
                    name: item.product.name,
                    byline: item.product.category?.name || "Wishlist Item", // Safely access category name if populated, usually need to include category in query
                    category: "Wishlist",
                    price: Number(item.product.basePrice),
                    originalPrice: Number(item.product.originalPrice || item.product.basePrice),
                    rating: 5,
                    reviewCount: 0,
                    image: item.product.images[0] || "https://via.placeholder.com/300",
                    discount: 0
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
              <Link to="/shop"><Button>Explore Products</Button></Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
