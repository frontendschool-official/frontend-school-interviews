# Tech Stack Summary

## Framework
- Next.js 14+ with App Router
- TypeScript
- Tailwind

## State Management
- Zustand store for interview config & answers

## Firebase Integration
- Firebase Auth (Google Sign-In)
- Firestore (stores sessions, answers, scores, problems)
- Firebase Storage (for snapshot uploads)
- Firebase Cloud Functions (for Gemini-generated solutions)

## AI (Gemini)
- Gemini Pro model via @google/generative-ai
- Used to:
  - Generate round structure
  - Create questions for each round
  - Evaluate answers and give scores/feedback
  - Generate Brute/Optimized/Best solutions

## Editors
- Monaco Editor + Sandpack for Code rounds
- Excalidraw for System Design
- Textarea for JS Q&A rounds
