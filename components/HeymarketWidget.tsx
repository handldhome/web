'use client';

import { useEffect } from 'react';

export default function HeymarketWidget() {
  useEffect(() => {
    // Create and inject the script
    const script = document.createElement('script');
    script.src = 'https://widget.heymarket.com/heymk-widget.bundle.js';
    script.async = true;
    script.onload = () => {
      // @ts-expect-error - HeymarketWidget is loaded by the external script
      if (window.HeymarketWidget) {
        // @ts-expect-error - HeymarketWidget is loaded by the external script
        window.HeymarketWidget.construct({
          CLIENT_ID: '1S6UdeduTkwjM0fVSKY3C1IuH-LvN4lBQ237lGPj',
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
