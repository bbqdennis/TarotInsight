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
  language: 'english'
};

const ui = {};

const LANGUAGE_OPTIONS = {
  CHINESE: 'chinese',
  ENGLISH: 'english'
};

const UI_TEXT = {
  chinese: {
    languageChinese: '中文',
    languageEnglish: 'English',
    simpleModeToVisual: '切換至圖像模式',
    simpleModeToSimple: '切換至簡化模式',
    cardLightboxClose: '關閉卡牌放大視圖',
    loadingInterpretations: '正在生成解牌內容...',
    remoteUnavailable: '目前無法連線取得線上解析，以下為基礎解讀。',
    remoteEmpty: '暫無線上解牌結果，以下為基本解析。',
    interpretationToggleExpand: '查看更多',
    interpretationToggleCollapse: '收合詳解',
    copySuccess: '報告已複製至剪貼簿！',
    copyFailure: '複製失敗，請再試一次。',
    shareTitle: 'Tarot Insight 解牌師 - 占卜重點',
    shareSite: '主站：https://tarotmaster.netlify.app',
    shareQuestionLabel: '提問：',
    shareSpreadLabel: '牌陣：',
    shareCategoryLabel: '主題：',
    shareDefault: 'Tarot Insight 解牌師 - 歡迎體驗完整的解牌流程。',
    spreadPromptSelect: '請先選擇適合的牌陣。',
    emailSubject: 'Tarot Insight 解牌師｜我的解牌報告',
    appTitle: 'Tarot Insight 解牌師',
    appDescription: '從提問、牌陣推薦、抽牌到解牌報告，一次完成的塔羅占卜體驗。',
    questionSectionTitle: '提問與牌陣推薦',
    questionSectionDescription: '輸入你的問題，我們會為你分析主題並推薦最適合的牌陣。',
    questionLabel: '你想探索的問題是什麼？',
    questionPlaceholder: '範例：我和伴侶未來的發展如何？',
    submitQuestion: '送出問題',
    skipQuestion: '直接選擇牌陣',
    spreadSectionTitle: '牌陣說明與抽牌',
    spreadSectionDescription: '瀏覽牌陣資訊並開始抽牌。',
    readingSectionTitle: '解牌結果',
    readingSectionDescription: '依照牌陣位置逐一呈現每張牌的意義與洞察。',
    reportSectionTitle: '解牌報告',
    reportSectionDescription: '整理本次占卜的重點，方便儲存、分享或列印。',
    drawManual: '抽取下一張牌',
    drawAuto: '自動抽牌',
    resetDraw: '重新洗牌',
    toReading: '前往解牌',
    backToQuestion: '返回提問',
    toReport: '生成解牌報告',
    backToDraw: '返回抽牌',
    downloadReport: '下載 PDF',
    copyReport: '複製報告',
    shareLine: '分享至 LINE',
    shareEmail: '分享至 Email',
    backToReading: '返回解牌',
    startOver: '重新提問',
    footerNote: 'Tarot Insight 解牌師 · 為心之所問提供清晰指引。',
    analysisSummary: '問題主題傾向：<strong>{categories}</strong>。已為你挑選最契合的牌陣。',
    spreadCardCountLabel: '共 {count} 張',
    chooseSpread: '選擇此牌陣',
    readingSummaryMeta: '共 {count} 張牌 · 問題主題：{category}',
    questionLine: '提問：「{question}」',
    notYetDrawn: '尚未抽牌',
    orientationUpright: '正位',
    orientationReversed: '逆位',
    spreadSelectedCaption: '已選擇：{spread}',
    reportQuestionLabel: '提問：{question}',
    reportMetaLine: '時間：{time} · 主題：{category}',
    reportCopyHeader: 'Tarot Insight 解牌師 - 解牌報告',
    reportShareHeader: 'Tarot Insight 解牌師 - 占卜重點',
    reportTimeLabel: '時間：{time}',
    reportCardLabel: '卡牌：{card}',
    reportSummaryLabel: '重點：{summary}',
    reportAdviceLabel: '建議：{advice}',
    reportCopyButtonSuccess: '已複製',
    reportCopyButtonFailure: '複製失敗'
  },
  english: {
    languageChinese: '中文',
    languageEnglish: 'English',
    simpleModeToVisual: 'Switch to Visual Mode',
    simpleModeToSimple: 'Switch to Simple Mode',
    cardLightboxClose: 'Close card lightbox view',
    loadingInterpretations: 'Generating interpretations...',
    remoteUnavailable: 'Unable to retrieve online insights right now. Showing base interpretation.',
    remoteEmpty: 'No online interpretation is available yet. Showing base interpretation.',
    interpretationToggleExpand: 'View more',
    interpretationToggleCollapse: 'Collapse details',
    copySuccess: 'Report copied to clipboard!',
    copyFailure: 'Copy failed, please try again.',
    shareTitle: 'Tarot Insight Reader - Key Messages',
    shareSite: 'Site: https://tarotmaster.netlify.app',
    shareQuestionLabel: 'Question: ',
    shareSpreadLabel: 'Spread: ',
    shareCategoryLabel: 'Theme: ',
    shareDefault: 'Tarot Insight Reader - Explore the full reading journey.',
    spreadPromptSelect: 'Please select a spread first.',
    emailSubject: 'Tarot Insight Reader | My Tarot Report',
    appTitle: 'Tarot Insight Reader',
    appDescription:
      'From question analysis to spread guidance, drawing, and reporting — a complete tarot journey.',
    questionSectionTitle: 'Questions & Spread Suggestions',
    questionSectionDescription:
      'Share your question and we will analyze its theme to suggest the best spreads.',
    questionLabel: 'What would you like to explore?',
    questionPlaceholder: 'Example: How will my relationship with my partner develop?',
    submitQuestion: 'Submit Question',
    skipQuestion: 'Choose a Spread Directly',
    spreadSectionTitle: 'Spread Details & Drawing',
    spreadSectionDescription: 'Review the spread information and draw your cards.',
    readingSectionTitle: 'Reading Results',
    readingSectionDescription: 'See each position’s meaning and insight step by step.',
    reportSectionTitle: 'Reading Report',
    reportSectionDescription: 'Summarize key messages for saving, sharing, or printing.',
    drawManual: 'Draw Next Card',
    drawAuto: 'Draw Automatically',
    resetDraw: 'Shuffle Again',
    toReading: 'Go to Interpretation',
    backToQuestion: 'Back to Questions',
    toReport: 'Generate Report',
    backToDraw: 'Back to Drawing',
    downloadReport: 'Download PDF',
    copyReport: 'Copy Report',
    shareLine: 'Share to LINE',
    shareEmail: 'Share via Email',
    backToReading: 'Back to Interpretation',
    startOver: 'Start Over',
    footerNote: 'Tarot Insight Reader · Guiding your heart with clarity.',
    analysisSummary: 'Dominant themes: <strong>{categories}</strong>. Here are your best-matched spreads.',
    spreadCardCountLabel: 'Total {count} cards',
    chooseSpread: 'Use This Spread',
    readingSummaryMeta: 'Total {count} cards · Theme: {category}',
    questionLine: 'Question: “{question}”',
    notYetDrawn: 'Not drawn yet',
    orientationUpright: 'Upright',
    orientationReversed: 'Reversed',
    spreadSelectedCaption: 'Selected: {spread}',
    reportQuestionLabel: 'Question: “{question}”',
    reportMetaLine: 'Time: {time} · Theme: {category}',
    reportCopyHeader: 'Tarot Insight Reader - Reading Report',
    reportShareHeader: 'Tarot Insight Reader - Key Highlights',
    reportTimeLabel: 'Time: {time}',
    reportCardLabel: 'Card: {card}',
    reportSummaryLabel: 'Insight: {summary}',
    reportAdviceLabel: 'Advice: {advice}',
    reportCopyButtonSuccess: 'Copied',
    reportCopyButtonFailure: 'Copy failed'
  }
};

