/**
 * @jest-environment jsdom
 */

const { getAuditLogs } = require('../src/api.js');
const fs = require('fs');
const path = require('path');

jest.mock('../src/api.js'); // Mock API

beforeEach(() => {
    // Load HTML into jsdom
    const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
    document.documentElement.innerHTML = html;

    // Load app.js after setting up DOM
    require('../src/app.js');
});

test('renders audit table rows when data is loaded', async () => {
    // Mock API response
    getAuditLogs.mockResolvedValue([
        { resourceId: 'R1', action: 'CREATE', timestamp: '2026-01-08T10:00:00Z' },
        { resourceId: 'R2', action: 'DELETE', timestamp: '2026-01-08T11:00:00Z' }
    ]);

    const button = document.getElementById('loadData');
    await button.click();

    // Wait for renderLogs to finish
    await new Promise(process.nextTick);

    const rows = document.querySelectorAll('#auditTable tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('R1');
    expect(rows[1].textContent).toContain('R2');
});
