"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping details, apply any discount code, and confirm your order. You'll receive an email confirmation once your order is placed.",
      },
      {
        q: "How can I track my order?",
        a: "After placing your order, go to 'My Orders' from the navigation menu. Click on any order to see its detailed tracking timeline showing the current status (Pending, Confirmed, Shipped, Delivered).",
      },
      {
        q: "How long does shipping take?",
        a: "Standard shipping typically takes 3-5 business days within Pakistan. Delivery times may vary depending on your location.",
      },
      {
        q: "Is shipping free?",
        a: "Yes! We offer free shipping on all orders, regardless of the order amount.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "You can request a return for any confirmed, shipped, or delivered order. Go to your order detail page and click 'Request Return'. Provide a reason and our team will review your request.",
      },
      {
        q: "How do I request a return?",
        a: "Navigate to My Orders, click on the order you want to return, and use the 'Request Return' button in the sidebar. Fill in the reason for your return and submit.",
      },
      {
        q: "How long do refunds take?",
        a: "Once your return is approved, refunds are processed within 5-7 business days. You'll be notified when the refund has been issued.",
      },
    ],
  },
  {
    category: "Payments & Discounts",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "Currently, we offer Cash on Delivery (COD) for all orders. Online payment options will be added in the future.",
      },
      {
        q: "How do I use a discount code?",
        a: "During checkout, enter your discount code in the 'Discount Code' field and click 'Apply'. The discount will be automatically calculated and shown in your order summary.",
      },
      {
        q: "Can I use multiple discount codes?",
        a: "Only one discount code can be applied per order. Choose the best code for maximum savings!",
      },
    ],
  },
  {
    category: "Account & Wishlist",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign In' at the top right corner and then choose 'Sign Up'. You can register with your email address or use Google sign-in for quick access.",
      },
      {
        q: "How does the wishlist work?",
        a: "Click the heart icon on any product to add it to your wishlist. You can view your wishlist from the heart icon in the navigation bar, and move items to your cart when you're ready to buy.",
      },
      {
        q: "Can I leave a review?",
        a: "Yes! After signing in, go to any product page and scroll down to the reviews section. You can rate the product from 1-5 stars and leave a comment. You can submit one review per product.",
      },
    ],
  },
  {
    category: "Gift Messages",
    questions: [
      {
        q: "Can I add a gift message to my order?",
        a: "Yes! During checkout, you'll find an optional 'Gift Message' field. Write a personal message and it will be included with your order. It's perfect for sending gifts to loved ones.",
      },
      {
        q: "Is gift wrapping available?",
        a: "Currently, we include the gift message with the order. Physical gift wrapping is being planned for a future update.",
      },
    ],
  },
];

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-dark pr-4">{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-5 h-5 text-medium flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 text-xs text-medium leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="page-title text-center">Frequently Asked Questions</h1>
        <p className="text-medium text-center mb-6">
          Find answers to common questions about orders, shipping, returns, and
          more.
        </p>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {faqs.map((section) => (
            <div key={section.category} className="card p-4">
              <h2 className="text-base font-bold text-dark mb-3">
                {section.category}
              </h2>
              <div>
                {section.questions.map((item) => (
                  <AccordionItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help? */}
        <div className="card p-6 mt-8 text-center">
          <h2 className="text-lg font-bold text-dark mb-2">
            Still have questions?
          </h2>
          <p className="text-medium mb-4">
            Can&apos;t find what you&apos;re looking for? Our support team is
            here to help.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
