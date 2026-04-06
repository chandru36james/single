import React from 'react';
import { storage } from '../../lib/storage';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Database, 
  Loader2, 
  Trash2, 
  MessageSquare, 
  Briefcase, 
  Plus, 
  Settings as SettingsIcon, 
  Layout, 
  ExternalLink,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/utils';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    pages: 0,
    posts: 0,
    leads: 0,
    brochures: 0
  });
  const [recentLeads, setRecentLeads] = React.useState<any[]>([]);
  const [recentBrochures, setRecentBrochures] = React.useState<any[]>([]);
  const [recentPosts, setRecentPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [seeding, setSeeding] = React.useState(false);
  const [cleaning, setCleaning] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

  const fetchDashboardData = async () => {
    console.log("Dashboard: Starting data fetch...");
    setLoading(true);
    
    const fetchWithTimeout = async (promise: Promise<any>, name: string) => {
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`${name} fetch timeout`)), 15000)
      );
      try {
        const result = await Promise.race([promise, timeout]);
        console.log(`Dashboard: ${name} fetch success`, result?.length || 0);
        return result || [];
      } catch (err) {
        console.warn(`Dashboard: ${name} fetch failed or timed out:`, err);
        toast.error(`Failed to load ${name}. It might be a connection or permission issue.`);
        return [];
      }
    };

    try {
      const [pages, posts, leads, brochures] = await Promise.all([
        fetchWithTimeout(storage.getPages(), "Pages"),
        fetchWithTimeout(storage.getPosts(), "Posts"),
        fetchWithTimeout(storage.getLeads(), "Leads"),
        fetchWithTimeout(storage.getBrochures(), "Brochures")
      ]);

      const counts = {
        pages: pages.length,
        posts: posts.length,
        leads: leads.length,
        brochures: brochures.length
      };

      setStats(counts);
      setRecentLeads(leads.slice(0, 5));
      setRecentBrochures(brochures.slice(0, 5));
      setRecentPosts(posts.slice(0, 5));

      console.log("Dashboard: Data fetch completed", counts);
      return counts;
    } catch (err) {
      console.error('Dashboard: Critical error in fetchDashboardData:', err);
      toast.error('Failed to load dashboard data. Please check your connection.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const checkAndSeed = async () => {
      const counts = await fetchDashboardData();
      // If everything is empty, auto-seed
      if (counts && counts.pages === 0 && counts.posts === 0 && counts.leads === 0 && counts.brochures === 0) {
        console.log('Empty dashboard detected, auto-seeding...');
        await seedData();
      }
    };
    checkAndSeed();
  }, []);

  const cleanupDuplicates = async () => {
    if (!window.confirm('This will delete all duplicate journal entries and pages, keeping only the oldest version of each slug. Proceed?')) return;
    setCleaning(true);
    try {
      const [posts, pages] = await Promise.all([
        storage.getPosts(),
        storage.getPages()
      ]);

      const sortedPosts = [...(posts as any[])].sort((a, b) => {
        const aTime = a.createdAt?.seconds || new Date(a.createdAt).getTime() || 0;
        const bTime = b.createdAt?.seconds || new Date(b.createdAt).getTime() || 0;
        return aTime - bTime;
      });

      const uniquePosts: Record<string, any> = {};
      let postDeleted = 0;
      for (const p of sortedPosts) {
        if (!uniquePosts[p.slug]) {
          uniquePosts[p.slug] = p;
        } else {
          await storage.deletePost(p.id);
          postDeleted++;
        }
      }
      
      const sortedPages = [...(pages as any[])].sort((a, b) => {
        const aTime = a.createdAt?.seconds || new Date(a.createdAt).getTime() || 0;
        const bTime = b.createdAt?.seconds || new Date(b.createdAt).getTime() || 0;
        return aTime - bTime;
      });

      const uniquePages: Record<string, any> = {};
      let pageDeleted = 0;
      for (const p of sortedPages) {
        if (!uniquePages[p.slug]) {
          uniquePages[p.slug] = p;
        } else {
          await storage.deletePage(p.id);
          pageDeleted++;
        }
      }

      toast.success(`Cleanup complete! Removed ${postDeleted} duplicate posts and ${pageDeleted} duplicate pages.`);
      await fetchDashboardData();
    } catch (err) {
      console.error('Cleanup error:', err);
      toast.error('Failed to cleanup duplicates');
    } finally {
      setCleaning(false);
    }
  };

  const seedData = async () => {
    setSeeding(true);
    try {
      const [leads, pages, posts] = await Promise.all([
        storage.getLeads(),
        storage.getPages(),
        storage.getPosts()
      ]);

      if (leads.some((l: any) => l.email === 'john@example.com')) {
        toast.error('Sample data already exists');
        return;
      }

      if (pages.some((p: any) => p.slug === 'about')) {
        toast.error('Sample pages already exist');
        return;
      }

      // Sample Journal Entries
      const samplePosts = [
        {
          title: "Minimalist Photography Techniques for High-Impact Visuals",
          slug: "minimalist-photography-techniques",
          excerpt: "Discover how to use negative space and simple compositions to create powerful, high-impact minimalist photography.",
          content: `
            <h2>The Power of Less</h2>
            <p>In a world saturated with visual noise, minimalism stands out by saying more with less. Minimalist photography isn't just about empty space; it's about intentionality.</p>
            <h3>1. Embrace Negative Space</h3>
            <p>Negative space is the area surrounding the main subject. By giving your subject room to breathe, you draw the viewer's eye directly to what matters most.</p>
            <h3>2. Focus on Geometry</h3>
            <p>Lines, circles, and triangles provide a strong structural foundation for minimalist shots. Look for architectural details or natural patterns.</p>
            <p><strong>SEO Tip:</strong> Use descriptive alt text for your minimalist images to rank for specific aesthetic keywords.</p>
          `,
          coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200",
          status: "published",
          seo: {
            title: "Minimalist Photography Guide | High-Impact Visuals",
            description: "Learn professional minimalist photography techniques using negative space and geometric composition.",
            keywords: "minimalist photography, negative space, photography composition, visual storytelling"
          }
        },
        {
          title: "Mastering Natural Light: The Ultimate Guide for Professional Results",
          slug: "mastering-natural-light-guide",
          excerpt: "Learn the secrets of using natural light to enhance your photography, from golden hour tips to indoor lighting techniques.",
          content: `
            <h2>Chasing the Sun</h2>
            <p>Light is the most critical element in photography. While studio lights offer control, natural light offers a soul and texture that is hard to replicate.</p>
            <h3>The Golden Hour</h3>
            <p>Occurring shortly after sunrise and before sunset, the golden hour provides a warm, soft glow that eliminates harsh shadows.</p>
            <h3>Window Light Mastery</h3>
            <p>Windows act as natural softboxes. Position your subject at a 45-degree angle to the window for classic, flattering Rembrandt lighting.</p>
          `,
          coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
          status: "published",
          seo: {
            title: "Natural Light Photography Guide | Professional Results",
            description: "Master natural light photography with our comprehensive guide on golden hour and indoor lighting.",
            keywords: "natural light photography, golden hour, lighting techniques, professional photography"
          }
        }
      ];

      // Sample Pages
      const samplePages = [
        {
          title: "Our Philosophy",
          slug: "philosophy",
          content: `
            <h1>Our Philosophy</h1>
            <p>At Singleframe, we believe that every image should tell a story that resonates. Our approach is rooted in the intersection of art and commerce.</p>
            <h2>Cinematic Realism</h2>
            <p>We strive for a look that is both grounded in reality and elevated by cinematic techniques.</p>
          `,
          seo: {
            title: "Our Philosophy | Singleframe Visual Studio",
            description: "Learn about the artistic philosophy and cinematic approach of Singleframe studio.",
            keywords: "photography philosophy, visual studio, cinematic realism"
          }
        },
        {
          title: "About Us",
          slug: "about",
          content: `
            <h1>About Us</h1>
            <p>Singleframe is a boutique visual studio dedicated to the art of cinematic storytelling.</p>
          `,
          seo: {
            title: "About Us | Singleframe Visual Studio",
            description: "Learn about the team and mission of Singleframe visual studio.",
            keywords: "about us, photography studio, team"
          }
        }
      ];

      // Site Content (Home, Services, Contact)
      const siteContent = {
        home: {
          slides: [
            {
              id: 1,
              title: "Singleframe",
              subtitle: "— a boutique visual studio.",
              description: "We craft high-impact visual narratives for brands that refuse to blend in with unfiltered creativity and cinematic precision.",
              image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1920",
              cta: "Explore Archive"
            },
            {
              id: 2,
              title: "Editorial Excellence",
              subtitle: "— capturing the unseen.",
              description: "High-concept visual storytelling for designers and publications that demand a distinct, avant-garde signature.",
              image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1920",
              cta: "View Campaigns"
            },
            {
              id: 3,
              title: "Timeless Unions",
              subtitle: "— documenting legacies.",
              description: "Bespoke wedding photography that captures the architectural beauty and intimate chemistry of your special day.",
              image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920",
              cta: "Explore Weddings"
            }
          ],
          featuredWorks: [
            {
              title: "The Ethereal Collection",
              tag: "Personal Series • 2024",
              img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
            }
          ],
          testimonials: [
            {
              quote: "The Obsidian team captured the soul of our Chennai wedding perfectly. Their editorial eye is unmatched in South India.",
              author: "Ananya Iyer"
            }
          ]
        },
        services: {
          hero: {
            title: "Artistry in <span className=\"text-primary\">Focus.</span>",
            description: "Beyond photography, we craft visual legacies in Chennai. The Obsidian provides a bespoke editorial approach to every frame, ensuring your narrative is preserved with cinematic gravity across Tamil Nadu."
          },
          sections: [
            {
              id: '01',
              title: "Couture Weddings",
              description: "Documenting the quiet, profound moments of union in Tamil Nadu with an editorial lens that transcends traditional wedding photography.",
              image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
              cta: "Explore the Vows",
              atmosphere: "We focus on the architectural beauty of the venue and the intimate chemistry of the couple, creating a portfolio that looks like a high-end monograph.",
              inclusions: "Full-day coverage, analog film highlights, and a hand-bound heirloom archive album."
            }
          ]
        },
        contact: {
          title: "Let's capture <br /> the <span className=\"text-primary\">unseen</span>.",
          description: "The Obsidian is a boutique studio specializing in high-contrast editorial photography.",
          address: "Chennai 600017",
          whatsapp: "https://wa.me/yournumber"
        }
      };

      // Add Site Content
      for (const [id, data] of Object.entries(siteContent)) {
        await storage.saveContent(id, data);
      }

      // Add Posts
      const existingPosts = await storage.getPosts();
      let postsAdded = 0;
      for (const post of samplePosts) {
        if (!existingPosts.some((p: any) => p.slug === post.slug)) {
          await storage.savePost(null, post);
          postsAdded++;
        }
      }

      // Add Pages
      const existingPages = await storage.getPages();
      let pagesAdded = 0;
      for (const page of samplePages) {
        if (!existingPages.some((p: any) => p.slug === page.slug)) {
          await storage.savePage(null, page);
          pagesAdded++;
        }
      }

      if (postsAdded > 0 || pagesAdded > 0) {
        toast.success(`Sample content seeded successfully! Added ${postsAdded} posts and ${pagesAdded} pages.`);
      } else {
        toast.info('Sample content already exists. No new items added.');
      }
      await fetchDashboardData();
    } catch (err) {
      console.error('Seeding error:', err);
      toast.error('Failed to seed sample content');
    } finally {
      setSeeding(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const data = await storage.getAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `obsidian_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data.');
    } finally {
      setExporting(false);
    }
  };

  const statCards = [
    { name: 'Total Leads', value: stats.leads, icon: MessageSquare, color: 'bg-blue-500', path: '/admin/leads' },
    { name: 'Brochures', value: stats.brochures, icon: Briefcase, color: 'bg-indigo-500', path: '/admin/brochures' },
    { name: 'Journal Entries', value: stats.posts, icon: FileText, color: 'bg-green-500', path: '/admin/posts' },
    { name: 'Static Pages', value: stats.pages, icon: Layout, color: 'bg-amber-500', path: '/admin/pages' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold italic serif text-neutral-900">Dashboard Overview</h1>
          <p className="text-neutral-500 mt-1">Welcome back. Here's what's happening with your site.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-bold bg-neutral-100 text-neutral-600 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-all disabled:opacity-50"
          >
            <Loader2 size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button 
            onClick={handleExportData}
            disabled={exporting}
            className="flex items-center gap-2 text-xs font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-all disabled:opacity-50 border border-primary/10"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {exporting ? 'Exporting...' : 'Export All Data'}
          </button>
          <button 
            onClick={cleanupDuplicates}
            disabled={cleaning}
            className="flex items-center gap-2 text-xs font-bold bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all disabled:opacity-50 border border-red-100"
          >
            {cleaning ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {cleaning ? 'Cleaning...' : 'Cleanup Duplicates'}
          </button>
          <button 
            onClick={seedData}
            disabled={seeding}
            className="flex items-center gap-2 text-xs font-bold bg-neutral-100 text-neutral-600 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-all disabled:opacity-50"
          >
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
            {seeding ? 'Seeding...' : 'Seed Content'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <button 
            key={stat.name} 
            onClick={() => navigate(stat.path)}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
            <p className="text-3xl font-bold text-neutral-900 mt-1">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Leads</h2>
            <button 
              onClick={() => navigate('/admin/leads')}
              className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{lead.mobile}</p>
                      <p className="text-xs text-neutral-500">{lead.projectType} • {lead.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-neutral-400">
                      {formatDate(lead.createdAt, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-400">
                <p className="text-sm italic">No recent leads found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => navigate('/admin/site-editor')}
              className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                <Layout size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Edit Site Content</p>
                <p className="text-xs text-neutral-500">Update pages & sections</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/posts')}
              className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                <Plus size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">New Journal Entry</p>
                <p className="text-xs text-neutral-500">Write a new blog post</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/brochures')}
              className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Generate Brochure</p>
                <p className="text-xs text-neutral-500">Create client proposal</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-neutral-50 text-neutral-600 group-hover:bg-neutral-100 transition-colors">
                <SettingsIcon size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Site Settings</p>
                <p className="text-xs text-neutral-500">Update SEO & metadata</p>
              </div>
            </button>
            <a 
              href="/" 
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-left group mt-2"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <ExternalLink size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">View Live Site</p>
                <p className="text-xs text-neutral-500">Open in new tab</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Brochures */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Brochures</h2>
            <button 
              onClick={() => navigate('/admin/brochures')}
              className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBrochures.length > 0 ? (
              recentBrochures.map((brochure) => (
                <div key={brochure.id} className="p-5 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <Briefcase size={18} className="text-indigo-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {formatDate(brochure.createdAt, 'MMM d')}
                    </span>
                  </div>
                  <h3 className="font-bold text-neutral-900 truncate">{brochure.clientName}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{brochure.eventType} • {brochure.location}</p>
                  <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-primary">₹{brochure.totalPrice?.toLocaleString()}</span>
                    <button 
                      onClick={() => navigate(`/admin/brochures?id=${brochure.id}`)}
                      className="text-[10px] font-bold uppercase tracking-tighter text-neutral-400 hover:text-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-neutral-400">
                <p className="text-sm italic">No recent brochures found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Journal Entries */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Journal</h2>
            <button 
              onClick={() => navigate('/admin/posts')}
              className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-neutral-900 truncate">{post.title}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDate(post.updatedAt || post.createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-400">
                <p className="text-sm italic">No recent posts found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
