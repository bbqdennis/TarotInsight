const state = {
  question: '',
  categories: [],
  recommendedSpreads: [],
  selectedSpread: null,
  spreadDraws: [],
  deckBlueprint: [],
  remainingDeck: [],
  timestamp: null,
  remoteInterpretations: null,
  simpleMode: false,
  showAllSpreads: false,
  interpretationNotice: '',
  interpretationAutoExpand: false,
  interpretationNoticeKey: '',
  interpretationNoticeReplacements: null,
  language: 'english',
  finalReport: null,
  isGeneratingFinalReport: false,
  finalReportError: null
};

const ui = {};

const LANGUAGE_OPTIONS = {
  CHINESE: 'chinese',
  ENGLISH: 'english'
};

function translate(key, replacements = {}) {
  const language = state.language || LANGUAGE_OPTIONS.CHINESE;
  const template =
    (UI_TEXT[language] && UI_TEXT[language][key]) ||
    (UI_TEXT[LANGUAGE_OPTIONS.CHINESE] && UI_TEXT[LANGUAGE_OPTIONS.CHINESE][key]) ||
    '';
  if (!template) {
    if (replacements && typeof replacements.fallback === 'string') {
      return replacements.fallback;
    }
    return '';
  }
  return template.replace(/\{(\w+)\}/g, (match, token) => {
    if (Object.prototype.hasOwnProperty.call(replacements, token)) {
      return replacements[token];
    }
    return match;
  });
}

function getLocalizedText(value, defaultValue = '') {
  if (value == null) {
    return defaultValue;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    const language = state.language || LANGUAGE_OPTIONS.CHINESE;
    if (Object.prototype.hasOwnProperty.call(value, language)) {
      return value[language];
    }
    if (Object.prototype.hasOwnProperty.call(value, LANGUAGE_OPTIONS.CHINESE)) {
      return value[LANGUAGE_OPTIONS.CHINESE];
    }
  }
  return defaultValue;
}

function getOrientationLabelText(orientation = 'upright') {
  return orientation === 'reversed'
    ? translate('orientationReversed', { fallback: '逆位' })
    : translate('orientationUpright', { fallback: '正位' });
}

window.i18n = {
  t: (key, replacements = {}) => translate(key, replacements),
  getLanguage: () => state.language || LANGUAGE_OPTIONS.CHINESE,
  setLanguage,
  getText: (value, defaultValue = '') => getLocalizedText(value, defaultValue)
};

const TAROT_API_ENDPOINT = 'https://n8nautorobot.duckdns.org/webhook/tarot_master';
const TAROT_API_TIMEOUT = 60000;

