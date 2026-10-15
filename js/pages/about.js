// About Page
import { render } from '../main.js?v=202610151006';
import { getIcon } from '../icons.js?v=202610151006';

export async function renderAboutPage() {
    const companyData = await window.loadData('company');
    
    const html = `
        <div class="about-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">회사소개</h1>
                    <p class="page-subtitle">${companyData?.brandName || 'MEDIA-ISM'}</p>
                    <a href="assets/pdf/(주)미디어즘 회사 소개서.pdf" download class="btn btn-outline" style="margin-top: var(--spacing-md);">
                        ${getIcon('download', 20)} 회사소개서 다운로드
                    </a>
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

            </div>
        </div>

    `;
    
    render(html);

}

function getIconSVG(iconName) {
    return getIcon(iconName, 64);
}
