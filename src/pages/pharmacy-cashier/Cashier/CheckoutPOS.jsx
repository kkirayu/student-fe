import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Trash2, Wallet, 
  QrCode, Receipt, User, CheckCircle2, ChevronLeft, X, Smartphone, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../../services/pharmacyService';
import { processPayment } from '../../../services/paymentService';

// --- MOCK DATA ---
const initialMedicalBill = [
  // isLocked: true HANYA untuk Konsultasi Dokter
  { id: 'M1', name: 'Jasa Konsultasi Dokter', category: 'Layanan', price: 150000, qty: 1, isLocked: true },
];


const CheckoutPOS = () => {
  const [cart, setCart] = useState(initialMedicalBill);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('QRIS'); 
  const [amountGiven, setAmountGiven] = useState('');
  
  // States untuk alur pembayaran
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Fetch produk dari backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await getProducts(searchQuery);
        // backend data.data contains the array when paginated
        setProducts(data.data || data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    // debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- PERHITUNGAN KEUANGAN ---
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  }, [cart]);

  const grandTotal = Math.max(0, subtotal - discount);
  const change = amountGiven ? Math.max(0, amountGiven - grandTotal) : 0;

  // --- FORMATTER ---
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // --- HANDLERS ---
  const handleAddItem = (product) => {
    const price = product.selling_price || product.price; // handle mock data vs real data
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, price, qty: 1, isLocked: false }]);
    }
    setSearchQuery('');
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const handleProcessPayment = async () => {
    setPaymentError('');
    if (paymentMethod === 'Tunai') {
      if (amountGiven < grandTotal) {
        setPaymentError('Nominal uang tunai kurang dari total tagihan!');
        return;
      }
    }
    
    // Process to backend
    setIsProcessing(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        invoice_id: 'INV-20260629-001', // ID Invoice dummy untuk demo
        cashier_id: storedUser.id || 1,
        payment_method: paymentMethod,
        amount_paid: paymentMethod === 'Tunai' ? Number(amountGiven) : grandTotal,
      };
      
      // Call actual API
      await processPayment(payload); 
      
      // Delay for loading effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (paymentMethod === 'QRIS') {
        setShowQrisModal(true);
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      setPaymentError(error.message || 'Pembayaran gagal. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQrisSuccess = () => {
    setShowQrisModal(false);
    setIsSuccess(true);
  };

  const filteredCatalog = products || [];

  // --- RENDER SUCCESS STATE ---
  if (isSuccess) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-6">
        <CheckCircle2 className="h-24 w-24 text-green-500" />
        <h2 className="text-3xl font-bold text-slate-800">Pembayaran Berhasil!</h2>
        <p className="text-slate-500">Metode: {paymentMethod} | Nomor Struk: INV-{Math.floor(Math.random() * 1000000)}</p>
        <div className="flex gap-4">
          <button onClick={() => window.location.href = '/cashier/invoice'}
           className="rounded-md bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700">
            Cetak Struk
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="rounded-md border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Kembali ke Antrean
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/pharmacy-cashier/cashier/BillingQueue" className="rounded-full p-2 hover:bg-slate-200">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Checkout POS</h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700">
          <Receipt className="h-5 w-5" />
          <span className="font-semibold">INV-260520-001</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ================== KOLOM KIRI (KERANJANG & KATALOG) ================== */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">Tambah Item (Petshop / Obat Bebas)</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari makanan, mainan, atau perlengkapan..." 
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchQuery && (
              <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                {isLoadingProducts ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-sm text-slate-500">Mencari produk...</span>
                  </div>
                ) : filteredCatalog.length > 0 ? (
                  filteredCatalog.map(product => (
                    <div key={product.id} className="flex items-center justify-between rounded bg-white p-3 shadow-sm">
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="text-sm text-slate-500">{formatRupiah(product.selling_price)}</p>
                      </div>
                      <button 
                        onClick={() => handleAddItem(product)}
                        className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                      >
                        <Plus className="h-4 w-4" /> Tambah
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="py-3 text-center text-sm text-slate-500">Produk tidak ditemukan.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-grow flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-800">Rincian Tagihan</h2>
            </div>
            <div className="flex-grow overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Item</th>
                    <th className="px-5 py-3 font-medium">Harga</th>
                    <th className="px-5 py-3 text-center font-medium">Qty</th>
                    <th className="px-5 py-3 text-right font-medium">Subtotal</th>
                    <th className="px-5 py-3 text-center font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${item.isLocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{formatRupiah(item.price)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleQtyChange(item.id, item.qty - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                            disabled={item.qty <= 1}
                          >-</button>
                          <span className="w-6 text-center font-medium">{item.qty}</span>
                          <button 
                            onClick={() => handleQtyChange(item.id, item.qty + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-200"
                          >+</button>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-slate-800">
                        {formatRupiah(item.price * item.qty)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {/* HANYA KONSULTASI YANG TERKUNCI */}
                        {!item.isLocked ? (
                          <button onClick={() => handleRemoveItem(item.id)} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="mx-auto h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-red-400" title="Konsultasi tidak dapat dihapus">Terkunci</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ================== KOLOM KANAN (PEMBAYARAN) ================== */}
        <div className="flex flex-col gap-6 xl:col-span-1">
          
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Bpk. Ahmad Subarjo</h3>
              <p className="text-sm text-slate-500">Pemilik Pet: "Mochi" (Kucing)</p>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">Ringkasan Pembayaran</h2>
            
            <div className="mb-4 space-y-3 border-b border-dashed border-slate-200 pb-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.length} Item)</span>
                <span className="font-medium">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Diskon (Rp)</span>
                <input 
                  type="number" 
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="0"
                  className="w-28 rounded-md border border-slate-300 px-2 py-1 text-right text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-800">Total Tagihan</span>
              <span className="text-2xl font-bold text-blue-600">{formatRupiah(grandTotal)}</span>
            </div>

            {/* METODE PEMBAYARAN: HANYA TUNAI & QRIS */}
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Metode Pembayaran</h3>
            <div className="mb-6 grid grid-cols-2 gap-3">
              {[
                { id: 'Tunai', icon: Wallet },
                { id: 'QRIS', icon: QrCode },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-colors ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{method.id}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'Tunai' && (
              <div className="mb-6 space-y-4 rounded-lg bg-slate-50 p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Uang Diterima</label>
                  <input 
                    type="number" 
                    value={amountGiven}
                    onChange={(e) => setAmountGiven(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-lg font-bold outline-none focus:border-blue-500"
                    placeholder="Contoh: 500000"
                  />
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="font-medium text-slate-600">Kembalian</span>
                  <span className="text-lg font-bold text-green-600">{formatRupiah(change)}</span>
                </div>
              </div>
            )}

            {paymentError && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {paymentError}
              </div>
            )}

            <button 
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="mt-auto w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3.5 font-bold text-white shadow-md transition-colors hover:bg-green-700 active:bg-green-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing && <Loader2 className="h-5 w-5 animate-spin" />}
              {isProcessing ? 'Memproses...' : `Proses Pembayaran ${paymentMethod === 'QRIS' ? 'QRIS' : ''}`}
            </button>
          </div>
        </div>
      </div>

      {/* ================== MODAL PAYMENT GATEWAY QRIS ================== */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm animate-in fade-in zoom-in-95 rounded-2xl bg-white p-6 shadow-2xl">
            
            {/* Tombol Close */}
            <button 
              onClick={() => setShowQrisModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header Modal */}
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <QrCode className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Pembayaran QRIS</h3>
              <p className="text-sm text-slate-500">Scan QR Code di bawah ini melalui aplikasi m-Banking atau E-Wallet Anda.</p>
            </div>

            {/* QR Code Placeholder (Bisa diganti dengan tag <img> API QRIS betulan) */}
            <div className="mx-auto mb-6 flex aspect-square w-48 items-center justify-center rounded-xl border-4 border-slate-100 bg-white p-2 shadow-sm">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-${grandTotal}-ZETA`} 
                alt="QRIS Code" 
                className="h-full w-full object-contain"
              />
            </div>
            
            <div className="mb-6 rounded-lg bg-slate-50 p-4 text-center">
              <span className="block text-sm text-slate-500">Total Tagihan</span>
              <span className="text-2xl font-bold text-blue-600">{formatRupiah(grandTotal)}</span>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleQrisSuccess}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                <Smartphone className="h-5 w-5" />
                Simulasikan Pembayaran Berhasil
              </button>
              <button 
                onClick={() => setShowQrisModal(false)}
                className="w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPOS;