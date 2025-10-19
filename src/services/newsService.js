import api from './api'

/**
 * Fetches top headlines from the NewsAPI `/top-headlines` endpoint.
 *
 * You can filter by `country` + `category`, or by `sources` (but not both).
 *
 * @param {string} country 2-letter ISO 3166-1 code of the country (e.g., 'us', 'gb'). Can't be used with `sources`.
 * @param {string} query Keywords or phrases to search for in the article title and body.
 * @param {string} [category] Category of news ('business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology').
 * @param {string} [sources] Comma-separated list of source IDs (max 20). Can't be mixed with `country` or `category`.
 * @param {number} [page=1] Page number for pagination (starts from 1).
 * @param {number} [pageSize=20] Number of results per request (max 100).
 * @returns {Promise<AxiosResponse>} Promise with the API response containing articles and total results.
 */
export function getTopHeadlines(
  country = 'us',
  query = '',
  category,
  sources,
  page = 1,
  pageSize = 20,
) {
  return api.get('/top-headlines', {
    params: {
      q: query,
      country,
      category,
      sources,
      page,
      pageSize,
    },
  })
}

/**
 * Searches all articles from the NewsAPI `/everything` endpoint.
 *
 * Use this for advanced or global searches - includes date range, sorting, and domain filters.
 *
 * @param {string} query Keywords or phrases to search for. Supports advanced operators (+, -, AND, OR, NOT).
 * @param {string} [searchIn] Restrict search fields ('title', 'description', 'content', comma-separated).
 * @param {string} [from] Oldest allowed article date (ISO 8601: '2025-10-19' or '2025-10-19T11:43:09').
 * @param {string} [to] Newest allowed article date (ISO 8601).
 * @param {string} [language] 2-letter ISO-639-1 language code (e.g. 'en', 'fr', 'ru').
 * @param {string} [sortBy='publishedAt'] Sort order ('relevancy', 'popularity', 'publishedAt').
 * @param {string} [domains] Comma-separated domains to include (e.g. 'bbc.co.uk,techcrunch.com').
 * @param {string} [excludeDomains] Comma-separated domains to exclude.
 * @param {number} [page=1] Page number for pagination.
 * @param {number} [pageSize=100] Number of results per page (max 100).
 * @returns {Promise<AxiosResponse>} Promise with the API response containing articles and total results.
 */
export function searchNews(
  query = '',
  searchIn = '',
  from,
  to,
  language,
  sortBy = 'publishedAt',
  domains = '',
  excludeDomains = '',
  page = 1,
  pageSize = 100,
) {
  return api.get('/everything', {
    params: {
      q: query,
      searchIn,
      from,
      to,
      language,
      sortBy,
      domains,
      excludeDomains,
      page,
      pageSize,
    },
  })
}
