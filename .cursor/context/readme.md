# Frontend School Interviews

An AI-powered frontend interview simulation platform built with Next.js 14+, TypeScript, Tailwind CSS, Firebase, and Gemini API.

## Features
- Simulates real interview drives from companies like Google, Amazon, Uber, etc.
- Supports Machine Coding, DSA, System Design, and JavaScript Theory rounds.
- Uses Gemini API to generate questions, analyze answers, and provide feedback.
- Authenticated with Firebase (Google Sign-In).
- Firestore stores sessions, answers, scores, and problem sets.
- Uses Zustand for interview state.
- Monaco + Sandpack editor for code; Excalidraw for system design.

## Key Pages
- `/` (Landing)
- `/login` (Google Auth)
- `/configure` (Select company & role)
- `/interview` (Multi-round simulation)
- `/result` (Score breakdown & recommendations)
- `/history` (Past interviews)
- `/problems` (Explore question bank)
- `/dashboard` (User stats & leaderboard)

## Technologies
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **State**: Zustand
- **Editor**: Monaco + Sandpack
- **System Design**: Excalidraw
- **Auth & DB**: Firebase
- **AI**: Google Gemini API
