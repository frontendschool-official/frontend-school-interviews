export const useRoadmapUI = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-600 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "dsa":
        return "DSA";
      case "machine_coding":
        return "Machine Coding";
      case "system_design":
        return "System Design";
      case "theory_and_debugging":
        return "Theory";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dsa":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "machine_coding":
        return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      case "system_design":
        return "bg-orange-500/20 text-orange-600 border-orange-500/30";
      case "theory_and_debugging":
        return "bg-indigo-500/20 text-indigo-600 border-indigo-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30";
    }
  };

  return {
    getDifficultyColor,
    getTypeLabel,
    getTypeColor,
  };
}; 