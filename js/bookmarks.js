/**
 * Chronicles - Modern Bookmark & Reading List Manager
 * Pure ES6 class with localStorage persistence
 */

export class BookmarkService {
  constructor() {
    this.storageKey = "chronicles_bookmarks_v1";
    this.bookmarks = this.loadBookmarks();
  }

  loadBookmarks = () => {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load bookmarks from localStorage:", e);
      return [];
    }
  };

  saveBookmarks = () => {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.bookmarks));
    } catch (e) {
      console.error("Failed to save bookmarks:", e);
    }
  };

  // Toggle bookmark state using array findIndex and spread
  toggleBookmark = (article) => {
    const index = this.bookmarks.findIndex(({ id }) => id === article.id);
    if (index > -1) {
      // Remove
      this.bookmarks = this.bookmarks.filter(({ id }) => id !== article.id);
      this.saveBookmarks();
      return false; // Removed
    } else {
      // Add to front
      this.bookmarks = [article, ...this.bookmarks];
      this.saveBookmarks();
      return true; // Added
    }
  };

  isBookmarked = (articleId) => {
    return this.bookmarks.some(({ id }) => id === articleId);
  };

  getAllBookmarks = () => [...this.bookmarks];
}

