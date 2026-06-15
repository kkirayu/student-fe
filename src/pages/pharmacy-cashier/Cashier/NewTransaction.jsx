import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Plus, Trash2, CreditCard, 
  User, Receipt, Tag, ShieldPlus, Check, Wallet
} from 'lucide-react';

const NewTransaction = () => {
  // 1. STATE: Data Pelanggan
  const [customerData, setCustomerData] = useState({
    ownerName: '',
    petName: '',
    petType: ''
  });

  // 2. STATE: Keranjang Belanja
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Konsultasi Dokter', category: 'Layanan', qty: 1, price: 150000 },
    { id: 2, name: 'Royal Canin Kitten 400g', category: 'Produk', qty: 2, price: 65000 },
    { id: 3, name: 'Obat Cacing Drontal', category: 'Obat', qty: 1, price: 35000 },
  ]);

  // 3. STATE: Metode Pembayaran
  const [paymentMethod, setPaymentMethod] = useState('Debit/CC');

  // --- FUNGSI-FUNGSI HANDLER ---

  // Menambah jumlah item
  const handleIncreaseQty = (id) => {
    setCartItems(items => 
      items.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item)
    );
  };

  // Mengurangi jumlah item (minimal 1)
  const handleDecreaseQty = (id) => {
    setCartItems(items => 
      items.map(item => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item)
    );
  };

  // Menghapus item dari keranjang
  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Menambah item dummy (Simulasi pencarian/tambah produk)
  const handleAddDummyItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'Item Tambahan',
      category: 'Produk',
      qty: 1,
      price: 25000
    };
    setCartItems([...cartItems, newItem]);
  };

  // Proses Checkout
  const handleProcessPayment = () => {
    if (cartItems.length === 0) {
      alert("Keranjang belanja masih kosong!");
      return;
    }
    const orderData = {
      customer: customerData,
      items: cartItems,
      payment: paymentMethod,
      totalAmount: total
    };
    alert("Transaksi Berhasil Diproses!\n\n" + JSON.stringify(orderData, null, 2));
    // Di aplikasi nyata, kirim orderData ke API di sini
  };

  // --- PERHITUNGAN MATEMATIKA ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Transaksi Baru</h1>
            <p className="text-sm text-slate-500 mt-0.5">Buat tagihan untuk layanan klinik atau produk retail</p>
          </div>
        </div>
        <div className="text-sm text-slate-500 font-medium bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          No. Invoice: <span className="text-blue-600 font-bold">#INV-2024-8822</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: FORM & CART */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Form Data Pelanggan */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Data Pelanggan & Pasien
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Pemilik</label>
                <input 
                  type="text" 
                  value={customerData.ownerName}
                  onChange={(e) => setCustomerData({...customerData, ownerName: e.target.value})}
                  placeholder="Contoh: Andi Wijaya" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Hewan</label>
                <input 
                  type="text" 
                  value={customerData.petName}
                  onChange={(e) => setCustomerData({...customerData, petName: e.target.value})}
                  placeholder="Contoh: Milo" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Hewan</label>
                <select 
                  value={customerData.petType}
                  onChange={(e) => setCustomerData({...customerData, petType: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="">Pilih Jenis...</option>
                  <option value="kucing">Kucing</option>
                  <option value="anjing">Anjing</option>
                  <option value="burung">Burung</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          </section>

          {/* Keranjang Belanja */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-600" />
                Layanan & Produk
              </h2>
              
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari layanan, obat, atau produk retail..." 
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleAddDummyItem}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm">
                  <tr className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                    <th className="px-6 py-3">Item</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3 text-center">Qty</th>
                    <th className="px-6 py-3 text-right">Harga</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                            ${item.category === 'Layanan' ? 'bg-purple-100 text-purple-700' : 
                              item.category === 'Obat' ? 'bg-emerald-100 text-emerald-700' : 
                              'bg-orange-100 text-orange-700'}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleDecreaseQty(item.id)} className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100">-</button>
                            <span className="w-4 text-center font-medium">{item.qty}</span>
                            <button onClick={() => handleIncreaseQty(item.id)} className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100">+</button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">Rp {(item.price * item.qty).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">
                        Belum ada layanan atau produk yang ditambahkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: SUMMARY & PAYMENT */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col h-full">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              Ringkasan Pembayaran
            </h2>

            {/* Subtotals */}
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>PPN (11%)</span>
                <span className="font-medium text-slate-800">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Diskon</span>
                <span className="font-medium">- Rp 0</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-dashed border-slate-200">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Tagihan</span>
                  <span className="text-2xl font-extrabold text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Metode Pembayaran Aktif */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2">
                
                <button 
                  onClick={() => setPaymentMethod('Debit/CC')}
                  className={`relative px-3 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${paymentMethod === 'Debit/CC' ? 'border-2 border-blue-600 bg-blue-50 text-blue-700' : 'border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <CreditCard className="h-4 w-4" />
                  Debit/CC
                  {paymentMethod === 'Debit/CC' && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>

                <button 
                  onClick={() => setPaymentMethod('Tunai')}
                  className={`relative px-3 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all
                    ${paymentMethod === 'Tunai' ? 'border-2 border-blue-600 bg-blue-50 text-blue-700' : 'border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <Wallet className="h-4 w-4" />
                  Tunai
                  {paymentMethod === 'Tunai' && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>

                <button 
                  onClick={() => setPaymentMethod('QRIS / E-Wallet')}
                  className={`relative px-3 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all col-span-2
                    ${paymentMethod === 'QRIS / E-Wallet' ? 'border-2 border-blue-600 bg-blue-50 text-blue-700' : 'border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  QRIS / E-Wallet
                  {paymentMethod === 'QRIS / E-Wallet' && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>

              </div>
            </div>

            {/* Aksi Form */}
            <div className="space-y-3 mt-auto">
              <button 
                onClick={handleProcessPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShieldPlus className="h-5 w-5" />
                Proses Pembayaran
              </button>
              <button 
                onClick={() => alert('Disimpan sebagai draft!')}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
              >
                Simpan sebagai Draft
              </button>
            </div>
            
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewTransaction;