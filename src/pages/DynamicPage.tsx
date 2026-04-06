import React from 'react';
import { useParams } from 'react-router-dom';
import { storage } from '../lib/storage';
import { SEO } from '../components/SEO';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      
      try {
        const pages = await storage.getPages();
        const foundPage = pages.find((p: any) => p.slug === slug);
        if (foundPage) {
          setPage(foundPage);
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neutral-900"></div></div>;
  if (!page) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold italic serif">Page Not Found</div>;

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 max-w-4xl mx-auto font-sans">
      <SEO 
        title={page.seo?.title || page.title}
        description={page.seo?.description}
        keywords={page.seo?.keywords}
      />
      <h1 className="text-4xl sm:text-6xl font-bold italic serif mb-8 md:mb-12 text-neutral-900 leading-tight">{page.title}</h1>
      <div 
        className="prose prose-neutral max-w-none prose-headings:serif prose-headings:italic prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
};
