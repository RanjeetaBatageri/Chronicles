/**
 * Chronicles - Modern Journalistic Web Portal
 * 
 * Core Features Showcased:
 * 1. ES6 Features:
 *    - Arrow functions (() => {})
 *    - Object & Array destructuring (const { title, url } = article)
 *    - Default parameters & Template literals
 *    - Spread & Rest operators (...articles)
 *    - ES Modules (import/export)
 * 2. API Integration:
 *    - Live RSS-to-JSON and curated news fetching
 *    - HTTP request abstraction
 * 3. Asynchronous JavaScript:
 *    - Async/Await syntax
 *    - Promise handling (.then, .catch, Promise.race)
 *    - Try/catch/finally error resilience & graceful fallbacks
 */

import { NewsService } from "./api.js";
import { BookmarkService } from "./bookmarks.js";

// Initialize services
const newsService = new NewsService();
const bookmarkService = new BookmarkService();

// State management
const state = {
  activeCategory: "all",
  searchQuery: "",
  articles: [],
  currentReaderArticle: null,
  isDarkTheme: localStorage.getItem("chronicles_theme") === "dark"
};

// DOM Elements
const DOM = {
  themeToggleBtn: document.getElementById("theme-toggle-btn"),
  themeIcon: document.getElementById("theme-icon"),
  brandLogo: document.getElementById("brand-logo"),
  categoryNav: document.getElementById("category-nav"),
  currentCategoryTitle: document.getElementById("current-category-title"),
  articleCountBadge: document.getElementById("article-count-badge"),
  refreshFeedBtn: document.getElementById("refresh-feed-btn"),
  
  // Search
  searchToggleBtn: document.getElementById("search-toggle-btn"),
  searchDrawer: document.getElementById("search-drawer"),
  searchInput: document.getElementById("search-input"),
  clearSearchBtn: document.getElementById("clear-search-btn"),

  // Sections
  loadingSpinner: document.getElementById("loading-spinner"),
  errorBanner: document.getElementById("error-banner"),
  retryBtn: document.getElementById("retry-btn"),
  heroSection: document.getElementById("hero-section"),
  articlesGrid: document.getElementById("articles-grid"),
  emptyState: document.getElementById("empty-state"),
  resetFilterBtn: document.getElementById("reset-filter-btn"),

  // Bookmarks
  bookmarksBtn: document.getElementById("bookmarks-btn"),
  bookmarkBadge: document.getElementById("bookmark-badge"),
  bookmarksModal: document.getElementById("bookmarks-modal"),
  closeBookmarksBtn: document.getElementById("close-bookmarks-btn"),
  bookmarksList: document.getElementById("bookmarks-list"),

  // Reader Modal
  readerModal: document.getElementById("reader-modal"),
  closeReaderBtn: document.getElementById("close-reader-btn"),
  readerContent: document.getElementById("reader-content"),
  readerBookmarkBtn: document.getElementById("reader-bookmark-btn"),
  readerCopyLinkBtn: document.getElementById("reader-copy-link-btn"),
  readerShareBtn: document.getElementById("reader-share-btn"),

  // Ticker & Toast
  tickerText: document.getElementById("ticker-text"),
  currentDatetime: document.getElementById("current-datetime"),
  toast: document.getElementById("toast")
};

// Category Titles Map
const CATEGORY_TITLES = {
  all: "Top Stories & Global Intelligence",
  technology: "Technology, Autonomous Systems & Computing",
  world: "World Affairs, Diplomacy & Geopolitics",
  business: "Business, Capital Markets & Economics",
  science: "Astronomy, Deep Tech & Fundamental Physics",
  health: "Medical Science, Longevity & Biotechnology",
  entertainment: "Arts, Cinema, Culture & Literature",
  sports: "Global Athletics & Sports Kinematics"
};

/**
 * ES6 Arrow Function: Format relative time
 */
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const diffSec = Math.floor((new Date() - date) / 1000);
  
  if (isNaN(diffSec) || diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

/**
 * Toast Notification Utility
 */
const showToast = (message = "Notice updated") => {
  DOM.toast.textContent = message;
  DOM.toast.classList.add("show");
  setTimeout(() => DOM.toast.classList.remove("show"), 2800);
};

/**
 * Robust Share Utility
 * Supports:
 * 1. Native Web Share API (navigator.share) on supported platforms (mobile/modern browsers)
 * 2. Async Clipboard API (navigator.clipboard.writeText)
 * 3. Fallback textarea copy execCommand for older/restricted environments (e.g. file:// or unauthenticated contexts)
 */
const copyToClipboardFallback = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (err) {
    console.error("ExecCommand copy failed:", err);
  }
  document.body.removeChild(textarea);
  return success;
};

