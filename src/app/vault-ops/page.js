"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Database, PlusCircle, CheckCircle2, AlertTriangle, Edit3, Trash2, X } from 'lucide-react';
import Link from 'next/link';

let _adminKey = '';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/', {
        method: 'POST',
        headers: { 'x-admin-key': passcode }
      });
      if (res.ok) {
        _adminKey = passcode;
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
      const res = await fetch('/api/subscribe', {
        headers: { 'x-admin-key': _adminKey },
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

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'x-admin-key': _adminKey },
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const saveCMSSection = async (section, data) => {
    setCmsSaving(prev => ({ ...prev, [section]: true }));
    setCmsStatus(prev => ({ ...prev, [section]: null }));
    try {
      const res = await fetch('/api/cms/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': _adminKey },
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
    if (isAuthenticated) {
      fetchInventory();
      fetchSubscribers();
      fetchCMS();
      fetchOrders();
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
        headers: { 'x-admin-key': _adminKey },
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
  };

  const handleDelete = async (id) => {
    if (!confirm("INCINERATION PROTOCOL: Are you sure you want to permanently delete this artifact?")) return;
    try {
      const res = await fetch('/api/products/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': _adminKey },
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
          <Link href="/" className="text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors mb-2">Exit Admin</Link>
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
                <OrderCard key={order.id} order={order} onUpdate={fetchOrders} />
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

              </div>
            )}
          </div>
        )}

      </div>
    </main>
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

function OrderCard({ order, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [courier, setCourier] = useState(order.courier || '');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': _adminKey },
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
          <button onClick={() => setIsEditing(true)} className="border border-gray-700 text-white px-4 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-[#111] transition-all flex items-center gap-2">
            <Edit3 size={12} /> Update Status
          </button>
        </div>
      )}
    </div>
  );
}
