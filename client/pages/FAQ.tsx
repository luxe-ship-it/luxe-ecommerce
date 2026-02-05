import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our collection, add items to your cart, and proceed to checkout. We accept various payment methods including UPI and cards."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 3-day hassle-free return policy for all unused items with original tags. Visit the Returns page to initiate a return."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days depending on your location. You will receive a tracking link via email/SMS."
    },
    {
      question: "Are your products authentic?",
      answer: "Yes, 100%. We source directly from manufacturers and guarantee the authenticity of every product we sell."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 24 hours of placing it, provided it hasn't been shipped yet."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-playfair font-bold text-primary mb-8 text-center">Frequently Asked Questions</h1>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Layout>
  );
}
