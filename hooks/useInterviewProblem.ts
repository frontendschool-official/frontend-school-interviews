import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ParsedProblemData } from "../types/problem";
import { ErrorState } from "../container/interviews/interviews.types";

export const useInterviewProblem = () => {
  const router = useRouter();
  const { id } = router.query;
  const [problem, setProblem] = useState<ParsedProblemData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const fetchProblem = async () => {
    if (!id || Array.isArray(id)) {
      setError({
        type: "not_found",
        message: "Invalid problem ID provided.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/problems/get-by-id?id=${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError({
            type: "not_found",
            message: "Problem not found. It may have been deleted or the link is incorrect.",
          });
        } else if (response.status === 403) {
          setError({
            type: "unauthorized",
            message: "You do not have permission to access this problem.",
          });
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();
      if (data.success && data.problem) {
        setProblem(data.problem);
      } else {
        setError({
          type: "not_found",
          message: "Problem not found. It may have been deleted or the link is incorrect.",
        });
      }
    } catch (err) {
      console.error("Error fetching problem:", err);

      if (err instanceof Error) {
        if (
          err.message.includes("permission") ||
          err.message.includes("unauthorized")
        ) {
          setError({
            type: "unauthorized",
            message: "You do not have permission to access this problem.",
          });
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          setError({
            type: "network",
            message:
              "Network error. Please check your internet connection and try again.",
          });
        } else {
          setError({
            type: "unknown",
            message:
              "An unexpected error occurred while loading the problem. Please try again.",
          });
        }
      } else {
        setError({
          type: "unknown",
          message:
            "An unexpected error occurred while loading the problem. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    fetchProblem();
  };

  useEffect(() => {
    if (id) {
      fetchProblem();
    }
  }, [id]);

  return {
    problem,
    loading,
    error,
    retry,
  };
}; 