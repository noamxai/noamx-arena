/**
 * SEO utilities for NoamX Arena
 * 
 * This file contains utilities for optimizing the website for search engines,
 * including metadata generation, structured data, and SEO-friendly URLs.
 */

import { Metadata } from 'next';

// Base website information
const siteConfig = {
  name: 'NoamX Arena',
  description: 'Advanced AI Model testing platform with live comparison, multiple model selection, and custom prompts.',
  url: 'https://noamx-arena.com',
  ogImage: 'https://noamx-arena.com/og-image.jpg',
  twitter: {
    handle: '@noamxarena',
    cardType: 'summary_large_image',
  },
};

/**
 * Generate metadata for a page
 */
export function generateMetadata({
  title,
  description,
  path,
  openGraph,
  twitter,
  keywords,
}: {
  title?: string;
  description?: string;
  path?: string;
  openGraph?: {
    title?: string;
    description?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  twitter?: {
    title?: string;
    description?: string;
  };
  keywords?: string[];
}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullDescription = description || siteConfig.description;
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;
  
  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords || [
      'AI',
      'artificial intelligence',
      'language models',
      'AI testing',
      'model comparison',
      'prompt engineering',
      'NoamX',
      'GPT',
      'Claude',
      'Gemini',
      'Llama',
    ],
    authors: [{ name: 'NoamX Team' }],
    creator: 'NoamX Team',
    publisher: 'NoamX Arena',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: openGraph?.type || 'website',
      locale: 'en_US',
      url,
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || fullDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      ...(openGraph?.publishedTime && {
        publishedTime: openGraph.publishedTime,
      }),
      ...(openGraph?.authors && {
        authors: openGraph.authors,
      }),
      ...(openGraph?.tags && {
        tags: openGraph.tags,
      }),
    },
    twitter: {
      card: siteConfig.twitter.cardType,
      title: twitter?.title || fullTitle,
      description: twitter?.description || fullDescription,
      creator: siteConfig.twitter.handle,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(siteConfig.url),
  };
}

/**
 * Generate JSON-LD structured data for a page
 */
export function generateStructuredData({
  type,
  data,
}: {
  type: 'WebSite' | 'WebPage' | 'Organization' | 'Person' | 'Article' | 'FAQPage' | 'Product';
  data: Record<string, any>;
}): string {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };
  
  const structuredData = {
    ...baseData,
    ...data,
  };
  
  return JSON.stringify(structuredData);
}

/**
 * Generate common structured data objects
 */
export const structuredData = {
  /**
   * Generate website structured data
   */
  website(): string {
    return generateStructuredData({
      type: 'WebSite',
      data: {
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    });
  },
  
  /**
   * Generate organization structured data
   */
  organization(): string {
    return generateStructuredData({
      type: 'Organization',
      data: {
        name: 'NoamX',
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        sameAs: [
          'https://twitter.com/noamxarena',
          'https://github.com/noamx',
          'https://linkedin.com/company/noamx',
        ],
      },
    });
  },
  
  /**
   * Generate article structured data
   */
  article({
    title,
    description,
    publishedTime,
    modifiedTime,
    authors,
    tags,
    image,
    url,
  }: {
    title: string;
    description: string;
    publishedTime: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
    image?: string;
    url: string;
  }): string {
    return generateStructuredData({
      type: 'Article',
      data: {
        headline: title,
        description,
        image: image || siteConfig.ogImage,
        datePublished: publishedTime,
        ...(modifiedTime && { dateModified: modifiedTime }),
        author: authors?.map(author => ({
          '@type': 'Person',
          name: author,
        })) || [{ '@type': 'Person', name: 'NoamX Team' }],
        publisher: {
          '@type': 'Organization',
          name: 'NoamX',
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        ...(tags && { keywords: tags.join(', ') }),
      },
    });
  },
  
  /**
   * Generate FAQ structured data
   */
  faq(items: { question: string; answer: string }[]): string {
    return generateStructuredData({
      type: 'FAQPage',
      data: {
        mainEntity: items.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    });
  },
  
  /**
   * Generate product structured data
   */
  product({
    name,
    description,
    image,
    price,
    currency,
    availability,
    url,
    brand,
    reviews,
    aggregateRating,
  }: {
    name: string;
    description: string;
    image: string;
    price?: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    url: string;
    brand?: string;
    reviews?: { author: string; rating: number; text: string }[];
    aggregateRating?: { ratingValue: number; reviewCount: number };
  }): string {
    return generateStructuredData({
      type: 'Product',
      data: {
        name,
        description,
        image,
        ...(price && currency && {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: currency,
            ...(availability && { availability: `https://schema.org/${availability}` }),
            url,
          },
        }),
        ...(brand && {
          brand: {
            '@type': 'Brand',
            name: brand,
          },
        }),
        ...(reviews && {
          review: reviews.map(review => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: review.author,
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review.rating,
            },
            reviewBody: review.text,
          })),
        }),
        ...(aggregateRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
          },
        }),
      },
    });
  },
};

/**
 * Generate SEO-friendly URL slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Generate breadcrumbs data
 */
export function generateBreadcrumbs(items: { name: string; url: string }[]): {
  structuredData: string;
  links: { name: string; url: string }[];
} {
  const structuredData = generateStructuredData({
    type: 'WebPage',
    data: {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    },
  });
  
  return {
    structuredData,
    links: items,
  };
}