function escapeHtml(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TAROT_DATA = window.TarotData || {};

const UI_TEXT = TAROT_DATA.uiText || {};

const spreadCatalog = Array.isArray(TAROT_DATA.spreadCatalogZh) ? TAROT_DATA.spreadCatalogZh : [];
const spreadCatalogEN = Array.isArray(TAROT_DATA.spreadCatalogEn) ? TAROT_DATA.spreadCatalogEn : [];
const majorArcana = Array.isArray(TAROT_DATA.majorArcanaZh) ? TAROT_DATA.majorArcanaZh : [];
const majorArcanaEN = Array.isArray(TAROT_DATA.majorArcanaEn) ? TAROT_DATA.majorArcanaEn : [];
const suitMeta = TAROT_DATA.suitMetaZh || {};
const suitMetaEN = TAROT_DATA.suitMetaEn || {};
const minorRankMeta = TAROT_DATA.minorRankMetaZh || {};
const minorRankMetaEN = TAROT_DATA.minorRankMetaEn || {};

function getSpreadCatalogByLanguage(language) {
  return language === LANGUAGE_OPTIONS.ENGLISH ? spreadCatalogEN : spreadCatalog;
}

function getActiveSpreadCatalog() {
  return getSpreadCatalogByLanguage(state.language || LANGUAGE_OPTIONS.CHINESE);
}

function updateSpreadCatalogConsumers() {
  const activeCatalog = getActiveSpreadCatalog();
  if (window.QuestionPage && typeof window.QuestionPage.setCatalog === 'function') {
    window.QuestionPage.setCatalog(activeCatalog);
  }
  if (window.SpreadPage && typeof window.SpreadPage.setCatalog === 'function') {
    window.SpreadPage.setCatalog(activeCatalog);
  }
}

function getMajorArcanaByLanguage(language) {
  return language === LANGUAGE_OPTIONS.ENGLISH ? majorArcanaEN : majorArcana;
}

function getSuitMetaByLanguage(language) {
  return language === LANGUAGE_OPTIONS.ENGLISH ? suitMetaEN : suitMeta;
}

function getMinorRankMetaByLanguage(language) {
  return language === LANGUAGE_OPTIONS.ENGLISH ? minorRankMetaEN : minorRankMeta;
}

function generateDeck(language = state.language || LANGUAGE_OPTIONS.CHINESE) {
  const majors = getMajorArcanaByLanguage(language).map((card) => ({
    ...card,
    keywords: [...card.keywords],
    insights: { ...card.insights }
  }));
  const deck = [...majors];
  const suits = Object.values(getSuitMetaByLanguage(language));
  const rankMeta = getMinorRankMetaByLanguage(language);
  const ranks = Object.keys(rankMeta);
  const isEnglish = language === LANGUAGE_OPTIONS.ENGLISH;

  suits.forEach((suit) => {
    ranks.forEach((rankKey) => {
      const rank = rankMeta[rankKey];
      const id = `${suit.key}-${rankKey}`;
      const name = `${suit.name}${rank.display}（${rank.english} of ${suit.english}）`;
      const keywords = uniqueKeywords([...suit.keywords, ...rank.keywords]);
      const themeForSentence = isEnglish
        ? `${suit.theme.charAt(0).toLowerCase()}${suit.theme.slice(1)}`
        : suit.theme;
      const upright = isEnglish
        ? `${rank.upright} This energy extends into ${themeForSentence}, symbolising ${suit.uprightContext}.`
        : `${rank.upright} 這股能量延伸到${suit.theme}，象徵${suit.uprightContext}。`;
      const reversed = isEnglish
        ? `${rank.reversed} Within the realm of ${themeForSentence}, it indicates ${suit.reversedContext}.`
        : `${rank.reversed} 在${suit.theme}上，顯示${suit.reversedContext}。`;
      const detail = `${rank.detail} ${suit.detail}`.trim();
      const insights = {
        upright: `${rank.insights.upright} ${suit.insights.upright}`.trim(),
        reversed: `${rank.insights.reversed} ${suit.insights.reversed}`.trim()
      };

      deck.push({
        id,
        name,
        arcana: 'minor',
        suit: suit.key,
        rank: rankKey,
        keywords: [...keywords],
        upright,
        reversed,
        detail,
        insights: { ...insights }
      });
    });
  });

  return deck;
}

function uniqueKeywords(list) {
  return [...new Set(list)];
}

function shuffle(list) {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function refreshDeckForLanguage(language) {
  const targetLanguage = language || state.language || LANGUAGE_OPTIONS.CHINESE;
  const previousDraws = Array.isArray(state.spreadDraws) ? [...state.spreadDraws] : null;
  const previousRemaining = Array.isArray(state.remainingDeck) ? [...state.remainingDeck] : null;

  const newDeck = generateDeck(targetLanguage);
  const deckMap = new Map(newDeck.map((card) => [card.id, card]));

  state.deckBlueprint = newDeck;

  if (previousRemaining && previousRemaining.length) {
    state.remainingDeck = previousRemaining
      .map((card) => {
        if (!card) {
          return null;
        }
        const base = deckMap.get(card.id);
        return base ? { ...base } : null;
      })
      .filter((card) => card !== null);
    if (!state.remainingDeck.length) {
      state.remainingDeck = newDeck.map((card) => ({ ...card }));
    }
  } else {
    state.remainingDeck = newDeck.map((card) => ({ ...card }));
  }

  if (previousDraws && previousDraws.length) {
    state.spreadDraws = previousDraws.map((card) => {
      if (!card) {
        return card;
      }
      const base = deckMap.get(card.id);
      if (!base) {
        return null;
      }
      const orientation = card.orientation || 'upright';
      const orientationLabel = getOrientationLabelText(orientation);
      const meaning = orientation === 'upright' ? base.upright : base.reversed;
      const insight = orientation === 'upright' ? base.insights.upright : base.insights.reversed;
      return {
        ...base,
        keywords: [...base.keywords],
        insights: { ...base.insights },
        orientation,
        orientationLabel,
        meaning,
        insight
      };
    });
  }
}

function initializeApp() {
  cacheElements();
  initializeLanguage();
  refreshDeckForLanguage(state.language);
  attachEventListeners();
  updateSimpleModeToggle();
  const activeSpreadCatalog = getActiveSpreadCatalog();
  if (window.ReadingPage && typeof window.ReadingPage.init === 'function') {
    window.ReadingPage.init({
      state,
      ui,
      switchPanel,
      api: {
        endpoint: TAROT_API_ENDPOINT,
        timeout: TAROT_API_TIMEOUT
      }
    });
  }
  if (window.SpreadPage && typeof window.SpreadPage.init === 'function') {
    window.SpreadPage.init({
      state,
      ui,
      spreadCatalog: activeSpreadCatalog,
      switchPanel,
      prepareReading:
        window.ReadingPage && typeof window.ReadingPage.prepareReading === 'function'
          ? window.ReadingPage.prepareReading
          : undefined
    });
  }
  if (window.QuestionPage && typeof window.QuestionPage.init === 'function') {
    window.QuestionPage.init({
      state,
      ui,
      spreadCatalog: activeSpreadCatalog,
      selectSpread:
        window.SpreadPage && typeof window.SpreadPage.selectSpread === 'function'
          ? window.SpreadPage.selectSpread
          : undefined,
      switchPanel
    });
  }
  if (window.ReportPage && typeof window.ReportPage.init === 'function') {
    window.ReportPage.init({
      state,
      ui,
      switchPanel,
      getCategories: () => getCategoryDisplay(),
      getTimestamp: () => formatTimestamp(state.timestamp)
    });
  }
  setCurrentYear();
  notifyLanguageChange();
}

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeLanguage() {
  const langAttr = state.language === LANGUAGE_OPTIONS.ENGLISH ? 'en' : 'zh-Hant';
  document.documentElement.setAttribute('lang', langAttr);
  updateLanguageControls();
  applyLanguageToStaticText();
}

function cacheElements() {
  ui.appTitle = document.getElementById('app-title');
  ui.appDescription = document.getElementById('app-description');
  ui.languageButtons = Array.from(document.querySelectorAll('[data-language-option]'));
  ui.questionSectionTitle = document.getElementById('question-section-title');
  ui.questionSectionDescription = document.getElementById('question-section-description');
  ui.questionLabel = document.querySelector('label[for="user-question"]');
  ui.spreadSectionTitle = document.getElementById('spread-section-title');
  ui.spreadSectionDescription = document.getElementById('spread-section-description');
  ui.questionTextarea = document.getElementById('user-question');
  ui.submitQuestion = document.getElementById('submit-question');
  ui.skipQuestion = document.getElementById('skip-question');
  ui.analysisResult = document.getElementById('analysis-result');
  ui.recommendedSpreads = document.getElementById('recommended-spreads');
  ui.panels = Array.from(document.querySelectorAll('.panel'));
  ui.toggleSimpleMode = document.getElementById('toggle-simple-mode');
  ui.spreadCaption = document.getElementById('selected-spread-caption');
  ui.spreadDetails = document.getElementById('spread-details');
  ui.drawManual = document.getElementById('draw-manual');
  ui.drawAuto = document.getElementById('draw-auto');
  ui.resetDraw = document.getElementById('reset-draw');
  ui.toReading = document.getElementById('to-reading');
  ui.backToQuestionButtons = Array.from(document.querySelectorAll('[data-action="back-to-question"]'));
  ui.backToDrawButtons = Array.from(document.querySelectorAll('[data-action="back-to-draw"]'));
  ui.backToReadingButtons = Array.from(document.querySelectorAll('[data-action="back-to-reading"]'));
  ui.startOverButtons = Array.from(document.querySelectorAll('[data-action="start-over"]'));
  ui.readingOverview = document.getElementById('reading-overview');
  ui.cardInterpretations = document.getElementById('card-interpretations');
  ui.toReport = document.getElementById('to-report');
  ui.reportSummary = document.getElementById('report-summary');
  ui.readingSectionTitle = document.getElementById('reading-section-title');
  ui.readingSectionDescription = document.getElementById('reading-section-description');
  ui.reportSectionTitle = document.getElementById('report-section-title');
  ui.reportSectionDescription = document.getElementById('report-section-description');
  ui.downloadReport = document.getElementById('download-report');
  ui.copyReport = document.getElementById('copy-report');
  ui.shareLine = document.getElementById('share-line');
  ui.shareEmail = document.getElementById('share-email');
  ui.footerNote = document.getElementById('footer-note');
  ui.lightbox = document.getElementById('card-lightbox');
  ui.lightboxImage = document.getElementById('card-lightbox-image');
  ui.lightboxCaption = document.getElementById('card-lightbox-caption');
  ui.lightboxClose = document.querySelector('[data-lightbox-action="close"]');
  ui.currentYear = document.getElementById('current-year');
}

function attachEventListeners() {
  if (ui.toggleSimpleMode) {
    ui.toggleSimpleMode.addEventListener('click', toggleSimpleMode);
  }

  if (ui.languageButtons && ui.languageButtons.length) {
    ui.languageButtons.forEach((button) => {
      button.addEventListener('click', handleLanguageSwitch);
    });
  }

  if (ui.shareLine) {
    ui.shareLine.addEventListener('click', handleShareLine);
  }
  if (ui.shareEmail) {
    ui.shareEmail.addEventListener('click', handleShareEmail);
  }

  if (ui.backToQuestionButtons) {
    ui.backToQuestionButtons.forEach((btn) => {
      btn.addEventListener('click', () => switchPanel('question-section'));
    });
  }
  if (ui.backToDrawButtons) {
    ui.backToDrawButtons.forEach((btn) => {
      btn.addEventListener('click', () => switchPanel('spread-section'));
    });
  }
  if (ui.backToReadingButtons) {
    ui.backToReadingButtons.forEach((btn) => {
      btn.addEventListener('click', () => switchPanel('reading-section'));
    });
  }
  if (ui.startOverButtons) {
    ui.startOverButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        resetAll();
        switchPanel('question-section');
      });
    });
  }

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleDocumentKeydown);
}

