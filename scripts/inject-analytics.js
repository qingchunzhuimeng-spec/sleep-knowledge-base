import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const BAIDU_TONGJI_SCRIPT = `<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?fed11049e9362d458ea9179496895802";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>`;

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

function injectAnalytics() {
  const htmlFiles = walkDir(PUBLIC_DIR);
  let count = 0;

  for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('hm.baidu.com')) continue;

    if (content.includes('</head>')) {
      content = content.replace('</head>', `${BAIDU_TONGJI_SCRIPT}\n</head>`);
      fs.writeFileSync(filePath, content, 'utf-8');
      count++;
    }
  }

  console.log(`Injected Baidu Tongji into ${count} html files`);
}

injectAnalytics();
