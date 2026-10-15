// Cases Page
import { render } from '../main.js';
import { getIcon } from '../icons.js';

export async function renderCasesPage() {
    const casesData = await window.loadData('cases');
    
    const html = `
        <div class="cases-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">사례</h1>
                    <p class="page-subtitle">다양한 프로젝트 경험과 성공 사례를 확인하세요</p>
                </div>

                <!-- Filters -->
                <div class="filters-container">
                    <div class="filter-group">
                        <label class="filter-label">카테고리</label>
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-filter="all" onclick="filterCases('category', 'all')">
                                전체
                            </button>
                            ${casesData?.categories?.map(cat => `
                                <button class="filter-btn" data-filter="${cat.id}" onclick="filterCases('category', '${cat.id}')">
                                    ${cat.name}
                                </button>
                            `).join('') || ''}
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">연도</label>
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-filter="all" onclick="filterCases('year', 'all')">
                                전체
                            </button>
                            ${getYears(casesData?.cases).map(year => `
                                <button class="filter-btn" data-filter="${year}" onclick="filterCases('year', '${year}')">
                                    ${year}
                                </button>
                            `).join('') || ''}
                        </div>
                    </div>
                </div>

                <!-- Cases Grid -->
                <div class="cases-grid" id="casesGrid">
                    ${renderCaseCards(casesData?.cases || [])}
                </div>

                <!-- No Results -->
                <div id="noResults" class="no-results" style="display: none;">
                    <p>검색 결과가 없습니다.</p>
                </div>
            </div>
        </div>
    `;
    
    render(html);
    
    // Store cases data for filtering
    window.casesData = casesData?.cases || [];
    window.currentFilters = { category: 'all', year: 'all' };
    
    // Filter function
    window.filterCases = function(filterType, value) {
        window.currentFilters[filterType] = value;
        
        // Update active filter button
        const filterButtons = document.querySelectorAll(`.filter-group:has([data-filter="${value}"]) .filter-btn`);
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.closest('.filter-group') === filterButtons[0]?.closest('.filter-group')) {
                btn.classList.remove('active');
            }
        });
        document.querySelector(`.filter-btn[data-filter="${value}"]`)?.classList.add('active');
        
        // Filter cases
        let filteredCases = window.casesData;
        
        if (window.currentFilters.category !== 'all') {
            filteredCases = filteredCases.filter(c => {
                const categories = Array.isArray(c.category) ? c.category : [c.category];
                return categories.includes(window.currentFilters.category);
            });
        }
        
        if (window.currentFilters.year !== 'all') {
            filteredCases = filteredCases.filter(c => c.year.toString() === window.currentFilters.year);
        }
        
        // Update grid
        const grid = document.getElementById('casesGrid');
        const noResults = document.getElementById('noResults');
        
        if (filteredCases.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            grid.style.display = 'grid';
            noResults.style.display = 'none';
            grid.innerHTML = renderCaseCards(filteredCases);
        }
    };
}

function renderCaseCards(cases) {
    return cases.map(caseItem => `
        <div class="card case-card" onclick="window.location.hash='#/case/${caseItem.id}'">
            <div class="case-thumbnail">
                ${caseItem.thumbnail ? `
                    <img src="${caseItem.thumbnail}" alt="${caseItem.title}" />
                ` : `
                    <div class="case-thumbnail-placeholder" style="background: linear-gradient(135deg, #00bfa5, #1a1a1a);">
                        ${getCategoryIcon(caseItem.category)}
                    </div>
                `}
            </div>
            <div class="case-card-content">
                <div class="case-meta">
                    <span class="case-category">${getCategoryName(caseItem.category)}</span>
                    <span class="case-year">${caseItem.year}</span>
                </div>
                <h3 class="case-title">${caseItem.title}</h3>
                <p class="case-location">
                    <span class="location-icon">${getIcon('location', 16)}</span>
                    ${caseItem.location}
                </p>
                <p class="case-description">${truncate(caseItem.description, 100)}</p>
                <div class="case-tags">
                    ${caseItem.tags?.slice(0, 3).map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('') || ''}
                </div>
            </div>
        </div>
    `).join('');
}

function getYears(cases) {
    const years = [...new Set(cases?.map(c => c.year) || [])];
    return years.sort((a, b) => b - a);
}

function getCategoryIcon(category) {
    return getIcon(category, 64);
}

function getCategoryName(category) {
    const names = {
        '3d': '3D',
        '4d': '4D',
        'vr-simulator': 'VR Simulator',
        'experience-simulator': 'Experience Simulator',
        'interactive': 'Interactive',
        'motion-simulator': 'Motion Simulator',
        'motion-controller': 'Motion Controller'
    };
    
    if (Array.isArray(category)) {
        return category.map(cat => names[cat] || cat).join(', ');
    }
    
    return names[category] || category;
}

function truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}