function toggleSimpleMode() {
  state.simpleMode = !state.simpleMode;
  updateSimpleModeToggle();
  if (window.SpreadPage && typeof window.SpreadPage.updatePositionStatus === 'function') {
    window.SpreadPage.updatePositionStatus();
  }
  if (state.simpleMode) {
    closeCardLightbox();
  }

  if (!state.selectedSpread) {
    return;
  }

  const options = {};
  if (state.interpretationAutoExpand) {
    options.autoExpand = true;
  }
  if (state.interpretationNoticeKey) {
    options.messageKey = state.interpretationNoticeKey;
    if (state.interpretationNoticeReplacements) {
      options.replacements = state.interpretationNoticeReplacements;
    }
  } else if (state.interpretationNotice) {
    options.message = state.interpretationNotice;
  }
  if (window.ReadingPage && typeof window.ReadingPage.renderCardInterpretations === 'function') {
    window.ReadingPage.renderCardInterpretations(undefined, options);
  }
}

function updateSimpleModeToggle() {
  if (!ui.toggleSimpleMode) {
    return;
  }

  if (state.simpleMode) {
    ui.toggleSimpleMode.textContent = translate('simpleModeToVisual');
    ui.toggleSimpleMode.setAttribute('aria-pressed', 'false');
  } else {
    ui.toggleSimpleMode.textContent = translate('simpleModeToSimple');
    ui.toggleSimpleMode.setAttribute('aria-pressed', 'true');
  }
}

