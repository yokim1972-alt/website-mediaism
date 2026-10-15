// Home Page
import { render } from '../main.js';
import { getIcon } from '../icons.js';

export async function renderHomePage() {
    const companyData = await window.loadData('company');
    const solutionsData = await window.loadData('solutions');
    
    const html = `
        <div class="home-page">
            <!-- Hero Section -->
            <section class="hero-section">
                <video class="hero-video" autoplay muted loop playsinline>
                    <source src="./assets/video/video.mp4" type="video/mp4">
                </video>
                <div class="hero-overlay"></div>
                <div class="container">
                    <div class="hero-content">
                        <h1 class="hero-title">
                            원스톱 맞춤 설계<br>
                            <span class="highlight">시뮬레이터 & 멀티미디어 솔루션</span>
                        </h1>
                        <p class="hero-subtitle">
                            ${companyData?.mission || 'One-Stop 맞춤 주문형 시뮬레이터 제작 서비스와 One-Click 콘텐츠 관리 시스템을 제공합니다'}
                        </p>
                        <div class="hero-actions">
                            <button class="btn btn-secondary btn-large" onclick="window.location.hash='#/contact'">
                                상담 신청
                            </button>
                            <button class="btn btn-outline btn-large" onclick="window.location.hash='#/solutions'">
                                솔루션 보기
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Core Values Section -->
            <section class="section core-values-section">
                <div class="container">
                    <h2 class="section-title">핵심 가치</h2>
                    <div class="grid grid-2">
                        ${companyData?.coreValues?.map(value => `
                            <div class="card value-card">
                                <div class="value-icon">${getIconSVG(value.icon)}</div>
                                <h3 class="card-title">${value.title}</h3>
                                <p class="card-description">${value.description}</p>
                            </div>
                        `).join('') || ''}
                    </div>
                </div>
            </section>

            <!-- Solutions Accordion Section -->
            <section class="section solutions-section">
                <div class="container">
                    <h2 class="section-title">솔루션</h2>
                    <p class="section-subtitle">6가지 핵심 기술로 최적의 솔루션을 제공합니다</p>
                    <div class="accordion-container">
                        ${solutionsData?.solutions?.map((solution, index) => `
                            <div class="accordion-item ${index === 0 ? 'active' : ''}" data-solution="${solution.id}">
                                <button class="accordion-header" onclick="toggleAccordion(this)">
                                    <span class="accordion-title">
                                        <span class="accordion-icon">${getIconSVG(solution.icon)}</span>
                                        ${solution.title}
                                    </span>
                                    <span class="accordion-arrow">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                </button>
                                <div class="accordion-content">
                                    <div class="accordion-body">
                                        <p class="solution-subtitle">${solution.subtitle}</p>
                                        <p class="solution-description">${solution.description}</p>
                                        <div class="solution-details">
                                            <div class="solution-column">
                                                <h4>주요 특징</h4>
                                                <ul>
                                                    ${solution.features?.map(feature => `<li>${feature}</li>`).join('') || ''}
                                                </ul>
                                            </div>
                                            <div class="solution-column">
                                                <h4>활용 분야</h4>
                                                <ul>
                                                    ${solution.applications?.map(app => `<li>${app}</li>`).join('') || ''}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('') || ''}
                    </div>
                    <div class="section-cta">
                        <button class="btn btn-primary" onclick="window.location.hash='#/solutions'">
                            모든 솔루션 보기
                        </button>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="section cta-section">
                <div class="container">
                    <div class="cta-box">
                        <h2>프로젝트를 시작할 준비가 되셨나요?</h2>
                        <p>전문가와 상담하여 최적의 솔루션을 찾아보세요</p>
                        <div class="cta-actions">
                            <button class="btn btn-secondary btn-large" onclick="window.location.hash='#/contact'">
                                문의하기
                            </button>
                            <button class="btn btn-outline btn-large" onclick="window.location.hash='#/cases'">
                                사례 보기
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
    
    render(html);
    
    // Add accordion toggle function to window
    window.toggleAccordion = function(button) {
        const item = button.closest('.accordion-item');
        const isActive = item.classList.contains('active');
        
        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(el => {
            el.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    };
}

function getIconSVG(iconName) {
    return getIcon(iconName, 48);
}
