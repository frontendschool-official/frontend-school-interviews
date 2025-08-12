import { useState } from 'react';

interface PromptValues {
  designation: string;
  companies: string;
  round: string;
  interviewType:
    | 'coding'
    | 'design'
    | 'dsa'
    | 'theory'
    | 'behavioral/managerial';
}

interface PromptModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: PromptValues) => void;
}

export default function PromptModal({
  visible,
  onClose,
  onSubmit,
}: PromptModalProps) {
  const [values, setValues] = useState<PromptValues>({
    designation: 'Frontend Developer',
    companies: '',
    round: '',
    interviewType: 'coding',
  });

  const handleSubmit = () => {
    if (values.designation && values.companies && values.round) {
      onSubmit(values);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!visible) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-secondary p-10 rounded-3xl w-full max-w-lg border border-border shadow-2xl relative overflow-hidden'>
        {/* Top border accent */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-neutralDark'></div>

        <h2 className='text-3xl font-bold text-neutralDark text-center mb-8'>
          Interview Details
        </h2>

        <div className='space-y-6'>
          <div className='flex flex-col'>
            <label className='font-semibold text-text text-sm mb-2'>
              Job Title / Designation
            </label>
            <input
              type='text'
              placeholder='e.g., Frontend Developer, React Developer'
              value={values.designation}
              onChange={e =>
                setValues({ ...values, designation: e.target.value })
              }
              onKeyPress={handleKeyPress}
              className='p-4 border-2 border-border/50 rounded-xl bg-bodyBg text-text text-base transition-all duration-300 focus:outline-none focus:border-neutralDark focus:shadow-lg focus:shadow-neutral/20 placeholder:text-text/60'
            />
          </div>

          <div className='flex flex-col'>
            <label className='font-semibold text-text text-sm mb-2'>
              Companies (Optional)
            </label>
            <input
              type='text'
              placeholder='e.g., Google, Meta, Amazon'
              value={values.companies}
              onChange={e =>
                setValues({ ...values, companies: e.target.value })
              }
              onKeyPress={handleKeyPress}
              className='p-4 border-2 border-border/50 rounded-xl bg-bodyBg text-text text-base transition-all duration-300 focus:outline-none focus:border-neutralDark focus:shadow-lg focus:shadow-neutral/20 placeholder:text-text/60'
            />
          </div>

          <div className='flex flex-col'>
            <label className='font-semibold text-text text-sm mb-2'>
              Designation
            </label>
            <select
              value={values.round}
              onChange={e => setValues({ ...values, round: e.target.value })}
              className='p-4 border-2 border-border/50 rounded-xl bg-bodyBg text-text text-base cursor-pointer transition-all duration-300 focus:outline-none focus:border-neutralDark focus:shadow-lg focus:shadow-neutral/20'
            >
              <option value=''>Select Designation</option>
              <option value='SDE1'>SDE1 or L3</option>
              <option value='SDE2'>SDE2 or L4</option>
              <option value='SDE3'>SDE3 or L5</option>
              <option value='SDE4'>SDE4 or L6</option>
              <option value='Architect'>Architect or L6+</option>
            </select>
          </div>

          <div className='flex flex-col'>
            <label className='font-semibold text-text text-sm mb-2'>
              Interview Type
            </label>
            <select
              value={values.interviewType}
              onChange={e =>
                setValues({
                  ...values,
                  interviewType: e.target
                    .value as PromptValues['interviewType'],
                })
              }
              className='p-4 border-2 border-border/50 rounded-xl bg-bodyBg text-text text-base cursor-pointer transition-all duration-300 focus:outline-none focus:border-neutralDark focus:shadow-lg focus:shadow-neutral/20'
            >
              <option value='coding'>Machine Coding</option>
              <option value='design'>System Design</option>
              <option value='dsa'>DSA</option>
              <option value='theory'>Theory</option>
              <option value='behavioral/managerial'>
                Behavioral/Managerial
              </option>
            </select>
          </div>
        </div>

        <div className='flex gap-4 mt-8'>
          <button
            onClick={onClose}
            className='flex-1 p-4 border-2 border-border/50 rounded-xl bg-secondary text-text text-base font-semibold transition-all duration-300 hover:bg-bodyBg hover:border-border'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!values.designation || !values.round}
            className='flex-1 p-4 bg-primary text-white rounded-xl text-base font-semibold transition-all duration-300 hover:bg-accent hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          >
            Generate Interview
          </button>
        </div>
      </div>
    </div>
  );
}
