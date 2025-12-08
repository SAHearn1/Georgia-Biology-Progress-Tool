"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

const SESSION_ID_DISPLAY_LENGTH = 6;
const MAX_ITEMS_PER_SESSION = 10; // Should match backend constant

interface Item {
  id: string;
  content: string;
  options: string[];
  standard: string;
}

export default function AssessmentContent({ sessionId }: { sessionId: string }) {
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Fetch initial question on mount
  useEffect(() => {
    fetchFirstQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const fetchFirstQuestion = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          itemId: 'initial'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load question');
      }

      if (data.nextItem) {
        setCurrentItem(data.nextItem);
        setQuestionNumber(1);
        setStartTime(Date.now());
      } else {
        setError('No questions available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!selectedOption || !currentItem) return;

    setIsLoading(true);
    setError(null);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Time in seconds

    try {
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          itemId: currentItem.id,
          selectedAnswer: selectedOption,
          timeSpent
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answer');
      }

      // Check if assessment is complete
      if (data.completed) {
        setIsFinished(true);
      } else if (data.nextItem) {
        // Load next question
        setCurrentItem(data.nextItem);
        setSelectedOption(null);
        setQuestionNumber(prev => prev + 1);
        setStartTime(Date.now());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (questionNumber / MAX_ITEMS_PER_SESSION) * 100;

  // Loading state
  if (isLoading && !currentItem) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-red-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-red-600 mb-8">{error}</p>
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

  // Completion state
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

  // No current item (shouldn't happen, but handle gracefully)
  if (!currentItem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Test Header */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-gray-500">
            SESSION: {sessionId.slice(0, SESSION_ID_DISPLAY_LENGTH).toUpperCase()}
          </span>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs font-bold">
            <BookOpen className="w-3 h-3" />
            {currentItem.standard}
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="font-medium">Question {questionNumber} of {MAX_ITEMS_PER_SESSION}</span>
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
              disabled={isLoading}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                selectedOption === option
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                  : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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

        {/* Error message during submission */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />
            {error}
          </div>
        )}

      </main>

      {/* Footer Navigation */}
      <footer className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedOption || isLoading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
