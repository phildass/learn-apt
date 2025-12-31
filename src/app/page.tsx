"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Zap, Brain, Target, Clock, CheckCircle, AlertCircle, X } from "lucide-react";

function UnauthorizedBanner() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  // Derive whether to show the banner from searchParams and dismissed state
  const showUnauthorized = searchParams.get("error") === "unauthorized" && !dismissed;

  if (!showUnauthorized) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-b-2 border-red-500 dark:border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Access Denied</p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                You do not have administrator privileges. Admin access requires user_metadata.is_admin to be set to true.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Unauthorized Error Banner */}
      <Suspense fallback={null}>
        <UnauthorizedBanner />
      </Suspense>

      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Learnapt</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link 
                href="#tests" 
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Tests
              </Link>
              <Link 
                href="#about" 
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Discover Your <span className="text-blue-600">Learning Aptitude</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Understand your unique learning preferences, problem-solving styles, and motivation drivers with our comprehensive aptitude assessments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/brief-test"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-blue-600/25"
            >
              <Zap className="h-5 w-5" />
              Take Brief Test
            </Link>
            <Link
              href="/elaborate-test"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-slate-200 dark:border-slate-600"
            >
              <BookOpen className="h-5 w-5" />
              Take Elaborate Test
            </Link>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section id="tests" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Choose Your Assessment
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Brief Test Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-blue-100 dark:border-slate-600 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Brief Test</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                A quick assessment designed to give you rapid insights into your core aptitude areas. Perfect for those who want immediate results.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>~5 minutes to complete</span>
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>3 key modules</span>
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>9 focused questions</span>
                </li>
              </ul>
              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Modules Covered:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    Learning Preferences
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                    Problem-Solving Style
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    Motivation Drivers
                  </span>
                </div>
              </div>
              <Link
                href="/brief-test"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Brief Test
              </Link>
            </div>

            {/* Elaborate Test Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-purple-100 dark:border-slate-600 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Elaborate Test</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                <strong className="text-purple-600 dark:text-purple-400">Comprehensive Aptitude Assessment</strong>
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                A thorough assessment that provides deep insights into all aspects of your learning aptitude. Ideal for comprehensive self-understanding.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span>~15-20 minutes to complete</span>
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span>Multiple comprehensive modules</span>
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>Detailed question sets</span>
                </li>
              </ul>
              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Complete Coverage:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    All Learning Styles
                  </span>
                  <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-sm">
                    Cognitive Patterns
                  </span>
                  <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-full text-sm">
                    Behavioral Insights
                  </span>
                </div>
              </div>
              <Link
                href="/elaborate-test"
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Elaborate Test
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Why Learnapt?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Understanding how you learn best is the key to unlocking your full potential. Learnapt helps you discover your unique cognitive profile so you can optimize your learning journey.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Science-Based</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Our assessments are grounded in cognitive psychology research.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Personalized</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get insights tailored to your unique learning profile.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Actionable</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive practical recommendations you can apply immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">Learnapt</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Learnapt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