/**
 * Pure Link Copy Utility
 * Guarantees copying the direct URL of an article to the clipboard
 */
const copyArticleLink = async (article) => {
  if (!article) return;
  const { url } = article;
  const shareUrl = (url && url !== "#") ? url : window.location.href;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard: " + (shareUrl.length > 40 ? shareUrl.slice(0, 40) + "..." : shareUrl));
      return;
    } catch (err) {
      console.warn("navigator.clipboard failed:", err);
    }
  }

  // Fallback
  const copied = copyToClipboardFallback(shareUrl);
  if (copied) {
    showToast("Link copied to clipboard");
  } else {
    prompt("Copy link:", shareUrl);
  }
};

const shareArticle = async (article) => {
  if (!article) return;
  const { title, url, description } = article;
  const shareUrl = (url && url !== "#") ? url : window.location.href;
  const shareData = {
    title: `Chronicles: ${title}`,
    text: description || title,
    url: shareUrl
  };

  // 1. Try Native Web Share API first
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      showToast("Article shared successfully");
      return;
    } catch (err) {
      if (err.name === "AbortError") return; // User cancelled share dialog
      console.warn("Navigator.share failed, trying clipboard fallback:", err);
    }
  }

  // 2. Try modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Article dispatch link copied to clipboard");
      return;
    } catch (err) {
      console.warn("navigator.clipboard.writeText failed:", err);
    }
  }

  // 3. Fallback copy method
  const copied = copyToClipboardFallback(shareUrl);
  if (copied) {
    showToast("Article dispatch link copied to clipboard");
  } else {
    // Prompt fallback as absolute guarantee
    prompt("Copy this article link:", shareUrl);
  }
};

/**
 * Theme Manager
 */
const applyTheme = () => {
  if (state.isDarkTheme) {
    document.body.classList.add("dark-theme");
    DOM.themeIcon.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-theme");
    DOM.themeIcon.textContent = "🌙";
  }
};

const toggleTheme = () => {
  state.isDarkTheme = !state.isDarkTheme;
  localStorage.setItem("chronicles_theme", state.isDarkTheme ? "dark" : "light");
  applyTheme();
};

/**
 * Update Bookmark Counter Badge
 */
const updateBookmarkBadge = () => {
  const count = bookmarkService.getAllBookmarks().length;
  DOM.bookmarkBadge.textContent = count;
  DOM.bookmarkBadge.style.display = count > 0 ? "flex" : "none";
};

/**
 * Asynchronous Data Loading
 * Demonstrates: Async/Await, Destructuring, and Error Handling
 */
const loadNews = async () => {
  // UI Loading State
  DOM.loadingSpinner.style.display = "flex";
  DOM.errorBanner.style.display = "none";
  DOM.heroSection.style.display = "none";
  DOM.articlesGrid.style.display = "none";
  DOM.emptyState.style.display = "none";
  DOM.articleCountBadge.textContent = "Connecting to wire...";

  try {
    // ES6 Destructuring options passed into asynchronous fetch
    const fetchedArticles = await newsService.fetchNews({
      category: state.activeCategory,
      searchTerm: state.searchQuery
    });

    state.articles = fetchedArticles;

    // Render loaded articles
    renderFeed();
  } catch (err) {
    console.error("Failed to fetch news:", err);
    DOM.errorBanner.style.display = "flex";
    DOM.articleCountBadge.textContent = "Wire Error";
  } finally {
    DOM.loadingSpinner.style.display = "none";
  }
};

/**
 * Renders the Feed: Lead Hero Article + Stream Grid
 */
