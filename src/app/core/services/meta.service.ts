import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@environments/environment';

/**
 * Meta Service for SEO
 *
 * Manages page title and meta tags for SEO optimization.
 * Essential for SSR applications.
 *
 * @example
 * ```typescript
 * metaService.setPageMeta({
 *   title: 'Dashboard',
 *   description: 'View your analytics dashboard',
 *   image: '/assets/dashboard-og.png',
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Set page metadata
   */
  setPageMeta(config: PageMetaConfig): void {
    const fullTitle = config.title
      ? `${config.title} | ${environment.seo.siteName}`
      : environment.seo.defaultTitle;
    this.title.setTitle(fullTitle);

    const description = config.description || environment.seo.defaultDescription;
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    } else {
      this.meta.updateTag({ property: 'og:image', content: environment.seo.defaultImage });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (config.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    }

    const robots = config.noIndex ? 'noindex,nofollow' : 'index,follow';
    this.meta.updateTag({ name: 'robots', content: robots });
  }

  /**
   * Add structured data (JSON-LD)
   */
  addStructuredData(data: Record<string, unknown>): void {
    if (!this.isBrowser) return;

    let script = document.querySelector('script[type="application/ld+json"]');

    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
  }

  /**
   * Set canonical URL
   */
  setCanonicalUrl(url: string): void {
    if (!this.isBrowser) return;

    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}

export interface PageMetaConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
}
