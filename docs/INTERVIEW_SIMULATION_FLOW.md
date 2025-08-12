# Interview Simulation Flow

## Overview

The interview simulation feature provides a realistic interview experience by following company-specific interview processes. Users select a target company and role level (SDE-1, SDE-2, SDE-3, etc.), and the system generates an interview process that matches that company's actual hiring process.

## How It Works

### 1. Company Selection
Users choose from top tech companies:
- **Google** - Hard difficulty, focus on algorithms and system design
- **Meta** - Hard difficulty, emphasis on coding and behavioral
- **Amazon** - Hard difficulty, strong focus on leadership principles
- **Microsoft** - Medium difficulty, balanced technical and cultural fit
- **Apple** - Hard difficulty, focus on innovation and user experience
- **Netflix** - Medium difficulty, culture and streaming-focused

### 2. Role Selection
Available roles with appropriate experience levels:
- **SDE-1** (Junior) - Entry-level software development
- **SDE-2** (Mid-level) - 2-4 years experience
- **SDE-3** (Senior) - 5+ years experience
- **Frontend Developer** - Frontend specialization
- **Full Stack Developer** - End-to-end development
- **Staff Engineer** - Technical leadership

### 3. Interview Process Generation
Based on the company and role selection, the system:
- Displays the actual interview rounds for that combination
- Shows estimated duration for each round
- Indicates the type of each round (DSA, Coding, System Design, Theory)
- Provides realistic timeline and expectations

### 4. Interview Execution
The system then:
- Creates an interview simulation document in Firebase
- Generates problems specific to each round type
- Navigates the user through rounds sequentially
- Tracks progress and provides feedback

## Company-Specific Interview Processes

### Google
- **SDE-1**: Phone screening, 2 coding rounds, behavioral
- **SDE-2**: Technical screening, 2 coding rounds, system design, behavioral
- **SDE-3**: 2 advanced coding rounds, system design, behavioral
- **Frontend**: Machine coding, DSA, frontend system design, behavioral

### Meta (Facebook)
- **SDE-1**: Recruiter screen, technical phone, 2 onsite coding, behavioral
- **SDE-2**: Technical screening, 2 coding rounds, system design, behavioral

### Amazon
- **SDE-1**: Phone screening, technical phone, 2 technical interviews, behavioral (LP)
- **SDE-2**: Technical screening, 2 technical interviews, system design, leadership principles
- **Frontend**: Technical screening, coding interview, frontend system design, leadership principles

### Microsoft
- **SDE-1**: Recruiter screening, technical phone, 2 coding interviews, behavioral
- **SDE-2**: Technical screening, coding interview, system design, behavioral
- **Frontend**: Technical screening, coding interview, frontend system design, behavioral

### Apple
- **SDE-1**: Phone screening, technical phone, 2 technical interviews, cultural
- **Frontend**: Technical screening, coding interview, design & implementation, cultural

### Netflix
- **SDE-2**: Technical screening, coding interview, system design, cultural
- **Frontend**: Technical screening (extended), frontend system design, cultural

## Round Types

### 1. DSA (Data Structures & Algorithms)
- Focus on algorithmic problem solving
- JavaScript/TypeScript implementation
- Time and space complexity analysis
- Common patterns: arrays, trees, graphs, dynamic programming

### 2. Machine Coding
- Build functional UI components
- React/TypeScript implementation
- Component architecture and state management
- Real-world coding problems

### 3. System Design
- Frontend architecture design
- Scalability and performance considerations
- Component libraries and design systems
- Real-time systems and data flow

### 4. Theory/Behavioral
- JavaScript/TypeScript concepts
- Company culture and values
- Leadership principles (Amazon)
- Past experience and problem-solving approach

## Technical Implementation

### Frontend (`pages/interview-simulation/index.tsx`)
- Multi-step wizard interface
- Company and role selection
- Interview process preview
- Integration with backend services

### Backend (`services/firebase.ts`, `services/interview-simulation.ts`)
- Interview simulation document creation
- Company-specific round configuration
- Problem generation and caching
- Progress tracking

### Key Features
- **Realistic Timing**: Each round has company-appropriate duration
- **Progressive Difficulty**: Rounds scale with role level
- **Company Authenticity**: Based on real interview experiences
- **Flexible Architecture**: Easy to add new companies and roles

## Usage

1. Navigate to `/interview-simulation`
2. Select target company
3. Choose appropriate role level
4. Review the interview process
5. Start the interview simulation

The system will guide you through each round, providing problems and evaluation tailored to your selections.