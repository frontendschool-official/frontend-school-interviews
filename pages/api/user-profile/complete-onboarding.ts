import { NextApiRequest, NextApiResponse } from "next";
import { completeOnboarding } from "@/services/firebase/user-profile";
import { OnboardingData } from "@/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { uid, onboardingData } = req.body;

    if (!uid || !onboardingData) {
      return res.status(400).json({ 
        error: "Missing required fields: uid and onboardingData are required" 
      });
    }

    await completeOnboarding(uid, onboardingData as OnboardingData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ 
      error: "Failed to complete onboarding",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 