import { Metadata } from "next";
import { getNewsArticles } from "../../lib/newsData";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import NewsArticleContent from "../../components/NewsArticleContent";
import Link from "next/link";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getNewsArticles();
  const article = articles.find((a) => a.id === slug);


  if (!article) {
    return {
      title: "News Article Not Found | Chitra Viseshalu",
      description: "The requested movie news article was not found on Chitra Viseshalu.",
    };
  }

  return {
    title: `${article.title} | Chitra Viseshalu`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `https://chitraviseshalu.com/news/${article.id}`,
      type: "article",
      images: [{ url: article.image, alt: article.title }],
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const articles = await getNewsArticles();
  const article = articles.find((a) => a.id === slug);

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#111111] text-white px-6 py-20 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-extrabold">News Article Not Found</h1>
            <p className="text-zinc-400">The article you are trying to view does not exist or has been deleted.</p>
            <Link href="/news" className="inline-block bg-white hover:bg-zinc-200 text-[#111111] font-bold px-8 py-3.5 rounded-full transition">
              Back to News Hub
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Schema.org Structured Data for Rich Snippets
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary,
    "image": [article.image],
    "datePublished": article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "jobTitle": article.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Chitra Viseshalu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://chitraviseshalu.com/logo.png"
      }
    }
  };

  // Get other/related articles
  const relatedArticles = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Navbar />

      <main className="min-h-screen bg-[#111111] text-white px-4 md:px-6 pt-28 pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_350px] gap-10">
          {/* Main content column */}
          <section className="bg-[#1A1A1A] border border-zinc-800/30 p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <NewsArticleContent article={article} />
          </section>

          {/* Sidebar with related articles */}
          <aside className="space-y-8">
            <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 rounded-3xl space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <h3 className="text-xl font-bold text-white border-b border-zinc-800/60 pb-3">Related Stories</h3>
              {relatedArticles.length === 0 ? (
                <p className="text-zinc-500 text-sm">No related articles found.</p>
              ) : (
                <div className="space-y-5">
                  {relatedArticles.map((rel) => (
                    <Link key={rel.id} href={`/news/${rel.id}`} className="group block space-y-2">
                      <div className="relative h-36 rounded-xl overflow-hidden bg-[#111111]">
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute top-2 left-2 bg-[#111111]/80 px-2 py-0.5 rounded text-[10px] text-white uppercase font-bold border border-zinc-800/40">
                          {rel.category}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-zinc-350 group-hover:text-zinc-300 transition line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-zinc-500">{new Date(rel.publishedAt).toLocaleDateString()}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Box Office Summary Widget */}
            <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 rounded-3xl space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <h3 className="text-xl font-bold text-white">Weekly Box Office</h3>
              <p className="text-zinc-400 text-xs">Estimated Global Gross Collections</p>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm border-b border-zinc-800/40 pb-2">
                  <span className="font-semibold text-zinc-300">1. Pushpa 2: The Rule</span>
                  <span className="text-white font-bold">₹1,180 Cr</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-800/40 pb-2">
                  <span className="font-semibold text-zinc-300">2. Devara: Part 1</span>
                  <span className="text-zinc-400">₹425 Cr</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-zinc-300">3. Kalki 2898 AD</span>
                  <span className="text-zinc-400">₹1,050 Cr</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
