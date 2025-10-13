(function (window) {
  let appState;
  let ui;
  let getCategories;
  let getTimestamp;
  let initialized = false;

  const i18n = window.i18n || null;

  function translate(key, replacements) {
    if (i18n && typeof i18n.t === 'function') {
      return i18n.t(key, replacements);
    }
    if (replacements && typeof replacements.fallback === 'string') {
      return replacements.fallback;
    }
    return key;
  }

  function localize(value, fallback = '') {
    if (i18n && typeof i18n.getText === 'function') {
      return i18n.getText(value, fallback);
    }
    if (typeof value === 'string') {
      return value;
    }
    return fallback;
  }

  function resolveRemoteForPosition(position, remoteMap) {
    if (!position || !remoteMap) {
      return null;
    }
    const localizedTitle = localize(position.title, position.title);
    const localizedLabel = localize(position.label, position.label);
    const keys = [position.title, position.label, localizedTitle, localizedLabel, position.id]
      .filter(Boolean)
      .map((value) => String(value).trim());
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (remoteMap.has(key)) {
        return remoteMap.get(key);
      }
      const lowerKey = key.toLowerCase();
      if (remoteMap.has(lowerKey)) {
        return remoteMap.get(lowerKey);
      }
    }
    return null;
  }

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

      const spreadName = localize(appState.selectedSpread.name, appState.selectedSpread.name);
      const escapedQuestion = appState.question ? escapeHtml(appState.question) : '';
      const questionHtml = appState.question
        ? `<p>${translate('reportQuestionLabel', {
            question: escapedQuestion,
            fallback: `提問：「${escapedQuestion}」`
          })}</p>`
        : '';
      const timestampText = getTimestamp?.() || '';
      const categoriesText = getCategories?.() || '';
      const metaText = translate('reportMetaLine', {
        time: escapeHtml(timestampText),
        category: escapeHtml(categoriesText),
        fallback: `時間：${escapeHtml(timestampText)} · 主題：${escapeHtml(categoriesText)}`
      });

      const headerHtml = `
        <div class="report-summary__header">
          <h3>${escapeHtml(spreadName)}</h3>
          ${questionHtml}
          <p class="report-summary__meta">${metaText}</p>
        </div>
      `;

      const listHtml = appState.selectedSpread.positions
        .map((pos, index) => {
          const card = appState.spreadDraws[index];
          if (!card) return '';
          const remote = resolveRemoteForPosition(pos, remoteMap);
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
              <strong>${escapeHtml(localize(pos.label, pos.label))} · ${escapeHtml(localize(pos.title, pos.title))}</strong>
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
        return translate('shareDefault', {
          fallback: 'Tarot Insight 解牌師 - 歡迎體驗完整的解牌流程。'
        });
      }
      return buildShareOrCopyText({ includeAdvice: false });
    },

    reset() {
      if (ui?.reportSummary) {
        ui.reportSummary.innerHTML = '';
      }
    },

    handleLanguageChange() {
      if (!initialized || !appState) {
        return;
      }
      if (ui?.reportSummary && ui.reportSummary.innerHTML) {
        ReportPage.render();
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

        const successLabel = translate('reportCopyButtonSuccess', { fallback: '已複製' });
        const failureLabel = translate('reportCopyButtonFailure', { fallback: '複製失敗' });
        button.textContent = success ? successLabel : failureLabel;

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
      lines.push(
        translate('reportCopyHeader', {
          fallback: 'Tarot Insight 解牌師 - 解牌報告'
        })
      );
    } else {
      lines.push(
        translate('reportShareHeader', {
          fallback: 'Tarot Insight 解牌師 - 占卜重點'
        })
      );
    }
    lines.push(translate('shareSite'));

    const spreadName = localize(appState.selectedSpread.name, appState.selectedSpread.name);
    lines.push(`${translate('shareSpreadLabel')}${spreadName}`);
    const categories = getCategories?.();
    if (categories) {
      lines.push(`${translate('shareCategoryLabel')}${categories}`);
    }
    const when = getTimestamp?.();
    if (when) {
      lines.push(
        translate('reportTimeLabel', {
          time: when,
          fallback: `時間：${when}`
        })
      );
    }
    if (appState.question) {
      lines.push(
        translate('reportQuestionLabel', {
          question: appState.question,
          fallback: `提問：「${appState.question}」`
        })
      );
    }
    lines.push('');

    appState.selectedSpread.positions.forEach((pos, index) => {
      const card = appState.spreadDraws[index];
      if (!card) return;
      const remote = resolveRemoteForPosition(pos, remoteMap);
      const cardDisplay = remote?.card || `${card.name}（${card.orientationLabel}）`;
      const summaryText = remote?.interpretation || card.meaning;
      const adviceText = remote?.advice || card.insight;

      lines.push(`${localize(pos.label, pos.label)} · ${localize(pos.title, pos.title)}`);
      lines.push(
        translate('reportCardLabel', {
          card: cardDisplay,
          fallback: `卡牌：${cardDisplay}`
        })
      );
      if (summaryText) {
        lines.push(
          translate('reportSummaryLabel', {
            summary: summaryText,
            fallback: `重點：${summaryText}`
          })
        );
      }
      if (includeAdvice && adviceText) {
        lines.push(
          translate('reportAdviceLabel', {
            advice: adviceText,
            fallback: `建議：${adviceText}`
          })
        );
      }
      lines.push('');
    });

    return lines.join('\n').trim();
  }

  window.ReportPage = ReportPage;
})(window);
