import React, { useState } from 'react';
import { miniDriveFAQs } from '../../data';

function FAQs() {
  const [questionIdOpen, setQuestionIdOpen] = useState("");

  const toggleQuestion = (id) => {
    setQuestionIdOpen(prev => (prev === id ? "" : id));
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden bg-bg-light dark:bg-bg-dark">
      
      <div className="relative z-10 max-w-4xl mx-auto text-xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-text-light dark:text-text-dark">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {miniDriveFAQs.map(faq => (
            <div key={faq.id} className="border-b border-accent2-dark dark:border-accent1 rounded-b-lg px-4 py-2 transition-all duration-100">
              <div
                className={`flex justify-between items-center cursor-pointer py-3 ${
                  questionIdOpen === faq.id ? "opacity-70" : ""}`}
                onClick={() => toggleQuestion(faq.id)}
              >
                <p className="font-medium text-text-light dark:text-text-dark">{faq.question}</p>
                <span className="text-xl font-bold text-primary dark:text-accent2-dark">{questionIdOpen === faq.id ? "-" : "+"}</span>
              </div>

              <div
                className={`overflow-hidden transition-all duration-100 ease-in-out transform ${
                  questionIdOpen === faq.id
                    ? "max-h-40 opacity-100 scale-100 translate-y-0"
                    : "max-h-0 opacity-0 scale-95 -translate-y-1"
                }`}
              >
                <p className="mt-4 text-text-light/70 dark:text-text-dark/70">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQs;