import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly is a KDial listing?",
    answer:
      "A KDial listing is a premium digital profile – like a mini-website for your business. It showcases your photos, services, location, contact buttons (WhatsApp, Call, Directions), and gives you access to an analytics dashboard to track how customers find you.",
  },
  {
    question: "Who can list their business on KDial?",
    answer:
      "Any legitimate business in Kerala! Whether you run a shop, restaurant, salon, clinic, coaching center, repair service, or you're a freelancer or professional – if you have a business, you can list it on KDial.",
  },
  {
    question: "How is KDial different from Google My Business or JustDial?",
    answer:
      "KDial has no free listings – only verified premium businesses. This means customers know every business on KDial is serious and legitimate. No spam, no fake listings, no competitors bidding on your name. Your listing stands out.",
  },
  {
    question: "How do I make the payment?",
    answer:
      "Simple! Click the WhatsApp button, send us the pre-filled message, and our team will respond with UPI payment details. You can pay via any UPI app – GPay, PhonePe, Paytm, or your bank app.",
  },
  {
    question: "Is the ₹999 a one-time payment or recurring?",
    answer:
      "It's an annual fee. The ₹999 pre-booking price covers your premium listing for one full year from launch. After that, you can renew at the regular annual rate.",
  },
  {
    question: "What if I pay now but KDial doesn't launch?",
    answer:
      "100% money-back guarantee. If for any reason KDial doesn't launch in Ernakulam, you'll receive a full refund – no questions asked. Your payment is completely risk-free.",
  },
  {
    question: "When will KDial launch in Ernakulam?",
    answer:
      "Very soon! We're in the final stages of preparation. All pre-bookers will be notified via WhatsApp before launch day and will be the first businesses to go live on the platform.",
  },
  {
    question: "Can I edit my listing after it goes live?",
    answer:
      "Absolutely! You'll have full access to your dashboard where you can update your photos, services, business hours, contact info, and more – anytime you want.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Got questions? We've got answers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
