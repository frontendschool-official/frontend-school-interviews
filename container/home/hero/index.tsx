import Stats from "../stats";
import Link from "next/link";
import React from "react";

import { useAuth } from "@/hooks";

const HeroSection = () => {
  const { user } = useAuth();
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-8 min-h-80vh relative overflow-hidden bg-gradient-to-br from-neutral/10 via-neutralLight/10 to-neutral/10 bg-[length:400%_400%] animate-[gradientShift_8s_ease_infinite]">
      <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary/20 rounded-full animate-[float_6s_ease-in-out_infinite]"></div>
      <div className="absolute top-1/5 right-1/6 w-24 h-24 bg-primary/20 rounded-full animate-[float_6s_ease-in-out_infinite_2s]"></div>
      <div className="absolute bottom-1/5 left-1/6 w-24 h-24 bg-primary/20 rounded-full animate-[float_6s_ease-in-out_infinite_4s]"></div>
      <div className="max-w-6xl w-full animate-[fadeInUp_1s_ease-out]">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-br from-neutralDark to-neutral bg-clip-text text-transparent leading-tight">
          Master Frontend Interviews
          <br />
          <span className="text-4xl md:text-5xl lg:text-6xl opacity-90">
            with AI-Powered Practice
          </span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-text opacity-90 leading-relaxed">
          Practice real-world coding challenges, system design interviews, and
          DSA problems in a professional environment. Get instant feedback and
          improve your skills with our AI-powered evaluation system.
        </p>
        <div className="flex gap-6 flex-wrap justify-center mb-16">
          {user ? (
            <Link href="/problems" passHref legacyBehavior>
              <a className="px-8 py-4 rounded-full font-bold text-lg text-bodyBg bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/60 animate-[pulse_2s_infinite] relative overflow-hidden group">
                <span className="relative z-10">Start Practicing</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </a>
            </Link>
          ) : (
            <Link href="/login" passHref legacyBehavior>
              <a className="px-8 py-4 rounded-full font-bold text-lg text-bodyBg bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/60 animate-[pulse_2s_infinite] relative overflow-hidden group">
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </a>
            </Link>
          )}
          <Link href="/about" passHref legacyBehavior>
            <a className="px-8 py-4 rounded-full font-semibold text-lg text-text bg-transparent border-2 border-neutralDark transition-all duration-300 hover:bg-neutralDark hover:text-bodyBg hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral/30">
              Learn More
            </a>
          </Link>
        </div>
        <Stats />
      </div>
    </section>
  );
};

export default HeroSection;
