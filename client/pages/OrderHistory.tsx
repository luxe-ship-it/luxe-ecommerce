import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, CheckCircle, Clock, XCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function OrderHistory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnType, setReturnType] = useState("RETURN");
  const [returnReason, setReturnReason] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return apiRequest("GET", "/orders");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await apiRequest("POST", `/orders/${orderId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order cancelled successfully", description: "Your refund process has been initiated." });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to cancel", description: error.message });
    }
  });

  const returnOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", `/orders/${data.orderId}/return`, {
        type: data.type,
        reason: data.reason
      });
    },
    onSuccess: () => {
      setReturnModalOpen(false);
      setReturnReason("");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Request submitted", description: "Your return/exchange request has been received." });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to submit", description: error.message });
    }
  });

  const handleCancel = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  const openReturnModal = (order: any) => {
    setSelectedOrder(order);
    setReturnModalOpen(true);
  };

  const submitReturn = () => {
    if (!returnReason.trim()) {
      toast({ variant: "destructive", title: "Reason required", description: "Please provide a reason for the return/exchange." });
      return;
    }
    returnOrderMutation.mutate({
      orderId: selectedOrder.id,
      type: returnType,
      reason: returnReason
    });
  };

  const canCancel = (order: any) => {
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const twelveHours = 12 * 60 * 60 * 1000;
    return (
      orderAge < twelveHours &&
      !['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)
    );
  };

  const canReturn = (order: any) => {
    if (order.status !== 'DELIVERED' || !order.deliveredAt) return false;
    const deliveryAge = Date.now() - new Date(order.deliveredAt).getTime();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    // Also check if return requests exist
    return deliveryAge < threeDays && (!order.returns || order.returns.length === 0);
  };

  if (isLoading) return <Layout><div className="p-12 text-center">Loading orders...</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-playfair font-bold mb-8">Order History</h1>
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">No orders found</p>
              <Link to="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            orders.map((order: any) => (
              <div key={order.id} className="bg-card border rounded-lg overflow-hidden">
                <div className="bg-muted/50 p-4 flex flex-wrap justify-between items-center gap-4 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Placed</p>
                    <p className="font-medium">{format(new Date(order.createdAt), "MMMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">₹{Number(order.totalAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>{order.status}</Badge>
                      {order.trackingNumber && <span className="text-xs text-muted-foreground flex items-center gap-1"><Truck size={10} /> {order.trackingNumber}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {canCancel(order) && (
                      <Button variant="destructive" size="sm" onClick={() => handleCancel(order.id)} disabled={cancelOrderMutation.isPending}>
                        {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
                      </Button>
                    )}

                    {canReturn(order) && (
                      <Button variant="outline" size="sm" onClick={() => openReturnModal(order)} className="gap-2">
                        <RotateCcw size={14} /> Return/Exchange
                      </Button>
                    )}

                    {order.returns && order.returns.length > 0 && (
                      <div className="flex flex-col gap-1">
                        {order.returns.map((ret: any) => (
                          <div key={ret.id} title={ret.adminNotes}>
                            <Badge
                              variant="outline"
                              className={`
                                ${ret.status === 'APPROVED' ? 'border-green-200 bg-green-50 text-green-700' :
                                  ret.status === 'REJECTED' ? 'border-red-200 bg-red-50 text-red-700' :
                                    'border-orange-200 bg-orange-50 text-orange-700'}
                              `}
                            >
                              {ret.type === 'EXCHANGE' ? 'Exchange ' : 'Return '}
                              {ret.status === 'REQUESTED' ? 'Requested' : ret.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                      <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img src={item.product.images[0] || "https://via.placeholder.com/150"} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium mt-1">₹{Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={returnModalOpen} onOpenChange={setReturnModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Return or Exchange</DialogTitle>
            <DialogDescription>
              Orders must be returned within 3 days of delivery.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <RadioGroup value={returnType} onValueChange={setReturnType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="RETURN" id="r1" />
                <Label htmlFor="r1">Return for Refund</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EXCHANGE" id="r2" />
                <Label htmlFor="r2">Exchange for different size/color</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Input
                placeholder="Why are you returning this item?"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnModalOpen(false)}>Cancel</Button>
            <Button onClick={submitReturn} disabled={returnOrderMutation.isPending}>
              {returnOrderMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
