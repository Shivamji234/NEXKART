import React, { useState, useEffect } from 'react';
import { adminAPI, productAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Star,
} from 'lucide-react';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useNotifications();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'Men',
    subcategory: '',
    brand: 'NexKart Atelier',
    price: '',
    discountPrice: '',
    discountPercentage: 0,
    imageUrl: '',
    sizes: 'S, M, L, XL',
    colors: 'Black, Camel',
    stock: 10,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  });

  // Delete Confirmation Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getProducts({ limit: 100 });
      if (res.success) setProducts(res.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      sku: `NX-NEW-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      category: 'Men',
      subcategory: '',
      brand: 'NexKart Atelier',
      price: '',
      discountPrice: '',
      discountPercentage: 0,
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      sizes: 'S, M, L, XL',
      colors: 'Black, Camel',
      stock: 15,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingId(p._id);
    setFormData({
      name: p.name,
      sku: p.sku,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory || '',
      brand: p.brand,
      price: p.price,
      discountPrice: p.discountPrice || '',
      discountPercentage: p.discountPercentage || 0,
      imageUrl: p.images?.[0]?.url || '',
      sizes: p.sizes?.join(', ') || '',
      colors: p.colors?.map((c) => c.name).join(', ') || '',
      stock: p.stock,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      sku: formData.sku.toUpperCase(),
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      brand: formData.brand,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice) || 0,
      discountPercentage:
        formData.discountPrice && Number(formData.discountPrice) < Number(formData.price)
          ? Math.round(((Number(formData.price) - Number(formData.discountPrice)) / Number(formData.price)) * 100)
          : 0,
      images: [{ url: formData.imageUrl, isPrimary: true }],
      sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map((c) => ({ name: c.trim(), hex: '#000000' })).filter((c) => c.name),
      stock: Number(formData.stock),
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isBestSeller: formData.isBestSeller,
    };

    try {
      if (editingId) {
        await adminAPI.updateProduct(editingId, payload);
        addToast('Product successfully updated in atelier catalogue.');
      } else {
        await adminAPI.createProduct(payload);
        addToast('New luxury creation added to catalogue.');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirmId) return;
    try {
      await adminAPI.deleteProduct(deleteConfirmId);
      addToast('Product removed from database.');
      setDeleteConfirmId(null);
      fetchProducts();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Catalog Administration
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Products & Inventory ({products.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition flex items-center space-x-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Creation</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by product name, SKU, or category..."
          className="w-full text-xs focus:outline-none tracking-wide"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Product Piece</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Inventory Stock</th>
                <th className="py-3 px-4 font-semibold">Badges</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={prod.images?.[0]?.url}
                        alt={prod.name}
                        className="w-12 h-14 object-cover rounded bg-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-luxury-950 line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase">{prod.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-luxury-900">{prod.sku}</td>
                  <td className="py-3 px-4 font-medium">{prod.category}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-luxury-950">{formatCurrency(prod.price)}</span>
                    {prod.discountPrice > 0 && (
                      <span className="block text-[10px] text-red-600 font-semibold">
                        Sale: {formatCurrency(prod.discountPrice)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.stock <= 5
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {prod.isFeatured && (
                        <span className="px-1.5 py-0.5 bg-gold-100 text-gold-800 text-[9px] font-bold rounded">
                          Featured
                        </span>
                      )}
                      {prod.isNewArrival && (
                        <span className="px-1.5 py-0.5 bg-gray-900 text-white text-[9px] font-bold rounded">
                          New
                        </span>
                      )}
                      {prod.isBestSeller && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                          Bestseller
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(prod._id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950">
                {editingId ? 'Edit Product Details' : 'Create New Luxury Piece'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded bg-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Kids">Kids</option>
                    <option value="Haute Horlogerie">Haute Horlogerie</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Retail Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Discount Price (₹, optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Available Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Available Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Noir Black, Ivory Cream"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="flex space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Mark Featured</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-luxury-950 text-gold-400 font-bold uppercase tracking-widest rounded hover:bg-black transition"
                >
                  {editingId ? 'Save Edits' : 'Publish Creation'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 font-bold uppercase tracking-widest rounded text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl z-10 space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-luxury-950 uppercase tracking-wide">
              Confirm Deletion
            </h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to permanently delete this product from the database? This action cannot be undone.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold uppercase text-xs rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-bold uppercase text-xs rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
