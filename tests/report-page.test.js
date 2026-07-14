const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function createButton() {
  const listeners = new Map();
  return {
    dataset: {},
    disabled: false,
    textContent: 'Download PDF',
    addEventListener(event, handler) {
      listeners.set(event, handler);
    },
    async click() {
      await listeners.get('click')();
    }
  };
}

test('download button saves a PDF without opening the print dialog', async () => {
  const downloadReport = createButton();
  let printCalls = 0;
  let savedFilename = '';
  const window = {
    print() {
      printCalls += 1;
    },
    html2canvas: async () => ({ width: 800, height: 1200 }),
    jspdf: {
      jsPDF: class {
        constructor() {
          this.internal = {
            pageSize: {
              getWidth: () => 210,
              getHeight: () => 297
            }
          };
        }

        addImage() {}
        addPage() {}
        save(filename) {
          savedFilename = filename;
        }
      }
    }
  };
  const context = { window, console, setTimeout };
  const reportPageSource = fs.readFileSync(
    path.join(__dirname, '../modules/js/report-page.js'),
    'utf8'
  );
  vm.runInNewContext(reportPageSource, context);

  window.ReportPage.init({
    state: {},
    ui: { downloadReport, reportSummary: {} }
  });

  await downloadReport.click();

  assert.equal(printCalls, 0);
  assert.match(savedFilename, /^tarot-insight-report-.*\.pdf$/);
});