const renderFeed = () => {
  const { articles } = state;

  DOM.currentCategoryTitle.textContent = CATEGORY_TITLES[state.activeCategory] || "Dispatches";
  DOM.articleCountBadge.textContent = `${articles.length} dispatches available`;

  if (!articles || articles.length === 0) {
    DOM.heroSection.innerHTML = "";
    DOM.articlesGrid.innerHTML = "";
    DOM.emptyState.style.display = "block";
    return;
  }

  DOM.emptyState.style.display = "none";
  DOM.heroSection.style.display = "grid";
  DOM.articlesGrid.style.display = "grid";

  // Use ES6 Array Destructuring: Split lead story and the rest
  const [leadArticle, secondArticle, thirdArticle, ...streamArticles] = articles;

  // Update breaking ticker with lead story title
  if (leadArticle) {
    DOM.tickerText.textContent = `${leadArticle.category.toUpperCase()}: ${leadArticle.title}`;
  }

  // 1. Render Hero Section
  renderHero(leadArticle, [secondArticle, thirdArticle].filter(Boolean));

  // 2. Render Stream Grid
  renderGrid(streamArticles.length > 0 ? streamArticles : [secondArticle, thirdArticle].filter(Boolean));
};

/**
 * Renders the Hero Editorial Showcase
 */
const renderHero = (lead, secondaryList) => {
  if (!lead) {
    DOM.heroSection.innerHTML = "";
    return;
  }

  // Destructure lead article
  const { id, title, description, imageUrl, category, author, publishedAt, readTime } = lead;
  const isBookmarked = bookmarkService.isBookmarked(id);

  DOM.heroSection.innerHTML = `
    <!-- Primary Lead Article -->
    <article class="lead-article" data-article-id="${id}">
      <div class="lead-image-wrap">
        <img src="${imageUrl}" alt="${title}" class="lead-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'">
      </div>
      <div class="lead-content">
        <span class="category-tag">${category}</span>
        <h3 class="lead-title">${title}</h3>
        <p class="lead-excerpt">${description}</p>
        <div class="article-meta">
          <span class="meta-author">By ${author}</span>
          <span class="meta-bullet">•</span>
          <span class="meta-time">${formatTimeAgo(publishedAt)}</span>
          <span class="meta-bullet">•</span>
          <span class="meta-read">${readTime}</span>
        </div>
      </div>
    </article>

    <!-- Secondary Articles Column -->
    <div class="secondary-column">
      ${secondaryList.map(item => {
        const { id: sId, title: sTitle, category: sCat, publishedAt: sDate, readTime: sRead } = item;
        return `
          <div class="secondary-card" data-article-id="${sId}">
            <span class="category-tag">${sCat}</span>
            <h4 class="secondary-title">${sTitle}</h4>
            <div class="article-meta">
              <span>${formatTimeAgo(sDate)}</span>
              <span class="meta-bullet">•</span>
              <span>${sRead}</span>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  // Attach click events to open reader
  DOM.heroSection.querySelectorAll("[data-article-id]").forEach(card => {
    card.addEventListener("click", () => {
      const targetId = card.dataset.articleId;
      const article = state.articles.find(({ id }) => id === targetId);
      if (article) openReader(article);
    });
  });
};

/**
 * Renders the Standard Grid Stream
 */
