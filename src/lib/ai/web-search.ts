import { logger } from "@/lib/logger";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export async function executeWebSearch(query: string, maxResults: number = 5): Promise<SearchResult[]> {
  // 1. If TAVILY_API_KEY is present, use Tavily Search API
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (tavilyKey) {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: "basic",
          max_results: maxResults,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          return data.results.map((r: any) => ({
            title: r.title || "Web Result",
            url: r.url || "",
            snippet: r.content || r.snippet || "",
          }));
        }
      }
    } catch (err) {
      logger.warn("Tavily search failed, falling back to DuckDuckGo", { err });
    }
  }

  // 2. Free DuckDuckGo HTML Instant Search Fallback
  try {
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(ddgUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (res.ok) {
      const html = await res.text();
      const results: SearchResult[] = [];
      const linkRegex = /<a class="result__url" href="([^"]+)">([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
      let match;
      
      while ((match = linkRegex.exec(html)) !== null && results.length < maxResults) {
        let url = match[1].trim();
        // Decode DDG redirect URL if present
        if (url.includes("uddg=")) {
          const actualUrl = new URL("https://duckduckgo.com" + url).searchParams.get("uddg");
          if (actualUrl) url = actualUrl;
        }
        const rawTitle = match[2].replace(/<[^>]+>/g, "").trim();
        const rawSnippet = match[3].replace(/<[^>]+>/g, "").trim();
        if (url && (rawTitle || rawSnippet)) {
          results.push({
            title: rawTitle || "Web Search Result",
            url,
            snippet: rawSnippet,
          });
        }
      }

      if (results.length > 0) {
        return results;
      }
    }
  } catch (err) {
    logger.warn("DuckDuckGo HTML search failed", { err });
  }

  // 3. Fallback: Wikipedia search for conceptual topics
  try {
    const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&utf8=1`);
    if (wikiRes.ok) {
      const wikiJson = await wikiRes.json();
      const items = wikiJson.query?.search || [];
      return items.slice(0, maxResults).map((item: any) => ({
        title: item.title,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
        snippet: (item.snippet || "").replace(/<[^>]+>/g, ""),
      }));
    }
  } catch (err) {
    logger.error("All web search methods failed", { err });
  }

  return [];
}

export async function fetchWebpageContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    // Extract text content and strip tags
    const clean = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return clean.slice(0, 4000); // 4k chars summary window
  } catch (err: any) {
    logger.warn("Fetch webpage failed", { url, err });
    return `Could not fetch content from ${url}: ${err?.message}`;
  }
}