import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const collection = {
  info: {
    name: 'Interview Platform API',
    schema:
      'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [
    {
      name: 'List Public Problems',
      request: {
        method: 'GET',
        url: '{{baseUrl}}/api/problems?visibility=public',
      },
    },
  ],
};

const out = join(process.cwd(), 'postman_collection.json');
writeFileSync(out, JSON.stringify(collection, null, 2));
console.log(`Postman collection generated at ${out}`);
