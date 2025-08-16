import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { problemSchema } from '@workspace/schemas';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const registry = new OpenAPIRegistry();
registry.register('Problem', problemSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
  openapi: '3.0.0',
  info: { title: 'Interview Platform API', version: '1.0.0' },
  servers: [{ url: 'https://example.com' }],
});

const out = join(process.cwd(), 'openapi.yaml');
writeFileSync(out, JSON.stringify(doc, null, 2));
console.log(`OpenAPI generated at ${out}`);
