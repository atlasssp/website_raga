import React, { useState, useEffect } from 'react';
import { Instagram, RefreshCw, Plus, Eye, Check, X, Settings } from 'lucide-react';
import InstagramService, { InstagramPost, ParsedProductData } from '../../services/instagramService';
import { Product } from '../../types';

interface InstagramProductPreview {
  post: InstagramPost;
  productData: ParsedProductData;
  selected: boolean;
}

interface InstagramIntegrationProps {
  onProductsImported: (products: Product[]) => void;
}

const InstagramIntegration: React.FC<InstagramIntegrationProps> = ({ onProductsImported }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [productPreviews, setProductPreviews] = useState<InstagramProductPreview[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const instagramService = InstagramService.getInstance();

  useEffect(() => {
    // Load saved credentials from localStorage
    const savedToken = localStorage.getItem('instagram_access_token');
    const savedAccountId = localStorage.getItem('instagram_business_account_id');
    
    if (savedToken && savedAccountId) {
      setAccessToken(savedToken);
      setBusinessAccountId(savedAccountId);
      setIsConnected(true);
      instagramService.setCredentials(savedToken, savedAccountId);
    }
  }, []);

  const handleConnect = () => {
    if (!accessToken || !businessAccountId) {
      alert('Please enter both Access Token and Business Account ID');
      return;
    }

    // Save credentials
    localStorage.setItem('instagram_access_token', accessToken);
    localStorage.setItem('instagram_business_account_id', businessAccountId);
    
    instagramService.setCredentials(accessToken, businessAccountId);
    setIsConnected(true);
    setShowSettings(false);
    
    // Automatically fetch posts after connecting
    fetchInstagramProducts();
  };

  const handleDisconnect = () => {
    localStorage.removeItem('instagram_access_token');
    localStorage.removeItem('instagram_business_account_id');
    setAccessToken('');
    setBusinessAccountId('');
    setIsConnected(false);
    setProductPreviews([]);
  };

  const fetchInstagramProducts = async () => {
    if (!isConnected) return;

    setIsLoading(true);
    try {
      const productPosts = await instagramService.getProductPosts(20);
      const previews = productPosts.map(({ post, productData }) => ({
        post,
        productData,
        selected: true // Auto-select all by default
      }));
      setProductPreviews(previews);
    } catch (error) {
      console.error('Error fetching Instagram products:', error);
      alert('Failed to fetch Instagram posts. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductSelection = (index: number) => {
    setProductPreviews(prev => 
      prev.map((preview, i) => 
        i === index ? { ...preview, selected: !preview.selected } : preview
      )
    );
  };

  const importSelectedProducts = () => {
    const selectedPreviews = productPreviews.filter(preview => preview.selected);
    
    if (selectedPreviews.length === 0) {
      alert('Please select at least one product to import');
      return;
    }

    const newProducts: Product[] = selectedPreviews.map(({ productData, post }) => ({
      id: `instagram-${post.id}`,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      originalPrice: productData.originalPrice,
      images: productData.images,
      category: productData.category,
      sizes: productData.sizes,
      colors: productData.colors,
      stock: 10, // Default stock
      featured: false,
      createdAt: new Date().toISOString()
    }));

    onProductsImported(newProducts);
    setProductPreviews([]);
    alert(`Successfully imported ${newProducts.length} products from Instagram!`);
  };

  const editProductData = (index: number, field: keyof ParsedProductData, value: any) => {
    setProductPreviews(prev =>
      prev.map((preview, i) =>
        i === index
          ? {
              ...preview,
              productData: { ...preview.productData, [field]: value }
            }
          : preview
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Instagram className="h-8 w-8 text-pink-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Instagram Integration</h2>
            <p className="text-gray-600">Automatically import products from your Instagram posts</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected && (
            <button
              onClick={fetchInstagramProducts}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Instagram API Configuration</h3>
          
          {!isConnected ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                  <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="underline">Facebook Developers</a></li>
                  <li>Create a new app and add Instagram Basic Display product</li>
                  <li>Get your Access Token from the Instagram Basic Display settings</li>
                  <li>Get your Business Account ID from Instagram Business Account</li>
                  <li>Enter the credentials below</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Access Token
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your Instagram Access Token"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Account ID
                </label>
                <input
                  type="text"
                  value={businessAccountId}
                  onChange={(e) => setBusinessAccountId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your Instagram Business Account ID"
                />
              </div>

              <button
                onClick={handleConnect}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Connect Instagram
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-medium">Instagram Connected Successfully</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Account ID: {businessAccountId}</p>
                <p>Last connected: {new Date().toLocaleDateString()}</p>
              </div>

              <button
                onClick={handleDisconnect}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && !showSettings && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Instagram className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">Instagram not connected</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Connect your Instagram account to automatically import products from your posts.
          </p>
        </div>
      )}

      {/* Product Previews */}
      {isConnected && productPreviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Found {productPreviews.length} Product Posts
            </h3>
            <button
              onClick={importSelectedProducts}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Import Selected ({productPreviews.filter(p => p.selected).length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {productPreviews.map((preview, index) => (
              <div
                key={preview.post.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-colors ${
                  preview.selected ? 'border-amber-500' : 'border-gray-200'
                }`}
              >
                <div className="flex">
                  <div className="w-32 h-32 relative">
                    <img
                      src={preview.post.media_url}
                      alt="Instagram post"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleProductSelection(index)}
                      className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        preview.selected
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {preview.selected && <Check className="h-3 w-3" />}
                    </button>
                  </div>

                  <div className="flex-1 p-4 space-y-2">
                    <input
                      type="text"
                      value={preview.productData.name}
                      onChange={(e) => editProductData(index, 'name', e.target.value)}
                      className="w-full text-sm font-semibold border-none bg-transparent focus:bg-gray-50 focus:outline-none rounded px-1"
                    />

                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-amber-600">₹{preview.productData.price}</span>
                      {preview.productData.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{preview.productData.originalPrice}</span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600">
                      Category: {preview.productData.category}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {preview.productData.colors.map(color => (
                        <span key={color} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {color}
                        </span>
                      ))}
                    </div>

                    <a
                      href={preview.post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View Post</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-amber-600 mb-2" />
          <p className="text-gray-600">Fetching Instagram posts...</p>
        </div>
      )}

      {/* Empty State */}
      {isConnected && !isLoading && productPreviews.length === 0 && (
        <div className="text-center py-8">
          <Instagram className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Product Posts Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any recent Instagram posts that look like product listings.
          </p>
          <p className="text-sm text-gray-500">
            Make sure your posts include prices (₹) and product information in the captions.
          </p>
        </div>
      )}
    </div>
  );
};

export default InstagramIntegration;