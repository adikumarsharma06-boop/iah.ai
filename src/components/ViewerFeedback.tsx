import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Quote, Star, User, Sparkles } from 'lucide-react';
import { supabaseClient } from '../lib/supabase';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

const staticTestimonials: Testimonial[] = [
  {
    name: "Rajesh Kumar",
    role: "Small Business Owner",
    content: "IAH.AI has completely changed how I manage my shop. The AI roadmap helped me identify growth areas I never considered. It's truly simple and powerful.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=rajesh"
  },
  {
    name: "Ananya Singh",
    role: "Tech Student",
    content: "As a beginner in AI, I found most platforms intimidating. IAH.AI's no-code approach is a breath of fresh air. I built my first AI tool in just 15 minutes!",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=ananya"
  },
  {
    name: "Vikram Mehta",
    role: "Digital Creator",
    content: "The mentorship connection is what sets IAH.AI apart. Combining AI precision with human wisdom is the future. Highly recommended for any ambitious creator.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=vikram"
  },
  {
    name: "Priya Sharma",
    role: "Entrepreneur",
    content: "The efficiency gains we've seen since integrating IAH.AI tools are incredible. Our decision-making process is now data-driven and much faster.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=priya"
  }
];

export const ViewerFeedback = () => {
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchPublicFeedback = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('feedback')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;

        if (data) {
          const mapped: Testimonial[] = data.map(item => ({
            name: item.user_name || "Anonymous User",
            role: item.type === 'suggestion' ? "Community Suggestion" : "User Report",
            content: item.message,
            rating: 5, // Default rating for feedback
            image: `https://i.pravatar.cc/150?u=${item.id}`
          }));
          setDynamicTestimonials(mapped);
        }
      } catch (err) {
        console.error("Error fetching public feedback:", err);
      }
    };

    fetchPublicFeedback();
  }, []);

  const allTestimonials = [...dynamicTestimonials, ...staticTestimonials].slice(0, 6);

  return (
    <section id="feedback" className="py-40 relative overflow-hidden section-visibility">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-orange/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-brand-orange mb-8"
          >
            <Star className="w-4 h-4 fill-brand-orange" />
            Viewer Feedback
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6"
          >
            What Our <span className="text-gradient italic">Community Says.</span>
          </motion.h2>
          <p className="text-white/40 text-xl max-w-2xl mx-auto font-light">
            Real stories from people who are building their future with IAH.AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {allTestimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-10 rounded-[40px] glass border border-white/5 hover:border-brand-orange/30 transition-all duration-700 hover:bg-white/[0.02] hover-3d preserve-3d"
            >
              <div className="absolute top-8 right-10 text-brand-orange/20 group-hover:text-brand-orange/40 transition-colors duration-500">
                <Quote className="w-12 h-12" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-orange text-brand-orange" />
                ))}
              </div>

              <p className="text-white/60 text-lg font-light leading-relaxed mb-10 relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white/20" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold tracking-tight">{testimonial.name}</h4>
                  <p className="text-white/30 text-sm font-medium">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
