import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/use-toast";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, login } = useAuth();
  const { toast } = useToast();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      // Return empty if not logged in to avoid 401 loop if API requires strict auth
      if (!user) return { items: [] };
      try {
        return await apiRequest("GET", "/cart");
      } catch {
        return { items: [] };
      }
    },
    enabled: !!user
  });

  const cartCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const { data: wishlistQuery } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      // Return empty if not logged in
      if (!user) return { items: [] };
      try {
        return await apiRequest("GET", "/wishlist");
      } catch {
        return { items: [] };
      }
    },
    enabled: !!user
  });

  const wishlistCount = wishlistQuery?.items?.length || 0;

  return (
    <>
      <header className="mt-10 border-b border-border sticky top-10 z-40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-primary font-playfair tracking-tight"
            >
              LUXÉ
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Shop
              </Link>
              <div className="group relative h-full flex items-center">
                <button className="text-sm font-medium text-foreground hover:text-accent transition-colors flex items-center gap-1 h-full">
                  Categories
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 hidden group-hover:block pt-2 w-48 z-50">
                  <div className="bg-card border border-border rounded-md py-2 shadow-lg">
                    <Link
                      to="/shop?category=shoes"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Unisex Shoes
                    </Link>
                    <Link
                      to="/shop?category=purses"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Purses
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                to="/about"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Right Side - Icons */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {/* Search */}
                  {/* Search */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem('search') as HTMLInputElement;
                      if (input.value.trim()) {
                        window.location.href = `/shop?search=${encodeURIComponent(input.value)}`;
                      }
                    }}
                    className="relative hidden sm:block"
                  >
                    <input
                      name="search"
                      type="text"
                      placeholder="Search..."
                      className="pl-8 pr-4 py-1 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-accent bg-background"
                    />
                    <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </form>
                  <button className="sm:hidden text-foreground hover:text-accent transition-colors">
                    <Search size={20} />
                  </button>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="relative text-foreground hover:text-accent transition-colors"
                  >
                    <Heart size={20} />
                    {(wishlistQuery?.items?.length || 0) > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistQuery?.items?.length || 0}
                      </span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="relative text-foreground hover:text-accent transition-colors"
                  >
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User Profile */}
                  <div className="relative group">
                    <Link to="/account" className="text-foreground hover:text-accent transition-colors">
                      <User size={20} className="text-accent" />
                    </Link>
                    <div className="absolute right-0 hidden group-hover:block bg-card border border-border rounded-md py-2 mt-0 w-32 shadow-lg z-50">
                      <Link to="/account" className="block px-4 py-2 text-sm hover:bg-muted">My Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-muted">Orders</Link>
                      {user.role === 'ADMIN' && <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-muted">Admin</Link>}
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-muted text-destructive flex gap-2 items-center">
                        Logout <LogOut size={12} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                    Sign In
                  </Link>
                  <Link to="/signup" className="hidden sm:inline-flex h-9 px-4 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-foreground hover:text-accent transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 border-t border-border">
              <Link
                to="/"
                className="block px-0 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block px-0 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/shop?category=shoes"
                className="block px-0 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Unisex Shoes
              </Link>
              <Link
                to="/shop?category=purses"
                className="block px-0 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Purses
              </Link>
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="block px-0 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-0 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-0 py-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-0 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
};
