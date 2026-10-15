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
        window.addEventListener('load', () => this.route());
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
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Find and execute handler
        const handler = this.routes[fullPath] || this.routes['/'];
        if (handler) {
            handler(params);
        }
    }

    updateActiveNav(path) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href').slice(1);
            link.classList.toggle('active', href === path);
        });
    }
}

// Initialize Router
const router = new Router();

// Import Pages
import { renderHomePage } from './pages/home.js';
import { renderAboutPage } from './pages/about.js';
import { renderSolutionsPage } from './pages/solutions.js';
import { renderCasesPage } from './pages/cases.js';
import { renderCaseDetailPage } from './pages/case-detail.js';
import { renderContactPage } from './pages/contact.js';
import { renderPrivacyPage } from './pages/privacy.js';

// Register Routes
router.register('/', renderHomePage);
router.register('/about', renderAboutPage);
router.register('/solutions', renderSolutionsPage);
router.register('/cases', renderCasesPage);
router.register('/case', renderCaseDetailPage);
router.register('/contact', renderContactPage);
router.register('/privacy', renderPrivacyPage);

// Data Loading
async function loadData(type) {
    if (window.AppState.data[type]) {
        return window.AppState.data[type];
    }
    
    try {
        const response = await fetch(`./data/${type}.json`);
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

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

mobileMenuToggle?.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

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
