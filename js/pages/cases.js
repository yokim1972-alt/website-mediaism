// Cases Page — 작업 사례 (분류·연도로 걸러 보기)
import { render } from '../main.js?v=202610270519';
import { getIcon } from '../icons.js?v=202610270519';

// 임시값은 화면에 표시하지 않음
function isRealValue(v) {
    if (v === undefined || v === null) return false;
    const t = String(v).trim();
    if (!t || t === '-' || t === '1234' || t === '위치' || t === '설명' || t === '클라이언트') return false;
    if (/^x\s*개월$/i.test(t) || /^feature\s*\d+$/i.test(t) || /^tag\s*\d+$/i.test(t)) return false;
    return true;
}

const AI_INTRO = {
    title: 'AI 영상·이미지 제작',
    lead: '그림과 영상을 만들어 주는 AI로 전시 영상, 홍보 영상, 역사 재현 장면을 만듭니다. 대본과 장면 설계는 사람이 하고, AI는 그 장면을 그려 내는 도구로 씁니다.'
};

export async function renderCasesPage(params) {
    const casesData = await window.loadData('cases');
    const solutionsData = await window.loadData('solutions');
    const initialCat = (params && params[0]) || 'all';
    const isAI = initialCat === 'ai-content';

    const categories = casesData?.categories || [];
    const catName = {};
    categories.forEach(c => catName[c.id] = c.short || c.name);
    window.caseCategoryName = catName;

    const years = getYears(casesData?.cases);

    const html = `
        <div class="cases-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">${isAI ? AI_INTRO.title : '작업 사례'}</h1>
                    <p class="page-subtitle">${isAI ? AI_INTRO.lead : '지금까지 만든 것들입니다. 분류와 연도로 골라 볼 수 있습니다.'}</p>
                </div>

                <!-- Filters -->
                <div class="filters-container">
                    <div class="filter-group">
                        <span class="filter-label">분류</span>
                        <div class="filter-buttons" id="catFilters">
                            <button class="filter-btn ${initialCat === 'all' ? 'active' : ''}" data-filter="all" onclick="filterCases('category', 'all')">전체</button>
                            ${categories.map(cat => `
                                <button class="filter-btn ${initialCat === cat.id ? 'active' : ''}" data-filter="${cat.id}" onclick="filterCases('category', '${cat.id}')">${cat.name}</button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="filter-group">
                        <span class="filter-label">연도</span>
                        <div class="filter-buttons" id="yearFilters">
                            <button class="filter-btn active" data-filter="all" onclick="filterCases('year', 'all')">전체</button>
                            ${years.map(year => `
                                <button class="filter-btn" data-filter="${year}" onclick="filterCases('year', '${year}')">${year}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <p class="cases-count" id="casesCount"></p>

                <!-- Cases Grid -->
                <div class="cases-grid" id="casesGrid"></div>

                <!-- No Results -->
                <div id="noResults" class="no-results" style="display: none;">
                    <p>해당하는 사례가 아직 없습니다.</p>
                </div>
            </div>
        </div>
    `;

    render(html);

    window.casesData = casesData?.cases || [];
    window.currentFilters = { category: initialCat, year: 'all' };

    window.filterCases = function(filterType, value) {
        window.currentFilters[filterType] = value;

        const group = document.getElementById(filterType === 'category' ? 'catFilters' : 'yearFilters');
        group.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === String(value)));

        applyFilters();
    };

    function applyFilters() {
        let filtered = window.casesData;
        const f = window.currentFilters;
        if (f.category !== 'all') {
            filtered = filtered.filter(c => (Array.isArray(c.category) ? c.category : [c.category]).includes(f.category));
        }
        if (f.year !== 'all') {
            filtered = filtered.filter(c => String(c.year) === String(f.year));
        }
        // 최근 것이 먼저
        filtered = filtered.slice().sort((a, b) => (b.year || 0) - (a.year || 0));

        const grid = document.getElementById('casesGrid');
        const noResults = document.getElementById('noResults');
        const count = document.getElementById('casesCount');
        count.textContent = `${filtered.length}건`;

        if (filtered.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            grid.style.display = 'grid';
            noResults.style.display = 'none';
            grid.innerHTML = renderCaseCards(filtered);
        }
    }

    applyFilters();
}

function renderCaseCards(cases) {
    const catName = window.caseCategoryName || {};
    return cases.map(caseItem => `
        <a class="card case-card" href="#/case/${caseItem.id}">
            <div class="case-thumbnail">
                ${caseItem.thumbnail ? `
                    <img src="${caseItem.thumbnail}" alt="${caseItem.title}" loading="lazy" />
                ` : `
                    <div class="case-thumbnail-placeholder">
                        ${getIcon(categoryIcon(caseItem.category), 56)}
                        <span>사진 준비 중</span>
                    </div>
                `}
            </div>
            <div class="case-card-content">
                <div class="case-meta">
                    <span class="case-category">${catName[caseItem.category] || ''}${caseItem.sub ? ' · ' + caseItem.sub : ''}</span>
                    ${isRealValue(caseItem.year) ? `<span class="case-year">${caseItem.period || caseItem.year}</span>` : ''}
                </div>
                <h3 class="case-title">${caseItem.title}</h3>
                ${isRealValue(caseItem.location) ? `
                <p class="case-location">
                    <span class="location-icon">${getIcon('location', 16)}</span>
                    ${caseItem.location}
                </p>` : ''}
                ${isRealValue(caseItem.description) ? `<p class="case-description">${truncate(caseItem.description, 90)}</p>` : ''}
            </div>
        </a>
    `).join('');
}

function categoryIcon(category) {
    const map = { 'ai-content': 'ai', 'simulator': 'motion-simulator', 'theater': 'theater', 'interactive': 'interactive', 'control': 'motion-controller' };
    const cat = Array.isArray(category) ? category[0] : category;
    return map[cat] || 'design';
}

function getYears(cases) {
    if (!cases) return [];
    const years = [...new Set(cases.map(c => c.year).filter(y => isRealValue(y)))];
    return years.sort((a, b) => b - a);
}

function truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '…' : text;
}
