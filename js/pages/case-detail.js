// Case Detail Page — 작업 사례 상세
import { render } from '../main.js?v=202610280521';
import { getIcon } from '../icons.js?v=202610280521';

const REF_PASSWORD = 'media123'; // 현장 자료 열람 비밀번호 (보안용이 아니라 문만 닫아 둔 것)

export async function renderCaseDetailPage(params) {
    const caseId = params[0];
    const casesData = await window.loadData('cases');
    const caseItem = casesData?.cases?.find(c => c.id === caseId);
    const catName = {};
    (casesData?.categories || []).forEach(c => catName[c.id] = c.name);

    if (!caseItem) {
        render(`
            <div class="container">
                <div class="error-message">
                    <h2>사례를 찾을 수 없습니다</h2>
                    <button class="btn btn-primary" onclick="window.location.hash='#/cases'">
                        작업 사례로 돌아가기
                    </button>
                </div>
            </div>
        `);
        return;
    }

    const isReal = v => {
        if (v === undefined || v === null) return false;
        const t = String(v).trim();
        if (!t || t === '-' || t === '1234' || t === '위치' || t === '설명' || t === '클라이언트') return false;
        if (/^x\s*개월$/i.test(t) || /^feature\s*\d+$/i.test(t) || /^tag\s*\d+$/i.test(t)) return false;
        return true;
    };
    const d = caseItem.details || {};
    const detailItems = [['기간', d.duration], ['맡은 일', d.scope], ['장비·기술', d.technology]].filter(([, v]) => isReal(v));
    const features = (d.features || []).filter(isReal);
    const tags = (caseItem.tags || []).filter(isReal);
    const images = caseItem.images || [];

    // 같은 분류의 다른 사례 (아래 '같이 보기')
    const related = (casesData.cases || []).filter(c => c.category === caseItem.category && c.id !== caseItem.id && c.thumbnail).slice(0, 3);

    const html = `
        <div class="case-detail-page">
            <div class="container">
                <!-- Breadcrumb -->
                <nav class="breadcrumb">
                    <a href="#/cases">작업 사례</a>
                    <span>/</span>
                    <a href="#/cases/${caseItem.category}">${catName[caseItem.category] || ''}</a>
                    <span>/</span>
                    <span>${caseItem.title}</span>
                </nav>

                <!-- Case Header -->
                <div class="case-detail-header">
                    <div class="case-detail-meta">
                        <span class="case-category-badge">${catName[caseItem.category] || ''}${caseItem.sub ? ' · ' + caseItem.sub : ''}</span>
                        ${isReal(caseItem.year) ? `<span class="case-year-badge">${caseItem.period || caseItem.year}</span>` : ''}
                    </div>
                    <h1 class="case-detail-title">${caseItem.title}</h1>
                    ${isReal(caseItem.client) ? `<p class="case-detail-client">발주처: ${caseItem.client}</p>` : ''}
                    ${isReal(caseItem.location) ? `
                    <p class="case-detail-location">
                        <span class="location-icon">${getIcon('location', 20)}</span>
                        ${caseItem.location}
                    </p>` : ''}
                </div>

                ${caseItem.video ? `
                <!-- 맛보기 영상 (앞 1분, 가로 1000) -->
                <div class="case-video">
                    <video class="ai-video" controls preload="metadata" playsinline controlsList="nodownload noplaybackrate" disablePictureInPicture
                           poster="${caseItem.video.poster}" oncontextmenu="return false">
                        <source src="${caseItem.video.src}" type="video/mp4">
                    </video>
                    <p class="case-video-label">${caseItem.video.label || '앞 1분'}</p>
                </div>` : ''}

                <!-- Case Gallery -->
                <div class="case-gallery">
                    ${images.length > 0 ? `
                        <div class="gallery-main" id="galleryMain">
                            <img src="${images[0]}" alt="${caseItem.title}" />
                        </div>
                        ${images.length > 1 ? `
                            <div class="gallery-thumbnails">
                                ${images.map((img, index) => `
                                    <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-image="${img}" data-index="${index}">
                                        <img src="${img}" alt="${caseItem.title} ${index + 1}" loading="lazy" />
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    ` : `
                        <div class="gallery-main gallery-empty">
                            <div class="gallery-placeholder">
                                ${getIcon(categoryIcon(caseItem.category), 80)}
                                <p>사진 준비 중</p>
                            </div>
                        </div>
                    `}
                </div>

                <!-- Case Description -->
                <div class="case-detail-content">
                    ${isReal(caseItem.description) ? `
                    <section class="detail-section">
                        <h2>어떤 작업인가</h2>
                        <p>${caseItem.description}</p>
                    </section>` : ''}

                    ${detailItems.length > 0 ? `
                    <section class="detail-section">
                        <h2>작업 내용</h2>
                        <div class="detail-grid">
                            ${detailItems.map(([label, v]) => `
                            <div class="detail-item card">
                                <h4>${label}</h4>
                                <p>${v}</p>
                            </div>`).join('')}
                        </div>
                    </section>` : ''}

                    ${features.length > 0 ? `
                        <section class="detail-section">
                            <h2>주요 내용</h2>
                            <ul class="features-list">
                                ${features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </section>
                    ` : ''}

                    ${tags.length > 0 ? `
                        <section class="detail-section">
                            <div class="case-detail-tags">
                                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </section>
                    ` : ''}

                    <!-- 현장 자료 (비밀번호) -->
                    <section class="detail-section ref-section">
                        <div class="ref-head">
                            <div>
                                <h2>현장 자료</h2>
                                <p class="ref-note">현장에서 찍은 사진과 영상입니다. 비밀번호를 넣으면 볼 수 있습니다.</p>
                            </div>
                            <button id="adminBtn" class="btn btn-small btn-outline">현장 자료 보기</button>
                        </div>

                        <div id="adminModal" class="admin-modal" style="display: none;">
                            <div class="admin-modal-content">
                                <span class="admin-modal-close">&times;</span>
                                <h3>현장 자료 보기</h3>
                                <input type="password" id="adminPassword" class="admin-password-input" placeholder="비밀번호" autocomplete="off" />
                                <button id="adminSubmit" class="btn btn-primary">확인</button>
                                <p id="adminError" class="admin-error" style="display: none; color: #ff5252; margin-top: 10px;">비밀번호가 맞지 않습니다.</p>
                            </div>
                        </div>

                        <div id="refSection" class="ref-body" style="display: none;"></div>
                    </section>

                    ${related.length > 0 ? `
                    <section class="detail-section">
                        <h2>같이 보기</h2>
                        <div class="related-grid">
                            ${related.map(c => `
                                <a class="related-card" href="#/case/${c.id}">
                                    <img src="${c.thumbnail}" alt="${c.title}" loading="lazy" />
                                    <span>${c.title}</span>
                                </a>
                            `).join('')}
                        </div>
                    </section>` : ''}

                    <!-- Navigation -->
                    <div class="case-navigation">
                        <button class="btn btn-outline" onclick="window.location.hash='#/cases/${caseItem.category}'">
                            ← ${catName[caseItem.category] || '목록'} 사례 보기
                        </button>
                        <button class="btn btn-outline" onclick="window.location.hash='#/cases'">
                            전체 목록
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lightbox -->
        <div id="imageLightbox" class="lightbox" style="display: none;">
            <span class="lightbox-close" aria-label="닫기">&times;</span>
            <button class="lightbox-nav lightbox-prev" aria-label="이전">&#8249;</button>
            <div class="lightbox-stage">
                <img class="lightbox-content" id="lightboxImg" style="display:none" />
                <video class="lightbox-video" id="lightboxVideo" controls playsinline style="display:none"></video>
            </div>
            <button class="lightbox-nav lightbox-next" aria-label="다음">&#8250;</button>
            <p class="lightbox-caption" id="lightboxCaption"></p>
        </div>
    `;

    render(html);

    // ---------- Lightbox (사진·영상 공용) ----------
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxCaption = document.getElementById('lightboxCaption');
    let lbItems = [];   // [{type:'image'|'video', src, caption}]
    let lbIndex = 0;

    function showLightbox(items, index) {
        lbItems = items; lbIndex = index;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateLightbox();
    }
    function updateLightbox() {
        const it = lbItems[lbIndex];
        if (!it) return;
        lightboxVideo.pause();
        if (it.type === 'video') {
            lightboxImg.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = it.src;
            lightboxVideo.play().catch(() => {});
        } else {
            lightboxVideo.style.display = 'none';
            lightboxVideo.removeAttribute('src');
            lightboxImg.style.display = 'block';
            lightboxImg.src = it.src;
        }
        lightboxCaption.textContent = (it.caption || '') + (lbItems.length > 1 ? `  (${lbIndex + 1}/${lbItems.length})` : '');
        lightbox.querySelector('.lightbox-prev').style.visibility = lbItems.length > 1 ? 'visible' : 'hidden';
        lightbox.querySelector('.lightbox-next').style.visibility = lbItems.length > 1 ? 'visible' : 'hidden';
    }
    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
        document.body.style.overflow = '';
    }
    function stepLightbox(n) {
        if (lbItems.length < 2) return;
        lbIndex = (lbIndex + n + lbItems.length) % lbItems.length;
        updateLightbox();
    }
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(-1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(1); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'none') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') stepLightbox(-1);
        if (e.key === 'ArrowRight') stepLightbox(1);
    });
    // 손가락으로 좌우 넘기기
    let touchX = null;
    lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX; touchX = null;
        if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
    });

    // 대표 사진: 큰 사진 클릭 → 라이트박스, 작은 사진 클릭 → 큰 사진 바꿈
    const galleryMain = document.getElementById('galleryMain');
    if (galleryMain) {
        const mainImg = galleryMain.querySelector('img');
        let current = 0;
        mainImg.style.cursor = 'zoom-in';
        mainImg.addEventListener('click', () => showLightbox(images.map(src => ({ type: 'image', src, caption: caseItem.title })), current));
        document.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                current = Number(thumb.dataset.index);
                mainImg.src = thumb.dataset.image;
                document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }

    // ---------- 현장 자료 (비밀번호) ----------
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const adminModalClose = document.querySelector('.admin-modal-close');
    const adminSubmit = document.getElementById('adminSubmit');
    const adminPassword = document.getElementById('adminPassword');
    const adminError = document.getElementById('adminError');
    const refSection = document.getElementById('refSection');
    let refLoaded = false;

    adminBtn.addEventListener('click', () => {
        if (refSection.style.display === 'block') { refSection.scrollIntoView({ behavior: 'smooth' }); return; }
        if (sessionStorage.getItem('refOk') === '1') { openRef(); return; }
        adminModal.style.display = 'flex';
        adminPassword.value = '';
        adminError.style.display = 'none';
        setTimeout(() => adminPassword.focus(), 50);
    });
    adminModalClose.addEventListener('click', () => adminModal.style.display = 'none');
    adminModal.addEventListener('click', (e) => { if (e.target === adminModal) adminModal.style.display = 'none'; });
    adminSubmit.addEventListener('click', () => {
        if (adminPassword.value === REF_PASSWORD) {
            try { sessionStorage.setItem('refOk', '1'); } catch (e) {}
            adminModal.style.display = 'none';
            openRef();
        } else {
            adminError.style.display = 'block';
        }
    });
    adminPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') adminSubmit.click(); });

    async function openRef() {
        refSection.style.display = 'block';
        adminBtn.textContent = '현장 자료 ✓';
        adminBtn.style.color = 'var(--color-primary)';
        if (refLoaded) return;
        refLoaded = true;
        refSection.innerHTML = '<p class="ref-loading">자료를 불러오는 중…</p>';
        let ref = null;
        try {
            const v = (new URL(import.meta.url)).searchParams.get('v') || '0';
            const r = await fetch(`./data/reference/${caseItem.id}.json?v=${v}`);
            if (r.ok) ref = await r.json();
        } catch (e) { ref = null; }

        if (!ref || ((ref.photos || []).length === 0 && (ref.videos || []).length === 0)) {
            refSection.innerHTML = '<p class="ref-empty">이 사례의 현장 자료가 아직 올라오지 않았습니다.</p>';
            return;
        }

        const photos = ref.photos || [];
        const videos = ref.videos || [];
        const photoItems = photos.map(p => ({ type: 'image', src: p.src, caption: (p.group ? p.group + ' · ' : '') + (p.date || '') }));
        const videoItems = videos.map(v => ({ type: 'video', src: v.src, caption: (v.name || '') + (v.date ? ' · ' + v.date : '') }));

        // 사진을 묶음(폴더·연월)별로 나눔
        const groups = [];
        photos.forEach((p, i) => {
            const g = p.group || '사진';
            let grp = groups.find(x => x.name === g);
            if (!grp) { grp = { name: g, idx: [] }; groups.push(grp); }
            grp.idx.push(i);
        });

        refSection.innerHTML = `
            <p class="ref-summary">사진 ${photos.length}장${videos.length ? ` · 영상 ${videos.length}개` : ''}${ref.folder ? ` · 원본 폴더: ${ref.folder}` : ''}</p>
            ${videos.length ? `
                <h3 class="ref-group-title">영상</h3>
                <div class="ref-video-grid">
                    ${videos.map((v, i) => `
                        <div class="ref-video" data-i="${i}">
                            <div class="ref-video-thumb">
                                <img src="${v.thumb}" alt="${v.name || ''}" loading="lazy" />
                                <span class="ref-play">▶</span>
                                ${v.duration ? `<span class="ref-dur">${fmtDur(v.duration)}</span>` : ''}
                            </div>
                            <div class="ref-video-name">${v.name || ''}${v.date ? ` <small>${v.date}</small>` : ''}</div>
                        </div>
                    `).join('')}
                </div>` : ''}
            ${groups.map(g => `
                <h3 class="ref-group-title">${g.name} <small>${g.idx.length}장</small></h3>
                <div class="ref-photo-grid">
                    ${g.idx.map(i => `
                        <div class="ref-photo" data-i="${i}">
                            <img src="${photos[i].thumb}" alt="${photos[i].date || ''}" loading="lazy" />
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        `;
        refSection.querySelectorAll('.ref-photo').forEach(el => el.addEventListener('click', () => showLightbox(photoItems, Number(el.dataset.i))));
        refSection.querySelectorAll('.ref-video').forEach(el => el.addEventListener('click', () => showLightbox(videoItems, Number(el.dataset.i))));
    }
}

function fmtDur(sec) {
    sec = Math.round(sec);
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

function categoryIcon(category) {
    const map = { 'ai-content': 'ai', 'simulator': 'motion-simulator', 'theater': 'theater', 'interactive': 'interactive', 'control': 'motion-controller' };
    const cat = Array.isArray(category) ? category[0] : category;
    return map[cat] || 'design';
}
