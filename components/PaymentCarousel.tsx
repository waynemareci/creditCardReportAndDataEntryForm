"use client";

import { useState, useEffect, useRef } from "react";
import { UpcomingPayment } from "@/lib/accountUtils";
import { formatCurrency } from "@/lib/accountUtils";

interface PaymentCarouselProps {
  payments: UpcomingPayment[];
}

export default function PaymentCarousel({ payments }: PaymentCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 5
    );
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [payments]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 160; // width of item (140px) + gap (16px)
    const newScrollLeft =
      container.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (payments.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        No upcoming payments in the next 30 days
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="flex-shrink-0 flex items-center justify-center rounded-full bg-white cursor-pointer transition-all"
        style={{
          width: "32px",
          height: "32px",
          border: "1px solid #d1d5db",
          color: canScrollLeft ? "#6b7280" : "#d1d5db",
          fontSize: "0.875rem",
          opacity: canScrollLeft ? 1 : 0.3,
        }}
        onMouseEnter={(e) => {
          if (canScrollLeft) {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.borderColor = "#9ca3af";
            e.currentTarget.style.color = "#1a1a1a";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.color = "#6b7280";
        }}
        aria-label="Scroll left"
      >
        ←
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-hidden flex-1"
        style={{ gap: "1rem", scrollBehavior: "smooth" }}
      >
        {payments.map((payment, index) => (
          <div
            key={`${payment.accountId}-${index}`}
            className="flex-shrink-0 rounded-md"
            style={{
              minWidth: "140px",
              padding: "0.75rem",
              background: "#f9fafb",
              borderLeft: "3px solid #3b82f6",
              borderRadius: "6px",
            }}
          >
            <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              {formatCurrency(payment.amount)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
              {payment.accountName}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 500 }}>
              {payment.formattedDate}
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="flex-shrink-0 flex items-center justify-center rounded-full bg-white cursor-pointer transition-all"
        style={{
          width: "32px",
          height: "32px",
          border: "1px solid #d1d5db",
          color: canScrollRight ? "#6b7280" : "#d1d5db",
          fontSize: "0.875rem",
          opacity: canScrollRight ? 1 : 0.3,
        }}
        onMouseEnter={(e) => {
          if (canScrollRight) {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.borderColor = "#9ca3af";
            e.currentTarget.style.color = "#1a1a1a";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.color = "#6b7280";
        }}
        aria-label="Scroll right"
      >
        →
      </button>
    </div>
  );
}
