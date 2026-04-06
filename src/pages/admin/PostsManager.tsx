import React from 'react';
import { storage } from '../../lib/storage';
import { Plus, Edit2, Trash2, X, Save, Globe, Search, Image as ImageIcon, Loader2, Copy } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import { quillModules, quillFormats } from '../../lib/editor';
import { toast } from 'sonner';
import { formatDate } from '../../lib/utils';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
}

interface PostData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  status: 'draft' | 'published';
  seo: SEOData;
  publishedAt: any;
  updatedAt: any;
  authorId: string;
}

export const PostsManager: React.FC = () => {
  const [posts, setPosts] = React.useState<PostData[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentPost, setCurrentPost] = React.useState<PostData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const duplicateSlugs = React.useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => {
      counts[p.slug] = (counts[p.slug] || 0) + 1;
    });
    return Object.keys(counts).filter(slug => counts[slug] > 1);
  }, [posts]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const allPosts = await storage.getPosts();
      setPosts(allPosts);
    } catch (err) {
      toast.error('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;
    
    setSaving(true);
    // Strip id from data before saving to avoid issues
    const { id, ...postDataWithoutId } = currentPost;
    
    // Check for duplicate slug
    const isDuplicateSlug = posts.some(p => p.slug === currentPost.slug && p.id !== id);
    if (isDuplicateSlug) {
      toast.error(`The slug "/journal/${currentPost.slug}" is already in use by another post.`);
      setSaving(false);
      return;
    }

    const data = {
      ...postDataWithoutId,
      authorId: 'admin'
    };

    try {
      await storage.savePost(id, data);
      toast.success(id ? 'Post updated successfully' : 'Post created successfully');
      setIsEditing(false);
      setCurrentPost(null);
      fetchPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save post');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await storage.deletePost(id);
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (err) {
      toast.error('Failed to delete post');
      console.error(err);
    }
  };

  const handleDuplicate = (post: PostData) => {
    const duplicatedPost: PostData = {
      ...post,
      id: undefined,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy`,
      status: 'draft',
      publishedAt: null,
      updatedAt: null,
    };
    setCurrentPost(duplicatedPost);
    setIsEditing(true);
    toast.info('Draft copy created. Review and save.');
  };

  const handleCleanupDuplicates = async () => {
    if (!window.confirm('This will delete all duplicate journal entries, keeping only the oldest version of each slug. Proceed?')) return;
    
    setLoading(true);
    try {
      const slugGroups: Record<string, PostData[]> = {};
      posts.forEach(p => {
        if (!slugGroups[p.slug]) slugGroups[p.slug] = [];
        slugGroups[p.slug].push(p);
      });

      let deletedCount = 0;
      for (const slug in slugGroups) {
        const group = slugGroups[slug];
        if (group.length > 1) {
          // Keep the first one, delete the rest
          const toDelete = group.slice(1);
          for (const p of toDelete) {
            if (p.id) {
              await storage.deletePost(p.id);
              deletedCount++;
            }
          }
        }
      }
      
      toast.success(`Cleanup complete. Removed ${deletedCount} duplicate entries.`);
      fetchPosts();
    } catch (err) {
      toast.error('Failed to cleanup duplicates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neutral-900"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold italic serif text-neutral-900">Journal Content</h1>
        <div className="flex gap-4">
          {duplicateSlugs.length > 0 && (
            <button 
              onClick={handleCleanupDuplicates}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-100 transition-all border border-red-100"
            >
              <Trash2 size={20} />
              Cleanup Duplicates
            </button>
          )}
          <button 
            onClick={() => {
              setCurrentPost({ 
                title: '', slug: '', content: '', excerpt: '', coverImage: '', 
                status: 'draft', seo: { title: '', description: '', keywords: '' }, 
                publishedAt: null, updatedAt: null, authorId: '' 
              });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-all"
          >
            <Plus size={20} />
            New Journal Entry
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">{currentPost?.id ? 'Edit Post' : 'New Post'}</h2>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-neutral-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">Post Title</label>
                <input 
                  type="text"
                  required
                  value={currentPost?.title}
                  onChange={e => setCurrentPost(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-neutral-900"
                  placeholder="The Future of Web Design"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">URL Slug</label>
                  <div className="flex items-center gap-2 text-neutral-500 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <Globe size={18} />
                    <span>/journal/</span>
                    <input 
                      type="text"
                      required
                      value={currentPost?.slug}
                      onChange={e => setCurrentPost(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                      className="bg-transparent outline-none flex-1 text-neutral-900"
                      placeholder="future-web-design"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">Cover Image URL</label>
                  <div className="flex items-center gap-2 text-neutral-500 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <ImageIcon size={18} />
                    <input 
                      type="text"
                      value={currentPost?.coverImage}
                      onChange={e => setCurrentPost(prev => prev ? ({ ...prev, coverImage: e.target.value }) : null)}
                      className="bg-transparent outline-none flex-1 text-neutral-900"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">Excerpt (Meta Summary)</label>
                <textarea 
                  rows={3}
                  value={currentPost?.excerpt}
                  onChange={e => setCurrentPost(prev => prev ? ({ ...prev, excerpt: e.target.value }) : null)}
                  className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm text-neutral-900"
                  placeholder="A short summary of the post for lists and search engines..."
                />
              </div>

              <div className="quill-editor-container">
                <label className="block text-sm font-bold text-neutral-700 mb-2 uppercase tracking-wider">Post Content</label>
                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                  <ReactQuill 
                    theme="snow"
                    value={currentPost?.content}
                    onChange={content => setCurrentPost(prev => prev ? ({ ...prev, content }) : null)}
                    modules={quillModules}
                    formats={quillFormats}
                    className="h-[500px] text-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                <div className="flex items-center gap-2 mb-6 text-neutral-900">
                  <Search size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-sm">SEO & Publishing</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Status</label>
                    <select 
                      value={currentPost?.status}
                      onChange={e => setCurrentPost(prev => prev ? ({ ...prev, status: e.target.value as 'draft' | 'published' }) : null)}
                      className="w-full p-3 rounded-lg border border-neutral-200 text-sm bg-white text-neutral-900"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-neutral-200">
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Meta Title</label>
                    <input 
                      type="text"
                      value={currentPost?.seo.title}
                      onChange={e => setCurrentPost(prev => prev ? ({ ...prev, seo: { ...prev.seo, title: e.target.value } }) : null)}
                      className="w-full p-3 rounded-lg border border-neutral-200 text-sm text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Meta Description</label>
                    <textarea 
                      rows={4}
                      value={currentPost?.seo.description}
                      onChange={e => setCurrentPost(prev => prev ? ({ ...prev, seo: { ...prev.seo, description: e.target.value } }) : null)}
                      className="w-full p-3 rounded-lg border border-neutral-200 text-sm text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Keywords</label>
                    <input 
                      type="text"
                      value={currentPost?.seo.keywords}
                      onChange={e => setCurrentPost(prev => prev ? ({ ...prev, seo: { ...prev.seo, keywords: e.target.value } }) : null)}
                      className="w-full p-3 rounded-lg border border-neutral-200 text-sm text-neutral-900"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white p-4 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="p-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Title</th>
                <th className="p-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</th>
                <th className="p-6 text-xs font-bold text-neutral-500 uppercase tracking-widest">Last Updated</th>
                <th className="p-6 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {duplicateSlugs.length > 0 && (
                <tr>
                  <td colSpan={4} className="p-4 bg-red-50 border-b border-red-100">
                    <p className="text-xs text-red-600 font-medium">
                      Warning: Multiple journal entries are using the same URL slugs: {duplicateSlugs.map(s => `/${s}`).join(', ')}
                    </p>
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr key={post.id} className={`hover:bg-neutral-50 transition-colors ${duplicateSlugs.includes(post.slug) ? 'bg-red-50/30' : ''}`}>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-neutral-900">{post.title}</p>
                      {duplicateSlugs.includes(post.slug) && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Duplicate Slug</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 font-mono">/journal/{post.slug}</p>
                  </td>
                  <td className="p-6">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-neutral-500">
                    {formatDate(post.updatedAt || post.createdAt)}
                  </td>
                  <td className="p-6 text-right space-x-2">
                    <button 
                      onClick={() => handleDuplicate(post)}
                      className="p-2 text-neutral-400 hover:text-blue-600 transition-colors"
                      title="Duplicate Post"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPost(post);
                        setIsEditing(true);
                      }}
                      className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => post.id && handleDelete(post.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-neutral-500">
                    No entries found. Create your first journal entry to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
