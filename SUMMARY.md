### Refactor Summary

- Introduced pnpm workspaces and modular packages: `packages/schemas`, `packages/api`, `packages/utils`, `packages/config`, `packages/ui`.
- Added unified, versioned `problemSchema` v1.0.0 in `packages/schemas` and types.
- Created Firestore repositories (`ProblemRepo`, `SimulationRepo`, `MockRepo`) enforcing server-side access policies.
- Implemented `pages/api/problems` and `[id]` using the new repos and schema with strict validation.
- Added scripts: `migrate_problems.ts`, `generate-openapi.ts`, `generate-postman.ts`, `health-check.ts`.
- Updated root scripts: `verify` runs lint, typecheck, build, and health checks (no Playwright/Vitest).
- Set up OpenAPI export (zod-to-openapi) and a minimal Postman collection.

How to run:
- Install deps: pnpm i
- Verify: pnpm verify
- Generate OpenAPI: pnpm openapi
- Generate Postman: pnpm postman
- Migrate existing problems: pnpm migrate:problems

