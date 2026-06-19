describe('Full E2E Journey (Landing -> Admin -> Owner)', () => {

  beforeEach(() => {
    cy.viewport(1280, 720)
  })

  it('1 & 2: Landing Page dan Login via Akses Cepat', () => {
    cy.visit('/')
    // Verifikasi Landing Page
    cy.get('nav').should('be.visible')

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
    // Isi field krusial (asumsi id input sama dengan namenya)
    cy.get('input[name="name"]').type('Boba')
    cy.get('input[name="species"]').type('Anjing')
    cy.get('input[name="breed"]').type('Golden')
    cy.get('input[name="dob"]').type('2022-05-05')
    cy.get('select[name="gender"]').select('Betina')
    cy.get('input[name="color"]').type('Coklat')

    // Asumsi tombol submit
    cy.get('button[type="submit"]').contains('Simpan').click()
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

    cy.get('select[name="booking_type"]').select('Online')

    // Pilih tanggal besok
    const besok = new Date()
    besok.setDate(besok.getDate() + 1)
    const tglBesok = besok.toISOString().split('T')[0]
    cy.get('input[name="schedule_date"]').type(tglBesok)

    cy.get('select[name="schedule_time"]').select('10:00')
    cy.get('textarea[name="initial_complaint"]').type('Milo butuh cek rutin tahunan')

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
