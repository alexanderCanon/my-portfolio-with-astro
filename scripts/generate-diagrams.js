import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../src/content/projects');
const outputDir = path.join(__dirname, '../public/images/proyectos');

// Parser simple para extraer diagramMermaid del frontmatter de Markdown
function parseFrontmatter(content) {
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) return null;
  const yamlText = match[1];
  
  const lines = yamlText.split('\n');
  let diagramMermaid = null;
  let inDiagram = false;
  let diagramLines = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('diagramMermaid:')) {
      inDiagram = true;
      continue;
    }
    if (inDiagram) {
      if (line.startsWith('  ') || line.trim() === '') {
        diagramLines.push(line.slice(2)); // Quita los dos espacios de sangría
      } else {
        inDiagram = false;
      }
    }
  }
  
  if (diagramLines.length > 0) {
    diagramMermaid = diagramLines.join('\n').trim();
  }
  return { diagramMermaid };
}

async function generateSvg(slug, code) {
  const payload = JSON.stringify({
    code: code,
    mermaid: { theme: 'dark' }
  });
  const b64 = Buffer.from(payload).toString('base64');
  const url = `https://mermaid.ink/svg/${b64}`;
  
  console.log(`[+] Generando SVG para: ${slug}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const svg = await res.text();
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `${slug}-diagram.svg`);
    fs.writeFileSync(outputPath, svg);
    console.log(`[✓] Guardado en: ${outputPath}`);
  } catch (err) {
    console.error(`[✗] Error en ${slug}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(projectsDir)) {
    console.error(`[✗] Directorio no encontrado: ${projectsDir}`);
    return;
  }
  
  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));
  console.log(`Buscando diagramas en ${files.length} archivos Markdown...`);
  
  for (const file of files) {
    const filePath = path.join(projectsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseFrontmatter(content);
    
    if (meta && meta.diagramMermaid) {
      const slug = path.basename(file, '.md');
      await generateSvg(slug, meta.diagramMermaid);
    } else {
      console.log(`[-] Sin diagrama: ${file}`);
    }
  }
  console.log("Proceso completado.");
}

main();
