import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Package, Heart, LogOut, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
    const { user, login, logout } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, setValue } = useForm();

    // Set initial values
    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("phone", user.phone);
            setValue("address", user.address);
        }
    }, [user, setValue]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("PUT", "/auth/profile", data);
            return res.user;
        },
        onSuccess: (updatedUser) => {
            // Update local user state
            const token = localStorage.getItem("token");
            if (token) login(token, updatedUser);

            setIsEditing(false);
            toast({ title: "Profile updated successfully" });
        },
        onError: (err: any) => {
            toast({ variant: "destructive", title: "Update failed", description: err.message });
        }
    });

    const onSubmit = (data: any) => {
        updateProfileMutation.mutate(data);
    };

    if (!user) return <Layout><div className="p-12 text-center">Please log in.</div></Layout>;

    return (
        <Layout>
            <section className="py-12 min-h-screen bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Sidebar */}
                        <div className="md:w-1/4">
                            <div className="bg-card border rounded-lg p-6 space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                        {user.name?.[0] || "U"}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>

                                <nav className="space-y-2">
                                    <Link to="/orders" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                                        <Package size={18} /> Order History
                                    </Link>
                                    <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium">
                                        <Heart size={18} /> My Wishlist
                                    </Link>
                                    <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 text-red-600 transition-colors text-sm font-medium">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="md:w-3/4 space-y-6">
                            <div className="bg-card border rounded-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <User className="text-accent" /> Profile Details
                                    </h2>
                                    <Button variant={isEditing ? "ghost" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                                        {isEditing ? "Cancel" : "Edit Profile"}
                                    </Button>
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <Input {...register("name")} placeholder="Your Name" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone Number</Label>
                                                <Input {...register("phone")} placeholder="+91 98765 43210" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Delivery Address</Label>
                                            <Input {...register("address")} placeholder="123 Luxury Lane, Fashion City" />
                                        </div>
                                        <Button type="submit" disabled={updateProfileMutation.isPending}>
                                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Full Name</label>
                                            <p className="mt-1 font-medium">{user.name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email Address</label>
                                            <p className="mt-1 font-medium">{user.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Phone</label>
                                            <p className="mt-1 font-medium">{user?.phone || "Not set"}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Address</label>
                                            <p className="mt-1 font-medium">{user?.address || "Not set"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    );
}