function handleLanguageSwitch(event) {
  const target = event.currentTarget;
  if (!target) {
    return;
  }
  const option = target.getAttribute('data-language-option');
  if (!option) {
    return;
  }
  setLanguage(option);
}

function setLanguage(language) {
  if (!language || !Object.values(LANGUAGE_OPTIONS).includes(language)) {
    return;
  }
  if (state.language === language) {
    return;
  }
  state.language = language;
  document.documentElement.setAttribute('lang', language === LANGUAGE_OPTIONS.ENGLISH ? 'en' : 'zh-Hant');
  refreshDeckForLanguage(language);
  updateLanguageControls();
  notifyLanguageChange();
}

function updateLanguageControls() {
  if (!ui.languageButtons) {
    return;
  }
  ui.languageButtons.forEach((button) => {
    const option = button.getAttribute('data-language-option');
    const selected = option === state.language;
    if (selected) {
      button.classList.add('is-active');
    } else {
      button.classList.remove('is-active');
    }
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}

function applyLanguageToStaticText() {
  if (ui.languageButtons && ui.languageButtons.length) {
    ui.languageButtons.forEach((button) => {
      const option = button.getAttribute('data-language-option');
      if (option === LANGUAGE_OPTIONS.CHINESE) {
        button.textContent = translate('languageChinese');
      } else if (option === LANGUAGE_OPTIONS.ENGLISH) {
        button.textContent = translate('languageEnglish');
      }
    });
  }
  if (ui.appTitle) {
    ui.appTitle.textContent = translate('appTitle');
  }
  if (ui.appDescription) {
    ui.appDescription.textContent = translate('appDescription');
  }
  if (ui.questionSectionTitle) {
    ui.questionSectionTitle.textContent = translate('questionSectionTitle');
  }
  if (ui.questionSectionDescription) {
    ui.questionSectionDescription.textContent = translate('questionSectionDescription');
  }
  if (ui.questionLabel) {
    ui.questionLabel.textContent = translate('questionLabel');
  }
  if (ui.questionTextarea) {
    ui.questionTextarea.placeholder = translate('questionPlaceholder');
  }
  if (ui.submitQuestion) {
    ui.submitQuestion.textContent = translate('submitQuestion');
  }
  if (ui.skipQuestion) {
    ui.skipQuestion.textContent = translate('skipQuestion');
  }
  if (ui.spreadSectionTitle) {
    ui.spreadSectionTitle.textContent = translate('spreadSectionTitle');
  }
  if (ui.spreadSectionDescription) {
    ui.spreadSectionDescription.textContent = translate('spreadSectionDescription');
  }
  if (!state.selectedSpread && ui.spreadCaption) {
    ui.spreadCaption.textContent = translate('spreadPromptSelect');
  }
  if (ui.readingSectionTitle) {
    ui.readingSectionTitle.textContent = translate('readingSectionTitle');
  }
  if (ui.readingSectionDescription) {
    ui.readingSectionDescription.textContent = translate('readingSectionDescription');
  }
  if (ui.reportSectionTitle) {
    ui.reportSectionTitle.textContent = translate('reportSectionTitle');
  }
  if (ui.reportSectionDescription) {
    ui.reportSectionDescription.textContent = translate('reportSectionDescription');
  }
  if (ui.drawManual) {
    ui.drawManual.textContent = translate('drawManual');
  }
  if (ui.drawAuto) {
    ui.drawAuto.textContent = translate('drawAuto');
  }
  if (ui.resetDraw) {
    ui.resetDraw.textContent = translate('resetDraw');
  }
  if (ui.toReading) {
    ui.toReading.textContent = translate('toReading');
  }
  if (ui.backToQuestionButtons && ui.backToQuestionButtons.length) {
    ui.backToQuestionButtons.forEach((button) => {
      button.textContent = translate('backToQuestion');
    });
  }
  if (ui.toReport) {
    ui.toReport.textContent = translate('toReport');
  }
  if (ui.backToDrawButtons && ui.backToDrawButtons.length) {
    ui.backToDrawButtons.forEach((button) => {
      button.textContent = translate('backToDraw');
    });
  }
  if (ui.downloadReport) {
    ui.downloadReport.textContent = translate('downloadReport');
  }
  if (ui.copyReport) {
    ui.copyReport.textContent = translate('copyReport');
  }
  if (ui.shareLine) {
    ui.shareLine.textContent = translate('shareLine');
  }
  if (ui.shareEmail) {
    ui.shareEmail.textContent = translate('shareEmail');
  }
  if (ui.backToReadingButtons && ui.backToReadingButtons.length) {
    ui.backToReadingButtons.forEach((button) => {
      button.textContent = translate('backToReading');
    });
  }
  if (ui.startOverButtons && ui.startOverButtons.length) {
    ui.startOverButtons.forEach((button) => {
      button.textContent = translate('startOver');
    });
  }
  if (ui.footerNote) {
    ui.footerNote.textContent = translate('footerNote');
  }
  if (ui.lightboxClose) {
    ui.lightboxClose.setAttribute('aria-label', translate('cardLightboxClose'));
  }
}

function notifyLanguageChange() {
  applyLanguageToStaticText();
  updateSimpleModeToggle();
  updateSpreadCatalogConsumers();
  if (window.QuestionPage && typeof window.QuestionPage.handleLanguageChange === 'function') {
    window.QuestionPage.handleLanguageChange();
  }
  if (window.SpreadPage && typeof window.SpreadPage.handleLanguageChange === 'function') {
    window.SpreadPage.handleLanguageChange();
  }
  if (window.ReadingPage && typeof window.ReadingPage.handleLanguageChange === 'function') {
    window.ReadingPage.handleLanguageChange();
  }
  if (window.ReportPage && typeof window.ReportPage.handleLanguageChange === 'function') {
    window.ReportPage.handleLanguageChange();
  }
}

function handleDocumentClick(event) {
  const actionTarget = event.target.closest('[data-lightbox-action]');
  if (actionTarget) {
    event.preventDefault();
    closeCardLightbox();
    return;
  }

  const imageTarget = event.target.closest('.js-card-image');
  if (!imageTarget || state.simpleMode) {
    return;
  }

  const src = imageTarget.getAttribute('data-full-src') || imageTarget.getAttribute('src');
  if (!src) {
    return;
  }
  const label = imageTarget.getAttribute('data-card-label') || imageTarget.getAttribute('alt') || '';
  const orientation = imageTarget.getAttribute('data-orientation') || 'upright';
  openCardLightbox(src, label, orientation);
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') {
    closeCardLightbox();
  }
}

function openCardLightbox(src, label, orientation = 'upright') {
  if (state.simpleMode) {
    return;
  }
  if (!ui.lightbox || !ui.lightboxImage) {
    return;
  }

  ui.lightboxImage.src = src;
  ui.lightboxImage.alt = label || '';
  ui.lightboxImage.classList.toggle('is-reversed', orientation === 'reversed');

  if (ui.lightboxCaption) {
    ui.lightboxCaption.textContent = label || '';
    ui.lightboxCaption.style.display = label ? 'block' : 'none';
  }

  ui.lightbox.removeAttribute('hidden');
  ui.lightbox.classList.add('active');
  ui.lightbox.setAttribute('aria-hidden', 'false');
}

function closeCardLightbox() {
  if (!ui.lightbox || !ui.lightboxImage) {
    return;
  }

  ui.lightbox.classList.remove('active');
  ui.lightbox.setAttribute('aria-hidden', 'true');
  ui.lightbox.setAttribute('hidden', '');
  ui.lightboxImage.classList.remove('is-reversed');
  ui.lightboxImage.removeAttribute('src');
  ui.lightboxImage.alt = '';
  if (ui.lightboxCaption) {
    ui.lightboxCaption.textContent = '';
    ui.lightboxCaption.style.display = 'none';
  }
}

function handleShareLine() {
  const text = encodeURIComponent(buildShareText());
  const url = `https://social-plugins.line.me/lineit/share?text=${text}`;
  window.open(url, '_blank', 'noopener');
}

function handleShareEmail() {
  const subject = encodeURIComponent(translate('emailSubject'));
  const body = encodeURIComponent(buildShareText());
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function buildReportCopyText() {
  if (window.ReportPage && typeof window.ReportPage.buildCopyText === 'function') {
    return window.ReportPage.buildCopyText();
  }
  return '';
}

async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        resolve();
      } else {
        reject(new Error('document.execCommand returned false'));
      }
    } catch (error) {
      document.body.removeChild(textarea);
      reject(error);
    }
  });
}

