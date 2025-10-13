(function (window) {
  const CARD_IMAGE_BASE_PATH = 'Image/LegacyTarot';
  const legacyMajorImageMap = {
    'major-0': '0LMfool-2x.jpg',
    'major-1': '1LMmagician-2x.jpg',
    'major-2': '2LMhighpriestess-2x.jpg',
    'major-3': '3LMempress-2x.jpg',
    'major-4': '4LMemperor-2x.jpg',
    'major-5': '5LMfaith-2x.jpg',
    'major-6': '6LMlovers-2x.jpg',
    'major-7': '7LMchariot-2x.jpg',
    'major-8': '8LMstrength-2x.jpg',
    'major-9': '9LHermit-2x.jpg',
    'major-10': '10LMwheel-2x.jpg',
    'major-11': '11LMjustice-2x.jpg',
    'major-12': '12LMhanging-man-2x.jpg',
    'major-13': '13LMdeath-2x.jpg',
    'major-14': '14LMtemperance-2x.jpg',
    'major-15': '15LMdevil-2x.jpg',
    'major-16': '16LMtower-2x.jpg',
    'major-17': '17LMstar-2x.jpg',
    'major-18': '18LMmoon-2x.jpg',
    'major-19': '19LMsun-2x.jpg',
    'major-20': '20LMjudgement-2x.jpg',
    'major-21': '21LMworld-2x.jpg'
  };

  const suitImagePrefix = {
    wands: 'Lwands',
    cups: 'Lcups',
    swords: 'Lswords',
    pentacles: 'Lcoins'
  };

  const minorRankImageSuffix = {
    ace: '1Ace',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    page: 'Page',
    knight: 'KNIGHT',
    queen: 'Queen',
    king: 'KING'
  };

  const minorSuitSuffixOverrides = {
    pentacles: {
      page: 'page',
      king: 'KINGS'
    }
  };

  let appState;
  let ui;
  let catalog;
  let switchPanel;
  let prepareReading;
  let initialized = false;

  function getOrientationLabel(orientation) {
    const key = orientation === 'reversed' ? 'orientationReversed' : 'orientationUpright';
    const fallback = orientation === 'reversed' ? '逆位' : '正位';
    return translate(key, { fallback });
  }

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

  const SpreadPage = {
    init({ state, ui: uiRefs, spreadCatalog, switchPanel: switchPanelFn, prepareReading: prepareReadingFn }) {
      if (initialized) {
        return;
      }
      appState = state;
      ui = uiRefs;
      switchPanel = switchPanelFn;
      prepareReading = prepareReadingFn;
      SpreadPage.setCatalog(spreadCatalog);
      bindEvents();
      SpreadPage.reset();
      initialized = true;
    },

    setCatalog(newCatalog) {
      if (!Array.isArray(newCatalog)) {
        return;
      }
      catalog = newCatalog;
      if (appState?.selectedSpread) {
        const updatedSpread = catalog.find((item) => item.id === appState.selectedSpread.id);
        if (updatedSpread) {
          appState.selectedSpread = updatedSpread;
          if (Array.isArray(appState.spreadDraws)) {
            const required = updatedSpread.cardCount;
            const existing = appState.spreadDraws.slice(0, required);
            if (existing.length < required) {
              appState.spreadDraws = [
                ...existing,
                ...Array.from({ length: required - existing.length }, () => null)
              ];
            } else {
              appState.spreadDraws = existing;
            }
          }
          renderSpreadDetails();
          updateOrientationLabels();
          SpreadPage.updatePositionStatus();
        } else {
          appState.selectedSpread = null;
          appState.spreadDraws = [];
          if (ui?.spreadDetails) {
            ui.spreadDetails.innerHTML = '';
          }
          if (ui?.spreadCaption) {
            ui.spreadCaption.textContent = translate('spreadPromptSelect', {
              fallback: '請先選擇適合的牌陣。'
            });
          }
          if (ui?.toReading) {
            ui.toReading.disabled = true;
          }
          if (ui?.drawManual) {
            ui.drawManual.disabled = true;
          }
          if (ui?.drawAuto) {
            ui.drawAuto.disabled = true;
          }
        }
      } else if (ui?.spreadCaption) {
        ui.spreadCaption.textContent = translate('spreadPromptSelect', {
          fallback: '請先選擇適合的牌陣。'
        });
      }
    },

    reset() {
      if (!appState) {
        return;
      }
      resetDeck();
      appState.selectedSpread = null;
      appState.spreadDraws = [];
      appState.remoteInterpretations = null;
      appState.interpretationNotice = '';
      appState.interpretationAutoExpand = false;
      appState.interpretationNoticeKey = '';
      appState.interpretationNoticeReplacements = null;
      if (ui.spreadCaption) {
        ui.spreadCaption.textContent = translate('spreadPromptSelect', {
          fallback: '請先選擇適合的牌陣。'
        });
      }
      if (ui.spreadDetails) {
        ui.spreadDetails.innerHTML = '';
      }
      if (ui.drawManual) {
        ui.drawManual.disabled = true;
      }
      if (ui.drawAuto) {
        ui.drawAuto.disabled = true;
      }
      if (ui.toReading) {
        ui.toReading.disabled = true;
      }
    },

    selectSpread(spreadId) {
      if (!catalog || !appState) {
        return;
      }
      const spread = catalog.find((item) => item.id === spreadId);
      if (!spread) {
        return;
      }

      appState.selectedSpread = spread;
      SpreadPage.resetSpreadDraw();
      if (ui.spreadCaption) {
        const spreadName = localize(spread.name, spread.name);
        ui.spreadCaption.textContent = translate('spreadSelectedCaption', {
          spread: spreadName,
          fallback: `已選擇：${spreadName}`
        });
      }
      renderSpreadDetails();
    },

    resetSpreadDraw() {
      if (!appState || !appState.selectedSpread) {
        return;
      }
      resetDeck();
      const count = appState.selectedSpread.cardCount;
      appState.spreadDraws = Array.from({ length: count }, () => null);
      appState.remoteInterpretations = null;
      appState.interpretationNotice = '';
      appState.interpretationAutoExpand = false;
      appState.interpretationNoticeKey = '';
      appState.interpretationNoticeReplacements = null;
      if (ui.drawManual) {
        ui.drawManual.disabled = false;
      }
      if (ui.drawAuto) {
        ui.drawAuto.disabled = false;
      }
      if (ui.toReading) {
        ui.toReading.disabled = true;
      }
      SpreadPage.updatePositionStatus();
    },

    handleManualDraw() {
      if (!appState || !Array.isArray(appState.spreadDraws)) {
        return;
      }
      const nextIndex = appState.spreadDraws.findIndex((entry) => entry === null);
      if (nextIndex === -1) {
        return;
      }

      const card = drawCard();
      appState.spreadDraws[nextIndex] = card;
      SpreadPage.updatePositionStatus();
      checkDrawCompletion();
    },

    handleAutoDraw() {
      if (!appState || !Array.isArray(appState.spreadDraws)) {
        return;
      }
      let nextIndex = appState.spreadDraws.findIndex((entry) => entry === null);
      while (nextIndex !== -1) {
        appState.spreadDraws[nextIndex] = drawCard();
        nextIndex = appState.spreadDraws.findIndex((entry) => entry === null);
      }
      SpreadPage.updatePositionStatus();
      checkDrawCompletion();
    },

    resetDeck,
    updatePositionStatus() {
      if (!appState || !appState.selectedSpread) {
        return;
      }
      appState.selectedSpread.positions.forEach((_, index) => {
        const card = appState.spreadDraws[index];
        const statusElement = document.getElementById(`position-card-${index}`);
        if (statusElement) {
          statusElement.innerHTML = buildCardStatusHtml(card);
        }
      });
    },

    buildCardImageHtml(card) {
      const imagePath = getCardImagePath(card);
      if (!imagePath) {
        return '';
      }

      const classes = ['card-image', 'js-card-image'];
      if (card.orientation === 'reversed') {
        classes.push('is-reversed');
      }

      const cardLabel = `${card.name} · ${card.orientationLabel}`;
      const attributes = [
        `src="${escapeHtml(imagePath)}"`,
        `data-full-src="${escapeHtml(imagePath)}"`,
        `alt="${escapeHtml(card.name)}"`,
        `data-card-label="${escapeHtml(cardLabel)}"`,
        `data-orientation="${escapeHtml(card.orientation || 'upright')}"`,
        'loading="lazy"',
        `class="${classes.join(' ')}"`
      ];

      return `<img ${attributes.join(' ')} />`;
    },

    handleLanguageChange() {
      if (!initialized) {
        return;
      }
      if (ui?.spreadCaption) {
        if (appState?.selectedSpread) {
          const spreadName = localize(appState.selectedSpread.name, appState.selectedSpread.name);
          ui.spreadCaption.textContent = translate('spreadSelectedCaption', {
            spread: spreadName,
            fallback: `已選擇：${spreadName}`
          });
        } else {
          ui.spreadCaption.textContent = translate('spreadPromptSelect', {
            fallback: '請先選擇適合的牌陣。'
          });
        }
      }
      updateOrientationLabels();
      if (appState?.selectedSpread) {
        renderSpreadDetails();
      }
    }
  };

  function bindEvents() {
    if (!ui) {
      return;
    }
    if (ui.drawManual) {
      ui.drawManual.addEventListener('click', () => SpreadPage.handleManualDraw());
    }
    if (ui.drawAuto) {
      ui.drawAuto.addEventListener('click', () => SpreadPage.handleAutoDraw());
    }
    if (ui.resetDraw) {
      ui.resetDraw.addEventListener('click', () => SpreadPage.resetSpreadDraw());
    }
    if (ui.toReading) {
      ui.toReading.addEventListener('click', () => {
        if (typeof switchPanel === 'function') {
          switchPanel('reading-section');
        }
        if (typeof prepareReading === 'function') {
          prepareReading();
        }
      });
    }
  }

  function renderSpreadDetails() {
    if (!ui || !appState || !appState.selectedSpread) {
      if (ui && ui.spreadDetails) {
        ui.spreadDetails.innerHTML = '';
      }
      return;
    }

    const { selectedSpread } = appState;
    if (!ui.spreadDetails) {
      return;
    }

    const spreadName = localize(selectedSpread.name, selectedSpread.name);
    const spreadDescription = localize(selectedSpread.description, selectedSpread.description);
    const notDrawnLabel = translate('notYetDrawn', { fallback: '尚未抽牌' });

    ui.spreadDetails.innerHTML = `
      <div class="spread-details__header">
        <h3>${escapeHtml(spreadName)}</h3>
        <p>${escapeHtml(spreadDescription)}</p>
      </div>
      <div class="spread-details__positions">
        ${selectedSpread.positions
          .map(
            (pos, index) => `
              <div class="spread-position" data-position="${pos.id}">
                <div class="spread-position__info">
                  <div class="spread-position__label">${escapeHtml(localize(pos.label, pos.label))} · ${escapeHtml(localize(pos.title, pos.title))}</div>
                  <div class="spread-position__meaning">${escapeHtml(localize(pos.meaning, pos.meaning))}</div>
                </div>
                <div class="spread-position__status" id="position-card-${index}">
                  ${escapeHtml(notDrawnLabel)}
                </div>
              </div>
            `
          )
          .join('')}
      </div>
    `;

    SpreadPage.updatePositionStatus();
}

  function resetDeck() {
    if (!appState || !Array.isArray(appState.deckBlueprint)) {
      return;
    }
    const blueprintCopy = appState.deckBlueprint.map((card) => ({ ...card }));
    const shuffler = typeof window.shuffle === 'function'
      ? window.shuffle
      : (list) => {
          for (let i = list.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
          }
          return list;
        };
    appState.remainingDeck = shuffler(blueprintCopy);
  }

  function updateOrientationLabels() {
    if (!appState || !Array.isArray(appState.spreadDraws)) {
      return;
    }
    appState.spreadDraws.forEach((card) => {
      if (card && card.orientation) {
        card.orientationLabel = getOrientationLabel(card.orientation);
      }
    });
  }

  function drawCard() {
    if (!appState) {
      return null;
    }
    if (!appState.remainingDeck || !appState.remainingDeck.length) {
      resetDeck();
    }
    if (!appState.remainingDeck || !appState.remainingDeck.length) {
      return null;
    }

    const baseCard = appState.remainingDeck.pop();
    const orientation = Math.random() > 0.5 ? 'upright' : 'reversed';
    const orientationLabel = getOrientationLabel(orientation);
    const meaning = orientation === 'upright' ? baseCard.upright : baseCard.reversed;
    const insight = orientation === 'upright' ? baseCard.insights.upright : baseCard.insights.reversed;

    return {
      ...baseCard,
      orientation,
      orientationLabel,
      meaning,
      insight
    };
  }

  function getCardImagePath(card) {
    if (!card) {
      return null;
    }

    if (card.arcana === 'major') {
      const filename = legacyMajorImageMap[card.id];
      return filename ? `${CARD_IMAGE_BASE_PATH}/${filename}` : null;
    }

    if (card.arcana === 'minor') {
      const prefix = suitImagePrefix[card.suit];
      if (!prefix) {
        return null;
      }

      const overrides = minorSuitSuffixOverrides[card.suit] || {};
      const suffix = overrides[card.rank] || minorRankImageSuffix[card.rank];
      return suffix ? `${CARD_IMAGE_BASE_PATH}/${prefix}-${suffix}-2x.jpg` : null;
    }

    return null;
  }

  function buildCardStatusHtml(card, options = {}) {
    if (!card) {
      const label = translate('notYetDrawn', { fallback: '尚未抽牌' });
      return `<span class="card-status__label">${escapeHtml(label)}</span>`;
    }

    const orientationLabel = getOrientationLabel(card.orientation);
    card.orientationLabel = orientationLabel;
    const cardLabel = `${escapeHtml(card.name)} · ${escapeHtml(orientationLabel)}`;
    if (appState && appState.simpleMode) {
      return `<span class="card-status__label">${cardLabel}</span>`;
    }

    const imageHtml = SpreadPage.buildCardImageHtml(card);
    if (!imageHtml) {
      return `<span class="card-status__label">${cardLabel}</span>`;
    }

    const alignClass = options.align === 'right' ? ' card-status--right' : '';
    return `
      <div class="card-status${alignClass}">
        ${imageHtml}
        <span class="card-status__label">${cardLabel}</span>
      </div>
    `.trim();
  }

  function checkDrawCompletion() {
    if (!appState || !Array.isArray(appState.spreadDraws)) {
      return;
    }
    const completed = appState.spreadDraws.every((entry) => entry !== null);
    if (completed) {
      if (ui.drawManual) {
        ui.drawManual.disabled = true;
      }
      if (ui.drawAuto) {
        ui.drawAuto.disabled = true;
      }
      if (ui.toReading) {
        ui.toReading.disabled = false;
      }
    }
  }

  window.SpreadPage = SpreadPage;
})(window);
