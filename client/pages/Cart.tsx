import { Layout } from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function Cart() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      return apiRequest("GET", "/cart");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await apiRequest("DELETE", `/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Item removed" });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      await apiRequest("PUT", `/cart/items/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isLoading) {
    return <Layout><div className="p-8 text-center">Loading cart...</div></Layout>;
  }


  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.product.basePrice) * item.quantity), 0);
  const shipping = 0; // Free shipping for now

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  const applyCouponMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/coupons/apply", { code: couponCode, cartTotal: subtotal });
      return res;
    },
    onSuccess: (data) => {
      setAppliedCoupon(data);
      toast({ title: "Coupon applied!", description: `Saved ₹${data.discountAmount}` });
    },
    onError: (err: any) => {
      setAppliedCoupon(null);
      toast({ variant: "destructive", title: "Invalid Coupon", description: err.message });
    }
  });

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = async () => {
    // Pass coupon code to checkout page via state or context (simple approach: query param or localStorage usually, 
    // but here we might just need to persist it. For now, since checkout is not fully implemented in provided context, 
    // we assume the user proceeds. Ideally, we'd pass this state to the order creation step.)

    // Since order creation happens at payment step, we'll store this in localStorage temporarily or just pass it as state if we were navigating to a clear checkout page.
    // Given the flow defined previously (Order created -> Payment), we might want to store it.
    // A better approach for this app's flow might be to pass it in navigation state.
    navigate("/checkout", { state: { couponCode: appliedCoupon?.code } });
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <p className="text-xl mb-4">Your cart is empty</p>
              <Link to="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-card border rounded-lg">
                    <div className="w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img src={item.product.images[0] || "https://via.placeholder.com/150"} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <button onClick={() => removeItemMutation.mutate(item.id)} className="text-destructive hover:text-destructive/80">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-muted-foreground mb-4">₹{Number(item.product.basePrice).toLocaleString()}</p>

                      <div className="flex items-center gap-3">
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantityMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}>
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantityMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}>
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card border rounded-lg p-6 sticky top-20">
                  <h2 className="text-xl font-playfair font-bold mb-4">Order Summary</h2>

                  {/* Coupon Input */}
                  <div className="mb-6 space-y-2">
                    <Label>Coupon Code</Label>
                    <div className="flex gap-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 uppercase"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={!!appliedCoupon}
                      />
                      {appliedCoupon ? (
                        <Button variant="outline" onClick={clearCoupon} className="text-destructive border-destructive hover:bg-destructive/10">Remove</Button>
                      ) : (
                        <Button onClick={() => applyCouponMutation.mutate()} disabled={!couponCode || applyCouponMutation.isPending}>
                          {applyCouponMutation.isPending ? "..." : "Apply"}
                        </Button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <p className="text-xs text-green-600 font-medium">
                        Coupon "{appliedCoupon.code}" applied!
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>₹{shipping.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t flex justify-between font-bold text-lg text-foreground">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
