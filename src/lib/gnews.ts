export type GNewsArticle = {
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  image: string | null;
  publishedAt: string;
  lang?: string;
  source: {
    name: string;
    url: string;
  };
};

type GNewsResponse = {
  articles: GNewsArticle[];
};

export async function getLatestNews(): Promise<GNewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    q: '("solar energy" OR "battery storage" OR "power grid" OR inverter)',
    lang: "en",
    max: "10",
    sortby: "publishedAt",
    in: "title,description",
    nullable: "description,image",
    apikey: apiKey,
  });

  try {
    const response = await fetch(`https://gnews.io/api/v4/search?${params}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return [];

    const data = (await response.json()) as GNewsResponse;
    return Array.isArray(data.articles) ? data.articles : [];
  } catch {
    return [];
  }
}

export function articleSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

export async function getArticleBySlug(slug: string) {
  const articles = await getLatestNews();
  return articles.find((article) => articleSlug(article.title) === slug);
}

export function formatNewsDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Mới cập nhật";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "long",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}
