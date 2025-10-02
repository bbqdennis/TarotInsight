const state = {
  question: '',
  categories: [],
  recommendedSpreads: [],
  selectedSpread: null,
  spreadDraws: [],
  deckBlueprint: [],
  remainingDeck: [],
  timestamp: null
};

const ui = {};

const categoryKeywords = {
  love: ['愛情', '感情', '戀人', '伴侶', '婚姻', '關係', '曖昧', '分手', '復合', '感受', '桃花'],
  career: ['工作', '職涯', '升遷', '職場', '老闆', '同事', '創業', '面試', '事業', '專案'],
  finance: ['財務', '金錢', '收入', '投資', '理財', '資金', '薪水', '負債', '購屋'],
  health: ['健康', '身體', '養生', '醫療', '睡眠', '壓力', '飲食'],
  self: ['自我', '成長', '靈性', '人生', '目標', '方向', '迷惘', '情緒', '療癒', '內在'],
  study: ['學業', '課業', '考試', '學習', '研究', '留學']
};

const spreadCatalog = [
  {
    id: 'three-card',
    name: '三張牌洞察陣',
    description: '快速釐清過去、現在與未來，適合多數一般性問題。',
    cardCount: 3,
    highlight: '過去 / 現在 / 未來',
    recommendedFor: ['general', 'career', 'self', 'health', 'finance'],
    positions: [
      { id: 'p1', label: '位置 1', title: '過去', meaning: '影響目前狀況的背景、起因與基礎信念。' },
      { id: 'p2', label: '位置 2', title: '現在', meaning: '目前顯化的狀況、挑戰與可掌握的資源。' },
      { id: 'p3', label: '位置 3', title: '未來', meaning: '若持續現狀，近期可能發展的方向與提醒。' }
    ]
  },
  {
    id: 'celtic-cross',
    name: '十字架深度陣',
    description: '完整拆解事件核心、周遭影響與長期趨勢，適合重大決策。',
    cardCount: 10,
    highlight: '全方位解析',
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
    id: 'relationship-balance',
    name: '關係互動解析陣',
    description: '聚焦雙方的動機、互動與未來走勢，適合感情與合作議題。',
    cardCount: 6,
    highlight: '雙方視角',
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
    recommendedFor: ['self', 'health', 'general'],
    positions: [
      { id: 's1', label: '位置 1', title: '內在狀態', meaning: '此刻最需要被看見的情緒與信念。' },
      { id: 's2', label: '位置 2', title: '學習功課', meaning: '正在進行的生命課題或模式。' },
      { id: 's3', label: '位置 3', title: '支持力量', meaning: '陪伴你前進的資源、支持與靈感。' },
      { id: 's4', label: '位置 4', title: '整合方向', meaning: '將帶來療癒與突破的下一步。' }
    ]
  }
];

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

