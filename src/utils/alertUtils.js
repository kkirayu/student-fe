import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Konfigurasi dasar agar sesuai dengan tema Tailwind
const baseConfig = {
    customClass: {
        confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mx-2 font-medium',
        cancelButton: 'bg-slate-200 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-300 transition-colors mx-2 font-medium',
        popup: 'rounded-xl shadow-xl border border-slate-100 pb-4',
        title: 'text-slate-800 font-bold text-xl pt-4',
        htmlContainer: 'text-slate-600 text-sm mt-2',
    },
    buttonsStyling: false,
};

export const showSuccess = (title, text) => {
    return MySwal.fire({
        ...baseConfig,
        icon: 'success',
        title: title || 'Berhasil!',
        text: text,
        confirmButtonText: 'OK',
    });
};

export const showError = (title, text) => {
    return MySwal.fire({
        ...baseConfig,
        icon: 'error',
        title: title || 'Terjadi Kesalahan',
        text: text,
        confirmButtonText: 'Tutup',
    });
};

export const showInfo = (title, text) => {
    return MySwal.fire({
        ...baseConfig,
        icon: 'info',
        title: title || 'Informasi',
        text: text,
        confirmButtonText: 'OK',
    });
};

export const showWarning = (title, text) => {
    return MySwal.fire({
        ...baseConfig,
        icon: 'warning',
        title: title || 'Peringatan',
        text: text,
        confirmButtonText: 'Mengerti',
    });
};

/**
 * Menampilkan modal konfirmasi dengan opsi Ya/Batal.
 * 
 * @param {string} title - Judul modal
 * @param {string} text - Teks deskripsi modal
 * @param {string} confirmText - Teks pada tombol konfirmasi (default: 'Ya, Lanjutkan')
 * @param {boolean} isDanger - Jika true, tombol konfirmasi berwarna merah (default: false)
 * @returns {Promise<boolean>} - Mengembalikan true jika pengguna menekan konfirmasi
 */
export const showConfirm = async (title, text, confirmText = 'Ya, Lanjutkan', isDanger = false) => {
    
    const customConfig = { ...baseConfig };
    
    // Jika aksi berbahaya (seperti hapus), warna tombol merah
    if (isDanger) {
        customConfig.customClass = {
            ...customConfig.customClass,
            confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors mx-2 font-medium',
        };
    }

    const result = await MySwal.fire({
        ...customConfig,
        icon: isDanger ? 'warning' : 'question',
        title: title || 'Konfirmasi',
        text: text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: 'Batal',
        reverseButtons: true, // Tombol Batal di kiri, Konfirmasi di kanan
    });

    return result.isConfirmed;
};
