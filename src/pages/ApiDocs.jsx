import React, { useState } from 'react';
import { 
  Server, Shield, User, Database, Globe, 
  ChevronRight, ChevronDown, CheckCircle2,
  Lock, Key, FileJson, AlertCircle, Code, List, BarChart3
} from 'lucide-react';

const apiData = {
  admin: [
    {
      group: "Users & Staff Management",
      icon: <UsersIcon />,
      endpoints: [
        { method: "GET", path: "/api/users", desc: "Mendapatkan daftar semua user/staff", auth: "Admin Token", params: "?page=1&limit=10&role=staff", body: null },
        { method: "POST", path: "/api/users", desc: "Menambahkan user/staff baru", auth: "Admin Token", params: null, body: "{\n  \"name\": \"string\",\n  \"email\": \"string\",\n  \"password\": \"string\",\n  \"role\": \"admin|staff\"\n}" },
        { method: "GET", path: "/api/users/{id}", desc: "Detail user berdasarkan ID", auth: "Admin Token", params: "id (path parameter)", body: null },
        { method: "PUT", path: "/api/users/{id}", desc: "Update data user", auth: "Admin Token", params: "id (path parameter)", body: "{\n  \"name\": \"string\",\n  \"email\": \"string\",\n  \"role\": \"admin|staff\"\n}" },
        { method: "DELETE", path: "/api/users/{id}", desc: "Hapus data user", auth: "Admin Token", params: "id (path parameter)", body: null },
      ]
    },
    {
      group: "Clinic Settings",
      icon: <SettingsIcon />,
      endpoints: [
        { method: "GET", path: "/api/clinic-settings", desc: "Mendapatkan pengaturan klinik", auth: "Admin Token", params: null, body: null },
        { method: "POST", path: "/api/clinic-settings", desc: "Update pengaturan klinik", auth: "Admin Token", params: null, body: "{\n  \"name\": \"string\",\n  \"address\": \"string\",\n  \"phone\": \"string\",\n  \"logo_url\": \"string\"\n}" },
      ]
    },
    {
      group: "Services (Layanan & Tarif)",
      icon: <LayersIcon />,
      endpoints: [
        { method: "GET", path: "/api/services", desc: "Daftar layanan dan tarif", auth: "Admin Token", params: "?search=vaksin", body: null },
        { method: "POST", path: "/api/services", desc: "Tambah layanan baru", auth: "Admin Token", params: null, body: "{\n  \"name\": \"string\",\n  \"description\": \"string\",\n  \"price\": \"number\"\n}" },
        { method: "PUT", path: "/api/services/{id}", desc: "Update data layanan", auth: "Admin Token", params: "id (path parameter)", body: "{\n  \"name\": \"string\",\n  \"description\": \"string\",\n  \"price\": \"number\"\n}" },
        { method: "DELETE", path: "/api/services/{id}", desc: "Hapus layanan", auth: "Admin Token", params: "id (path parameter)", body: null },
      ]
    },
    {
      group: "Invoices & Payments",
      icon: <CreditCardIcon />,
      endpoints: [
        { method: "GET", path: "/api/invoices", desc: "Daftar invoice transaksi", auth: "Admin Token", params: "?status=paid|unpaid", body: null },
        { method: "GET", path: "/api/payments", desc: "Daftar pembayaran", auth: "Admin Token", params: "?status=success|failed", body: null },
        { method: "PATCH", path: "/api/payments/{id}/refund", desc: "Refund pembayaran pasien", auth: "Admin Token", params: "id (path parameter)", body: "{\n  \"reason\": \"string\"\n}" },
      ]
    },
    {
      group: "Reports & Analytics",
      icon: <ReportIcon />,
      endpoints: [
        { method: "GET", path: "/api/reports/financial", desc: "Laporan Pendapatan Keuangan", auth: "Admin Token", params: "?start_date=YYYY-MM-DD & end_date=YYYY-MM-DD (Opsional)", body: null },
        { method: "GET", path: "/api/reports/demographics", desc: "Laporan Demografi Hewan/Pasien", auth: "Admin Token", params: "?start_date=YYYY-MM-DD & end_date=YYYY-MM-DD (Opsional)", body: null },
        { method: "GET", path: "/api/reports/stock-mutation", desc: "Laporan Mutasi Keluar/Masuk Stok", auth: "Admin Token", params: "?start_date=YYYY-MM-DD & end_date=YYYY-MM-DD (Opsional)", body: null },
      ]
    }
  ],
  owner: [
    {
      group: "Pets (Hewan Peliharaan)",
      icon: <PawPrintIcon />,
      endpoints: [
        { method: "GET", path: "/api/pets", desc: "Daftar hewan milik owner (terautentikasi)", auth: "Owner Token", params: null, body: null },
        { method: "POST", path: "/api/pets", desc: "Daftarkan hewan baru", auth: "Owner Token", params: null, body: "{\n  \"name\": \"string\",\n  \"species\": \"string\",\n  \"breed\": \"string\",\n  \"age\": \"number\",\n  \"weight\": \"number\"\n}" },
        { method: "GET", path: "/api/pets/{id}", desc: "Detail hewan", auth: "Owner Token", params: "id (path parameter)", body: null },
        { method: "PUT", path: "/api/pets/{id}", desc: "Update data hewan", auth: "Owner Token", params: "id (path parameter)", body: "{\n  \"name\": \"string\",\n  \"age\": \"number\",\n  \"weight\": \"number\"\n}" },
        { method: "DELETE", path: "/api/pets/{id}", desc: "Hapus data hewan", auth: "Owner Token", params: "id (path parameter)", body: null },
      ]
    },
    {
      group: "Appointments (Janji Temu)",
      icon: <CalendarIcon />,
      endpoints: [
        { method: "GET", path: "/api/appointments", desc: "Riwayat janji temu owner", auth: "Owner Token", params: "?status=upcoming|completed", body: null },
        { method: "POST", path: "/api/appointments", desc: "Buat janji temu baru", auth: "Owner Token", params: null, body: "{\n  \"pet_id\": \"number\",\n  \"date\": \"YYYY-MM-DD\",\n  \"time\": \"HH:MM\",\n  \"complaint\": \"string\"\n}" },
        { method: "GET", path: "/api/appointments/{id}", desc: "Detail janji temu", auth: "Owner Token", params: "id (path parameter)", body: null },
        { method: "PUT", path: "/api/appointments/{id}", desc: "Reschedule janji temu", auth: "Owner Token", params: "id (path parameter)", body: "{\n  \"date\": \"YYYY-MM-DD\",\n  \"time\": \"HH:MM\"\n}" },
        { method: "DELETE", path: "/api/appointments/{id}", desc: "Batalkan janji temu", auth: "Owner Token", params: "id (path parameter)", body: null },
      ]
    }
  ]
};