function generateDeck() {
  const deck = [...majorArcana];
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
        keywords,
        upright,
        reversed,
        detail,
        insights
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

function initializeApp() {
  cacheElements();
  attachEventListeners();
  state.deckBlueprint = generateDeck();
  resetDeck();
  setCurrentYear();
}

document.addEventListener('DOMContentLoaded', initializeApp);

function cacheElements() {
  ui.questionTextarea = document.getElementById('user-question');
  ui.submitQuestion = document.getElementById('submit-question');
  ui.skipQuestion = document.getElementById('skip-question');
  ui.analysisResult = document.getElementById('analysis-result');
  ui.recommendedSpreads = document.getElementById('recommended-spreads');
  ui.panels = Array.from(document.querySelectorAll('.panel'));
  ui.spreadCaption = document.getElementById('selected-spread-caption');
  ui.spreadDetails = document.getElementById('spread-details');
  ui.drawManual = document.getElementById('draw-manual');
  ui.drawAuto = document.getElementById('draw-auto');
  ui.resetDraw = document.getElementById('reset-draw');
  ui.deckVisual = document.getElementById('deck-visual');
  ui.positionStatus = document.getElementById('position-status');
  ui.toReading = document.getElementById('to-reading');
  ui.readingOverview = document.getElementById('reading-overview');
  ui.cardInterpretations = document.getElementById('card-interpretations');
  ui.toReport = document.getElementById('to-report');
  ui.reportSummary = document.getElementById('report-summary');
  ui.downloadReport = document.getElementById('download-report');
  ui.shareLine = document.getElementById('share-line');
  ui.shareEmail = document.getElementById('share-email');
  ui.currentYear = document.getElementById('current-year');
}

function attachEventListeners() {
  ui.submitQuestion.addEventListener('click', handleQuestionSubmit);
  ui.skipQuestion.addEventListener('click', () => {
    state.question = '';
    state.categories = ['general'];
    state.timestamp = new Date();
    renderAnalysisSummary();
    renderRecommendedSpreads();
  });

  ui.drawManual.addEventListener('click', handleManualDraw);
  ui.drawAuto.addEventListener('click', handleAutoDraw);
  ui.resetDraw.addEventListener('click', resetSpreadDraw);
  ui.toReading.addEventListener('click', () => {
    prepareReading();
    switchPanel('reading-section');
  });
  ui.toReport.addEventListener('click', () => {
    prepareReport();
    switchPanel('report-section');
  });
  ui.downloadReport.addEventListener('click', () => {
    window.print();
  });
  ui.shareLine.addEventListener('click', handleShareLine);
  ui.shareEmail.addEventListener('click', handleShareEmail);

  document.querySelectorAll('[data-action="back-to-question"]').forEach((btn) => {
    btn.addEventListener('click', () => switchPanel('question-section'));
  });
  document.querySelectorAll('[data-action="back-to-draw"]').forEach((btn) => {
    btn.addEventListener('click', () => switchPanel('spread-section'));
  });
  document.querySelectorAll('[data-action="back-to-reading"]').forEach((btn) => {
    btn.addEventListener('click', () => switchPanel('reading-section'));
  });
  document.querySelectorAll('[data-action="start-over"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      resetAll();
      switchPanel('question-section');
    });
  });
}

function handleQuestionSubmit() {
  const question = ui.questionTextarea.value.trim();
  if (!question) {
    ui.analysisResult.classList.remove('active');
    ui.analysisResult.textContent = '';
    state.question = '';
    state.categories = ['general'];
    state.timestamp = new Date();
    renderRecommendedSpreads();
    return;
  }

  state.question = question;
  state.timestamp = new Date();
  const categories = analyzeQuestion(question);
  state.categories = categories.length ? categories : ['general'];

  renderAnalysisSummary();
  renderRecommendedSpreads();
}

function analyzeQuestion(question) {
  const normalized = question.toLowerCase();
  const results = {};

  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      if (normalized.includes(keyword.toLowerCase())) {
        return acc + 1;
      }
      return acc;
    }, 0);
    if (score > 0) {
      results[category] = score;
    }
  });

  const sorted = Object.entries(results)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  return sorted;
}

function renderAnalysisSummary() {
  if (!state.question) {
    ui.analysisResult.classList.add('active');
    ui.analysisResult.innerHTML = '未輸入問題，提供通用牌陣供快速開始。';
    return;
  }

  const categoryLabels = getCategoryDisplay();
  ui.analysisResult.classList.add('active');
  ui.analysisResult.innerHTML = `問題主題傾向：<strong>${categoryLabels}</strong>。已為你挑選最契合的牌陣。`;
}

function mapCategoryLabel(category) {
  const mapping = {
    love: '感情 / 關係',
    career: '工作 / 職涯',
    finance: '財務 / 物質',
    health: '健康 / 身心',
    self: '自我成長',
    study: '學習 / 考試',
    general: '通用' 
  };
  return mapping[category] || category;
}

function getCategoryDisplay() {
  if (!state.categories || !state.categories.length) {
    return '通用';
  }
  return state.categories.map(mapCategoryLabel).join('、');
}

function renderRecommendedSpreads() {
  const categories = state.categories.length ? state.categories : ['general'];
  const matched = spreadCatalog.filter((spread) =>
    spread.recommendedFor.some((tag) => categories.includes(tag))
  );

  const suggestions = matched.length ? matched : spreadCatalog.slice(0, 3);
  state.recommendedSpreads = suggestions;

  ui.recommendedSpreads.innerHTML = suggestions
    .map((spread) => renderSpreadCard(spread))
    .join('');

  suggestions.forEach((spread) => {
    const button = document.querySelector(`button[data-spread-id="${spread.id}"]`);
    if (button) {
      button.addEventListener('click', () => {
        selectSpread(spread.id);
        switchPanel('spread-section');
      });
    }
  });
}

