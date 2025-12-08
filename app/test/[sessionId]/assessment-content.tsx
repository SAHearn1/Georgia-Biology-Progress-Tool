"use client";

import { useState } from "react";
import { CheckCircle2, Clock, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

// MOCK DATA: In production, this comes from your 3-PL IRT Engine via API
const MOCK_ITEMS = [
  {
    id: "item_1",
    standard: "SB1.a", // GSE Standard
    content: "Which organelle is primarily responsible for the synthesis of proteins in the cell?",
    options: [
      "Golgi Apparatus",
      "Mitochondria",
      "Ribosome",
      "Smooth Endoplasmic Reticulum"
    ],
    correct: "Ribosome"
  },
  {
    id: "item_2",
    standard: "SB1.b",
    content: "Enzymes act as biological catalysts by lowering the activation energy of a reaction. Which factor most directly affects an enzyme's ability to function?",
    options: [
      "The amount of product produced",
      "The pH and temperature of the environment",
      "The size of the container",
      "The availability of ATP only"
    ],
    correct: "The pH and temperature of the environment"
  },
  {
    id: "item_3",
    standard: "SB2.a",
    content: "In DNA replication, which enzyme is responsible for 'unzipping' the double helix structure?",
    options: [
      "DNA Polymerase",
      "Helicase",
      "Ligase",
      "Primase"
    ],
    correct: "Helicase"
  }
];

export default function AssessmentContent({ sessionId }: { sessionId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentItem = MOCK_ITEMS[currentIndex];
  const progress = ((currentIndex) / MOCK_ITEMS.length) * 100;

  const handleNext = () => {
    if (!selectedOption) return;

    // Save response
    setResponses(prev => ({ ...prev, [currentItem.id]: selectedOption }));
    setSelectedOption(null);

    // Advance or Finish
    if (currentIndex < MOCK_ITEMS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Complete</h1>
          <p className="text-gray-500 mb-8">
            Your responses have been recorded. Your teacher will review your mastery levels shortly.
          </p>
          <Link 
            href="/" 
            className="block w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Test Header */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-gray-500">
            SESSION: {sessionId.slice(0,6).toUpperCase()}
          </span>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs font-bold">
            <BookOpen className="w-3 h-3" />
            {currentItem.standard}
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>04:12</span> {/* Mock Timer */}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-100">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 sm:p-10 flex flex-col justify-center">
        
        <h2 className="text-xl sm:text-2xl font-medium text-gray-900 leading-relaxed mb-8">
          {currentItem.content}
        </h2>

        <div className="space-y-3 mb-10">
          {currentItem.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                selectedOption === option 
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900" 
                  : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  selectedOption === option ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium">{option}</span>
              </div>
              
              {selectedOption === option && (
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              )}
            </button>
          ))}
        </div>

      </main>

      {/* Footer Navigation */}
      <footer className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {currentIndex === MOCK_ITEMS.length - 1 ? "Submit Assessment" : "Next Question"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
