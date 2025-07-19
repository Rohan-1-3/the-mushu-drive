import React, { useState } from 'react';

const miniDriveFAQs = [
    {
        id: "f3a1d9d0-1b2a-4e6e-94cb-12a34efc0e2a",
        question: "What is Mini Drive?",
        answer: "Mini Drive is a lightweight cloud storage service that lets you securely upload, organize, and share your files online."
    },
    {
        id: "a2b0e9f4-02f6-45e9-a67f-f7bfcf7d79ad",
        question: "How much free storage do I get?",
        answer: "You receive 1 GB of free storage when you create an account. You can upgrade to get more space anytime."
    },
    {
        id: "cd019e6f-388b-4be5-96f7-117dc3f765e1",
        question: "What file types are supported?",
        answer: "You can upload most common file types including documents, images, videos, PDFs, and audio files."
    },
    {
        id: "1fdd8b18-46f4-4c0d-b9e2-9cc3b614f720",
        question: "How do I share a file with someone?",
        answer: "Click the share icon next to a file to generate a link, or invite others by email with view or edit permissions."
    },
    {
        id: "ccf479d6-2efb-4d08-bb31-c8ea44e5dfab",
        question: "Is my data safe on Mini Drive?",
        answer: "Yes, all files are encrypted during upload and stored securely. Only you and the people you authorize can access them."
    },
    {
        id: "587c313d-7e59-47b8-a4cb-71b124c15a13",
        question: "Can I organize files into folders?",
        answer: "Absolutely. You can create folders, rename them, and drag files to keep your storage organized."
    },
    {
        id: "e46bbfb7-ccfa-4a76-b4f3-e8822a80b7a0",
        question: "What is the maximum file upload size?",
        answer: "The current limit is 100 MB per file for free users. Larger file uploads require a premium account."
    },
    {
        id: "985ddcf2-b80e-4d29-84a4-247d58fa99c7",
        question: "Can I access Mini Drive on mobile?",
        answer: "Yes, Mini Drive is mobile-friendly and works on all modern browsers. Native apps are in development."
    }
];

function FAQs() {
  const [questionIdOpen, setQuestionIdOpen] = useState("");

  const toggleQuestion = (id) => {
    setQuestionIdOpen(prev => (prev === id ? "" : id));
  };

  return (
    <div className="px-4 max-w-4xl mx-auto text-xl">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {miniDriveFAQs.map(faq => (
          <div key={faq.id} className=" border-gray-300 border-b-1 rounded-sm p-4 hover:opacity-70">
            <div
              className={`flex justify-between items-center cursor-pointer ${
                questionIdOpen === faq.id ? "opacity-70" : ""}`}
              onClick={() => toggleQuestion(faq.id)}
            >
              <p className="font-medium">{faq.question}</p>
              <span className="text-xl">{questionIdOpen === faq.id ? "-" : "+"}</span>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out transform ${
                questionIdOpen === faq.id
                  ? "max-h-40 opacity-100 scale-100 translate-y-0"
                  : "max-h-0 opacity-0 scale-95 -translate-y-1"
              }`}
            >
              <p className="mt-2 text-secondary">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQs;