// Cases Page — 작업 사례 (분류·연도로 걸러 보기)
import { render } from '../main.js?v=202610280524';
import { getIcon } from '../icons.js?v=202610280524';

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

                ${isAI ? `
                <!-- AI 이미지 갤러리 (버튼을 누르면 펼쳐짐) -->
                <div class="ai-gallery-bar">
                    <button class="ai-gallery-btn" id="aiGalleryBtn" aria-expanded="false">
                        ${getIcon('ai', 22)} <span>AI 영상·이미지 갤러리</span> <small>대표 이미지 한 컷씩 보기</small>
                    </button>
                </div>
                <div class="ai-gallery" id="aiGallery" style="display:none"></div>
                ` : ''}

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

    if (isAI) setupAISections(casesData?.cases || []);
}

// ---------- AI 페이지: 갤러리 + 대표 영상 ----------
async function setupAISections(allCases) {
    // 갤러리 버튼
    const btn = document.getElementById('aiGalleryBtn');
    const gal = document.getElementById('aiGallery');
    if (!btn || !gal) return;
    let items = null;
    btn.addEventListener('click', async () => {
        const open = gal.style.display === 'none';
        if (open && !items) {
            try {
                const v = (new URL(import.meta.url)).searchParams.get('v') || '0';
                const r = await fetch(`./data/ai-gallery.json?v=${v}`);
                items = r.ok ? (await r.json()).items : [];
            } catch (e) { items = []; }
            gal.innerHTML = `
                <div class="ai-gallery-grid">
                    ${items.map((it, i) => `
                        <figure class="ai-gallery-item" data-i="${i}">
                            <img src="${it.thumb}" alt="${it.title}" loading="lazy" />
                            <figcaption>${it.title}</figcaption>
                        </figure>
                    `).join('')}
                </div>
                <div id="aiLightbox" class="lightbox" style="display:none">
                    <span class="lightbox-close" aria-label="닫기">&times;</span>
                    <button class="lightbox-nav lightbox-prev" aria-label="이전">&#8249;</button>
                    <div class="lightbox-stage"><img class="lightbox-content" id="aiLbImg" oncontextmenu="return false" /></div>
                    <button class="lightbox-nav lightbox-next" aria-label="다음">&#8250;</button>
                    <p class="lightbox-caption" id="aiLbCap"></p>
                </div>`;
            setupGalleryLightbox(items);
        }
        gal.style.display = open ? 'block' : 'none';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.classList.toggle('open', open);
        if (open) gal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function setupGalleryLightbox(items) {
    const lb = document.getElementById('aiLightbox');
    const img = document.getElementById('aiLbImg');
    const cap = document.getElementById('aiLbCap');
    let idx = 0;
    function show(i) {
        idx = (i + items.length) % items.length;
        img.src = items[idx].src;
        cap.textContent = `${items[idx].title}  (${idx + 1}/${items.length})`;
        lb.style.display = 'flex'; document.body.style.overflow = 'hidden';
    }
    function close() { lb.style.display = 'none'; document.body.style.overflow = ''; }
    document.querySelectorAll('.ai-gallery-item').forEach(el => el.addEventListener('click', () => show(Number(el.dataset.i))));
    lb.querySelector('.lightbox-close').addEventListener('click', close);
    lb.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lightbox-stage')) close(); });
    document.addEventListener('keydown', (e) => {
        if (lb.style.display === 'none') return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(idx - 1);
        if (e.key === 'ArrowRight') show(idx + 1);
    });
    let tx = null;
    lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1); });
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
