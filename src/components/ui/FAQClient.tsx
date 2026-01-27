"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    category: "Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide. International shipping times vary by location, typically 10-14 business days."
      },
      {
        q: "What are your shipping rates?",
        a: "Standard shipping is ₹500.00 for domestic orders. International rates are calculated at checkout based on destination."
      }
    ]
  },
  {
    category: "Returns",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in original packaging with tags attached."
      },
      {
        q: "How do I return an item?",
        a: "Contact us at studio@threadtimber.co with your order number. We'll provide a return label and instructions."
      },
      {
        q: "Are refunds processed immediately?",
        a: "Refunds are processed within 5-7 business days after we receive and inspect the returned item."
      },
      {
        q: "How do I cancel my order?",
        a: "You can cancel your order directly from your Orders Portal as long as it hasn't entered the 'Shipped' or 'Delivered' stage. Simply select the order you wish to cancel and provide a reason for withdrawal."
      },
      {
        q: "How will I receive my refund?",
        a: "Refunds for cancelled orders are processed immediately. If you used your virtual wallet, the balance is restored instantly. For card payments, the refund is initiated to your original payment method and typically appears within 5-7 business days."
      }
    ]
  },
  {
    category: "Care",
    questions: [
      {
        q: "How should I care for my handcrafted pieces?",
        a: "We recommend gentle machine wash in cold water or hand wash. Air dry or tumble dry on low. Avoid bleach and harsh detergents."
      },
      {
        q: "Will the colors fade?",
        a: "Our natural dyes may fade slightly over time with washing, which adds to the character of each piece. Wash inside out to minimize fading."
      },
      {
        q: "Can I iron my pieces?",
        a: "Yes, use a low to medium heat setting. For best results, iron while slightly damp or use a pressing cloth."
      }
    ]
  },
  {
    category: "Products",
    questions: [
      {
        q: "Are your products made to order?",
        a: "Most items are made in small batches. Limited edition pieces may sell out quickly. Check inventory on product pages."
      },
      {
        q: "What sizes do you offer?",
        a: "Sizes vary by product. Most items are available in XS-XL. Check individual product pages for specific size availability."
      },
      {
        q: "Do you offer custom sizing?",
        a: "Custom sizing is available for select items. Contact us at studio@threadtimber.co to discuss your needs."
      }
    ]
  }
];

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-10 space-y-6">
      {faqs.map((section: any, sectionIndex: number) => (
        <div key={section.category} className="rounded-3xl border border-black/5 bg-white/70 p-6">
          <h3 className="mb-4 text-lg font-semibold text-black">{section.category}</h3>
          <div className="space-y-3">
            {section.questions.map((faq: any, qIndex: number) => {
              const index = sectionIndex * 100 + qIndex;
              const isOpen = openIndex === index;
              return (
                <div key={qIndex} className="rounded-2xl border border-black/5 bg-sand/50">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <span className="font-medium text-black">{faq.q}</span>
                    <FiChevronDown
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-black/5 p-4">
                      <p className="text-sm text-black/70">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
