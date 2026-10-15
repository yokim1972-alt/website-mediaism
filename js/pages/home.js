// Home Page
import { render } from '../main.js?v=202610151026';
import { getIcon } from '../icons.js?v=202610151026';

export async function renderHomePage() {
    const companyData = await window.loadData('company');
    const solutionsData = await window.loadData('solutions');
    
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
                            원스톱 맞춤 설계<br>
                            <span class="highlight">시뮬레이터 & 멀티미디어 솔루션</span>
                        </h1>
                        <p class="hero-subtitle">
                            ${companyData?.mission || 'One-Stop 맞춤 주문형 시뮬레이터 제작 서비스와 One-Click 콘텐츠 관리 시스템을 제공합니다'}
                        </p>
                        <div class="hero-actions">
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
