# Example Gemini Prompt

## Use Case: Generate Interview Rounds

Prompt:

> You're an expert frontend interview panelist. Given a company and SDE level, generate an appropriate interview structure with multiple rounds. Each round should be one of: Machine Coding, DSA, System Design, or JavaScript Theory. Output as JSON.

Input:
```json
{
  "company": "Google",
  "role": "SDE2"
}
```

Output:
```json
[
  { "type": "JavaScript", "title": "Core JS Concepts & Tricky Qs" },
  { "type": "DSA", "title": "Algorithms + Edge Cases" },
  { "type": "System Design", "title": "Design a Notification System" },
  { "type": "Machine Coding", "title": "Build a Live Markdown Previewer" }
]
```
