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
          { value: "visual", label: "Look at diagrams and pictures" },
          { value: "visual", label: "Follow diagrams and pictures" },
          { value: "auditory", label: "Have someone explain the steps" },
          { value: "kinesthetic", label: "Figure it out by trial and error" },
          { value: "reading", label: "Read the written instructions carefully" },
        ],
      },
      {
        id: "ls7",
        text: "In a training session, I learn best when:",
        options: [
          { value: "visual", label: "The instructor uses visual aids and demonstrations" },
          { value: "auditory", label: "The instructor lectures and explains verbally" },
          { value: "kinesthetic", label: "I can practice hands-on exercises" },
          { value: "reading", label: "I have comprehensive written materials" },
        ],
      },
      {
        id: "ls8",
        text: "When recalling a past event, I tend to remember:",
        options: [
          { value: "visual", label: "What I saw - images and scenes" },
          { value: "auditory", label: "What was said - conversations and sounds" },
          { value: "kinesthetic", label: "What I did - my actions and feelings" },
          { value: "reading", label: "Details I read or wrote down" },
        ],
      },
      {
        id: "ls9",
        text: "When trying to concentrate, I need:",
        options: [
          { value: "visual", label: "A clean, organized visual environment" },
          { value: "auditory", label: "Quiet or appropriate background sounds" },
          { value: "kinesthetic", label: "Freedom to move or fidget" },
          { value: "reading", label: "Written materials to reference" },
        ],
      },
      {
        id: "ls10",
        text: "When shopping for a product, I make decisions based on:",
        options: [
          { value: "visual", label: "How it looks and visual appeal" },
          { value: "auditory", label: "Reviews and recommendations I've heard" },
          { value: "kinesthetic", label: "How it feels and hands-on testing" },
          { value: "reading", label: "Specifications and written reviews" },
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
        text: "When learning something complex, I prefer to:",
        options: [
          { value: "sequential", label: "Learn step-by-step in order" },
          { value: "random", label: "Jump around to what interests me" },
          { value: "structured", label: "Follow a structured curriculum" },
          { value: "discovery", label: "Discover connections on my own" },
        ],
      },
      {
        id: "cp7",
        text: "I make connections between ideas by:",
        options: [
          { value: "categorizing", label: "Categorizing and grouping similar concepts" },
          { value: "analogies", label: "Using analogies and comparisons" },
          { value: "patterns", label: "Recognizing patterns and relationships" },
          { value: "experience", label: "Relating to personal experiences" },
        ],
      },
      {
        id: "cp8",
        text: "When analyzing information, I focus on:",
        options: [
          { value: "details", label: "Specific details and facts" },
          { value: "overview", label: "Overall concepts and themes" },
          { value: "implications", label: "Implications and consequences" },
          { value: "accuracy", label: "Accuracy and precision" },
        ],
      },
      {
        id: "cp9",
        text: "I understand new concepts best when:",
        options: [
          { value: "explained", label: "They are clearly explained with examples" },
          { value: "explored", label: "I can explore them independently" },
          { value: "compared", label: "I can compare them to what I know" },
          { value: "applied", label: "I can apply them immediately" },
        ],
      },
      {
        id: "cp10",
        text: "When making sense of complex data, I prefer to:",
        options: [
          { value: "organize", label: "Organize it into tables or lists" },
          { value: "visualize", label: "Create visual representations" },
          { value: "summarize", label: "Write summaries and key points" },
          { value: "discuss", label: "Discuss and debate the findings" },
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
        text: "I approach unfamiliar problems by:",
        options: [
          { value: "similar", label: "Looking for similar problems I've solved" },
          { value: "breakdown", label: "Breaking them down into smaller parts" },
          { value: "resources", label: "Finding resources and information first" },
          { value: "experiment", label: "Experimenting with different approaches" },
        ],
      },
      {
        id: "psd7",
        text: "When collaborating on problem-solving, I:",
        options: [
          { value: "lead", label: "Naturally take the lead" },
          { value: "contribute", label: "Contribute ideas and suggestions" },
          { value: "analyze", label: "Analyze and critique proposed solutions" },
          { value: "support", label: "Support and help implement others' ideas" },
        ],
      },
      {
        id: "psd8",
        text: "My problem-solving speed is:",
        options: [
          { value: "quick", label: "Quick - I make fast decisions" },
          { value: "deliberate", label: "Deliberate - I take time to think through" },
          { value: "variable", label: "Variable - depends on the problem" },
          { value: "thorough", label: "Thorough - I explore all options" },
        ],
      },
      {
        id: "psd9",
        text: "I verify my solutions by:",
        options: [
          { value: "testing", label: "Testing them thoroughly" },
          { value: "review", label: "Having others review them" },
          { value: "logic", label: "Checking the logic step-by-step" },
          { value: "outcomes", label: "Evaluating the outcomes" },
        ],
      },
      {
        id: "psd10",
        text: "When faced with multiple problems, I:",
        options: [
          { value: "prioritize", label: "Prioritize and tackle them in order" },
          { value: "parallel", label: "Work on multiple problems simultaneously" },
          { value: "urgent", label: "Focus on the most urgent first" },
          { value: "easy", label: "Start with the easiest to build momentum" },
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
        text: "I stay committed to long-term goals by:",
        options: [
          { value: "visualization", label: "Visualizing success" },
          { value: "planning", label: "Detailed planning and tracking" },
          { value: "accountability", label: "Accountability partners or groups" },
          { value: "passion", label: "Passion and personal interest" },
        ],
      },
      {
        id: "mc7",
        text: "When I lose motivation, I recover by:",
        options: [
          { value: "break", label: "Taking a break and returning refreshed" },
          { value: "why", label: "Reconnecting with my 'why'" },
          { value: "support", label: "Seeking support and encouragement" },
          { value: "wins", label: "Reviewing past wins and progress" },
        ],
      },
      {
        id: "mc8",
        text: "I learn best when the content is:",
        options: [
          { value: "engaging", label: "Engaging and entertaining" },
          { value: "relevant", label: "Directly relevant to my goals" },
          { value: "challenging", label: "Appropriately challenging" },
          { value: "practical", label: "Practical and immediately useful" },
        ],
      },
      {
        id: "mc9",
        text: "Rewards that motivate me most are:",
        options: [
          { value: "recognition", label: "Recognition and praise" },
          { value: "achievement", label: "Sense of achievement" },
          { value: "tangible", label: "Tangible rewards or benefits" },
          { value: "growth", label: "Personal growth and development" },
        ],
      },
      {
        id: "mc10",
        text: "My persistence level when facing obstacles is:",
        options: [
          { value: "determined", label: "Very determined - I rarely give up" },
          { value: "strategic", label: "Strategic - I pivot when needed" },
          { value: "goal-dependent", label: "Depends on how important the goal is" },
          { value: "help-seeking", label: "I seek help to overcome obstacles" },
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
        text: "My ideal workspace has:",
        options: [
          { value: "minimal", label: "Minimal clutter and distractions" },
          { value: "personal", label: "Personal items and decorations" },
          { value: "tools", label: "All necessary tools and resources nearby" },
          { value: "flexible", label: "Flexibility to change as needed" },
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
        text: "For online learning, I prefer:",
        options: [
          { value: "live", label: "Live sessions with real-time interaction" },
          { value: "recorded", label: "Recorded videos I can watch anytime" },
          { value: "self-paced", label: "Self-paced courses with no deadlines" },
          { value: "structured", label: "Structured courses with set schedules" },
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
        text: "I concentrate better when:",
        options: [
          { value: "alone", label: "Working alone in isolation" },
          { value: "library", label: "In a quiet public space like a library" },
          { value: "cafe", label: "In a cafe with ambient noise" },
          { value: "home", label: "In my comfortable home environment" },
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
        text: "During study sessions, I need breaks:",
        options: [
          { value: "rarely", label: "Rarely - I can focus for long periods" },
          { value: "regular", label: "At regular intervals (e.g., Pomodoro)" },
          { value: "intuitive", label: "When I feel I need them" },
          { value: "frequent", label: "Frequently - short intense sessions work best" },
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
        text: "Physical comfort during learning is:",
        options: [
          { value: "critical", label: "Critical - I need the right setup" },
          { value: "important", label: "Important but adaptable" },
          { value: "minimal", label: "Minimally important" },
          { value: "varies", label: "Varies by task and duration" },
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
        text: "A train travels 240 km in 4 hours. What is its average speed in km/h?",
        options: [
          { value: "a", label: "A) 55 km/h" },
          { value: "b", label: "B) 60 km/h" },
          { value: "c", label: "C) 65 km/h" },
          { value: "d", label: "D) 70 km/h" },
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
        text: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?",
        options: [
          { value: "a", label: "A) 8" },
          { value: "b", label: "B) 10" },
          { value: "c", label: "C) 12" },
          { value: "d", label: "D) 15" },
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
        text: "A book's price increased from ₹400 to ₹500. What is the percentage increase?",
        options: [
          { value: "a", label: "A) 20%" },
          { value: "b", label: "B) 25%" },
          { value: "c", label: "C) 30%" },
          { value: "d", label: "D) 35%" },
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
        text: "If 3x + 7 = 22, what is the value of x?",
        options: [
          { value: "a", label: "A) 3" },
          { value: "b", label: "B) 5" },
          { value: "c", label: "C) 7" },
          { value: "d", label: "D) 9" },
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
        text: "A rectangle has length 12 cm and width 8 cm. What is its area?",
        options: [
          { value: "a", label: "A) 20 sq cm" },
          { value: "b", label: "B) 40 sq cm" },
          { value: "c", label: "C) 96 sq cm" },
          { value: "d", label: "D) 192 sq cm" },
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
      {
        id: "qa6",
        text: "An item's price decreased from ₹2,500 to ₹2,000. What is the percentage decrease?",
        options: [
          { value: "15", label: "15%" },
          { value: "20", label: "20%" },
          { value: "25", label: "25%" },
          { value: "30", label: "30%" },
        ],
      },
      {
        id: "qa7",
        text: "If 40% of a number is 80, what is the number?",
        options: [
          { value: "150", label: "150" },
          { value: "180", label: "180" },
          { value: "200", label: "200" },
          { value: "220", label: "220" },
        ],
      },
      {
        id: "qa8",
        text: "A sum of ₹5,000 amounts to ₹6,000 in 2 years at simple interest. What is the rate of interest?",
        options: [
          { value: "8", label: "8%" },
          { value: "10", label: "10%" },
          { value: "12", label: "12%" },
          { value: "15", label: "15%" },
        ],
      },
      {
        id: "qa9",
        text: "If a car travels 180 km in 3 hours, how far will it travel in 5 hours at the same speed?",
        options: [
          { value: "250", label: "250 km" },
          { value: "280", label: "280 km" },
          { value: "300", label: "300 km" },
          { value: "320", label: "320 km" },
        ],
      },
      {
        id: "qa10",
        text: "The sum of three consecutive numbers is 72. What is the middle number?",
        options: [
          { value: "22", label: "22" },
          { value: "23", label: "23" },
          { value: "24", label: "24" },
          { value: "25", label: "25" },
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
        text: "If A > B and B > C, which statement must be true?",
        options: [
          { value: "a", label: "A) A < C" },
          { value: "b", label: "B) A = C" },
          { value: "c", label: "C) A > C" },
          { value: "d", label: "D) Cannot be determined" },
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
        text: "Complete the pattern: 1, 4, 9, 16, 25, ?",
        options: [
          { value: "a", label: "A) 30" },
          { value: "b", label: "B) 32" },
          { value: "c", label: "C) 35" },
          { value: "d", label: "D) 36" },
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
        text: "If CAT = 24, DOG = 26, what does BAT equal? (Hint: Sum the position values of letters)",
        options: [
          { value: "a", label: "A) 22" },
          { value: "b", label: "B) 23" },
          { value: "c", label: "C) 24" },
          { value: "d", label: "D) 25" },
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
        text: "Which number doesn't belong: 2, 3, 6, 7, 8, 14, 15?",
        options: [
          { value: "a", label: "A) 6" },
          { value: "b", label: "B) 7" },
          { value: "c", label: "C) 8" },
          { value: "d", label: "D) 15" },
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
        text: "If all Zips are Zaps and some Zaps are Zops, which is certain?",
        options: [
          { value: "a", label: "A) All Zips are Zops" },
          { value: "b", label: "B) Some Zips are Zops" },
          { value: "c", label: "C) Some Zaps are Zips" },
          { value: "d", label: "D) None is certain" },
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
        text: "If you rotate the letter 'N' by 90 degrees clockwise, it looks most like:",
        options: [
          { value: "a", label: "A) Z" },
          { value: "b", label: "B) The same N" },
          { value: "c", label: "C) A rotated Z" },
          { value: "d", label: "D) Cannot be determined" },
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
        text: "How many edges does a cube have?",
        options: [
          { value: "a", label: "A) 6" },
          { value: "b", label: "B) 8" },
          { value: "c", label: "C) 10" },
          { value: "d", label: "D) 12" },
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
        text: "A square piece of paper is folded in half diagonally. What shape is created?",
        options: [
          { value: "a", label: "A) Rectangle" },
          { value: "b", label: "B) Triangle" },
          { value: "c", label: "C) Pentagon" },
          { value: "d", label: "D) Smaller square" },
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
        text: "Which 3D shape has no vertices (corners)?",
        options: [
          { value: "a", label: "A) Cube" },
          { value: "b", label: "B) Sphere" },
          { value: "c", label: "C) Pyramid" },
          { value: "d", label: "D) Cylinder" },
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
        text: "If two gears of equal size mesh together and one rotates clockwise, the other rotates:",
        options: [
          { value: "a", label: "A) Clockwise at the same speed" },
          { value: "b", label: "B) Counter-clockwise at the same speed" },
          { value: "c", label: "C) Clockwise at half speed" },
          { value: "d", label: "D) Counter-clockwise at double speed" },
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
    title: "Verbal Reasoning & Comprehension",
    description: "Assess your language skills, vocabulary, and reading comprehension abilities.",
    questions: [
      {
        id: "vr1",
        text: "Choose the word most similar in meaning to 'METICULOUS':",
        options: [
          { value: "a", label: "A) Careless" },
          { value: "b", label: "B) Thorough" },
          { value: "c", label: "C) Quick" },
          { value: "d", label: "D) Lazy" },
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
        text: "Choose the word opposite in meaning to 'EXPAND':",
        options: [
          { value: "a", label: "A) Grow" },
          { value: "b", label: "B) Contract" },
          { value: "c", label: "C) Increase" },
          { value: "d", label: "D) Spread" },
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
        text: "Complete the analogy: Book is to Reading as Fork is to:",
        options: [
          { value: "a", label: "A) Drawing" },
          { value: "b", label: "B) Eating" },
          { value: "c", label: "C) Writing" },
          { value: "d", label: "D) Cooking" },
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
        text: "Which word does NOT belong with the others?",
        options: [
          { value: "a", label: "A) Rose" },
          { value: "b", label: "B) Tulip" },
          { value: "c", label: "C) Daisy" },
          { value: "d", label: "D) Oak" },
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
        text: "The word 'FAST' can mean both quick and firmly fixed. This is an example of:",
        options: [
          { value: "a", label: "A) Synonym" },
          { value: "b", label: "B) Antonym" },
          { value: "c", label: "C) Homonym" },
          { value: "d", label: "D) Metaphor" },
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
        text: "Choose the grammatically correct sentence:",
        options: [
          { value: "a", label: "A) Each of the students have a book" },
          { value: "b", label: "B) Each of the students has a book" },
          { value: "c", label: "C) Each of the student has a book" },
          { value: "d", label: "D) Each of the student have a book" },
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
        text: "What is the main purpose of a persuasive essay?",
        options: [
          { value: "a", label: "A) To inform" },
          { value: "b", label: "B) To entertain" },
          { value: "c", label: "C) To convince" },
          { value: "d", label: "D) To describe" },
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
        text: "In the sentence 'The cat sat on the mat', what is 'on the mat'?",
        options: [
          { value: "a", label: "A) Subject" },
          { value: "b", label: "B) Predicate" },
          { value: "c", label: "C) Prepositional phrase" },
          { value: "d", label: "D) Object" },
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
        text: "Which literary device is used: 'The classroom was a zoo'?",
        options: [
          { value: "a", label: "A) Simile" },
          { value: "b", label: "B) Metaphor" },
          { value: "c", label: "C) Personification" },
          { value: "d", label: "D) Hyperbole" },
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
        text: "What does the prefix 'pre-' mean?",
        options: [
          { value: "a", label: "A) After" },
          { value: "b", label: "B) Before" },
          { value: "c", label: "C) Against" },
          { value: "d", label: "D) With" },
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
        text: "When evaluating an argument, I first:",
        options: [
          { value: "a", label: "Identify the main claim" },
          { value: "b", label: "Look for supporting evidence" },
          { value: "c", label: "Consider alternative viewpoints" },
          { value: "d", label: "Check for logical fallacies" },
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
        text: "I recognize bias in information by:",
        options: [
          { value: "a", label: "Checking the source's credibility" },
          { value: "b", label: "Looking for emotionally charged language" },
          { value: "c", label: "Comparing multiple sources" },
          { value: "d", label: "Identifying missing information" },
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
        text: "When faced with conflicting information, I:",
        options: [
          { value: "a", label: "Research more to find the truth" },
          { value: "b", label: "Evaluate the credibility of each source" },
          { value: "c", label: "Consider that both might be partially correct" },
          { value: "d", label: "Defer to expert opinions" },
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
        text: "I question assumptions by:",
        options: [
          { value: "a", label: "Asking 'What if the opposite were true?'" },
          { value: "b", label: "Looking for evidence that supports them" },
          { value: "c", label: "Considering cultural or personal biases" },
          { value: "d", label: "Testing them in real situations" },
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
        text: "My approach to analyzing complex issues is to:",
        options: [
          { value: "a", label: "Break them into smaller components" },
          { value: "b", label: "Consider multiple perspectives" },
          { value: "c", label: "Look for patterns and connections" },
          { value: "d", label: "Gather comprehensive data first" },
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
        text: "I can tell the difference between fact and opinion by:",
        options: [
          { value: "a", label: "Checking if it can be proven" },
          { value: "b", label: "Identifying subjective language" },
          { value: "c", label: "Looking for citations and sources" },
          { value: "d", label: "Considering the context" },
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
        text: "When making important decisions, I:",
        options: [
          { value: "a", label: "List pros and cons systematically" },
          { value: "b", label: "Consider long-term consequences" },
          { value: "c", label: "Seek input from others" },
          { value: "d", label: "Trust my intuition based on experience" },
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
        text: "I evaluate the strength of evidence by considering:",
        options: [
          { value: "a", label: "Sample size and methodology" },
          { value: "b", label: "Source credibility and expertise" },
          { value: "c", label: "Consistency with other evidence" },
          { value: "d", label: "Recency and relevance" },
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
        text: "When I encounter a logical fallacy, my response is to:",
        options: [
          { value: "a", label: "Point it out and explain why" },
          { value: "b", label: "Question the entire argument" },
          { value: "c", label: "Look for other weaknesses" },
          { value: "d", label: "Reformulate the argument correctly" },
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
        text: "I distinguish correlation from causation by:",
        options: [
          { value: "a", label: "Looking for controlled experiments" },
          { value: "b", label: "Considering alternative explanations" },
          { value: "c", label: "Checking temporal sequence" },
          { value: "d", label: "Examining the mechanism of action" },
        ],
      },
    ],
  },
  {
    id: "time-management",
    title: "Time Management & Organization",
    description: "Assess your planning, prioritization, and organizational skills.",
    questions: [
      {
        id: "tm1",
        text: "I plan my day by:",
        options: [
          { value: "a", label: "Creating detailed schedules and to-do lists" },
          { value: "b", label: "Setting priorities for key tasks" },
          { value: "c", label: "Having a general idea of what needs doing" },
          { value: "d", label: "Handling tasks as they come up" },
        ],
      },
      {
        id: "tm2",
        text: "When facing multiple deadlines, I:",
        options: [
          { value: "a", label: "Tackle the most urgent first" },
          { value: "b", label: "Start with the most important" },
          { value: "c", label: "Do the easiest tasks first" },
          { value: "d", label: "Work on multiple tasks in parallel" },
        ],
      },
      {
        id: "tm3",
        text: "My workspace organization is:",
        options: [
          { value: "a", label: "Very organized with everything in its place" },
          { value: "b", label: "Organized enough to find what I need" },
          { value: "c", label: "Somewhat cluttered but functional" },
          { value: "d", label: "Chaotic but I know where things are" },
        ],
      },
      {
        id: "tm4",
        text: "I handle procrastination by:",
        options: [
          { value: "a", label: "Breaking tasks into smaller steps" },
          { value: "b", label: "Setting artificial deadlines" },
          { value: "c", label: "Removing distractions" },
          { value: "d", label: "Finding motivation or rewards" },
        ],
      },
      {
        id: "tm5",
        text: "For long-term projects, I:",
        options: [
          { value: "a", label: "Create detailed project plans" },
          { value: "b", label: "Set milestones and checkpoints" },
          { value: "c", label: "Work steadily over time" },
          { value: "d", label: "Intensify effort closer to deadline" },
        ],
      },
      {
        id: "tm6",
        text: "I track my commitments using:",
        options: [
          { value: "a", label: "Digital calendar and task apps" },
          { value: "b", label: "Physical planner or notebook" },
          { value: "c", label: "Mental notes and reminders" },
          { value: "d", label: "A combination of methods" },
        ],
      },
      {
        id: "tm7",
        text: "When interrupted during focused work, I:",
        options: [
          { value: "a", label: "Set boundaries and minimize interruptions" },
          { value: "b", label: "Handle it quickly and return to work" },
          { value: "c", label: "Schedule specific times for interruptions" },
          { value: "d", label: "Adapt and reprioritize" },
        ],
      },
      {
        id: "tm8",
        text: "I allocate time for tasks by:",
        options: [
          { value: "a", label: "Estimating based on past experience" },
          { value: "b", label: "Adding buffer time for uncertainties" },
          { value: "c", label: "Using time-tracking data" },
          { value: "d", label: "Being flexible and adjusting as needed" },
        ],
      },
      {
        id: "tm9",
        text: "My approach to meetings is:",
        options: [
          { value: "a", label: "Always prepared with agenda" },
          { value: "b", label: "Punctual and time-conscious" },
          { value: "c", label: "Participative when relevant" },
          { value: "d", label: "Follow up with action items" },
        ],
      },
      {
        id: "tm10",
        text: "I balance multiple responsibilities by:",
        options: [
          { value: "a", label: "Strict time-blocking for each area" },
          { value: "b", label: "Maintaining clear priorities" },
          { value: "c", label: "Delegating when possible" },
          { value: "d", label: "Being flexible and adaptive" },
        ],
      },
    ],
  },
  {
    id: "communication-preferences",
    title: "Communication Preferences",
    description: "Understand your communication style and preferences in various contexts.",
    questions: [
      {
        id: "com1",
        text: "I prefer to communicate:",
        options: [
          { value: "a", label: "Face-to-face for personal connection" },
          { value: "b", label: "In writing for clarity and record" },
          { value: "c", label: "By phone or video for efficiency" },
          { value: "d", label: "Through the most appropriate channel for context" },
        ],
      },
      {
        id: "com2",
        text: "When explaining complex ideas, I:",
        options: [
          { value: "a", label: "Use analogies and examples" },
          { value: "b", label: "Break it down step-by-step" },
          { value: "c", label: "Use visuals or diagrams" },
          { value: "d", label: "Check understanding frequently" },
        ],
      },
      {
        id: "com3",
        text: "In group discussions, I typically:",
        options: [
          { value: "a", label: "Take a leadership role" },
          { value: "b", label: "Contribute ideas actively" },
          { value: "c", label: "Listen and respond thoughtfully" },
          { value: "d", label: "Facilitate and keep on track" },
        ],
      },
      {
        id: "com4",
        text: "When receiving feedback, I prefer it to be:",
        options: [
          { value: "a", label: "Direct and to the point" },
          { value: "b", label: "Balanced with positive and negative" },
          { value: "c", label: "Specific with examples" },
          { value: "d", label: "Constructive with suggestions" },
        ],
      },
      {
        id: "com5",
        text: "I handle disagreements by:",
        options: [
          { value: "a", label: "Addressing them directly and calmly" },
          { value: "b", label: "Finding common ground first" },
          { value: "c", label: "Listening to understand the other perspective" },
          { value: "d", label: "Focusing on solutions rather than problems" },
        ],
      },
      {
        id: "com6",
        text: "My email communication style is:",
        options: [
          { value: "a", label: "Brief and to the point" },
          { value: "b", label: "Detailed and comprehensive" },
          { value: "c", label: "Friendly and personable" },
          { value: "d", label: "Professional and formal" },
        ],
      },
      {
        id: "com7",
        text: "When presenting to an audience, I:",
        options: [
          { value: "a", label: "Prepare thoroughly and practice" },
          { value: "b", label: "Focus on engaging the audience" },
          { value: "c", label: "Use stories and examples" },
          { value: "d", label: "Adapt to audience feedback" },
        ],
      },
      {
        id: "com8",
        text: "I build rapport with others by:",
        options: [
          { value: "a", label: "Finding common interests" },
          { value: "b", label: "Active listening and empathy" },
          { value: "c", label: "Being genuine and authentic" },
          { value: "d", label: "Showing interest in their perspective" },
        ],
      },
      {
        id: "com9",
        text: "In written communication, I prioritize:",
        options: [
          { value: "a", label: "Clarity and simplicity" },
          { value: "b", label: "Accuracy and precision" },
          { value: "c", label: "Structure and organization" },
          { value: "d", label: "Tone and appropriateness" },
        ],
      },
      {
        id: "com10",
        text: "When collaborating remotely, I:",
        options: [
          { value: "a", label: "Use video calls for important discussions" },
          { value: "b", label: "Document everything in writing" },
          { value: "c", label: "Check in regularly with team members" },
          { value: "d", label: "Use collaborative tools effectively" },
        ],
      },
    ],
  },
  {
    id: "stress-resilience",
    title: "Stress Management & Resilience",
    description: "Assess how you handle pressure, setbacks, and challenging situations.",
    questions: [
      {
        id: "sr1",
        text: "Under pressure, I tend to:",
        options: [
          { value: "a", label: "Stay calm and focused" },
          { value: "b", label: "Work more intensely" },
          { value: "c", label: "Feel stressed but manage" },
          { value: "d", label: "Seek support from others" },
        ],
      },
      {
        id: "sr2",
        text: "When facing setbacks, I:",
        options: [
          { value: "a", label: "Analyze what went wrong" },
          { value: "b", label: "Focus on moving forward" },
          { value: "c", label: "Take time to process emotions" },
          { value: "d", label: "Seek advice and perspective" },
        ],
      },
      {
        id: "sr3",
        text: "I manage stress by:",
        options: [
          { value: "a", label: "Exercise and physical activity" },
          { value: "b", label: "Taking breaks and relaxing" },
          { value: "c", label: "Talking with friends or family" },
          { value: "d", label: "Meditation or mindfulness" },
        ],
      },
      {
        id: "sr4",
        text: "My recovery time after stressful events is:",
        options: [
          { value: "a", label: "Quick - I bounce back fast" },
          { value: "b", label: "Moderate - I need some time" },
          { value: "c", label: "Varies by situation" },
          { value: "d", label: "Gradual - I process thoroughly" },
        ],
      },
      {
        id: "sr5",
        text: "When overwhelmed, I:",
        options: [
          { value: "a", label: "Prioritize and focus on essentials" },
          { value: "b", label: "Ask for help or delegate" },
          { value: "c", label: "Take a step back to gain perspective" },
          { value: "d", label: "Break tasks into manageable pieces" },
        ],
      },
      {
        id: "sr6",
        text: "I maintain work-life balance by:",
        options: [
          { value: "a", label: "Setting clear boundaries" },
          { value: "b", label: "Scheduling personal time" },
          { value: "c", label: "Being flexible and adaptive" },
          { value: "d", label: "Pursuing hobbies and interests" },
        ],
      },
      {
        id: "sr7",
        text: "Criticism affects me by:",
        options: [
          { value: "a", label: "Motivating me to improve" },
          { value: "b", label: "Initially stinging but then useful" },
          { value: "c", label: "Depends on how it's delivered" },
          { value: "d", label: "Making me reflect deeply" },
        ],
      },
      {
        id: "sr8",
        text: "I build resilience through:",
        options: [
          { value: "a", label: "Learning from past experiences" },
          { value: "b", label: "Maintaining a support network" },
          { value: "c", label: "Developing coping strategies" },
          { value: "d", label: "Staying physically and mentally healthy" },
        ],
      },
      {
        id: "sr9",
        text: "When things don't go as planned, I:",
        options: [
          { value: "a", label: "Adapt and find alternative approaches" },
          { value: "b", label: "Stay positive and persistent" },
          { value: "c", label: "Reassess goals and expectations" },
          { value: "d", label: "Learn and adjust for next time" },
        ],
      },
      {
        id: "sr10",
        text: "My attitude toward challenges is:",
        options: [
          { value: "a", label: "Opportunities for growth" },
          { value: "b", label: "Tests to overcome" },
          { value: "c", label: "Part of life to handle" },
          { value: "d", label: "Learning experiences" },
        ],
      },
    ],
  },
  {
    id: "creativity-innovation",
    title: "Creativity & Innovation",
    description: "Evaluate your creative thinking, innovation, and ability to generate novel ideas.",
    questions: [
      {
        id: "ci1",
        text: "I generate new ideas by:",
        options: [
          { value: "a", label: "Brainstorming freely without judgment" },
          { value: "b", label: "Combining existing concepts in new ways" },
          { value: "c", label: "Looking at problems from different angles" },
          { value: "d", label: "Drawing inspiration from diverse sources" },
        ],
      },
      {
        id: "ci2",
        text: "When solving creative problems, I:",
        options: [
          { value: "a", label: "Think outside conventional boundaries" },
          { value: "b", label: "Experiment with multiple approaches" },
          { value: "c", label: "Let ideas incubate subconsciously" },
          { value: "d", label: "Seek inspiration from others' work" },
        ],
      },
      {
        id: "ci3",
        text: "I express creativity through:",
        options: [
          { value: "a", label: "Arts and crafts" },
          { value: "b", label: "Problem-solving and innovation" },
          { value: "c", label: "Writing and storytelling" },
          { value: "d", label: "Design and aesthetics" },
        ],
      },
      {
        id: "ci4",
        text: "My approach to innovation is:",
        options: [
          { value: "a", label: "Radical - completely new approaches" },
          { value: "b", label: "Incremental - improving existing ideas" },
          { value: "c", label: "Adaptive - applying ideas from other fields" },
          { value: "d", label: "Collaborative - building on others' ideas" },
        ],
      },
      {
        id: "ci5",
        text: "I overcome creative blocks by:",
        options: [
          { value: "a", label: "Taking breaks and changing environment" },
          { value: "b", label: "Seeking new experiences and stimuli" },
          { value: "c", label: "Discussing with others for fresh perspectives" },
          { value: "d", label: "Working on different projects" },
        ],
      },
      {
        id: "ci6",
        text: "When evaluating new ideas, I consider:",
        options: [
          { value: "a", label: "Originality and uniqueness" },
          { value: "b", label: "Feasibility and practicality" },
          { value: "c", label: "Potential impact and value" },
          { value: "d", label: "Alignment with goals" },
        ],
      },
      {
        id: "ci7",
        text: "I foster creativity by:",
        options: [
          { value: "a", label: "Allowing myself to make mistakes" },
          { value: "b", label: "Exploring diverse interests" },
          { value: "c", label: "Questioning assumptions" },
          { value: "d", label: "Creating space for reflection" },
        ],
      },
      {
        id: "ci8",
        text: "My creative process is:",
        options: [
          { value: "a", label: "Structured with defined stages" },
          { value: "b", label: "Spontaneous and organic" },
          { value: "c", label: "Iterative with cycles of refinement" },
          { value: "d", label: "Collaborative with input from others" },
        ],
      },
      {
        id: "ci9",
        text: "I capture creative insights by:",
        options: [
          { value: "a", label: "Writing them down immediately" },
          { value: "b", label: "Creating visual sketches or diagrams" },
          { value: "c", label: "Recording voice memos" },
          { value: "d", label: "Discussing and developing them further" },
        ],
      },
      {
        id: "ci10",
        text: "Innovation for me means:",
        options: [
          { value: "a", label: "Creating something entirely new" },
          { value: "b", label: "Improving what already exists" },
          { value: "c", label: "Finding better ways to solve problems" },
          { value: "d", label: "Thinking differently about challenges" },
        ],
      },
    ],
  },
  {
    id: "data-interpretation",
    title: "Data Interpretation",
    description: "Assess your ability to understand and analyze data, charts, and graphs.",
    questions: [
      {
        id: "di1",
        text: "A pie chart shows: Product A (40%), Product B (35%), Product C (25%). If total sales are ₹1,00,000, what are Product A's sales?",
        options: [
          { value: "a", label: "A) ₹35,000" },
          { value: "b", label: "B) ₹40,000" },
          { value: "c", label: "C) ₹45,000" },
          { value: "d", label: "D) ₹50,000" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "di2",
        text: "A bar graph shows sales: Jan (100), Feb (150), Mar (200). What is the percentage increase from Jan to Mar?",
        options: [
          { value: "a", label: "A) 50%" },
          { value: "b", label: "B) 75%" },
          { value: "c", label: "C) 100%" },
          { value: "d", label: "D) 150%" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "di3",
        text: "When analyzing data trends, I focus on:",
        options: [
          { value: "a", label: "Overall patterns and direction" },
          { value: "b", label: "Outliers and anomalies" },
          { value: "c", label: "Specific data points" },
          { value: "d", label: "Comparisons between categories" },
        ],
      },
      {
        id: "di4",
        text: "Given data: 10, 20, 30, 40, 100. What is the median?",
        options: [
          { value: "a", label: "A) 20" },
          { value: "b", label: "B) 30" },
          { value: "c", label: "C) 40" },
          { value: "d", label: "D) 50" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "di5",
        text: "I present data findings by:",
        options: [
          { value: "a", label: "Creating clear visualizations" },
          { value: "b", label: "Summarizing key insights" },
          { value: "c", label: "Providing detailed tables" },
          { value: "d", label: "Telling a data-driven story" },
        ],
      },
      {
        id: "di6",
        text: "A table shows: Q1 revenue ₹50 lakhs, Q2 ₹60 lakhs, Q3 ₹55 lakhs, Q4 ₹65 lakhs. What is the average quarterly revenue?",
        options: [
          { value: "a", label: "A) ₹55 lakhs" },
          { value: "b", label: "B) ₹57.5 lakhs" },
          { value: "c", label: "C) ₹60 lakhs" },
          { value: "d", label: "D) ₹62.5 lakhs" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "di7",
        text: "When interpreting charts, I:",
        options: [
          { value: "a", label: "Read the title and axes first" },
          { value: "b", label: "Look for the main message" },
          { value: "c", label: "Compare data points systematically" },
          { value: "d", label: "Consider the data source and context" },
        ],
      },
      {
        id: "di8",
        text: "If a line graph shows an upward trend with fluctuations, I conclude:",
        options: [
          { value: "a", label: "Overall positive growth despite variations" },
          { value: "b", label: "Inconsistent and unreliable data" },
          { value: "c", label: "Need more data to determine trend" },
          { value: "d", label: "Seasonal or cyclical patterns exist" },
        ],
      },
      {
        id: "di9",
        text: "I validate data accuracy by:",
        options: [
          { value: "a", label: "Checking calculations and formulas" },
          { value: "b", label: "Comparing with other sources" },
          { value: "c", label: "Looking for inconsistencies" },
          { value: "d", label: "Verifying data collection methods" },
        ],
      },
      {
        id: "di10",
        text: "When comparing two datasets, I:",
        options: [
          { value: "a", label: "Use percentages for relative comparison" },
          { value: "b", label: "Look at absolute differences" },
          { value: "c", label: "Create side-by-side visualizations" },
          { value: "d", label: "Calculate statistical measures" },
        ],
      },
    ],
  },
  {
    id: "decision-making",
    title: "Decision Making",
    description: "Evaluate your decision-making process, risk assessment, and judgment.",
    questions: [
      {
        id: "dm1",
        text: "When making important decisions, I:",
        options: [
          { value: "a", label: "Gather all available information first" },
          { value: "b", label: "Trust my intuition and experience" },
          { value: "c", label: "Consult with trusted advisors" },
          { value: "d", label: "Use a systematic decision-making framework" },
        ],
      },
      {
        id: "dm2",
        text: "I handle uncertainty by:",
        options: [
          { value: "a", label: "Making the best decision with available info" },
          { value: "b", label: "Waiting for more clarity when possible" },
          { value: "c", label: "Considering multiple scenarios" },
          { value: "d", label: "Taking calculated risks" },
        ],
      },
      {
        id: "dm3",
        text: "My risk tolerance is:",
        options: [
          { value: "a", label: "High - I embrace calculated risks" },
          { value: "b", label: "Moderate - balanced approach" },
          { value: "c", label: "Conservative - prefer safe options" },
          { value: "d", label: "Varies by situation and stakes" },
        ],
      },
      {
        id: "dm4",
        text: "I evaluate options by:",
        options: [
          { value: "a", label: "Listing pros and cons" },
          { value: "b", label: "Considering alignment with goals" },
          { value: "c", label: "Assessing potential outcomes" },
          { value: "d", label: "Weighing short vs long-term effects" },
        ],
      },
      {
        id: "dm5",
        text: "When I make a wrong decision, I:",
        options: [
          { value: "a", label: "Learn from it and adjust" },
          { value: "b", label: "Analyze what went wrong" },
          { value: "c", label: "Take corrective action quickly" },
          { value: "d", label: "Don't dwell on it, move forward" },
        ],
      },
      {
        id: "dm6",
        text: "Group decisions work best when I:",
        options: [
          { value: "a", label: "Facilitate consensus building" },
          { value: "b", label: "Contribute my expertise" },
          { value: "c", label: "Ensure all voices are heard" },
          { value: "d", label: "Help evaluate options objectively" },
        ],
      },
      {
        id: "dm7",
        text: "I make quick decisions when:",
        options: [
          { value: "a", label: "The situation is urgent" },
          { value: "b", label: "I have relevant experience" },
          { value: "c", label: "The stakes are low" },
          { value: "d", label: "I trust my instincts" },
        ],
      },
      {
        id: "dm8",
        text: "Before committing to a major decision, I:",
        options: [
          { value: "a", label: "Sleep on it for perspective" },
          { value: "b", label: "Consider the worst-case scenario" },
          { value: "c", label: "Seek diverse opinions" },
          { value: "d", label: "Review my reasoning process" },
        ],
      },
      {
        id: "dm9",
        text: "I balance logic and emotion in decisions by:",
        options: [
          { value: "a", label: "Relying primarily on logical analysis" },
          { value: "b", label: "Trusting my gut feelings" },
          { value: "c", label: "Considering both equally" },
          { value: "d", label: "Using logic first, then checking with intuition" },
        ],
      },
      {
        id: "dm10",
        text: "When faced with two equally good options, I:",
        options: [
          { value: "a", label: "Find a tiebreaker criterion" },
          { value: "b", label: "Choose based on gut feeling" },
          { value: "c", label: "Flip a coin and be happy with either" },
          { value: "d", label: "Look for a way to combine both" },
        ],
      },
    ],
  },
  {
    id: "attention-detail",
    title: "Attention to Detail",
    description: "Assess your ability to notice details, maintain accuracy, and ensure quality.",
    questions: [
      {
        id: "ad1",
        text: "When reviewing documents, I:",
        options: [
          { value: "a", label: "Check every detail systematically" },
          { value: "b", label: "Focus on critical elements" },
          { value: "c", label: "Scan for obvious errors" },
          { value: "d", label: "Use multiple review passes" },
        ],
      },
      {
        id: "ad2",
        text: "I catch errors by:",
        options: [
          { value: "a", label: "Careful line-by-line review" },
          { value: "b", label: "Using checklists" },
          { value: "c", label: "Reading backwards or aloud" },
          { value: "d", label: "Having others review my work" },
        ],
      },
      {
        id: "ad3",
        text: "My approach to quality assurance is:",
        options: [
          { value: "a", label: "Perfectionistic - no errors acceptable" },
          { value: "b", label: "High standards with practical limits" },
          { value: "c", label: "Context-dependent - varies by importance" },
          { value: "d", label: "Good enough while meeting requirements" },
        ],
      },
      {
        id: "ad4",
        text: "I notice details in:",
        options: [
          { value: "a", label: "Numbers and data" },
          { value: "b", label: "Visual elements and design" },
          { value: "c", label: "Language and writing" },
          { value: "d", label: "Processes and procedures" },
        ],
      },
      {
        id: "ad5",
        text: "When following instructions, I:",
        options: [
          { value: "a", label: "Read completely before starting" },
          { value: "b", label: "Follow step-by-step precisely" },
          { value: "c", label: "Check understanding at each step" },
          { value: "d", label: "Adapt if I find a better way" },
        ],
      },
      {
        id: "ad6",
        text: "I maintain accuracy under pressure by:",
        options: [
          { value: "a", label: "Slowing down deliberately" },
          { value: "b", label: "Using verification checklists" },
          { value: "c", label: "Taking brief breaks to refocus" },
          { value: "d", label: "Double-checking critical items" },
        ],
      },
      {
        id: "ad7",
        text: "My record-keeping is:",
        options: [
          { value: "a", label: "Meticulous and comprehensive" },
          { value: "b", label: "Organized and accessible" },
          { value: "c", label: "Adequate for my needs" },
          { value: "d", label: "Minimal but sufficient" },
        ],
      },
      {
        id: "ad8",
        text: "I prevent mistakes by:",
        options: [
          { value: "a", label: "Creating systems and processes" },
          { value: "b", label: "Staying focused and avoiding distractions" },
          { value: "c", label: "Learning from past errors" },
          { value: "d", label: "Using automation where possible" },
        ],
      },
      {
        id: "ad9",
        text: "When I find an error in my work, I:",
        options: [
          { value: "a", label: "Correct it immediately" },
          { value: "b", label: "Investigate the root cause" },
          { value: "c", label: "Check for similar errors elsewhere" },
          { value: "d", label: "Update my process to prevent recurrence" },
        ],
      },
      {
        id: "ad10",
        text: "My focus during detail-oriented tasks is:",
        options: [
          { value: "a", label: "Excellent - I naturally notice details" },
          { value: "b", label: "Strong when I concentrate" },
          { value: "c", label: "Requires conscious effort" },
          { value: "d", label: "Better with tools and systems" },
        ],
      },
    ],
  },
  {
    id: "memory-retention",
    title: "Memory & Retention",
    description: "Evaluate your memory strategies, information retention, and recall abilities.",
    questions: [
      {
        id: "mr1",
        text: "I remember information best when I:",
        options: [
          { value: "a", label: "Write it down or take notes" },
          { value: "b", label: "Repeat it multiple times" },
          { value: "c", label: "Associate it with existing knowledge" },
          { value: "d", label: "Use it in practice immediately" },
        ],
      },
      {
        id: "mr2",
        text: "For long-term retention, I:",
        options: [
          { value: "a", label: "Review material at spaced intervals" },
          { value: "b", label: "Create mental associations or mnemonics" },
          { value: "c", label: "Teach or explain it to others" },
          { value: "d", label: "Apply it in different contexts" },
        ],
      },
      {
        id: "mr3",
        text: "I recall names and faces by:",
        options: [
          { value: "a", label: "Repetition and review" },
          { value: "b", label: "Creating associations or stories" },
          { value: "c", label: "Focusing intently when first meeting" },
          { value: "d", label: "Writing them down afterwards" },
        ],
      },
      {
        id: "mr4",
        text: "My working memory capacity is:",
        options: [
          { value: "a", label: "Strong - I juggle multiple things easily" },
          { value: "b", label: "Good - with conscious effort" },
          { value: "c", label: "Average - I use external aids" },
          { value: "d", label: "Limited - I prefer one thing at a time" },
        ],
      },
      {
        id: "mr5",
        text: "When I forget something, I:",
        options: [
          { value: "a", label: "Retrace my steps mentally" },
          { value: "b", label: "Look for contextual cues" },
          { value: "c", label: "Let it come to me naturally" },
          { value: "d", label: "Check my notes or records" },
        ],
      },
      {
        id: "mr6",
        text: "I organize information in memory by:",
        options: [
          { value: "a", label: "Categories and hierarchies" },
          { value: "b", label: "Chronological sequences" },
          { value: "c", label: "Visual or spatial arrangements" },
          { value: "d", label: "Associations and connections" },
        ],
      },
      {
        id: "mr7",
        text: "For remembering procedures, I prefer:",
        options: [
          { value: "a", label: "Step-by-step written instructions" },
          { value: "b", label: "Hands-on practice until automatic" },
          { value: "c", label: "Understanding the underlying logic" },
          { value: "d", label: "Visual flowcharts or diagrams" },
        ],
      },
      {
        id: "mr8",
        text: "My memory for details is:",
        options: [
          { value: "a", label: "Excellent - I remember specifics well" },
          { value: "b", label: "Good for important details" },
          { value: "c", label: "Better for concepts than details" },
          { value: "d", label: "Variable - depends on interest" },
        ],
      },
      {
        id: "mr9",
        text: "I strengthen memory by:",
        options: [
          { value: "a", label: "Regular review and practice" },
          { value: "b", label: "Making material meaningful" },
          { value: "c", label: "Using multiple senses" },
          { value: "d", label: "Getting adequate sleep" },
        ],
      },
      {
        id: "mr10",
        text: "When learning similar concepts, I:",
        options: [
          { value: "a", label: "Clearly distinguish differences" },
          { value: "b", label: "Space out learning sessions" },
          { value: "c", label: "Create comparison charts" },
          { value: "d", label: "Focus on unique features of each" },
        ],
      },
    ],
  },
  {
    id: "collaborative-learning",
    title: "Collaborative Learning Styles",
    description: "Assess your preferences and effectiveness in group learning and teamwork.",
    questions: [
      {
        id: "cl1",
        text: "In group learning situations, I prefer to:",
        options: [
          { value: "a", label: "Lead and organize the group" },
          { value: "b", label: "Contribute ideas and participate actively" },
          { value: "c", label: "Research and provide information" },
          { value: "d", label: "Synthesize and summarize learning" },
        ],
      },
      {
        id: "cl2",
        text: "I learn from peers by:",
        options: [
          { value: "a", label: "Asking questions and seeking explanations" },
          { value: "b", label: "Observing their approaches" },
          { value: "c", label: "Engaging in discussions and debates" },
          { value: "d", label: "Collaborating on practice problems" },
        ],
      },
      {
        id: "cl3",
        text: "Group study sessions are most valuable when:",
        options: [
          { value: "a", label: "Everyone prepares individually first" },
          { value: "b", label: "We teach each other different topics" },
          { value: "c", label: "We work through problems together" },
          { value: "d", label: "We quiz and test each other" },
        ],
      },
      {
        id: "cl4",
        text: "My contribution to team projects typically involves:",
        options: [
          { value: "a", label: "Planning and coordination" },
          { value: "b", label: "Research and analysis" },
          { value: "c", label: "Creative ideation" },
          { value: "d", label: "Execution and implementation" },
        ],
      },
      {
        id: "cl5",
        text: "I handle disagreements in learning groups by:",
        options: [
          { value: "a", label: "Facilitating discussion to find consensus" },
          { value: "b", label: "Researching to find the correct answer" },
          { value: "c", label: "Accepting different perspectives" },
          { value: "d", label: "Consulting external resources or experts" },
        ],
      },
      {
        id: "cl6",
        text: "My ideal team size for learning is:",
        options: [
          { value: "a", label: "2-3 people for focused discussion" },
          { value: "b", label: "4-5 people for diverse perspectives" },
          { value: "c", label: "6+ people for comprehensive coverage" },
          { value: "d", label: "Flexible - depends on the task" },
        ],
      },
      {
        id: "cl7",
        text: "I prefer to collaborate:",
        options: [
          { value: "a", label: "In person for better interaction" },
          { value: "b", label: "Online for flexibility" },
          { value: "c", label: "Hybrid - mix of both" },
          { value: "d", label: "Asynchronously with shared documents" },
        ],
      },
      {
        id: "cl8",
        text: "When teaching others, I:",
        options: [
          { value: "a", label: "Explain step-by-step clearly" },
          { value: "b", label: "Use examples and analogies" },
          { value: "c", label: "Encourage them to discover answers" },
          { value: "d", label: "Adapt to their learning style" },
        ],
      },
      {
        id: "cl9",
        text: "Peer feedback helps me most when it's:",
        options: [
          { value: "a", label: "Specific and actionable" },
          { value: "b", label: "Balanced with encouragement" },
          { value: "c", label: "From multiple perspectives" },
          { value: "d", label: "Delivered constructively" },
        ],
      },
      {
        id: "cl10",
        text: "I balance individual and group learning by:",
        options: [
          { value: "a", label: "Learning basics alone, discussing advanced topics" },
          { value: "b", label: "Alternating between solo and group study" },
          { value: "c", label: "Using groups for motivation and accountability" },
          { value: "d", label: "Preferring one mode over the other" },
=======
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

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < currentModule.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentQuestionIndex, currentModuleIndex, currentModule.questions.length]);

  const handleSelectAnswer = useCallback((value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
    
    // Auto-advance to next question after a brief delay for better UX
    setTimeout(() => {
      if (currentQuestionIndex < currentModule.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else if (currentModuleIndex < modules.length - 1) {
        setCurrentModuleIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      }
    }, 300);
  }, [currentQuestion.id, currentQuestionIndex, currentModuleIndex, currentModule.questions.length]);

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
