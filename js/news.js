// js/news.js - News loading and display functionality

class NewsManager {
    constructor() {
        this.newsData = [];
        this.filteredNews = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadNewsData();
        this.setupEventListeners();
        
        // Load appropriate news based on current page
        if (document.getElementById('news-container')) {
            this.displayLatestNews();
        }
        if (document.getElementById('all-news-container')) {
            this.displayAllNews();
        }
        if (document.getElementById('important-news-container')) {
            this.displayImportantNews();
        }
    }

    // Load news data from JSON file
    async loadNewsData() {
        try {
            // For local file testing, we'll use a different approach
            if (window.location.protocol === 'file:') {
                // If running locally, use embedded data or mock data
                this.newsData = this.getMockNewsData();
                this.filteredNews = [...this.newsData];
            } else {
                // For deployed version, fetch from server
                const response = await fetch('./data/news.json');
                if (!response.ok) {
                    throw new Error('Failed to load news data');
                }
                const data = await response.json();
                this.newsData = data.news;
                this.filteredNews = [...this.newsData];
            }
            
            console.log('Loaded ' + this.newsData.length + ' news articles');
        } catch (error) {
            console.error('Error loading news:', error);
            // Fallback to mock data
            this.newsData = this.getMockNewsData();
            this.filteredNews = [...this.newsData];
            this.showErrorMessage('Using sample data. Real data will load when deployed.');
        }
    }

    // Mock data for local testing
    getMockNewsData() {
        return [
            {
                id: 1,
                title: "Bomet County Launches New Dairy Farmers Support Program",
                summary: "County government announces subsidy program for dairy farmers to boost milk production",
                content: "The Bomet County Government has launched a comprehensive dairy farmers support program...",
                date: "2024-01-15",
                category: "agriculture",
                source: "County Agriculture Department",
                image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop",
                important: true
            },
            {
                id: 2,
                title: "New Health Center Opens in Sotik Sub-County",
                summary: "Modern health facility to serve over 5,000 residents",
                content: "A new health center has been officially opened in Sotik Sub-County...",
                date: "2024-01-14",
                category: "health",
                source: "Department of Health",
                image_url: "https://images.unsplash.com/photo-1516549655669-dfbf4e8e11d9?w=400&h=250&fit=crop",
                important: false
            },
            {
                id: 3,
                title: "Market Prices for Maize and Beans This Week",
                summary: "Current market rates show stable prices for agricultural produce",
                content: "Market prices for agricultural produce remain stable this week...",
                date: "2024-01-13",
                category: "market",
                source: "Bomet Farmers Association",
                image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
                important: false
            }
        ];
    }

    // Display latest news on homepage
    displayLatestNews() {
        const container = document.getElementById('news-container');
        if (!container) return;

        if (this.newsData.length === 0) {
            container.innerHTML = '<div class="loading">Loading latest news...</div>';
            return;
        }

        // Get 3 latest news items
        const latestNews = this.newsData
            .sort(function(a, b) { 
                return new Date(b.date) - new Date(a.date); 
            })
            .slice(0, 3);

        container.innerHTML = latestNews.map(function(news) {
            return this.createNewsCard(news);
        }.bind(this)).join('');
        
        // Add click events to news cards
        this.attachNewsClickEvents();
    }

    // Display all news on news page
    displayAllNews() {
        const container = document.getElementById('all-news-container');
        if (!container) return;

        if (this.filteredNews.length === 0) {
            container.innerHTML = '<div class="no-news">No news articles found for the selected filter.</div>';
            return;
        }

        const sortedNews = this.filteredNews.sort(function(a, b) { 
            return new Date(b.date) - new Date(a.date); 
        });
        
        container.innerHTML = sortedNews.map(function(news) {
            return this.createNewsCard(news, true);
        }.bind(this)).join('');
        
        // Add click events to news cards
        this.attachNewsClickEvents();
    }

    // Display important news
    displayImportantNews() {
        const container = document.getElementById('important-news-container');
        if (!container) return;

        const importantNews = this.newsData.filter(function(news) { 
            return news.important; 
        });
        
        if (importantNews.length === 0) {
            container.innerHTML = '<div class="no-news">No important announcements at this time.</div>';
            return;
        }

        container.innerHTML = importantNews.map(function(news) {
            return '<div class="important-alert" data-article-id="' + news.id + '">' +
                '<div class="alert-icon">⚠</div>' +
                '<div class="alert-content">' +
                '<h4>' + news.title + '</h4>' +
                '<p>' + news.summary + '</p>' +
                '<small>' + this.formatDate(news.date) + ' • ' + news.source + '</small>' +
                '</div>' +
                '</div>';
        }.bind(this)).join('');

        // Add click events to important alerts
        var alerts = document.querySelectorAll('.important-alert');
        for (var i = 0; i < alerts.length; i++) {
            alerts[i].style.cursor = 'pointer';
            alerts[i].addEventListener('click', (function(alert) {
                return function() {
                    var articleId = alert.getAttribute('data-article-id');
                    this.openArticle(articleId);
                };
            }(alerts[i])).bind(this));
        }
    }

