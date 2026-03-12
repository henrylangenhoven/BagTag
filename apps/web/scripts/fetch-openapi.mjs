import { mkdir, writeFile } from 'node:fs/promises';
import prettier from 'prettier';

const docsUrl = process.env.API_DOCS_URL ?? 'http://localhost:8080/v3/api-docs';
const outputPath = new URL('../../openapi/bagtag-api.json', import.meta.url);

const response = await fetch(docsUrl);

if (!response.ok) {
  throw new Error(`Failed to fetch OpenAPI docs from ${docsUrl}: ${response.status}`);
}

const document = await response.json();
const formattedDocument = await prettier.format(JSON.stringify(document), {
  parser: 'json',
});

await mkdir(new URL('../../openapi/', import.meta.url), { recursive: true });
await writeFile(outputPath, formattedDocument, 'utf8');

console.log(`Fetched OpenAPI docs from ${docsUrl}`);
