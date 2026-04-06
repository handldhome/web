'use client';
import { useEffect, useRef } from 'react';

export default function YelpBadge() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Avoid duplicate script injection
    const existingScript = document.getElementById('yelp-biz-badge-script-rrc-sJRgZtSuGs-Wzyqv7_4F4A');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'yelp-biz-badge-script-rrc-sJRgZtSuGs-Wzyqv7_4F4A';
    script.src = '//yelp.com/biz_badge_js/en_US/rrc/sJRgZtSuGs-Wzyqv7_4F4A.js';
    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div id="yelp-biz-badge-rrc-sJRgZtSuGs-Wzyqv7_4F4A">
        <a
          href="http://yelp.com/biz/handld-home-services-pasadena?utm_medium=badge_star_rating_reviews&utm_source=biz_review_badge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out Handld Home Services on Yelp
        </a>
      </div>
    </div>
  );
}
