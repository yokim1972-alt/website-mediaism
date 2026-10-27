// ============================================
// MEDIA-ISM - Main JavaScript
// SPA Router & State Management
// ============================================

// App State
window.AppState = {
    currentPage: 'home',
    data: {
        company: null,
        solutions: null,
        cases: null,
        contact: null
    }
};

// State Management
function setState(updates) {
    Object.assign(window.AppState, updates);
}

// Router
class Router {
    constructor() {
        this.routes = {};
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.route());
        // 페이지가 이미 다 열린 뒤에 불러와진 경우(버전 로더)에는 load 이벤트가 다시 오지 않으므로
        // 라우트 등록이 끝난 뒤 start()에서 직접 첫 화면을 그린다.
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => this.route());
        }
    }

    start() {
        if (document.readyState === 'complete') {
            this.route();
        }
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    route() {
        const hash = window.location.hash.slice(1) || '/';
        const [path, ...params] = hash.split('/').filter(Boolean);
        const fullPath = path ? `/${path}` : '/';
        
        // Update active nav link
        this.updateActiveNav(fullPath);
        
        // 페이지 이동 시 팝업이 걸어 둔 스크롤 잠금 해제 (팝업을 닫지 않고 이동해도 스크롤되게)
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Find and execute handler
        const handler = this.routes[fullPath] || this.routes['/'];
        if (handler) {
            handler(params);
        }
    }

    updateActiveNav(path) {
        const full = '/' + (window.location.hash.slice(1) || '/').split('/').filter(Boolean).join('/');
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href').slice(1);
            // 정확히 같은 주소가 활성. 작업 사례(#/cases)는 분류 없이 볼 때와 사례 상세일 때 활성
            let active = href === full;
            if (href === '/cases' && (full.startsWith('/case/') || (full.startsWith('/cases') && full !== '/cases/ai-content'))) active = true;
            if (href === '/cases/ai-content' && full === '/cases/ai-content') active = true;
            link.classList.toggle('active', active);
        });
    }
}

// Initialize Router
const router = new Router();

// Import Pages
import { renderHomePage } from './pages/home.js?v=202610270456';
import { renderAboutPage } from './pages/about.js?v=202610270456';
import { renderSolutionsPage } from './pages/solutions.js?v=202610270456';
import { renderCasesPage } from './pages/cases.js?v=202610270456';
import { renderCaseDetailPage } from './pages/case-detail.js?v=202610270456';

// Register Routes
router.register('/', renderHomePage);
router.register('/about', renderAboutPage);
router.register('/solutions', renderSolutionsPage);
router.register('/cases', renderCasesPage);
router.register('/case', renderCaseDetailPage);


// Data Loading
async function loadData(type) {
    if (window.AppState.data[type]) {
        return window.AppState.data[type];
    }
    
    try {
        const v = new URL(import.meta.url).searchParams.get('v') || '0';
        const response = await fetch(`./data/${type}.json?v=${v}`);
        const data = await response.json();
        window.AppState.data[type] = data;
        return data;
    } catch (error) {
        console.error(`Failed to load ${type} data:`, error);
        return null;
    }
}

// Export utilities
window.loadData = loadData;

// Mobile Menu Toggle — 햄버거 버튼을 누르면 메뉴가 헤더 아래로 펼쳐짐
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

function setMenu(open) {
    nav.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    mobileMenuToggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenuToggle?.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
}

mobileMenuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!nav.classList.contains('active'));
});

// 메뉴 항목을 누르거나, 메뉴 바깥을 누르면 닫힘
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
});
document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && !nav.contains(e.target)) setMenu(false);
});
window.addEventListener('hashchange', () => setMenu(false));

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Always visible
scrollTopBtn.classList.add('visible');

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Utility: Render to App Container
export function render(html) {
    const app = document.getElementById('app');
    app.innerHTML = html;
    app.classList.add('fade-in');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        app.classList.remove('fade-in');
    }, 600);
}

// Utility: Format Date
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Utility: Truncate Text
export function truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

// 첫 화면 그리기 — 모듈 안의 함수(loadData 등)가 모두 준비된 뒤에 실행
router.start();
