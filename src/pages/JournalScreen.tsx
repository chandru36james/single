import React from 'react';
import { motion } from 'motion/react';
import { storage } from '../lib/storage';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

interface Post {
id: string;
title: string;
slug: string;
excerpt: string;
coverImage: string;
publishedAt: any;
}

const JournalScreen = () => {
const [articles, setArticles] = React.useState<Post[]>([]);
const [loading, setLoading] = React.useState(true);

React.useEffect(() => {
const fetchArticles = async () => {
try {
const posts = await storage.getPosts();
setArticles(posts.filter((p: any) => p.status === 'published'));
} catch (error) {
console.error("Error fetching articles:", error);
} finally {
setLoading(false);
}
};
fetchArticles();
}, []);

if (loading) {
return ( <div className="min-h-screen flex items-center justify-center"> <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-neutral-900"></div> </div>
);
}

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.6 }}
> <main className="pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-[1400px] w-full mx-auto overflow-x-hidden leading-[1.2]">


    {/* Header */}
    <header className="mb-12 md:mb-16 text-center">
      <ScrollReveal direction="up">
        <h1 className="font-headline italic text-4xl sm:text-6xl md:text-8xl tracking-tight leading-[0.9] mb-6 break-words">
          The Journal
        </h1>

        <p className="text-sm md:text-base text-on-surface/60 max-w-xl mx-auto leading-[1.5] break-words">
          Reflections on the craft, the light, and the stories behind the lens.
        </p>
      </ScrollReveal>
    </header>

    {/* Articles */}
    <section className="space-y-16 md:space-y-24">
      {articles.map((article, idx) => (
        <ScrollReveal
          key={article.id}
          direction={idx % 2 === 0 ? 'left' : 'right'}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center w-full"
        >

          {/* Image */}
          <div className={`md:col-span-7 w-full ${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
            <Link to={`/journal/${article.slug}`}>
              <div className="aspect-[16/9] w-full overflow-hidden bg-surface-container-low md:grayscale hover:grayscale-0 transition-all duration-500">
                <img 
                  src={article.coverImage || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4'}
                  alt={article.title}
                  className="w-full h-full object-cover block"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
          </div>

          {/* Content */}
          <div className={`md:col-span-5 w-full ${idx % 2 !== 0 ? 'md:order-1' : ''}`}>

            <span className="text-[10px] uppercase tracking-[0.25rem] text-primary mb-3 block leading-none">
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Recently'}
            </span>

            <Link to={`/journal/${article.slug}`}>
              <h2 className="text-2xl md:text-4xl leading-tight mb-3 md:mb-4 hover:text-primary transition-colors cursor-pointer break-words">
                {article.title}
              </h2>
            </Link>

            <p className="text-sm md:text-base text-on-surface/70 mb-5 md:mb-6 leading-[1.6] break-words">
              {article.excerpt}
            </p>

            <Link to={`/journal/${article.slug}`}>
              <button className="text-[10px] uppercase tracking-[0.2rem] border-b border-outline-variant hover:border-primary transition-all pb-1">
                Read Article
              </button>
            </Link>

          </div>
        </ScrollReveal>
      ))}

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-on-surface/40 italic text-xl">
            No journal entries yet. Check back soon.
          </p>
        </div>
      )}

    </section>

  </main>
</motion.div>
);
};

export default JournalScreen;
