import { Layout } from "@/components/Layout";
import { Award, Heart, Shield, Users, Target, Sparkles, TrendingUp, Globe } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/20 via-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-primary mb-6">
              About LUXE
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Where Luxury Meets Affordability
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-playfair font-bold text-primary mb-4">Our Story</h2>
              <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Founded in 2026, LUXE was born from a simple yet powerful vision: to make luxury accessible to everyone.
                We recognized a gap in the Indian market where premium quality products were often priced beyond reach,
                while affordable options compromised on craftsmanship and design.
              </p>
              <p>
                Our journey began with a commitment to redefine luxury shopping in India. We partnered with skilled
                artisans and manufacturers who share our passion for excellence, enabling us to offer premium unisex
                shoes and purses at prices that don't break the bank.
              </p>
              <p>
                Today, LUXE serves thousands of customers across India, delivering not just products, but experiences
                that blend elegance, comfort, and value. Every item in our collection is carefully curated to ensure
                it meets our rigorous standards of quality and style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-accent" size={32} />
              </div>
              <h3 className="font-playfair font-bold text-xl mb-3">Quality First</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Every product undergoes rigorous quality checks to ensure excellence.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-accent" size={32} />
              </div>
              <h3 className="font-playfair font-bold text-xl mb-3">Customer Love</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our success. We're committed to providing exceptional service and support.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-accent" size={32} />
              </div>
              <h3 className="font-playfair font-bold text-xl mb-3">Transparency</h3>
              <p className="text-muted-foreground">
                Honest pricing, authentic products, and clear communication. No hidden costs, no surprises.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-accent" size={32} />
              </div>
              <h3 className="font-playfair font-bold text-xl mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Constantly evolving our designs and processes to bring you the latest trends and best experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-accent" size={32} />
                <h3 className="font-playfair font-bold text-2xl">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To democratize luxury fashion in India by offering premium quality shoes and purses that combine
                exceptional craftsmanship, contemporary design, and affordability. We strive to empower every
                individual to express their unique style without financial constraints.
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent/5 to-primary/5 border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-accent" size={32} />
                <h3 className="font-playfair font-bold text-2xl">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To become India's most trusted and loved brand for affordable luxury accessories, setting new
                standards in quality, design, and customer experience. We envision a future where premium fashion
                is accessible to all, transcending economic boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-4">Why Choose LUXE?</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-accent" size={40} />
              </div>
              <h3 className="font-playfair font-bold text-xl mb-3">10,000+ Happy Customers</h3>
              <p className="text-muted-foreground">
                Join thousands of satisfied customers across India who trust LUXE for their fashion needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-accent" size={40} />
              </div>
              <h3 className="font-playfair font-bold text-xl mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">
                Handpicked products that undergo strict quality control to ensure durability and elegance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-accent" size={40} />
              </div>
              <h3 className="font-playfair font-bold text-xl mb-3">Secure Shopping</h3>
              <p className="text-muted-foreground">
                100% secure payments, easy returns, and dedicated customer support for a worry-free experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-6">Our Commitment to You</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              At LUXE, we're more than just an e-commerce platform. We're your style partner, committed to
              delivering exceptional products and experiences. Every purchase you make supports our vision of
              making luxury accessible, while our 3-day return policy and dedicated customer service ensure
              your complete satisfaction.
            </p>
            <p className="text-xl font-semibold text-primary">
              Thank you for choosing LUXE. Together, let's redefine luxury.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