// Icons components to avoid cluttering imports
function UsersIcon() { return <User className="w-5 h-5" />; }
function SettingsIcon() { return <Globe className="w-5 h-5" />; }
function LayersIcon() { return <Database className="w-5 h-5" />; }
function CreditCardIcon() { return <FileJson className="w-5 h-5" />; }
function PawPrintIcon() { return <AlertCircle className="w-5 h-5" />; }
function CalendarIcon() { return <List className="w-5 h-5" />; }
function ReportIcon() { return <BarChart3 className="w-5 h-5" />; }

const MethodBadge = ({ method }) => {
  const colors = {
    GET: 'bg-blue-100 text-blue-700 border-blue-200',
    POST: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PUT: 'bg-amber-100 text-amber-700 border-amber-200',
    PATCH: 'bg-amber-100 text-amber-700 border-amber-200',
    DELETE: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-md border ${colors[method] || 'bg-gray-100 text-gray-700'} w-16 text-center shadow-sm`}>
      {method}
    </span>
  );
};

const EndpointItem = ({ endpoint }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <MethodBadge method={endpoint.method} />
          <div className="font-mono text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            {endpoint.path}
          </div>
          <div className="text-sm font-medium text-slate-600 hidden md:block">
            {endpoint.desc}
          </div>
        </div>
        <div>
          {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-5 bg-slate-50 border-t border-slate-200">
          <div className="md:hidden text-sm font-medium text-slate-700 mb-4 pb-3 border-b border-slate-200">
            {endpoint.desc}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Authentication
              </h4>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-slate-700">{endpoint.auth}</span>
              </div>

              {endpoint.params && (
                <>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <List className="w-3.5 h-3.5" /> Parameters
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-600 mb-4 shadow-sm">
                    {endpoint.params}
                  </div>
                </>
              )}
            </div>
            
            {endpoint.body && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Request Body
                </h4>
                <div className="bg-slate-900 rounded-lg p-4 shadow-inner">
                  <pre className="text-xs font-mono text-emerald-400 overflow-x-auto">
                    <code>{endpoint.body}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Zeta Connect API Docs</h1>
                <p className="text-sm text-slate-500 font-medium">RESTful Endpoints Documentation</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 text-sm font-semibold shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              API v1.0 Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-4 mb-8">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'admin' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <Shield className={`w-4 h-4 ${activeTab === 'admin' ? 'text-indigo-200' : 'text-slate-400'}`} />
            Admin Endpoints
          </button>
          <button
            onClick={() => setActiveTab('owner')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'owner' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <Key className={`w-4 h-4 ${activeTab === 'owner' ? 'text-indigo-200' : 'text-slate-400'}`} />
            Owner Endpoints
          </button>
        </div>

        {/* Content */}
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {apiData[activeTab].map((group, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  {group.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{group.group}</h2>
              </div>
              
              <div>
                {group.endpoints.map((endpoint, idx) => (
                  <EndpointItem key={idx} endpoint={endpoint} />
                ))}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default ApiDocs;
