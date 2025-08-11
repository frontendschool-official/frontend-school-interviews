import React from "react";

import Link from "next/link";
import { useAuth } from "@/hooks";

const FeatureSection = () => {
  const { user } = useAuth();
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-8 bg-secondary">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-4 text-text">Why Choose Our Platform?</h2>
      <p className="text-base sm:text-lg md:text-xl text-center mb-8 sm:mb-12 md:mb-16 text-text opacity-80 max-w-2xl mx-auto px-4">
        Everything you need to ace your frontend interviews in one place
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        <div className="bg-bodyBg p-6 sm:p-8 md:p-10 rounded-2xl border border-border text-center transition-all duration-300 animate-[fadeInUp_1s_ease-out] hover:-translate-y-2 hover:shadow-xl hover:shadow-border/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl text-white animate-[float_3s_ease-in-out_infinite]">💻</div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-text">Real-time Code Editor</h3>
          <p className="text-sm sm:text-base text-text opacity-80 leading-relaxed">
            Practice with our advanced code editor featuring syntax
            highlighting, auto-completion, and real-time collaboration
            capabilities.
          </p>
        </div>
        <div className="bg-bodyBg p-6 sm:p-8 md:p-10 rounded-2xl border border-border text-center transition-all duration-300 animate-[fadeInUp_1s_ease-out] hover:-translate-y-2 hover:shadow-xl hover:shadow-border/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl text-white animate-[float_3s_ease-in-out_infinite]">🤖</div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-text">AI-Powered Feedback</h3>
          <p className="text-sm sm:text-base text-text opacity-80 leading-relaxed">
            Get instant, detailed feedback on your solutions with our advanced
            AI evaluation system that understands code quality and best
            practices.
          </p>
        </div>
        <div className="bg-bodyBg p-6 sm:p-8 md:p-10 rounded-2xl border border-border text-center transition-all duration-300 animate-[fadeInUp_1s_ease-out] hover:-translate-y-2 hover:shadow-xl hover:shadow-border/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl text-white animate-[float_3s_ease-in-out_infinite]">🎯</div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-text">System Design Canvas</h3>
          <p className="text-sm sm:text-base text-text opacity-80 leading-relaxed">
            Visualize and design complex systems with our interactive canvas,
            perfect for system design interviews and architecture discussions.
          </p>
        </div>
        <div className="bg-bodyBg p-6 sm:p-8 md:p-10 rounded-2xl border border-border text-center transition-all duration-300 animate-[fadeInUp_1s_ease-out] hover:-translate-y-2 hover:shadow-xl hover:shadow-border/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl text-white animate-[float_3s_ease-in-out_infinite]">📊</div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-text">Progress Tracking</h3>
          <p className="text-sm sm:text-base text-text opacity-80 leading-relaxed">
            Monitor your improvement with detailed analytics, performance
            metrics, and personalized learning recommendations.
          </p>
        </div>
        <div className="bg-bodyBg p-6 sm:p-8 md:p-10 rounded-2xl border border-border text-center transition-all duration-300 animate-[fadeInUp_1s_ease-out] hover:-translate-y-2 hover:shadow-xl hover:shadow-border/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl text-white animate-[float_3s_ease-in-out_infinite]">🚀</div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-text">Interview Simulation</h3>
          <p className="text-sm sm:text-base text-text opacity-80 leading-relaxed">
            Experience realistic interview scenarios with timed challenges, peer
            reviews, and comprehensive evaluation criteria.
          </p>
          {user && (
            <Link href="/mock-interview-setup" passHref legacyBehavior>
              <a className="inline-block mt-4 px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm text-bodyBg bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/60">
                Try Mock Interview
              </a>
            </Link>
          )}
        </div>
        <div className="bg-bodyBg p-6 sm:p-8 md:p-10 rounded-2xl border border-border text-center transition-all duration-300 animate-[fadeInUp_1s_ease-out] hover:-translate-y-2 hover:shadow-xl hover:shadow-border/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl text-white animate-[float_3s_ease-in-out_infinite]">📱</div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-text">Mobile Responsive</h3>
          <p className="text-sm sm:text-base text-text opacity-80 leading-relaxed">
            Practice anywhere, anytime with our fully responsive platform that
            works seamlessly across all devices and screen sizes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