    // Create news card HTML
    createNewsCard(news, expanded) {
        if (expanded === void 0) { expanded = false; }
        var cardClass = news.important ? 'news-card important' : 'news-card';
        var imageUrl = news.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400d167?w=400&h=250&fit=crop';
        
        return '<article class="' + cardClass + '" data-article-id="' + news.id + '">' +
            '<img src="' + imageUrl + '" alt="' + news.title + '" class="news-image" loading="lazy">' +
            '<div class="news-content">' +
            '<div class="news-meta">' +
            '<span class="news-date">' + this.formatDate(news.date) + '</span>' +
            '<span class="news-category ' + news.category + '">' + this.getCategoryName(news.category) + '</span>' +
            '</div>' +
            '<h3>' + news.title + '</h3>' +
            '<p class="news-summary">' + news.summary + '</p>' +
            '<div class="news-footer">' +
            '<span class="news-source">Source: ' + news.source + '</span>' +
            '<button class="read-more-btn" data-article-id="' + news.id + '">Read Full Article</button>' +
            '</div>' +
            '</div>' +
            '</article>';
    }

    // Attach click events to news cards
    attachNewsClickEvents() {
        var cards = document.querySelectorAll('.news-card');
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.cursor = 'pointer';
            cards[i].addEventListener('click', (function(card) {
                return function(e) {
                    if (!e.target.classList.contains('read-more-btn')) {
                        var articleId = card.getAttribute('data-article-id');
                        this.openArticle(articleId);
                    }
                };
            }(cards[i])).bind(this));
        }

        var buttons = document.querySelectorAll('.read-more-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', (function(btn) {
                return function(e) {
                    e.stopPropagation();
                    var articleId = btn.getAttribute('data-article-id');
                    this.openArticle(articleId);
                };
            }(buttons[i])).bind(this));
        }
    }

    // Open article in new page
    openArticle(articleId) {
        // Store the article ID in sessionStorage
        sessionStorage.setItem('currentArticleId', articleId);
        // Navigate to article page
        window.location.href = 'article.html';
    }

    // Get category display name
    getCategoryName(categoryId) {
        var categories = {
            'agriculture': '🌱 Agriculture',
            'health': '🏥 Health',
            'education': '📚 Education',
            'infrastructure': '🏗 Infrastructure',
            'market': '💰 Market',
            'weather': '🌦 Weather'
        };
        return categories[categoryId] || categoryId;
    }

    // Format date
    formatDate(dateString) {
        var options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    }

    // Filter news by category
    filterNews(category) {
        this.currentFilter = category;
        
        if (category === 'all') {
            this.filteredNews = [...this.newsData];
        } else {
            this.filteredNews = this.newsData.filter(function(news) {
                return news.category === category;
            });
        }
        
        this.displayAllNews();
        this.updateActiveFilterButton(category);
    }

    // Update active filter button
    updateActiveFilterButton(activeCategory) {
        var filterButtons = document.querySelectorAll('.filter-btn');
        for (var i = 0; i < filterButtons.length; i++) {
            if (filterButtons[i].dataset.filter === activeCategory) {
                filterButtons[i].classList.add('active');
            } else {
                filterButtons[i].classList.remove('active');
            }
        }
    }

    // Setup event listeners
    setupEventListeners() {
        var filterButtons = document.querySelectorAll('.filter-btn');
        for (var i = 0; i < filterButtons.length; i++) {
            filterButtons[i].addEventListener('click', (function(btn) {
                return function() {
                    this.filterNews(btn.dataset.filter);
                };
            }(filterButtons[i])).bind(this));
        }
    }

    // Show error message
    showErrorMessage(message) {
        var container = document.getElementById('news-container') || 
                         document.getElementById('all-news-container');
        if (container) {
            container.innerHTML = 
                '<div class="error-message">' +
                '<div class="error-icon">❌</div>' +
                '<h3>Unable to Load News</h3>' +
                '<p>' + message + '</p>' +
                '<button onclick="window.newsManager.loadNewsData()" class="retry-btn">Try Again</button>' +
                '</div>';
        }
    }
}

// Initialize news manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.newsManager = new NewsManager();
});