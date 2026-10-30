/**
 * Chronicles - API Service & Data Layer
 * 
 * Demonstrates:
 * 1. ES6 Features: Arrow functions, object/array destructuring, default parameters, rest/spread
 * 2. API Integration: Fetching live data via async HTTP calls
 * 3. Asynchronous JavaScript: Promises, Async/Await, try/catch/finally, Promise.any, AbortController
 */

import { FALLBACK_ARTICLES } from "./mockData.js";

// Free, public RSS-to-JSON and Open News Endpoints
// We use open CORS proxy converters to query real-time tech, world, science feeds
const RSS_TOPICS = {
  all: [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"
  ],
  technology: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    "https://feeds.arstechnica.com/arstechnica/index"
  ],
  world: [
    "https://feeds.bbci.co.uk/news/world/rss.xml"
  ],
  business: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml"
  ],
  science: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml"
  ],
  health: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml"
  ],
  entertainment: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml"
  ],
  sports: [
    "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml"
  ]
};

// Thematic curated image pools per category so articles never share the same image
const CATEGORY_IMAGE_POOLS = {
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
  ],
  world: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
  ],
  business: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80"
  ],
  science: [
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1200&q=80"
  ],
  health: [
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
  ],
  entertainment: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
  ],
  sports: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80"
  ]
};

/**
 * Deterministic hash function from string to pick a stable, unique image
 */
const getHashedImage = (str = "", category = "technology", index = 0) => {
  const pool = CATEGORY_IMAGE_POOLS[category] || CATEGORY_IMAGE_POOLS.technology;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const chosenIndex = Math.abs(hash + index) % pool.length;
  return pool[chosenIndex];
};

/**
 * Normalizes an external RSS item into Chronicles' uniform Article model
 * Uses ES6 Destructuring and Default Values
 */
export const normalizeItem = (rawItem, category = "technology", itemIndex = 0) => {
  // ES6 Destructuring with defaults & fallbacks
  const {
    title = "Untitled Dispatch",
    description = "",
    link = "#",
    guid = "",
    pubDate = new Date().toISOString(),
    author = "Editorial Desk",
    thumbnail = "",
    enclosure = {}
  } = rawItem;

  // Extract clean text from HTML description if needed
  const cleanDescription = description
    ? description.replace(/<[^>]*>?/gm, "").trim().slice(0, 220) + (description.length > 220 ? "..." : "")
    : "Read the comprehensive coverage and in-depth report on Chronicles.";

  // Extract any image src from description HTML if thumbnail is missing
  let extractedImg = "";
  if (description && description.includes("<img")) {
    const match = description.match(/src=["'](.*?)["']/);
    if (match && match[1]) extractedImg = match[1];
  }

  // Choose the best image candidate:
  // 1. thumbnail/enclosure
  // 2. extracted img from RSS HTML
  // 3. Unique deterministic image from curated category pool based on article title
  const imageUrl = thumbnail || enclosure.link || extractedImg || getHashedImage(title || link, category, itemIndex);

  // Generate an ID
  const id = guid || link || `art-${Math.random().toString(36).substring(2, 9)}`;

  return {
    id,
    title: title.trim(),
    description: cleanDescription,
    content: description.replace(/<[^>]*>?/gm, "").trim(),
    category,
    author: author || "Chronicles Special Correspondent",
    source: "Global Wire Feed",
    url: link,
    imageUrl,
    publishedAt: pubDate,
    readTime: `${Math.max(2, Math.ceil(cleanDescription.length / 50))} min read`,
    isTrending: false,
    isBreaking: false
  };
};

/**
 * Primary Asynchronous News Service
 */
export class NewsService {
  constructor() {
    this.cache = new Map();
    this.currentController = null;
  }

  /**
   * Fetches news articles using async/await, Promises, and AbortController.
   * If offline or API fails, gracefully leverages curated fallback data.
   * 
   * @param {Object} options - Query options
   * @param {string} options.category - Target news category
   * @param {string} options.searchTerm - Filter keywords
   */
  fetchNews = async ({ category = "all", searchTerm = "" } = {}) => {
    // Check if previous request is pending, abort it if a new search is initiated
    if (this.currentController) {
      this.currentController.abort();
    }
    this.currentController = new AbortController();
    const { signal } = this.currentController;

    // Cache key for current query
    const cacheKey = `${category}_${searchTerm.toLowerCase().trim()}`;
    if (this.cache.has(cacheKey) && !searchTerm) {
      return this.cache.get(cacheKey);
    }

    try {
      // Pick RSS URLs for category
      const targetUrls = RSS_TOPICS[category] || RSS_TOPICS.all;
      const primaryUrl = targetUrls[0];

      // Use rsstojson public API with timeout
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(primaryUrl)}`;

      // Async fetch with timeout Promise
      const fetchPromise = fetch(apiUrl, { signal });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out")), 4500)
      );

      // Promise.race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.status === "ok" && Array.isArray(data.items)) {
        // Transform items using ES6 map and destructuring
        let liveArticles = data.items.map((item, index) => 
          normalizeItem(item, category === "all" ? "world" : category, index)
        );

        // Mark the first one as breaking news
        if (liveArticles.length > 0) {
          liveArticles[0].isBreaking = true;
          liveArticles[0].isTrending = true;
        }

        // Apply search filter if user entered query
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          liveArticles = liveArticles.filter(({ title, description }) => 
            title.toLowerCase().includes(query) || description.toLowerCase().includes(query)
          );
        }

        this.cache.set(cacheKey, liveArticles);
        return liveArticles;
      } else {
        throw new Error("Invalid RSS response payload");
      }
    } catch (error) {
      // If error was manual abort due to rapid user typing, quietly rethrow
      if (error.name === "AbortError") {
        throw error;
      }

      console.warn("Live API unavailable, serving Chronicles curated editorial feed:", error.message);

      // Return curated fallback articles filtered by category & search term
      return this.getFallbackArticles({ category, searchTerm });
    } finally {
      this.currentController = null;
    }
  };

  /**
   * Filters curated fallback articles synchronously
   */
  getFallbackArticles = ({ category = "all", searchTerm = "" } = {}) => {
    let results = [...FALLBACK_ARTICLES];

    if (category !== "all") {
      results = results.filter((article) => article.category === category);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      results = results.filter(({ title, description, content }) =>
        title.toLowerCase().includes(query) || 
        description.toLowerCase().includes(query) ||
        content.toLowerCase().includes(query)
      );
    }

    return results;
  };
}

