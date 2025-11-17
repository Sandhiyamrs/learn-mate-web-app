'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Check, X } from 'lucide-react';

const sampleQuestions = [
  {
    id: 1,
    question: 'What is the chemical symbol for gold?',
    options: ['Au', 'Ag', 'Go', 'Gd'],
    correct: 0,
  },
  {
    id: 2,
    question: 'Which planet is the largest in our solar system?',
    options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
    correct: 2,
  },
  {
    id: 3,
    question: 'What is the square root of 144?',
    options: ['10', '12', '14', '16'],
    correct: 1,
  },
  {
    id: 4,
    question: 'Which country has the most population?',
    options: ['USA', 'India', 'Brazil', 'Indonesia'],
    correct: 1,
  },
  {
    id: 5,
    question: 'What is the capital of France?',
    options: ['Lyon', 'Paris', 'Marseille', 'Nice'],
    correct: 1,
  },
];

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !answered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, answered]);

  const handleSelect = (index: number) => {
    if (!answered) {
      setSelected(index);
    }
  };

  const handleSubmit = () => {
    if (selected === null) return;
    
    setAnswered(true);
    setShowResult(true);
    
    if (selected === sampleQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelected(null);
      setAnswered(false);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      // Quiz complete
      window.location.href = `/results?score=${score + (selected === sampleQuestions[currentQuestion].correct ? 1 : 0)}&total=${sampleQuestions.length}`;
    }
  };

  const question = sampleQuestions[currentQuestion];
  const isCorrect = selected === question.correct;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/topics" className="text-slate-400 hover:text-white transition-colors">
              ← Back
            </Link>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              LearnMate Quiz
            </div>
          </div>
          <div className="text-white font-medium">
            Question {currentQuestion + 1}/{sampleQuestions.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Progress</span>
            <span>{currentQuestion + 1} of {sampleQuestions.length}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-end mb-8">
          <div className={`flex items-center justify-center w-16 h-16 rounded-full border-2 font-bold text-xl ${
            timeLeft > 10
              ? 'border-green-400/50 text-green-400'
              : 'border-red-400/50 text-red-400'
          }`}>
            {timeLeft}
          </div>
        </div>

        {/* Question Card */}
        <div className="relative group mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          
          <div className="relative p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-xl border border-white/10 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrectOption = index === question.correct;
                let bgColor = 'bg-white/5 border-white/10 hover:border-blue-400/50';
                let textColor = 'text-white';

                if (answered) {
                  if (isCorrectOption) {
                    bgColor = 'bg-green-500/20 border-green-400/50';
                    textColor = 'text-green-300';
                  } else if (isSelected && !isCorrectOption) {
                    bgColor = 'bg-red-500/20 border-red-400/50';
                    textColor = 'text-red-300';
                  }
                } else if (isSelected) {
                  bgColor = 'bg-blue-500/20 border-blue-400/50';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={answered}
                    className={`w-full p-4 border rounded-lg font-medium transition-all text-left flex items-center justify-between ${bgColor} ${textColor} disabled:cursor-not-allowed`}
                  >
                    <span>{option}</span>
                    {answered && isCorrectOption && <Check className="w-5 h-5" />}
                    {answered && isSelected && !isCorrectOption && <X className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className={`p-4 rounded-lg mb-8 ${
                isCorrect
                  ? 'bg-green-500/20 border border-green-400/50 text-green-300'
                  : 'bg-red-500/20 border border-red-400/50 text-red-300'
              }`}>
                {isCorrect ? '✓ Correct! Well done!' : '✗ Incorrect. Try the next one!'}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              {!answered ? (
                <button
                  onClick={handleSubmit}
                  disabled={selected === null}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                >
                  {currentQuestion === sampleQuestions.length - 1 ? 'See Results' : 'Next Question'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Score Preview */}
        <div className="text-center">
          <p className="text-slate-400">Current Score: <span className="text-blue-400 font-bold">{score}</span> / {sampleQuestions.length}</p>
        </div>
      </div>
    </main>
  );
}
