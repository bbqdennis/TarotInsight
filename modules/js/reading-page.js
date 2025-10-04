(function (window) {
  let appState;
  let ui;
  let apiConfig = {};
  let initialized = false;

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
            message: '暫無線上解牌結果，以下為基本解析。'
          });
        }
      } catch (error) {
        console.error('Failed to fetch tarot insights:', error);
        appState.remoteInterpretations = null;
        ReadingPage.renderCardInterpretations(null, {
          message: '目前無法連線取得線上解析，以下為基礎解讀。'
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

      const autoExpandDetails = Boolean(options.autoExpand);
      appState.interpretationAutoExpand = autoExpandDetails;
      appState.interpretationNotice = options.message || '';

      const cardsHtml = appState.selectedSpread.positions
        .map((pos, index) => {
          const card = appState.spreadDraws[index];
          if (!card) return '';

          const remote = remoteMap.get(pos.title) || remoteMap.get(pos.label);
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
          const buttonLabel = autoExpandDetails ? '收合詳解' : '查看更多';
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
                <h4 class="card-interpretation__title">${escapeHtml(pos.label)} · ${escapeHtml(pos.title)}</h4>
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

      const messageHtml = options.message
        ? `<div class="card-interpretation__notice">${escapeHtml(options.message)}</div>`
        : '';
      ui.cardInterpretations.innerHTML = `${messageHtml}${cardsHtml}`;

      ui.cardInterpretations.querySelectorAll('[data-toggle="details"]').forEach((button) => {
        button.addEventListener('click', () => {
          const details = button.parentElement.querySelector('.card-interpretation__details');
          if (details.classList.contains('active')) {
            details.classList.remove('active');
            button.textContent = '查看更多';
          } else {
            details.classList.add('active');
            button.textContent = '收合詳解';
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
    }
  };

  function renderReadingSummary() {
    if (!appState || !appState.selectedSpread || !ui?.readingOverview) {
      return;
    }

    const summaryItems = appState.selectedSpread.positions.map((pos, index) => {
      const card = appState.spreadDraws[index];
      const cardLabel = card ? card.name : '尚未抽牌';
      return `<div class="chip">${escapeHtml(pos.title)}：${escapeHtml(cardLabel)}</div>`;
    });

    const questionLine = appState.question ? `<p>提問：「${escapeHtml(appState.question)}」</p>` : '';

    ui.readingOverview.innerHTML = `
      <div class="reading-overview__meta">
        <h3>${escapeHtml(appState.selectedSpread.name)}</h3>
        <p>共 ${appState.selectedSpread.cardCount} 張牌 · 問題主題：${escapeHtml(getCategoryDisplay())}</p>
        ${questionLine}
      </div>
      <div class="reading-overview__chips">${summaryItems.join('')}</div>
    `;
  }

  function setLoadingState() {
    if (!ui?.cardInterpretations) {
      return;
    }
    ui.cardInterpretations.innerHTML = '<div class="card-interpretation__loading">正在生成解牌內容...</div>';
  }

  function buildQuestionPayload() {
    if (!appState || !appState.selectedSpread) {
      return '';
    }

    const lines = [];
    lines.push(appState.selectedSpread.name);
    lines.push(`共 ${appState.selectedSpread.cardCount} 張牌 · 問題主題：${getCategoryDisplay()}`);
    if (appState.question) {
      lines.push(`提問：「${appState.question}」`);
    }

    appState.selectedSpread.positions.forEach((pos, index) => {
      const card = appState.spreadDraws[index];
      if (!card) return;
      lines.push(`${pos.title}：${card.name} · ${card.orientationLabel}`);
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

    try {
      const response = await fetch(apiConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'n8n-key': 'connect-to-n8n'
        },
        body: JSON.stringify({ question: questionPayload }),
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
        map.set(item.position, item);
      }
    });
    return map;
  }

  function buildDetailText(position, card) {
    const base = `${position.title}代表${position.meaning}`;
    const detail = card.detail;
    const questionRef = appState.question
      ? `結合你的提問「${appState.question}」，此牌提醒：${card.insight}`
      : card.insight;

    return `${base}。${detail} ${questionRef}`;
  }

  window.ReadingPage = ReadingPage;
})(window);
