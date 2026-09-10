/**
 * Utilities for Mermaid diagram formatting, validation, and conversion
 * between swimlane-beta (Mermaid v11.16+) and classic flowchart subgraphs.
 */

export function convertSwimlaneToClassicFlowchart(code: string): string {
  let lines = code.split('\n');
  let direction = 'TB';

  // Check direction from first line
  const firstLine = lines.find(l => l.trim().startsWith('swimlane-beta'));
  if (firstLine) {
    const parts = firstLine.trim().split(/\s+/);
    if (parts.length > 1 && ['TB', 'TD', 'BT', 'LR', 'RL'].includes(parts[1])) {
      direction = parts[1];
    }
  }

  const convertedLines: string[] = [`flowchart ${direction}`];

  for (let line of lines) {
    let trimmed = line.trim();

    // Skip the swimlane-beta declaration
    if (trimmed.startsWith('swimlane-beta')) {
      continue;
    }

    // Handle edge syntax like: `start e1@--> a1` or `a1 e2@-->| Pass | a2`
    let edgeConverted = line.replace(/([a-zA-Z0-9_-]+)\s+[a-zA-Z0-9_-]+@-->/g, '$1 -->');
    edgeConverted = edgeConverted.replace(/([a-zA-Z0-9_-]+)\s+[a-zA-Z0-9_-]+@---/g, '$1 ---');
    edgeConverted = edgeConverted.replace(/([a-zA-Z0-9_-]+)\s+[a-zA-Z0-9_-]+@==>/g, '$1 ==>');

    // Handle edge metadata like `e1@{ animate: true, stroke}`
    if (/^[ \t]*e\d+@\{/.test(trimmed)) {
      // Keep or comment out for classic flowchart
      continue;
    }

    convertedLines.push(edgeConverted);
  }

  return convertedLines.join('\n');
}

export interface ValidationRuleResult {
  rule: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export function validateMermaidSwimlane(code: string): ValidationRuleResult[] {
  const results: ValidationRuleResult[] = [];
  const lines = code.split('\n');

  // Rule 1: Diagram declaration
  const hasSwimlaneBeta = lines.some(l => l.trim().startsWith('swimlane-beta'));
  const hasFlowchart = lines.some(l => l.trim().startsWith('flowchart'));
  
  if (hasSwimlaneBeta) {
    results.push({
      rule: 'Syntax Variant',
      passed: true,
      message: 'Using modern swimlane-beta syntax (Mermaid v11+).',
      severity: 'info'
    });
  } else if (hasFlowchart) {
    results.push({
      rule: 'Syntax Variant',
      passed: true,
      message: 'Using classic flowchart + subgraph pattern. Widely compatible across markdown viewers.',
      severity: 'info'
    });
  } else {
    results.push({
      rule: 'Diagram Declaration',
      passed: false,
      message: 'Missing valid diagram header. Use "swimlane-beta TB" or "flowchart TB".',
      severity: 'error'
    });
  }

  // Rule 2: Subgraphs (Swimlanes / Roles)
  const subgraphs: string[] = [];
  let subgraphCount = 0;
  let endCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^subgraph\s+([^\n\r{]+)/);
    if (match) {
      subgraphCount++;
      subgraphs.push(match[1].trim());
    }
    if (trimmed === 'end') {
      endCount++;
    }
  }

  if (subgraphCount === 0) {
    results.push({
      rule: 'Swimlane Actors',
      passed: false,
      message: 'No swimlanes defined. A swimlane diagram must have at least one lane representing an actor, role, or system.',
      severity: 'error'
    });
  } else {
    results.push({
      rule: 'Swimlane Actors',
      passed: true,
      message: `Found ${subgraphCount} swimlane(s): ${subgraphs.map(s => s.replace(/["\[\]]/g, '')).join(', ')}`,
      severity: 'info'
    });
  }

  // Rule 3: Subgraph / End balance
  if (subgraphCount !== endCount) {
    results.push({
      rule: 'Block Balance',
      passed: false,
      message: `Unbalanced subgraphs: ${subgraphCount} subgraph declarations but ${endCount} "end" statements.`,
      severity: 'error'
    });
  } else if (subgraphCount > 0) {
    results.push({
      rule: 'Block Balance',
      passed: true,
      message: 'All subgraph lanes are properly closed with "end".',
      severity: 'info'
    });
  }

  // Rule 4: Start & End nodes
  const hasStart = /\[\(\[?(เริ่มต้น|Start|Begin)/i.test(code);
  const hasDone = /\[\(\[?(สิ้นสุด|เสร็จสิ้น|Done|End|Finish)/i.test(code);
  if (hasStart && hasDone) {
    results.push({
      rule: 'Clear Start & End Boundary',
      passed: true,
      message: 'Includes explicit Start and End terminal nodes.',
      severity: 'info'
    });
  } else {
    results.push({
      rule: 'Process Boundaries',
      passed: false,
      message: 'Consider adding explicit start (e.g. start([เริ่มต้น])) and end nodes to define clear boundaries.',
      severity: 'warning'
    });
  }

  // Rule 5: Handoff Labels (Odoo / BPR checklist)
  const labeledCrossLane = /-->\|[^\|]+\|/g.test(code);
  if (labeledCrossLane) {
    results.push({
      rule: 'Handoff Labeling',
      passed: true,
      message: 'Flow includes labeled handoffs (document, condition, or status payload).',
      severity: 'info'
    });
  } else {
    results.push({
      rule: 'Handoff Labeling',
      passed: false,
      message: 'Arrows crossing swimlanes should specify the document, decision, or condition being handed off (e.g. -->|Status: Ready|).',
      severity: 'warning'
    });
  }

  // Rule 6: Odoo 19 Vocabulary recognition
  const odooKeywords = ['Quotation', 'Sales Order', 'Delivery Order', 'Purchase Order', 'RFQ', 'Receipt', 'Vendor Bill', 'MO', 'QC', 'Putaway', 'Backorder'];
  const matchedKeywords = odooKeywords.filter(kw => new RegExp(`\\b${kw}\\b`, 'i').test(code));
  if (matchedKeywords.length > 0) {
    results.push({
      rule: 'Odoo 19 Alignment',
      passed: true,
      message: `Detected standard Odoo terminology: ${matchedKeywords.join(', ')}.`,
      severity: 'info'
    });
  }

  return results;
}
