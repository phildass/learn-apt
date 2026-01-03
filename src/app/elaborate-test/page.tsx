"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

const modules: Module[] = [
  {
    id: "learning-styles",
    title: "Learning Styles Assessment",
    description: "Comprehensive evaluation of how you prefer to receive and process information.",
    questions: [
      {
        id: "ls1",
        text: "When learning a new software application, I prefer to:",
        options: [
          { value: "visual", label: "Watch video tutorials or demonstrations" },
          { value: "auditory", label: "Listen to explanations or podcasts about it" },
          { value: "kinesthetic", label: "Jump right in and experiment with it" },
          { value: "reading", label: "Read the manual or documentation" },
        ],
      },
      {
        id: "ls2",
        text: "During presentations, I pay most attention when:",
        options: [
          { value: "visual", label: "There are slides with graphics and visuals" },
          { value: "auditory", label: "The speaker is engaging and articulate" },
          { value: "kinesthetic", label: "There are interactive activities included" },
          { value: "reading", label: "There are handouts to follow along" },
        ],
      },
      {
        id: "ls3",
        text: "I study most effectively when:",
        options: [
          { value: "visual", label: "Using mind maps and color-coded notes" },
          { value: "auditory", label: "Recording and listening to lectures" },
          { value: "kinesthetic", label: "Moving around or using flashcards" },
          { value: "reading", label: "Reading and rewriting notes" },
        ],
      },
      {
        id: "ls4",
        text: "When remembering directions, I:",
        options: [
          { value: "visual", label: "Visualize the route in my mind" },
          { value: "auditory", label: "Repeat the directions out loud" },
          { value: "kinesthetic", label: "Remember by driving/walking the route" },
          { value: "reading", label: "Write down the directions" },
        ],
      },
      {
        id: "ls5",
        text: "I express my ideas best through:",
        options: [
          { value: "visual", label: "Drawings, diagrams, or presentations" },
          { value: "auditory", label: "Verbal discussions and explanations" },
          { value: "kinesthetic", label: "Physical demonstrations or models" },
          { value: "reading", label: "Written documents and reports" },
        ],
      },
    ],
  },
  {
    id: "cognitive-patterns",
    title: "Cognitive Patterns",
    description: "Explore how you think, process information, and approach mental challenges.",
    questions: [
      {
        id: "cp1",
        text: "When solving problems, I typically:",
        options: [
          { value: "sequential", label: "Work through steps in logical order" },
          { value: "global", label: "See the big picture first, then details" },
          { value: "analytical", label: "Break down into components" },
          { value: "intuitive", label: "Follow my instincts and hunches" },
        ],
      },
      {
        id: "cp2",
        text: "I process new information best when:",
        options: [
          { value: "concrete", label: "It's presented with real examples" },
          { value: "abstract", label: "I can understand the underlying theory" },
          { value: "practical", label: "I can see its practical application" },
          { value: "conceptual", label: "I understand how it connects to other ideas" },
        ],
      },
      {
        id: "cp3",
        text: "In discussions, I tend to:",
        options: [
          { value: "think-first", label: "Think carefully before speaking" },
          { value: "talk-through", label: "Talk through ideas to understand them" },
          { value: "question", label: "Ask many questions to clarify" },
          { value: "observe", label: "Observe and listen before contributing" },
        ],
      },
      {
        id: "cp4",
        text: "When facing ambiguity, I:",
        options: [
          { value: "structured", label: "Seek structure and clear guidelines" },
          { value: "explore", label: "Enjoy exploring possibilities" },
          { value: "research", label: "Research until I have clarity" },
          { value: "act", label: "Make a decision and adapt as I go" },
        ],
      },
      {
        id: "cp5",
        text: "My thinking style is best described as:",
        options: [
          { value: "linear", label: "Linear and methodical" },
          { value: "holistic", label: "Holistic and integrative" },
          { value: "creative", label: "Creative and divergent" },
          { value: "critical", label: "Critical and evaluative" },
        ],
      },
    ],
  },
  {
    id: "problem-solving-deep",
    title: "Problem-Solving Approach",
    description: "Detailed analysis of your strategies for tackling challenges.",
    questions: [
      {
        id: "psd1",
        text: "When I encounter a problem, my first instinct is to:",
        options: [
          { value: "define", label: "Clearly define what the problem is" },
          { value: "research", label: "Research how others have solved it" },
          { value: "brainstorm", label: "Brainstorm possible solutions" },
          { value: "act", label: "Try something and see what happens" },
        ],
      },
      {
        id: "psd2",
        text: "I prefer to work on problems:",
        options: [
          { value: "alone", label: "Alone with focused concentration" },
          { value: "partner", label: "With a partner for discussion" },
          { value: "team", label: "In a team with diverse perspectives" },
          { value: "flexible", label: "Varies depending on the problem" },
        ],
      },
      {
        id: "psd3",
        text: "When stuck on a problem, I usually:",
        options: [
          { value: "persist", label: "Keep working until I solve it" },
          { value: "break", label: "Take a break and return fresh" },
          { value: "switch", label: "Switch to a different approach" },
          { value: "help", label: "Seek help or collaboration" },
        ],
      },
      {
        id: "psd4",
        text: "I evaluate solutions by:",
        options: [
          { value: "logic", label: "Logical analysis of pros and cons" },
          { value: "testing", label: "Testing and experimentation" },
          { value: "feedback", label: "Getting feedback from others" },
          { value: "intuition", label: "Trusting my gut feeling" },
        ],
      },
      {
        id: "psd5",
        text: "After solving a problem, I:",
        options: [
          { value: "document", label: "Document the solution for future reference" },
          { value: "move-on", label: "Move on to the next challenge" },
          { value: "reflect", label: "Reflect on what I learned" },
          { value: "share", label: "Share the solution with others" },
        ],
      },
    ],
  },
  {
    id: "motivation-comprehensive",
    title: "Motivation & Drive",
    description: "Comprehensive assessment of what motivates and sustains your effort.",
    questions: [
      {
        id: "mc1",
        text: "I am most motivated to learn when:",
        options: [
          { value: "interest", label: "The topic genuinely interests me" },
          { value: "necessity", label: "It's necessary for my goals" },
          { value: "challenge", label: "It presents a challenging puzzle" },
          { value: "reward", label: "There's a clear reward or outcome" },
        ],
      },
      {
        id: "mc2",
        text: "I set goals that are:",
        options: [
          { value: "ambitious", label: "Ambitious and stretching" },
          { value: "achievable", label: "Realistic and achievable" },
          { value: "incremental", label: "Small and incremental" },
          { value: "flexible", label: "Flexible and adjustable" },
        ],
      },
      {
        id: "mc3",
        text: "Feedback motivates me most when it:",
        options: [
          { value: "positive", label: "Recognizes my achievements" },
          { value: "constructive", label: "Helps me improve" },
          { value: "specific", label: "Is specific and actionable" },
          { value: "comparative", label: "Shows how I compare to others" },
        ],
      },
      {
        id: "mc4",
        text: "I maintain long-term motivation through:",
        options: [
          { value: "vision", label: "Keeping my end vision in mind" },
          { value: "milestones", label: "Celebrating small milestones" },
          { value: "habits", label: "Building consistent habits" },
          { value: "variety", label: "Keeping things varied and fresh" },
        ],
      },
      {
        id: "mc5",
        text: "What energizes me most is:",
        options: [
          { value: "mastery", label: "Mastering new skills" },
          { value: "connection", label: "Connecting with others" },
          { value: "autonomy", label: "Having autonomy and control" },
          { value: "purpose", label: "Contributing to something meaningful" },
        ],
      },
    ],
  },
  {
    id: "environment-preferences",
    title: "Learning Environment Preferences",
    description: "Identify the conditions that help you learn most effectively.",
    questions: [
      {
        id: "ep1",
        text: "My ideal learning environment is:",
        options: [
          { value: "quiet", label: "Quiet and distraction-free" },
          { value: "background", label: "With background noise or music" },
          { value: "social", label: "With others around for interaction" },
          { value: "varied", label: "Varies depending on my mood" },
        ],
      },
      {
        id: "ep2",
        text: "I learn best at:",
        options: [
          { value: "morning", label: "Early morning when I'm fresh" },
          { value: "afternoon", label: "Afternoon after warming up" },
          { value: "evening", label: "Evening when things quiet down" },
          { value: "night", label: "Late night with no distractions" },
        ],
      },
      {
        id: "ep3",
        text: "For sustained learning, I need:",
        options: [
          { value: "long-blocks", label: "Long uninterrupted blocks of time" },
          { value: "short-bursts", label: "Short focused bursts with breaks" },
          { value: "variety", label: "Variety in activities and topics" },
          { value: "flexibility", label: "Flexibility to follow my interest" },
        ],
      },
      {
        id: "ep4",
        text: "Technology in learning helps me:",
        options: [
          { value: "essential", label: "It's essential for how I learn" },
          { value: "supplement", label: "As a supplement to other methods" },
          { value: "sometimes", label: "Sometimes, but I prefer traditional methods" },
          { value: "minimal", label: "I prefer minimal technology" },
        ],
      },
      {
        id: "ep5",
        text: "I prefer learning resources that are:",
        options: [
          { value: "structured", label: "Highly structured with clear paths" },
          { value: "exploratory", label: "Exploratory with room to wander" },
          { value: "interactive", label: "Interactive with immediate feedback" },
          { value: "comprehensive", label: "Comprehensive and detailed" },
        ],
      },
    ],
  },
  {
    id: "numerical-data-reasoning",
    title: "Numerical & Data Reasoning",
    description: "Comprehensive evaluation of numerical aptitude and data interpretation skills.",
    questions: [
      {
        id: "ndr1",
        text: "A shopkeeper sells an item for ₹1,350 after giving a 10% discount. What was the original price?",
        options: [
          { value: "a", label: "A) ₹1,450" },
          { value: "b", label: "B) ₹1,485" },
          { value: "c", label: "C) ₹1,500" },
          { value: "d", label: "D) ₹1,550" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr2",
        text: "If 5 workers can complete a task in 12 days, how many days will 8 workers take at the same rate?",
        options: [
          { value: "a", label: "A) 6.5 days" },
          { value: "b", label: "B) 7 days" },
          { value: "c", label: "C) 7.5 days" },
          { value: "d", label: "D) 8 days" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr3",
        text: "A tank is 3/4 full. After using 30 liters, it becomes 1/2 full. What is the tank's capacity?",
        options: [
          { value: "a", label: "A) 100 liters" },
          { value: "b", label: "B) 120 liters" },
          { value: "c", label: "C) 140 liters" },
          { value: "d", label: "D) 150 liters" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr4",
        text: "A person invests ₹25,000 at 8% simple interest per annum. What is the interest after 3 years?",
        options: [
          { value: "a", label: "A) ₹5,000" },
          { value: "b", label: "B) ₹5,500" },
          { value: "c", label: "C) ₹6,000" },
          { value: "d", label: "D) ₹6,500" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr5",
        text: "What is the average of the following numbers: 42, 58, 73, 61, 51?",
        options: [
          { value: "a", label: "A) 55" },
          { value: "b", label: "B) 57" },
          { value: "c", label: "C) 59" },
          { value: "d", label: "D) 61" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  {
    id: "quantitative-aptitude",
    title: "Quantitative Aptitude",
    description: "Advanced quantitative problem-solving and mathematical reasoning.",
    questions: [
      {
        id: "qa1",
        text: "If x + y = 12 and x - y = 4, what is the value of x?",
        options: [
          { value: "a", label: "A) 6" },
          { value: "b", label: "B) 7" },
          { value: "c", label: "C) 8" },
          { value: "d", label: "D) 9" },
          { value: "e", label: "E) I don't know" },

    id: "quantitative-aptitude",
    title: "Quantitative Aptitude",
    description: "Evaluate your numerical reasoning and problem-solving abilities with practical examples.",
    questions: [
      {
        id: "qa1",
        text: "A vendor sells mangoes at ₹60 per kg and makes a profit of 20%. What was the cost price per kg?",
        options: [
          { value: "45", label: "₹45" },
          { value: "48", label: "₹48" },
          { value: "50", label: "₹50" },
          { value: "55", label: "₹55" },
        ],
      },
      {
        id: "qa2",
        text: "A rectangle's length is twice its width. If the perimeter is 72 cm, what is the area?",
        options: [
          { value: "a", label: "A) 240 sq cm" },
          { value: "b", label: "B) 264 sq cm" },
          { value: "c", label: "C) 288 sq cm" },
          { value: "d", label: "D) 312 sq cm" },
          { value: "e", label: "E) I don't know" },
        text: "If a laptop costs ₹45,000 after a 10% discount, what was the original price?",
        options: [
          { value: "50000", label: "₹50,000" },
          { value: "49500", label: "₹49,500" },
          { value: "48000", label: "₹48,000" },
          { value: "51000", label: "₹51,000" },
        ],
      },
      {
        id: "qa3",
        text: "What is 15% of 840 plus 25% of 560?",
        options: [
          { value: "a", label: "A) 246" },
          { value: "b", label: "B) 266" },
          { value: "c", label: "C) 286" },
          { value: "d", label: "D) 306" },
          { value: "e", label: "E) I don't know" },
        text: "A person saves ₹1,200 per month. If they want to buy a phone worth ₹18,000, how many months of savings are needed?",
        options: [
          { value: "15", label: "15 months" },
          { value: "12", label: "12 months" },
          { value: "18", label: "18 months" },
          { value: "10", label: "10 months" },
        ],
      },
      {
        id: "qa4",
        text: "A train 120 meters long passes a pole in 8 seconds. What is its speed in km/h?",
        options: [
          { value: "a", label: "A) 48 km/h" },
          { value: "b", label: "B) 52 km/h" },
          { value: "c", label: "C) 54 km/h" },
          { value: "d", label: "D) 58 km/h" },
          { value: "e", label: "E) I don't know" },
        text: "Three friends share a restaurant bill of ₹2,400 in the ratio 2:3:3. How much does the first person pay?",
        options: [
          { value: "600", label: "₹600" },
          { value: "800", label: "₹800" },
          { value: "900", label: "₹900" },
          { value: "750", label: "₹750" },
        ],
      },
      {
        id: "qa5",
        text: "If the cost price of 12 items equals the selling price of 10 items, what is the profit percentage?",
        options: [
          { value: "a", label: "A) 15%" },
          { value: "b", label: "B) 20%" },
          { value: "c", label: "C) 25%" },
          { value: "d", label: "D) 30%" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  {
    id: "abstract-logical-reasoning",
    title: "Abstract & Logical Reasoning",
    description: "Advanced pattern recognition, logical deduction, and analytical thinking.",
    questions: [
      {
        id: "alr1",
        text: "Complete the series: 3, 9, 27, 81, ?",
        options: [
          { value: "a", label: "A) 162" },
          { value: "b", label: "B) 216" },
          { value: "c", label: "C) 243" },
          { value: "d", label: "D) 324" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr2",
        text: "If all roses are flowers and some flowers are red, which conclusion is certain?",
        options: [
          { value: "a", label: "A) All roses are red" },
          { value: "b", label: "B) Some roses are red" },
          { value: "c", label: "C) All red things are roses" },
          { value: "d", label: "D) None of these is certain" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr3",
        text: "What comes next in the pattern: Z, Y, X, W, V, ?",
        options: [
          { value: "a", label: "A) T" },
          { value: "b", label: "B) U" },
          { value: "c", label: "C) S" },
          { value: "d", label: "D) R" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr4",
        text: "If CODE is written as FRGH, how is MIND written?",
        options: [
          { value: "a", label: "A) PLQG" },
          { value: "b", label: "B) NLQG" },
          { value: "c", label: "C) OKPI" },
          { value: "d", label: "D) MIND" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr5",
        text: "What is the next number in the sequence: 2, 5, 11, 23, 47, ?",
        options: [
          { value: "a", label: "A) 89" },
          { value: "b", label: "B) 91" },
          { value: "c", label: "C) 93" },
          { value: "d", label: "D) 95" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  {
    id: "spatial-visual-reasoning",
    title: "Spatial & Visual Reasoning",
    description: "Assess spatial awareness, visual pattern recognition, and mechanical aptitude.",
    questions: [
      {
        id: "svr1",
        text: "A cube is painted red on all faces and then cut into 27 smaller equal cubes. How many cubes have exactly one face painted?",
        options: [
          { value: "a", label: "A) 4" },
          { value: "b", label: "B) 6" },
          { value: "c", label: "C) 8" },
          { value: "d", label: "D) 12" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr2",
        text: "If you fold a square paper in half twice and make one cut, how many holes will appear when unfolded?",
        options: [
          { value: "a", label: "A) 2 holes" },
          { value: "b", label: "B) 4 holes" },
          { value: "c", label: "C) 6 holes" },
          { value: "d", label: "D) 8 holes" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr3",
        text: "Looking at a clock mirror reflection showing 3:40, what is the actual time?",
        options: [
          { value: "a", label: "A) 8:20" },
          { value: "b", label: "B) 8:40" },
          { value: "c", label: "C) 9:20" },
          { value: "d", label: "D) 9:40" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr4",
        text: "A gear with 20 teeth rotates clockwise. A connected gear with 40 teeth will rotate:",
        options: [
          { value: "a", label: "A) Clockwise at half speed" },
          { value: "b", label: "B) Counter-clockwise at half speed" },
          { value: "c", label: "C) Clockwise at double speed" },
          { value: "d", label: "D) Counter-clockwise at double speed" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr5",
        text: "How many faces does a rectangular prism (cuboid) have?",
        options: [
          { value: "a", label: "A) 4" },
          { value: "b", label: "B) 6" },
          { value: "c", label: "C) 8" },
          { value: "d", label: "D) 12" },
          { value: "e", label: "E) I don't know" },
        text: "A shopkeeper marks up an item by 25% and then offers a 10% discount. If the cost price is ₹800, what is the selling price?",
        options: [
          { value: "900", label: "₹900" },
          { value: "850", label: "₹850" },
          { value: "920", label: "₹920" },
          { value: "880", label: "₹880" },
        ],
      },
    ],
  },
];

export default function ElaborateTestPage() {
  const router = useRouter();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentModule = modules[currentModuleIndex];
  const currentQuestion = currentModule.questions[currentQuestionIndex];
  const totalQuestions = modules.reduce((acc, m) => acc + m.questions.length, 0);
  
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = useMemo(() => (answeredCount / totalQuestions) * 100, [answeredCount, totalQuestions]);
  
  const isFirstQuestion = currentModuleIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion = currentModuleIndex === modules.length - 1 && 
    currentQuestionIndex === currentModule.questions.length - 1;

  const handleSelectAnswer = useCallback((value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }, [currentQuestion.id]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < currentModule.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentQuestionIndex, currentModuleIndex, currentModule.questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex((prev) => prev - 1);
      const prevModule = modules[currentModuleIndex - 1];
      setCurrentQuestionIndex(prevModule.questions.length - 1);
    }
  }, [currentQuestionIndex, currentModuleIndex]);

  const handleSubmit = useCallback(() => {
    setIsAnalyzing(true);
    
    // Store answers in sessionStorage for the results page
    const resultsData = {
      testType: "elaborate",
      answers,
      modules: modules.map((m) => ({
        id: m.id,
        title: m.title,
        answers: m.questions.map((q) => ({
          questionId: q.id,
          question: q.text,
          answer: answers[q.id] || null,
        })),
      })),
      completedAt: new Date().toISOString(),
    };
    
    sessionStorage.setItem("learnapt-results", JSON.stringify(resultsData));
    
    // Also save to localStorage for admin history
    try {
      const historyStr = localStorage.getItem("learnapt-assessment-history");
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.unshift({
        id: `elaborate-${Date.now()}`,
        ...resultsData,
      });
      // Keep only last 100 assessments
      localStorage.setItem("learnapt-assessment-history", JSON.stringify(history.slice(0, 100)));
    } catch (e) {
      console.error("Failed to save assessment history:", e);
    }
    
    // Short delay to show analyzing state, then navigate
    setTimeout(() => {
      router.push("/results");
    }, 1500);
  }, [answers, router]);

  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Learnapt</span>
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400">Elaborate Test</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {isAnalyzing ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Analyzing Your Responses
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Please wait while we prepare your comprehensive results...
            </p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>{answeredCount} of {totalQuestions} questions answered</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Module Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                  Module {currentModuleIndex + 1} of {modules.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {currentModule.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentModule.description}
              </p>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Question {currentQuestionIndex + 1} of {currentModule.questions.length}
              </p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                {currentQuestion.text}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectAnswer(option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      currentAnswer === option.value
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          currentAnswer === option.value
                            ? "border-purple-600 bg-purple-600"
                            : "border-slate-300 dark:border-slate-500"
                        }`}
                      >
                        {currentAnswer === option.value && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className={`${
                        currentAnswer === option.value
                          ? "text-purple-900 dark:text-purple-100"
                          : "text-slate-700 dark:text-slate-300"
                      }`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isFirstQuestion
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < totalQuestions}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                    answeredCount < totalQuestions
                      ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  Submit Test
                  <Check className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                    !currentAnswer
                      ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
