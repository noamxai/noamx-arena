/**
 * Unit tests for SEO utilities
 */

import { describe, it, expect } from 'vitest';
import { 
  generateMetadata,
  generateStructuredData,
  structuredData,
  generateSlug,
  generateBreadcrumbs
} from '@/app/utils/seo';

describe('SEO Utilities', () => {
  describe('generateMetadata', () => {
    it('should generate basic metadata with default values', () => {
      const metadata = generateMetadata({});
      
      expect(metadata.title).toBe('NoamX Arena');
      expect(metadata.description).toBeDefined();
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.twitter).toBeDefined();
    });

    it('should include custom title and description', () => {
      const metadata = generateMetadata({
        title: 'Custom Page',
        description: 'Custom description for testing'
      });
      
      expect(metadata.title).toBe('Custom Page | NoamX Arena');
      expect(metadata.description).toBe('Custom description for testing');
      expect(metadata.openGraph?.title).toBe('Custom Page | NoamX Arena');
      expect(metadata.openGraph?.description).toBe('Custom description for testing');
    });

    it('should include custom path in URLs', () => {
      const metadata = generateMetadata({
        path: '/test-page'
      });
      
      expect(metadata.openGraph?.url).toContain('/test-page');
      expect(metadata.alternates?.canonical).toContain('/test-page');
    });

    it('should include custom OpenGraph properties', () => {
      const metadata = generateMetadata({
        openGraph: {
          type: 'article',
          publishedTime: '2025-03-13T14:00:00Z',
          authors: ['Test Author'],
          tags: ['test', 'seo']
        }
      });
      
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe('2025-03-13T14:00:00Z');
      expect(metadata.openGraph?.authors).toContain('Test Author');
      expect(metadata.openGraph?.tags).toContain('test');
    });
  });

  describe('generateStructuredData', () => {
    it('should generate valid structured data JSON', () => {
      const data = generateStructuredData({
        type: 'WebSite',
        data: {
          name: 'Test Website',
          url: 'https://example.com'
        }
      });
      
      const parsed = JSON.parse(data);
      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('WebSite');
      expect(parsed.name).toBe('Test Website');
      expect(parsed.url).toBe('https://example.com');
    });
  });

  describe('structuredData utilities', () => {
    it('should generate website structured data', () => {
      const data = structuredData.website();
      const parsed = JSON.parse(data);
      
      expect(parsed['@type']).toBe('WebSite');
      expect(parsed.name).toBe('NoamX Arena');
      expect(parsed.potentialAction).toBeDefined();
      expect(parsed.potentialAction['@type']).toBe('SearchAction');
    });

    it('should generate organization structured data', () => {
      const data = structuredData.organization();
      const parsed = JSON.parse(data);
      
      expect(parsed['@type']).toBe('Organization');
      expect(parsed.name).toBe('NoamX');
      expect(parsed.logo).toBeDefined();
      expect(parsed.sameAs).toBeInstanceOf(Array);
    });

    it('should generate article structured data', () => {
      const data = structuredData.article({
        title: 'Test Article',
        description: 'Test Description',
        publishedTime: '2025-03-13T14:00:00Z',
        url: 'https://example.com/article'
      });
      const parsed = JSON.parse(data);
      
      expect(parsed['@type']).toBe('Article');
      expect(parsed.headline).toBe('Test Article');
      expect(parsed.description).toBe('Test Description');
      expect(parsed.datePublished).toBe('2025-03-13T14:00:00Z');
      expect(parsed.author).toBeInstanceOf(Array);
      expect(parsed.publisher).toBeDefined();
      expect(parsed.publisher['@type']).toBe('Organization');
    });

    it('should generate FAQ structured data', () => {
      const items = [
        { question: 'Question 1', answer: 'Answer 1' },
        { question: 'Question 2', answer: 'Answer 2' }
      ];
      
      const data = structuredData.faq(items);
      const parsed = JSON.parse(data);
      
      expect(parsed['@type']).toBe('FAQPage');
      expect(parsed.mainEntity).toBeInstanceOf(Array);
      expect(parsed.mainEntity.length).toBe(2);
      expect(parsed.mainEntity[0]['@type']).toBe('Question');
      expect(parsed.mainEntity[0].name).toBe('Question 1');
      expect(parsed.mainEntity[0].acceptedAnswer.text).toBe('Answer 1');
    });

    it('should generate product structured data', () => {
      const data = structuredData.product({
        name: 'Test Product',
        description: 'Test Description',
        image: 'https://example.com/image.jpg',
        price: 99.99,
        currency: 'USD',
        availability: 'InStock',
        url: 'https://example.com/product',
        brand: 'Test Brand',
        aggregateRating: { ratingValue: 4.5, reviewCount: 100 }
      });
      const parsed = JSON.parse(data);
      
      expect(parsed['@type']).toBe('Product');
      expect(parsed.name).toBe('Test Product');
      expect(parsed.description).toBe('Test Description');
      expect(parsed.image).toBe('https://example.com/image.jpg');
      expect(parsed.offers).toBeDefined();
      expect(parsed.offers.price).toBe(99.99);
      expect(parsed.brand.name).toBe('Test Brand');
      expect(parsed.aggregateRating.ratingValue).toBe(4.5);
    });
  });

  describe('generateSlug', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Test & Example')).toBe('test-and-example');
      expect(generateSlug('Special Characters !@#$%^')).toBe('special-characters');
      expect(generateSlug('  Trim  Spaces  ')).toBe('trim-spaces');
      expect(generateSlug('Multiple--Dashes')).toBe('multiple-dashes');
    });
  });

  describe('generateBreadcrumbs', () => {
    it('should generate breadcrumbs data and structured data', () => {
      const items = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Category', url: 'https://example.com/category' },
        { name: 'Product', url: 'https://example.com/category/product' }
      ];
      
      const result = generateBreadcrumbs(items);
      
      expect(result.links).toEqual(items);
      expect(result.structuredData).toBeDefined();
      
      const parsed = JSON.parse(result.structuredData);
      expect(parsed.breadcrumb).toBeDefined();
      expect(parsed.breadcrumb['@type']).toBe('BreadcrumbList');
      expect(parsed.breadcrumb.itemListElement.length).toBe(3);
      expect(parsed.breadcrumb.itemListElement[0].position).toBe(1);
      expect(parsed.breadcrumb.itemListElement[0].name).toBe('Home');
    });
  });
});
