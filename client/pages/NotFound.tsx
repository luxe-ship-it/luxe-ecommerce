import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <section className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-7xl font-playfair font-bold text-primary mb-4">
            404
          </h1>
          <p className="text-2xl text-foreground mb-4 font-playfair">
            Page Not Found
          </p>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sorry, the page you're looking for doesn't exist. It might have been
            moved or deleted. Let's get you back on track.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
