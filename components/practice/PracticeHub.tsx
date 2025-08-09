import React from "react";
import Link from "next/link";
import {
  FiZap,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiBookOpen,
  FiAward,
  FiPlay,
} from "react-icons/fi";

const practiceCategories = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description:
      "Master fundamental algorithms and data structures with hands-on coding challenges.",
    icon: FiTarget,
    color: "#3B82F6",
    features: [
      "Array & String Manipulation",
      "Linked Lists & Trees",
      "Dynamic Programming",
      "Graph Algorithms",
      "Time & Space Complexity",
    ],
    stats: { problems: 150, difficulty: "Medium-Hard" },
    link: "/problems?type=dsa",
  },
  {
    id: "machine-coding",
    title: "Machine Coding",
    description:
      "Build real-world applications with modern JavaScript frameworks and libraries.",
    icon: FiZap,
    color: "#10B981",
    features: [
      "React Component Building",
      "State Management",
      "API Integration",
      "Performance Optimization",
      "Testing & Debugging",
    ],
    stats: { problems: 80, difficulty: "Medium" },
    link: "/problems?type=machine-coding",
  },
  {
    id: "system-design",
    title: "System Design",
    description:
      "Design scalable systems and understand distributed architecture principles.",
    icon: FiTrendingUp,
    color: "#8B5CF6",
    features: [
      "Scalability Patterns",
      "Database Design",
      "Microservices Architecture",
      "Load Balancing",
      "Caching Strategies",
    ],
    stats: { problems: 45, difficulty: "Hard" },
    link: "/problems?type=system-design",
  },
  {
    id: "theory",
    title: "Frontend Theory",
    description:
      "Deep dive into JavaScript, React, and web development concepts.",
    icon: FiBookOpen,
    color: "#F59E0B",
    features: [
      "JavaScript Fundamentals",
      "React Hooks & Lifecycle",
      "Web APIs & Browser",
      "Performance & Security",
      "Modern ES6+ Features",
    ],
    stats: { problems: 120, difficulty: "Easy-Medium" },
    link: "/problems?type=theory",
  },
];

const stats = [
  { label: "Total Problems", value: "395+", icon: FiAward },
  { label: "Success Rate", value: "85%", icon: FiTrendingUp },
  { label: "Avg. Time", value: "45min", icon: FiClock },
  { label: "Active Users", value: "2.5k+", icon: FiPlay },
];

export default function PracticeHub() {
  return (
    <>
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text mb-4">Practice Hub</h1>
        <p className="text-lg text-text/80 mb-8 leading-relaxed max-w-3xl mx-auto">
          Choose your learning path and master the skills needed for frontend
          interviews. From DSA to system design, we've got you covered with
          comprehensive practice problems.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-secondary border border-border rounded-xl p-6 text-center"
          >
            <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-text mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-text/70">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Practice Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {practiceCategories.map((category) => (
          <div
            key={category.id}
            className="bg-secondary border border-border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary relative overflow-hidden group"
          >
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              style={{ backgroundColor: category.color }}
            ></div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                <category.icon />
              </div>
              <h3 className="text-xl font-semibold text-text m-0">
                {category.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-text/80 leading-relaxed mb-6">
              {category.description}
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {category.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-text/70">
                <span className="font-semibold">{category.stats.problems}</span>{" "}
                problems
              </div>
              <div className="text-sm text-text/70">
                Difficulty:{" "}
                <span className="font-semibold">
                  {category.stats.difficulty}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={category.link}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-accent hover:-translate-y-0.5 group-hover:shadow-lg"
            >
              Start Practice
              <FiPlay className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-text mb-4 text-center">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/mock-interviews"
            className="bg-white border border-border rounded-xl p-4 text-center transition-all duration-300 hover:border-primary hover:-translate-y-1"
          >
            <FiPlay className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="font-semibold text-text">Mock Interviews</div>
            <div className="text-sm text-text/70">Practice with AI</div>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white border border-border rounded-xl p-4 text-center transition-all duration-300 hover:border-primary hover:-translate-y-1"
          >
            <FiTrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="font-semibold text-text">Progress Dashboard</div>
            <div className="text-sm text-text/70">Track your growth</div>
          </Link>

          <Link
            href="/solved"
            className="bg-white border border-border rounded-xl p-4 text-center transition-all duration-300 hover:border-primary hover:-translate-y-1"
          >
            <FiAward className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="font-semibold text-text">Solved Problems</div>
            <div className="text-sm text-text/70">Review your work</div>
          </Link>
        </div>
      </div>
    </>
  );
}
