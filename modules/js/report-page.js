(function (window) {
  let appState;
  let ui;
  let getCategories;
  let getTimestamp;
  let initialized = false;

  const ReportPage = {
    init({ state, ui: uiRefs, switchPanel, getCategories: getCategoriesFn, getTimestamp: getTimestampFn }) {
      if (initialized) {
        return;
      }
      appState = state;
      ui = uiRefs;
      getCategories = getCategoriesFn;
      getTimestamp = getTimestampFn;
      bindEvents(switchPanel);
      initialized = true;
    },

    render() {
      if (!appState || !appState.selectedSpread || !ui?.reportSummary) {
        return;
      }

      const remoteMap =
        window.ReadingPage && typeof window.ReadingPage.getRemoteInterpretationMap === 'function'
          ? window.ReadingPage.getRemoteInterpretationMap(appState.remoteInterpretations)
          : new Map();

      const headerHtml = `
        <div class="report-summary__header">
          <h3>${escapeHtml(appState.selectedSpread.name)}</h3>
          ${appState.question ? `<p>提問：${escapeHtml(appState.question)}</p>` : ''}
          <p class="report-summary__meta">時間：${escapeHtml(getTimestamp?.())} · 主題：${escapeHtml(getCategories?.() || '')}</p>
        </div>
      `;

      const listHtml = appState.selectedSpread.positions
        .map((pos, index) => {
          const card = appState.spreadDraws[index];
          if (!card) return '';
          const remote = remoteMap.get(pos.title) || remoteMap.get(pos.label);
          const cardDisplay = remote?.card
            ? escapeHtml(remote.card)
            : `${escapeHtml(card.name)}（${escapeHtml(card.orientationLabel)}）`;
          const summaryText = remote?.interpretation
            ? escapeHtml(remote.interpretation)
            : escapeHtml(card.meaning);
          const adviceText = remote?.advice ? escapeHtml(remote.advice) : escapeHtml(card.insight);
          const adviceHtml = adviceText
            ? `<span class="report-summary__meta">${adviceText}</span>`
            : '';
          return `
            <div class="report-summary__item">
              <strong>${escapeHtml(pos.label)} · ${escapeHtml(pos.title)}</strong>
              <span>${cardDisplay}</span>
              <span>${summaryText}</span>
              ${adviceHtml}
            </div>
          `;
        })
        .join('');

      ui.reportSummary.innerHTML = `${headerHtml}<div class="report-summary__list">${listHtml}</div>`;
    },

    buildCopyText() {
      if (!appState || !appState.selectedSpread) {
        return '';
      }
      return buildShareOrCopyText({ includeAdvice: true });
    },

    buildShareText() {
      if (!appState || !appState.selectedSpread) {
        return 'Tarot Insight 解牌師 - 歡迎體驗完整的解牌流程。';
      }
      return buildShareOrCopyText({ includeAdvice: false });
    },

    reset() {
      if (ui?.reportSummary) {
        ui.reportSummary.innerHTML = '';
      }
    }
  };

  function bindEvents(switchPanel) {
    if (!ui) {
      return;
    }

    if (ui.toReport) {
      ui.toReport.addEventListener('click', () => {
        ReportPage.render();
        if (typeof switchPanel === 'function') {
          switchPanel('report-section');
        }
      });
    }

    if (ui.downloadReport) {
      ui.downloadReport.addEventListener('click', () => {
        window.print();
      });
    }

    if (ui.copyReport) {
      ui.copyReport.addEventListener('click', async () => {
        const text = ReportPage.buildCopyText();
        if (!text) {
          return;
        }
        const button = ui.copyReport;
        const originalLabel = button.dataset.originalLabel || button.textContent;
        button.dataset.originalLabel = originalLabel;
        button.disabled = true;

        let success = true;
        try {
          await copyToClipboard(text);
        } catch (error) {
          success = false;
          console.error('Failed to copy report:', error);
        }

        button.textContent = success ? '已複製' : '複製失敗';

        setTimeout(() => {
          button.textContent = button.dataset.originalLabel;
          button.disabled = false;
        }, 2000);
      });
    }
  }

  function buildShareOrCopyText({ includeAdvice }) {
    const remoteMap =
      window.ReadingPage && typeof window.ReadingPage.getRemoteInterpretationMap === 'function'
        ? window.ReadingPage.getRemoteInterpretationMap(appState.remoteInterpretations)
        : new Map();
    const lines = [];

    if (includeAdvice) {
      lines.push('Tarot Insight 解牌師 - 解牌報告');
      lines.push('主站：https://tarotmaster.netlify.app');
    } else {
      lines.push('Tarot Insight 解牌師 - 占卜重點');
      lines.push('主站：https://tarotmaster.netlify.app');
    }
    lines.push(`牌陣：${appState.selectedSpread.name}`);
    const categories = getCategories?.();
    if (categories) {
      lines.push(`主題：${categories}`);
    }
    const when = getTimestamp?.();
    if (when) {
      lines.push(`時間：${when}`);
    }
    if (appState.question) {
      lines.push(`提問：「${appState.question}」`);
    }
    lines.push('');

    appState.selectedSpread.positions.forEach((pos, index) => {
      const card = appState.spreadDraws[index];
      if (!card) return;
      const remote = remoteMap.get(pos.title) || remoteMap.get(pos.label);
      const cardDisplay = remote?.card || `${card.name}（${card.orientationLabel}）`;
      const summaryText = remote?.interpretation || card.meaning;
      const adviceText = remote?.advice || card.insight;

      lines.push(`${pos.label} · ${pos.title}`);
      lines.push(`卡牌：${cardDisplay}`);
      if (summaryText) {
        lines.push(`重點：${summaryText}`);
      }
      if (includeAdvice && adviceText) {
        lines.push(`建議：${adviceText}`);
      }
      lines.push('');
    });

    return lines.join('\n').trim();
  }

  window.ReportPage = ReportPage;
})(window);
