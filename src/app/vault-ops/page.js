"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Database, PlusCircle, CheckCircle2, AlertTriangle, Edit3, Trash2, X, Users, UserX, UserCheck, Key, Eye, EyeOff, Ticket, MessageSquare, Star, ChevronDown, ChevronUp, Phone, StickyNote, BarChart3, Tag, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [errorMSG, setErrorMSG] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [cms, setCms] = useState(null);
  const [cmsSaving, setCmsSaving] = useState({});
  const [cmsStatus, setCmsStatus] = useState({}); // { sectionName: 'success' | 'error' }
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [memberCreateStatus, setMemberCreateStatus] = useState('idle'); // idle | loading | success | error
  const [memberCreateResult, setMemberCreateResult] = useState(null); // { email, password }
  const [memberActionLoading, setMemberActionLoading] = useState({}); // { [id]: true }
  const [vouchers, setVouchers] = useState([]);
  const [showVouchers, setShowVouchers] = useState(false);
  const [voucherForm, setVoucherForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiresAt: '', description: '' });
  const [voucherCreateStatus, setVoucherCreateStatus] = useState('idle');
  const [voucherActionLoading, setVoucherActionLoading] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
  const [feedbackActionLoading, setFeedbackActionLoading] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    series: "",
    price: "",
    stock: "1",
    scale: "1/7",
    category: "Ready Stock",
    dispatchCondition: "10/10 MISB (Mint in Sealed Box)",
    sealIntegrity: "Intact / Untampered",
    productSpecs: "ABS, PVC",
    authenticity: "Verified Authentic",
    description: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const handleLogout = async () => {
    await fetch('/api/auth/', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/', {
        method: 'POST',
        headers: { 'x-admin-key': passcode }
      });
      if (res.ok) {
        setPasscode("");
        setIsAuthenticated(true);
        setErrorMSG("");
      } else {
        setErrorMSG("Invalid biometrics. Access denied.");
        setPasscode("");
      }
    } catch {
      setErrorMSG("Connection error. Try again.");
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/products/', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/subscribe/', {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error('Failed to load subscribers:', err);
    }
  };

  const fetchCMS = async () => {
    try {
      const res = await fetch('/api/cms/', { cache: 'no-store' });
      if (res.ok) setCms(await res.json());
    } catch (err) {
      console.error('Failed to load CMS:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members/', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setMembers(data.members || []);
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  };

  const fetchVouchers = async () => {
    try {
      const res = await fetch('/api/vouchers/', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setVouchers(data.vouchers || []);
    } catch (err) {
      console.error('Failed to load vouchers:', err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedbacks/', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/', {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check/');
      if (res.ok) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const saveCMSSection = async (section, data) => {
    setCmsSaving(prev => ({ ...prev, [section]: true }));
    setCmsStatus(prev => ({ ...prev, [section]: null }));
    try {
      const res = await fetch('/api/cms/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });
      const result = await res.json();
      if (result.success) {
        setCms(result.cms);
        setCmsStatus(prev => ({ ...prev, [section]: 'success' }));
        setTimeout(() => setCmsStatus(prev => ({ ...prev, [section]: null })), 3000);
      } else {
        setCmsStatus(prev => ({ ...prev, [section]: 'error' }));
        alert('Save failed: ' + result.error);
      }
    } catch {
      setCmsStatus(prev => ({ ...prev, [section]: 'error' }));
      alert('Connection error saving CMS.');
    } finally {
      setCmsSaving(prev => ({ ...prev, [section]: false }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInventory();
      fetchSubscribers();
      fetchCMS();
      fetchOrders();
      fetchMembers();
      fetchVouchers();
      fetchFeedbacks();
    }
  }, [isAuthenticated]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) {
        data.append('image', imageFile);
      }
      additionalImages.forEach(f => data.append('additionalImages', f));

      if (editingId) {
        data.append('id', editingId);
      }

      const res = await fetch('/api/products/', {
        method: editingId ? 'PUT' : 'POST',
        body: data
      });

      const resData = await res.json();

      if (resData.success) {
        setSuccessStatus(true);
        // Reset form completely
        setFormData({
          name: "", manufacturer: "", series: "", price: "", stock: "1", scale: "1/7", category: "Ready Stock", dispatchCondition: "10/10 MISB (Mint in Sealed Box)", sealIntegrity: "Intact / Untampered", productSpecs: "ABS, PVC", authenticity: "Verified Authentic", description: ""
        });
        setImageFile(null);
        setAdditionalImages([]);
        setEditingId(null);
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
        const extraInput = document.getElementById('extra-images-upload');
        if (extraInput) extraInput.value = '';

        fetchInventory(); // Refresh the list
        setTimeout(() => setSuccessStatus(false), 3000);
      } else {
        alert("Operation failed: " + resData.error);
      }
    } catch (err) {
      alert("System error uploading to Vault.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(item.id);
    setImageFile(null);
    setAdditionalImages([]);
    // Reset file inputs visually
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
    const extraInput = document.getElementById('extra-images-upload');
    if (extraInput) extraInput.value = '';

    setFormData({
      name: item.name,
      manufacturer: item.manufacturer || "",
      series: item.series,
      price: item.price,
      stock: item.stock,
      scale: item.scale,
      category: item.category,
      dispatchCondition: item.dispatchCondition || "10/10 MISB (Mint in Sealed Box)",
      sealIntegrity: item.sealIntegrity || "Intact / Untampered",
      productSpecs: item.productSpecs || "ABS, PVC",
      authenticity: item.authenticity || "Verified Authentic",
      description: item.description
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "", manufacturer: "", series: "", price: "", stock: "1", scale: "1/7", category: "Ready Stock", dispatchCondition: "10/10 MISB (Mint in Sealed Box)", sealIntegrity: "Intact / Untampered", productSpecs: "ABS, PVC", authenticity: "Verified Authentic", description: ""
    });
    setImageFile(null);
    setAdditionalImages([]);
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
    const extraInput = document.getElementById('extra-images-upload');
    if (extraInput) extraInput.value = '';
  };

  const handleDelete = async (id) => {
    if (!confirm("INCINERATION PROTOCOL: Are you sure you want to permanently delete this artifact?")) return;
    try {
      const res = await fetch('/api/products/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
      }
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  if (isVerifying) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em]">Verifying Biometrics...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Provocative Hacker/Terminal background logic */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.05)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111] border border-red-900/40 p-12 rounded-[2rem] max-w-md w-full relative z-10 shadow-[0_0_50px_rgba(255,0,0,0.1)] text-center"
        >
          <Lock size={64} className="text-red-600 mx-auto mb-6 opacity-80" strokeWidth={1} />
          <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">RESTRICTED TERMINAL</h1>
          <p className="text-red-500/80 text-[10px] uppercase tracking-widest font-black mb-8">Unauthorized access will be logged.</p>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Access Code..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-[#0a0a0a] border border-gray-800 text-center text-white p-4 font-black tracking-widest text-xs uppercase focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
            />
            {errorMSG && <p className="text-red-500 text-[10px] font-bold uppercase animate-pulse">{errorMSG}</p>}

            <button type="submit" className="w-full bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/50 hover:border-red-500 transition-all p-4 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Unlock size={14} /> Bypass Firewall
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-900">
            <Link href="/" className="text-gray-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">Return to public sector</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] p-6 lg:p-12 relative overflow-x-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-end border-b border-gray-800 pb-8 mb-12">
          <div>
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] flex items-center gap-3 mb-2">
              <Database size={14} /> Vault Operations
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">ARCHIVE DASHBOARD.</h1>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <button onClick={handleLogout} className="text-red-600 hover:text-red-400 font-black text-[10px] uppercase tracking-widest transition-colors">Lock Terminal</button>
            <Link href="/" className="text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">Exit Admin</Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-gray-800 rounded-[2rem] p-8 md:p-12 shadow-2xl space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Artifact Name */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Artifact Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="e.g. Asuka Langley - Plugsuit Ver." />
            </div>

            {/* Manufacturer */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Manufacturer</label>
              <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} required className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="e.g. FuRyu, Banpresto, Taito" />
            </div>

            {/* Series */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Series / Franchise</label>
              <input type="text" name="series" value={formData.series} onChange={handleInputChange} required className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="e.g. Date A Live V" />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Retail Value (RM)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="e.g. 150.00" />
            </div>

            {/* Stock / Units Available */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Vault Units (Stock)</label>
              <input type="number" step="1" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="e.g. 1" />
            </div>

            {/* Scale / Dimensions */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Scale / Dimensions</label>
              <input type="text" name="scale" value={formData.scale} onChange={handleInputChange} required className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="e.g. 1/7, 30cm" />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors appearance-none">
                <option value="Ready Stock">Ready Stock</option>
                <option value="Pre-order">Pre-order</option>
              </select>
            </div>

            {/* Dispatch Condition */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Dispatch Condition</label>
              <select name="dispatchCondition" value={formData.dispatchCondition} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors appearance-none">
                <option value="10/10 MISB (Mint in Sealed Box)">10/10 MISB (Mint in Sealed Box)</option>
                <option value="9/10 MIB (Mint in Box - Opened but mint inside)">9/10 MIB (Mint in Box - Opened but mint inside)</option>
                <option value="8/10 Displayed Mint (Displayed, mint condition)">8/10 BIB (Displayed, mint condition, Back in Box)</option>
                <option value="7/10 Minor Wear (Minor box wear or light surface dust)">7/10 Minor Wear (Minor box wear or light surface dust)</option>
                <option value="6/10 Moderate Wear (Noticeable box damage or minor scuffs)">6/10 Moderate Wear (Noticeable box damage or minor scuffs)</option>
                <option value="5/10 Loose Mint (No box, but figure is mint)">5/10 Loose Mint (No box, but figure is mint)</option>
                <option value="4/10 Displayed Imperfect (Missing minor accessories or small marks)">4/10 Displayed Imperfect (Missing minor accessories or small marks)</option>
                <option value="3/10 Damaged (Broken parts or heavy scuffs)">3/10 Damaged (Broken parts or heavy scuffs)</option>
                <option value="2/10 Heavy Damage (Major broken pieces, missing core parts)">2/10 Heavy Damage (Major broken pieces, missing core parts)</option>
                <option value="1/10 Battle Scars (Salvaged parts / severe damage)">1/10 Battle Scars (Salvaged parts / severe damage)</option>
              </select>
            </div>

            {/* Seal Integrity */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Seal Integrity</label>
              <select name="sealIntegrity" value={formData.sealIntegrity} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors appearance-none">
                <option value="Intact / Untampered">Intact / Untampered</option>
                <option value="Tampered for Inspection Only">Tampered for Inspection Only</option>
                <option value="Tampered for Display">Tampered for Display</option>
              </select>
            </div>

            {/* Product Specs */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Product Specs</label>
              <input type="text" name="productSpecs" value={formData.productSpecs} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="e.g. ABS, PVC" />
            </div>

            {/* Authenticity */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Authenticity</label>
              <select name="authenticity" value={formData.authenticity} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors appearance-none">
                <option value="Verified Authentic">Verified Authentic</option>
                <option value="Authentic but Unverified">Authentic but Unverified</option>
                <option value="Bootleg">Bootleg</option>
              </select>
            </div>

            {/* Image Upload — spans full width */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                Artifact Image (Local File) {editingId && <span className="text-gray-600 normal-case ml-2">(Optional when editing)</span>}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!editingId}
                className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
            </div>

            {/* Additional Images */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                Additional Images <span className="text-gray-600 normal-case ml-2">(Optional — front, back, side, detail)</span>
              </label>
              <input
                id="extra-images-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setAdditionalImages(Array.from(e.target.files))}
                className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
              />
              {additionalImages.length > 0 && (
                <p className="text-gray-500 text-[10px] font-bold">{additionalImages.length} additional image{additionalImages.length > 1 ? 's' : ''} selected</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Lore / Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={4} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-4 font-bold focus:outline-none focus:border-blue-600 transition-colors" placeholder="Detail the intricacies of this piece..."></textarea>
          </div>

          <div className="pt-4 flex flex-col md:flex-row gap-4 items-center border-t border-gray-800 mt-8 justify-center">
            <button
              type="submit"
              disabled={isSubmitting || successStatus}
              className={`w-full md:w-auto px-16 py-6 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] flex justify-center items-center gap-3 transition-all duration-500
                ${successStatus ? 'bg-green-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-gray-100 text-black hover:bg-blue-600 hover:text-white hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]'}
              `}
            >
              {isSubmitting ? (
                <span className="animate-pulse">{editingId ? 'Patching...' : 'Writing to Database...'}</span>
              ) : successStatus ? (
                <><CheckCircle2 size={16} /> Artifact {editingId ? 'Updated' : 'Archived'}</>
              ) : (
                <><PlusCircle size={16} /> {editingId ? 'Update Artifact' : 'Deploy to Vault'}</>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full md:w-auto px-10 py-6 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] flex justify-center items-center gap-3 transition-all"
              >
                <X size={16} /> Cancel Edit
              </button>
            )}
          </div>
          <p className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em] mt-4 text-center w-full block">
            Item will instantly deploy to public views via HMR protocol.
          </p>
        </form>

        {/* INVENTORY ROSTER */}
        <div className="mt-20">
          <h2 className="text-2xl font-black text-white italic tracking-tighter border-b border-gray-800 pb-4 mb-6">VAULT INVENTORY ({inventory.length})</h2>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.id} className="bg-[#0a0a0a] border border-gray-800 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-900 transition-colors">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md grayscale brightness-75" />
                  <div>
                    <span className="text-blue-600 font-black text-[9px] uppercase tracking-widest block">{item.series}</span>
                    <h3 className="text-lg font-black text-white italic tracking-tight">{item.name}</h3>
                    <p className="text-gray-500 text-[10px] font-bold">RM {item.price.toFixed(2)} // ID: {item.id}</p>
                  </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 md:flex-none border border-gray-700 text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 transition-all flex justify-center items-center gap-2"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 md:flex-none border border-red-900/50 text-red-500 px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex justify-center items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {inventory.length === 0 && (
              <p className="text-gray-600 text-xs italic font-bold">The Vault is completely empty.</p>
            )}
          </div>
        </div>

        {/* SYNDICATE SUBSCRIBERS */}
        <div className="mt-20">
          <button
            onClick={() => setShowSubscribers(v => !v)}
            className="w-full flex justify-between items-center border-b border-gray-800 pb-4 mb-6 group"
          >
            <h2 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-colors">
              SYNDICATE SUBSCRIBERS ({subscribers.length})
            </h2>
            <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest">{showSubscribers ? 'Collapse ▲' : 'Expand ▼'}</span>
          </button>

          {showSubscribers && (
            <div className="space-y-3">
              {subscribers.length === 0 && (
                <p className="text-gray-600 text-xs italic font-bold">No subscribers yet.</p>
              )}
              {subscribers.map((sub) => (
                <div key={sub.id} className="bg-[#0a0a0a] border border-gray-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:border-blue-900/50 transition-colors">
                  <div>
                    <p className="text-white font-bold text-sm">{sub.email}</p>
                    {sub.name && <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{sub.name}</p>}
                  </div>
                  <p className="text-gray-700 text-[10px] font-bold shrink-0">
                    {new Date(sub.joinedAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SYNDICATE MEMBERS */}
        <div className="mt-20">
          <button
            onClick={() => setShowMembers(v => !v)}
            className="w-full flex justify-between items-center border-b border-gray-800 pb-4 mb-6 group"
          >
            <h2 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-colors flex items-center gap-3">
              <Users size={20} /> SYNDICATE MEMBERS ({members.length})
            </h2>
            <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest">{showMembers ? 'Collapse ▲' : 'Expand ▼'}</span>
          </button>

          {showMembers && (
            <div className="space-y-6">
              {/* Create Member Form */}
              <div className="bg-[#0a0a0a] border border-blue-900/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-gray-800 pb-3">
                  Provision New Member
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Email <span className="text-red-600">*</span></label>
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={e => setNewMemberEmail(e.target.value)}
                      placeholder="member@example.com"
                      className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Name <span className="text-gray-600 normal-case">(optional)</span></label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="Operative Name"
                      className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                {memberCreateResult && (
                  <div className="bg-green-900/10 border border-green-900/30 p-4 rounded-xl space-y-2">
                    <p className="text-green-500 font-black text-[10px] uppercase tracking-widest">✓ Member Created — Credentials Below</p>
                    <p className="text-gray-300 text-sm font-bold">Email: <span className="text-white">{memberCreateResult.email}</span></p>
                    <p className="text-gray-300 text-sm font-bold flex items-center gap-2">
                      Password: <span className="text-blue-400 font-mono text-base tracking-widest">{memberCreateResult.password}</span>
                    </p>
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">Credentials email sent. Note this password — shown once only.</p>
                  </div>
                )}

                {memberCreateStatus === 'error' && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Failed to create member.</p>
                )}

                <button
                  type="button"
                  disabled={memberCreateStatus === 'loading' || !newMemberEmail}
                  onClick={async () => {
                    setMemberCreateStatus('loading');
                    setMemberCreateResult(null);
                    try {
                      const res = await fetch('/api/members/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: newMemberEmail, name: newMemberName }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setMemberCreateStatus('idle');
                        setMemberCreateResult({ email: newMemberEmail, password: data.generatedPassword });
                        setNewMemberEmail('');
                        setNewMemberName('');
                        fetchMembers();
                      } else {
                        setMemberCreateStatus('error');
                        alert('Error: ' + data.error);
                      }
                    } catch {
                      setMemberCreateStatus('error');
                    }
                  }}
                  className="bg-blue-600 text-white px-8 py-3 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <PlusCircle size={14} />
                  {memberCreateStatus === 'loading' ? 'Provisioning...' : 'Provision Member'}
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {members.length === 0 && (
                  <p className="text-gray-600 text-xs italic font-bold">No members provisioned yet.</p>
                )}
                {members.map(member => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    memberOrders={orders.filter(o => o.memberId === member.id)}
                    actionLoading={memberActionLoading[member.id]}
                    onAction={async (id, action, extra = {}) => {
                      setMemberActionLoading(prev => ({ ...prev, [id]: true }));
                      try {
                        const res = await fetch('/api/members/', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id, action, ...extra }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          if (data.generatedPassword) {
                            alert(`New password for ${member.email}:\n\n${data.generatedPassword}\n\nCredentials email sent.`);
                          }
                          fetchMembers();
                        } else {
                          alert('Action failed: ' + data.error);
                        }
                      } catch {
                        alert('Error performing action.');
                      } finally {
                        setMemberActionLoading(prev => ({ ...prev, [id]: false }));
                      }
                    }}
                    onDelete={async (id) => {
                      if (!confirm(`REVOKE MEMBER: Permanently remove ${member.email}?`)) return;
                      setMemberActionLoading(prev => ({ ...prev, [id]: true }));
                      try {
                        const res = await fetch('/api/members/', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id }),
                        });
                        const data = await res.json();
                        if (data.success) fetchMembers();
                        else alert('Delete failed: ' + data.error);
                      } catch {
                        alert('Error deleting member.');
                      } finally {
                        setMemberActionLoading(prev => ({ ...prev, [id]: false }));
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* VOUCHER CONTROL */}
        <div className="mt-20">
          <button
            onClick={() => setShowVouchers(v => !v)}
            className="w-full flex justify-between items-center border-b border-gray-800 pb-4 mb-6 group"
          >
            <h2 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-colors flex items-center gap-3">
              <Ticket size={20} /> VOUCHER CONTROL ({vouchers.length})
            </h2>
            <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest">{showVouchers ? 'Collapse ▲' : 'Expand ▼'}</span>
          </button>

          {showVouchers && (
            <div className="space-y-6">
              {/* Create voucher form */}
              <div className="bg-[#0a0a0a] border border-blue-900/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-gray-800 pb-3">Issue New Voucher</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Code <span className="text-red-600">*</span></label>
                    <input type="text" value={voucherForm.code} onChange={e => setVoucherForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. SYNDICATE20" className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold font-mono focus:outline-none focus:border-blue-600 transition-colors uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Type <span className="text-red-600">*</span></label>
                    <select value={voucherForm.type} onChange={e => setVoucherForm(p => ({ ...p, type: e.target.value }))} className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors appearance-none">
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (RM)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Value <span className="text-red-600">*</span></label>
                    <input type="number" value={voucherForm.value} onChange={e => setVoucherForm(p => ({ ...p, value: e.target.value }))} placeholder={voucherForm.type === 'percent' ? '20' : '15'} min="1" max={voucherForm.type === 'percent' ? '100' : undefined} className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Min Order (RM)</label>
                    <input type="number" value={voucherForm.minOrder} onChange={e => setVoucherForm(p => ({ ...p, minOrder: e.target.value }))} placeholder="0" min="0" className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Max Uses</label>
                    <input type="number" value={voucherForm.maxUses} onChange={e => setVoucherForm(p => ({ ...p, maxUses: e.target.value }))} placeholder="Unlimited" min="1" className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Expires At</label>
                    <input type="date" value={voucherForm.expiresAt} onChange={e => setVoucherForm(p => ({ ...p, expiresAt: e.target.value }))} className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Description</label>
                  <input type="text" value={voucherForm.description} onChange={e => setVoucherForm(p => ({ ...p, description: e.target.value }))} placeholder="Internal note or displayed hint" className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors" />
                </div>
                {voucherCreateStatus === 'error' && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Failed to create voucher.</p>
                )}
                {voucherCreateStatus === 'success' && (
                  <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">✓ Voucher issued.</p>
                )}
                <button
                  type="button"
                  disabled={voucherCreateStatus === 'loading' || !voucherForm.code || !voucherForm.value}
                  onClick={async () => {
                    setVoucherCreateStatus('loading');
                    try {
                      const res = await fetch('/api/vouchers/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          code: voucherForm.code,
                          type: voucherForm.type,
                          value: Number(voucherForm.value),
                          minOrder: voucherForm.minOrder ? Number(voucherForm.minOrder) : 0,
                          maxUses: voucherForm.maxUses ? Number(voucherForm.maxUses) : null,
                          expiresAt: voucherForm.expiresAt || null,
                          description: voucherForm.description,
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setVoucherCreateStatus('success');
                        setVoucherForm({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiresAt: '', description: '' });
                        fetchVouchers();
                        setTimeout(() => setVoucherCreateStatus('idle'), 3000);
                      } else {
                        setVoucherCreateStatus('error');
                        alert('Error: ' + data.error);
                        setTimeout(() => setVoucherCreateStatus('idle'), 3000);
                      }
                    } catch {
                      setVoucherCreateStatus('error');
                      setTimeout(() => setVoucherCreateStatus('idle'), 3000);
                    }
                  }}
                  className="bg-blue-600 text-white px-8 py-3 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Tag size={14} />
                  {voucherCreateStatus === 'loading' ? 'Issuing...' : 'Issue Voucher'}
                </button>
              </div>

              {/* Voucher list */}
              <div className="space-y-3">
                {vouchers.length === 0 && <p className="text-gray-600 text-xs italic font-bold">No vouchers issued yet.</p>}
                {vouchers.map(v => (
                  <div key={v.id} className="bg-[#0a0a0a] border border-gray-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-900/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 bg-blue-900/20 border border-blue-900/30 flex items-center justify-center rounded-full">
                        <Ticket size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-black font-mono text-sm tracking-widest">{v.code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${v.isActive ? 'bg-green-900/20 text-green-500 border-green-900/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{v.isActive ? 'Active' : 'Disabled'}</span>
                          <span className="bg-blue-900/10 text-blue-400 border border-blue-900/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                            {v.type === 'percent' ? `${v.value}% off` : `RM${v.value} off`}
                          </span>
                          {v.minOrder > 0 && <span className="text-gray-600 text-[8px] font-black uppercase">min RM{v.minOrder}</span>}
                        </div>
                        {v.description && <p className="text-gray-500 text-[10px] mt-0.5">{v.description}</p>}
                        <p className="text-gray-700 text-[10px] font-bold mt-0.5">
                          Used: {v.usedCount}{v.maxUses ? `/${v.maxUses}` : ''} · Created {new Date(v.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {v.expiresAt && ` · Expires ${new Date(v.expiresAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        disabled={voucherActionLoading[v.id]}
                        onClick={async () => {
                          setVoucherActionLoading(p => ({ ...p, [v.id]: true }));
                          try {
                            const res = await fetch('/api/vouchers/', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: v.id, isActive: !v.isActive }) });
                            const data = await res.json();
                            if (data.success) fetchVouchers();
                            else alert('Failed: ' + data.error);
                          } catch { alert('Error.'); }
                          finally { setVoucherActionLoading(p => ({ ...p, [v.id]: false })); }
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 font-black text-[9px] uppercase tracking-widest border transition-all disabled:opacity-50 ${v.isActive ? 'border-yellow-900/50 text-yellow-600 hover:bg-yellow-600 hover:text-white hover:border-yellow-600' : 'border-green-900/50 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600'}`}
                      >
                        {v.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        disabled={voucherActionLoading[v.id]}
                        onClick={async () => {
                          if (!confirm(`Delete voucher ${v.code}?`)) return;
                          setVoucherActionLoading(p => ({ ...p, [v.id]: true }));
                          try {
                            const res = await fetch('/api/vouchers/', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: v.id }) });
                            const data = await res.json();
                            if (data.success) fetchVouchers();
                            else alert('Failed: ' + data.error);
                          } catch { alert('Error.'); }
                          finally { setVoucherActionLoading(p => ({ ...p, [v.id]: false })); }
                        }}
                        className="flex items-center gap-1.5 border border-red-900/50 text-red-500 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FEEDBACK INTEL */}
        <div className="mt-20">
          <button
            onClick={() => setShowFeedbacks(v => !v)}
            className="w-full flex justify-between items-center border-b border-gray-800 pb-4 mb-6 group"
          >
            <h2 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-colors flex items-center gap-3">
              <MessageSquare size={20} /> FEEDBACK INTEL ({feedbacks.length})
              {feedbacks.filter(f => f.status === 'new').length > 0 && (
                <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{feedbacks.filter(f => f.status === 'new').length} NEW</span>
              )}
            </h2>
            <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest">{showFeedbacks ? 'Collapse ▲' : 'Expand ▼'}</span>
          </button>

          {showFeedbacks && (
            <div className="space-y-3">
              {feedbacks.length === 0 && <p className="text-gray-600 text-xs italic font-bold">No feedback received yet.</p>}
              {feedbacks.map(fb => (
                <FeedbackCard
                  key={fb.id}
                  feedback={fb}
                  actionLoading={feedbackActionLoading[fb.id]}
                  onUpdate={async (id, updates) => {
                    setFeedbackActionLoading(p => ({ ...p, [id]: true }));
                    try {
                      const res = await fetch('/api/feedbacks/', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) });
                      const data = await res.json();
                      if (data.success) fetchFeedbacks();
                      else alert('Failed: ' + data.error);
                    } catch { alert('Error.'); }
                    finally { setFeedbackActionLoading(p => ({ ...p, [id]: false })); }
                  }}
                  onDelete={async (id) => {
                    if (!confirm('Delete this feedback?')) return;
                    setFeedbackActionLoading(p => ({ ...p, [id]: true }));
                    try {
                      const res = await fetch('/api/feedbacks/', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                      const data = await res.json();
                      if (data.success) fetchFeedbacks();
                      else alert('Failed: ' + data.error);
                    } catch { alert('Error.'); }
                    finally { setFeedbackActionLoading(p => ({ ...p, [id]: false })); }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ORDER DEPLOYMENTS */}
        <div className="mt-20">
          <button
            onClick={() => setShowOrders(v => !v)}
            className="w-full flex justify-between items-center border-b border-gray-800 pb-4 mb-6 group"
          >
            <h2 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-colors">
              ORDER DEPLOYMENTS ({orders.length})
            </h2>
            <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest">{showOrders ? 'Collapse ▲' : 'Expand ▼'}</span>
          </button>

          {showOrders && (
            <div className="space-y-4">
              {orders.length === 0 && (
                <p className="text-gray-600 text-xs italic font-bold">No orders found.</p>
              )}
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} onUpdate={fetchOrders} onRemove={fetchOrders} />
              ))}
            </div>
          )}
        </div>

        {/* CONTENT CONTROL */}
        {cms && (
          <div className="mt-20">
            <button
              onClick={() => setShowContent(v => !v)}
              className="w-full flex justify-between items-center border-b border-gray-800 pb-4 mb-6 group"
            >
              <h2 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-colors">CONTENT CONTROL</h2>
              <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest">{showContent ? 'Collapse ▲' : 'Expand ▼'}</span>
            </button>

            {showContent && (
              <div className="space-y-8">

                {/* Announcement Banner */}
                <CMSSection title="Announcement Banner" onSave={() => saveCMSSection('announcement', cms.announcement)} saving={cmsSaving.announcement} status={cmsStatus.announcement}>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Enabled</label>
                    <button
                      type="button"
                      onClick={() => setCms(p => ({ ...p, announcement: { ...p.announcement, enabled: !p.announcement.enabled } }))}
                      className={`w-12 h-6 rounded-full transition-colors ${cms.announcement?.enabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${cms.announcement?.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <CMSField label="Banner Text" value={cms.announcement?.text || ''} onChange={v => setCms(p => ({ ...p, announcement: { ...p.announcement, text: v } }))} />
                  <CMSField label="Link URL (optional)" value={cms.announcement?.link || ''} onChange={v => setCms(p => ({ ...p, announcement: { ...p.announcement, link: v } }))} />
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Type</label>
                    <select value={cms.announcement?.type || 'info'} onChange={e => setCms(p => ({ ...p, announcement: { ...p.announcement, type: e.target.value } }))} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600">
                      <option value="info">Info (Blue)</option>
                      <option value="warning">Warning (Yellow)</option>
                      <option value="promo">Promo (Green)</option>
                    </select>
                  </div>
                </CMSSection>

                {/* Site Identity */}
                <CMSSection title="Site Identity" onSave={() => saveCMSSection('site', cms.site)} saving={cmsSaving.site} status={cmsStatus.site}>
                  <CMSField label="Site Name" value={cms.site?.name || ''} onChange={v => setCms(p => ({ ...p, site: { ...p.site, name: v } }))} />
                  <CMSField label="Tagline (under logo)" value={cms.site?.tagline || ''} onChange={v => setCms(p => ({ ...p, site: { ...p.site, tagline: v } }))} />
                </CMSSection>

                {/* Hero Section */}
                <CMSSection title="Hero Section" onSave={() => saveCMSSection('hero', cms.hero)} saving={cmsSaving.hero} status={cmsStatus.hero}>
                  <CMSField label="Tagline (e.g. Established 2023)" value={cms.hero?.tagline || ''} onChange={v => setCms(p => ({ ...p, hero: { ...p.hero, tagline: v } }))} />
                  <CMSField label="CTA Button Label" value={cms.hero?.ctaLabel || ''} onChange={v => setCms(p => ({ ...p, hero: { ...p.hero, ctaLabel: v } }))} />
                </CMSSection>

                {/* Brands Marquee */}
                <CMSSection title="Brands Marquee" onSave={() => saveCMSSection('brands', cms.brands)} saving={cmsSaving.brands} status={cmsStatus.brands}>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Brands (one per line)</label>
                    <textarea
                      rows={5}
                      value={(cms.brands || []).join('\n')}
                      onChange={e => setCms(p => ({ ...p, brands: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                      className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                </CMSSection>

                {/* Syndicate Section */}
                <CMSSection title="Syndicate Section" onSave={() => saveCMSSection('home', cms.home)} saving={cmsSaving.home} status={cmsStatus.home}>
                  <CMSField label="Heading" value={cms.home?.syndicateHeading || ''} onChange={v => setCms(p => ({ ...p, home: { ...p.home, syndicateHeading: v } }))} />
                  <CMSField label="Description" value={cms.home?.syndicateDescription || ''} onChange={v => setCms(p => ({ ...p, home: { ...p.home, syndicateDescription: v } }))} textarea />
                </CMSSection>


                {/* Contact Info */}
                <CMSSection title="Contact Info" onSave={() => saveCMSSection('contact', cms.contact)} saving={cmsSaving.contact} status={cmsStatus.contact}>
                  <CMSField label="WhatsApp Number (e.g. +60123456789)" value={cms.contact?.whatsapp || ''} onChange={v => setCms(p => ({ ...p, contact: { ...p.contact, whatsapp: v } }))} />
                </CMSSection>
                
                {/* Vault Ethos */}
                <CMSSection title="Vault Ethos" onSave={() => saveCMSSection('ethos', cms.ethos)} saving={cmsSaving.ethos} status={cmsStatus.ethos}>
                  <CMSField label="Ethos Heading" value={cms.ethos?.heading || ''} onChange={v => setCms(p => ({ ...p, ethos: { ...p.ethos, heading: v } }))} />
                  <CMSField label="Ethos Subheading" value={cms.ethos?.subheading || ''} onChange={v => setCms(p => ({ ...p, ethos: { ...p.ethos, subheading: v } }))} />
                  
                  <div className="space-y-4 pt-4 border-t border-gray-800">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ethos Values</label>
                    {(Array.isArray(cms.ethos?.values) ? cms.ethos.values : []).map((value, idx) => (
                      <div key={idx} className="bg-[#050505] p-4 rounded-xl border border-gray-900 space-y-3">
                        <CMSField 
                          label={`Value ${idx + 1} Title`} 
                          value={value.title} 
                          onChange={v => {
                            const newValues = [...cms.ethos.values];
                            newValues[idx] = { ...newValues[idx], title: v };
                            setCms(p => ({ ...p, ethos: { ...p.ethos, values: newValues } }));
                          }} 
                        />
                        <CMSField 
                          label={`Value ${idx + 1} Description`} 
                          value={value.desc} 
                          textarea
                          onChange={v => {
                            const newValues = [...cms.ethos.values];
                            newValues[idx] = { ...newValues[idx], desc: v };
                            setCms(p => ({ ...p, ethos: { ...p.ethos, values: newValues } }));
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                </CMSSection>

              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}

const TIER_CONFIG = {
  bronze:   { label: 'Bronze',   color: 'bg-amber-900/20 text-amber-600 border-amber-900/30' },
  silver:   { label: 'Silver',   color: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/50' },
  gold:     { label: 'Gold',     color: 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30' },
  platinum: { label: 'Platinum', color: 'bg-purple-900/20 text-purple-400 border-purple-900/30' },
  syndicate:{ label: 'Syndicate',color: 'bg-blue-600/10 text-blue-500 border-blue-900/30' },
};

function MemberCard({ member, memberOrders, actionLoading, onAction, onDelete }) {
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(member.notes || '');
  const [editPhone, setEditPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(member.phone || '');
  const isActive = member.status === 'active';
  const tier = member.tier || 'syndicate';
  const tierCfg = TIER_CONFIG[tier] || TIER_CONFIG.syndicate;

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 hover:border-blue-900/50 transition-colors">
      {/* Header row */}
      <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-[10px] font-black text-white">
            {(member.name || member.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-bold text-sm">{member.email}</p>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${isActive ? 'bg-green-900/20 text-green-500 border-green-900/30' : 'bg-red-900/20 text-red-500 border-red-900/30'}`}>{member.status}</span>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${tierCfg.color}`}>{tierCfg.label}</span>
            </div>
            {member.name && <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-0.5">{member.name}</p>}
            <p className="text-gray-700 text-[10px] font-bold mt-0.5">
              Joined {new Date(member.joinedAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
              {member.lastLoginAt && ` · Last login ${new Date(member.lastLoginAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}`}
              {member.phone && ` · ${member.phone}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-1.5 border border-gray-700 text-gray-400 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-[#111] hover:text-white transition-all">
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />} Details
          </button>
          <button
            onClick={() => onAction(member.id, isActive ? 'suspend' : 'activate')}
            disabled={actionLoading}
            className={`flex items-center gap-1.5 px-4 py-2 font-black text-[9px] uppercase tracking-widest border transition-all disabled:opacity-50 ${isActive ? 'border-yellow-900/50 text-yellow-600 hover:bg-yellow-600 hover:text-white hover:border-yellow-600' : 'border-green-900/50 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600'}`}
          >
            {isActive ? <><UserX size={11} /> Suspend</> : <><UserCheck size={11} /> Activate</>}
          </button>
          <button
            onClick={() => { if (!showResetPwd) { setShowResetPwd(true); return; } onAction(member.id, 'reset_password'); setShowResetPwd(false); }}
            disabled={actionLoading}
            className="flex items-center gap-1.5 border border-gray-700 text-gray-400 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-[#111] hover:text-white transition-all disabled:opacity-50"
          >
            <Key size={11} /> {showResetPwd ? 'Confirm Reset' : 'Reset Pwd'}
          </button>
          {showResetPwd && (
            <button onClick={() => setShowResetPwd(false)} className="flex items-center gap-1.5 border border-gray-800 text-gray-600 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:text-gray-400 transition-all">
              <X size={11} /> Cancel
            </button>
          )}
          <button onClick={() => onDelete(member.id)} disabled={actionLoading} className="flex items-center gap-1.5 border border-red-900/50 text-red-500 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50">
            <Trash2 size={11} /> Revoke
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-gray-800 bg-[#060606] px-6 py-5 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Total Spent</p>
              <p className="text-white font-black text-lg">RM {(member.totalSpent || 0).toFixed(2)}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Points</p>
              <p className="text-white font-black text-lg">{member.points || 0}</p>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">Orders</p>
              <p className="text-white font-black text-lg">{memberOrders.length}</p>
            </div>
          </div>

          {/* Tier + Phone row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tier selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2"><BarChart3 size={11} /> Membership Grade</label>
              <select
                defaultValue={tier}
                onChange={async e => {
                  const newTier = e.target.value;
                  try {
                    const res = await fetch('/api/members/', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: member.id, action: 'set_tier', tier: newTier }) });
                    const data = await res.json();
                    if (!data.success) alert('Failed: ' + data.error);
                  } catch { alert('Error updating tier.'); }
                }}
                className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold text-sm focus:outline-none focus:border-blue-600 transition-colors appearance-none"
              >
                {Object.entries(TIER_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2"><Phone size={11} /> Phone</label>
              {editPhone ? (
                <div className="flex gap-2">
                  <input type="text" value={phoneValue} onChange={e => setPhoneValue(e.target.value)} placeholder="+60 12-345 6789" className="flex-1 bg-[#050505] border border-blue-600 text-white p-3 font-bold text-sm focus:outline-none" />
                  <button onClick={async () => { await onAction(member.id, 'update_phone', { phone: phoneValue }); setEditPhone(false); }} className="bg-blue-600 text-white px-4 font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Save</button>
                  <button onClick={() => { setPhoneValue(member.phone || ''); setEditPhone(false); }} className="border border-gray-700 text-gray-400 px-3 font-black text-[9px] uppercase tracking-widest hover:text-white transition-colors">✕</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-gray-400 text-sm font-bold flex-1">{member.phone || <span className="text-gray-700 italic">Not set</span>}</p>
                  <button onClick={() => setEditPhone(true)} className="text-gray-600 hover:text-blue-500 transition-colors"><Edit3 size={12} /></button>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2"><StickyNote size={11} /> Admin Notes</label>
            {editNotes ? (
              <div className="space-y-2">
                <textarea rows={3} value={notesValue} onChange={e => setNotesValue(e.target.value)} placeholder="Internal notes — not visible to member" className="w-full bg-[#050505] border border-blue-600 text-white p-3 font-bold text-sm focus:outline-none resize-none" />
                <div className="flex gap-2">
                  <button onClick={async () => { await onAction(member.id, 'update_notes', { notes: notesValue }); setEditNotes(false); }} className="bg-blue-600 text-white px-6 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Save</button>
                  <button onClick={() => { setNotesValue(member.notes || ''); setEditNotes(false); }} className="border border-gray-700 text-gray-400 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 group cursor-pointer" onClick={() => setEditNotes(true)}>
                <p className="text-gray-500 text-sm flex-1 leading-relaxed">{member.notes || <span className="text-gray-700 italic">No notes — click to add</span>}</p>
                <Edit3 size={12} className="text-gray-700 group-hover:text-blue-500 transition-colors mt-0.5 shrink-0" />
              </div>
            )}
          </div>

          {/* Transaction records */}
          {memberOrders.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2"><ShoppingBag size={11} /> Transaction Records</label>
              <div className="space-y-2">
                {memberOrders.map(o => (
                  <div key={o.id} className="bg-[#0a0a0a] border border-gray-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest">{o.id}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        o.status === 'processing' ? 'bg-blue-900/40 text-blue-500 border-blue-900/50' :
                        o.status === 'dispatched' ? 'bg-purple-900/40 text-purple-400 border-purple-900/50' :
                        o.status === 'delivered' ? 'bg-green-900/40 text-green-500 border-green-900/50' :
                        'bg-gray-800 text-gray-500 border-gray-700'
                      }`}>{o.status}</span>
                      <span className="text-white font-black text-sm">RM {o.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeedbackCard({ feedback: fb, actionLoading, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(fb.status === 'new');
  const [noteValue, setNoteValue] = useState(fb.adminNote || '');
  const [editNote, setEditNote] = useState(false);

  const statusColors = {
    new: 'bg-blue-900/20 text-blue-500 border-blue-900/30',
    read: 'bg-gray-800 text-gray-400 border-gray-700',
    resolved: 'bg-green-900/20 text-green-500 border-green-900/30',
  };
  const typeColors = {
    complaint: 'text-red-500',
    suggestion: 'text-yellow-500',
    product: 'text-purple-400',
    service: 'text-blue-400',
    general: 'text-gray-400',
  };

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 hover:border-blue-900/50 transition-colors">
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">
            {fb.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-bold text-sm">{fb.name}</p>
              <span className="text-gray-500 text-[10px]">{fb.email}</span>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusColors[fb.status]}`}>{fb.status}</span>
              <span className={`text-[8px] font-black uppercase tracking-widest ${typeColors[fb.type]}`}>{fb.type}</span>
              {fb.rating && (
                <span className="flex items-center gap-0.5 text-yellow-500 text-[10px] font-black">
                  <Star size={9} fill="currentColor" />{fb.rating}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-[10px] mt-0.5">
              {new Date(fb.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
              {fb.orderId && ` · Order ${fb.orderId}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <button onClick={() => { setExpanded(v => !v); if (fb.status === 'new') onUpdate(fb.id, { status: 'read' }); }} className="flex items-center gap-1.5 border border-gray-700 text-gray-400 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-[#111] hover:text-white transition-all">
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />} {expanded ? 'Hide' : 'View'}
          </button>
          {fb.status !== 'resolved' && (
            <button disabled={actionLoading} onClick={() => onUpdate(fb.id, { status: 'resolved' })} className="flex items-center gap-1.5 border border-green-900/50 text-green-600 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-green-600 hover:text-white hover:border-green-600 transition-all disabled:opacity-50">
              <CheckCircle2 size={11} /> Resolve
            </button>
          )}
          <button disabled={actionLoading} onClick={() => onDelete(fb.id)} className="flex items-center gap-1.5 border border-red-900/50 text-red-500 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50">
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-800 bg-[#060606] px-6 py-4 space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{fb.message}</p>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Admin Note</label>
            {editNote ? (
              <div className="space-y-2">
                <textarea rows={2} value={noteValue} onChange={e => setNoteValue(e.target.value)} placeholder="Internal note..." className="w-full bg-[#050505] border border-blue-600 text-white p-3 font-bold text-sm focus:outline-none resize-none" />
                <div className="flex gap-2">
                  <button onClick={async () => { await onUpdate(fb.id, { adminNote: noteValue }); setEditNote(false); }} className="bg-blue-600 text-white px-6 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Save</button>
                  <button onClick={() => { setNoteValue(fb.adminNote || ''); setEditNote(false); }} className="border border-gray-700 text-gray-400 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 group cursor-pointer" onClick={() => setEditNote(true)}>
                <p className="text-gray-600 text-sm flex-1">{fb.adminNote || <span className="text-gray-700 italic">No note — click to add</span>}</p>
                <Edit3 size={12} className="text-gray-700 group-hover:text-blue-500 transition-colors mt-0.5 shrink-0" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CMSSection({ title, children, onSave, saving, status }) {
  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-gray-800 pb-3">{title}</h3>
      {children}
      <div className="flex items-center gap-4 mt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Section'}
        </button>
        {status === 'success' && (
          <span className="text-green-500 text-[10px] font-black uppercase tracking-widest animate-pulse">✓ Saved — Live on site</span>
        )}
        {status === 'error' && (
          <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">✗ Save failed</span>
        )}
      </div>
    </div>
  );
}

function CMSField({ label, value, onChange, textarea }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 transition-colors" />
      )}
    </div>
  );
}

function OrderCard({ order, onUpdate, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [courier, setCourier] = useState(order.courier || '');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleRemove = async () => {
    if (!confirm(`INCINERATE ORDER: Permanently delete order ${order.id}? This cannot be undone.`)) return;
    setIsRemoving(true);
    try {
      const res = await fetch('/api/orders/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id })
      });
      const data = await res.json();
      if (data.success) {
        onRemove();
      } else {
        alert('Failed to remove order: ' + data.error);
      }
    } catch {
      alert('Error removing order.');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/orders/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status, courier, trackingNumber })
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        onUpdate();
      } else {
        alert('Failed to update order: ' + data.error);
      }
    } catch (err) {
      alert('Error updating order');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 p-6 flex flex-col gap-4 hover:border-blue-900 transition-colors">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest block">Order ID</span>
          <h3 className="text-lg font-black text-white tracking-tight">{order.id}</h3>
          <p className="text-gray-500 text-[10px] font-bold mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
            order.status === 'awaiting_payment' ? 'bg-orange-900/40 text-orange-400 border border-orange-900/50' :
            order.status === 'payment_failed' ? 'bg-red-900/40 text-red-500 border border-red-900/50' :
            order.status === 'pending' ? 'bg-yellow-900/40 text-yellow-500 border border-yellow-900/50' :
            order.status === 'processing' ? 'bg-blue-900/40 text-blue-500 border border-blue-900/50' :
            order.status === 'dispatched' ? 'bg-purple-900/40 text-purple-400 border border-purple-900/50' :
            'bg-green-900/40 text-green-500 border border-green-900/50'
          }`}>
            {order.status}
          </span>
          <p className="text-white font-bold text-sm mt-2">RM {order.grandTotal?.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Customer</h4>
          <p className="text-sm font-bold text-white">{order.shipping?.fullName}</p>
          <p className="text-xs text-gray-400">{order.shipping?.phone}</p>
          <p className="text-xs text-gray-400 mt-1">{order.shipping?.address1}, {order.shipping?.city}, {order.shipping?.postcode}, {order.shipping?.state}</p>
        </div>
        <div>
          <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Items ({order.items?.length})</h4>
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 truncate pr-2">{item.quantity}x {item.name}</span>
              <span className="text-gray-500 font-bold shrink-0">RM {item.price?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4 pt-4 border-t border-gray-800 bg-[#111] -mx-6 -mb-6 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 appearance-none">
                <option value="awaiting_payment">Awaiting Payment</option>
                <option value="payment_failed">Payment Failed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing (Secured)</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Courier</label>
              <select value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600 appearance-none">
                <option value="">None</option>
                <option value="J&T Express">J&T Express</option>
                <option value="PosLaju">PosLaju</option>
                <option value="NinjaVan">NinjaVan</option>
                <option value="DHL">DHL e-Commerce</option>
                <option value="Shopee Express">Shopee Express</option>
                <option value="Lalamove">Lalamove</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tracking Number</label>
              <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full bg-[#050505] border border-gray-800 text-white p-3 font-bold focus:outline-none focus:border-blue-600" placeholder="e.g. 62000123456" />
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              {isSaving ? 'Saving...' : 'Save Update'}
            </button>
            <button onClick={() => setIsEditing(false)} className="border border-gray-700 text-gray-400 px-6 py-2 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
          <div className="text-xs text-gray-500 flex gap-4">
            {order.courier && <span><strong className="text-gray-400">Courier:</strong> {order.courier}</span>}
            {order.trackingNumber && <span><strong className="text-gray-400">Tracking:</strong> <span className="text-blue-400 font-mono">{order.trackingNumber}</span></span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="border border-red-900/50 text-red-600 px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={12} /> {isRemoving ? 'Removing...' : 'Remove'}
            </button>
            <button onClick={() => setIsEditing(true)} className="border border-gray-700 text-white px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-[#111] transition-all flex items-center gap-2">
              <Edit3 size={12} /> Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
