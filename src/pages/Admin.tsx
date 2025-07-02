import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, TrendingUp, Eye, EyeOff, Instagram } from 'lucide-react';
import { products, categories } from '../data/mockData';
import { Product, Category } from '../types';
import InstagramIntegration from '../components/Admin/InstagramIntegration';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [productList, setProductList] = useState<Product[]>(products);
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    stock: '',
    featured: false,
    images: ['']
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      sizes: [],
      colors: [],
      stock: '',
      featured: false,
      images: ['']
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      image: ''
    });
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.stock) {
      alert('Please fill in all required fields');
      return;
    }

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: productForm.name,
      description: productForm.description,
      price: parseInt(productForm.price),
      originalPrice: productForm.originalPrice ? parseInt(productForm.originalPrice) : undefined,
      category: productForm.category,
      sizes: productForm.sizes.length > 0 ? productForm.sizes : ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
      colors: productForm.colors.length > 0 ? productForm.colors : ['Default'],
      stock: parseInt(productForm.stock),
      featured: productForm.featured,
      images: productForm.images.filter(img => img.trim() !== '').length > 0 
        ? productForm.images.filter(img => img.trim() !== '') 
        : ['/images/products/4.jpg'],
      createdAt: new Date().toISOString()
    };

    setProductList([...productList, newProduct]);
    resetProductForm();
    setShowAddProduct(false);
    alert('Product added successfully!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock.toString(),
      featured: product.featured,
      images: product.images.length > 0 ? product.images : ['']
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    if (!productForm.name || !productForm.price || !productForm.category || !productForm.stock) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: productForm.name,
      description: productForm.description,
      price: parseInt(productForm.price),
      originalPrice: productForm.originalPrice ? parseInt(productForm.originalPrice) : undefined,
      category: productForm.category,
      sizes: productForm.sizes.length > 0 ? productForm.sizes : ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
      colors: productForm.colors.length > 0 ? productForm.colors : ['Default'],
      stock: parseInt(productForm.stock),
      featured: productForm.featured,
      images: productForm.images.filter(img => img.trim() !== '').length > 0 
        ? productForm.images.filter(img => img.trim() !== '') 
        : ['/images/products/4.jpg']
    };

    setProductList(productList.map(p => p.id === editingProduct.id ? updatedProduct : p));
    resetProductForm();
    setShowAddProduct(false);
    setEditingProduct(null);
    alert('Product updated successfully!');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProductList(productList.filter(p => p.id !== productId));
      alert('Product deleted successfully!');
    }
  };

  const handleAddCategory = () => {
    if (!categoryForm.name || !categoryForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: categoryForm.name,
      description: categoryForm.description,
      image: categoryForm.image || '/images/products/4.jpg'
    };

    setCategoryList([...categoryList, newCategory]);
    resetCategoryForm();
    setShowAddCategory(false);
    alert('Category added successfully!');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      image: category.image
    });
    setShowAddCategory(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    if (!categoryForm.name || !categoryForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedCategory: Category = {
      ...editingCategory,
      name: categoryForm.name,
      description: categoryForm.description,
      image: categoryForm.image || '/images/products/4.jpg'
    };

    setCategoryList(categoryList.map(c => c.id === editingCategory.id ? updatedCategory : c));
    resetCategoryForm();
    setShowAddCategory(false);
    setEditingCategory(null);
    alert('Category updated successfully!');
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategoryList(categoryList.filter(c => c.id !== categoryId));
      alert('Category deleted successfully!');
    }
  };

  const toggleSize = (size: string) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color: string) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.includes(color) 
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const addImageField = () => {
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const updateImageField = (index: number, value: string) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const removeImageField = (index: number) => {
    if (productForm.images.length > 1) {
      setProductForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const generateWhatsAppOrderReport = () => {
    const totalProducts = productList.length;
    const totalCategories = categoryList.length;
    const lowStockProducts = productList.filter(p => p.stock < 5);
    const featuredProducts = productList.filter(p => p.featured);

    let message = `📊 *RAGA BY MALLIKA - Admin Report*\n\n`;
    message += `📅 *Date:* ${new Date().toLocaleDateString()}\n\n`;
    message += `📈 *Overview:*\n`;
    message += `• Total Products: ${totalProducts}\n`;
    message += `• Total Categories: ${totalCategories}\n`;
    message += `• Featured Products: ${featuredProducts.length}\n`;
    message += `• Low Stock Alerts: ${lowStockProducts.length}\n\n`;

    if (lowStockProducts.length > 0) {
      message += `⚠️ *Low Stock Products:*\n`;
      lowStockProducts.forEach((product, index) => {
        message += `${index + 1}. ${product.name} - Stock: ${product.stock}\n`;
      });
      message += `\n`;
    }

    message += `🌟 *Featured Products:*\n`;
    featuredProducts.forEach((product, index) => {
      message += `${index + 1}. ${product.name} - ₹${product.price}\n`;
    });

    const whatsappNumber = '+918886999477';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagramProductsImported = (newProducts: Product[]) => {
    setProductList(prev => [...prev, ...newProducts]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your RAGA BY MALLIKA store</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'categories', name: 'Categories', icon: Users },
              { id: 'instagram', name: 'Instagram', icon: Instagram },
              { id: 'orders', name: 'Orders', icon: ShoppingCart }
            ].map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-amber-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{productList.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categoryList.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Featured Products</p>
                    <p className="text-2xl font-bold text-gray-900">{productList.filter(p => p.featured).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{productList.filter(p => p.stock < 5).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
                <button
                  onClick={() => setActiveTab('instagram')}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Import from Instagram</span>
                </button>
                <button
                  onClick={generateWhatsAppOrderReport}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instagram Tab */}
        {activeTab === 'instagram' && (
          <InstagramIntegration onProductsImported={handleInstagramProductsImported} />
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Products ({productList.length})</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productList.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-lg object-cover" src={product.images[0]} alt={product.name} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>₹{product.price}</div>
                          {product.originalPrice && (
                            <div className="text-xs text-gray-500 line-through">₹{product.originalPrice}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${product.stock < 5 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.featured ? 'Featured' : 'Regular'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Categories ({categoryList.length})</h2>
              <button
                onClick={() => setShowAddCategory(true)}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryList.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <button
                onClick={generateWhatsAppOrderReport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp Order Management</h3>
              <p className="text-gray-600 mb-6">
                All orders are managed through WhatsApp. When customers place orders, they will be redirected to WhatsApp 
                where you can handle the complete order process including payment confirmation, shipping details, and order tracking.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Order Process:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    <li>Customer adds items to cart</li>
                    <li>Customer clicks "Proceed to WhatsApp Checkout"</li>
                    <li>Order details are sent to your WhatsApp</li>
                    <li>You confirm order and collect payment details</li>
                    <li>You process and ship the order</li>
                    <li>You provide tracking information via WhatsApp</li>
                  </ol>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Direct customer communication</li>
                    <li>Flexible payment options</li>
                    <li>Personal customer service</li>
                    <li>Easy order modifications</li>
                    <li>Real-time order updates</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Use the "Generate Report" button to get a summary of your inventory 
                  and send it to your WhatsApp for easy reference when handling orders.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categoryList.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL', '3XL'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1 text-sm border rounded transition-colors ${
                            productForm.sizes.includes(size)
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                    <div className="flex flex-wrap gap-2">
                      {['Purple', 'White', 'Mustard Yellow', 'Black', 'Brown', 'Golden', 'Blue', 'Red', 'Green', 'Pink'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => toggleColor(color)}
                          className={`px-3 py-1 text-sm border rounded transition-colors ${
                            productForm.colors.includes(color)
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                        className="mr-2 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Product</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    {productForm.images.map((image, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => updateImageField(index, e.target.value)}
                          placeholder="Image URL (e.g., /images/products/1.jpg)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        {productForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                    >
                      + Add Another Image
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      resetProductForm();
                    }}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter category name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter category description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Image URL</label>
                    <input
                      type="text"
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter image URL (optional)"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setEditingCategory(null);
                      resetCategoryForm();
                    }}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;