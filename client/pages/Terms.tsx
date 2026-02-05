import { Layout } from "@/components/Layout";
import { FileText, Scale, ShoppingBag, CreditCard, UserX, AlertTriangle } from "lucide-react";

export default function Terms() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/20 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <FileText className="text-accent" size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-primary mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-muted-foreground">
              Last Updated: February 4, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Introduction */}
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to LUXE. By accessing and using our website (www.luxe.in) and purchasing our products,
                you agree to comply with and be bound by the following terms and conditions. Please read these
                terms carefully before using our services.
              </p>
            </div>

            {/* Agreement */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border rounded-lg p-6">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-3">Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By using our website, you acknowledge that you have read, understood, and agree to be bound by these
                Terms and Conditions, along with our Privacy Policy. If you do not agree with any part of these terms,
                please do not use our website or services.
              </p>
            </div>

            {/* Use of Website */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Use of Website</h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old to use our services and make purchases. By using this website,
                  you represent and warrant that you are of legal age to form a binding contract.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Account Registration</h3>
                <p className="text-muted-foreground">
                  To access certain features, you may need to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information as needed</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Prohibited Activities</h3>
                <p className="text-muted-foreground">You agree NOT to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={18} />
                    <span className="text-sm text-muted-foreground">Use the website for illegal purposes</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={18} />
                    <span className="text-sm text-muted-foreground">Violate any applicable laws or regulations</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={18} />
                    <span className="text-sm text-muted-foreground">Infringe on intellectual property rights</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={18} />
                    <span className="text-sm text-muted-foreground">Transmit viruses or malicious code</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={18} />
                    <span className="text-sm text-muted-foreground">Attempt to gain unauthorized access</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={18} />
                    <span className="text-sm text-muted-foreground">Engage in fraudulent activities</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products and Orders */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Products & Orders</h2>
              </div>

              <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Product Information</h3>
                <p className="text-muted-foreground">
                  We strive to provide accurate product descriptions, images, and pricing. However:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Colors may vary slightly due to screen settings</li>
                  <li>We reserve the right to correct errors in pricing or descriptions</li>
                  <li>Product availability is subject to change without notice</li>
                  <li>We do not guarantee that all products will be available at all times</li>
                </ul>
              </div>

              <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Order Acceptance</h3>
                <p className="text-muted-foreground">
                  All orders are subject to acceptance and availability. We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Refuse or cancel any order for any reason</li>
                  <li>Limit quantities purchased per person or household</li>
                  <li>Verify information before processing orders</li>
                  <li>Cancel orders if fraud is suspected</li>
                </ul>
              </div>

              <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Shipping & Delivery</h3>
                <p className="text-muted-foreground">
                  Delivery times are estimates and not guaranteed. We are not liable for delays caused by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Courier service delays</li>
                  <li>Natural disasters or unforeseen circumstances</li>
                  <li>Incorrect shipping information provided by customer</li>
                  <li>Customs clearance (for international orders)</li>
                </ul>
              </div>
            </div>

            {/* Pricing and Payment */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Pricing & Payment</h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Pricing</h3>
                <p className="text-muted-foreground">
                  All prices are listed in Indian Rupees (INR) and include applicable taxes unless otherwise stated.
                  Prices are subject to change without notice. We reserve the right to modify prices at any time.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Payment Methods</h3>
                <p className="text-muted-foreground">We accept the following payment methods:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Credit/Debit Cards (Visa, Mastercard, RuPay, American Express)</li>
                  <li>Net Banking</li>
                  <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
                  <li>Digital Wallets</li>
                  <li>Cash on Delivery (COD) - Available for select locations</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Payment Security</h3>
                <p className="text-muted-foreground">
                  All online payments are processed through secure payment gateways (Razorpay). We do not store your
                  complete card details on our servers. By providing payment information, you authorize us to charge
                  the specified amount.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold text-primary">Intellectual Property Rights</h2>

              <p className="text-muted-foreground">
                All content on this website, including but not limited to text, graphics, logos, images, videos, and software,
                is the property of LUXE or its content suppliers and is protected by Indian and international copyright laws.
              </p>

              <div className="border-l-4 border-accent pl-6">
                <p className="text-muted-foreground mb-2">
                  <strong>You may not:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Reproduce, distribute, or display any content without written permission</li>
                  <li>Use our trademarks, logos, or brand name without authorization</li>
                  <li>Create derivative works based on our content</li>
                  <li>Use automated systems to access or scrape our website</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold text-primary">Limitation of Liability</h2>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law, LUXE shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Indirect, incidental, special, or consequential damages</li>
                  <li>Loss of profits, revenue, data, or business opportunities</li>
                  <li>Damages arising from use or inability to use our website</li>
                  <li>Damages resulting from unauthorized access to your account</li>
                  <li>Errors or omissions in website content</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Our total liability shall not exceed the amount you paid for the product or service in question.
                </p>
              </div>
            </div>

            {/* Warranty Disclaimer */}
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold text-primary">Warranty Disclaimer</h2>

              <p className="text-muted-foreground">
                Our products are sold "as is" and "as available." While we strive for quality, we make no warranties,
                express or implied, regarding:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Merchantability or fitness for a particular purpose</li>
                <li>Accuracy, reliability, or completeness of information</li>
                <li>Uninterrupted or error-free website operation</li>
                <li>Security of data transmission</li>
              </ul>
            </div>

            {/* User Content */}
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold text-primary">User-Generated Content</h2>

              <p className="text-muted-foreground">
                By submitting reviews, comments, or other content to our website, you grant LUXE a non-exclusive,
                royalty-free, perpetual, and worldwide license to use, reproduce, modify, and display such content
                for marketing and promotional purposes.
              </p>

              <div className="bg-muted/30 border rounded-lg p-6">
                <p className="text-muted-foreground">
                  <strong>You agree that your content will:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                  <li>Be truthful and not misleading</li>
                  <li>Not violate any third-party rights</li>
                  <li>Not contain offensive or inappropriate material</li>
                  <li>Not promote illegal activities</li>
                </ul>
              </div>
            </div>

            {/* Termination */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <UserX className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Account Termination</h2>
              </div>

              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your account and access to our services at any time,
                without prior notice, for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Violation of these Terms and Conditions</li>
                <li>Fraudulent or illegal activities</li>
                <li>Providing false information</li>
                <li>Abusive behavior towards our staff or other customers</li>
                <li>Any other reason we deem appropriate</li>
              </ul>
            </div>

            {/* Governing Law */}
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold text-primary">Governing Law & Jurisdiction</h2>

              <p className="text-muted-foreground">
                These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms
                or your use of our website shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold text-primary">Changes to Terms</h2>

              <p className="text-muted-foreground">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective
                immediately upon posting to the website. Your continued use of our services after changes are posted
                constitutes acceptance of the modified terms.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-3">Questions About Our Terms?</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions or concerns about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2">
                <p className="font-semibold">Email: legal@luxe.in</p>
                <p className="font-semibold">Phone: +91 98765 43210</p>
                <p className="text-sm text-muted-foreground">
                  LUXE Headquarters, 123 Fashion Street, Bandra West, Mumbai, Maharashtra 400050, India
                </p>
              </div>
            </div>

            {/* Acceptance */}
            <div className="border-t pt-8">
              <p className="text-center text-muted-foreground italic">
                By using our website and services, you acknowledge that you have read, understood, and agree to be
                bound by these Terms and Conditions.
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
