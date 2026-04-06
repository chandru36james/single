import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '../lib/storage';
import { SEO } from '../components/SEO';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export const DynamicPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const posts = await storage.getPosts();
        const foundPost = posts.find((p: any) => p.slug === slug && p.status === 'published');
        if (foundPost) {
          setPost(foundPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neutral-900"></div></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold italic serif">Post Not Found</div>;

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 max-w-4xl mx-auto font-sans">
      <SEO 
        title={post.seo?.title || post.title}
        description={post.seo?.description || post.excerpt}
        keywords={post.seo?.keywords}
        image={post.coverImage}
        type="article"
      />
      
      <Link to="/journal" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-6 md:mb-8 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Journal</span>
      </Link>

      {post.coverImage && (
        <div className="aspect-[16/9] md:aspect-[21/9] w-full mb-8 md:mb-12 rounded-2xl overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-neutral-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={14} />
          <span>Editorial Team</span>
        </div>
      </div>

      <h1 className="text-4xl sm:text-6xl font-bold italic serif mb-8 md:mb-12 text-neutral-900 leading-tight">{post.title}</h1>
      
      <div 
        className="prose prose-neutral max-w-none prose-headings:serif prose-headings:italic prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};
