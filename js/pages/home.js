// Home Page
import { render } from '../main.js?v=202610280527';
import { getIcon } from '../icons.js?v=202610280527';

export async function renderHomePage() {
    const companyData = await window.loadData('company');
    const solutionsData = await window.loadData('solutions');
    const casesData = await window.loadData('cases');

    const catName = {};
    (casesData?.categories || []).forEach(c => catName[c.id] = c.short || c.name);

    // 최근 작업: 사진이 있는 사례 가운데 연도가 최근인 것 6개
    const recent = (casesData?.cases || [])
        .filter(c => c.images && c.images.length > 0)
        .sort((a, b) => (b.year || 0) - (a.year || 0))
        .slice(0, 6);

    const html = `
        <div class="home-page">
            <!-- Hero Section -->
            <section class="hero-section">
                <video class="hero-video" autoplay muted loop playsinline poster="./assets/img/hero-poster.jpg">
                    <source src="./assets/video/video.mp4" type="video/mp4">
                </video>
                <div class="hero-overlay"></div>
                <div class="container">
                    <div class="hero-content">
                        <h1 class="hero-title">
                            ${companyData?.tagline || '보고, 타고, 만지는 체험을 만듭니다'}<br>
                            <span class="highlight">체험 시뮬레이터 · 입체 영상관 · 체험형 전시 · AI 영상</span>
                        </h1>
                        <p class="hero-subtitle">
                            ${companyData?.mission || ''}
                        </p>
                        <div class="hero-actions">
                            <button class="btn btn-primary btn-large" onclick="window.location.hash='#/solutions'">
                                하는 일 보기
                            </button>
                            <button class="btn btn-outline btn-large" onclick="window.location.hash='#/cases'">
                                작업 사례 보기
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 하는 일 (5개 분류) -->
            <section class="section home-solutions-section">
                <div class="container">
                    <h2 class="section-title">하는 일</h2>
                    <p class="section-lead">다섯 가지 일을 합니다. 누르면 자세한 설명으로 갑니다.</p>
                    <div class="home-solutions-grid">
                        ${solutionsData?.solutions?.map(s => `
                            <a class="card home-solution-card" href="#/solutions/${s.id}">
                                <div class="home-solution-icon">${getIcon(s.icon, 36)}</div>
                                <h3>${s.title}</h3>
                                <p>${s.subtitle}</p>
                            </a>
                        `).join('') || ''}
                    </div>
                </div>
            </section>

            <!-- 최근 작업 -->
            <section class="section home-recent-section">
                <div class="container">
                    <h2 class="section-title">최근 작업</h2>
                    <div class="home-recent-grid">
                        ${recent.map(c => `
                            <a class="home-recent-card" href="#/case/${c.id}">
                                <div class="home-recent-thumb"><img src="${c.thumbnail}" alt="${c.title}" loading="lazy" /></div>
                                <div class="home-recent-body">
                                    <span class="home-recent-cat">${catName[c.category] || ''}${c.year ? ' · ' + c.year : ''}</span>
                                    <h3>${c.title}</h3>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                    <div class="section-cta">
                        <button class="btn btn-outline" onclick="window.location.hash='#/cases'">작업 사례 전체 보기</button>
                    </div>
                </div>
            </section>

            <!-- 일하는 방식 -->
            <section class="section core-values-section">
                <div class="container">
                    <h2 class="section-title">일하는 방식</h2>
                    <div class="grid grid-2">
                        ${companyData?.coreValues?.map(value => `
                            <div class="card value-card">
                                <div class="value-icon">${getIcon(value.icon, 48)}</div>
                                <h3 class="card-title">${value.title}</h3>
                                <p class="card-description">${value.description}</p>
                            </div>
                        `).join('') || ''}
                    </div>
                </div>
            </section>
        </div>
    `;

    render(html);
}
