// Solutions Page
import { render } from '../main.js';
import { getIcon } from '../icons.js';

export async function renderSolutionsPage() {
    const solutionsData = await window.loadData('solutions');
    
    const html = `
        <div class="solutions-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">솔루션</h1>
                    <p class="page-subtitle">최첨단 기술로 구현하는 6가지 핵심 솔루션</p>
                </div>

                <!-- PDF Download Section -->
                <section class="pdf-download-section">
                    <h3>소개서 다운로드</h3>
                    <div class="pdf-download-grid">
                        <div class="pdf-download-card">
                            <div class="pdf-icon">${getIcon('document', 40)}</div>
                            <h4>모션 시뮬레이터 및 플랫폼 소개서</h4>
                            <p>첨단 모션 시뮬레이터 기술과 플랫폼에 대한 상세 정보</p>
                            <a href="assets/pdf/motion-simulator-platform.pdf" download class="btn btn-outline btn-small">
                                ${getIcon('download', 20)} PDF 다운로드
                            </a>
                        </div>
                        <div class="pdf-download-card">
                            <div class="pdf-icon">${getIcon('document', 40)}</div>
                            <h4>4D 시스템 토탈 솔루션 소개서</h4>
                            <p>통합 4D 시스템 솔루션의 모든 것을 담은 종합 안내서</p>
                            <a href="assets/pdf/4d-solution.pdf" download class="btn btn-outline btn-small">
                                ${getIcon('download', 20)} PDF 다운로드
                            </a>
                        </div>
                    </div>
                </section>

                <!-- Solutions Grid -->
                <div class="solutions-grid">
                    ${solutionsData?.solutions?.map(solution => `
                        <div class="card solution-card" data-solution="${solution.id}">
                            <div class="solution-card-icon">${getIconSVG(solution.icon)}</div>
                            <h2 class="solution-card-title">${solution.title}</h2>
                            <p class="solution-card-subtitle">${solution.subtitle}</p>
                            <p class="solution-card-description">${solution.description}</p>
                            
                            <div class="solution-card-features">
                                <h4>주요 특징</h4>
                                <ul>
                                    ${solution.features?.slice(0, 3).map(feature => `<li>${feature}</li>`).join('') || ''}
                                </ul>
                            </div>
                            
                            <button class="btn btn-outline btn-small" onclick="openSolutionDetail('${solution.id}')">
                                자세히 보기
                            </button>
                        </div>
                    `).join('') || ''}
                </div>

                <!-- CTA -->
                <section class="section-cta">
                    <div class="cta-box">
                        <h2>어떤 솔루션이 필요하신가요?</h2>
                        <p>전문가와 상담하여 프로젝트에 최적화된 솔루션을 찾아보세요</p>
                        <button class="btn btn-secondary btn-large" onclick="window.location.hash='#/contact'">
                            상담 신청
                        </button>
                    </div>
                </section>
            </div>
        </div>

        <!-- Solution Detail Modal -->
        <div id="solutionModal" class="modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeSolutionDetail()">&times;</button>
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
                    <div class="solution-detail-icon">${getIconSVG(solution.icon)}</div>
                    <div>
                        <h2>${solution.title}</h2>
                        <p class="solution-detail-subtitle">${solution.subtitle}</p>
                    </div>
                </div>
                
                <p class="solution-detail-description">${solution.description}</p>
                
                <div class="solution-detail-grid">
                    <div class="solution-detail-section">
                        <h3>주요 특징</h3>
                        <ul>
                            ${solution.features?.map(feature => `<li>${feature}</li>`).join('') || ''}
                        </ul>
                    </div>
                    
                    <div class="solution-detail-section">
                        <h3>활용 분야</h3>
                        <ul>
                            ${solution.applications?.map(app => `<li>${app}</li>`).join('') || ''}
                        </ul>
                    </div>
                </div>
                
                <div class="solution-detail-actions">
                    <button class="btn btn-primary" onclick="window.location.hash='#/contact'; closeSolutionDetail();">
                        상담 신청
                    </button>
                    <button class="btn btn-outline" onclick="window.location.hash='#/cases'; closeSolutionDetail();">
                        관련 사례 보기
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
}

function getIconSVG(iconName) {
    return getIcon(iconName, 48);
}
