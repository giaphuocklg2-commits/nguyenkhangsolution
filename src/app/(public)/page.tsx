import { prisma } from "@/lib/prisma";
import { HomeHero } from "@/components/home/home-hero";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeFeatured } from "@/components/home/home-featured";
import { HomeServices } from "@/components/home/home-services";
import { HomeStats } from "@/components/home/home-stats";
import { HomeBanner } from "@/components/home/home-banner";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [categories, featuredProducts] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { categories, featuredProducts };
  } catch (error) {
    console.error("Home page DB fetch error:", error);
    return { categories: [], featuredProducts: [] };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts } = await getData();

  return (
    <div className="animate-fade-in">
      <HomeHero />
      <HomeStats />
      <HomeCategories categories={categories} />
      <HomeFeatured products={featuredProducts} />
      <HomeBanner />
      <HomeServices />
    </div>
  );
}
