import React, { useState } from 'react';
import { useRouter } from 'next/router';



const Pricing: React.FC = () => {
  const router = useRouter();

  const plans = [
    {
      name: 'Monthly',
      price: '₹999',
      period: 'per month',
      features: [
        'Unlimited DSA Problems',
        'Machine Coding Challenges',
        'System Design Problems',
        'Mock Interview Sessions',
        'Progress Tracking',
        'Community Support'
      ],
      isPopular: false
    },
    {
      name: 'Yearly',
      price: '₹4,999',
      period: 'per year',
      savings: 'Save ₹6,989 (58% off)',
      features: [
        'Everything in Monthly',
        'Priority Support',
        'Advanced Analytics',
        'Custom Study Plans',
        'Interview Preparation Guides',
        'Resume Review Service'
      ],
      isPopular: true
    },
    {
      name: 'Lifetime',
      price: '₹9,999',
      period: 'one-time payment',
      savings: 'Best Value',
      features: [
        'Everything in Yearly',
        'Lifetime Access',
        'All Future Updates',
        'Premium Content Access',
        '1-on-1 Mentoring Sessions',
        'Job Placement Assistance'
      ],
      isPopular: false
    }
  ];



  return (
    <section className="py-24 px-8 bg-bodyBg relative overflow-hidden bg-gradient-to-br from-neutral/5 via-neutralLight/5 to-neutral/5 bg-[length:400%_400%] animate-[gradientShift_8s_ease_infinite]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-text animate-[fadeInUp_1s_ease-out]">Choose Your Plan</h2>
        <p className="text-xl text-center mb-16 text-text opacity-80 max-w-2xl mx-auto animate-[fadeInUp_1s_ease-out_0.2s_both]">
          Start your interview preparation journey with our comprehensive plans. 
          Choose the one that fits your goals and timeline.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {plans.map((plan, index) => (
            <div 
              key={plan.name} 
              className={`bg-secondary border-2 rounded-2xl p-10 text-center relative transition-all duration-300 animate-[fadeInUp_1s_ease-out] hover:-translate-y-2 hover:shadow-xl hover:shadow-border/30 ${
                plan.isPopular 
                  ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary scale-105 z-10 hover:scale-105 hover:-translate-y-2' 
                  : 'border-border'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-bodyBg px-6 py-2 rounded-full text-sm font-semibold animate-[pulse_2s_infinite]">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-4 text-text">{plan.name}</h3>
              <div className="text-5xl font-extrabold text-primary mb-2">{plan.price}</div>
              <div className="text-base text-text opacity-70 mb-8">{plan.period}</div>
              
              {plan.savings && (
                <div className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8 inline-block">
                  {plan.savings}
                </div>
              )}
              
              <ul className="list-none p-0 m-0 mb-8 text-left">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="py-3 text-text flex items-center gap-3 before:content-['✓'] before:text-primary before:font-bold before:text-xl">
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => router.push('/premium')}
                className="w-full py-4 px-8 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-primary text-bodyBg hover:bg-accent hover:-translate-y-1"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 p-8 bg-secondary rounded-2xl border border-border animate-[fadeInUp_1s_ease-out_0.6s_both]">
          <h4 className="text-xl font-semibold mb-2 text-text">30-Day Money-Back Guarantee</h4>
          <p className="text-text opacity-80 m-0">
            Not satisfied? Get a full refund within 30 days. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
