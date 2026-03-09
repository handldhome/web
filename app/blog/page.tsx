import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/blogPosts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Handld Home Services',
  description: 'Home maintenance tips, seasonal checklists, and expert advice for Pasadena and San Gabriel Valley homeowners.',
};

export default function BlogPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
        .font-display { font-family: 'Libre Baskerville', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        .shadow-retro { box-shadow: 8px 8px 0px rgba(42, 84, 161, 0.15); }
        .cta-button {
          background: linear-gradient(135deg, #2A54A1 0%, #1e3d7a 100%);
          box-shadow: 0 4px 15px rgba(42, 84, 161, 0.3);
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(42, 84, 161, 0.4);
        }
      `}</style>

      <div className="bg-[#FFFFF2] text-[#2A54A1] min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFF2] border-b-2 border-[#2A54A1]/20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Handld Home" width={160} height={80} className="h-12 md:h-20 w-auto" />
            </Link>
            <div className="hidden md:flex gap-8 items-center font-body font-medium">
              <Link href="/#services" className="text-[#2A54A1] hover:opacity-70 transition-opacity">Services</Link>
              <Link href="/#how-it-works" className="text-[#2A54A1] hover:opacity-70 transition-opacity">How It Works</Link>
              <Link href="/blog" className="text-[#2A54A1] hover:opacity-70 transition-opacity font-bold">Blog</Link>
              <Link href="/account" className="text-[#2A54A1] hover:opacity-70 transition-opacity">My Account</Link>
              <Link href="/?quote=true" className="cta-button text-white px-6 py-2.5 rounded-full font-semibold">Get Quote</Link>
            </div>
            <div className="flex md:hidden items-center gap-3">
              <Link href="/?quote=true" className="cta-button text-white px-4 py-2 rounded-full font-semibold text-sm font-body">Get Quote</Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="pt-28 md:pt-36 pb-12 md:pb-16 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#2A54A1]">
              The Handld Blog
            </h1>
            <p className="font-body text-lg md:text-xl text-[#2A54A1]/70 max-w-2xl mx-auto">
              Practical home maintenance advice for Pasadena and San Gabriel Valley homeowners. No fluff, just what you need to know.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="pb-16 md:pb-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-retro border-2 border-[#2A54A1]/10 hover:shadow-2xl hover:-translate-y-1 transition-all group"
                >
                  <div className="p-6 md:p-8">
                    <h2 className="font-display text-lg md:text-xl font-bold mb-3 text-[#2A54A1] group-hover:text-[#1e3d7a] transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="font-body text-sm text-[#2A54A1]/70 leading-relaxed mb-4">
                      {post.subtitle}
                    </p>
                    <span className="font-body text-sm font-semibold text-[#2A54A1] group-hover:underline">
                      Read more &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-[#2A54A1] text-[#FFFFF2]">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Ready to get ahead of maintenance?</h2>
            <p className="font-body text-lg md:text-xl mb-6 text-[#FFFFF2]/90">Get a custom quote in under a minute</p>
            <Link href="/?quote=true" className="inline-block bg-[#FFFFF2] text-[#2A54A1] px-10 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg font-body font-bold hover:bg-white transition-all transform hover:scale-105 shadow-lg">
              Get My Custom Quote
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1e3d7a] text-[#FFFFF2] py-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
              <div>
                <Image src="/logo.png" alt="Handld Home" width={120} height={48} className="h-10 md:h-12 w-auto mb-4" />
                <p className="font-body text-sm md:text-base text-[#FFFFF2]/80">Your trusted home maintenance partner</p>
              </div>
              <div>
                <h4 className="font-display font-bold mb-4 text-[#FFFFF2]">Contact</h4>
                <p className="font-body text-[#FFFFF2]/80">Concierge@HandldHome.com</p>
                <p className="font-body text-[#FFFFF2]/80">(626) 298-7128</p>
              </div>
              <div>
                <h4 className="font-display font-bold mb-4 text-[#FFFFF2]">Service Area</h4>
                <p className="font-body text-[#FFFFF2]/80">Los Angeles</p>
              </div>
            </div>
            <div className="border-t border-[#FFFFF2]/20 pt-6 text-center">
              <p className="font-body text-[#FFFFF2]/60 mb-2">&copy; 2024 Handld Home Services. All rights reserved.</p>
              <div className="flex justify-center gap-4">
                <Link href="/contact" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Contact Us</Link>
                <Link href="/terms" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Terms &amp; Conditions</Link>
                <Link href="/privacy" className="font-body text-[#FFFFF2]/80 hover:text-[#FFFFF2] transition-colors text-sm underline">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
