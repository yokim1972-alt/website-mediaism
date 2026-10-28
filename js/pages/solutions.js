// Solutions Page — 하는 일 (큰 분류 5개, 각 분류 안에 하위 항목)
import { render } from '../main.js?v=202610280521';
import { getIcon } from '../icons.js?v=202610280521';

export async function renderSolutionsPage(params) {
    const solutionsData = await window.loadData('solutions');
    const casesData = await window.loadData('cases');
    const openId = params && params[0];

    const countByCat = {};
    (casesData?.cases || []).forEach(c => { countByCat[c.category] = (countByCat[c.category] || 0) + 1; });

    const html = `
        <div class="solutions-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">하는 일</h1>
                    <p class="page-subtitle">다섯 가지 일을 합니다. 각 칸을 누르면 하위 항목과 자세한 설명이 나옵니다.</p>
                </div>

                <!-- Solutions Grid -->
                <div class="solutions-grid">
                    ${solutionsData?.solutions?.map(solution => `
                        <div class="card solution-card" data-solution="${solution.id}" onclick="openSolutionDetail('${solution.id}')" role="button" tabindex="0">
                            <div class="solution-card-icon">${getIcon(solution.icon, 48)}</div>
                            <h2 class="solution-card-title">${solution.title}</h2>
                            <p class="solution-card-subtitle">${solution.subtitle}</p>
                            <p class="solution-card-description">${solution.description}</p>

                            <div class="solution-card-features">
                                <h4>하위 항목</h4>
                                <ul>
                                    ${solution.items?.map(it => `<li>${it.name}</li>`).join('') || ''}
                                </ul>
                            </div>
                            <div class="solution-card-foot">
                                <span class="solution-card-count">작업 사례 ${countByCat[solution.id] || 0}건</span>
                                <span class="solution-card-more">자세히 보기 →</span>
                            </div>
                        </div>
                    `).join('') || ''}
                </div>
            </div>
        </div>

        <!-- Solution Detail Modal -->
        <div id="solutionModal" class="modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeSolutionDetail()" aria-label="닫기">&times;</button>
                <div id="solutionModalBody"></div>
            </div>
        </div>
    `;

    render(html);

    // Solution detail modal functions
    window.openSolutionDetail = function(solutionId) {
        const solution = solutionsData?.solutions?.find(s => s.id === solutionId);
        if (!solution) return;

        const modalBody = document.getElementById('solutionModalBody');
        modalBody.innerHTML = `
            <div class="solution-detail">
                <div class="solution-detail-header">
                    <div class="solution-detail-icon">${getIcon(solution.icon, 48)}</div>
                    <div>
                        <h2>${solution.title}</h2>
                        <p class="solution-detail-subtitle">${solution.subtitle}</p>
                    </div>
                </div>

                <p class="solution-detail-description">${solution.description}</p>

                <div class="solution-detail-section">
                    <h3>하위 항목</h3>
                    <div class="solution-items">
                        ${solution.items?.map(it => `
                            <div class="solution-item">
                                <strong>${it.name}</strong>
                                <span>${it.desc}</span>
                            </div>
                        `).join('') || ''}
                    </div>
                </div>

                <div class="solution-detail-grid">
                    <div class="solution-detail-section">
                        <h3>이런 점이 좋습니다</h3>
                        <ul>
                            ${solution.features?.map(feature => `<li>${feature}</li>`).join('') || ''}
                        </ul>
                    </div>

                    <div class="solution-detail-section">
                        <h3>이런 곳에 씁니다</h3>
                        <ul>
                            ${solution.applications?.map(app => `<li>${app}</li>`).join('') || ''}
                        </ul>
                    </div>
                </div>

                <div class="solution-detail-actions">
                    <button class="btn btn-primary" onclick="window.location.hash='#/cases/${solution.id}'; closeSolutionDetail();">
                        작업 사례 보기 (${countByCat[solution.id] || 0}건)
                    </button>
                </div>
            </div>
        `;

        document.getElementById('solutionModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeSolutionDetail = function() {
        document.getElementById('solutionModal').classList.remove('active');
        document.body.style.overflow = '';
    };

    // 배경을 누르면 닫힘
    document.getElementById('solutionModal').addEventListener('click', (e) => {
        if (e.target.id === 'solutionModal') window.closeSolutionDetail();
    });

    // #/solutions/<id> 로 들어오면 그 분류를 바로 펼침
    if (openId) window.openSolutionDetail(openId);
}