function translate(key, replacements = {}) {
  const language = state.language || LANGUAGE_OPTIONS.CHINESE;
  const template =
    (UI_TEXT[language] && UI_TEXT[language][key]) ||
    (UI_TEXT[LANGUAGE_OPTIONS.CHINESE] && UI_TEXT[LANGUAGE_OPTIONS.CHINESE][key]) ||
    '';
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

const spreadCatalog = [
  {
    id: 'daily-oracle',
    name: '每日運勢牌',
    description: '以一張牌快速感受今日的能量焦點與提醒，適合日常啟發。',
    cardCount: 1,
    highlight: '今日提醒',
    theme: 'direction',
    recommendedFor: ['general', 'self', 'love', 'career'],
    positions: [
      { id: 'd1', label: '位置 1', title: '今日訊息', meaning: '此刻最需要留意的能量、行動或心態。' }
    ]
  },
  {
    id: 'three-card',
    name: '三張牌洞察陣',
    description: '快速釐清過去、現在與未來，適合多數一般性問題。',
    cardCount: 3,
    highlight: '過去 / 現在 / 未來',
    theme: 'analysis',
    recommendedFor: ['general', 'career', 'self', 'health', 'finance'],
    positions: [
      { id: 'p1', label: '位置 1', title: '過去', meaning: '影響目前狀況的背景、起因與基礎信念。' },
      { id: 'p2', label: '位置 2', title: '現在', meaning: '目前顯化的狀況、挑戰與可掌握的資源。' },
      { id: 'p3', label: '位置 3', title: '未來', meaning: '若持續現狀，近期可能發展的方向與提醒。' }
    ]
  },
  {
    id: 'celtic-cross',
    name: '塞爾特十字牌陣',
    description: '完整拆解事件核心、周遭影響與長期趨勢，適合重大決策。',
    cardCount: 10,
    highlight: '全方位解析',
    theme: 'analysis',
    recommendedFor: ['career', 'love', 'self', 'finance'],
    positions: [
      { id: 'c1', label: '位置 1', title: '現況', meaning: '眼前最核心的議題與能量。' },
      { id: 'c2', label: '位置 2', title: '阻力', meaning: '對立力量、阻礙或核心課題。' },
      { id: 'c3', label: '位置 3', title: '意識', meaning: '你主動意識到的想法與目標。' },
      { id: 'c4', label: '位置 4', title: '潛意識', meaning: '隱藏動機、情緒與未被看見的需求。' },
      { id: 'c5', label: '位置 5', title: '過去根源', meaning: '形成現況的過往事件或價值觀。' },
      { id: 'c6', label: '位置 6', title: '近期未來', meaning: '即將浮現的狀態、行動或機會。' },
      { id: 'c7', label: '位置 7', title: '自我態度', meaning: '你面對此事的姿態、選擇與能力。' },
      { id: 'c8', label: '位置 8', title: '外在影響', meaning: '環境、人際或制度層面的作用。' },
      { id: 'c9', label: '位置 9', title: '盼望與恐懼', meaning: '內在渴望與擔憂之間的拉鋸。' },
      { id: 'c10', label: '位置 10', title: '結果趨勢', meaning: '綜合能量之下，潛在的未來走向。' }
    ]
  },
  {
    id: 'either-or',
    name: '二選一決策陣',
    description: '比較兩個選項的動能、收穫與風險，幫助你看見更清晰的抉擇方向。',
    cardCount: 6,
    highlight: '對照選項',
    theme: 'analysis',
    recommendedFor: ['career', 'love', 'finance', 'general'],
    positions: [
      { id: 'e1', label: '位置 1', title: '核心議題', meaning: '目前情境的本質與決策關鍵。' },
      { id: 'e2', label: '位置 2', title: '選項 A 優勢', meaning: '選項 A 能帶來的主要收穫與支持。' },
      { id: 'e3', label: '位置 3', title: '選項 A 提醒', meaning: '採取選項 A 需要留意的限制與風險。' },
      { id: 'e4', label: '位置 4', title: '選項 B 優勢', meaning: '選項 B 能帶來的可能性與資源。' },
      { id: 'e5', label: '位置 5', title: '選項 B 提醒', meaning: '採取選項 B 需要注意的隱憂與代價。' },
      { id: 'e6', label: '位置 6', title: '整體建議', meaning: '綜合以上資訊，協助你做出最合適的決定。' }
    ]
  },
  {
    id: 'triple-choice',
    name: '三選一策略陣',
    description: '同時評估三種方案的優勢、挑戰與未來走勢，找到最貼合當下的方向。',
    cardCount: 8,
    highlight: '多方案評估',
    theme: 'analysis',
    recommendedFor: ['career', 'study', 'general', 'self'],
    positions: [
      { id: 't1', label: '位置 1', title: '現在定位', meaning: '你目前所處的整體狀態與核心需求。' },
      { id: 't2', label: '位置 2', title: '方案一契合點', meaning: '方案一最有利的能量與可能帶來的發展。' },
      { id: 't3', label: '位置 3', title: '方案一提醒', meaning: '導入方案一時需要特別注意的課題。' },
      { id: 't4', label: '位置 4', title: '方案二契合點', meaning: '方案二的核心優勢與支持能量。' },
      { id: 't5', label: '位置 5', title: '方案二提醒', meaning: '採用方案二可能遇到的挑戰與成本。' },
      { id: 't6', label: '位置 6', title: '方案三契合點', meaning: '方案三的亮點與可帶來的發展契機。' },
      { id: 't7', label: '位置 7', title: '方案三提醒', meaning: '導入方案三需要留心的限制與代價。' },
      { id: 't8', label: '位置 8', title: '整體指引', meaning: '綜觀三個方案後，最支持你的思維與行動方向。' }
    ]
  },
  {
    id: 'persona-insight',
    name: '人格剖析陣',
    description: '深入剖析一個人的內外在特質，辨識優勢與盲點，適合自我覺察或評估人際互動。',
    cardCount: 5,
    highlight: '內外在透視',
    theme: 'inner',
    recommendedFor: ['self', 'love', 'career', 'general'],
    positions: [
      { id: 'p1', label: '位置 1', title: '外在面貌', meaning: '他人眼中對此人的印象與行為表現。' },
      { id: 'p2', label: '位置 2', title: '內在真我', meaning: '此人內心最真實的渴望與動機。' },
      { id: 'p3', label: '位置 3', title: '優勢天賦', meaning: '天生擁有的長處與可發揮的能力。' },
      { id: 'p4', label: '位置 4', title: '潛在挑戰', meaning: '容易忽略的盲點、限制或防衛模式。' },
      { id: 'p5', label: '位置 5', title: '靈魂課題', meaning: '當下最需要面對並整合的成長方向。' }
    ]
  },
  {
    id: 'life-purpose',
    name: '人生使命藍圖陣',
    description: '探索靈魂目標、潛能與行動方向，協助在轉折期釐清長期願景。',
    cardCount: 6,
    highlight: '靈魂地圖',
    theme: 'direction',
    recommendedFor: ['self', 'career', 'study', 'general'],
    positions: [
      { id: 'l1', label: '位置 1', title: '現時身份', meaning: '目前你正在扮演的角色與狀態。' },
      { id: 'l2', label: '位置 2', title: '靈魂呼喚', meaning: '內心深處真正渴望的方向與使命。' },
      { id: 'l3', label: '位置 3', title: '潛在天賦', meaning: '尚待發揮的能力、才華與資源。' },
      { id: 'l4', label: '位置 4', title: '當前障礙', meaning: '阻礙你實現願景的關鍵課題。' },
      { id: 'l5', label: '位置 5', title: '支援力量', meaning: '可依靠的人脈、資源或精神支持。' },
      { id: 'l6', label: '位置 6', title: '使命之路', meaning: '前行方向與最終目標的核心提示。' }
    ]
  },
  {
    id: 'year-ahead',
    name: '年度預測陣',
    description: '一次檢視未來十二個月的能量與主題，適合訂立新年或生日年度計畫。',
    cardCount: 13,
    highlight: '12 個月洞察',
    theme: 'direction',
    recommendedFor: ['general', 'self', 'career', 'finance'],
    positions: [
      { id: 'y1', label: '位置 1', title: '一月主題', meaning: '新年的開端能量與行動重點。' },
      { id: 'y2', label: '位置 2', title: '二月主題', meaning: '二月的發展方向與提醒。' },
      { id: 'y3', label: '位置 3', title: '三月主題', meaning: '三月份的能量焦點與事件趨勢。' },
      { id: 'y4', label: '位置 4', title: '四月主題', meaning: '春季轉折中的提示與成長。' },
      { id: 'y5', label: '位置 5', title: '五月主題', meaning: '五月需要掌握的機會與課題。' },
      { id: 'y6', label: '位置 6', title: '六月主題', meaning: '年中調整與能量平衡的重點。' },
      { id: 'y7', label: '位置 7', title: '七月主題', meaning: '夏季高峰期的提醒與關鍵行動。' },
      { id: 'y8', label: '位置 8', title: '八月主題', meaning: '八月的重要趨勢與協調方向。' },
      { id: 'y9', label: '位置 9', title: '九月主題', meaning: '秋季開端的學習與整備重點。' },
      { id: 'y10', label: '位置 10', title: '十月主題', meaning: '十月份的人際、事業或生活變化。' },
      { id: 'y11', label: '位置 11', title: '十一月主題', meaning: '年末前需要回顧與深化的面向。' },
      { id: 'y12', label: '位置 12', title: '十二月主題', meaning: '年度收尾的整合與祝福。' },
      { id: 'y13', label: '位置 13', title: '年度總覽', meaning: '貫穿全年的核心課題與靈魂成長方向。' }
    ]
  },
  {
    id: 'shadow-work',
    name: '陰影工作陣',
    description: '溫柔探索內在陰影與被壓抑的情緒，協助療癒創傷並整合力量。',
    cardCount: 6,
    highlight: '深層療癒',
    theme: 'inner',
    recommendedFor: ['self', 'health', 'general'],
    positions: [
      { id: 's1', label: '位置 1', title: '核心陰影', meaning: '此刻最需要被看見的陰影或被壓抑的部分。' },
      { id: 's2', label: '位置 2', title: '影響層面', meaning: '這股陰影如何影響你的行為、人際或選擇。' },
      { id: 's3', label: '位置 3', title: '根源起點', meaning: '陰影形成的來源，可能是童年、過往事件或創傷。' },
      { id: 's4', label: '位置 4', title: '逃避模式', meaning: '你習慣用什麼方式避開或壓抑這份感受。' },
      { id: 's5', label: '位置 5', title: '整合指引', meaning: '可以採取的療癒行動與整合方法。' },
      { id: 's6', label: '位置 6', title: '轉化力量', meaning: '完成整合後可獲得的力量與新視角。' }
    ]
  },
  {
    id: 'relationship-balance',
    name: '關係互動解析陣',
    description: '聚焦雙方的動機、互動與未來走勢，適合感情與合作議題。',
    cardCount: 6,
    highlight: '雙方視角',
    theme: 'relationship',
    recommendedFor: ['love', 'career', 'self'],
    positions: [
      { id: 'r1', label: '位置 1', title: '你的現況', meaning: '你在這段關係中的狀態與期待。' },
      { id: 'r2', label: '位置 2', title: '對方現況', meaning: '對方目前的心境、想法與動機。' },
      { id: 'r3', label: '位置 3', title: '關係核心', meaning: '雙方連結的核心課題或吸引力。' },
      { id: 'r4', label: '位置 4', title: '協調之道', meaning: '促進理解與合作的關鍵行動。' },
      { id: 'r5', label: '位置 5', title: '挑戰', meaning: '需要克服的摩擦、阻力或盲點。' },
      { id: 'r6', label: '位置 6', title: '未來趨勢', meaning: '若調整後，關係將往何處發展。' }
    ]
  },
  {
    id: 'career-path',
    name: '職涯策略陣',
    description: '從目標、資源到策略與風險評估，協助職場決策與規劃。',
    cardCount: 5,
    highlight: '職涯專用',
    theme: 'analysis',
    recommendedFor: ['career', 'finance', 'study'],
    positions: [
      { id: 'k1', label: '位置 1', title: '願景', meaning: '你想達成的長期方向與價值。' },
      { id: 'k2', label: '位置 2', title: '資源', meaning: '可運用的優勢、人脈或資源。' },
      { id: 'k3', label: '位置 3', title: '挑戰', meaning: '需要留意的障礙、風險或盲點。' },
      { id: 'k4', label: '位置 4', title: '策略', meaning: '當下可以採取的行動與調整。' },
      { id: 'k5', label: '位置 5', title: '成果趨勢', meaning: '若落實以上策略，可能顯化的結果。' }
    ]
  },
  {
    id: 'self-discovery',
    name: '自我探索療癒陣',
    description: '面向內在需求與療癒方向，適合自我成長與靈性探索。',
    cardCount: 4,
    highlight: '內在旅程',
    theme: 'inner',
    recommendedFor: ['self', 'health', 'general'],
    positions: [
      { id: 's1', label: '位置 1', title: '內在狀態', meaning: '此刻最需要被看見的情緒與信念。' },
      { id: 's2', label: '位置 2', title: '學習功課', meaning: '正在進行的生命課題或模式。' },
      { id: 's3', label: '位置 3', title: '支持力量', meaning: '陪伴你前進的資源、支持與靈感。' },
      { id: 's4', label: '位置 4', title: '整合方向', meaning: '將帶來療癒與突破的下一步。' }
    ]
  }
];

const spreadCatalogTranslationsEN = {
  'daily-oracle': {
    name: 'Daily Guidance Card',
    description:
      'Draw a single card to sense today\'s key energy and reminder; ideal for everyday inspiration.',
    highlight: 'Daily Reminder',
    positions: {
      d1: {
        label: 'Position 1',
        title: 'Today\'s Message',
        meaning: 'The energy, action, or mindset that needs your attention right now.'
      }
    }
  },
  'three-card': {
    name: 'Three-Card Insight Spread',
    description: 'Quickly clarify the past, present, and future; suits most general questions.',
    highlight: 'Past / Present / Future',
    positions: {
      p1: {
        label: 'Position 1',
        title: 'Past',
        meaning: 'The background, causes, and foundational beliefs shaping the situation.'
      },
      p2: {
        label: 'Position 2',
        title: 'Present',
        meaning: 'Current manifestations, challenges, and resources you can leverage now.'
      },
      p3: {
        label: 'Position 3',
        title: 'Future',
        meaning: 'The direction things may head and the reminder if nothing changes.'
      }
    }
  },
  'celtic-cross': {
    name: 'Celtic Cross Spread',
    description:
      'Break down the core issue, surrounding influences, and long term trend; ideal for major decisions.',
    highlight: 'Comprehensive Reading',
    positions: {
      c1: {
        label: 'Position 1',
        title: 'Current Situation',
        meaning: 'The core energy and theme you are dealing with right now.'
      },
      c2: {
        label: 'Position 2',
        title: 'Challenge',
        meaning: 'Opposing forces, obstacles, or the key lesson in front of you.'
      },
      c3: {
        label: 'Position 3',
        title: 'Conscious Mind',
        meaning: 'What you are aware of, aiming for, or actively choosing.'
      },
      c4: {
        label: 'Position 4',
        title: 'Subconscious',
        meaning: 'Hidden motives, emotions, and unmet needs beneath the surface.'
      },
      c5: {
        label: 'Position 5',
        title: 'Past Influence',
        meaning: 'Events or values from the past that created the current situation.'
      },
      c6: {
        label: 'Position 6',
        title: 'Near Future',
        meaning: 'What is emerging soon in terms of actions, opportunities, or shifts.'
      },
      c7: {
        label: 'Position 7',
        title: 'Self Perspective',
        meaning: 'How you are approaching the matter, including attitude and capacity.'
      },
      c8: {
        label: 'Position 8',
        title: 'External Influence',
        meaning: 'People, environment, or systems that are affecting the situation.'
      },
      c9: {
        label: 'Position 9',
        title: 'Hopes & Fears',
        meaning: 'The tug-of-war between what you desire and what you worry about.'
      },
      c10: {
        label: 'Position 10',
        title: 'Outcome Trend',
        meaning: 'The potential direction ahead if energies remain the same.'
      }
    }
  },
  'either-or': {
    name: 'Either-Or Decision Spread',
    description:
      'Compare two options by examining their momentum, gains, and risks to clarify your choice.',
    highlight: 'Option Comparison',
    positions: {
      e1: {
        label: 'Position 1',
        title: 'Core Issue',
        meaning: 'The essence of the situation and what makes this decision important.'
      },
      e2: {
        label: 'Position 2',
        title: 'Option A Strengths',
        meaning: 'Main benefits and support offered by option A.'
      },
      e3: {
        label: 'Position 3',
        title: 'Option A Reminder',
        meaning: 'Limitations or risks to watch when choosing option A.'
      },
      e4: {
        label: 'Position 4',
        title: 'Option B Strengths',
        meaning: 'The possibilities and resources that come with option B.'
      },
      e5: {
        label: 'Position 5',
        title: 'Option B Reminder',
        meaning: 'Concerns or costs to consider if you go with option B.'
      },
      e6: {
        label: 'Position 6',
        title: 'Overall Guidance',
        meaning: 'The integrated advice that helps you choose the best path.'
      }
    }
  },
  'triple-choice': {
    name: 'Triple Choice Strategy Spread',
    description:
      'Evaluate three approaches at once by weighing their strengths, challenges, and trajectories.',
    highlight: 'Multi Option Review',
    positions: {
      t1: {
        label: 'Position 1',
        title: 'Current Position',
        meaning: 'Your overall state and core needs right now.'
      },
      t2: {
        label: 'Position 2',
        title: 'Option One Alignment',
        meaning: 'How option one supports you and the developments it can bring.'
      },
      t3: {
        label: 'Position 3',
        title: 'Option One Reminder',
        meaning: 'Points to pay attention to when implementing option one.'
      },
      t4: {
        label: 'Position 4',
        title: 'Option Two Alignment',
        meaning: 'The strengths and supportive energy offered by option two.'
      },
      t5: {
        label: 'Position 5',
        title: 'Option Two Reminder',
        meaning: 'Challenges or costs that may surface with option two.'
      },
      t6: {
        label: 'Position 6',
        title: 'Option Three Alignment',
        meaning: 'Highlights and opportunities available through option three.'
      },
      t7: {
        label: 'Position 7',
        title: 'Option Three Reminder',
        meaning: 'Limitations or trade offs to note when choosing option three.'
      },
      t8: {
        label: 'Position 8',
        title: 'Overall Guidance',
        meaning: 'Mindset and actions that support you after comparing all choices.'
      }
    }
  },
  'persona-insight': {
    name: 'Persona Insight Spread',
    description:
      'Understand someone\'s inner and outer traits, spotting strengths and blind spots for self awareness or relationship insight.',
    highlight: 'Inner & Outer View',
    positions: {
      p1: {
        label: 'Position 1',
        title: 'Outer Expression',
        meaning: 'How others perceive this person and how they tend to act.'
      },
      p2: {
        label: 'Position 2',
        title: 'Inner Self',
        meaning: 'Their genuine desires, motivations, and inner drive.'
      },
      p3: {
        label: 'Position 3',
        title: 'Strengths & Talents',
        meaning: 'Natural gifts and abilities ready to be expressed.'
      },
      p4: {
        label: 'Position 4',
        title: 'Potential Challenge',
        meaning: 'Blind spots, limits, or defense patterns to be aware of.'
      },
      p5: {
        label: 'Position 5',
        title: 'Soul Lesson',
        meaning: 'Growth direction calling for integration at this time.'
      }
    }
  },
  'life-purpose': {
    name: 'Life Purpose Blueprint Spread',
    description:
      'Explore soul goals, potential, and actions to clarify your long term vision during transitions.',
    highlight: 'Soul Map',
    positions: {
      l1: {
        label: 'Position 1',
        title: 'Current Identity',
        meaning: 'The roles and state you are embodying right now.'
      },
      l2: {
        label: 'Position 2',
        title: 'Soul Calling',
        meaning: 'The direction and mission your heart truly longs for.'
      },
      l3: {
        label: 'Position 3',
        title: 'Hidden Talents',
        meaning: 'Abilities, gifts, and resources waiting to be expressed.'
      },
      l4: {
        label: 'Position 4',
        title: 'Present Obstacle',
        meaning: 'Key challenge that blocks your vision at the moment.'
      },
      l5: {
        label: 'Position 5',
        title: 'Supporting Forces',
        meaning: 'People, resources, or spiritual allies you can lean on.'
      },
      l6: {
        label: 'Position 6',
        title: 'Path of Purpose',
        meaning: 'Core guidance highlighting your next steps and destination.'
      }
    }
  },
  'year-ahead': {
    name: 'Year Ahead Forecast Spread',
    description:
      'Review the energy and theme of the next twelve months; perfect for new year or birthday intentions.',
    highlight: '12 Month Insight',
    positions: {
      y1: {
        label: 'Position 1',
        title: 'January Theme',
        meaning: 'Focus areas and opportunities appearing in January.'
      },
      y2: {
        label: 'Position 2',
        title: 'February Theme',
        meaning: 'What February encourages you to notice and develop.'
      },
      y3: {
        label: 'Position 3',
        title: 'March Theme',
        meaning: 'Key energies and trends for the month of March.'
      },
      y4: {
        label: 'Position 4',
        title: 'April Theme',
        meaning: 'Guidance for springtime shifts and emerging growth.'
      },
      y5: {
        label: 'Position 5',
        title: 'May Theme',
        meaning: 'Opportunities and lessons to embrace in May.'
      },
      y6: {
        label: 'Position 6',
        title: 'June Theme',
        meaning: 'Mid year adjustments and how to restore balance.'
      },
      y7: {
        label: 'Position 7',
        title: 'July Theme',
        meaning: 'Reminders and key actions for the summer peak.'
      },
      y8: {
        label: 'Position 8',
        title: 'August Theme',
        meaning: 'Important trends and harmonising efforts in August.'
      },
      y9: {
        label: 'Position 9',
        title: 'September Theme',
        meaning: 'Learning focus and preparations as autumn begins.'
      },
      y10: {
        label: 'Position 10',
        title: 'October Theme',
        meaning: 'Changes in relationships, career, or life emerging in October.'
      },
      y11: {
        label: 'Position 11',
        title: 'November Theme',
        meaning: 'What needs review and deepening before the year ends.'
      },
      y12: {
        label: 'Position 12',
        title: 'December Theme',
        meaning: 'Integration and blessings for closing the year.'
      },
      y13: {
        label: 'Position 13',
        title: 'Annual Overview',
        meaning: 'The core lesson and soul growth weaving through the year.'
      }
    }
  },
  'shadow-work': {
    name: 'Shadow Work Spread',
    description:
      'Gently explore inner shadows and repressed emotions to heal wounds and reclaim power.',
    highlight: 'Deep Healing',
    positions: {
      s1: {
        label: 'Position 1',
        title: 'Core Shadow',
        meaning: 'The part of you that most wants to be seen right now.'
      },
      s2: {
        label: 'Position 2',
        title: 'Impact Area',
        meaning: 'How this shadow influences behaviour, relationships, or choices.'
      },
      s3: {
        label: 'Position 3',
        title: 'Origin',
        meaning: 'Where the shadow began, such as past events or wounds.'
      },
      s4: {
        label: 'Position 4',
        title: 'Avoidance Pattern',
        meaning: 'Strategies you use to escape or suppress these feelings.'
      },
      s5: {
        label: 'Position 5',
        title: 'Integration Guidance',
        meaning: 'Actions or practices that help you heal and integrate.'
      },
      s6: {
        label: 'Position 6',
        title: 'Transformed Power',
        meaning: 'The strength and new perspective gained after integration.'
      }
    }
  },
  'relationship-balance': {
    name: 'Relationship Balance Spread',
    description:
      'Focus on both sides of a relationship to understand dynamics, motivations, and future direction.',
    highlight: 'Two Perspectives',
    positions: {
      r1: {
        label: 'Position 1',
        title: 'Your State',
        meaning: 'How you feel and what you expect in this relationship.'
      },
      r2: {
        label: 'Position 2',
        title: 'Their State',
        meaning: 'The other person\'s mindset, feelings, and motives.'
      },
      r3: {
        label: 'Position 3',
        title: 'Relationship Core',
        meaning: 'The key theme or attraction connecting you both.'
      },
      r4: {
        label: 'Position 4',
        title: 'How to Harmonise',
        meaning: 'Actions that foster understanding and cooperation.'
      },
      r5: {
        label: 'Position 5',
        title: 'Challenge',
        meaning: 'Friction, blocks, or blind spots to overcome together.'
      },
      r6: {
        label: 'Position 6',
        title: 'Future Trend',
        meaning: 'Where the relationship can head once adjustments are made.'
      }
    }
  },
  'career-path': {
    name: 'Career Strategy Spread',
    description:
      'Assess goals, resources, strategies, and risks to support career planning and decisions.',
    highlight: 'Career Focus',
    positions: {
      k1: {
        label: 'Position 1',
        title: 'Vision',
        meaning: 'The long term direction and value you want to create.'
      },
      k2: {
        label: 'Position 2',
        title: 'Resources',
        meaning: 'Personal strengths, networks, or assets you can use.'
      },
      k3: {
        label: 'Position 3',
        title: 'Challenges',
        meaning: 'Obstacles, risks, or blind spots to watch closely.'
      },
      k4: {
        label: 'Position 4',
        title: 'Strategy',
        meaning: 'Actions and adjustments you can take right now.'
      },
      k5: {
        label: 'Position 5',
        title: 'Outcome Trend',
        meaning: 'Potential results if you follow through with the plan.'
      }
    }
  },
  'self-discovery': {
    name: 'Self Discovery Healing Spread',
    description:
      'Tune into inner needs and healing directions; ideal for personal growth and spiritual inquiry.',
    highlight: 'Inner Journey',
    positions: {
      s1: {
        label: 'Position 1',
        title: 'Inner State',
        meaning: 'The emotions and beliefs that want acknowledgement now.'
      },
      s2: {
        label: 'Position 2',
        title: 'Lesson',
        meaning: 'The life theme or pattern you are currently navigating.'
      },
      s3: {
        label: 'Position 3',
        title: 'Support',
        meaning: 'Resources, allies, or inspiration that sustain you.'
      },
      s4: {
        label: 'Position 4',
        title: 'Integration',
        meaning: 'Next step that brings healing and breakthrough.'
      }
    }
  }
};

const spreadCatalogEN = spreadCatalog.map((spread) => {
  const translation = spreadCatalogTranslationsEN[spread.id] || {};
  const translatedPositions = Array.isArray(spread.positions)
    ? spread.positions.map((position) => {
        const positionTranslation =
          translation.positions && translation.positions[position.id]
            ? translation.positions[position.id]
            : {};
        return {
          ...position,
          label: positionTranslation.label || position.label,
          title: positionTranslation.title || position.title,
          meaning: positionTranslation.meaning || position.meaning
        };
      })
    : [];

  return {
    ...spread,
    name: translation.name || spread.name,
    description: translation.description || spread.description,
    highlight: translation.highlight || spread.highlight,
    positions: translatedPositions
  };
});

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

const majorArcana = [
  {
    id: 'major-0',
    name: '愚者（The Fool）',
    arcana: 'major',
    keywords: ['新旅程', '信任', '自由'],
    upright: '擁抱未知，勇敢踏出第一步，信任直覺帶來新冒險。',
    reversed: '腳步過快或準備不足，提醒你評估風險與落地計畫。',
    detail: '愚者象徵靈魂的起點，邀請你以開放姿態面對未知。',
    insights: {
      upright: '保持好奇與靈活，允許自己犯錯並從經驗中調整。',
      reversed: '在行動前先確認安全網，或回頭檢視核心動機。'
    }
  },
  {
    id: 'major-1',
    name: '魔術師（The Magician）',
    arcana: 'major',
    keywords: ['顯化', '行動力', '資源整合'],
    upright: '將想法化為具體行動，運用手邊資源創造理想。',
    reversed: '能量分散或技巧未臻成熟，需要專注與誠實溝通。',
    detail: '魔術師連結天地資源，提醒你善用天賦與工具。',
    insights: {
      upright: '聚焦在單一優先事項，你的技巧能引導他人。',
      reversed: '避免操控或吹噓，先修煉內在意圖與專業。'
    }
  },
  {
    id: 'major-2',
    name: '女祭司（The High Priestess）',
    arcana: 'major',
    keywords: ['直覺', '內在智慧', '靜心'],
    upright: '傾聽內在聲音，保持觀察者視角，等待訊息浮現。',
    reversed: '壓抑直覺或資訊不足，提醒你坦誠面對感受。',
    detail: '女祭司守護潛意識的秘境，邀你信任靈魂的指引。',
    insights: {
      upright: '透過冥想、寫作或夢境紀錄深化覺知。',
      reversed: '釋放懷疑與恐懼，尋求值得信賴的心靈支持。'
    }
  },
  {
    id: 'major-3',
    name: '女皇（The Empress）',
    arcana: 'major',
    keywords: ['滋養', '豐盛', '創造'],
    upright: '擁抱感官與情感，透過照顧自己孕育新的成果。',
    reversed: '過度給予或忽略自身需求，需要重視界線與自我價值。',
    detail: '女皇象徵母性的滋養能量與創造力。',
    insights: {
      upright: '向愛的人表達感謝，同時邀請支持。',
      reversed: '停下無止盡的付出，優先回到身心平衡。'
    }
  },
  {
    id: 'major-4',
    name: '皇帝（The Emperor）',
    arcana: 'major',
    keywords: ['結構', '領導', '責任'],
    upright: '建立穩定的框架與規劃，透過紀律驅動成果。',
    reversed: '控制過度或權威失衡，重新檢視權力運用方式。',
    detail: '皇帝代表保護、秩序與長期策略。',
    insights: {
      upright: '訂定明確規則並以行動帶頭示範。',
      reversed: '鬆開僵化掌控，允許彈性與合作。'
    }
  },
  {
    id: 'major-5',
    name: '教皇（The Hierophant）',
    arcana: 'major',
    keywords: ['傳統', '學習', '指導'],
    upright: '遵循有效制度與師長指引，扎根於共同信念。',
    reversed: '被舊規綁住或缺乏個人觀點，尋找內在真理。',
    detail: '教皇傳遞智慧，連結社群與儀式的力量。',
    insights: {
      upright: '向可信賴的導師求教，深化專業。',
      reversed: '勇於質疑傳統，定義屬於你的規範。'
    }
  },
  {
    id: 'major-6',
    name: '戀人（The Lovers）',
    arcana: 'major',
    keywords: ['選擇', '價值觀', '關係'],
    upright: '透過誠實交流對齊價值觀，做出真實的選擇。',
    reversed: '價值衝突或迷失自我，需要重新確認界線與渴望。',
    detail: '戀人象徵契合與真實選擇的考驗。',
    insights: {
      upright: '開放心胸分享想法，挑選與靈魂共鳴的路。',
      reversed: '暫停外界聲音，先回到自我承諾。'
    }
  },
  {
    id: 'major-7',
    name: '戰車（The Chariot）',
    arcana: 'major',
    keywords: ['行動', '決心', '勝利'],
    upright: '集中意志力，穩住方向，勇敢推進。',
    reversed: '方向搖擺或能量分裂，先調和內在衝突。',
    detail: '戰車象徵掌舵與勝利，需要心智與情感一致。',
    insights: {
      upright: '設定明確里程碑，保持自律。',
      reversed: '回到核心目標，整合散亂的心力。'
    }
  },
  {
    id: 'major-8',
    name: '力量（Strength）',
    arcana: 'major',
    keywords: ['溫柔勇氣', '自我掌握', '信任'],
    upright: '以溫柔與耐心掌握內在野性，展現深層力量。',
    reversed: '自信不足或壓抑情緒，學習接納脆弱。',
    detail: '力量牌提醒你，真正的勇氣來自慈悲。',
    insights: {
      upright: '透過持續練習與自我鼓勵強化信心。',
      reversed: '向值得信任的人求助，慢慢重建力量。'
    }
  },
  {
    id: 'major-9',
    name: '隱者（The Hermit）',
    arcana: 'major',
    keywords: ['內省', '智慧', '獨處'],
    upright: '抽離喧囂，透過獨處整理洞察與方向。',
    reversed: '過度孤立或逃避現實，適時分享內心感受。',
    detail: '隱者提燈照亮前方，象徵自我探問的旅程。',
    insights: {
      upright: '安排靜心或閱讀時間，深化專注。',
      reversed: '建立互信圈，讓人了解你的需求。'
    }
  },
  {
    id: 'major-10',
    name: '命運之輪（Wheel of Fortune）',
    arcana: 'major',
    keywords: ['變動', '循環', '機運'],
    upright: '時機正在轉動，敞開心胸迎接新的節奏與機遇。',
    reversed: '暫時的停滯或反覆，提醒調整節奏與態度。',
    detail: '命運之輪象徵生命循環與共同命運。',
    insights: {
      upright: '順應波動，抓住轉機提供的線索。',
      reversed: '面對反覆情勢，檢視你能掌握的部分。'
    }
  },
  {
    id: 'major-11',
    name: '正義（Justice）',
    arcana: 'major',
    keywords: ['公平', '決策', '真相'],
    upright: '平衡利益與責任，做出符合價值的判斷。',
    reversed: '資訊失衡或自我責備，重新蒐集事實。',
    detail: '正義牌提醒你保持誠實與均衡。',
    insights: {
      upright: '清楚列出利弊，對結果負責。',
      reversed: '別急著定罪，給自己與他人第二次機會。'
    }
  },
  {
    id: 'major-12',
    name: '吊人（The Hanged Man）',
    arcana: 'major',
    keywords: ['視角轉換', '臣服', '暫停'],
    upright: '暫停腳步，用全新角度理解事件。',
    reversed: '拖延或抗拒放手，反思你緊抓不放的原因。',
    detail: '吊人代表自願的停留，以換取更高層次的覺察。',
    insights: {
      upright: '允許過程發酵，新的答案會浮現。',
      reversed: '找出恐懼背後的需求，再決定是否放手。'
    }
  },
  {
    id: 'major-13',
    name: '死神（Death）',
    arcana: 'major',
    keywords: ['結束', '轉化', '重生'],
    upright: '某段旅程即將結束，騰出空間迎接新生命。',
    reversed: '害怕改變或停留在過往，溫柔地告別舊模式。',
    detail: '死神象徵蛻變，提醒你接受不可逆的變化。',
    insights: {
      upright: '透過儀式向過去致意，再向前邁進。',
      reversed: '逐步放下，為自己安排緩衝期。'
    }
  },
  {
    id: 'major-14',
    name: '節制（Temperance）',
    arcana: 'major',
    keywords: ['調和', '節奏', '整合'],
    upright: '保持彈性與耐心，讓不同元素取得平衡。',
    reversed: '節奏失衡或躁動，回到適度的步調。',
    detail: '節制天使混和兩杯水，象徵協調與療癒。',
    insights: {
      upright: '設定循序漸進的計畫，整合資源。',
      reversed: '不要急於一次完成，一次調整一件事。'
    }
  },
  {
    id: 'major-15',
    name: '惡魔（The Devil）',
    arcana: 'major',
    keywords: ['束縛', '慾望', '影子'],
    upright: '面對被欲望牽制的部分，理解其背後需求。',
    reversed: '覺醒於束縛，準備鬆開過度依賴。',
    detail: '惡魔彰顯影子自我與被束縛的恐懼。',
    insights: {
      upright: '誠實檢視上癮或權力失衡的模式。',
      reversed: '尋求協助，逐步重獲自主。'
    }
  },
  {
    id: 'major-16',
    name: '高塔（The Tower）',
    arcana: 'major',
    keywords: ['突變', '覺醒', '解構'],
    upright: '突如其來的轉變拆除舊有結構，讓真相浮現。',
    reversed: '延遲的崩解或害怕動盪，主動清理不穩基礎。',
    detail: '高塔被閃電擊中，象徵迅速而徹底的覺醒。',
    insights: {
      upright: '在混亂中尋找真實可依靠的核心。',
      reversed: '預先調整，降低衝擊的破壞力。'
    }
  },
  {
    id: 'major-17',
    name: '星星（The Star）',
    arcana: 'major',
    keywords: ['希望', '療癒', '靈感'],
    upright: '重燃希望，信任宇宙正在回應你的祈願。',
    reversed: '信心受挫或能量分散，調整期待與界線。',
    detail: '星星帶來溫柔的光，提醒你保持信任與分享。',
    insights: {
      upright: '透過創作與分享，讓靈感流動。',
      reversed: '補充能量，明確界定你能給予的範圍。'
    }
  },
  {
    id: 'major-18',
    name: '月亮（The Moon）',
    arcana: 'major',
    keywords: ['潛意識', '直覺', '幻象'],
    upright: '情緒起伏提醒你辨識真實與投射。',
    reversed: '面對長期的焦慮或迷霧，尋找具體支持。',
    detail: '月亮照亮夜色，也投射陰影，象徵未知。',
    insights: {
      upright: '透過創作或記夢探索內心。',
      reversed: '建立日常儀式，安定敏感的感官。'
    }
  },
  {
    id: 'major-19',
    name: '太陽（The Sun）',
    arcana: 'major',
    keywords: ['喜悅', '成功', '活力'],
    upright: '敞開心胸分享成果，享受成功與清晰。',
    reversed: '暫時的失落或能量不足，調整自我期待。',
    detail: '太陽象徵光明與孩童般的純真。',
    insights: {
      upright: '讓你的熱情感染團隊，共創成果。',
      reversed: '給自己休息與玩樂，重新充電。'
    }
  },
  {
    id: 'major-20',
    name: '審判（Judgement）',
    arcana: 'major',
    keywords: ['覺醒', '召喚', '總結'],
    upright: '正站在關鍵門檻，根據靈魂召喚做決定。',
    reversed: '誤聽外界評價或遲疑，整合過去經驗再前進。',
    detail: '審判號角召喚重生，提醒你回答內在召喚。',
    insights: {
      upright: '整理成果並宣示下一階段目標。',
      reversed: '停止自我批判，允許自己再嘗試。'
    }
  },
  {
    id: 'major-21',
    name: '世界（The World）',
    arcana: 'major',
    keywords: ['完成', '整合', '旅程'],
    upright: '重要循環即將完成，進入全新的視野與舞台。',
    reversed: '尚有未竟之事或遲遲不敢結束，補齊最後拼圖。',
    detail: '世界象徵整體與圓滿，也預示新的周期。',
    insights: {
      upright: '慶祝你的成就，準備迎接新旅程。',
      reversed: '確認是否尚有遺留細節需收尾。'
    }
  }
];

const majorArcanaTranslationsEN = {
  'major-0': {
    name: 'The Fool',
    keywords: ['New beginnings', 'Innocence', 'Adventure'],
    upright: 'Step into the unknown with lightness and trust; embrace the fresh journey ahead.',
    reversed: 'Impulsiveness or doubt slows the leap forward; ground yourself before moving on.',
    detail: 'The Fool marks the very start of the Major Arcana, symbolising limitless potential and playful optimism.',
    insights: {
      upright: 'Take the first step even if you cannot see the whole path; curiosity will guide you.',
      reversed: 'Pause to check your plan and support system before diving headfirst.'
    }
  },
  'major-1': {
    name: 'The Magician',
    keywords: ['Manifestation', 'Skill', 'Focus'],
    upright: 'Direct your talents with intention; channel ideas into tangible results.',
    reversed: 'Scattered energy or mixed motives weaken impact; realign with integrity.',
    detail: 'The Magician bridges spirit and matter, showing how focused willpower shapes reality.',
    insights: {
      upright: 'Choose one priority and bring it to life through deliberate action.',
      reversed: 'Refine your message and purpose before presenting it to others.'
    }
  },
  'major-2': {
    name: 'The High Priestess',
    keywords: ['Intuition', 'Wisdom', 'Stillness'],
    upright: 'Listen to quiet inner signals; the truth is revealed through reflection.',
    reversed: 'Secrets or self-doubt create noise; return to your inner sanctuary.',
    detail: 'The High Priestess guards hidden knowledge, inviting you to trust your inner knowing.',
    insights: {
      upright: 'Make space for dreams, journaling, and intuitive practices to clarify guidance.',
      reversed: 'Release fear of your own insight and seek gentle mentorship if needed.'
    }
  },
  'major-3': {
    name: 'The Empress',
    keywords: ['Nurturing', 'Abundance', 'Creativity'],
    upright: 'Care for yourself and others; allow beauty and creation to flourish.',
    reversed: 'Overgiving or depletion signals a need to honour personal boundaries.',
    detail: 'The Empress embodies fertile creativity, sensual pleasure, and compassionate care.',
    insights: {
      upright: 'Celebrate your achievements and receive support as openly as you give it.',
      reversed: 'Reclaim time for rest and nourishment before offering more of yourself.'
    }
  },
  'major-4': {
    name: 'The Emperor',
    keywords: ['Structure', 'Leadership', 'Responsibility'],
    upright: 'Build solid foundations through strategy, discipline, and clear authority.',
    reversed: 'Rigid control or fear of surrender creates imbalance; invite collaboration.',
    detail: 'The Emperor represents stable leadership and the protective order that sustains progress.',
    insights: {
      upright: 'Define rules and demonstrate them through consistent action.',
      reversed: 'Loosen your grip and listen to diverse voices to strengthen the whole.'
    }
  },
  'major-5': {
    name: 'The Hierophant',
    keywords: ['Tradition', 'Teaching', 'Belief'],
    upright: 'Align with meaningful rituals, mentors, and collective wisdom.',
    reversed: 'Dogma or borrowed values may limit you; rediscover your authentic truth.',
    detail: 'The Hierophant connects you to lineage, community, and sacred learning.',
    insights: {
      upright: 'Seek guidance from trusted teachers and honour the practices that support you.',
      reversed: 'Question outdated rules and craft beliefs that feel alive in your own heart.'
    }
  },
  'major-6': {
    name: 'The Lovers',
    keywords: ['Choice', 'Values', 'Relationship'],
    upright: 'Choose with honesty and alignment; let shared values guide the union.',
    reversed: 'Mixed signals or avoidance call for boundaries and renewed self-connection.',
    detail: 'The Lovers highlights heartfelt decisions and the harmony found in authentic connection.',
    insights: {
      upright: 'Speak openly about what matters most and make decisions that honour it.',
      reversed: 'Return to your inner compass before seeking approval from others.'
    }
  },
  'major-7': {
    name: 'The Chariot',
    keywords: ['Drive', 'Willpower', 'Victory'],
    upright: 'Harness determination and align opposing forces to reach your destination.',
    reversed: 'Momentum stalls when focus fractures; regain direction before charging ahead.',
    detail: 'The Chariot symbolises disciplined ambition and the power of aligned motion.',
    insights: {
      upright: 'Clarify your goal and commit to it wholeheartedly; discipline is your ally.',
      reversed: 'Check if you are forcing progress; adjust tactics to fit current terrain.'
    }
  },
  'major-8': {
    name: 'Strength',
    keywords: ['Courage', 'Compassion', 'Resilience'],
    upright: 'Soft strength calms the lion within; lead with patience and heart.',
    reversed: 'Inner doubt or burnout highlights the need for self-compassion and rest.',
    detail: 'Strength blends bravery with grace, reminding you that gentleness tames fear.',
    insights: {
      upright: 'Offer kindness to yourself and others; your steady presence inspires trust.',
      reversed: 'Step back from constant effort and tend to the tender parts of you.'
    }
  },
  'major-9': {
    name: 'The Hermit',
    keywords: ['Solitude', 'Insight', 'Guidance'],
    upright: 'Withdraw to reflect and gather wisdom; your inner lamp lights the way.',
    reversed: 'Isolation or avoidance can dull insight; seek connection when needed.',
    detail: 'The Hermit represents contemplative retreat and the wisdom earned in quiet.',
    insights: {
      upright: 'Set aside time to listen within and integrate recent lessons.',
      reversed: 'Share your reflections with a confidant to regain perspective.'
    }
  },
  'major-10': {
    name: 'Wheel of Fortune',
    keywords: ['Cycles', 'Destiny', 'Change'],
    upright: 'Life turns; embrace shifts with adaptability and trust in timing.',
    reversed: 'Resistance to change creates friction; release the need to control every turn.',
    detail: 'The Wheel of Fortune reminds you that fate moves in seasons and spirals.',
    insights: {
      upright: 'Ride the wave with openness; fortune favours those who stay flexible.',
      reversed: 'Notice repeating patterns and choose a new response this time.'
    }
  },
  'major-11': {
    name: 'Justice',
    keywords: ['Balance', 'Truth', 'Accountability'],
    upright: 'Weigh facts with fairness; honest action restores equilibrium.',
    reversed: 'Avoiding consequences or clarity prolongs imbalance; face the truth directly.',
    detail: 'Justice brings measured insight, highlighting ethics, accountability, and choice.',
    insights: {
      upright: 'Stand for integrity even when it is difficult; align decisions with your values.',
      reversed: 'Acknowledge missteps and correct them to regain inner peace.'
    }
  },
  'major-12': {
    name: 'The Hanged Man',
    keywords: ['Perspective', 'Surrender', 'Pause'],
    upright: 'Suspend judgment and view life from a new angle; growth brews in stillness.',
    reversed: 'Stagnation or resistance arises when you cling to old patterns.',
    detail: 'The Hanged Man invites voluntary pause so deeper truth can emerge.',
    insights: {
      upright: 'Let go of timelines and allow insight to ripen naturally.',
      reversed: 'Identify what you fear releasing and explore it with compassion.'
    }
  },
  'major-13': {
    name: 'Death',
    keywords: ['Transformation', 'Endings', 'Renewal'],
    upright: 'Allow endings to clear space; rebirth follows courageous release.',
    reversed: 'Gripping the past delays growth; accept change at a manageable pace.',
    detail: 'Death symbolises profound metamorphosis and the life that follows closure.',
    insights: {
      upright: 'Ritualise the goodbye and welcome the new chapter that awaits.',
      reversed: 'Offer yourself grace as you release attachments step by step.'
    }
  },
  'major-14': {
    name: 'Temperance',
    keywords: ['Harmony', 'Integration', 'Flow'],
    upright: 'Blend elements patiently; moderation and trust create sustainable balance.',
    reversed: 'Excess or restlessness disrupts rhythm; return to centered pacing.',
    detail: 'Temperance pours the perfect mix, representing healing, cooperation, and grace.',
    insights: {
      upright: 'Adopt gradual adjustments and honour the process of integration.',
      reversed: 'Simplify commitments and restore healthy routines before expanding.'
    }
  },
  'major-15': {
    name: 'The Devil',
    keywords: ['Shadow', 'Attachment', 'Temptation'],
    upright: 'Face desires and fears with honesty; reclaim the power you projected outward.',
    reversed: 'Awakening from denial frees you; release chains that no longer serve.',
    detail: 'The Devil exposes addictive loops and the shadow self seeking acknowledgement.',
    insights: {
      upright: 'Name the craving or contract that holds you and explore the unmet need beneath it.',
      reversed: 'Seek support as you untangle unhealthy bonds and rebuild autonomy.'
    }
  },
  'major-16': {
    name: 'The Tower',
    keywords: ['Revelation', 'Disruption', 'Awakening'],
    upright: 'Sudden change clears false structures; truth arrives like lightning.',
    reversed: 'Clinging to crumbling foundations prolongs upheaval; initiate needed change.',
    detail: 'The Tower shocks the system so authenticity can rebuild on solid ground.',
    insights: {
      upright: 'Amid the rubble, locate the insight that will guide your rebuilding.',
      reversed: 'Make proactive adjustments to prevent a harsher breakdown later.'
    }
  },
  'major-17': {
    name: 'The Star',
    keywords: ['Hope', 'Healing', 'Inspiration'],
    upright: 'Refill your spirit with faith and generosity; let your light reach others.',
    reversed: 'Weariness or pessimism dims your glow; nurture trust and clear boundaries.',
    detail: 'The Star radiates gentle optimism, promising renewal after the storm.',
    insights: {
      upright: 'Share your gifts freely and allow inspiration to flow through you.',
      reversed: 'Protect your energy, rest, and reconnect with what restores you.'
    }
  },
  'major-18': {
    name: 'The Moon',
    keywords: ['Intuition', 'Mystery', 'Emotion'],
    upright: 'Navigate dreams and uncertainty with sensitivity; not all is as it appears.',
    reversed: 'Lingering anxiety or illusion calls for grounding facts and gentle support.',
    detail: 'The Moon illuminates subconscious tides, inviting you to trust subtle signals.',
    insights: {
      upright: 'Use creative outlets to explore feelings and decode symbolic messages.',
      reversed: 'Establish soothing routines to ease worry and clarify perception.'
    }
  },
  'major-19': {
    name: 'The Sun',
    keywords: ['Joy', 'Success', 'Vitality'],
    upright: 'Celebrate achievements and let confidence shine; warmth attracts abundance.',
    reversed: 'Temporary setbacks or fatigue suggest rest and recalibration.',
    detail: 'The Sun beams clarity, generosity, and childlike delight into every endeavour.',
    insights: {
      upright: 'Share your progress with others and lead through enthusiasm.',
      reversed: 'Lighten expectations and prioritise play to recharge your energy.'
    }
  },
  'major-20': {
    name: 'Judgement',
    keywords: ['Awakening', 'Assessment', 'Calling'],
    upright: 'Answer the call to evolve; integrate past lessons and step into purpose.',
    reversed: 'Staying silent or doubting yourself delays liberation; listen within.',
    detail: 'Judgement signals a pivotal moment of truth, reconciliation, and rebirth.',
    insights: {
      upright: 'Announce your decision and honour the new chapter opening for you.',
      reversed: 'Release harsh self-judgment and allow a second chance to unfold.'
    }
  },
  'major-21': {
    name: 'The World',
    keywords: ['Completion', 'Wholeness', 'Arrival'],
    upright: 'Celebrate full-circle success and the wisdom earned on your journey.',
    reversed: 'Loose ends or hesitation remain; finish details before moving on.',
    detail: 'The World crowns the Major Arcana, representing integration and new horizons.',
    insights: {
      upright: 'Honour your accomplishment and prepare for the next adventure with gratitude.',
      reversed: 'Identify what still needs closure and address it with care.'
    }
  }
};

const majorArcanaEN = majorArcana.map((card) => {
  const translation = majorArcanaTranslationsEN[card.id] || {};
  const translatedInsights = translation.insights || {};
  return {
    ...card,
    name: translation.name || card.name,
    keywords: translation.keywords ? [...translation.keywords] : [...card.keywords],
    upright: translation.upright || card.upright,
    reversed: translation.reversed || card.reversed,
    detail: translation.detail || card.detail,
    insights: {
      upright: translatedInsights.upright || card.insights.upright,
      reversed: translatedInsights.reversed || card.insights.reversed
    }
  };
});

function getMajorArcanaByLanguage(language) {
  return language === LANGUAGE_OPTIONS.ENGLISH ? majorArcanaEN : majorArcana;
}

const suitMeta = {
  wands: {
    key: 'wands',
    name: '權杖',
    english: 'Wands',
    keywords: ['行動', '靈感', '火元素'],
    theme: '創造力與行動力',
    uprightContext: '點燃熱情、開創路徑與勇敢推進',
    reversedContext: '衝動、延遲或動能耗弱的狀態',
    detail: '權杖屬於火元素，象徵動力、激情與領導力。',
    insights: {
      upright: '跟隨熱情的方向，讓靈感化為具體行動。',
      reversed: '重新聚焦真正重要的目標，避免過度分散。'
    }
  },
  cups: {
    key: 'cups',
    name: '聖杯',
    english: 'Cups',
    keywords: ['情感', '連結', '水元素'],
    theme: '情緒與關係流動',
    uprightContext: '滋養感受、建立共鳴與情感交流',
    reversedContext: '情緒受阻、界線模糊或過度依附',
    detail: '聖杯屬於水元素，反映情緒與關係需求。',
    insights: {
      upright: '表達感受、傾聽他人，讓情感循環。',
      reversed: '重視自我照顧，釐清真實需求與界線。'
    }
  },
  swords: {
    key: 'swords',
    name: '寶劍',
    english: 'Swords',
    keywords: ['思維', '決策', '風元素'],
    theme: '理性與溝通',
    uprightContext: '理清思緒、果斷行動與誠實對話',
    reversedContext: '思慮過度、焦慮或言語傷害',
    detail: '寶劍屬於風元素，象徵邏輯、語言與觀念。',
    insights: {
      upright: '以清晰的語言傳達立場，堅守真相。',
      reversed: '安撫緊繃心智，避免衝動言語。'
    }
  },
  pentacles: {
    key: 'pentacles',
    name: '錢幣',
    english: 'Pentacles',
    keywords: ['物質', '實踐', '土元素'],
    theme: '物質與身體層面',
    uprightContext: '紮根、累積資源與務實執行',
    reversedContext: '停滯、缺乏安全感或過度執著結果',
    detail: '錢幣屬於土元素，關乎財務、身體與日常生活。',
    insights: {
      upright: '穩健累積，專注於可衡量的成果。',
      reversed: '重新檢視價值分配，尋找更平衡的運作模式。'
    }
  }
};

const minorRankMeta = {
  ace: {
    display: '一',
    english: 'Ace',
    keywords: ['起點', '潛能'],
    upright: '新的火花正在萌芽，充滿潛力與靈感。',
    reversed: '機會暫緩或缺乏引燃點，需要再次校準。',
    detail: 'Ace 代表全新循環的開始。',
    insights: {
      upright: '勇於嘗試，給創意一個實驗空間。',
      reversed: '檢視阻礙新開始的因素，調整節奏。'
    }
  },
  '2': {
    display: '二',
    english: 'Two',
    keywords: ['選擇', '平衡'],
    upright: '兩種可能性並存，等待你做出協調的選擇。',
    reversed: '猶豫不決或無法兼顧，需明確設下優先順序。',
    detail: 'Two 強調雙向互動與取捨。',
    insights: {
      upright: '整合資訊後再出發，你已接近答案。',
      reversed: '放下過度的顧慮，選擇更貼近內心的選項。'
    }
  },
  '3': {
    display: '三',
    english: 'Three',
    keywords: ['拓展', '合作'],
    upright: '團隊合作或規劃逐步展開，進入擴張階段。',
    reversed: '協調不順或資源不足，需要調整策略。',
    detail: 'Three 象徵合作與初步成果。',
    insights: {
      upright: '邀請夥伴共享願景，建立長期藍圖。',
      reversed: '調整角色分工，補足缺口。'
    }
  },
  '4': {
    display: '四',
    english: 'Four',
    keywords: ['穩定', '結構'],
    upright: '建立穩固基礎，讓成果逐漸穩定。',
    reversed: '過度僵化或停滯，適度鬆動框架。',
    detail: 'Four 帶來秩序與安全感。',
    insights: {
      upright: '透過系統化流程維持效率。',
      reversed: '為生活注入新的彈性與想像。'
    }
  },
  '5': {
    display: '五',
    english: 'Five',
    keywords: ['挑戰', '變化'],
    upright: '面臨競爭或變動，學習面對衝突。',
    reversed: '困局漸解或需要停止無意義的拉扯。',
    detail: 'Five 提醒你調整應對策略。',
    insights: {
      upright: '保持開放對話，尋找共識。',
      reversed: '離開消耗的場域，專注真正關鍵。'
    }
  },
  '6': {
    display: '六',
    english: 'Six',
    keywords: ['流動', '支持'],
    upright: '能量重新回穩，獲得支持或善意交流。',
    reversed: '資源失衡或付出過量，需要重新分配。',
    detail: 'Six 象徵調和與互助。',
    insights: {
      upright: '感謝現有的援助，並傳遞善意。',
      reversed: '釐清互惠條件，建立健康界線。'
    }
  },
  '7': {
    display: '七',
    english: 'Seven',
    keywords: ['檢視', '突破'],
    upright: '停下腳步評估策略，尋找突破口。',
    reversed: '方向模糊或失去信心，回到初衷。',
    detail: 'Seven 要求更高層次的覺察。',
    insights: {
      upright: '以長遠目標衡量當前行動。',
      reversed: '設定可行小步驟，重建自信。'
    }
  },
  '8': {
    display: '八',
    english: 'Eight',
    keywords: ['進展', '動能'],
    upright: '主題快速推進，效率顯著提升。',
    reversed: '進展緩慢或能量受阻，需重新排序。',
    detail: 'Eight 象徵動能與專注。',
    insights: {
      upright: '維持節奏，善用時間窗口。',
      reversed: '找到瓶頸來源，調整節奏。'
    }
  },
  '9': {
    display: '九',
    english: 'Nine',
    keywords: ['成熟', '界線'],
    upright: '成果逐漸成形，守住界線等待收成。',
    reversed: '疲憊或懷疑出現，補充能量並尋求支援。',
    detail: 'Nine 凸顯收尾與守護。',
    insights: {
      upright: '保持耐心，你已接近完成。',
      reversed: '不要獨自扛下所有壓力。'
    }
  },
  '10': {
    display: '十',
    english: 'Ten',
    keywords: ['完成', '循環'],
    upright: '階段性任務完成，即將開啟新篇章。',
    reversed: '尚未真正結束或感到壓力過重。',
    detail: 'Ten 象徵循環的終點與轉化。',
    insights: {
      upright: '整理成果，慶祝你的努力。',
      reversed: '釋放不必要的負擔，準備新旅程。'
    }
  },
  page: {
    display: '侍者',
    english: 'Page',
    keywords: ['學習', '訊息'],
    upright: '好奇心驅動新的學習與靈感。',
    reversed: '缺乏動力或資訊不足，需要扎根。',
    detail: '侍者帶來初學者心態與探索。',
    insights: {
      upright: '勇敢提問，尋找導師。',
      reversed: '整理基礎知識，打好根基。'
    }
  },
  knight: {
    display: '騎士',
    english: 'Knight',
    keywords: ['行動', '冒險'],
    upright: '主動出擊，快速推進目標。',
    reversed: '衝動或方向不明，先校準。',
    detail: '騎士象徵移動與挑戰。',
    insights: {
      upright: '為熱情設下明確里程碑。',
      reversed: '練習自律，別被情緒推著走。'
    }
  },
  queen: {
    display: '皇后',
    english: 'Queen',
    keywords: ['成熟', '直覺'],
    upright: '成熟掌握能量，透過滋養支持他人。',
    reversed: '內外失衡或情緒被壓抑，練習自我照顧。',
    detail: '皇后散發內在成熟與包容。',
    insights: {
      upright: '以身作則地照顧團隊與自己。',
      reversed: '先滿足自己的需求再談支持他人。'
    }
  },
  king: {
    display: '國王',
    english: 'King',
    keywords: ['掌控', '願景'],
    upright: '擁有全局視野，善用資源實現目標。',
    reversed: '專斷或失去彈性，需要調整領導方式。',
    detail: '國王象徵權威與成熟的掌控力。',
    insights: {
      upright: '以長遠策略帶領團隊。',
      reversed: '邀請合作，避免權力過度集中。'
    }
  }
};

function generateDeck(language = state.language || LANGUAGE_OPTIONS.CHINESE) {
  const majors = getMajorArcanaByLanguage(language).map((card) => ({
    ...card,
    keywords: [...card.keywords],
    insights: { ...card.insights }
  }));
  const deck = [...majors];
  const suits = Object.values(suitMeta);
  const ranks = Object.keys(minorRankMeta);

  suits.forEach((suit) => {
    ranks.forEach((rankKey) => {
      const rank = minorRankMeta[rankKey];
      const id = `${suit.key}-${rankKey}`;
      const name = `${suit.name}${rank.display}（${rank.english} of ${suit.english}）`;
      const keywords = uniqueKeywords([...suit.keywords, ...rank.keywords]);
      const upright = `${rank.upright} 這股能量延伸到${suit.theme}，象徵${suit.uprightContext}。`;
      const reversed = `${rank.reversed} 在${suit.theme}上，顯示${suit.reversedContext}。`;
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
