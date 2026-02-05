import { Layout } from "@/components/Layout";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export default function Privacy() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/20 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <Shield className="text-accent" size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-primary mb-4">
              Privacy Policy
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
                At LUXE, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
                our website or make a purchase from us.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Information We Collect</h2>
              </div>

              <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <p className="text-muted-foreground">
                  When you create an account, place an order, or contact us, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Order history and preferences</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Automatically Collected Information</h3>
                <p className="text-muted-foreground">
                  When you visit our website, we automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Browser type and version</li>
                  <li>IP address and device information</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">How We Use Your Information</h2>
              </div>

              <p className="text-muted-foreground">We use the information we collect to:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Process and fulfill your orders, manage payments, and provide customer support
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Communication</h4>
                  <p className="text-sm text-muted-foreground">
                    Send order confirmations, shipping updates, and respond to your inquiries
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Personalization</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize your shopping experience and recommend products you might like
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Improvement</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyze website usage to improve our products, services, and user experience
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Marketing</h4>
                  <p className="text-sm text-muted-foreground">
                    Send promotional emails and offers (you can opt-out anytime)
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Prevent fraud, protect against security threats, and ensure platform safety
                  </p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Data Security</h2>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border rounded-lg p-6">
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your personal information. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure payment processing through trusted partners (Razorpay)</li>
                  <li>Regular security audits and updates</li>
                  <li>Restricted access to personal information on a need-to-know basis</li>
                  <li>Secure data storage with regular backups</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-accent" size={28} />
                <h2 className="text-3xl font-playfair font-bold text-primary">Information Sharing</h2>
              </div>

              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>

              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <span className="font-semibold">Service Providers:</span>
                    <span className="text-muted-foreground"> Payment processors, shipping companies, and email service providers who assist in our operations</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <span className="font-semibold">Legal Requirements:</span>
                    <span className="text-muted-foreground"> When required by law or to protect our rights and safety</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent mt-1">•</span>
                  <div>
                    <span className="font-semibold">Business Transfers:</span>
                    <span className="text-muted-foreground"> In the event of a merger, acquisition, or sale of assets</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="space-y-4">
              <h2 className="text-3xl font-playfair font-bold text-primary">Your Rights</h2>

              <p className="text-muted-foreground">You have the right to:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold mb-1">Access Your Data</h4>
                  <p className="text-sm text-muted-foreground">Request a copy of the personal information we hold about you</p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold mb-1">Correct Your Data</h4>
                  <p className="text-sm text-muted-foreground">Update or correct inaccurate information</p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold mb-1">Delete Your Data</h4>
                  <p className="text-sm text-muted-foreground">Request deletion of your personal information</p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold mb-1">Opt-Out</h4>
                  <p className="text-sm text-muted-foreground">Unsubscribe from marketing communications at any time</p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="space-y-4">
              <h2 className="text-3xl font-playfair font-bold text-primary">Cookies Policy</h2>

              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.
                You can control cookie preferences through your browser settings.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="space-y-4">
              <h2 className="text-3xl font-playfair font-bold text-primary">Children's Privacy</h2>

              <p className="text-muted-foreground">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information
                from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="space-y-4">
              <h2 className="text-3xl font-playfair font-bold text-primary">Changes to This Policy</h2>

              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy
                on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 border rounded-lg p-8 text-center">
              <Mail className="text-accent mx-auto mb-4" size={40} />
              <h2 className="text-2xl font-playfair font-bold text-primary mb-3">Questions About Privacy?</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns about our Privacy Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p className="font-semibold">Email: privacy@luxe.in</p>
                <p className="font-semibold">Phone: +91 98765 43210</p>
                <p className="text-sm text-muted-foreground">
                  LUXE Headquarters, 123 Fashion Street, Bandra West, Mumbai, Maharashtra 400050
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