function renderSpreadCard(spread) {
  const positionPreview = spread.positions
    .slice(0, 3)
    .map((pos) => `<li>${pos.title}</li>`)
    .join('');

  return `
    <article class="spread-card">
      <div>
        <h3 class="spread-card__title">${spread.name}</h3>
        <div class="spread-card__meta">
          <span>共 ${spread.cardCount} 張</span>
          <span>${spread.highlight}</span>
        </div>
      </div>
      <p>${spread.description}</p>
      <ul class="spread-card__positions">${positionPreview}</ul>
      <button class="btn primary" data-spread-id="${spread.id}">選擇此牌陣</button>
    </article>
  `;
}

function selectSpread(spreadId) {
  const spread = spreadCatalog.find((item) => item.id === spreadId);
  if (!spread) return;

  state.selectedSpread = spread;
  resetSpreadDraw();
  ui.spreadCaption.textContent = `已選擇：${spread.name}`;
  renderSpreadDetails();
}

function renderSpreadDetails() {
  if (!state.selectedSpread) {
    ui.spreadDetails.innerHTML = '';
    return;
  }

  const { selectedSpread } = state;
  ui.spreadDetails.innerHTML = `
    <div class="spread-details__header">
      <h3>${selectedSpread.name}</h3>
      <p>${selectedSpread.description}</p>
    </div>
    <div class="spread-details__positions">
      ${selectedSpread.positions
        .map(
          (pos, index) => `
            <div class="spread-position" data-position="${pos.id}">
              <div class="spread-position__info">
                <div class="spread-position__label">${pos.label} · ${pos.title}</div>
                <div class="spread-position__meaning">${pos.meaning}</div>
              </div>
              <div class="spread-position__status" id="position-card-${index}">
                尚未抽牌
              </div>
            </div>
          `
        )
        .join('')}
    </div>
  `;

  updatePositionStatus();
}

function resetDeck() {
  state.remainingDeck = shuffle(state.deckBlueprint.map((card) => ({ ...card })));
}

function resetSpreadDraw() {
  if (!state.selectedSpread) return;

  resetDeck();
  const count = state.selectedSpread.cardCount;
  state.spreadDraws = Array.from({ length: count }, () => null);
  ui.drawManual.disabled = false;
  ui.drawAuto.disabled = false;
  ui.toReading.disabled = true;
  updatePositionStatus();
}

function handleManualDraw() {
  const nextIndex = state.spreadDraws.findIndex((entry) => entry === null);
  if (nextIndex === -1) return;

  const card = drawCard();
  state.spreadDraws[nextIndex] = card;
  updatePositionStatus();
  checkDrawCompletion();
}

function handleAutoDraw() {
  let nextIndex = state.spreadDraws.findIndex((entry) => entry === null);
  while (nextIndex !== -1) {
    state.spreadDraws[nextIndex] = drawCard();
    nextIndex = state.spreadDraws.findIndex((entry) => entry === null);
  }
  updatePositionStatus();
  checkDrawCompletion();
}

