import { Layout } from "@/components/Layout";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

type CheckoutForm = {
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default function Checkout() {
  const { user } = useAuth();
  const { register, handleSubmit, setValue } = useForm<CheckoutForm>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const couponCode = location.state?.couponCode;
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");

  useEffect(() => {
    // Pre-fill from user profile
    if (user) {
      if (user.phone) setValue("phone", user.phone);
      if (user.address) setValue("street", user.address);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [user, setValue]);

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const order = await apiRequest("POST", "/orders", {
        shippingAddress: data,
        couponCode,
        paymentMethod
      });
      return order;
    },
  });

  const initPaymentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return apiRequest("POST", "/payment/create-order", { orderId });
    },
    onSuccess: (data, orderId) => {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) {
        toast({ variant: "destructive", title: "Configuration Error", description: "VITE_RAZORPAY_KEY_ID is missing" });
        return;
      }
      const options = {
        key: key,
        amount: data.amount,
        currency: data.currency,
        name: "LUXE",
        description: "Transaction",
        order_id: data.id,
        handler: async function (response: any) {
          try {
            await apiRequest("POST", "/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast({ title: "Payment Successful", description: "Your order has been placed." });
            navigate("/orders");
          } catch (error) {
            toast({ variant: "destructive", title: "Payment Verification Failed" });
          }
        },
        modal: {
          ondismiss: async function () {
            // User closed the payment modal without completing payment
            try {
              await apiRequest("POST", `/orders/${orderId}/cancel`);
              toast({
                variant: "destructive",
                title: "Payment Cancelled",
                description: "Your order has been cancelled."
              });
            } catch (error) {
              console.error("Failed to cancel order:", error);
            }
          }
        },
        prefill: {
          name: user?.name || "User Name",
          email: user?.email || "user@example.com",
          contact: user?.phone || "9999999999"
        },
        theme: {
          color: "#000000"
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },
    onError: (error: any) => {
      console.error("Payment initialization error:", error);
      toast({ variant: "destructive", title: "Payment Initialization Failed", description: error.message });
    }
  });

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const order = await createOrderMutation.mutateAsync(data);

      if (paymentMethod === "COD") {
        // For COD, order is placed without payment
        toast({ title: "Order Placed!", description: "Your order will be delivered soon. Pay on delivery." });
        navigate("/orders");
      } else {
        // For online payment, proceed to Razorpay
        initPaymentMutation.mutate(order.id);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Checkout Failed", description: error.message });
    }
  };

  return (
    <Layout>
      <section className="py-12 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-playfair font-bold text-primary mb-8 text-center">Checkout</h1>

          <div className="bg-card border rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register("phone", { required: true })} placeholder="+91 99999 99999" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" {...register("street", { required: true })} placeholder="123 Luxury Ave" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city", { required: true })} placeholder="New York" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...register("state", { required: true })} placeholder="NY" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" {...register("zip", { required: true })} placeholder="10001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register("country", { required: true })} placeholder="United States" />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-4 border-t">
                <Label>Payment Method</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === "ONLINE"}
                      onChange={() => setPaymentMethod("ONLINE")}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="online" className="font-normal cursor-pointer">
                      Online Payment (Razorpay)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="cod" className="font-normal cursor-pointer">
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full text-lg py-6" disabled={createOrderMutation.isPending || initPaymentMutation.isPending}>
                  {createOrderMutation.isPending || initPaymentMutation.isPending ? "Processing..." : "Place Order & Pay"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
