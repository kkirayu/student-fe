describe('Full E2E Journey (Landing -> Admin -> Owner)', () => {

  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('0: Pendaftaran Akun (Register)', () => {
    cy.visit('/register')
    
    // Negative Case 1: Nama diisi angka (harusnya tersaring)
    cy.get('input[placeholder="Masukkan nama lengkap Anda"]').type('Budi123').should('have.value', 'Budi')

    // Negative Case 2: Email salah format
    cy.get('input[placeholder="nama@email.com"]').type('budi@yahoo.com')
    cy.get('input[placeholder="Contoh: 08123456789"]').type('08123456789')
    cy.get('textarea[placeholder="Masukkan alamat lengkap..."]').type('Jl. Kebenaran')
    cy.get('input[placeholder="Minimal 6 karakter"]').type('123456')
    cy.get('input[placeholder="Ulangi kata sandi"]').type('123456')
    
    cy.contains('button', 'Daftar Sekarang').click()
    cy.contains('Email harus berformat @gmail.com!').should('be.visible')
    cy.get('button').contains('Tutup').click()

    // Negative Case 3: Nomor HP tidak diawali 0 / lebih dari 13 digit
    cy.get('input[placeholder="nama@email.com"]').clear().type('budi@gmail.com')
    cy.get('input[placeholder="Contoh: 08123456789"]').clear().type('81234567890123')
    cy.contains('button', 'Daftar Sekarang').click()
    cy.contains('Nomor HP maksimal 13 digit angka dan harus dimulai dengan 0!').should('be.visible')
    cy.get('button').contains('Tutup').click()

    // Positive Case
    cy.get('input[placeholder="Contoh: 08123456789"]').clear().type('08123456789')
    cy.contains('button', 'Daftar Sekarang').click()
    cy.contains('Pendaftaran Berhasil!').should('be.visible')
    cy.get('button').contains('Lanjutkan').click()
    
    // Memastikan diredirect ke login
    cy.url().should('include', '/login')
  })

  it('1: Eksplorasi Landing Page, Info Layanan & Umpan Balik', () => {
    cy.visit('/')
    
    // Verifikasi Landing Page
    cy.get('nav').should('be.visible')
    
    // Scroll landing page sampai footer
    cy.scrollTo('bottom', { duration: 1000 })
    cy.get('footer').should('be.visible')
    
    // Scroll kembali ke atas
    cy.scrollTo('top', { duration: 500 })
    
    // Buka menu di mobile jika viewport kecil (optional), viewport diset 1280x720 jadi navbar desktop terlihat
    // Klik menu info layanan
    cy.contains('button', 'Informasi Layanan').click()
    
    // Verify diredirect ke info-layanan
    cy.url().should('include', '/info-layanan')
    
    // Scroll di Info Layanan
    cy.scrollTo('bottom', { duration: 1000 })
    cy.scrollTo('top', { duration: 500 })
    
    // Cari nama dokter
    cy.get('input[placeholder="Cari nama dokter..."]').type('Budi')
    cy.contains('Drh. Budi Santoso').should('be.visible')
    cy.get('input[placeholder="Cari nama dokter..."]').clear()
    
    // Filter hari dan spesialisasi
    cy.get('select').eq(0).select('Senin') // Value: Senin
    cy.get('select').eq(1).select('Dokter Hewan Umum') // Value: Dokter Hewan Umum
    cy.contains('Dokter Hewan Umum').should('be.visible')

    // Melakukan Umpan Balik
    cy.visit('/feedback')
    cy.get('input[placeholder="Masukkan nama Anda"]').type('Pengguna Test')
    cy.get('input[placeholder="Contoh: 08123456789"]').type('08123456789')
    
    // Pilih tipe umpan balik
    cy.contains('button', 'Saran').click()
    
    // Isi pesan
    cy.get('textarea[placeholder="Ceritakan pengalaman Anda di sini..."]').type('Website ini sangat bagus, saya suka fitur info layanannya. Semangat terus!')
    
    // Submit Umpan Balik
    cy.contains('button', 'Kirim Umpan Balik').click()
    
    // Verifikasi popup SweetAlert muncul
    cy.contains('Terima kasih atas umpan balik Anda!').should('be.visible')
    cy.get('.swal2-confirm').click() // Tutup popup
  })

  it('2: Login via Akses Cepat', () => {
    // Pergi ke Login (asumsikan tombol login punya href="/login" atau teks "Masuk")
    cy.visit('/login')
    cy.contains('Akses Cepat Demo').should('be.visible')

    // Klik login Admin
    cy.contains('button', 'Admin').click()
    cy.url().should('include', '/admin')
    cy.contains('Dashboard').should('be.visible')
  })

  it('3: CRUD & Filter Management Staff', () => {
    // Intercept GET Staff
    cy.intercept('GET', '**/api/users*', {
      body: [
        { id: 1, name: 'Budi Admin', email: 'admin@test.com', role: 'Admin', status: 'Aktif' },
        { id: 2, name: 'Siti Resepsionis', email: 'siti@test.com', role: 'Resepsionis', status: 'Aktif' }
      ]
    }).as('getStaff')

    cy.visit('/admin/staff')
    cy.wait('@getStaff')

    cy.get('input[placeholder="Cari nama atau email staf..."]').type('Siti')
    cy.contains('Siti Resepsionis').should('be.visible')
    cy.get('input[placeholder="Cari nama atau email staf..."]').clear()

    cy.get('select').select('Admin')
    cy.contains('Budi Admin').should('be.visible')
    cy.contains('Siti Resepsionis').should('not.exist')

    cy.intercept('POST', '**/api/users*', { statusCode: 201, body: { success: true } }).as('addStaff')
    cy.visit('/admin/staff/add')
    cy.get('input[name="name"]').type('User Baru')
    cy.get('input[name="email"]').type('baru@test.com')
    cy.get('input[name="phone_number"]').type('08123456789')
    cy.get('select[name="role"]').select('Dokter')
    cy.get('input[name="password"]').type('123456')
    cy.get('select[name="status"]').select('Aktif')
    cy.get('textarea[name="address"]').type('Jl. Baru')
    cy.get('button[type="submit"]').contains('Daftarkan Staf').click()
    cy.wait('@addStaff')
  })

  it('4: Show, Filter, Search Audit Log', () => {
    cy.intercept('GET', '**/api/audit-logs*', {
      body: {
        data: [
          { id: 1, timestamp: '2023-10-01 10:00', user: 'Admin 1', role: 'Admin', action: 'Login ke sistem', severity: 'Normal' },
          { id: 2, timestamp: '2023-10-01 11:00', user: 'Kasir 1', role: 'Kasir', action: 'Menghapus transaksi', severity: 'Tinggi' }
        ]
      }
    }).as('getLogs')

    cy.visit('/admin/audit-logs')
    cy.wait('@getLogs')

    cy.contains('Audit Log Sistem').should('be.visible')
    cy.contains('Admin 1').should('be.visible')
    cy.contains('Kasir 1').should('be.visible')

    // Search
    cy.get('input[placeholder="Cari pelaku atau tindakan..."]').type('Menghapus')
    cy.contains('Kasir 1').should('be.visible')
    cy.contains('Admin 1').should('not.exist')
  })

  it('5: CRUD & Filter Layanan dan Tarif', () => {
    cy.intercept('GET', '**/api/admin/services*', {
      body: [
        { id: 1, name: 'Vaksin Rabies', category: 'Vaksin', price: 150000, status: 'Tersedia' }
      ]
    }).as('getServices')

    cy.visit('/admin/services')
    cy.wait('@getServices')

    // Tambah Layanan (Negative & Positive)
    cy.visit('/admin/services/add')
    cy.get('input[name="name"]').type('Layanan Test')
    cy.get('select[name="category"]').select('Medis')
    cy.get('select[name="status"]').select('Tersedia')
    
    // Negative Case 1: Harga > 15 digit
    cy.get('input[name="price"]').type('1234567890123456') // 16 digits
    cy.get('button[type="submit"]').click()
    cy.contains('Harga maksimal 15 digit.').should('be.visible')
    cy.get('.swal2-confirm').click() // Close SweetAlert

    // Negative Case 2: Deskripsi kurang dari 10 kata
    cy.get('input[name="price"]').clear().type('150000')
    cy.get('textarea[name="description"]').type('Cuma tiga kata')
    cy.get('button[type="submit"]').click()
    cy.contains('Deskripsi minimal 10 kata dan maksimal 200 kata.').should('be.visible')
    cy.get('.swal2-confirm').click()

    // Positive Case
    cy.get('textarea[name="description"]').clear().type('Ini adalah deskripsi layanan yang sangat panjang dan pasti lebih dari sepuluh kata untuk lulus dari validasi form kita.')
    cy.intercept('POST', '**/api/admin/services*', { statusCode: 201, body: { success: true } }).as('addService')
    cy.get('button[type="submit"]').click()
    cy.wait('@addService')
    cy.contains('Layanan baru berhasil ditambahkan!').should('be.visible')
    cy.get('.swal2-confirm').click()
    
    // Back to list, check filter & search & delete
    cy.visit('/admin/services')
    cy.wait('@getServices')

    cy.get('input[placeholder="Cari nama layanan..."]').type('Rabies')
    cy.contains('Vaksin Rabies').should('be.visible')

    // Select filter
    cy.get('select').select('Vaksin')
    cy.contains('Vaksin Rabies').should('be.visible')

    // Simulasi Delete
    cy.intercept('DELETE', '**/api/admin/services/1*', { statusCode: 200, body: { success: true } }).as('deleteService')
    cy.get('button').find('.lucide-trash-2').first().click()
    cy.get('.swal2-confirm').should('be.visible').click()
    cy.wait('@deleteService')
  })

  it('6 & 7: Pindah ke Owner & CRUD Hewan Peliharaan', () => {
    // 6. Pindah ke Owner
    cy.visit('/login')
    cy.contains('button', 'Pet Owner').click()
    cy.url().should('include', '/owner')

    // 7. CRUD Hewan Peliharaan
    cy.intercept('GET', '**/api/pets*', {
      body: [
        { id: 1, name: 'Milo', species: 'Kucing', breed: 'Anggora', gender: 'Jantan', dob: '2020-01-01', color: 'Putih' }
      ]
    }).as('getPets')

    cy.visit('/owner/pets')
    cy.wait('@getPets')

    // Search Pet
    cy.get('input[placeholder="Cari nama pet atau jenis..."]').type('Milo')
    cy.contains('Milo').should('be.visible')

    // Simulasi Tambah (Add Pet)
    cy.intercept('POST', '**/api/pets*', { statusCode: 201, body: { success: true } }).as('addPet')
    cy.visit('/owner/pets/add')
    cy.get('h1').contains('Tambah Pets Baru').should('be.visible')
    
    // Negative Case: Input angka di nama, species, breed
    cy.get('input[name="name"]').type('Boba123').should('have.value', 'Boba')
    cy.get('input[name="species"]').type('Anjing1').should('have.value', 'Anjing')
    cy.get('input[name="breed"]').type('Golden2').should('have.value', 'Golden')
    
    // Negative Case: DOB has max attribute (today)
    const today = new Date().toISOString().split('T')[0]
    cy.get('input[name="dob"]').should('have.attr', 'max', today)

    // Isi field krusial (asumsi id input sama dengan namenya)
    cy.get('input[name="dob"]').type('2022-05-05')
    cy.get('select[name="gender"]').select('Betina')
    cy.get('input[name="color"]').type('Coklat')

    // Asumsi tombol submit
    cy.get('button[type="submit"]').contains('Simpan Data').click()
    cy.wait('@addPet')
  })

  it('8: Buat Janji Temu (Owner)', () => {
    // Intercept both /owner/pets and /pets as AppointmentForm tries both
    cy.intercept('GET', '**/api/*pets*', {
      body: [{ id: 1, name: 'Milo' }]
    }).as('getDropdownPets')

    cy.intercept('GET', '**/api/services*', {
      body: [{ id: 1, name: 'Pemeriksaan Rutin', price: 100000 }]
    }).as('getDropdownServices')

    cy.visit('/owner/booking')
    cy.wait(['@getDropdownPets', '@getDropdownServices'])

    // Form Isi
    cy.get('select[name="pet_id"]').select('1')
    cy.get('select[name="service_id"]').select('1')

    // Mengecek apakah harga muncul otomatis setelah service dipilih
    cy.contains('Rp').should('be.visible')

    // booking_type disembunyikan dan defaultnya online, jadi tidak perlu diselect lagi
    // cy.get('select[name="booking_type"]').select('Online')

    // Pilih tanggal besok
    const besok = new Date()
    besok.setDate(besok.getDate() + 1)
    const tglBesok = besok.toISOString().split('T')[0]
    cy.get('input[name="schedule_date"]').type(tglBesok)

    cy.get('select[name="schedule_time"]').select('10:00')
    
    // Negative Case: Keluhan awal < 10 kata
    cy.get('textarea[name="initial_complaint"]').type('Milo butuh cek rutin tahunan')
    cy.get('button[type="submit"]').contains('Ajukan Janji Temu').click()
    cy.contains('Keluhan awal minimal 10 kata dan maksimal 200 kata.').should('be.visible')
    
    // Positive Case:
    cy.get('textarea[name="initial_complaint"]').clear().type('Milo butuh cek rutin tahunan karena sudah lama tidak divaksin dan saya ingin memastikan kesehatannya baik.')

    // Simulasi POST
    cy.intercept('POST', '**/api/appointments*', {
      statusCode: 201,
      body: { id: 99, owner_id: 1, status: 'Menunggu' }
    }).as('createAppointment')

    cy.get('button[type="submit"]').contains('Ajukan Janji Temu').click()
    cy.wait('@createAppointment')

    // Setelah submit harusnya redirect ke ticket
    cy.url().should('include', '/ticket')
  })

})
