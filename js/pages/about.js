// About Page
import { render } from '../main.js';
import { getIcon } from '../icons.js';

export async function renderAboutPage() {
    const companyData = await window.loadData('company');
    
    const html = `
        <div class="about-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">회사소개</h1>
                    <p class="page-subtitle">${companyData?.brandName || 'MEDIA-ISM'}</p>
                    <button class="btn btn-outline" onclick="openAboutPdfModal()" style="margin-top: var(--spacing-md);">
                        ${getIcon('download', 20)} 회사소개서 다운로드
                    </button>
                </div>

                <!-- Vision & Mission -->
                <section class="section">
                    <div class="vision-mission-grid">
                        <div class="card vm-card">
                            <h2 class="card-title">VISION</h2>
                            <p class="vm-text">${companyData?.vision || ''}</p>
                        </div>
                        <div class="card vm-card">
                            <h2 class="card-title">MISSION</h2>
                            <p class="vm-text">${companyData?.mission || ''}</p>
                        </div>
                    </div>
                </section>

                <!-- Core Values -->
                <section class="section">
                    <h2 class="section-title">핵심 가치</h2>
                    <div class="grid grid-2">
                        ${companyData?.coreValues?.map(value => `
                            <div class="card value-card">
                                <div class="value-icon-large">${getIconSVG(value.icon)}</div>
                                <h3 class="card-title">${value.title}</h3>
                                <p class="card-description">${value.description}</p>
                            </div>
                        `).join('') || ''}
                    </div>
                </section>

                <!-- History -->
                <section class="section">
                    <h2 class="section-title">연혁</h2>
                    <div class="timeline">
                        ${companyData?.history?.map((item, index) => `
                            <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                                <div class="timeline-year">${item.year}</div>
                                <div class="timeline-content card">
                                    <ul class="timeline-events">
                                        ${item.events?.map(event => `<li>${event}</li>`).join('') || ''}
                                    </ul>
                                </div>
                            </div>
                        `).join('') || ''}
                    </div>
                </section>

                <!-- Certifications & Patents -->
                <section class="section">
                    <div class="cert-patent-grid">
                        <div class="card">
                            <h3 class="card-title">인증</h3>
                            <ul class="cert-list">
                                ${companyData?.certifications?.map(cert => `
                                    <li>
                                        <strong>${cert.name}</strong>
                                        <span class="cert-detail">${cert.issuer} (${cert.year})</span>
                                    </li>
                                `).join('') || ''}
                            </ul>
                        </div>
                        <div class="card">
                            <h3 class="card-title">특허</h3>
                            <ul class="patent-list">
                                ${companyData?.patents?.map(patent => `
                                    <li>
                                        <strong>${patent.title}</strong>
                                        <span class="patent-detail">특허 ${patent.number} (${patent.year})</span>
                                    </li>
                                `).join('') || ''}
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- Company Info -->
                <section class="section">
                    <div class="card company-info-card">
                        <h3 class="card-title">회사 정보</h3>
                        <div class="company-info-grid">
                            <div class="info-item">
                                <span class="info-label">회사명</span>
                                <span class="info-value">${companyData?.name || ''}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">브랜드명</span>
                                <span class="info-value">${companyData?.brandName || ''}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">설립연도</span>
                                <span class="info-value">${companyData?.established || ''}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA -->
                <section class="section-cta">
                    <button class="btn btn-primary btn-large" onclick="window.location.hash='#/contact'">
                        문의하기
                    </button>
                </section>
            </div>
        </div>

        <!-- PDF Download Modal -->
        <div id="aboutPdfModal" class="modal" onclick="closeAboutPdfModal()">
            <div class="modal-content" style="max-width: 500px;" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeAboutPdfModal()">&times;</button>
                <div style="text-align: center; padding: var(--spacing-xs);">
                    <div class="pdf-icon" style="margin: 0 auto var(--spacing-lg);">${getIcon('document', 48)}</div>
                    <h2 style="margin-bottom: var(--spacing-md);">회사소개서 다운로드</h2>
                    <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">
                        미디어필의 비전, 핵심 기술, 주요 프로젝트를 담은 종합 소개서
                    </p>
                    <a href="assets/pdf/(주)미디어즘 회사 소개서.pdf" download class="btn btn-primary btn-large">
                        ${getIcon('download', 24)} PDF 다운로드
                    </a>
                </div>
            </div>
        </div>
    `;
    
    render(html);

    // PDF Modal functions
    window.openAboutPdfModal = function() {
        document.getElementById('aboutPdfModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeAboutPdfModal = function() {
        document.getElementById('aboutPdfModal').classList.remove('active');
        document.body.style.overflow = '';
    };

    // Auto-open modal on page load
    setTimeout(() => {
        window.openAboutPdfModal();
    }, 500);
}

function getIconSVG(iconName) {
    return getIcon(iconName, 64);
}
