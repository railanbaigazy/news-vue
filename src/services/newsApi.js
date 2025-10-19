const API_BASE_URL = 'https://newsapi.org/v2'
const API_KEY = 'demo-key'

class NewsApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.apiKey = API_KEY
  }

  async getTopHeadlines(params = {}) {
    const defaultParams = {
      country: 'ru',
      pageSize: 20,
      ...params
    }

    return this.makeRequest('/top-headlines', defaultParams)
  }

  async searchNews(query, params = {}) {
    const searchParams = {
      q: query,
      language: 'ru',
      sortBy: 'publishedAt',
      pageSize: 20,
      ...params
    }

    return this.makeRequest('/everything', searchParams)
  }

  async getNewsByCategory(category, params = {}) {
    const categoryParams = {
      category,
      country: 'ru',
      pageSize: 20,
      ...params
    }

    return this.makeRequest('/top-headlines', categoryParams)
  }

  async getArticleById(id) {
    return this.getMockArticle(id)
  }
  getMockArticles() {
    return [
      {
        id: 1,
        title: 'Новые технологии в области искусственного интеллекта',
        description: 'Обзор последних достижений в сфере ИИ и их влияние на современный мир',
        content: `
          <p>Искусственный интеллект продолжает развиваться с невероятной скоростью, открывая новые возможности для человечества. В последние годы мы стали свидетелями революционных изменений в этой области.</p>
          <p>Одним из наиболее значимых достижений стало создание более эффективных алгоритмов машинного обучения, которые способны обрабатывать огромные объемы данных и находить скрытые закономерности.</p>
          <p>Современные ИИ-системы уже используются в медицине для диагностики заболеваний, в транспорте для создания автономных автомобилей, и во многих других сферах жизни.</p>
        `,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        category: 'Technology',
        publishedAt: new Date('2024-01-15'),
        likes: 1247,
        comments: 89,
        author: {
          name: 'Алексей Петров',
          role: 'Технический редактор',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
      },
      // {
      //   id: 2,
      //   title: 'Квантовые вычисления: новая эра',
      //   description: 'Революционные достижения в области квантовых компьютеров',
      //   content: `
      //     <p>Квантовые вычисления представляют собой новую парадигму в информационных технологиях.</p>
      //     <p>Современные квантовые компьютеры уже способны решать задачи, которые были недоступны классическим машинам.</p>
      //   `,
      //   image: 'https://images.unsplash.com/photo-1635070041078-e43c4b3b4a0a?w=800&h=400&fit=crop',
      //   category: 'Science',
      //   publishedAt: new Date('2024-01-14'),
      //   likes: 892,
      //   comments: 45,
      //   author: {
      //     name: 'Мария Иванова',
      //     role: 'Научный журналист',
      //     avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      //   }
      // },
      // {
      //   id: 3,
      //   title: 'Блокчейн в здравоохранении',
      //   description: 'Как блокчейн технологии меняют медицинскую отрасль',
      //   content: `
      //     <p>Блокчейн технологии находят все больше применений в сфере здравоохранения.</p>
      //     <p>От безопасного хранения медицинских данных до прозрачности в фармацевтической цепочке поставок.</p>
      //   `,
      //   image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      //   category: 'Health',
      //   publishedAt: new Date('2024-01-13'),
      //   likes: 654,
      //   comments: 23,
      //   author: {
      //     name: 'Дмитрий Соколов',
      //     role: 'Медицинский аналитик',
      //     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      //   }
      // },
      // {
      //   id: 4,
      //   title: 'Роботы в производстве',
      //   description: 'Автоматизация производства с помощью роботизированных систем',
      //   content: `
      //     <p>Современные роботизированные системы кардинально меняют производственные процессы.</p>
      //     <p>От автомобильной промышленности до электроники - роботы повышают эффективность и качество.</p>
      //   `,
      //   image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
      //   category: 'Technology',
      //   publishedAt: new Date('2024-01-12'),
      //   likes: 432,
      //   comments: 67,
      //   author: {
      //     name: 'Елена Козлова',
      //     role: 'Инженер-технолог',
      //     avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      //   }
      // },
      // {
      //   id: 5,
      //   title: 'Климатические изменения и экономика',
      //   description: 'Влияние климатических изменений на мировую экономику',
      //   content: `
      //     <p>Климатические изменения оказывают все большее влияние на экономические процессы.</p>
      //     <p>От зеленых инвестиций до адаптации производственных цепочек - экономика меняется под воздействием климата.</p>
      //   `,
      //   image: 'https://images.unsplash.com/photo-1569163139394-de6e4a2be31c?w=800&h=400&fit=crop',
      //   category: 'Business',
      //   publishedAt: new Date('2024-01-11'),
      //   likes: 789,
      //   comments: 34,
      //   author: {
      //     name: 'Андрей Волков',
      //     role: 'Экономический аналитик',
      //     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      //   }
      // }
    ]
  }

  getMockArticle(id) {
    const articles = this.getMockArticles()
    return articles.find(article => article.id === parseInt(id)) || articles[0]
  }

  async makeRequest(endpoint, params = {}) {
    console.log(`API Request: ${endpoint}`, params)

    await new Promise(resolve => setTimeout(resolve, 500))
    if (endpoint === '/everything' && params.q) {
      return this.searchMockArticles(params.q)
    }

    return {
      articles: this.getMockArticles(),
      totalResults: this.getMockArticles().length,
      status: 'ok'
    }
  }

  transformApiData(apiData) {
    if (!apiData.articles) {
      return {
        articles: [],
        totalResults: 0,
        status: 'error'
      }
    }

    const transformedArticles = apiData.articles.map((article, index) => ({
      id: index + 1,
      title: article.title,
      description: article.description,
      content: article.content || article.description,
      image: article.urlToImage || 'https://via.placeholder.com/800x400?text=No+Image',
      category: this.mapSourceToCategory(article.source?.name),
      publishedAt: new Date(article.publishedAt),
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      author: {
        name: article.author || 'Неизвестный автор',
        role: 'Журналист',
        avatar: 'https://via.placeholder.com/100x100?text=Avatar'
      }
    }))

    return {
      articles: transformedArticles,
      totalResults: apiData.totalResults || transformedArticles.length,
      status: apiData.status || 'ok'
    }
  }

  mapSourceToCategory(sourceName) {
    const categoryMap = {
      'BBC': 'World',
      'CNN': 'World',
      'Reuters': 'World',
      'TechCrunch': 'Technology',
      'Wired': 'Technology',
      'The Verge': 'Technology',
      'ESPN': 'Sports',
      'BBC Sport': 'Sports',
      'Health.com': 'Health',
      'Medical News Today': 'Health'
    }

    return categoryMap[sourceName] || 'General'
  }

  searchMockArticles(query) {
    const articles = this.getMockArticles()
    const searchQuery = query.toLowerCase()

    const filteredArticles = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery) ||
      article.description.toLowerCase().includes(searchQuery) ||
      article.category.toLowerCase().includes(searchQuery)
    )

    return {
      articles: filteredArticles,
      totalResults: filteredArticles.length,
      status: 'ok'
    }
  }
}

const newsApiService = new NewsApiService()

export default newsApiService
