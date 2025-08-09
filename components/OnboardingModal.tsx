import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { OnboardingData } from "../types/user";
import { FaGraduationCap, FaCode, FaChartLine, FaRocket } from "react-icons/fa";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    difficulty: "intermediate",
    focusAreas: [],
    dailyGoal: 30,
    experience: "mid",
    targetCompanies: [],
    preferredLanguages: [],
  });

  const steps = [
    {
      title: "Welcome!",
      description: "Let's personalize your learning experience",
      icon: FaRocket,
    },
    {
      title: "Experience Level",
      description: "Tell us about your background",
      icon: FaGraduationCap,
    },
    {
      title: "Technologies",
      description: "What technologies do you work with?",
      icon: FaCode,
    },
    {
      title: "Goals & Preferences",
      description: "What are your interview goals?",
      icon: FaChartLine,
    },
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner (0-1 years)" },
    { value: "intermediate", label: "Intermediate (1-3 years)" },
    { value: "advanced", label: "Advanced (3-5 years)" },
    { value: "expert", label: "Expert (5+ years)" },
  ];

  const technologies = [
    "React",
    "Vue.js",
    "Angular",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "Go",
    "Rust",
    "AWS",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
  ];

  const interviewGoals = [
    "Land a new job",
    "Improve technical skills",
    "Prepare for specific companies",
    "Learn new technologies",
    "Practice system design",
    "Master DSA",
  ];

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: keyof OnboardingData,
    value: string,
    checked: boolean
  ) => {
    const currentValues = formData[field] as string[];
    if (checked) {
      handleInputChange(field, [...currentValues, value]);
    } else {
      handleInputChange(
        field,
        currentValues.filter((v) => v !== value)
      );
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Save onboarding data to user profile
    if (user) {
      // TODO: Save to Firebase
      console.log("Saving onboarding data:", formData);
    }
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-secondary rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-text/80 text-lg">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8 gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < currentStep
                  ? "bg-primary"
                  : index === currentStep
                  ? "bg-accent"
                  : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="animate-slideIn">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <FaRocket className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text mb-4">
                  Welcome to Frontend School Interviews!
                </h3>
                <p className="text-text/80 leading-relaxed">
                  We're excited to help you prepare for your frontend
                  interviews. Let's customize your learning experience to match
                  your goals and experience level.
                </p>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FaGraduationCap className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-text">
                  Experience Level
                </h3>
              </div>

              <div className="space-y-4">
                {experienceLevels.map((level) => (
                  <label
                    key={level.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={level.value}
                      checked={formData.difficulty === level.value}
                      onChange={(e) =>
                        handleInputChange("difficulty", e.target.value)
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FaCode className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-text">
                  Technologies
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {technologies.map((tech) => (
                  <label
                    key={tech}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.focusAreas.includes(tech)}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "focusAreas",
                          tech,
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text">{tech}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FaChartLine className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-text">
                  Goals & Preferences
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-text mb-3">
                    Interview Goals (select all that apply)
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {interviewGoals.map((goal) => (
                      <label
                        key={goal}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.targetCompanies.includes(goal)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              "targetCompanies",
                              goal,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-text">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-text mb-3">
                    Daily Goal (minutes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={formData.dailyGoal}
                    onChange={(e) =>
                      handleInputChange("dailyGoal", parseInt(e.target.value))
                    }
                    className="w-full p-3 border border-border rounded-lg bg-bodyBg text-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-border rounded-lg text-text hover:bg-bodyBg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
            >
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
