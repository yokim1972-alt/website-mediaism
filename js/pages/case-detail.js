// Case Detail Page
import { render } from '../main.js';
import { getIcon } from '../icons.js';

export async function renderCaseDetailPage(params) {
    const caseId = params[0];
    const casesData = await window.loadData('cases');
    const caseItem = casesData?.cases?.find(c => c.id === caseId);
    
    if (!caseItem) {
        render(`
            <div class="container">
                <div class="error-message">
                    <h2>사례를 찾을 수 없습니다</h2>
                    <button class="btn btn-primary" onclick="window.location.hash='#/cases'">
                        사례 목록으로 돌아가기
                    </button>
                </div>
            </div>
        `);
        return;
    }
    
    const html = `
        <div class="case-detail-page">
            <div class="container">
                <!-- Breadcrumb -->
                <nav class="breadcrumb">
                    <a href="#/cases">사례</a>
                    <span>/</span>
                    <span>${caseItem.title}</span>
                </nav>

                <!-- Case Header -->
                <div class="case-detail-header">
                    <div class="case-detail-meta">
                        <span class="case-category-badge">${getCategoryName(caseItem.category)}</span>
                        <span class="case-year-badge">${caseItem.year}</span>
                    </div>
                    <h1 class="case-detail-title">${caseItem.title}</h1>
                    <p class="case-detail-client">클라이언트: ${caseItem.client}</p>
                    <p class="case-detail-location">
                        <span class="location-icon">${getIcon('location', 20)}</span>
                        ${caseItem.location}
                    </p>
                </div>

                <!-- Case Gallery -->
                <div class="case-gallery">
                    ${caseItem.images?.length > 0 ? `
                        <div class="gallery-main" id="galleryMain">
                            <img src="${caseItem.images[0]}" alt="${caseItem.title}" />
                        </div>
                        ${caseItem.images.length > 1 ? `
                            <div class="gallery-thumbnails">
                                ${caseItem.images.map((img, index) => `
                                    <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-image="${img}" data-index="${index}">
                                        <img src="${img}" alt="${caseItem.title} ${index + 1}" />
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    ` : `
                        <div class="gallery-main" style="background: linear-gradient(135deg, #00bfa5, #1a1a1a);">
                            <div class="gallery-placeholder">
                                ${getCategoryIcon(caseItem.category)}
                                <p>이미지 준비 중</p>
                            </div>
                        </div>
                    `}
                </div>

                <!-- Case Description -->
                <div class="case-detail-content">
                    <section class="detail-section">
                        <h2>프로젝트 개요</h2>
                        <p>${caseItem.description}</p>
                    </section>

                    <!-- Project Details -->
                    <section class="detail-section">
                        <h2>프로젝트 상세</h2>
                        <div class="detail-grid">
                            <div class="detail-item card">
                                <h4>기간</h4>
                                <p>${caseItem.details?.duration || '-'}</p>
                            </div>
                            <div class="detail-item card">
                                <h4>범위</h4>
                                <p>${caseItem.details?.scope || '-'}</p>
                            </div>
                            <div class="detail-item card">
                                <h4>기술</h4>
                                <p>${caseItem.details?.technology || '-'}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Features -->
                    ${caseItem.details?.features ? `
                        <section class="detail-section">
                            <h2>주요 특징</h2>
                            <ul class="features-list">
                                ${caseItem.details.features.map(feature => `
                                    <li>${feature}</li>
                                `).join('')}
                            </ul>
                        </section>
                    ` : ''}

                    <!-- Tags -->
                    ${caseItem.tags ? `
                        <section class="detail-section">
                            <div class="case-detail-tags">
                                ${caseItem.tags.map(tag => `
                                    <span class="tag">${tag}</span>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    <!-- CTA -->
                    <section class="detail-section">
                        <div class="cta-box">
                            <h3>비슷한 프로젝트를 진행하고 싶으신가요?</h3>
                            <p>전문가와 상담하여 프로젝트를 시작해보세요</p>
                            <button class="btn btn-secondary btn-large" onclick="window.location.hash='#/contact'">
                                상담 신청
                            </button>
                        </div>
                    </section>

                    <!-- Navigation -->
                    <div class="case-navigation">
                        <button class="btn btn-outline" onclick="window.location.hash='#/cases'">
                            ← 목록으로 돌아가기
                        </button>
                    </div>

                    <!-- Admin Section -->
                    <section class="detail-section admin-section" style="border-top: 2px solid var(--color-border); padding-top: var(--spacing-xl); margin-top: var(--spacing-xl);">
                        <button id="adminBtn" class="btn btn-small btn-outline" style="float: right;">
                            관리자
                        </button>
                        <div style="clear: both;"></div>
                        
                        <!-- Admin Password Modal -->
                        <div id="adminModal" class="admin-modal" style="display: none;">
                            <div class="admin-modal-content">
                                <span class="admin-modal-close">&times;</span>
                                <h3>관리자 인증</h3>
                                <input type="password" id="adminPassword" class="admin-password-input" placeholder="비밀번호를 입력하세요" />
                                <button id="adminSubmit" class="btn btn-primary">확인</button>
                                <p id="adminError" class="admin-error" style="display: none; color: #ff5252; margin-top: 10px;">비밀번호가 올바르지 않습니다.</p>
                            </div>
                        </div>

                        <!-- Before/After Images Section (Hidden by default) -->
                        <div id="beforeAfterSection" class="before-after-section" style="display: none; margin-top: var(--spacing-xl);">
                            ${(caseItem.before?.length > 0 || caseItem.after?.length > 0) ? `
                                <h2>프로젝트 전후 비교</h2>
                                
                                ${caseItem.before?.length > 0 ? `
                                    <div class="before-section" style="margin-bottom: var(--spacing-xl);">
                                        <h3>Before (시공 전)</h3>
                                        <div class="gallery-grid">
                                            ${caseItem.before.map(img => `
                                                <div class="gallery-item">
                                                    <img src="${img}" alt="Before" class="admin-image" />
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                ${caseItem.after?.length > 0 ? `
                                    <div class="after-section">
                                        <h3>After (시공 후)</h3>
                                        <div class="gallery-grid">
                                            ${caseItem.after.map(img => `
                                                <div class="gallery-item">
                                                    <img src="${img}" alt="After" class="admin-image" />
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            ` : '<p style="color: var(--color-text-secondary);">시공 전후 이미지가 준비되지 않았습니다.</p>'}
                        </div>
                    </section>
                </div>
            </div>
        </div>
        
        <!-- Image Lightbox Modal -->
        <div id="imageLightbox" class="lightbox" style="display: none;">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="lightboxImg" />
        </div>
    `;
    
    render(html);
    
    // Admin button and password authentication
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const adminModalClose = document.querySelector('.admin-modal-close');
    const adminSubmit = document.getElementById('adminSubmit');
    const adminPassword = document.getElementById('adminPassword');
    const adminError = document.getElementById('adminError');
    const beforeAfterSection = document.getElementById('beforeAfterSection');
    
    // Open admin modal
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            adminModal.style.display = 'flex';
            adminPassword.value = '';
            adminError.style.display = 'none';
        });
    }
    
    // Close admin modal
    if (adminModalClose) {
        adminModalClose.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }
    
    // Close modal on background click
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                adminModal.style.display = 'none';
            }
        });
    }
    
    // Submit password
    if (adminSubmit) {
        adminSubmit.addEventListener('click', () => {
            const password = adminPassword.value;
            if (password === 'media123') {
                adminModal.style.display = 'none';
                beforeAfterSection.style.display = 'block';
                adminBtn.textContent = '관리자 ✓';
                adminBtn.style.color = 'var(--color-primary)';
            } else {
                adminError.style.display = 'block';
            }
        });
    }
    
    // Enter key to submit password
    if (adminPassword) {
        adminPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                adminSubmit.click();
            }
        });
    }
    
    // Before/After images lightbox
    setTimeout(() => {
        const adminImages = document.querySelectorAll('.admin-image');
        adminImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
            });
        });
    }, 100);
    
    // Image lightbox handler
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Main image click to open lightbox
    const galleryMain = document.getElementById('galleryMain');
    if (galleryMain) {
        const mainImg = galleryMain.querySelector('img');
        if (mainImg) {
            mainImg.style.cursor = 'pointer';
            mainImg.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = mainImg.src;
            });
        }
    }
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }
    
    // Close lightbox on background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
    
    // Gallery thumbnail click handler
    if (caseItem.images?.length > 1) {
        const galleryMain = document.getElementById('galleryMain');
        const thumbnails = document.querySelectorAll('.gallery-thumb');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const imageSrc = thumb.getAttribute('data-image');
                const mainImg = galleryMain.querySelector('img');
                
                // Update main image
                mainImg.src = imageSrc;
                
                // Update active state
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }
}

function getCategoryIcon(category) {
    const cat = Array.isArray(category) ? category[0] : category;
    return getIcon(cat, 80);
}

function getCategoryName(category) {
    const names = {
        '3d': '3D',
        '4d': '4D',
        'vr-simulator': 'VR Simulator',
        'interactive': 'Interactive',
        'motion-simulator': 'Motion Simulator',
        'motion-controller': 'Motion Controller'
    };
    
    if (Array.isArray(category)) {
        return category.map(cat => names[cat] || cat).join(', ');
    }
    
    return names[category] || category;
}
