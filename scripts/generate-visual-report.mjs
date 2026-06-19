import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC_DIR = join(ROOT, 'src');
const OUTPUT_DIR = join(ROOT, 'visual-report');
const IMAGES_DIR = join(OUTPUT_DIR, 'images');

const passed = process.env.VISUAL_TEST_PASSED !== 'false';

function walkScreenshots(dir, files = []) {
  if (!existsSync(dir)) {
    return files;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      walkScreenshots(fullPath, files);
      continue;
    }

    if (!entry.name.endsWith('.png')) {
      continue;
    }

    if (/-(?:actual|diff|reference)\.png$/.test(entry.name)) {
      continue;
    }

    if (!/-(?:chromium|firefox|webkit)-(?:aix|darwin|freebsd|linux|openbsd|sunos|win32)\.png$/.test(entry.name)) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function toAttachmentPath(referencePath) {
  const relativeReference = relative(ROOT, referencePath);
  const match = relativeReference.match(
    /^src\/(.+)\/__screenshots__\/([^/]+)\/(.+)\.png$/,
  );

  if (!match) {
    return null;
  }

  const [, testFileDirectory, testFileName, snapshotFileName] = match;

  return {
    testFileDirectory,
    testFileName,
    snapshotFileName,
    actual: join(
      ROOT,
      '.vitest-attachments',
      testFileDirectory,
      testFileName,
      `${snapshotFileName}-actual.png`,
    ),
    diff: join(
      ROOT,
      '.vitest-attachments',
      testFileDirectory,
      testFileName,
      `${snapshotFileName}-diff.png`,
    ),
  };
}

function slugify(value) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/-+/g, '-');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function copyImage(sourcePath, destinationName) {
  const destinationPath = join(IMAGES_DIR, destinationName);
  copyFileSync(sourcePath, destinationPath);
  return `images/${destinationName}`;
}

function collectCases() {
  const references = walkScreenshots(SRC_DIR);

  return references.map((referencePath, index) => {
    const attachment = toAttachmentPath(referencePath);
    const id = `case-${index + 1}`;
    const testLabel = attachment?.testFileName ?? basename(referencePath);
    const snapshotLabel = attachment?.snapshotFileName ?? basename(referencePath, '.png');
    const hasActual = attachment ? existsSync(attachment.actual) : false;
    const hasDiff = attachment ? existsSync(attachment.diff) : false;
    const status = hasActual ? 'failed' : 'passed';

    const imageBase = slugify(`${testLabel}-${snapshotLabel}`);
    const images = {
      reference: copyImage(referencePath, `${imageBase}-reference.png`),
    };

    if (hasActual) {
      images.actual = copyImage(attachment.actual, `${imageBase}-actual.png`);
    }

    if (hasDiff) {
      images.diff = copyImage(attachment.diff, `${imageBase}-diff.png`);
    }

    return {
      id,
      status,
      testLabel,
      snapshotLabel,
      referencePath: relative(ROOT, referencePath),
      images,
    };
  });
}

function renderCase(caseItem) {
  const statusLabel = caseItem.status === 'passed' ? 'Passed' : 'Failed';
  const statusClass =
    caseItem.status === 'passed' ? 'status-passed' : 'status-failed';

  const panels = [
    `<figure class="panel">
      <figcaption>Baseline</figcaption>
      <img src="${caseItem.images.reference}" alt="Baseline screenshot for ${escapeHtml(caseItem.snapshotLabel)}" loading="lazy" />
    </figure>`,
  ];

  if (caseItem.images.actual) {
    panels.push(`<figure class="panel">
      <figcaption>Actual</figcaption>
      <img src="${caseItem.images.actual}" alt="Actual screenshot for ${escapeHtml(caseItem.snapshotLabel)}" loading="lazy" />
    </figure>`);
  }

  if (caseItem.images.diff) {
    panels.push(`<figure class="panel">
      <figcaption>Diff</figcaption>
      <img src="${caseItem.images.diff}" alt="Diff screenshot for ${escapeHtml(caseItem.snapshotLabel)}" loading="lazy" />
    </figure>`);
  }

  return `<section class="case" id="${caseItem.id}">
    <header class="case-header">
      <div>
        <h2>${escapeHtml(caseItem.testLabel)}</h2>
        <p class="case-meta">${escapeHtml(caseItem.snapshotLabel)}</p>
      </div>
      <span class="status ${statusClass}">${statusLabel}</span>
    </header>
    <div class="panel-grid ${panels.length === 1 ? 'panel-grid--single' : ''}">
      ${panels.join('\n')}
    </div>
  </section>`;
}