function drawCard() {
  if (!state.remainingDeck.length) {
    resetDeck();
  }

  const baseCard = state.remainingDeck.pop();
  const orientation = Math.random() > 0.5 ? 'upright' : 'reversed';
  const orientationLabel = orientation === 'upright' ? '正位' : '逆位';
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

function updatePositionStatus() {
  if (!state.selectedSpread) return;

  const items = state.selectedSpread.positions.map((pos, index) => {
    const card = state.spreadDraws[index];
    const display = card
      ? `${card.name} · ${card.orientationLabel}`
      : '尚未抽牌';

    const statusElement = document.getElementById(`position-card-${index}`);
    if (statusElement) {
      statusElement.textContent = display;
    }

    return `
      <li>
        <span>${pos.label} · ${pos.title}</span>
        <span class="position-status__card">${display}</span>
      </li>
    `;
  });

  ui.positionStatus.innerHTML = items.join('');
}

function checkDrawCompletion() {
  const completed = state.spreadDraws.every((entry) => entry !== null);
  if (completed) {
    ui.drawManual.disabled = true;
    ui.drawAuto.disabled = true;
    ui.toReading.disabled = false;
  }
}

function prepareReading() {
  if (!state.selectedSpread) return;

  const summaryItems = state.selectedSpread.positions.map((pos, index) => {
    const card = state.spreadDraws[index];
    return `<div class="chip">${pos.title}：${card ? card.name : '尚未抽牌'}</div>`;
  });

  ui.readingOverview.innerHTML = `
    <div class="reading-overview__meta">
      <h3>${state.selectedSpread.name}</h3>
      <p>共 ${state.selectedSpread.cardCount} 張牌 · 問題主題：${getCategoryDisplay()}</p>
      ${state.question ? `<p>提問：「${state.question}」</p>` : ''}
    </div>
    <div class="reading-overview__chips">${summaryItems.join('')}</div>
  `;

  const cardsHtml = state.selectedSpread.positions
    .map((pos, index) => {
      const card = state.spreadDraws[index];
      if (!card) return '';
      const detailText = buildDetailText(pos, card);
      const keywords = card.keywords.map((keyword) => `<span>${keyword}</span>`).join('');
      const interpretationId = `interpretation-${pos.id}`;

      return `
        <article class="card-interpretation" id="${interpretationId}">
          <div class="card-interpretation__header">
            <h4 class="card-interpretation__title">${pos.label} · ${pos.title}</h4>
            <span class="chip">${card.name} · ${card.orientationLabel}</span>
          </div>
          <p class="card-interpretation__summary">${card.meaning}</p>
          <p class="card-interpretation__details">${detailText}</p>
          <div class="keywords">${keywords}</div>
          <button class="btn ghost" data-toggle="details">查看更多</button>
        </article>
      `;
    })
    .join('');

  ui.cardInterpretations.innerHTML = cardsHtml;
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
}

function buildDetailText(position, card) {
  const base = `${position.title}代表${position.meaning}`;
  const detail = card.detail;
  const insight = card.insight;
  const questionRef = state.question ? `結合你的提問「${state.question}」，此牌提醒：${card.insight}` : card.insight;

  return `${base}。${detail} ${questionRef}`;
}

function prepareReport() {
  if (!state.selectedSpread) return;

  const headerHtml = `
    <div class="report-summary__header">
      <h3>${state.selectedSpread.name}</h3>
      ${state.question ? `<p>提問：${state.question}</p>` : ''}
      <p class="report-summary__meta">時間：${formatTimestamp(state.timestamp)} · 主題：${getCategoryDisplay()}</p>
    </div>
  `;

  const listHtml = state.selectedSpread.positions
    .map((pos, index) => {
      const card = state.spreadDraws[index];
      if (!card) return '';
      return `
        <div class="report-summary__item">
          <strong>${pos.label} · ${pos.title}</strong>
          <span>${card.name}（${card.orientationLabel}）</span>
          <span>${card.meaning}</span>
          <span class="report-summary__meta">${card.insight}</span>
        </div>
      `;
    })
    .join('');

  ui.reportSummary.innerHTML = `${headerHtml}<div class="report-summary__list">${listHtml}</div>`;
}

function handleShareLine() {
  const text = encodeURIComponent(buildShareText());
  const url = `https://social-plugins.line.me/lineit/share?text=${text}`;
  window.open(url, '_blank', 'noopener');
}

function handleShareEmail() {
  const subject = encodeURIComponent('Tarot Insight 解牌師｜我的解牌報告');
  const body = encodeURIComponent(buildShareText());
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function buildShareText() {
  if (!state.selectedSpread) {
    return 'Tarot Insight 解牌師 - 歡迎體驗完整的解牌流程。';
  }
  const lines = [];
  lines.push('Tarot Insight 解牌師 - 占卜重點');
  if (state.question) {
    lines.push(`提問：${state.question}`);
  }
  lines.push(`牌陣：${state.selectedSpread.name}`);
  lines.push(`主題：${getCategoryDisplay()}`);
  state.selectedSpread.positions.forEach((pos, index) => {
    const card = state.spreadDraws[index];
    if (!card) return;
    lines.push(`${pos.title}｜${card.name}（${card.orientationLabel}）：${card.meaning}`);
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
  resetDeck();
  ui.questionTextarea.value = '';
  ui.analysisResult.textContent = '';
  ui.analysisResult.classList.remove('active');
  ui.recommendedSpreads.innerHTML = '';
  ui.spreadCaption.textContent = '請先選擇適合的牌陣。';
  ui.spreadDetails.innerHTML = '';
  ui.positionStatus.innerHTML = '';
  ui.readingOverview.innerHTML = '';
  ui.cardInterpretations.innerHTML = '';
  ui.reportSummary.innerHTML = '';
  ui.drawManual.disabled = true;
  ui.drawAuto.disabled = true;
  ui.toReading.disabled = true;
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
