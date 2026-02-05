import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, Minus, Plus, Heart, Share2 } from "lucide-react";
import { useState } from "react";

export default function Product() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      return apiRequest("GET", `/products/${id}`);
    },
  });

  if (error) {
    console.error("Product Query Error:", error);
    return <Layout><div className="p-12 text-center text-red-500">Error loading product: {error.message}</div></Layout>;
  }

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/cart/items", { productId: id, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to cart" });
    },
    onError: (error: any) => {
      if (error.message.includes("Unauthorized") || error.message.includes("401")) {
        toast({ variant: "destructive", title: "Please Login", description: "You need to be logged in to add items to cart." });
        navigate("/auth");
      } else {
        toast({ variant: "destructive", title: "Failed to add", description: error.message });
      }
    }
  });

  const { data: wishlistQuery } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      try {
        return await apiRequest("GET", "/wishlist");
      } catch (e) {
        return { items: [] };
      }
    },
  });

  const wishlistItems = wishlistQuery?.items || [];
  const isInWishlist = wishlistItems.some((item: any) => item.id === id || item.productId === id);

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("POST", "/wishlist/items", { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ title: "Added to wishlist" });
    },
    onError: (error: any) => {
      if (error.message.includes("Unauthorized") || error.message.includes("401")) {
        toast({ variant: "destructive", title: "Please Login", description: "You need to be logged in." });
        navigate("/auth");
      } else {
        toast({ variant: "destructive", title: "Failed to add", description: error.message });
      }
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("DELETE", `/wishlist/items/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ title: "Removed from wishlist" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to remove", description: error.message });
    }
  });

  if (isLoading) return <Layout><div className="p-12 text-center">Loading...</div></Layout>;
  if (!product) return <Layout><div className="p-12 text-center">Product not found</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <img src={product.images?.[0] || "https://via.placeholder.com/600"} alt={product.name} className="w-full h-full object-contain p-4" />
            </div>
            {/* Thumbnail support can go here */}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-playfair font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-accent">
                <Star size={18} fill="currentColor" />
                <span className="ml-1 font-medium">
                  {product.reviews && product.reviews.length > 0
                    ? (product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
                    : "New"}
                </span>
              </div>
              <span className="text-muted-foreground">
                {product.reviews?.length || 0} Reviews
              </span>
            </div>

            <p className="text-2xl font-bold mb-6">₹{Number(product.basePrice).toLocaleString()}</p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border rounded-md">
                <button className="p-2 hover:bg-muted" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button className="p-2 hover:bg-muted" onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
              </div>
              <Button
                className="flex-1 py-6 text-lg"
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending || product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : (addToCartMutation.isPending ? "Adding..." : "Add to Cart")}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14"
                onClick={() => {
                  if (isInWishlist) {
                    removeFromWishlistMutation.mutate(id!);
                  } else {
                    addToWishlistMutation.mutate(id!);
                  }
                }}
              >
                <Heart size={20} className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
              </Button>
            </div>

            <div className="border-t pt-6 space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-semibold w-24">Category:</span>
                <span className="text-muted-foreground capitalize">{product.category?.name || "General"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-24">Stock:</span>
                <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 pt-12 border-t">
              <h2 className="text-2xl font-playfair font-bold mb-8">Customer Reviews</h2>

              {/* Reviews List */}
              <div className="space-y-6 mb-8">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-accent">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-muted"} />
                          ))}
                        </div>
                        <span className="font-semibold text-sm">{review.user?.name || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No reviews yet. Be the first to review!</p>
                )}
              </div>

              {/* Add Review Form */}
              <AddReviewForm productId={id!} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function AddReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/products/${productId}/reviews`, { rating, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast({ title: "Review submitted!" });
      setComment("");
      setRating(5);
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to submit review" });
    }
  });

  return (
    <div className="bg-muted/30 p-6 rounded-lg">
      <h3 className="font-semibold mb-4">Write a Review</h3>
      <div className="flex items-center gap-1 mb-4">
        <span className="mr-2 text-sm">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)} type="button">
            <Star size={20} className={star <= rating ? "text-accent fill-accent" : "text-muted-foreground"} />
          </button>
        ))}
      </div>
      <textarea
        className="w-full p-3 rounded-md border text-sm mb-4 bg-background"
        placeholder="Share your thoughts..."
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}
