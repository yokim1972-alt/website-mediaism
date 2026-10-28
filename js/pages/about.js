// About Page — 회사소개
import { render } from '../main.js?v=202610280527';
import { getIcon } from '../icons.js?v=202610280527';

export async function renderAboutPage() {
    const companyData = await window.loadData('company');

    const html = `
        <div class="about-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">회사소개</h1>
                    <p class="page-subtitle">${companyData?.name || '(주)미디어즘'} · ${companyData?.established || ''}년 설립</p>
                </div>

                <!-- 소개 -->
                <section class="section">
                    <div class="card vm-card" style="max-width: 820px; margin: 0 auto;">
                        <h2 class="card-title">어떤 회사인가</h2>
                        <p class="vm-text">${companyData?.intro || ''}</p>
                    </div>
                </section>

                <!-- 우리의 생각 -->
                <section class="section">
                    <div class="card vm-card vm-quote" style="max-width: 820px; margin: 0 auto;">
                        <h2 class="card-title">우리의 생각</h2>
                        <p class="vm-text">${companyData?.vision || ''}</p>
                    </div>
                </section>

                <!-- 일하는 방식 -->
                <section class="section">
                    <h2 class="section-title">일하는 방식</h2>
                    <div class="grid grid-2">
                        ${companyData?.coreValues?.map(value => `
                            <div class="card value-card">
                                <div class="value-icon">${getIcon(value.icon, 40)}</div>
                                <h3 class="card-title">${value.title}</h3>
                                <p class="card-description">${value.description}</p>
                            </div>
                        `).join('') || ''}
                    </div>
                </section>

                <!-- 사람 -->
                ${companyData?.team ? `
                <section class="section">
                    <h2 class="section-title">함께 일하는 사람</h2>
                    <div class="team-grid">
                        ${companyData.team.map(t => `
                            <div class="card team-card">
                                <div class="team-count">${t.count}<span>명</span></div>
                                <div class="team-name">${t.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </section>` : ''}

                <!-- History -->
                <section class="section">
                    <h2 class="section-title">걸어온 길</h2>
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
