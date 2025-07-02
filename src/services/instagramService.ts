export interface InstagramPost {
  id: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption: string;
  timestamp: string;
  permalink: string;
}

export interface ParsedProductData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  hashtags: string[];
}

export class InstagramService {
  private static instance: InstagramService;
  private accessToken: string = '';
  private businessAccountId: string = '';

  private constructor() {}

  public static getInstance(): InstagramService {
    if (!InstagramService.instance) {
      InstagramService.instance = new InstagramService();
    }
    return InstagramService.instance;
  }

  // Set Instagram credentials
  public setCredentials(accessToken: string, businessAccountId: string) {
    this.accessToken = accessToken;
    this.businessAccountId = businessAccountId;
  }

  // Fetch recent Instagram posts
  public async fetchRecentPosts(limit: number = 10): Promise<InstagramPost[]> {
    if (!this.accessToken || !this.businessAccountId) {
      throw new Error('Instagram credentials not set');
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.businessAccountId}/media?fields=id,media_url,media_type,caption,timestamp,permalink&limit=${limit}&access_token=${this.accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      return [];
    }
  }

  // Parse product information from Instagram caption
  public parseProductFromCaption(caption: string, mediaUrl: string): ParsedProductData | null {
    if (!caption) return null;

    // Extract hashtags
    const hashtags = caption.match(/#\w+/g) || [];
    
    // Extract price using various patterns
    const pricePatterns = [
      /₹\s*(\d+(?:,\d+)*)/g,
      /Rs\.?\s*(\d+(?:,\d+)*)/g,
      /INR\s*(\d+(?:,\d+)*)/g,
      /Price:?\s*₹?\s*(\d+(?:,\d+)*)/gi
    ];

    let price = 0;
    let originalPrice: number | undefined;

    for (const pattern of pricePatterns) {
      const matches = [...caption.matchAll(pattern)];
      if (matches.length > 0) {
        const prices = matches.map(match => parseInt(match[1].replace(/,/g, '')));
        price = Math.min(...prices); // Take the lowest price as current price
        if (prices.length > 1) {
          originalPrice = Math.max(...prices); // Take highest as original price
        }
        break;
      }
    }

    if (price === 0) return null; // No price found, not a product post

    // Extract product name (usually the first line or before price)
    const lines = caption.split('\n').filter(line => line.trim());
    let name = lines[0]?.trim() || 'Instagram Product';
    
    // Clean up name (remove emojis and hashtags)
    name = name.replace(/[^\w\s-]/g, '').trim();
    if (name.length > 50) {
      name = name.substring(0, 50) + '...';
    }

    // Extract description (combine relevant lines, exclude hashtags and prices)
    const description = lines
      .filter(line => 
        !line.includes('#') && 
        !line.match(/₹|Rs\.?|INR|Price/i) &&
        line.trim().length > 10
      )
      .join(' ')
      .substring(0, 200) || 'Beautiful ethnic wear from our Instagram collection';

    // Determine category based on hashtags and keywords
    const categoryKeywords = {
      'Kurtis': ['kurti', 'kurta', 'tunic'],
      'Lehengas': ['lehenga', 'lehnga', 'skirt'],
      'Co-ord Sets': ['coord', 'coordinate', 'set', 'matching'],
      'Anarkali Sets': ['anarkali', 'anarkali'],
      'Pure Cottons': ['cotton', 'pure', 'handloom']
    };

    let category = 'Kurtis'; // Default category
    const lowerCaption = caption.toLowerCase();
    
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerCaption.includes(keyword))) {
        category = cat;
        break;
      }
    }

    // Extract sizes (look for size mentions)
    const sizePattern = /size[s]?:?\s*([smlx\d\s,\-]+)/gi;
    const sizeMatch = caption.match(sizePattern);
    let sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL']; // Default sizes
    
    if (sizeMatch) {
      const extractedSizes = sizeMatch[0]
        .replace(/size[s]?:?\s*/gi, '')
        .split(/[,\s\-]+/)
        .map(s => s.trim().toUpperCase())
        .filter(s => ['S', 'M', 'L', 'XL', 'XXL', '3XL'].includes(s));
      
      if (extractedSizes.length > 0) {
        sizes = extractedSizes;
      }
    }

    // Extract colors (look for color mentions)
    const colorKeywords = ['red', 'blue', 'green', 'yellow', 'pink', 'purple', 'black', 'white', 'orange', 'brown', 'golden', 'silver', 'mustard', 'navy', 'maroon'];
    const colors = colorKeywords.filter(color => 
      lowerCaption.includes(color)
    ).map(color => color.charAt(0).toUpperCase() + color.slice(1));
    
    if (colors.length === 0) {
      colors.push('Multicolor'); // Default color
    }

    return {
      name,
      description,
      price,
      originalPrice,
      category,
      sizes,
      colors,
      images: [mediaUrl],
      hashtags
    };
  }

  // Check if a post is likely a product post
  public isProductPost(caption: string): boolean {
    if (!caption) return false;
    
    const productIndicators = [
      /₹\s*\d+/,
      /Rs\.?\s*\d+/,
      /price/i,
      /available/i,
      /shop/i,
      /buy/i,
      /order/i,
      /dm/i,
      /whatsapp/i
    ];

    return productIndicators.some(pattern => pattern.test(caption));
  }

  // Get Instagram posts that look like product posts
  public async getProductPosts(limit: number = 20): Promise<{ post: InstagramPost; productData: ParsedProductData }[]> {
    const posts = await this.fetchRecentPosts(limit);
    const productPosts: { post: InstagramPost; productData: ParsedProductData }[] = [];

    for (const post of posts) {
      if (post.media_type === 'IMAGE' && this.isProductPost(post.caption)) {
        const productData = this.parseProductFromCaption(post.caption, post.media_url);
        if (productData) {
          productPosts.push({ post, productData });
        }
      }
    }

    return productPosts;
  }
}

export default InstagramService;