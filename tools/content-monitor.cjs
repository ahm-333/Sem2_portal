#!/usr/bin/env node

/**
 * Scheduled Google Drive Content Monitor for Sem2_portal (Mode C)
 * Obeying AGENTS.md and .agents/roles/content-gdrive-monitor.md
 */

const fs = require('fs');
const path = require('path');

const UPSTREAM_REPO = 'ahm-333/Sem2_portal';
const FORK_REPO = 'Eyad-Ahmed-Kamal/Sem2_portal';
const MAINTAINERS = ['Eyad-Ahmed-Kamal', 'ahm-333'];

const _DRIVE_FOLDERS = [
  { name: 'ZU-FCI Batch Archive', id: '11q-xu1rb5IoIE-lL1pMjHXqfut9Tq2hU' },
  { name: 'FCI_ZU_Second_General_2.1', id: '1MxVs9lG3padasbAwGsN1md-VmIf4NrdX' },
  { name: 'ZU-FCI Sections', id: '1QLwePQh_D3P7XXZ9J7Dbzo0WvsVcY3nB' }
];

function getGhToken() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  if (process.env.GITHUB_TOKEN_FILE && fs.existsSync(process.env.GITHUB_TOKEN_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(process.env.GITHUB_TOKEN_FILE, 'utf-8'));
      return data.access_token;
    } catch (_) {}
  }
  return null;
}

async function githubApi(endpoint, options = {}) {
  const token = getGhToken();
  const url = `https://api.github.com/${endpoint}`;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'Sem2-Content-Monitor',
      ...(token ? { 'Authorization': `token ${token}` } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API error ${res.status} for ${endpoint}: ${errorText}`);
  }
  return await res.json();
}

async function checkOpenDiscoveryIssues() {
  const repos = [UPSTREAM_REPO, FORK_REPO];
  const discoveryIssues = [];
  const pendingActions = [];

  for (const repo of repos) {
    try {
      console.log(`[Mode C] Checking open issues in ${repo}...`);
      const issues = await githubApi(`repos/${repo}/issues?state=open&per_page=100`);
      const matches = issues.filter(i => 
        i.title.startsWith('[Content Discovery]') || 
        (i.labels && i.labels.some(l => l.name === 'content-approval-needed'))
      );

      console.log(`[Mode C] Found ${matches.length} open content discovery issues in ${repo}.`);
      discoveryIssues.push(...matches);

      for (const issue of matches) {
        console.log(`  Checking ${repo} #${issue.number}: ${issue.title}`);
        const comments = await githubApi(`repos/${repo}/issues/${issue.number}/comments`);
        const maintainerComments = comments.filter(c => MAINTAINERS.includes(c.user.login));

        if (maintainerComments.length > 0) {
          const latestComment = maintainerComments[maintainerComments.length - 1];
          console.log(`    -> Authorized reply from @${latestComment.user.login} found!`);
          pendingActions.push({
            repo,
            issueNumber: issue.number,
            title: issue.title,
            maintainer: latestComment.user.login,
            instruction: latestComment.body,
            updatedAt: latestComment.updated_at
          });
        } else {
          console.log(`    -> Still waiting for maintainer instructions from ${MAINTAINERS.join(' or ')}.`);
        }
      }
    } catch (err) {
      console.warn(`[Mode C] Warning while checking ${repo}:`, err.message);
    }
  }

  return { discoveryIssues, pendingActions };
}

function scanLocalTrackedMaterials() {
  const code = fs.readFileSync(path.join(__dirname, '../js/courses-data.js'), 'utf-8');
  const window = {};
  const fn = new Function('window', code + '; return { COURSES_DATA };');
  const { COURSES_DATA } = fn(window);

  const tracked = new Map();
  for (const course of COURSES_DATA) {
    const list = [];
    for (const lec of (course.lectures || [])) {
      list.push({ title: lec.title, driveId: lec.driveId, number: lec.number });
    }
    tracked.set(course.id, { name: course.name, lectures: list });
  }
  return tracked;
}

async function runCycle() {
  const timestamp = new Date().toISOString();
  console.log(`\n======================================================`);
  console.log(`[Mode C Cycle] Started at ${timestamp}`);
  console.log(`======================================================`);

  // Step 1: Check GitHub Issues & Maintainer comments
  const { discoveryIssues, pendingActions } = await checkOpenDiscoveryIssues();

  if (pendingActions.length > 0) {
    console.log(`\n[Mode C] ${pendingActions.length} actions ready for execution:`);
    for (const act of pendingActions) {
      console.log(`- Issue #${act.issueNumber} instructions from @${act.maintainer}`);
      console.log(`  Instructions snippet: ${act.instruction.slice(0, 100).replace(/\n/g, ' ')}...`);
    }
  } else {
    console.log(`\n[Mode C] No pending maintainer instructions to execute.`);
  }

  // Step 2: Check local tracked materials
  const tracked = scanLocalTrackedMaterials();
  console.log(`\n[Mode C] Scanned tracked courses: ${tracked.size} courses in js/courses-data.js`);

  console.log(`[Mode C Cycle] Completed successfully.\n`);
  return { discoveryIssues, pendingActions, tracked };
}

async function runDaemon(intervalSeconds = 3600) {
  console.log(`[Mode C Daemon] Starting recurring loop every ${intervalSeconds} seconds (${intervalSeconds / 3600} hours)...`);
  while (true) {
    try {
      await runCycle();
    } catch (err) {
      console.error('[Mode C Daemon Error]', err);
    }
    console.log(`[Mode C Daemon] Sleeping for ${intervalSeconds}s until next check...`);
    await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
  }
}

if (require.main === module) {
  const isDaemon = process.argv.includes('--daemon');
  if (isDaemon) {
    runDaemon(3600);
  } else {
    runCycle().catch(err => {
      console.error('[Mode C Error]', err);
      process.exit(1);
    });
  }
}

module.exports = { runCycle, runDaemon, checkOpenDiscoveryIssues, scanLocalTrackedMaterials };
