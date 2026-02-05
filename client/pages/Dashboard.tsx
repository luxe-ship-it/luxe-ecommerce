import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Package, ShoppingBag, Users as UsersIcon, DollarSign, Edit, Truck } from "lucide-react";
import { QueriesTab } from "./QueriesTab";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user || user.role !== "ADMIN") return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-playfair font-bold text-primary mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>Overview</Button>
          <Button variant={activeTab === "products" ? "default" : "outline"} onClick={() => setActiveTab("products")}>Products</Button>
          <Button variant={activeTab === "orders" ? "default" : "outline"} onClick={() => setActiveTab("orders")}>Orders</Button>
          <Button variant={activeTab === "users" ? "default" : "outline"} onClick={() => setActiveTab("users")}>Users</Button>
          <Button variant={activeTab === "coupons" ? "default" : "outline"} onClick={() => setActiveTab("coupons")}>Coupons</Button>
          <Button variant={activeTab === "returns" ? "default" : "outline"} onClick={() => setActiveTab("returns")}>Returns</Button>
          <Button variant={activeTab === "queries" ? "default" : "outline"} onClick={() => setActiveTab("queries")}>Queries</Button>
          <Button variant={activeTab === "settings" ? "default" : "outline"} onClick={() => setActiveTab("settings")}>Settings</Button>
        </div>

        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "coupons" && <CouponsTab />}
        {activeTab === "returns" && <ReturnsTab />}
        {activeTab === "queries" && <QueriesTab />}
      </div>
    </Layout>
  );
}

function ReturnsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: returns, isLoading } = useQuery({
    queryKey: ["returns-admin"],
    queryFn: async () => apiRequest("GET", "/admin/returns")
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string, status: string, adminNotes?: string }) => {
      return apiRequest("PATCH", `/admin/returns/${id}/status`, { status, adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns-admin"] });
      toast({ title: "Return status updated" });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Update failed", description: err.message });
    }
  });

  if (isLoading) return <div>Loading returns...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Return & Exchange Requests</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Type</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {returns?.map((req: any) => (
              <tr key={req.id} className="hover:bg-muted/50">
                <td className="p-4 font-mono">{req.orderId.slice(0, 8)}</td>
                <td className="p-4">
                  <div className="font-medium">{req.order.user.name}</div>
                  <div className="text-xs text-muted-foreground">{req.order.user.email}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${req.type === 'RETURN' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {req.type}
                  </span>
                </td>
                <td className="p-4 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  {req.status === 'REQUESTED' && (
                    <>
                      <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => {
                          if (confirm('Approve this return request? Refund will be initiated.')) {
                            updateStatusMutation.mutate({ id: req.id, status: 'APPROVED' });
                          }
                        }}
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          const note = prompt('Reason for rejection:');
                          if (note !== null) {
                            updateStatusMutation.mutate({ id: req.id, status: 'REJECTED', adminNotes: note });
                          }
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {returns?.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No return requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const { data: announcement, isLoading } = useQuery({
    queryKey: ["announcement-admin"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/settings/announcement");
      return res.message;
    }
  });

  useEffect(() => {
    if (announcement) setMessage(announcement);
  }, [announcement]);

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", "/settings/announcement", { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcement"] });
      toast({ title: "Announcement updated" });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Update failed", description: err.message });
    }
  });

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Announcement Bar Text</Label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter announcement text..."
            />
            <p className="text-xs text-muted-foreground">This text appears at the top of the site in a marquee.</p>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => apiRequest("GET", "/admin/stats")
  });

  if (isLoading) return <div>Loading stats...</div>;

  const cards = [
    { title: "Total Revenue", value: `₹${stats?.totalRevenue || 0}`, icon: DollarSign },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag },
    { title: "Total Users", value: stats?.totalUsers || 0, icon: UsersIcon },
    { title: "Total Products", value: stats?.totalProducts || 0, icon: Package },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-card p-6 rounded-lg border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
          </div>
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <card.icon size={24} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsTab() {
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue } = useForm();

  // Reset file/state when form closes/opens
  useEffect(() => {
    if (!isFormOpen) {
      setSelectedImage(null);
      reset();
    }
  }, [isFormOpen, reset]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-admin"],
    queryFn: async () => apiRequest("GET", "/products")
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => apiRequest("GET", "/products/categories")
  });

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setValue("name", editingProduct.name);
      setValue("categoryId", editingProduct.categoryId);
      setValue("description", editingProduct.description);
      setValue("basePrice", editingProduct.basePrice);
      setValue("originalPrice", editingProduct.originalPrice);
      setValue("stock", editingProduct.stock);
      setValue("image", editingProduct.images[0] || "");
      setValue("isFeatured", editingProduct.isFeatured || false);
      setIsFormOpen(true);
    } else {
      reset();
    }
  }, [editingProduct, setValue, reset]);

  const mutationFn = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('categoryId', data.categoryId);
    formData.append('description', data.description || '');
    formData.append('basePrice', data.basePrice.toString());
    if (data.originalPrice) formData.append('originalPrice', data.originalPrice.toString());
    formData.append('stock', data.stock.toString());
    formData.append('isFeatured', String(Boolean(data.isFeatured)));

    if (selectedImage) {
      formData.append('image', selectedImage);
    } else if (data.image) {
      formData.append('image', data.image);
    }

    if (editingProduct) {
      return apiRequest("PUT", `/products/${editingProduct.id}`, formData);
    } else {
      return apiRequest("POST", "/products", formData);
    }
  };

  const productMutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      setIsFormOpen(false);
      setEditingProduct(null);
      setSelectedImage(null);
      reset();
      toast({ title: editingProduct ? "Product updated" : "Product created" });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Operation failed", description: err.message });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      toast({ title: "Product deleted" });
    }
  });

  const onSubmit = (data: any) => {
    productMutation.mutate(data);
  };

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={() => { setEditingProduct(null); setIsFormOpen(!isFormOpen); }}>
          {isFormOpen ? "Cancel" : <><Plus size={16} className="mr-2" /> Add Product</>}
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-card border p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">{editingProduct ? "Edit Product" : "New Product"}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input {...register("name", { required: true })} placeholder="Luxury Item" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select {...register("categoryId", { required: true })} className="w-full h-10 px-3 border rounded-md bg-background">
                  <option value="">Select Category</option>
                  {categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input {...register("description")} placeholder="Product description" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Sales Price (₹)</Label>
                <Input type="number" {...register("basePrice", { required: true })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Original Price (₹)</Label>
                <Input type="number" {...register("originalPrice")} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" {...register("stock", { required: true })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex flex-col gap-2">
                  {editingProduct && !selectedImage && (
                    <div className="text-xs text-muted-foreground">
                      Current Image: <a href={editingProduct.images?.[0]} target="_blank" className="underline text-primary">View</a>
                      <input type="hidden" {...register("image")} />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setSelectedImage(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isFeatured" {...register("isFeatured")} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <Label htmlFor="isFeatured">Featured Product (Show on Home Page)</Label>
            </div>
            <Button type="submit" disabled={productMutation.isPending}>
              {productMutation.isPending ? "Saving..." : (editingProduct ? "Update Product" : "Create Product")}
            </Button>
          </form>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products?.map((p: any) => (
              <tr key={p.id} className="hover:bg-muted/50">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{p.category?.name}</td>
                <td className="p-4">
                  <div>
                    ₹{p.basePrice}
                    {p.originalPrice && <span className="text-xs text-muted-foreground line-through ml-2">₹{p.originalPrice}</span>}
                  </div>
                </td>
                <td className="p-4">{p.isFeatured ? "Yes" : "No"}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditingProduct(p)} className="text-primary hover:bg-primary/10 mr-2">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteProductMutation.mutate(p.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders-admin"],
    queryFn: async () => apiRequest("GET", "/admin/orders")
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, trackingNumber }: { id: string, status: string, trackingNumber?: string }) => {
      return apiRequest("PATCH", `/admin/orders/${id}/shipping`, { status, trackingNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      toast({ title: "Order status updated" });
      setShippingModalOpen(false);
      setTrackingNumber("");
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Failed to update status", description: err.message });
    }
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === 'SHIPPED') {
      setSelectedOrderId(orderId);
      setShippingModalOpen(true);
    } else {
      updateStatusMutation.mutate({ id: orderId, status: newStatus });
    }
  };

  const confirmShipping = () => {
    if (!selectedOrderId) return;
    updateStatusMutation.mutate({
      id: selectedOrderId,
      status: 'SHIPPED',
      trackingNumber
    });
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Recent Orders</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders?.map((order: any) => (
              <tr key={order.id} className="hover:bg-muted/50">
                <td className="p-4 font-mono">{order.id.slice(0, 8)}</td>
                <td className="p-4">
                  <div className="font-medium">{order.user?.name}</div>
                  <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Phone: {order.shippingAddress?.phone || order.user?.phone || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground italic mt-1 max-w-[200px] truncate">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}
                  </div>
                </td>
                <td className="p-4 font-medium">₹{Number(order.totalAmount).toLocaleString()}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium border ${order.paymentMethod === 'COD'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}
                    </span>
                    {order.paymentMethod === 'ONLINE' && (
                      <span className={`text-xs font-medium ${order.payment?.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                        {order.payment?.status === 'COMPLETED' ? 'Paid' : 'Pending'}
                      </span>
                    )}
                    {order.payment?.razorpayPaymentId && (
                      <span className="text-[10px] text-muted-foreground font-mono" title="Payment ID">
                        ID: {order.payment.razorpayPaymentId.slice(-8)}...
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {order.status}
                  </span>
                  {order.trackingNumber && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Truck size={10} /> {order.trackingNumber}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <select
                    className="h-8 text-xs border rounded bg-background px-2"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={order.status === 'CANCELLED'}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={shippingModalOpen} onOpenChange={setShippingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Shipped</DialogTitle>
            <DialogDescription>
              Enter tracking information for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tracking Number</Label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. TRK123456789"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmShipping} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UsersTab() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users-admin"],
    queryFn: async () => apiRequest("GET", "/admin/users")
  });

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Management</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users?.map((u: any) => (
              <tr key={u.id} className="hover:bg-muted/50">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>{u.role}</span>
                </td>
                <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-muted-foreground text-xs">
                  {/* Placeholder for address or other details if needed in future */}
                  ID: {u.id.slice(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CouponsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons-admin"],
    queryFn: async () => apiRequest("GET", "/coupons")
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        value: Number(data.value),
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
        minOrder: data.minOrder ? Number(data.minOrder) : undefined,
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined
      };
      await apiRequest("POST", "/coupons", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons-admin"] });
      reset();
      toast({ title: "Coupon created" });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons-admin"] });
      toast({ title: "Coupon deleted" });
    }
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input {...register("code", { required: true })} placeholder="SUMMER2026" className="uppercase" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select {...register("type", { required: true })} className="w-full h-10 px-3 border rounded-md">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input type="number" {...register("value", { required: true })} placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label>Min Order (₹)</Label>
              <Input type="number" {...register("minOrder")} placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Max Discount (₹)</Label>
              <Input type="number" {...register("maxDiscount")} placeholder="On % type" />
            </div>
            <div className="space-y-2">
              <Label>Usage Limit</Label>
              <Input type="number" {...register("usageLimit")} placeholder="Total usage count" />
            </div>
            <div className="space-y-2">
              <Label>Expires At</Label>
              <Input type="date" {...register("expiresAt")} />
            </div>
          </div>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Coupon"}
          </Button>
        </form>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Type</th>
              <th className="p-4">Value</th>
              <th className="p-4">Usage</th>
              <th className="p-4">Expires</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons?.map((c: any) => (
              <tr key={c.id} className="hover:bg-muted/50">
                <td className="p-4 font-mono font-bold">{c.code}</td>
                <td className="p-4">{c.type}</td>
                <td className="p-4 text-green-600 font-medium">
                  {c.type === 'FLAT' ? `₹${c.value}` : `${c.value}%`}
                </td>
                <td className="p-4">
                  {c.currentUsage} {c.usageLimit ? `/ ${c.usageLimit}` : '(Unlimited)'}
                </td>
                <td className="p-4">
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(c.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
            {coupons?.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No active coupons</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