function renderHtml(cases) {
  const failedCount = cases.filter((caseItem) => caseItem.status === 'failed').length;
  const passedCount = cases.length - failedCount;
  const overallStatus = failedCount > 0 || !passed ? 'failed' : 'passed';
  const headline =
    overallStatus === 'passed'
      ? 'All visual regression checks passed'
      : 'Visual differences detected';
  const generatedAt = new Date().toISOString();

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Visual Regression Report</title>
    <style>
      :root {
        color-scheme: light dark;
        --bg: #f6f7f9;
        --card: #ffffff;
        --text: #172033;
        --muted: #5b6475;
        --border: #d8dee8;
        --passed: #0f766e;
        --failed: #b42318;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #0f141d;
          --card: #171d27;
          --text: #edf2f7;
          --muted: #9aa4b2;
          --border: #2a3342;
        }
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: Inter, system-ui, sans-serif;
        line-height: 1.5;
      }

      main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px 20px 48px;
      }

      .hero {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
      }

      .hero h1 {
        margin: 0 0 8px;
        font-size: 1.75rem;
      }

      .hero p {
        margin: 0;
        color: var(--muted);
      }

      .summary {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 20px;
      }

      .summary-item {
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 0.95rem;
      }

      .case {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .case-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: start;
        margin-bottom: 16px;
      }

      .case-header h2 {
        margin: 0;
        font-size: 1.1rem;
      }

      .case-meta {
        margin: 4px 0 0;
        color: var(--muted);
        font-size: 0.92rem;
      }

      .status {
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 0.85rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .status-passed {
        background: rgb(15 118 110 / 0.12);
        color: var(--passed);
      }

      .status-failed {
        background: rgb(180 35 24 / 0.12);
        color: var(--failed);
      }

      .panel-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      .panel-grid--single {
        grid-template-columns: minmax(240px, 390px);
      }

      .panel {
        margin: 0;
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
        background: #fff;
      }

      .panel figcaption {
        padding: 8px 12px;
        font-size: 0.85rem;
        color: var(--muted);
        border-bottom: 1px solid var(--border);
      }

      .panel img {
        display: block;
        width: 100%;
        height: auto;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <h1>${escapeHtml(headline)}</h1>
        <p>Generated at ${escapeHtml(generatedAt)}</p>
        <div class="summary">
          <span class="summary-item">Total: ${cases.length}</span>
          <span class="summary-item">Passed: ${passedCount}</span>
          <span class="summary-item">Failed: ${failedCount}</span>
        </div>
      </section>
      ${cases.map(renderCase).join('\n')}
    </main>
  </body>
</html>`;
}

function main() {
  mkdirSync(IMAGES_DIR, { recursive: true });

  const cases = collectCases();

  if (cases.length === 0) {
    writeFileSync(
      join(OUTPUT_DIR, 'index.html'),
      `<!doctype html>
<html lang="ja">
  <head><meta charset="utf-8" /><title>Visual Regression Report</title></head>
  <body><main><h1>No screenshot baselines found</h1></main></body>
</html>`,
    );
    console.log('No screenshot baselines found.');
    return;
  }

  const html = renderHtml(cases);
  writeFileSync(join(OUTPUT_DIR, 'index.html'), html);
  writeFileSync(
    join(OUTPUT_DIR, 'report.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        passed,
        cases: cases.map(({ status, testLabel, snapshotLabel, referencePath }) => ({
          status,
          testLabel,
          snapshotLabel,
          referencePath,
        })),
      },
      null,
      2,
    ),
  );

  console.log(`Visual report generated at ${relative(ROOT, OUTPUT_DIR)}`);
}

main();
