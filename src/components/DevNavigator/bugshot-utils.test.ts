// src/components/DevNavigator/bugshot-utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatRegionIssueBody, generateIssueTitle } from './bugshot-utils';

describe('generateIssueTitle', () => {
  it('prefixes with intent and truncates to 80 chars', () => {
    const long = 'A'.repeat(100);
    const title = generateIssueTitle('bug', long);
    expect(title.startsWith('[bug]')).toBe(true);
    expect(title.length).toBeLessThanOrEqual(85);
  });

  it('includes full short description', () => {
    expect(generateIssueTitle('missing', 'Button missing')).toBe('[missing] Button missing');
  });
});

describe('formatRegionIssueBody', () => {
  it('includes all required fields', () => {
    const body = formatRegionIssueBody({
      intent: 'bug',
      pageUrl: 'http://localhost:3000/calendar',
      region: { x: 10, y: 20, width: 100, height: 50 },
      description: 'Colours are wrong',
      tags: ['color', 'major'],
      filename: 'bugshot-calendar-20260422.png',
    });
    expect(body).toContain('**Intent:** bug');
    expect(body).toContain('**Page:** http://localhost:3000/calendar');
    expect(body).toContain('x=10 y=20 w=100 h=50');
    expect(body).toContain('color · major');
    expect(body).toContain('Colours are wrong');
    expect(body).toContain('bugshot-calendar-20260422.png');
  });

  it('handles empty tags gracefully', () => {
    const body = formatRegionIssueBody({
      intent: 'remove',
      pageUrl: 'http://localhost/settings',
      region: { x: 0, y: 0, width: 50, height: 50 },
      description: 'Remove this widget',
      tags: [],
      filename: 'bugshot.png',
    });
    expect(body).toContain('**Tags:** —');
  });
});
