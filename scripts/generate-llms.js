import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'sleep');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'llms.txt');
const BASE_URL = 'https://qingchunzhuimeng-spec.github.io/sleep-knowledge-base';

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const yaml = match[1];
  const title = (yaml.match(/title:\s*(.+)/) || [])[1]?.trim();
  const description = (yaml.match(/description:\s*(.+)/) || [])[1]?.trim();
  const publish = (yaml.match(/publish:\s*(.+)/) || [])[1]?.trim();
  return { title, description, publish };
}

function generateLlmsTxt() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const entries = [];

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseFrontmatter(content);

    if (!meta || meta.publish !== 'true') continue;

    const slug = file.replace('.md', '').toLowerCase();
    const url = `${BASE_URL}/sleep/${slug}`;
    entries.push(`- [${meta.title}](${url}): ${meta.description}`);
  }

  const output = `# Body OS 健康知识库

> 系统化健康知识库,目前以科学睡眠为核心模块,饮食、运动等模块陆续更新

## 科学睡眠

${entries.join('\n')}
`;

  fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
  console.log(`Generated llms.txt with ${entries.length} entries`);
}

generateLlmsTxt();
