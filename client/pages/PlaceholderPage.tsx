import React from "react";
import { Layout } from "@/components/Layout";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
}) => {
  return (
    <Layout>
      <section className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-12 max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-4">
              This page is coming soon.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};
