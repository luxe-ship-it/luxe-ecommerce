import { Layout } from "@/components/Layout";
import { RotateCcw, Package, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

export default function Returns() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/20 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <RotateCcw className="text-accent" size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-primary mb-4">
              Returns & Refunds
            </h1>
            <p className="text-lg text-muted-foreground">
              We want you to love your purchase. If you're not completely satisfied, we're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Overview */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border rounded-lg p-8">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Our Promise</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At LUXE, customer satisfaction is our top priority. We offer a hassle-free 3-day return policy
                on all products. If you're not completely satisfied with your purchase, you can return it for
                a full refund or exchange.
              </p>
            </div>

            {/* Return Policy */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Return Policy</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="text-green-600" size={24} />
                    <h3 className="text-xl font-semibold">Eligible for Return</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Products returned within 3 days of delivery</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Items in original, unused condition</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Original packaging and tags intact</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Proof of purchase (invoice/receipt)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>No signs of wear or damage</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <XCircle className="text-red-600" size={24} />
                    <h3 className="text-xl font-semibold">Not Eligible for Return</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Products returned after 3 days</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Used or worn items</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Damaged or altered products</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Missing tags or packaging</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>Sale or clearance items (unless defective)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How to Return */}
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold text-primary">How to Return an Item</h2>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-accent">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Initiate Return Request</h3>
                    <p className="text-muted-foreground">
                      Log in to your account, go to "Order History," and click "Return Item" on the order you wish to return.
                      Alternatively, contact our customer support at <span className="font-semibold">support@luxe.in</span> or
                      call <span className="font-semibold">+91 98765 43210</span>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-accent">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Pack the Item</h3>
                    <p className="text-muted-foreground">
                      Securely pack the item in its original packaging with all tags, accessories, and the invoice.
                      Ensure the product is in unused, unworn condition.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-accent">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Schedule Pickup or Ship</h3>
                    <p className="text-muted-foreground">
                      We offer free pickup for returns within major cities. For other locations, you can ship the item to our
                      return address. We'll provide a return shipping label via email.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-accent">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Quality Check & Refund</h3>
                    <p className="text-muted-foreground">
                      Once we receive your return, our team will inspect the item within 2-3 business days.
                      If approved, your refund will be processed within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Refund Policy</h2>
              </div>

              <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Refund Methods</h3>
                <p className="text-muted-foreground">
                  Refunds will be issued to your original payment method:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span><strong>Online Payments:</strong> Refunded to your bank account/card within 5-7 business days</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span><strong>Cash on Delivery (COD):</strong> Refunded via bank transfer (please provide account details)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span><strong>Store Credit:</strong> Available as an instant option for faster processing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Refund Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-3xl font-bold text-accent mb-2">2-3</div>
                    <div className="text-sm text-muted-foreground">Business Days<br />Quality Check</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-3xl font-bold text-accent mb-2">5-7</div>
                    <div className="text-sm text-muted-foreground">Business Days<br />Refund Processing</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-3xl font-bold text-accent mb-2">7-10</div>
                    <div className="text-sm text-muted-foreground">Business Days<br />Total Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Policy */}
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold text-primary">Exchange Policy</h2>

              <p className="text-muted-foreground">
                We offer exchanges for size or color variations, subject to availability. The exchange process
                follows the same steps as returns. If the desired item is unavailable, we'll process a full refund.
              </p>

              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Exchange Conditions:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span>Same product, different size or color</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span>Within 7 days of delivery</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span>Product must meet return eligibility criteria</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span>Free exchange shipping for the first exchange</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Damaged or Defective Items */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Damaged or Defective Items</h2>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <p className="text-muted-foreground mb-4">
                  If you receive a damaged or defective product, please contact us immediately within 48 hours of delivery.
                  We'll arrange for a free pickup and provide a full refund or replacement at no additional cost.
                </p>
                <p className="text-muted-foreground">
                  <strong>Important:</strong> Please take photos of the damaged item and packaging to expedite the process.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-3">Need Help with a Return?</h2>
              <p className="text-muted-foreground mb-6">
                Our customer support team is here to assist you with any questions or concerns.
              </p>
              <div className="space-y-2">
                <p className="font-semibold">Email: support@luxe.in</p>
                <p className="font-semibold">Phone: +91 98765 43210 (Mon-Sat, 9 AM - 8 PM)</p>
                <p className="font-semibold">WhatsApp: +91 98765 43210</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