const renderGrid = (articles) => {
  DOM.articlesGrid.innerHTML = "";

  articles.forEach(article => {
    // ES6 Object Destructuring
    const { id, title, description, imageUrl, category, author, publishedAt, readTime } = article;
    const isBookmarked = bookmarkService.isBookmarked(id);

    const card = document.createElement("article");
    card.className = "article-card";
    card.dataset.articleId = id;

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${imageUrl}" alt="${title}" class="card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'">
        <div class="card-action-bar">
          <button class="card-action-btn card-copy-link-btn" data-copy-id="${id}" title="Copy Link Only">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </button>
          <button class="card-action-btn card-share-btn" data-share-id="${id}" title="Share Dispatch">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
          <button class="card-action-btn card-bookmark-btn ${isBookmarked ? "bookmarked" : ""}" data-bookmark-id="${id}" title="${isBookmarked ? "Remove Bookmark" : "Save to Reading List"}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>
      </div>
      <div class="card-body">
        <span class="category-tag">${category}</span>
        <h4 class="card-title">${title}</h4>
        <p class="card-desc">${description}</p>
        <div class="card-footer">
          <span>By ${author}</span>
          <span>${formatTimeAgo(publishedAt)}</span>
        </div>
      </div>
    `;

    // Card click opens reader (unless clicking action buttons)
    card.addEventListener("click", (e) => {
      if (e.target.closest(".card-action-btn")) return;
      openReader(article);
    });

    // Copy link button click
    const copyBtn = card.querySelector(".card-copy-link-btn");
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      copyArticleLink(article);
    });

    // Share button click
    const shareBtn = card.querySelector(".card-share-btn");
    shareBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      shareArticle(article);
    });

    // Bookmark button click
    const bookmarkBtn = card.querySelector(".card-bookmark-btn");
    bookmarkBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const added = bookmarkService.toggleBookmark(article);
      bookmarkBtn.classList.toggle("bookmarked", added);
      bookmarkBtn.querySelector("svg").setAttribute("fill", added ? "currentColor" : "none");
      updateBookmarkBadge();
      showToast(added ? "Added to Saved Reading List" : "Removed from Bookmarks");
    });

    DOM.articlesGrid.appendChild(card);
  });
};

/**
 * Article Reader Modal
 */
const openReader = (article) => {
  state.currentReaderArticle = article;
  const { title, content, description, imageUrl, category, author, publishedAt, readTime, url, id } = article;
  const isBookmarked = bookmarkService.isBookmarked(id);

  // Split content into clean paragraphs
  const paragraphs = (content || description).split("\n\n").filter(p => p.trim().length > 0);

  DOM.readerContent.innerHTML = `
    <div class="reader-category">${category}</div>
    <h2 class="reader-title">${title}</h2>
    <div class="reader-meta-bar">
      <span><strong>By ${author}</strong></span>
      <span class="meta-bullet">•</span>
      <span>${new Date(publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      <span class="meta-bullet">•</span>
      <span>${readTime}</span>
    </div>
    <img src="${imageUrl}" alt="${title}" class="reader-hero-img" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'">
    <div class="reader-body-text">
      ${paragraphs.map(p => `<p>${p}</p>`).join("")}
      <p>For more updates and real-time coverage, follow the continuous dispatches on Chronicles Global Edition.</p>
    </div>
    ${url && url !== "#" ? `
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="reader-original-link">
        <span>View Full Original Wire Dispatch on Source Site</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>
    ` : ""}
  `;

  // Update modal bookmark icon
  DOM.readerBookmarkBtn.querySelector("svg").setAttribute("fill", isBookmarked ? "currentColor" : "none");

  DOM.readerModal.classList.add("active");
  document.body.style.overflow = "hidden";
};

const closeReader = () => {
  DOM.readerModal.classList.remove("active");
  document.body.style.overflow = "";
  state.currentReaderArticle = null;
};

/**
 * Bookmarks Drawer Modal
 */
const openBookmarks = () => {
  const bookmarks = bookmarkService.getAllBookmarks();
  DOM.bookmarksList.innerHTML = "";

  if (bookmarks.length === 0) {
    DOM.bookmarksList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>No saved dispatches in your reading list yet.</p>
        <p style="font-size: 0.85rem; margin-top: 0.4rem;">Click the bookmark icon on any article to save it for later.</p>
      </div>
    `;
  } else {
    bookmarks.forEach(article => {
      const { id, title, imageUrl, category, readTime } = article;
      const item = document.createElement("div");
      item.className = "bookmark-item";
      item.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="bookmark-thumb">
        <div class="bookmark-info">
          <span class="category-tag">${category}</span>
          <h4>${title}</h4>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${readTime}</span>
        </div>
        <button class="bookmark-remove-btn" title="Remove">&times;</button>
      `;

      // Click row to read
      item.addEventListener("click", (e) => {
        if (e.target.closest(".bookmark-remove-btn")) return;
        closeBookmarks();
        openReader(article);
      });

      // Remove button
      item.querySelector(".bookmark-remove-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        bookmarkService.toggleBookmark(article);
        updateBookmarkBadge();
        openBookmarks(); // Re-render list
        showToast("Removed from reading list");
        renderFeed(); // Sync card bookmark button
      });

      DOM.bookmarksList.appendChild(item);
    });
  }

  DOM.bookmarksModal.classList.add("active");
  document.body.style.overflow = "hidden";
};

const closeBookmarks = () => {
  DOM.bookmarksModal.classList.remove("active");
  document.body.style.overflow = "";
};

/**
 * Event Handlers & Initializers
 */
const setupEventListeners = () => {
  // Theme Toggle
  DOM.themeToggleBtn.addEventListener("click", toggleTheme);

  // Logo Reset
  DOM.brandLogo.addEventListener("click", (e) => {
    e.preventDefault();
    state.activeCategory = "all";
    state.searchQuery = "";
    DOM.searchInput.value = "";
    updateNavUI();
    loadNews();
  });

  // Category Nav Clicks (Event Delegation)
  DOM.categoryNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-link");
    if (!btn) return;
    
    state.activeCategory = btn.dataset.category;
    updateNavUI();
    loadNews();
  });

  // Search Toggle
  DOM.searchToggleBtn.addEventListener("click", () => {
    DOM.searchDrawer.classList.toggle("open");
    if (DOM.searchDrawer.classList.contains("open")) {
      DOM.searchInput.focus();
    }
  });

  // Search Input with Debounce
  let searchTimeout = null;
  DOM.searchInput.addEventListener("input", (e) => {
    const value = e.target.value;
    DOM.clearSearchBtn.classList.toggle("visible", value.length > 0);

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = value;
      loadNews();
    }, 350);
  });

  // Clear Search
  DOM.clearSearchBtn.addEventListener("click", () => {
    DOM.searchInput.value = "";
    DOM.clearSearchBtn.classList.remove("visible");
    state.searchQuery = "";
    loadNews();
    DOM.searchInput.focus();
  });

  // Refresh Feed
  DOM.refreshFeedBtn.addEventListener("click", () => {
    showToast("Syncing with global wires...");
    loadNews();
  });

  // Retry Button on Error
  DOM.retryBtn.addEventListener("click", loadNews);

  // Reset Filters on Empty State
  DOM.resetFilterBtn.addEventListener("click", () => {
    state.activeCategory = "all";
    state.searchQuery = "";
    DOM.searchInput.value = "";
    DOM.clearSearchBtn.classList.remove("visible");
    DOM.searchDrawer.classList.remove("open");
    updateNavUI();
    loadNews();
  });

  // Bookmarks Modal
  DOM.bookmarksBtn.addEventListener("click", openBookmarks);
  DOM.closeBookmarksBtn.addEventListener("click", closeBookmarks);
  DOM.bookmarksModal.addEventListener("click", (e) => {
    if (e.target === DOM.bookmarksModal) closeBookmarks();
  });

  // Reader Modal
  DOM.closeReaderBtn.addEventListener("click", closeReader);
  DOM.readerModal.addEventListener("click", (e) => {
    if (e.target === DOM.readerModal) closeReader();
  });

  // Reader Bookmark Toggle
  DOM.readerBookmarkBtn.addEventListener("click", () => {
    if (!state.currentReaderArticle) return;
    const added = bookmarkService.toggleBookmark(state.currentReaderArticle);
    DOM.readerBookmarkBtn.querySelector("svg").setAttribute("fill", added ? "currentColor" : "none");
    updateBookmarkBadge();
    showToast(added ? "Saved to reading list" : "Removed from reading list");
    renderFeed();
  });

  // Reader Copy Link Only
  DOM.readerCopyLinkBtn.addEventListener("click", () => {
    if (!state.currentReaderArticle) return;
    copyArticleLink(state.currentReaderArticle);
  });

  // Reader Share
  DOM.readerShareBtn.addEventListener("click", () => {
    if (!state.currentReaderArticle) return;
    shareArticle(state.currentReaderArticle);
  });

  // Footer Category Links
  document.querySelectorAll("[data-footer-cat]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      state.activeCategory = link.dataset.footerCat;
      updateNavUI();
      window.scrollTo({ top: 0, behavior: "smooth" });
      loadNews();
    });
  });

  // Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    // Escape to close modals
    if (e.key === "Escape") {
      if (DOM.readerModal.classList.contains("active")) closeReader();
      if (DOM.bookmarksModal.classList.contains("active")) closeBookmarks();
      if (DOM.searchDrawer.classList.contains("open")) DOM.searchDrawer.classList.remove("open");
    }

    // Ctrl+K or '/' to focus search
    if ((e.key === "/" || (e.ctrlKey && e.key === "k")) && document.activeElement !== DOM.searchInput) {
      e.preventDefault();
      DOM.searchDrawer.classList.add("open");
      DOM.searchInput.focus();
    }
  });
};

const updateNavUI = () => {
  DOM.categoryNav.querySelectorAll(".nav-link").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === state.activeCategory);
  });
};

// Initial Setup
const init = () => {
  applyTheme();
  updateBookmarkBadge();
  setupEventListeners();

  // Set formatted current date in ticker
  const now = new Date();
  DOM.currentDatetime.textContent = now.toLocaleDateString(undefined, { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });

  // Load initial feed
  loadNews();
};

document.addEventListener("DOMContentLoaded", init);

