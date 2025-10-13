(function (window) {
  let appState;
  let ui;
  let apiConfig = {};
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

  const ReadingPage = {
    init({ state, ui: uiRefs, switchPanel: _switchPanelFn, api = {} }) {
      if (initialized) {
        return;
      }
      appState = state;
      ui = uiRefs;
      apiConfig = api;
      initialized = true;
    },

    async prepareReading() {
      if (!appState || !appState.selectedSpread) {
        return;
      }

      if (!appState.timestamp) {
        appState.timestamp = new Date();
      }

      appState.interpretationNotice = '';
      appState.interpretationAutoExpand = false;
      appState.interpretationNoticeKey = '';
      appState.interpretationNoticeReplacements = null;
      renderReadingSummary();
      setLoadingState();
      appState.remoteInterpretations = null;

      const questionPayload = buildQuestionPayload();
      if (!questionPayload) {
        ReadingPage.renderCardInterpretations();
        return;
      }

      try {
        const remoteResults = await fetchTarotInterpretations(questionPayload);
        if (Array.isArray(remoteResults) && remoteResults.length) {
          appState.remoteInterpretations = remoteResults;
          ReadingPage.renderCardInterpretations(remoteResults, { autoExpand: true });
        } else {
          appState.remoteInterpretations = null;
          ReadingPage.renderCardInterpretations(null, {
            messageKey: 'remoteEmpty'
          });
        }
      } catch (error) {
        console.error('Failed to fetch tarot insights:', error);
        appState.remoteInterpretations = null;
        ReadingPage.renderCardInterpretations(null, {
          messageKey: 'remoteUnavailable'
        });
      }
    },

    renderCardInterpretations(remoteResults, options = {}) {
      if (!appState || !appState.selectedSpread || !ui || !ui.cardInterpretations) {
        return;
      }

      const effectiveRemote =
        remoteResults === undefined ? appState.remoteInterpretations : remoteResults;
      const remoteMap = buildRemoteInterpretationMap(effectiveRemote);

      const hasAutoExpand = Object.prototype.hasOwnProperty.call(options, 'autoExpand');
      const autoExpandDetails = hasAutoExpand
        ? Boolean(options.autoExpand)
        : Boolean(appState.interpretationAutoExpand);
      appState.interpretationAutoExpand = autoExpandDetails;

      const hasMessageKey = Object.prototype.hasOwnProperty.call(options, 'messageKey');
      const hasMessage = Object.prototype.hasOwnProperty.call(options, 'message');

      if (hasMessageKey) {
        const replacements = options.replacements || {};
        const key = options.messageKey || '';
        appState.interpretationNoticeKey = key;
        appState.interpretationNoticeReplacements = Object.keys(replacements).length
          ? replacements
          : null;
        appState.interpretationNotice = key
          ? translate(key, { ...replacements })
          : '';
      } else if (hasMessage) {
        appState.interpretationNoticeKey = '';
        appState.interpretationNoticeReplacements = null;
        appState.interpretationNotice = options.message || '';
      } else if (appState.interpretationNoticeKey) {
        const replacements = appState.interpretationNoticeReplacements || {};
        appState.interpretationNotice = translate(appState.interpretationNoticeKey, {
          ...replacements
        });
      }

      const noticeMessage = appState.interpretationNotice || '';

      const cardsHtml = appState.selectedSpread.positions
        .map((pos, index) => {
          const card = appState.spreadDraws[index];
          if (!card) return '';

          const localizedTitle = localize(pos.title, pos.title);
          const localizedLabel = localize(pos.label, pos.label);
          let remote =
            remoteMap.get(pos.title) ||
            remoteMap.get(pos.label) ||
            remoteMap.get(localizedTitle) ||
            remoteMap.get(localizedLabel);
          if (!remote) {
            const lookupKeys = [pos.title, pos.label, localizedTitle, localizedLabel, pos.id]
              .filter(Boolean)
              .map((value) => String(value).trim());
            for (let i = 0; i < lookupKeys.length; i += 1) {
              const key = lookupKeys[i];
              if (remoteMap.has(key)) {
                remote = remoteMap.get(key);
                break;
              }
              const lowerKey = key.toLowerCase();
              if (remoteMap.has(lowerKey)) {
                remote = remoteMap.get(lowerKey);
                break;
              }
            }
          }
          const baseDetail = buildDetailText(pos, card);
          const summaryText = remote?.interpretation
            ? escapeHtml(remote.interpretation)
            : escapeHtml(card.meaning);
          const detailParts = [];
          if (remote?.advice) {
            detailParts.push(escapeHtml(remote.advice));
          }
          if (remote) {
            if (!detailParts.length && remote.interpretation) {
              detailParts.push(escapeHtml(remote.interpretation));
            }
          } else {
            detailParts.push(escapeHtml(baseDetail));
          }
          const detailText = detailParts.join('<br><br>');
          const cardDisplay = remote?.card
            ? escapeHtml(remote.card)
            : `${escapeHtml(card.name)} · ${escapeHtml(card.orientationLabel)}`;
          const keywords = card.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join('');
          const interpretationId = `interpretation-${pos.id}`;
          const detailsClass = autoExpandDetails ? 'active' : '';
          const buttonLabel = autoExpandDetails
            ? translate('interpretationToggleCollapse', { fallback: '收合詳解' })
            : translate('interpretationToggleExpand', { fallback: '查看更多' });
          const imageInnerHtml = appState.simpleMode
            ? ''
            : window.SpreadPage && typeof window.SpreadPage.buildCardImageHtml === 'function'
              ? window.SpreadPage.buildCardImageHtml(card)
              : '';
          const imageBlock = imageInnerHtml
            ? `<div class="card-interpretation__image-wrapper">${imageInnerHtml}</div>`
            : '';

          return `
            <article class="card-interpretation" id="${interpretationId}">
              <div class="card-interpretation__header">
                <h4 class="card-interpretation__title">${escapeHtml(localizedLabel)} · ${escapeHtml(localizedTitle)}</h4>
                <span class="chip">${cardDisplay}</span>
              </div>
              ${imageBlock}
              <p class="card-interpretation__summary">${summaryText}</p>
              <p class="card-interpretation__details ${detailsClass}">${detailText}</p>
              <div class="keywords">${keywords}</div>
              <button class="btn ghost" data-toggle="details">${buttonLabel}</button>
            </article>
          `;
        })
        .join('');

      const messageHtml = noticeMessage
        ? `<div class="card-interpretation__notice">${escapeHtml(noticeMessage)}</div>`
        : '';
      ui.cardInterpretations.innerHTML = `${messageHtml}${cardsHtml}`;

      ui.cardInterpretations.querySelectorAll('[data-toggle="details"]').forEach((button) => {
        button.addEventListener('click', () => {
          const details = button.parentElement.querySelector('.card-interpretation__details');
          if (details.classList.contains('active')) {
            details.classList.remove('active');
            button.textContent = translate('interpretationToggleExpand', { fallback: '查看更多' });
          } else {
            details.classList.add('active');
            button.textContent = translate('interpretationToggleCollapse', { fallback: '收合詳解' });
          }
        });
      });
    },

    reset() {
      if (!appState) {
        return;
      }
      appState.interpretationNotice = '';
      appState.interpretationAutoExpand = false;
      appState.interpretationNoticeKey = '';
      appState.interpretationNoticeReplacements = null;
      appState.remoteInterpretations = null;
      if (ui?.readingOverview) {
        ui.readingOverview.innerHTML = '';
      }
      if (ui?.cardInterpretations) {
        ui.cardInterpretations.innerHTML = '';
      }
    },

    getRemoteInterpretationMap(remoteResults) {
      return buildRemoteInterpretationMap(remoteResults);
    },

    handleLanguageChange() {
      if (!initialized || !appState) {
        return;
      }
      renderReadingSummary();
      const options = {};
      if (appState.interpretationAutoExpand) {
        options.autoExpand = true;
      }
      if (appState.interpretationNoticeKey) {
        options.messageKey = appState.interpretationNoticeKey;
        if (appState.interpretationNoticeReplacements) {
          options.replacements = appState.interpretationNoticeReplacements;
        }
      } else if (appState.interpretationNotice) {
        options.message = appState.interpretationNotice;
      }
      ReadingPage.renderCardInterpretations(undefined, options);
    }
  };

  function renderReadingSummary() {
    if (!appState || !appState.selectedSpread || !ui?.readingOverview) {
      return;
    }

    const summaryItems = appState.selectedSpread.positions.map((pos, index) => {
      const card = appState.spreadDraws[index];
      const title = localize(pos.title, pos.title);
      const cardLabel = card
        ? card.name
        : translate('notYetDrawn', { fallback: '尚未抽牌' });
      return `<div class="chip">${escapeHtml(title)}：${escapeHtml(cardLabel)}</div>`;
    });

    let questionLine = '';
    if (appState.question) {
      const escapedQuestion = escapeHtml(appState.question);
      const questionText = translate('questionLine', {
        question: escapedQuestion,
        fallback: `提問：「${escapedQuestion}」`
      });
      questionLine = `<p>${questionText}</p>`;
    }

    const spreadName = localize(appState.selectedSpread.name, appState.selectedSpread.name);
    const categoryDisplay = escapeHtml(getCategoryDisplay());
    const metaText = translate('readingSummaryMeta', {
      count: appState.selectedSpread.cardCount,
      category: categoryDisplay,
      fallback: `共 ${appState.selectedSpread.cardCount} 張牌 · 問題主題：${categoryDisplay}`
    });

    ui.readingOverview.innerHTML = `
      <div class="reading-overview__meta">
        <h3>${escapeHtml(spreadName)}</h3>
        <p>${metaText}</p>
        ${questionLine}
      </div>
      <div class="reading-overview__chips">${summaryItems.join('')}</div>
    `;
  }

  function setLoadingState() {
    if (!ui?.cardInterpretations) {
      return;
    }
    const loadingText = translate('loadingInterpretations', {
      fallback: '正在生成解牌內容...'
    });
    ui.cardInterpretations.innerHTML = `<div class="card-interpretation__loading">${loadingText}</div>`;
  }

  function buildQuestionPayload() {
    if (!appState || !appState.selectedSpread) {
      return '';
    }

    const lines = [];
    lines.push(localize(appState.selectedSpread.name, appState.selectedSpread.name));
    lines.push(
      translate('readingSummaryMeta', {
        count: appState.selectedSpread.cardCount,
        category: getCategoryDisplay(),
        fallback: `共 ${appState.selectedSpread.cardCount} 張牌 · 問題主題：${getCategoryDisplay()}`
      })
    );
    if (appState.question) {
      lines.push(
        translate('questionLine', {
          question: appState.question,
          fallback: `提問：「${appState.question}」`
        })
      );
    }

    appState.selectedSpread.positions.forEach((pos, index) => {
      const card = appState.spreadDraws[index];
      if (!card) return;
      const positionTitle = localize(pos.title, pos.title);
      lines.push(`${positionTitle}：${card.name} · ${card.orientationLabel}`);
    });

    return lines.join('\n');
  }

  async function fetchTarotInterpretations(questionPayload) {
    if (!apiConfig.endpoint) {
      return null;
    }
    const controller = new AbortController();
    const timeoutLimit = typeof apiConfig.timeout === 'number' ? apiConfig.timeout : 60000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutLimit);
    const language = appState?.language === 'english' ? 'english' : 'chinese';

    try {
      const response = await fetch(apiConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'n8n-key': 'connect-to-n8n'
        },
        body: JSON.stringify({
          question: questionPayload,
          language: language
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Tarot API responded with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Tarot API request timed out');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function buildRemoteInterpretationMap(remoteResults) {
    const map = new Map();
    if (!Array.isArray(remoteResults)) {
      return map;
    }
    remoteResults.forEach((item) => {
      if (item && item.position) {
        const positionKey = String(item.position).trim();
        map.set(positionKey, item);
        map.set(positionKey.toLowerCase(), item);
      }
      if (item && item.positionId) {
        map.set(String(item.positionId), item);
      }
    });
    return map;
  }

  function buildDetailText(position, card) {
    const language = window.i18n?.getLanguage ? window.i18n.getLanguage() : 'chinese';
    const positionTitle = localize(position.title, position.title);
    const positionMeaning = localize(position.meaning, position.meaning);
    const cardDetail = card.detail || '';
    const cardInsight = card.insight || '';

    if (language === 'english') {
      const questionLine = appState.question
        ? `Connecting with your question, “${appState.question}”, this card reminds you that ${cardInsight}`
        : cardInsight;
      return `${positionTitle} represents ${positionMeaning}. ${cardDetail} ${questionLine}`.trim();
    }

    const questionRef = appState.question
      ? `結合你的提問「${appState.question}」，此牌提醒：${cardInsight}`
      : cardInsight;

    return `${positionTitle}代表${positionMeaning}。${cardDetail} ${questionRef}`.trim();
  }

  window.ReadingPage = ReadingPage;
})(window);
