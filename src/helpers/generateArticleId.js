export function generateArticleId(article) {
  const sourceName = article.source.name?.trim() || 'Unknown Source'
  const title = article.title?.substring(0, 50).trim() || 'No Title'
  const publishedAt = new Date(article.publishedAt).getTime()

  return `${sourceName}::${title}::${publishedAt}`
}