function buildShareText() {
  if (window.ReportPage && typeof window.ReportPage.buildShareText === 'function') {
    return window.ReportPage.buildShareText();
  }
  if (!state.selectedSpread) {
    return translate('shareDefault');
  }
  const lines = [];
  lines.push(translate('shareTitle'));
  lines.push(translate('shareSite'));
  if (state.question) {
    lines.push(`${translate('shareQuestionLabel')}${state.question}`);
  }
  const spreadName = getLocalizedText(state.selectedSpread.name, state.selectedSpread.name);
  lines.push(`${translate('shareSpreadLabel')}${spreadName}`);
  lines.push(`${translate('shareCategoryLabel')}${getCategoryDisplay()}`);
  state.selectedSpread.positions.forEach((pos, index) => {
    const card = state.spreadDraws[index];
    if (!card) return;
    const positionTitle = getLocalizedText(pos.title, pos.title);
    const cardName = card.name;
    lines.push(`${positionTitle}｜${cardName}（${card.orientationLabel}）：${card.meaning}`);
  });
  return lines.join('\n');
}

function resetAll() {
  state.question = '';
  state.categories = [];
  state.recommendedSpreads = [];
  state.selectedSpread = null;
  state.spreadDraws = [];
  state.timestamp = null;
  state.remoteInterpretations = null;
  state.simpleMode = false;
  state.showAllSpreads = false;
  state.interpretationNotice = '';
  state.interpretationAutoExpand = false;
  state.interpretationNoticeKey = '';
  state.interpretationNoticeReplacements = null;
  state.finalReport = null;
  state.isGeneratingFinalReport = false;
  state.finalReportError = null;
  if (window.QuestionPage && typeof window.QuestionPage.reset === 'function') {
    window.QuestionPage.reset();
  } else {
    if (ui.questionTextarea) {
      ui.questionTextarea.value = '';
    }
    if (ui.analysisResult) {
      ui.analysisResult.textContent = '';
      ui.analysisResult.classList.remove('active');
    }
    if (ui.recommendedSpreads) {
      ui.recommendedSpreads.innerHTML = '';
    }
  }
  if (window.ReadingPage && typeof window.ReadingPage.reset === 'function') {
    window.ReadingPage.reset();
  }
  if (window.ReportPage && typeof window.ReportPage.reset === 'function') {
    window.ReportPage.reset();
  }
  if (window.SpreadPage && typeof window.SpreadPage.reset === 'function') {
    window.SpreadPage.reset();
  } else {
    if (ui.spreadCaption) {
      ui.spreadCaption.textContent = translate('spreadPromptSelect');
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
    state.remainingDeck = shuffle(state.deckBlueprint.map((card) => ({ ...card })));
  }
  ui.readingOverview.innerHTML = '';
  ui.cardInterpretations.innerHTML = '';
  ui.reportSummary.innerHTML = '';
  closeCardLightbox();
  updateSimpleModeToggle();
}

function switchPanel(panelId) {
  ui.panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === panelId);
  });
}

function setCurrentYear() {
  if (ui.currentYear) {
    ui.currentYear.textContent = new Date().getFullYear();
  }
}

function formatTimestamp(date) {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function getCategoryDisplay() {
  if (window.QuestionPage && typeof window.QuestionPage.getCategoryDisplay === 'function') {
    return window.QuestionPage.getCategoryDisplay();
  }
  if (!state.categories || !state.categories.length) {
    return '通用';
  }
  const mapping = {
    love: '感情 / 關係',
    career: '工作 / 職涯',
    finance: '財務 / 物質',
    health: '健康 / 身心',
    self: '自我成長',
    study: '學習 / 考試',
    general: '通用'
  };
  return state.categories.map((category) => mapping[category] || category).join('、');
}
