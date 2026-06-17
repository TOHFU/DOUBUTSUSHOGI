import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FILE_KEY = 'pcGYJj4V7ruOEGSW7MiJvK';

function getToken() {
  const mcpPath = path.join(ROOT, '.cursor/mcp.json');
  const raw = JSON.parse(fsSync.readFileSync(mcpPath, 'utf8'));
  const arg = raw.mcpServers.Framelink_Figma_MCP.args.find((a) =>
    a.startsWith('--figma-api-key='),
  );
  if (!arg) throw new Error('Figma API key not found in .cursor/mcp.json');
  return arg.split('=')[1];
}

const TOKEN = getToken();

async function figmaApi(endpoint, retries = 8) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const res = await fetch(`https://api.figma.com/v1${endpoint}`, {
      headers: { 'X-Figma-Token': TOKEN },
    });
    if (res.status === 429) {
      const waitMs = (attempt + 1) * 10000;
      console.warn(`Rate limited, retry in ${waitMs / 1000}s...`);
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }
    if (!res.ok) {
      throw new Error(`${endpoint} -> ${res.status} ${await res.text()}`);
    }
    return res.json();
  }
  throw new Error(`Rate limited: ${endpoint}`);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${dest}: ${res.status}`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function exportNodes(nodeMap, scale = 2) {
  const ids = Object.keys(nodeMap).join(',');
  const images = await figmaApi(
    `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=${scale}`,
  );
  for (const [id, filePath] of Object.entries(nodeMap)) {
    const url = images.images[id];
    if (!url) {
      console.warn(`No image for ${id} (${filePath})`);
      continue;
    }
    await download(url, path.join(ROOT, 'public', filePath));
    console.log(`saved ${filePath}`);
    await new Promise((r) => setTimeout(r, 300));
  }
}

const PIECE_MAP = {
  ライオン: 'lion',
  キリン: 'giraffe',
  ゾウ: 'elephant',
  ヒヨコ: 'chick',
  ひよこ: 'chick',
  ニワトリ: 'chicken',
};

function parsePieceComponent(name) {
  const owner = name.includes('あお') ? 'blue' : 'green';
  const kind = Object.entries(PIECE_MAP).find(([jp]) => name.includes(jp))?.[1];
  return kind ? { owner, kind } : null;
}

async function findResultMessageNodeIds() {
  const file = await figmaApi(`/files/${FILE_KEY}?depth=2`);
  const frames = {};
  for (const page of file.document.children) {
    for (const child of page.children ?? []) {
      if (child.type === 'FRAME') {
        frames[child.name] = child.id;
      }
    }
  }

  async function findMessageFrame(frameId) {
    const nodes = await figmaApi(`/files/${FILE_KEY}/nodes?ids=${frameId}&depth=3`);
    const root = nodes.nodes[frameId].document;
    const message =
      root.children?.find((child) =>
        /message|WIN|LOSE|RETRY/i.test(child.name),
      ) ??
      root.children?.find((child) => child.type === 'FRAME' && child.name !== 'board');
    return message?.id ?? null;
  }

  return {
    youWin: frames['YOU WIN'] ? await findMessageFrame(frames['YOU WIN']) : null,
    youLose: frames['YOU LOSE'] ? await findMessageFrame(frames['YOU LOSE']) : null,
  };
}

async function exportInitialBoardLayout() {
  const componentsRes = await figmaApi(`/files/${FILE_KEY}/components`);
  const compNames = Object.fromEntries(
    componentsRes.meta.components.map((c) => [c.node_id.replace('-', ':'), c.name]),
  );

  const nodes = await figmaApi(`/files/${FILE_KEY}/nodes?ids=19:76&depth=4`);
  const board = nodes.nodes['19:76'].document;
  const squares = board.children.filter((c) => c.name === 'square');
  const layout = [];

  for (let i = 0; i < squares.length; i += 1) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const pieceNode = squares[i].children?.find((c) => c.name === 'piece');
    let cell = null;
    if (pieceNode?.componentId) {
      const compName = compNames[pieceNode.componentId] ?? '';
      const parsed = parsePieceComponent(compName);
      if (parsed) cell = parsed;
    }
    layout.push({ row, col, cell });
  }

  await fs.writeFile(
    path.join(ROOT, 'src/domain/game/initial-board.json'),
    JSON.stringify(layout, null, 2),
  );
  console.log('wrote initial-board.json');
}

async function exportResultMessages() {
  const ids = await findResultMessageNodeIds();
  const exports = {};
  if (ids.youWin) exports[ids.youWin] = 'assets/game/ui/you-win-message.png';
  if (ids.youLose) exports[ids.youLose] = 'assets/game/ui/you-lose-message.png';
  if (Object.keys(exports).length === 0) {
    console.warn('Result message nodes not found');
    return;
  }
  await exportNodes(exports);
}

async function exportResultLayout() {
  const layout = {};
  for (const [frameId, key] of [
    ['54:69', 'youWin'],
    ['54:159', 'youLose'],
  ]) {
    const nodes = await figmaApi(
      `/files/${FILE_KEY}/nodes?ids=${frameId}&depth=4`,
    );
    const root = nodes.nodes[frameId].document;
    const frameBox = root.absoluteBoundingBox;
    const message =
      root.children?.find((c) => /message|YOU WIN|YOU LOSE/i.test(c.name)) ??
      null;
    const retry =
      root.children?.find((c) => /retry|button/i.test(c.name)) ??
      root.children
        ?.flatMap((c) => c.children ?? [])
        .find((c) => /retry|button/i.test(c.name)) ??
      null;

    if (message?.absoluteBoundingBox && retry?.absoluteBoundingBox) {
      const mb = message.absoluteBoundingBox;
      const rb = retry.absoluteBoundingBox;
      layout[key] = {
        message: {
          width: Math.round(mb.width),
          height: Math.round(mb.height),
          x: Math.round(mb.x - frameBox.x),
          y: Math.round(mb.y - frameBox.y),
        },
        retry: {
          width: Math.round(rb.width),
          height: Math.round(rb.height),
          top: Math.round(rb.y - mb.y),
          left: Math.round(rb.x - mb.x),
          rotation: retry.rotation ?? 0,
        },
      };
    }
  }

  await fs.writeFile(
    path.join(ROOT, 'src/components/game/result-overlay-layout.json'),
    JSON.stringify(layout, null, 2),
  );
  console.log('wrote result-overlay-layout.json', layout);
}

async function main() {
  const skipLayout = process.argv.includes('--images-only');
  const overlayOnly = process.argv.includes('--overlay-only');
  const chickOnly = process.argv.includes('--chick-only');
  const exportLayout = process.argv.includes('--export-result-layout');

  if (exportLayout) {
    await exportResultLayout();
    return;
  }

  if (chickOnly) {
    for (const [id, filePath] of [
      ['19:16', 'assets/game/pieces/green/chick.png'],
      ['19:61', 'assets/game/pieces/blue/chick.png'],
    ]) {
      await exportNodes({ [id]: filePath });
      await new Promise((r) => setTimeout(r, 5000));
    }
    return;
  }

  if (overlayOnly) {
    await exportResultMessages();
    return;
  }

  const exports = {
    '22:175': 'assets/game/ui/stage.png',
    '22:198': 'assets/game/ui/background-green.png',
    '22:201': 'assets/game/ui/background-blue.png',
    '22:199': 'assets/game/ui/team-green.png',
    '22:202': 'assets/game/ui/team-blue.png',
    '52:60': 'assets/game/ui/select.png',
    '20:172': 'assets/game/ui/game-start-overlay.png',
    '54:69': 'assets/game/ui/you-win.png',
    '54:159': 'assets/game/ui/you-lose.png',
    '55:236': 'assets/game/ui/retry-button.png',
    // piece components (transparent component export)
    '18:2': 'assets/game/pieces/green/lion.png',
    '19:55': 'assets/game/pieces/blue/lion.png',
    '18:4': 'assets/game/pieces/green/giraffe.png',
    '19:52': 'assets/game/pieces/blue/giraffe.png',
    '18:12': 'assets/game/pieces/green/elephant.png',
    '19:58': 'assets/game/pieces/blue/elephant.png',
    '19:16': 'assets/game/pieces/green/chick.png',
    '19:61': 'assets/game/pieces/blue/chick.png',
    '19:20': 'assets/game/pieces/green/chicken.png',
    '19:49': 'assets/game/pieces/blue/chicken.png',
    '22:232': 'assets/game/ui/piece-you-have-base.png',
  };

  if (!skipLayout) {
    await exportInitialBoardLayout();
  }

  // Batch image exports to reduce rate limiting
  const entries = Object.entries(exports);
  for (let i = 0; i < entries.length; i += 4) {
    await exportNodes(Object.fromEntries(entries.slice(i, i + 4)));
    await new Promise((r) => setTimeout(r, 3000));
  }

  await exportResultMessages();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
