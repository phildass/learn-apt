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
      {
        id: "ls6",
        text: "When assembling furniture or equipment, I prefer to:",
        options: [
          { value: "visual", label: "Follow diagrams and pictures" },
          { value: "auditory", label: "Have someone explain the steps" },
          { value: "kinesthetic", label: "Figure it out by trial and error" },
          { value: "reading", label: "Read the written instructions carefully" },
        ],
      },
      {
        id: "ls7",
        text: "I remember people best by:",
        options: [
          { value: "visual", label: "Their face and appearance" },
          { value: "auditory", label: "Their name and voice" },
          { value: "kinesthetic", label: "What we did together" },
          { value: "reading", label: "Written notes about them" },
        ],
      },
      {
        id: "ls8",
        text: "When I need to focus, I prefer:",
        options: [
          { value: "visual", label: "A clean, organized visual space" },
          { value: "auditory", label: "Quiet or white noise" },
          { value: "kinesthetic", label: "To fidget or move while thinking" },
          { value: "reading", label: "To have reference materials nearby" },
        ],
      },
      {
        id: "ls9",
        text: "I enjoy learning activities that involve:",
        options: [
          { value: "visual", label: "Watching and observing" },
          { value: "auditory", label: "Listening and discussing" },
          { value: "kinesthetic", label: "Hands-on practice" },
          { value: "reading", label: "Reading and note-taking" },
        ],
      },
      {
        id: "ls10",
        text: "When explaining something complex, I tend to:",
        options: [
          { value: "visual", label: "Draw diagrams or use visuals" },
          { value: "auditory", label: "Talk through it step by step" },
          { value: "kinesthetic", label: "Use gestures and demonstrations" },
          { value: "reading", label: "Write it out in detail" },
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
      {
        id: "cp6",
        text: "When learning new concepts, I prefer to:",
        options: [
          { value: "build-up", label: "Build up from fundamentals" },
          { value: "overview", label: "Start with an overview" },
          { value: "examples", label: "Learn through examples" },
          { value: "practice", label: "Jump into practice immediately" },
        ],
      },
      {
        id: "cp7",
        text: "I make decisions primarily based on:",
        options: [
          { value: "logic", label: "Logic and analysis" },
          { value: "intuition", label: "Intuition and gut feeling" },
          { value: "data", label: "Data and evidence" },
          { value: "experience", label: "Past experience" },
        ],
      },
      {
        id: "cp8",
        text: "When faced with multiple tasks, I tend to:",
        options: [
          { value: "prioritize", label: "Prioritize and tackle one at a time" },
          { value: "multitask", label: "Work on multiple tasks simultaneously" },
          { value: "urgent", label: "Handle the most urgent first" },
          { value: "easy", label: "Start with easier tasks first" },
        ],
      },
      {
        id: "cp9",
        text: "My approach to learning complex subjects is:",
        options: [
          { value: "systematic", label: "Systematic and structured" },
          { value: "exploratory", label: "Exploratory and flexible" },
          { value: "social", label: "Collaborative with others" },
          { value: "independent", label: "Independent and self-directed" },
        ],
      },
      {
        id: "cp10",
        text: "When analyzing information, I focus on:",
        options: [
          { value: "details", label: "Specific details and facts" },
          { value: "patterns", label: "Patterns and relationships" },
          { value: "implications", label: "Implications and consequences" },
          { value: "applications", label: "Practical applications" },
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
      {
        id: "psd6",
        text: "When facing a deadline, I:",
        options: [
          { value: "plan", label: "Create a detailed plan and timeline" },
          { value: "focus", label: "Focus intensely on the task" },
          { value: "prioritize", label: "Identify and prioritize critical elements" },
          { value: "collaborate", label: "Seek help to distribute the workload" },
        ],
      },
      {
        id: "psd7",
        text: "My problem-solving strength lies in:",
        options: [
          { value: "creativity", label: "Finding creative, innovative solutions" },
          { value: "analysis", label: "Thorough analysis and logic" },
          { value: "persistence", label: "Persistence and determination" },
          { value: "collaboration", label: "Working well with others" },
        ],
      },
      {
        id: "psd8",
        text: "When a solution doesn't work, I:",
        options: [
          { value: "analyze", label: "Analyze why it failed" },
          { value: "try-again", label: "Try a completely different approach" },
          { value: "modify", label: "Modify and refine the solution" },
          { value: "consult", label: "Consult with others for input" },
        ],
      },
      {
        id: "psd9",
        text: "I prefer problems that are:",
        options: [
          { value: "structured", label: "Well-defined with clear parameters" },
          { value: "open-ended", label: "Open-ended with multiple solutions" },
          { value: "challenging", label: "Challenging and complex" },
          { value: "practical", label: "Practical with real-world applications" },
        ],
      },
      {
        id: "psd10",
        text: "When learning from mistakes, I:",
        options: [
          { value: "systematic", label: "Systematically identify what went wrong" },
          { value: "move-forward", label: "Move forward without dwelling" },
          { value: "document", label: "Document lessons learned" },
          { value: "discuss", label: "Discuss with others to gain perspective" },
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
      {
        id: "mc6",
        text: "When facing setbacks, I:",
        options: [
          { value: "persevere", label: "Persevere with renewed determination" },
          { value: "regroup", label: "Take time to regroup and reassess" },
          { value: "seek-support", label: "Seek support and encouragement" },
          { value: "pivot", label: "Pivot to a new approach or goal" },
        ],
      },
      {
        id: "mc7",
        text: "I feel most accomplished when:",
        options: [
          { value: "complete", label: "I complete a difficult task" },
          { value: "learn", label: "I learn something new" },
          { value: "help", label: "I help others succeed" },
          { value: "recognition", label: "My work is recognized" },
        ],
      },
      {
        id: "mc8",
        text: "My work ethic is driven by:",
        options: [
          { value: "excellence", label: "Pursuit of excellence" },
          { value: "responsibility", label: "Sense of responsibility" },
          { value: "passion", label: "Passion for what I do" },
          { value: "results", label: "Desire to see results" },
        ],
      },
      {
        id: "mc9",
        text: "I stay committed to long-term goals through:",
        options: [
          { value: "vision", label: "Keeping the end vision clear" },
          { value: "progress", label: "Tracking and celebrating progress" },
          { value: "accountability", label: "Accountability to myself or others" },
          { value: "enjoyment", label: "Finding enjoyment in the process" },
        ],
      },
      {
        id: "mc10",
        text: "When choosing what to learn, I prioritize:",
        options: [
          { value: "passion", label: "My personal passions and interests" },
          { value: "career", label: "Career advancement opportunities" },
          { value: "skill-gaps", label: "Addressing my skill gaps" },
          { value: "trending", label: "Current trends and demands" },
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
      {
        id: "ep6",
        text: "My productivity is highest when I work:",
        options: [
          { value: "alone", label: "Alone in my personal space" },
          { value: "coffee-shop", label: "In a coffee shop or public space" },
          { value: "office", label: "In a structured office environment" },
          { value: "home-office", label: "In a home office setup" },
        ],
      },
      {
        id: "ep7",
        text: "I manage my learning schedule by:",
        options: [
          { value: "fixed", label: "Setting fixed times each day" },
          { value: "flexible", label: "Keeping it flexible based on energy" },
          { value: "deadlines", label: "Working towards specific deadlines" },
          { value: "spontaneous", label: "Learning spontaneously when inspired" },
        ],
      },
      {
        id: "ep8",
        text: "Physical comfort affects my learning:",
        options: [
          { value: "critical", label: "It's critical - I need the right setup" },
          { value: "important", label: "It's important but not essential" },
          { value: "minimal", label: "Minimal impact - I can adapt" },
          { value: "varies", label: "Varies with the task" },
        ],
      },
      {
        id: "ep9",
        text: "I prefer to receive feedback:",
        options: [
          { value: "immediate", label: "Immediately as I work" },
          { value: "periodic", label: "At regular intervals" },
          { value: "end", label: "After completing the task" },
          { value: "on-request", label: "Only when I request it" },
        ],
      },
      {
        id: "ep10",
        text: "Distractions affect my learning:",
        options: [
          { value: "severely", label: "Severely - I need complete focus" },
          { value: "moderately", label: "Moderately - some are manageable" },
          { value: "minimally", label: "Minimally - I can filter them out" },
          { value: "helps", label: "Sometimes help me think differently" },
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
      {
        id: "ndr6",
        text: "A train travels 180 km in 3 hours. What is its average speed in km/h?",
        options: [
          { value: "a", label: "A) 50 km/h" },
          { value: "b", label: "B) 55 km/h" },
          { value: "c", label: "C) 60 km/h" },
          { value: "d", label: "D) 65 km/h" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr7",
        text: "If the price of petrol increases from ₹80 to ₹96 per liter, what is the percentage increase?",
        options: [
          { value: "a", label: "A) 15%" },
          { value: "b", label: "B) 18%" },
          { value: "c", label: "C) 20%" },
          { value: "d", label: "D) 25%" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr8",
        text: "A rectangle has length 15 cm and width 8 cm. What is its area?",
        options: [
          { value: "a", label: "A) 100 sq cm" },
          { value: "b", label: "B) 120 sq cm" },
          { value: "c", label: "C) 130 sq cm" },
          { value: "d", label: "D) 140 sq cm" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr9",
        text: "If 3x + 5 = 20, what is the value of x?",
        options: [
          { value: "a", label: "A) 3" },
          { value: "b", label: "B) 4" },
          { value: "c", label: "C) 5" },
          { value: "d", label: "D) 6" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr10",
        text: "A product's price increased by 20% and then decreased by 20%. If the original price was ₹1,000, what is the final price?",
        options: [
          { value: "a", label: "A) ₹960" },
          { value: "b", label: "B) ₹980" },
          { value: "c", label: "C) ₹1,000" },
          { value: "d", label: "D) ₹1,020" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  {
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
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa2",
        text: "If a laptop costs ₹45,000 after a 10% discount, what was the original price?",
        options: [
          { value: "50000", label: "₹50,000" },
          { value: "49500", label: "₹49,500" },
          { value: "48000", label: "₹48,000" },
          { value: "51000", label: "₹51,000" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa3",
        text: "A person saves ₹1,200 per month. If they want to buy a phone worth ₹18,000, how many months of savings are needed?",
        options: [
          { value: "15", label: "15 months" },
          { value: "12", label: "12 months" },
          { value: "18", label: "18 months" },
          { value: "10", label: "10 months" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa4",
        text: "Three friends share a restaurant bill of ₹2,400 in the ratio 2:3:3. How much does the first person pay?",
        options: [
          { value: "600", label: "₹600" },
          { value: "800", label: "₹800" },
          { value: "900", label: "₹900" },
          { value: "750", label: "₹750" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa5",
        text: "A shopkeeper marks up an item by 25% and then offers a 10% discount. If the cost price is ₹800, what is the selling price?",
        options: [
          { value: "900", label: "₹900" },
          { value: "850", label: "₹850" },
          { value: "920", label: "₹920" },
          { value: "880", label: "₹880" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa6",
        text: "A car depreciates 15% annually. If it costs ₹5,00,000 today, what will be its approximate value after 2 years?",
        options: [
          { value: "361250", label: "₹3,61,250" },
          { value: "425000", label: "₹4,25,000" },
          { value: "400000", label: "₹4,00,000" },
          { value: "375000", label: "₹3,75,000" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa7",
        text: "If the ratio of boys to girls in a class is 3:2 and there are 40 students, how many girls are there?",
        options: [
          { value: "12", label: "12" },
          { value: "14", label: "14" },
          { value: "16", label: "16" },
          { value: "18", label: "18" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa8",
        text: "A sum of ₹10,000 becomes ₹13,310 in 3 years at compound interest. What is the annual rate of interest?",
        options: [
          { value: "8", label: "8%" },
          { value: "10", label: "10%" },
          { value: "12", label: "12%" },
          { value: "15", label: "15%" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa9",
        text: "A pipe can fill a tank in 6 hours. Another pipe can empty it in 8 hours. If both are opened, how long will it take to fill the tank?",
        options: [
          { value: "20", label: "20 hours" },
          { value: "22", label: "22 hours" },
          { value: "24", label: "24 hours" },
          { value: "26", label: "26 hours" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa10",
        text: "A merchant buys goods worth ₹15,000 and sells them at a loss of 12%. What is the selling price?",
        options: [
          { value: "13200", label: "₹13,200" },
          { value: "13500", label: "₹13,500" },
          { value: "14000", label: "₹14,000" },
          { value: "14200", label: "₹14,200" },
          { value: "idk", label: "I don't know" },
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
      {
        id: "alr6",
        text: "All teachers are educated. Some educated people are doctors. Which conclusion is definitely true?",
        options: [
          { value: "a", label: "A) All doctors are teachers" },
          { value: "b", label: "B) Some teachers are doctors" },
          { value: "c", label: "C) All teachers are educated" },
          { value: "d", label: "D) Some doctors are not educated" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr7",
        text: "Find the odd one out: 8, 27, 64, 100, 125",
        options: [
          { value: "a", label: "A) 8" },
          { value: "b", label: "B) 27" },
          { value: "c", label: "C) 64" },
          { value: "d", label: "D) 100" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr8",
        text: "Complete the analogy: Book : Pages :: Building : ?",
        options: [
          { value: "a", label: "A) Floors" },
          { value: "b", label: "B) Bricks" },
          { value: "c", label: "C) Rooms" },
          { value: "d", label: "D) Windows" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr9",
        text: "If A > B, B = C, and C < D, which statement is definitely true?",
        options: [
          { value: "a", label: "A) A > D" },
          { value: "b", label: "B) A < D" },
          { value: "c", label: "C) A > C" },
          { value: "d", label: "D) B > D" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr10",
        text: "What comes next: 1, 4, 9, 16, 25, ?",
        options: [
          { value: "a", label: "A) 30" },
          { value: "b", label: "B) 32" },
          { value: "c", label: "C) 36" },
          { value: "d", label: "D) 40" },
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
        ],
      },
      {
        id: "svr6",
        text: "A dice is rolled twice and shows a 3, then a 5. What will be the number on the bottom face when it shows 5 on top? (Opposite faces add to 7)",
        options: [
          { value: "a", label: "A) 1" },
          { value: "b", label: "B) 2" },
          { value: "c", label: "C) 3" },
          { value: "d", label: "D) 4" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr7",
        text: "If you rotate a square 90 degrees clockwise, which corner moves to the top-right position from the top-left?",
        options: [
          { value: "a", label: "A) Bottom-left" },
          { value: "b", label: "B) Bottom-right" },
          { value: "c", label: "C) Top-right" },
          { value: "d", label: "D) Stays the same" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr8",
        text: "How many edges does a triangular pyramid have?",
        options: [
          { value: "a", label: "A) 4" },
          { value: "b", label: "B) 5" },
          { value: "c", label: "C) 6" },
          { value: "d", label: "D) 8" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr9",
        text: "A cylindrical tank with radius 7 cm is being filled. What pattern does the water surface form?",
        options: [
          { value: "a", label: "A) Sphere" },
          { value: "b", label: "B) Circle" },
          { value: "c", label: "C) Ellipse" },
          { value: "d", label: "D) Rectangle" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr10",
        text: "If a piece of paper is folded exactly in half 3 times and one corner is cut off, how many holes will appear when unfolded?",
        options: [
          { value: "a", label: "A) 3" },
          { value: "b", label: "B) 6" },
          { value: "c", label: "C) 7" },
          { value: "d", label: "D) 8" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  {
    id: "verbal-reasoning",
    title: "Verbal Reasoning",
    description: "Assess your language comprehension, vocabulary, and verbal logic abilities.",
    questions: [
      {
        id: "vr1",
        text: "Choose the word most similar in meaning to 'BENEVOLENT':",
        options: [
          { value: "a", label: "A) Hostile" },
          { value: "b", label: "B) Kind" },
          { value: "c", label: "C) Indifferent" },
          { value: "d", label: "D) Aggressive" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr2",
        text: "Find the odd one out: Happy, Joyful, Elated, Sad, Cheerful",
        options: [
          { value: "a", label: "A) Happy" },
          { value: "b", label: "B) Joyful" },
          { value: "c", label: "C) Sad" },
          { value: "d", label: "D) Cheerful" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr3",
        text: "Complete the analogy: Doctor : Hospital :: Teacher : ?",
        options: [
          { value: "a", label: "A) Classroom" },
          { value: "b", label: "B) Books" },
          { value: "c", label: "C) Students" },
          { value: "d", label: "D) School" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr4",
        text: "What is the antonym of 'EXPAND'?",
        options: [
          { value: "a", label: "A) Grow" },
          { value: "b", label: "B) Contract" },
          { value: "c", label: "C) Increase" },
          { value: "d", label: "D) Develop" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr5",
        text: "If 'WRITE' is coded as 'XSJUF', how is 'READ' coded?",
        options: [
          { value: "a", label: "A) SFBE" },
          { value: "b", label: "B) SFBD" },
          { value: "c", label: "C) QDZC" },
          { value: "d", label: "D) TDBE" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr6",
        text: "Choose the correctly spelled word:",
        options: [
          { value: "a", label: "A) Ocassion" },
          { value: "b", label: "B) Occasion" },
          { value: "c", label: "C) Ocasion" },
          { value: "d", label: "D) Occassion" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr7",
        text: "Select the word that best completes the sentence: The lawyer's argument was very _____ and convinced the jury.",
        options: [
          { value: "a", label: "A) Weak" },
          { value: "b", label: "B) Persuasive" },
          { value: "c", label: "C) Confusing" },
          { value: "d", label: "D) Brief" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr8",
        text: "Identify the grammatically correct sentence:",
        options: [
          { value: "a", label: "A) Neither of the students have completed their homework" },
          { value: "b", label: "B) Neither of the students has completed their homework" },
          { value: "c", label: "C) Neither of the student have completed their homework" },
          { value: "d", label: "D) Neither of the student has completed his homework" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr9",
        text: "What does the idiom 'A blessing in disguise' mean?",
        options: [
          { value: "a", label: "A) A secret gift" },
          { value: "b", label: "B) Something good that initially seemed bad" },
          { value: "c", label: "C) A hidden danger" },
          { value: "d", label: "D) An unexpected visitor" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr10",
        text: "Choose the word that is most opposite to 'TRANSPARENT':",
        options: [
          { value: "a", label: "A) Clear" },
          { value: "b", label: "B) Opaque" },
          { value: "c", label: "C) Visible" },
          { value: "d", label: "D) Translucent" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  {
    id: "critical-thinking",
    title: "Critical Thinking",
    description: "Evaluate your ability to analyze arguments, identify assumptions, and draw logical conclusions.",
    questions: [
      {
        id: "ct1",
        text: "Which of the following is an assumption in this argument: 'All students who study hard get good grades. Ram studies hard.'",
        options: [
          { value: "a", label: "A) Ram will get good grades" },
          { value: "b", label: "B) Studying is the only factor affecting grades" },
          { value: "c", label: "C) Ram is intelligent" },
          { value: "d", label: "D) Good grades are important" },
        ],
      },
      {
        id: "ct2",
        text: "Identify the logical fallacy: 'Everyone is buying this phone, so it must be the best.'",
        options: [
          { value: "a", label: "A) Ad hominem" },
          { value: "b", label: "B) Bandwagon fallacy" },
          { value: "c", label: "C) Straw man" },
          { value: "d", label: "D) False dilemma" },
        ],
      },
      {
        id: "ct3",
        text: "What is the best conclusion from this data: 'In 80% of accidents, drivers were using phones. Therefore...'",
        options: [
          { value: "a", label: "A) Phone use causes all accidents" },
          { value: "b", label: "B) Phone use is correlated with accidents" },
          { value: "c", label: "C) Phones should be banned" },
          { value: "d", label: "D) 20% of drivers don't use phones" },
        ],
      },
      {
        id: "ct4",
        text: "Which statement strengthens this argument: 'Online learning is effective for adult learners.'",
        options: [
          { value: "a", label: "A) Some students prefer in-person classes" },
          { value: "b", label: "B) Adult learners show higher engagement in online courses" },
          { value: "c", label: "C) Technology is evolving" },
          { value: "d", label: "D) Traditional education has a long history" },
        ],
      },
      {
        id: "ct5",
        text: "Evaluate: 'If it rains, the match will be cancelled. The match was cancelled. Therefore, it rained.' This is:",
        options: [
          { value: "a", label: "A) Valid reasoning" },
          { value: "b", label: "B) Invalid - affirming the consequent" },
          { value: "c", label: "C) Invalid - denying the antecedent" },
          { value: "d", label: "D) Valid but unsound" },
        ],
      },
      {
        id: "ct6",
        text: "What is the main flaw in this argument: 'My grandfather smoked and lived to 90, so smoking isn't harmful.'",
        options: [
          { value: "a", label: "A) Hasty generalization" },
          { value: "b", label: "B) Circular reasoning" },
          { value: "c", label: "C) Appeal to authority" },
          { value: "d", label: "D) False cause" },
        ],
      },
      {
        id: "ct7",
        text: "Which option best evaluates evidence: 'A survey of 10 people showed product X is popular.'",
        options: [
          { value: "a", label: "A) Strong evidence - survey was conducted" },
          { value: "b", label: "B) Weak evidence - small sample size" },
          { value: "c", label: "C) Moderate evidence - depends on the product" },
          { value: "d", label: "D) No evidence - surveys are unreliable" },
        ],
      },
      {
        id: "ct8",
        text: "Identify the type of reasoning: 'The sun has risen every day in recorded history, so it will rise tomorrow.'",
        options: [
          { value: "a", label: "A) Deductive reasoning" },
          { value: "b", label: "B) Inductive reasoning" },
          { value: "c", label: "C) Abductive reasoning" },
          { value: "d", label: "D) Causal reasoning" },
        ],
      },
      {
        id: "ct9",
        text: "What weakens this claim: 'Meditation improves focus in all individuals.'",
        options: [
          { value: "a", label: "A) Many people meditate daily" },
          { value: "b", label: "B) Some individuals show no improvement after meditation" },
          { value: "c", label: "C) Meditation has ancient roots" },
          { value: "d", label: "D) Focus is important for success" },
        ],
      },
      {
        id: "ct10",
        text: "In scientific reasoning, what is the purpose of a control group?",
        options: [
          { value: "a", label: "A) To save time in experiments" },
          { value: "b", label: "B) To provide a baseline for comparison" },
          { value: "c", label: "C) To increase sample size" },
          { value: "d", label: "D) To prove the hypothesis" },
        ],
      },
    ],
  },
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence",
    description: "Assess your ability to recognize, understand, and manage emotions in yourself and others.",
    questions: [
      {
        id: "ei1",
        text: "When a colleague is visibly upset after a meeting, I typically:",
        options: [
          { value: "a", label: "Give them space to process alone" },
          { value: "b", label: "Ask if they'd like to talk about it" },
          { value: "c", label: "Try to cheer them up immediately" },
          { value: "d", label: "Continue with work as normal" },
        ],
      },
      {
        id: "ei2",
        text: "When I receive criticism, I usually:",
        options: [
          { value: "a", label: "Feel defensive initially but reflect later" },
          { value: "b", label: "Immediately seek to understand the feedback" },
          { value: "c", label: "Feel hurt and need time to recover" },
          { value: "d", label: "Analyze it objectively right away" },
        ],
      },
      {
        id: "ei3",
        text: "In conflicts, I am best at:",
        options: [
          { value: "a", label: "Understanding different perspectives" },
          { value: "b", label: "Finding compromise solutions" },
          { value: "c", label: "Staying calm under pressure" },
          { value: "d", label: "Clearly expressing my position" },
        ],
      },
      {
        id: "ei4",
        text: "I recognize my own emotions:",
        options: [
          { value: "a", label: "Immediately as they arise" },
          { value: "b", label: "After some reflection" },
          { value: "c", label: "Through physical sensations" },
          { value: "d", label: "When others point them out" },
        ],
      },
      {
        id: "ei5",
        text: "When team morale is low, I:",
        options: [
          { value: "a", label: "Acknowledge the situation and discuss solutions" },
          { value: "b", label: "Try to boost spirits with positivity" },
          { value: "c", label: "Focus on the work that needs to be done" },
          { value: "d", label: "Give people time to adjust" },
        ],
      },
      {
        id: "ei6",
        text: "I handle stress by:",
        options: [
          { value: "a", label: "Taking breaks and practicing self-care" },
          { value: "b", label: "Talking through it with others" },
          { value: "c", label: "Pushing through and staying busy" },
          { value: "d", label: "Analyzing the source and making changes" },
        ],
      },
      {
        id: "ei7",
        text: "When making important decisions, I:",
        options: [
          { value: "a", label: "Balance logic with intuition" },
          { value: "b", label: "Rely primarily on rational analysis" },
          { value: "c", label: "Consider how it affects others" },
          { value: "d", label: "Trust my gut feelings" },
        ],
      },
      {
        id: "ei8",
        text: "I build rapport with new people by:",
        options: [
          { value: "a", label: "Finding common interests" },
          { value: "b", label: "Being warm and approachable" },
          { value: "c", label: "Listening actively to them" },
          { value: "d", label: "Sharing about myself openly" },
        ],
      },
      {
        id: "ei9",
        text: "When someone disagrees with me, I:",
        options: [
          { value: "a", label: "Try to understand their reasoning" },
          { value: "b", label: "Present additional evidence for my view" },
          { value: "c", label: "Look for middle ground" },
          { value: "d", label: "Respect their right to differ" },
        ],
      },
      {
        id: "ei10",
        text: "I demonstrate empathy by:",
        options: [
          { value: "a", label: "Actively listening without judgment" },
          { value: "b", label: "Sharing similar experiences" },
          { value: "c", label: "Offering practical solutions" },
          { value: "d", label: "Validating their feelings" },
        ],
      },
    ],
  },
  {
    id: "time-management",
    title: "Time Management & Organization",
    description: "Evaluate your planning, prioritization, and organizational skills.",
    questions: [
      {
        id: "tm1",
        text: "I plan my day by:",
        options: [
          { value: "a", label: "Creating detailed schedules the night before" },
          { value: "b", label: "Setting priorities each morning" },
          { value: "c", label: "Using a general mental outline" },
          { value: "d", label: "Handling tasks as they come" },
        ],
      },
      {
        id: "tm2",
        text: "When I have multiple deadlines, I:",
        options: [
          { value: "a", label: "Create a timeline working backwards" },
          { value: "b", label: "Tackle the most urgent first" },
          { value: "c", label: "Start with the easiest tasks" },
          { value: "d", label: "Work on what interests me most" },
        ],
      },
      {
        id: "tm3",
        text: "I handle interruptions by:",
        options: [
          { value: "a", label: "Setting specific times for availability" },
          { value: "b", label: "Dealing with them immediately" },
          { value: "c", label: "Noting them and returning to my task" },
          { value: "d", label: "Minimizing them with boundaries" },
        ],
      },
      {
        id: "tm4",
        text: "My workspace is typically:",
        options: [
          { value: "a", label: "Highly organized with everything in its place" },
          { value: "b", label: "Organized chaos - I know where things are" },
          { value: "c", label: "Minimalist with only essentials" },
          { value: "d", label: "Cluttered but functional" },
        ],
      },
      {
        id: "tm5",
        text: "I track my tasks using:",
        options: [
          { value: "a", label: "Digital tools and apps" },
          { value: "b", label: "Written lists and planners" },
          { value: "c", label: "Mental notes and memory" },
          { value: "d", label: "A combination of methods" },
        ],
      },
      {
        id: "tm6",
        text: "When a project is overwhelming, I:",
        options: [
          { value: "a", label: "Break it into smaller actionable steps" },
          { value: "b", label: "Start with one aspect and build momentum" },
          { value: "c", label: "Seek help or delegate parts" },
          { value: "d", label: "Set interim milestones" },
        ],
      },
      {
        id: "tm7",
        text: "I allocate time for tasks by:",
        options: [
          { value: "a", label: "Estimating based on past experience" },
          { value: "b", label: "Adding buffer time for unknowns" },
          { value: "c", label: "Setting strict time limits" },
          { value: "d", label: "Being flexible with timing" },
        ],
      },
      {
        id: "tm8",
        text: "My approach to meetings is:",
        options: [
          { value: "a", label: "Always prepare an agenda in advance" },
          { value: "b", label: "Participate actively when needed" },
          { value: "c", label: "Keep them brief and focused" },
          { value: "d", label: "Follow up with clear action items" },
        ],
      },
      {
        id: "tm9",
        text: "I handle procrastination by:",
        options: [
          { value: "a", label: "Using the two-minute rule - start small" },
          { value: "b", label: "Setting deadlines for myself" },
          { value: "c", label: "Understanding the root cause" },
          { value: "d", label: "Creating accountability systems" },
        ],
      },
      {
        id: "tm10",
        text: "I review and adjust my plans:",
        options: [
          { value: "a", label: "Daily at the end of each day" },
          { value: "b", label: "Weekly to track progress" },
          { value: "c", label: "When things aren't working" },
          { value: "d", label: "Rarely - I stick to the plan" },
        ],
      },
    ],
  },
  {
    id: "creativity-innovation",
    title: "Creativity & Innovation",
    description: "Measure your creative thinking, idea generation, and innovative problem-solving abilities.",
    questions: [
      {
        id: "ci1",
        text: "When brainstorming, I:",
        options: [
          { value: "a", label: "Generate many ideas without judging them" },
          { value: "b", label: "Build on others' suggestions" },
          { value: "c", label: "Look for unconventional approaches" },
          { value: "d", label: "Focus on practical solutions" },
        ],
      },
      {
        id: "ci2",
        text: "I get my best ideas:",
        options: [
          { value: "a", label: "During relaxation or downtime" },
          { value: "b", label: "While actively working on problems" },
          { value: "c", label: "Through discussions with others" },
          { value: "d", label: "By exploring different fields" },
        ],
      },
      {
        id: "ci3",
        text: "When facing creative blocks, I:",
        options: [
          { value: "a", label: "Take a break and return fresh" },
          { value: "b", label: "Look at the problem from different angles" },
          { value: "c", label: "Seek inspiration from other sources" },
          { value: "d", label: "Push through with persistence" },
        ],
      },
      {
        id: "ci4",
        text: "I approach innovation by:",
        options: [
          { value: "a", label: "Combining existing ideas in new ways" },
          { value: "b", label: "Questioning fundamental assumptions" },
          { value: "c", label: "Experimenting and iterating" },
          { value: "d", label: "Studying successful innovations" },
        ],
      },
      {
        id: "ci5",
        text: "My creative process involves:",
        options: [
          { value: "a", label: "Structured frameworks and methods" },
          { value: "b", label: "Free-flowing exploration" },
          { value: "c", label: "Alternating between divergent and convergent thinking" },
          { value: "d", label: "Collaborative ideation" },
        ],
      },
      {
        id: "ci6",
        text: "I handle failure in creative projects by:",
        options: [
          { value: "a", label: "Viewing it as learning and iterating" },
          { value: "b", label: "Analyzing what went wrong" },
          { value: "c", label: "Moving on to new ideas" },
          { value: "d", label: "Seeking feedback for improvement" },
        ],
      },
      {
        id: "ci7",
        text: "I nurture creativity through:",
        options: [
          { value: "a", label: "Exposing myself to diverse experiences" },
          { value: "b", label: "Regular creative practice" },
          { value: "c", label: "Maintaining curiosity and asking questions" },
          { value: "d", label: "Creating space for reflection" },
        ],
      },
      {
        id: "ci8",
        text: "When evaluating new ideas, I focus on:",
        options: [
          { value: "a", label: "Potential impact and value" },
          { value: "b", label: "Feasibility and resources needed" },
          { value: "c", label: "Originality and uniqueness" },
          { value: "d", label: "Alignment with goals" },
        ],
      },
      {
        id: "ci9",
        text: "I prefer to work on creative tasks:",
        options: [
          { value: "a", label: "Independently with full autonomy" },
          { value: "b", label: "In collaborative team settings" },
          { value: "c", label: "With a partner for bouncing ideas" },
          { value: "d", label: "Varies by project type" },
        ],
      },
      {
        id: "ci10",
        text: "My approach to constraints in creative work is:",
        options: [
          { value: "a", label: "They spark more innovative solutions" },
          { value: "b", label: "They limit possibilities unnecessarily" },
          { value: "c", label: "They provide helpful focus" },
          { value: "d", label: "They challenge me to think differently" },
        ],
      },
    ],
  },
  {
    id: "communication-style",
    title: "Communication Style",
    description: "Understand your preferred methods of expression and interpersonal communication.",
    questions: [
      {
        id: "cs1",
        text: "In group discussions, I typically:",
        options: [
          { value: "a", label: "Share my thoughts readily" },
          { value: "b", label: "Listen first, then contribute" },
          { value: "c", label: "Ask clarifying questions" },
          { value: "d", label: "Summarize and synthesize ideas" },
        ],
      },
      {
        id: "cs2",
        text: "I prefer to communicate important information via:",
        options: [
          { value: "a", label: "Face-to-face conversations" },
          { value: "b", label: "Email or written messages" },
          { value: "c", label: "Video or phone calls" },
          { value: "d", label: "Depends on the situation" },
        ],
      },
      {
        id: "cs3",
        text: "When presenting ideas, I emphasize:",
        options: [
          { value: "a", label: "Data and facts" },
          { value: "b", label: "Stories and examples" },
          { value: "c", label: "Visual aids and diagrams" },
          { value: "d", label: "Clear structure and logic" },
        ],
      },
      {
        id: "cs4",
        text: "In written communication, I am:",
        options: [
          { value: "a", label: "Concise and to the point" },
          { value: "b", label: "Detailed and thorough" },
          { value: "c", label: "Warm and personable" },
          { value: "d", label: "Formal and professional" },
        ],
      },
      {
        id: "cs5",
        text: "When giving feedback, I:",
        options: [
          { value: "a", label: "Balance positive with constructive points" },
          { value: "b", label: "Focus on specific behaviors" },
          { value: "c", label: "Consider the person's feelings" },
          { value: "d", label: "Provide actionable suggestions" },
        ],
      },
      {
        id: "cs6",
        text: "I handle misunderstandings by:",
        options: [
          { value: "a", label: "Clarifying immediately" },
          { value: "b", label: "Asking questions to understand" },
          { value: "c", label: "Rephrasing my message" },
          { value: "d", label: "Acknowledging different perspectives" },
        ],
      },
      {
        id: "cs7",
        text: "In professional emails, I:",
        options: [
          { value: "a", label: "Get straight to the point" },
          { value: "b", label: "Start with pleasantries" },
          { value: "c", label: "Use bullet points for clarity" },
          { value: "d", label: "Provide context and background" },
        ],
      },
      {
        id: "cs8",
        text: "My listening style is best described as:",
        options: [
          { value: "a", label: "Active - I engage and respond" },
          { value: "b", label: "Reflective - I think before responding" },
          { value: "c", label: "Empathetic - I focus on emotions" },
          { value: "d", label: "Analytical - I evaluate the logic" },
        ],
      },
      {
        id: "cs9",
        text: "When networking, I:",
        options: [
          { value: "a", label: "Initiate conversations easily" },
          { value: "b", label: "Prefer smaller, deeper conversations" },
          { value: "c", label: "Focus on finding mutual interests" },
          { value: "d", label: "Let others approach me first" },
        ],
      },
      {
        id: "cs10",
        text: "I adapt my communication style:",
        options: [
          { value: "a", label: "Based on the audience" },
          { value: "b", label: "Depending on the context" },
          { value: "c", label: "To match others' preferences" },
          { value: "d", label: "I maintain consistency" },
        ],
      },
    ],
  },
  {
    id: "leadership-teamwork",
    title: "Leadership & Teamwork",
    description: "Assess your collaborative skills, leadership potential, and team dynamics.",
    questions: [
      {
        id: "lt1",
        text: "In team projects, I naturally:",
        options: [
          { value: "a", label: "Take the lead and coordinate" },
          { value: "b", label: "Contribute specialized expertise" },
          { value: "c", label: "Support others and facilitate" },
          { value: "d", label: "Ensure tasks are completed" },
        ],
      },
      {
        id: "lt2",
        text: "I motivate team members by:",
        options: [
          { value: "a", label: "Setting clear goals and vision" },
          { value: "b", label: "Recognizing their contributions" },
          { value: "c", label: "Leading by example" },
          { value: "d", label: "Empowering them with autonomy" },
        ],
      },
      {
        id: "lt3",
        text: "When team conflicts arise, I:",
        options: [
          { value: "a", label: "Address them directly and promptly" },
          { value: "b", label: "Mediate between parties" },
          { value: "c", label: "Focus on common goals" },
          { value: "d", label: "Encourage open dialogue" },
        ],
      },
      {
        id: "lt4",
        text: "My leadership style is best described as:",
        options: [
          { value: "a", label: "Democratic - seeking input" },
          { value: "b", label: "Visionary - inspiring with ideas" },
          { value: "c", label: "Coaching - developing others" },
          { value: "d", label: "Collaborative - team-oriented" },
        ],
      },
      {
        id: "lt5",
        text: "I contribute to team success by:",
        options: [
          { value: "a", label: "Bringing innovative ideas" },
          { value: "b", label: "Ensuring quality and details" },
          { value: "c", label: "Maintaining team morale" },
          { value: "d", label: "Coordinating and organizing" },
        ],
      },
      {
        id: "lt6",
        text: "When delegating tasks, I:",
        options: [
          { value: "a", label: "Match tasks to individual strengths" },
          { value: "b", label: "Provide clear instructions and expectations" },
          { value: "c", label: "Offer support while allowing independence" },
          { value: "d", label: "Check in regularly on progress" },
        ],
      },
      {
        id: "lt7",
        text: "I handle underperforming team members by:",
        options: [
          { value: "a", label: "Having direct conversations about expectations" },
          { value: "b", label: "Understanding root causes first" },
          { value: "c", label: "Providing additional support and resources" },
          { value: "d", label: "Setting clear improvement goals" },
        ],
      },
      {
        id: "lt8",
        text: "In decision-making as a leader, I:",
        options: [
          { value: "a", label: "Seek consensus from the team" },
          { value: "b", label: "Gather input but decide independently" },
          { value: "c", label: "Make quick decisions when needed" },
          { value: "d", label: "Defer to subject matter experts" },
        ],
      },
      {
        id: "lt9",
        text: "I build trust in teams through:",
        options: [
          { value: "a", label: "Consistency and reliability" },
          { value: "b", label: "Transparency and honesty" },
          { value: "c", label: "Following through on commitments" },
          { value: "d", label: "Showing vulnerability and authenticity" },
        ],
      },
      {
        id: "lt10",
        text: "My approach to team diversity is:",
        options: [
          { value: "a", label: "Leverage different perspectives for better outcomes" },
          { value: "b", label: "Create inclusive environment for all" },
          { value: "c", label: "Value each person's unique contribution" },
          { value: "d", label: "Facilitate understanding across differences" },
        ],
      },
    ],
  },
  {
    id: "adaptability-resilience",
    title: "Adaptability & Resilience",
    description: "Evaluate how you respond to change, handle setbacks, and adapt to new situations.",
    questions: [
      {
        id: "ar1",
        text: "When facing unexpected changes, I:",
        options: [
          { value: "a", label: "Quickly adjust my plans" },
          { value: "b", label: "Take time to process before adapting" },
          { value: "c", label: "Look for opportunities in the change" },
          { value: "d", label: "Prefer to maintain stability" },
        ],
      },
      {
        id: "ar2",
        text: "After a significant setback, I:",
        options: [
          { value: "a", label: "Bounce back quickly with renewed focus" },
          { value: "b", label: "Reflect on lessons learned" },
          { value: "c", label: "Seek support from others" },
          { value: "d", label: "Need time to recover emotionally" },
        ],
      },
      {
        id: "ar3",
        text: "In uncertain situations, I:",
        options: [
          { value: "a", label: "Stay calm and assess options" },
          { value: "b", label: "Trust my ability to handle whatever comes" },
          { value: "c", label: "Seek information to reduce uncertainty" },
          { value: "d", label: "Feel anxious but push forward" },
        ],
      },
      {
        id: "ar4",
        text: "I view challenges as:",
        options: [
          { value: "a", label: "Opportunities to grow and learn" },
          { value: "b", label: "Tests of my capabilities" },
          { value: "c", label: "Temporary obstacles to overcome" },
          { value: "d", label: "Stressful but necessary experiences" },
        ],
      },
      {
        id: "ar5",
        text: "When learning new skills, I:",
        options: [
          { value: "a", label: "Embrace the learning curve enthusiastically" },
          { value: "b", label: "Take a structured, step-by-step approach" },
          { value: "c", label: "Feel initially uncomfortable but persist" },
          { value: "d", label: "Learn best under pressure" },
        ],
      },
      {
        id: "ar6",
        text: "My comfort zone:",
        options: [
          { value: "a", label: "I regularly push beyond it" },
          { value: "b", label: "I expand it gradually" },
          { value: "c", label: "I'm content within it most of the time" },
          { value: "d", label: "I challenge it when necessary" },
        ],
      },
      {
        id: "ar7",
        text: "When plans fail, I:",
        options: [
          { value: "a", label: "Immediately develop alternative approaches" },
          { value: "b", label: "Analyze what went wrong first" },
          { value: "c", label: "Maintain optimism and try again" },
          { value: "d", label: "Consider if the goal needs adjustment" },
        ],
      },
      {
        id: "ar8",
        text: "I maintain resilience through:",
        options: [
          { value: "a", label: "Strong support network" },
          { value: "b", label: "Clear sense of purpose" },
          { value: "c", label: "Self-care and stress management" },
          { value: "d", label: "Positive mindset and perspective" },
        ],
      },
      {
        id: "ar9",
        text: "In rapidly changing environments, I:",
        options: [
          { value: "a", label: "Thrive on the variety and pace" },
          { value: "b", label: "Stay flexible and open-minded" },
          { value: "c", label: "Focus on what I can control" },
          { value: "d", label: "Find it challenging but manageable" },
        ],
      },
      {
        id: "ar10",
        text: "My response to criticism of my work is:",
        options: [
          { value: "a", label: "View it as feedback for improvement" },
          { value: "b", label: "Feel initially defensive but consider the points" },
          { value: "c", label: "Appreciate the opportunity to refine" },
          { value: "d", label: "Evaluate its validity objectively" },
        ],
      },
    ],
  },
  {
    id: "decision-making",
    title: "Decision-Making Process",
    description: "Understand your approach to making choices and evaluating options.",
    questions: [
      {
        id: "dm1",
        text: "When making important decisions, I:",
        options: [
          { value: "a", label: "List pros and cons systematically" },
          { value: "b", label: "Trust my intuition and experience" },
          { value: "c", label: "Seek advice from trusted sources" },
          { value: "d", label: "Research thoroughly before deciding" },
        ],
      },
      {
        id: "dm2",
        text: "Under time pressure, I decide by:",
        options: [
          { value: "a", label: "Using available information quickly" },
          { value: "b", label: "Relying on past similar situations" },
          { value: "c", label: "Following my gut instinct" },
          { value: "d", label: "Consulting others if possible" },
        ],
      },
      {
        id: "dm3",
        text: "I struggle most with decisions that:",
        options: [
          { value: "a", label: "Have no clear right answer" },
          { value: "b", label: "Affect other people significantly" },
          { value: "c", label: "Require choosing between good options" },
          { value: "d", label: "Have long-term consequences" },
        ],
      },
      {
        id: "dm4",
        text: "After making a decision, I:",
        options: [
          { value: "a", label: "Commit fully and move forward" },
          { value: "b", label: "Monitor outcomes and adjust if needed" },
          { value: "c", label: "Sometimes second-guess myself" },
          { value: "d", label: "Rarely revisit the decision" },
        ],
      },
      {
        id: "dm5",
        text: "I involve others in my decisions when:",
        options: [
          { value: "a", label: "They'll be affected by the outcome" },
          { value: "b", label: "I need expert input" },
          { value: "c", label: "I want different perspectives" },
          { value: "d", label: "I prefer to decide independently" },
        ],
      },
      {
        id: "dm6",
        text: "My decision-making is most influenced by:",
        options: [
          { value: "a", label: "Facts and objective data" },
          { value: "b", label: "Values and principles" },
          { value: "c", label: "Potential outcomes and risks" },
          { value: "d", label: "Emotions and feelings" },
        ],
      },
      {
        id: "dm7",
        text: "When faced with risky decisions, I:",
        options: [
          { value: "a", label: "Calculate risks versus rewards" },
          { value: "b", label: "Prefer safer, proven options" },
          { value: "c", label: "Take calculated risks when potential is high" },
          { value: "d", label: "Trust my judgment on the risk level" },
        ],
      },
      {
        id: "dm8",
        text: "I handle decision paralysis by:",
        options: [
          { value: "a", label: "Setting a deadline to decide" },
          { value: "b", label: "Breaking the decision into smaller parts" },
          { value: "c", label: "Accepting that perfect information is impossible" },
          { value: "d", label: "Going with my first instinct" },
        ],
      },
      {
        id: "dm9",
        text: "For routine decisions, I:",
        options: [
          { value: "a", label: "Have established habits and systems" },
          { value: "b", label: "Decide quickly without much thought" },
          { value: "c", label: "Occasionally reevaluate my approach" },
          { value: "d", label: "Delegate when possible" },
        ],
      },
      {
        id: "dm10",
        text: "I regret decisions when:",
        options: [
          { value: "a", label: "I didn't gather enough information" },
          { value: "b", label: "I ignored my intuition" },
          { value: "c", label: "I let emotions override logic" },
          { value: "d", label: "I rarely regret my decisions" },
        ],
      },
    ],
  },
  {
    id: "work-style-preferences",
    title: "Work Style & Preferences",
    description: "Identify your ideal working conditions and professional environment preferences.",
    questions: [
      {
        id: "ws1",
        text: "I perform best in a work environment that is:",
        options: [
          { value: "a", label: "Structured with clear processes" },
          { value: "b", label: "Flexible and autonomous" },
          { value: "c", label: "Collaborative and team-oriented" },
          { value: "d", label: "Dynamic and fast-paced" },
        ],
      },
      {
        id: "ws2",
        text: "My ideal work schedule is:",
        options: [
          { value: "a", label: "Fixed hours with routine" },
          { value: "b", label: "Flexible hours based on tasks" },
          { value: "c", label: "Project-based with deadlines" },
          { value: "d", label: "Self-directed and autonomous" },
        ],
      },
      {
        id: "ws3",
        text: "I prefer assignments that:",
        options: [
          { value: "a", label: "Provide variety and novelty" },
          { value: "b", label: "Allow deep focus on one thing" },
          { value: "c", label: "Involve collaboration" },
          { value: "d", label: "Let me work independently" },
        ],
      },
      {
        id: "ws4",
        text: "In terms of supervision, I work best with:",
        options: [
          { value: "a", label: "Minimal oversight and high autonomy" },
          { value: "b", label: "Regular check-ins and feedback" },
          { value: "c", label: "Clear expectations then independence" },
          { value: "d", label: "Close guidance and support" },
        ],
      },
      {
        id: "ws5",
        text: "I recharge at work by:",
        options: [
          { value: "a", label: "Taking short breaks alone" },
          { value: "b", label: "Socializing with colleagues" },
          { value: "c", label: "Switching between tasks" },
          { value: "d", label: "Physical movement or walks" },
        ],
      },
      {
        id: "ws6",
        text: "My approach to workplace relationships is:",
        options: [
          { value: "a", label: "Friendly and sociable" },
          { value: "b", label: "Professional and courteous" },
          { value: "c", label: "Collaborative and supportive" },
          { value: "d", label: "Task-focused with boundaries" },
        ],
      },
      {
        id: "ws7",
        text: "I handle workplace stress by:",
        options: [
          { value: "a", label: "Taking systematic breaks" },
          { value: "b", label: "Talking it through with others" },
          { value: "c", label: "Prioritizing and delegating" },
          { value: "d", label: "Working through it intensely" },
        ],
      },
      {
        id: "ws8",
        text: "I'm most productive when working:",
        options: [
          { value: "a", label: "Early in the morning" },
          { value: "b", label: "Late at night" },
          { value: "c", label: "In focused afternoon blocks" },
          { value: "d", label: "It varies day to day" },
        ],
      },
      {
        id: "ws9",
        text: "I prefer to receive recognition through:",
        options: [
          { value: "a", label: "Public acknowledgment" },
          { value: "b", label: "Private appreciation" },
          { value: "c", label: "Tangible rewards or advancement" },
          { value: "d", label: "Challenging new opportunities" },
        ],
      },
      {
        id: "ws10",
        text: "My balance between work and personal life:",
        options: [
          { value: "a", label: "Strict boundaries between the two" },
          { value: "b", label: "Integrated - they flow together" },
          { value: "c", label: "Work-focused during career building" },
          { value: "d", label: "Prioritize personal life consistently" },
        ],
      },
    ],
  },
  {
    id: "technical-aptitude",
    title: "Technical Aptitude",
    description: "Assess your comfort and ability with technology, systems, and technical problem-solving.",
    questions: [
      {
        id: "ta1",
        text: "When encountering new technology, I:",
        options: [
          { value: "a", label: "Explore features through trial and error" },
          { value: "b", label: "Read documentation or tutorials first" },
          { value: "c", label: "Ask others how to use it" },
          { value: "d", label: "Learn only what's immediately necessary" },
        ],
      },
      {
        id: "ta2",
        text: "My comfort level with troubleshooting technical issues is:",
        options: [
          { value: "a", label: "High - I enjoy solving tech problems" },
          { value: "b", label: "Moderate - I can handle basic issues" },
          { value: "c", label: "Low - I prefer to ask for help" },
          { value: "d", label: "Varies by the type of technology" },
        ],
      },
      {
        id: "ta3",
        text: "I learn new software or tools by:",
        options: [
          { value: "a", label: "Hands-on experimentation" },
          { value: "b", label: "Following structured courses" },
          { value: "c", label: "Watching video tutorials" },
          { value: "d", label: "Referring to documentation as needed" },
        ],
      },
      {
        id: "ta4",
        text: "When a system or process isn't working efficiently, I:",
        options: [
          { value: "a", label: "Analyze and optimize it" },
          { value: "b", label: "Work around the limitations" },
          { value: "c", label: "Suggest improvements to others" },
          { value: "d", label: "Accept it as is" },
        ],
      },
      {
        id: "ta5",
        text: "My approach to data and analytics is:",
        options: [
          { value: "a", label: "I actively use data to inform decisions" },
          { value: "b", label: "I understand but prefer qualitative information" },
          { value: "c", label: "I rely on others to interpret data" },
          { value: "d", label: "I find patterns and insights in data easily" },
        ],
      },
      {
        id: "ta6",
        text: "I keep up with technological trends by:",
        options: [
          { value: "a", label: "Actively following tech news and updates" },
          { value: "b", label: "Learning when needed for work" },
          { value: "c", label: "Through conversations with others" },
          { value: "d", label: "I don't actively follow tech trends" },
        ],
      },
      {
        id: "ta7",
        text: "When automating repetitive tasks, I:",
        options: [
          { value: "a", label: "Seek out tools and create solutions" },
          { value: "b", label: "Use existing tools if available" },
          { value: "c", label: "Prefer manual methods I'm comfortable with" },
          { value: "d", label: "Balance automation with personal touch" },
        ],
      },
      {
        id: "ta8",
        text: "My understanding of how systems work is:",
        options: [
          { value: "a", label: "Deep - I like understanding mechanisms" },
          { value: "b", label: "Functional - I know what I need to" },
          { value: "c", label: "Surface - I focus on outcomes" },
          { value: "d", label: "Varies by my interest in the system" },
        ],
      },
      {
        id: "ta9",
        text: "I approach learning technical skills:",
        options: [
          { value: "a", label: "Enthusiastically and proactively" },
          { value: "b", label: "Willingly when necessary" },
          { value: "c", label: "With some resistance initially" },
          { value: "d", label: "Selectively based on relevance" },
        ],
      },
      {
        id: "ta10",
        text: "When teaching others to use technology, I:",
        options: [
          { value: "a", label: "Provide step-by-step guidance" },
          { value: "b", label: "Show them and let them practice" },
          { value: "c", label: "Direct them to resources" },
          { value: "d", label: "Prefer others handle the teaching" },
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
