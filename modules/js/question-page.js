(function (window) {
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

  function getLanguage() {
    if (i18n && typeof i18n.getLanguage === 'function') {
      return i18n.getLanguage();
    }
    return 'chinese';
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

  const categoryKeywords = {
    love: [
      '愛情',
      '感情',
      '戀人',
      '伴侶',
      '婚姻',
      '關係',
      '曖昧',
      '分手',
      '復合',
      '感受',
      '桃花',
      'love',
      'relationship',
      'partner',
      'romance',
      'marriage',
      'couple',
      'dating'
    ],
    career: [
      '工作',
      '職涯',
      '升遷',
      '職場',
      '老闆',
      '同事',
      '創業',
      '面試',
      '事業',
      '專案',
      'career',
      'job',
      'promotion',
      'work',
      'boss',
      'colleague',
      'business',
      'startup',
      'project'
    ],
    finance: [
      '財務',
      '金錢',
      '收入',
      '投資',
      '理財',
      '資金',
      '薪水',
      '負債',
      '購屋',
      'finance',
      'money',
      'income',
      'investment',
      'budget',
      'salary',
      'wealth',
      'debt',
      'house'
    ],
    health: [
      '健康',
      '身體',
      '養生',
      '醫療',
      '睡眠',
      '壓力',
      '飲食',
      'health',
      'wellbeing',
      'well-being',
      'healing',
      'medical',
      'stress',
      'diet',
      'wellness'
    ],
    self: [
      '自我',
      '成長',
      '靈性',
      '人生',
      '目標',
      '方向',
      '迷惘',
      '情緒',
      '療癒',
      '內在',
      'self',
      'growth',
      'spiritual',
      'purpose',
      'goal',
      'direction',
      'emotion',
      'healing',
      'inner'
    ],
    study: [
      '學業',
      '課業',
      '考試',
      '學習',
      '研究',
      '留學',
      'study',
      'exam',
      'learning',
      'school',
      'education',
      'research',
      'test'
    ]
  };

  const categoryLabelMap = {
    love: { chinese: '感情 / 關係', english: 'Love / Relationships' },
    career: { chinese: '工作 / 職涯', english: 'Career / Work' },
    finance: { chinese: '財務 / 物質', english: 'Finance / Resources' },
    health: { chinese: '健康 / 身心', english: 'Health / Wellbeing' },
    self: { chinese: '自我成長', english: 'Self Growth' },
    study: { chinese: '學習 / 考試', english: 'Study / Exams' },
    general: { chinese: '通用', english: 'General' }
  };

  const defaultCategoryLabel = { chinese: '通用', english: 'General' };

  const themePriority = ['analysis', 'inner', 'relationship', 'direction'];

  const QuestionPage = {
    init({ state, ui, spreadCatalog, selectSpread, switchPanel }) {
      if (this.initialized) {
        return;
      }
      this.state = state;
      this.ui = ui;
      this.selectSpread = selectSpread;
      this.switchPanel = switchPanel;
      this.setCatalog(spreadCatalog);

      this.boundHandleQuestionSubmit = this.handleQuestionSubmit.bind(this);
      this.boundHandleSkipQuestion = this.handleSkipQuestion.bind(this);

      if (this.ui.submitQuestion) {
        this.ui.submitQuestion.addEventListener('click', this.boundHandleQuestionSubmit);
      }
      if (this.ui.skipQuestion) {
        this.ui.skipQuestion.addEventListener('click', this.boundHandleSkipQuestion);
      }

      this.initialized = true;
    },
    setCatalog(newCatalog) {
      if (!Array.isArray(newCatalog)) {
        return;
      }
      this.spreadCatalog = newCatalog;
      if (this.state) {
        if (this.state.selectedSpread) {
          const updatedSelected = newCatalog.find((item) => item.id === this.state.selectedSpread.id);
          if (updatedSelected) {
            this.state.selectedSpread = updatedSelected;
          } else {
            this.state.selectedSpread = null;
          }
        }
        if (Array.isArray(this.state.recommendedSpreads) && this.state.recommendedSpreads.length) {
          this.state.recommendedSpreads = this.state.recommendedSpreads
            .map((spread) => newCatalog.find((item) => item.id === spread.id) || spread)
            .filter(Boolean);
        }
      }
      if (this.initialized) {
        this.renderAnalysisSummary();
        this.renderRecommendedSpreads();
      }
    },

    reset() {
      if (!this.state || !this.ui) {
        return;
      }
      this.state.question = '';
      this.state.categories = [];
      this.state.recommendedSpreads = [];
      this.state.showAllSpreads = false;

      if (this.ui.questionTextarea) {
        this.ui.questionTextarea.value = '';
      }
      if (this.ui.analysisResult) {
        this.ui.analysisResult.textContent = '';
        this.ui.analysisResult.classList.remove('active');
      }
      if (this.ui.recommendedSpreads) {
        this.ui.recommendedSpreads.innerHTML = '';
      }
    },

    handleQuestionSubmit() {
      if (!this.ui || !this.state) {
        return;
      }
      const textarea = this.ui.questionTextarea;
      if (!textarea) {
        return;
      }

      const question = textarea.value.trim();
      if (!question) {
        this.state.question = '';
        this.state.categories = ['general'];
        this.state.timestamp = new Date();
        this.state.showAllSpreads = false;
        if (this.ui.analysisResult) {
          this.ui.analysisResult.classList.remove('active');
          this.ui.analysisResult.textContent = '';
        }
        this.renderRecommendedSpreads();
        return;
      }

      this.state.question = question;
      this.state.timestamp = new Date();
      const categories = this.analyzeQuestion(question);
      this.state.categories = categories.length ? categories : ['general'];
      this.state.showAllSpreads = false;

      this.renderAnalysisSummary();
      this.renderRecommendedSpreads();
    },

    handleSkipQuestion() {
      if (!this.state) {
        return;
      }

      const textarea = this.ui?.questionTextarea;
      const pendingQuestion = textarea ? textarea.value.trim() : '';

      if (pendingQuestion) {
        this.state.question = pendingQuestion;
        const categories = this.analyzeQuestion(pendingQuestion);
        this.state.categories = categories.length ? categories : ['general'];
      } else {
        this.state.question = '';
        this.state.categories = [];
      }

      this.state.timestamp = new Date();
      this.state.showAllSpreads = true;

      this.renderAnalysisSummary();
      this.renderRecommendedSpreads();
    },

    analyzeQuestion(question) {
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

      return Object.entries(results)
        .sort((a, b) => b[1] - a[1])
        .map(([category]) => category);
    },

    renderAnalysisSummary() {
      if (!this.ui || !this.ui.analysisResult) {
        return;
      }

      if (!this.state.question) {
        this.ui.analysisResult.classList.remove('active');
        this.ui.analysisResult.textContent = '';
        return;
      }

      const categoryLabels = this.getCategoryDisplay();
      this.ui.analysisResult.classList.add('active');
      const summary = translate('analysisSummary', {
        categories: categoryLabels,
        fallback: `問題主題傾向：<strong>${categoryLabels}</strong>。已為你挑選最契合的牌陣。`
      });
      this.ui.analysisResult.innerHTML = summary;
    },

    renderRecommendedSpreads() {
      if (!this.ui || !this.ui.recommendedSpreads || !this.spreadCatalog) {
        return;
      }

      const themeOrder = themePriority.reduce((acc, theme, index) => {
        acc[theme] = index;
        return acc;
      }, {});

      const sortedCatalog = [...this.spreadCatalog].sort((a, b) => {
        const themeA = Object.prototype.hasOwnProperty.call(themeOrder, a.theme)
          ? themeOrder[a.theme]
          : themePriority.length;
        const themeB = Object.prototype.hasOwnProperty.call(themeOrder, b.theme)
          ? themeOrder[b.theme]
          : themePriority.length;
        if (themeA !== themeB) {
          return themeA - themeB;
        }
        return a.cardCount - b.cardCount;
      });

      let suggestions;
      if (this.state.showAllSpreads) {
        suggestions = sortedCatalog;
      } else {
        const categories = this.state.categories.length ? this.state.categories : ['general'];
        const matched = sortedCatalog.filter((spread) =>
          spread.recommendedFor.some((tag) => categories.includes(tag))
        );
        suggestions = matched.length ? matched : sortedCatalog.slice(0, 3);
      }

      this.state.recommendedSpreads = suggestions;

      this.ui.recommendedSpreads.innerHTML = suggestions
        .map((spread) => this.renderSpreadCard(spread))
        .join('');

      suggestions.forEach((spread) => {
        const button = this.ui.recommendedSpreads.querySelector(
          `button[data-spread-id="${spread.id}"]`
        );
        if (button) {
          button.addEventListener('click', () => {
            this.selectSpread(spread.id);
            if (typeof this.switchPanel === 'function') {
              this.switchPanel('spread-section');
            }
          });
        }
      });
    },

    renderSpreadCard(spread) {
      const themeClass = spread.theme ? ` spread-card--${spread.theme}` : '';
      const name = localize(spread.name, spread.name);
      const description = localize(spread.description, spread.description);
      const highlightText = spread.highlight ? localize(spread.highlight, spread.highlight) : '';
      const positionPreview = spread.positions
        .slice(0, 3)
        .map((pos) => `<li>${localize(pos.title, pos.title)}</li>`)
        .join('');
      const cardCountLabel = translate('spreadCardCountLabel', {
        count: spread.cardCount,
        fallback: `共 ${spread.cardCount} 張`
      });
      const actionLabel = translate('chooseSpread', { fallback: '選擇此牌陣' });

      return `
        <article class="spread-card${themeClass}">
          <div class="spread-card__header">
            <div>
              <h3 class="spread-card__title">${name}</h3>
              <div class="spread-card__meta">
                <span>${cardCountLabel}</span>
              </div>
            </div>
            ${highlightText ? `<span class="spread-card__tag">${highlightText}</span>` : ''}
          </div>
          <p>${description}</p>
          <ul class="spread-card__positions">${positionPreview}</ul>
          <button class="btn spread-card__action" data-spread-id="${spread.id}">${actionLabel}</button>
        </article>
      `;
    },

    mapCategoryLabel(category) {
      const label = categoryLabelMap[category];
      if (!label) {
        return category;
      }
      const fallbackText =
        typeof label === 'object' && label.chinese ? label.chinese : typeof label === 'string' ? label : category;
      return localize(label, fallbackText);
    },

    getCategoryDisplay() {
      if (!this.state.categories || !this.state.categories.length) {
        return localize(defaultCategoryLabel, defaultCategoryLabel.chinese);
      }
      const language = getLanguage();
      const separator = language === 'english' ? ', ' : '、';
      return this.state.categories.map((category) => this.mapCategoryLabel(category)).join(separator);
    },

    handleLanguageChange() {
      if (!this.initialized) {
        return;
      }
      this.renderAnalysisSummary();
      this.renderRecommendedSpreads();
    }
  };

  window.QuestionPage = QuestionPage;
})(window);
