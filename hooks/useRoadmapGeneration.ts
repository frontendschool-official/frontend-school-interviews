import { useState } from "react";
import { useAuth } from "./useAuth";
import { RoadmapRequest, RoadmapGenerationState, Roadmap } from "@/types/roadmap";

export const useRoadmapGeneration = () => {
  const { user } = useAuth();
  const [state, setState] = useState<RoadmapGenerationState>({
    loading: false,
    error: null,
    roadmap: null,
  });

  const generateRoadmap = async (values: RoadmapRequest): Promise<Roadmap | null> => {
    if (!user) {
      setState({ loading: false, error: "User must be authenticated", roadmap: null });
      return null;
    }

    setState({ loading: true, error: null, roadmap: null });

    try {
      console.log("🚀 Starting roadmap generation with values:", values);

      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate roadmap");
      }

      const result = await response.json();
      console.log("✅ Generated roadmap:", result);

      if (!result.success || !result.roadmap) {
        throw new Error("Roadmap generation returned invalid response");
      }

      setState({ loading: false, error: null, roadmap: result.roadmap });
      return result.roadmap;
    } catch (error) {
      console.error("❌ Error generating roadmap:", error);
      
      let errorMessage = "Failed to generate roadmap";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (error.message.includes("AI service error")) {
          errorMessage = "AI service error: Unable to generate roadmap. Please try again.";
        } else if (error.message.includes("Invalid response format")) {
          errorMessage = "Invalid response format from AI service. Please try again.";
        } else if (error.message.includes("network") || error.message.includes("unavailable")) {
          errorMessage = "Network error: Please check your internet connection and try again.";
        }
      }
      
      setState({ loading: false, error: errorMessage, roadmap: null });
      return null;
    }
  };

  const resetState = () => {
    setState({ loading: false, error: null, roadmap: null });
  };

  return {
    ...state,
    generateRoadmap,
    resetState,
  };
}; 