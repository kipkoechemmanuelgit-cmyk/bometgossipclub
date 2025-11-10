// js/app.js - Core application functionality

// Global state
const AppState = {
    currentPage: 'home',
    isLoading: false
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bomet County Hub - Initializing...');
    
    // Initialize service worker for offline functionality
    initializeServiceWorker();
    
    // Set up navigation
    setupNavigation();
    
    // Set up current year in footer
    setCurrentYear();
    
    // Add loading states
    setupLoadingStates();
    
    // Setup contact tracking
    setupContactTracking();
    
    console.log('Bomet County Hub - Ready!');
});

// Initialize Service Worker
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/js/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered: ', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    }
}

// Set up navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Update active state
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update app state
            AppState.currentPage = this.getAttribute('href').replace('.html', '').replace('/', '') || 'home';
        });
    });
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
}

// Setup loading states
function setupLoadingStates() {
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class when everything is ready
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 500);
    });
}

// Contact interaction tracking
function setupContactTracking() {
    // Track contact method clicks
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const contactType = this.textContent.toLowerCase();
            // Simple tracking - can be enhanced later
            console.log('Contact method clicked:', contactType);
        });
    });
}

// Utility function to format dates
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-KE', options);
}

// Utility function to debounce rapid function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Simple notification function (fixed version)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = 
        '<div class="notification-content">' +
        '<span class="notification-message">' + message + '</span>' +
        '<button class="notification-close">&times;</button>' +
        '</div>';
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = 
            '.notification {' +
            'position: fixed;' +
            'top: 20px;' +
            'right: 20px;' +
            'background: white;' +
            'padding: 1rem;' +
            'border-radius: 8px;' +
            'box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
            'z-index: 1000;' +
            'animation: slideInRight 0.3s ease;' +
            'max-width: 400px;' +
            'border-left: 4px solid #2c5530;' +
            '}' +
            '.notification-error { border-left-color: #e74c3c; }' +
            '.notification-success { border-left-color: #27ae60; }' +
            '.notification-warning { border-left-color: #f39c12; }' +
            '.notification-content {' +
            'display: flex;' +
            'align-items: center;' +
            'justify-content: space-between;' +
            'gap: 1rem;' +
            '}' +
            '.notification-close {' +
            'background: none;' +
            'border: none;' +
            'font-size: 1.2rem;' +
            'cursor: pointer;' +
            'color: #7f8c8d;' +
            '}' +
            '@keyframes slideInRight {' +
            'from { transform: translateX(100%); opacity: 0; }' +
            'to { transform: translateX(0); opacity: 1; }' +
            '}';
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Handle errors gracefully
function handleError(error, context) {
    console.error('Error in ' + context + ':', error);
    showNotification('Something went wrong. Please try again.', 'error');
}

// Simple event tracking
function trackEvent(category, action, label) {
    console.log('Event tracked:', category, action, label);
    // Can be enhanced with Google Analytics later
}

// Track page views
function trackPageView(pageName) {
    console.log('Page view:', pageName);
    // Can be enhanced with Google Analytics later
}