import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type User = {
    id: string;
    email: string;
    name: string;
    role: "USER" | "ADMIN";
    phone?: string;
    address?: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await apiRequest("GET", "/auth/me");
                setUser(res.user);
            } catch (error) {
                console.error("Auth check failed", error);
                localStorage.removeItem("token");
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("token", token);
        setUser(user);
        toast({
            title: "Welcome back!",
            description: `Logged in as ${user.name}`,
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        toast({
            title: "Logged out",
            description: "See you soon!",
        });
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
