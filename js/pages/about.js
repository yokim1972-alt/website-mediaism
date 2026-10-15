// About Page
import { render } from '../main.js?v=202610151014';
import { getIcon } from '../icons.js?v=202610151014';

export async function renderAboutPage() {
    const companyData = await window.loadData('company');
    
    const html = `
        <div class="about-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">회사소개</h1>
                    <p class="page-subtitle">${companyData?.brandName || 'MEDIA-ISM'}</p>
                </div>

                <!-- Vision & Mission -->
                <section class="section">
                    <div class="card vm-card" style="max-width: 820px; margin: 0 auto;">
                        <h2 class="card-title">VISION</h2>
                        <p class="vm-text">${companyData?.vision || ''}</p>
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
