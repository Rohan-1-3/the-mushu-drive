import React, { useEffect, useRef, useState } from "react";
import ReviewCard from "./ReviewCard";

const reviews = [
  {
    name: "Aarav Joshi",
    text:
      "Absolutely loved using this app! The interface is clean, and the features are exactly what I needed. Would highly recommend it to my team.",
    value: 4.8,
  },
  {
    name: "Sneha Thapa",
    text:
      "Great experience overall. Customer support was fast and helpful, and the onboarding process was seamless.",
    value: 4.6,
  },
  {
    name: "Maya Shrestha",
    text: "The free plan offers a lot more than I expected. Paid upgrade was totally worth it too!",
    value: 4.5,
  },
  {
    name: "Maya Shrestha",
    text: "The free plan offers a lot more than I expected. Paid upgrade was totally worth it too!",
    value: 4.5,
  },
  {
    name: "Maya Shrestha",
    text: "The free plan offers a lot more than I expected. Paid upgrade was totally worth it too!",
    value: 4.5,
  },
];

function ReviewsSection() {
  return (
    <section className="w-full py-12">
      <div className="max-w-7xl m-auto relative w-full">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Users Are Saying
        </h2>

        <div
            className={`flex gap-3 flex-wrap justify-center`}
        >
          {reviews.map((review, i) => (
            <ReviewCard
              key={`${review.name}-${i}`}
              name={review.name}
              text={review.text}
              value={review.value}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
