import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { storage } from '../lib/storage';
import { Loader2, ArrowLeft } from 'lucide-react';

const ProjectDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        let foundProject = null;
        
        const data = await storage.getContent('portfolio');
        if (data) {
          foundProject = (data as any).projects?.find((p: any) => p.id === id);
        }

        // Fallback to default projects if not found in storage
        if (!foundProject) {
          const defaultProjects = [
            {
              id: '01',
              title: 'Ethereal Monolith',
              category: 'Modelling',
              year: '2024',
              image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
              span: 'col-span-12 md:col-span-8',
              aspect: 'aspect-[16/10]',
              location: 'Lake Como, Italy',
              detailTitle: 'Ethereal Weddings at Lake Como',
              detailDescription: 'A visual narrative of timeless elegance, captured through the lens of quiet intimacy.',
              quote: '"Light is the only curator we trust."',
              detailImages: [
                'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800'
              ]
            },
            {
              id: '02',
              title: 'The Gala',
              category: 'Wedding',
              year: '2024',
              image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
              span: 'col-span-12 md:col-span-4 mt-12 md:mt-24',
              aspect: 'aspect-[3/4]',
              location: 'Paris, France',
              detailTitle: 'The Gala Night',
              detailDescription: 'A night of celebration and joy, captured with an editorial flair.',
              quote: '"Moments that last a lifetime."',
              detailImages: [
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200'
              ]
            },
            {
              id: '03',
              title: 'Velvet Noir',
              category: 'Modelling',
              year: '2023',
              image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
              span: 'col-span-12 md:col-span-4',
              aspect: 'aspect-[3/4]',
              location: 'Milan, Italy',
              detailTitle: 'Velvet Noir Editorial',
              detailDescription: 'High-fashion editorial shoot exploring textures and shadows.',
              quote: '"Fashion is an expression of the soul."',
              detailImages: [
                'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200'
              ]
            },
            {
              id: '04',
              title: 'Ivory Silence',
              category: 'Wedding',
              year: '2023',
              image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
              span: 'col-span-12 md:col-span-8 md:-mt-24',
              aspect: 'aspect-[16/10]',
              location: 'Santorini, Greece',
              detailTitle: 'Ivory Silence in Santorini',
              detailDescription: 'A serene wedding shoot against the backdrop of the Aegean Sea.',
              quote: '"Silence speaks volumes."',
              detailImages: [
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200'
              ]
            }
          ];
          foundProject = defaultProjects.find((p: any) => p.id === id);
        }

        setProject(foundProject);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-neutral-900" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-surface gap-4">
        <h2 className="text-2xl font-headline italic text-on-surface">Project not found</h2>
        <button onClick={() => navigate('/gallery')} className="text-primary uppercase tracking-widest text-xs font-bold">Back to Gallery</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <main className="pt-24 md:pt-32 pb-24">
        <header className="px-6 md:px-12 mb-12 md:mb-24 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/gallery')}
            className="flex items-center gap-2 text-on-surface/40 hover:text-primary transition-colors mb-8 md:mb-12 uppercase tracking-[0.2em] text-[10px] font-bold"
          >
            <ArrowLeft size={14} /> Back to Archive
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <p className="font-label text-[10px] md:text-sm uppercase tracking-[0.2em] text-primary mb-4">Location: {project.location || 'Bespoke Studio'}</p>
              <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl italic leading-[1.1] text-on-surface mb-6 md:mb-8">
                {project.detailTitle || project.title}
              </h1>
            </div>
            <div className="md:w-1/3 border-l-2 border-primary/20 pl-6 md:pl-8 pb-2">
              <p className="font-body text-base md:text-lg leading-relaxed text-on-surface/80 font-light">
                {project.detailDescription || 'A visual narrative of timeless elegance, captured through the lens of quiet intimacy.'}
              </p>
            </div>
          </div>
        </header>
        <section className="space-y-16 md:space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-12">
            <div className="md:col-start-2 md:col-span-10">
              <img 
                className="w-full aspect-[4/5] md:aspect-[21/9] object-cover md:grayscale-[20%]" 
                src={project.image} 
                alt={project.title}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          {project.quote && (
            <div className="max-w-4xl mx-auto px-6 text-center py-8 md:py-12">
              <h2 className="font-headline text-3xl md:text-6xl italic text-on-surface/90 leading-tight">
                {project.quote}
              </h2>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-12">
            {project.detailImages && project.detailImages.some((img: string) => img) ? (
              project.detailImages.map((img: string, idx: number) => (
                img && (
                  <div key={idx} className={`${idx === 0 ? 'md:col-start-1 md:col-span-5' : 'md:col-start-7 md:col-span-6'}`}>
                    <img 
                      className={`w-full ${idx === 0 ? 'aspect-[4/5]' : 'aspect-square'} object-cover`} 
                      src={img} 
                      alt={`${project.title} detail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )
              ))
            ) : (
              <div className="md:col-start-1 md:col-span-5">
                <img 
                  className="w-full aspect-[4/5] object-cover" 
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default ProjectDetailScreen;
