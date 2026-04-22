// src/components/DevNavigator/page-capture-utils.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildDomOutline, extractTextContent, formatNewPageBody, formatWorkflowParentBody } from './page-capture-utils';

// jsdom provides a real DOM
describe('buildDomOutline', () => {
  it('returns compact semantic outline', () => {
    document.body.innerHTML = '<nav><a href="/">Home</a></nav><main><h1>Title</h1><button>Click</button></main>';
    const outline = buildDomOutline(document.body);
    expect(outline).toContain('nav');
    expect(outline).toContain('main');
    expect(outline).toContain('h1');
    expect(outline).toContain('button');
    // Should not contain raw class noise
    expect(outline.length).toBeLessThan(500);
  });

  it('skips script and style tags', () => {
    document.body.innerHTML = '<script>alert(1)</script><main><h1>Hi</h1></main>';
    const outline = buildDomOutline(document.body);
    expect(outline).not.toContain('script');
    expect(outline).toContain('h1');
  });
});

describe('extractTextContent', () => {
  it('captures headings, labels, and buttons', () => {
    document.body.innerHTML = '<h1>Dashboard</h1><label>Client name</label><button>Save</button>';
    const content = extractTextContent();
    expect(content.headings).toContain('Dashboard');
    expect(content.labels).toContain('Client name');
    expect(content.ctas).toContain('Save');
  });
});

describe('formatNewPageBody', () => {
  it('includes all required sections', () => {
    const body = formatNewPageBody({
      url: 'https://acme.splose.com/appointments/new',
      title: 'New Appointment',
      viewport: { width: 1440, height: 900 },
      description: 'Booking form',
      domOutline: 'nav > main > form',
      tokens: 'bg: #fff',
      content: { headings: ['New Appointment'], labels: ['Date'], ctas: ['Next'] },
      filename: 'page-capture-20260422.png',
    });
    expect(body).toContain('**Intent:** new-page');
    expect(body).toContain('acme.splose.com/appointments/new');
    expect(body).toContain('### DOM Outline');
    expect(body).toContain('### Design Tokens');
    expect(body).toContain('### Content');
    expect(body).toContain('page-capture-20260422.png');
  });
});

describe('formatWorkflowParentBody', () => {
  it('lists all step issue numbers', () => {
    const body = formatWorkflowParentBody({ name: 'Create appt', description: 'Full flow', stepIssues: [{ number: 10, stepLabel: 'Step 1' }, { number: 11, stepLabel: 'Step 2' }] });
    expect(body).toContain('**Intent:** workflow');
    expect(body).toContain('#10');
    expect(body).toContain('#11');
  });
});
