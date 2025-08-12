import React from 'react';

const Stats = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mx-auto'>
      <div className='text-center p-8 bg-secondary rounded-2xl border border-border transition-all duration-300 animate-[fadeInUp_1s_ease-out_0.2s_both] hover:-translate-y-1 hover:shadow-lg hover:shadow-border/40'>
        <div className='text-4xl font-extrabold text-primary mb-2'>500+</div>
        <div className='text-base text-text opacity-80'>Practice Problems</div>
      </div>
      <div className='text-center p-8 bg-secondary rounded-2xl border border-border transition-all duration-300 animate-[fadeInUp_1s_ease-out_0.4s_both] hover:-translate-y-1 hover:shadow-lg hover:shadow-border/40'>
        <div className='text-4xl font-extrabold text-primary mb-2'>50+</div>
        <div className='text-base text-text opacity-80'>
          System Design Challenges
        </div>
      </div>
      <div className='text-center p-8 bg-secondary rounded-2xl border border-border transition-all duration-300 animate-[fadeInUp_1s_ease-out_0.6s_both] hover:-translate-y-1 hover:shadow-lg hover:shadow-border/40'>
        <div className='text-4xl font-extrabold text-primary mb-2'>24/7</div>
        <div className='text-base text-text opacity-80'>AI Evaluation</div>
      </div>
    </div>
  );
};

export default Stats;
