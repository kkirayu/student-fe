describe('E2E Modul (Bypass Login)', () => {

  const loginAs = (roleName, route) => {
    cy.visit(route, {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({
          id: 1,
          name: `Pengguna ${roleName}`,
          role: roleName,
          status: 'Aktif'
        }));
      }
    });
  }

  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('1: Modul Admin (Dashboard, Staff, Layanan)', () => {
    loginAs('Admin', '/admin')
    
    // Verifikasi Dashboard
    cy.contains('Dashboard').should('be.visible')
    cy.url().should('include', '/admin')

    // Fitur Admin: Manajemen Staff
    cy.intercept('GET', '**/api/users*', { body: [] }).as('getStaff')
    cy.visit('/admin/staff', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Admin', status: 'Aktif' }));
      }
    })
    cy.wait('@getStaff')
    cy.contains('Manajemen Staf').should('be.visible')

    // Tambah Staff
    cy.intercept('POST', '**/api/users*', { statusCode: 201, body: { success: true } }).as('addStaff')
    cy.visit('/admin/staff/add', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Admin', status: 'Aktif' }));
      }
    })
    cy.get('input[name="name"]').type('Staf Baru')
    cy.get('input[name="email"]').type('staf@test.com')
    cy.get('input[name="phone_number"]').type('08123456789')
    cy.get('select[name="role"]').select('Resepsionis')
    cy.get('input[name="password"]').type('password123')
    cy.get('select[name="status"]').select('Aktif')
    cy.get('textarea[name="address"]').type('Jl. Staf Baru')
    cy.get('button[type="submit"]').contains('Daftarkan Staf').click()
    cy.wait('@addStaff')
  })

  it('2: Modul Dokter (Antrean & Rekam Medis)', () => {
    loginAs('Dokter', '/doctor')
    
    // Verifikasi Dashboard Dokter
    cy.url().should('include', '/doctor')
    cy.contains('Dashboard').should('be.visible')

    // Akses Daftar Antrean
    cy.visit('/doctor/waiting-list', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Dokter', status: 'Aktif' }));
      }
    })
    cy.contains('Daftar Antrean Pasien').should('be.visible')

    // Akses SOAP (Rekam Medis)
    cy.visit('/doctor/soap', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Dokter', status: 'Aktif' }));
      }
    })
    cy.contains('Form Rekam Medis').should('be.visible')
  })

  it('3: Modul Owner (Manajemen Hewan & Booking)', () => {
    loginAs('Owner', '/owner')
    
    // Verifikasi Dashboard Owner
    cy.url().should('include', '/owner')
    cy.contains('Dashboard').should('be.visible')

    // Fitur Owner: Tambah Pet (Negative & Positive)
    cy.intercept('GET', '**/api/pets*', { body: [] }).as('getPets')
    cy.visit('/owner/pets', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Owner', status: 'Aktif' }));
      }
    })
    cy.wait('@getPets')

    cy.visit('/owner/pets/add', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Owner', status: 'Aktif' }));
      }
    })
    cy.get('h1').contains('Tambah Pets Baru').should('be.visible')
    
    // Negative Case Input Angka
    cy.get('input[name="name"]').type('Boba123').should('have.value', 'Boba')
    cy.get('input[name="species"]').type('Kucing1').should('have.value', 'Kucing')
    cy.get('input[name="breed"]').type('Anggora2').should('have.value', 'Anggora')
    
    // Positive Input
    cy.get('input[name="dob"]').type('2022-05-05')
    cy.get('select[name="gender"]').select('Betina')
    cy.get('input[name="color"]').type('Putih')
    
    cy.intercept('POST', '**/api/pets*', { statusCode: 201, body: { success: true } }).as('addPet')
    cy.get('button[type="submit"]').contains('Simpan Data').click()
    cy.wait('@addPet')

    // Fitur Owner: Buat Janji Temu
    cy.intercept('GET', '**/api/*pets*', { body: [{ id: 1, name: 'Boba' }] }).as('getDropdownPets')
    cy.intercept('GET', '**/api/services*', { body: [{ id: 1, name: 'Pemeriksaan Rutin', price: 100000 }] }).as('getDropdownServices')
    
    cy.visit('/owner/booking', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Owner', status: 'Aktif' }));
      }
    })
    cy.wait(['@getDropdownPets', '@getDropdownServices'])

    cy.get('select[name="pet_id"]').select('1')
    cy.get('select[name="service_id"]').select('1')
    
    const besok = new Date()
    besok.setDate(besok.getDate() + 1)
    cy.get('input[name="schedule_date"]').type(besok.toISOString().split('T')[0])
    cy.get('select[name="schedule_time"]').select('10:00')
    
    cy.get('textarea[name="initial_complaint"]').type('Boba butuh cek rutin tahunan karena sudah lama tidak divaksin dan saya ingin memastikan kesehatannya baik.')
    
    cy.intercept('POST', '**/api/appointments*', { statusCode: 201, body: { id: 99, status: 'Menunggu' } }).as('createAppointment')
    cy.get('button[type="submit"]').contains('Ajukan Janji Temu').click()
    cy.wait('@createAppointment')
    cy.url().should('include', '/ticket')
  })

  it('4: Modul Resepsionis (Monitor Antrean)', () => {
    loginAs('Resepsionis', '/receptionist')
    cy.url().should('include', '/receptionist')
    cy.contains('Dashboard').should('be.visible')
    
    cy.visit('/receptionist/queue-monitor', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Resepsionis', status: 'Aktif' }));
      }
    })
    cy.contains('Monitor Antrean').should('be.visible')
  })

  it('5: Modul Apotek / Farmasi (Katalog Produk)', () => {
    loginAs('Farmasi', '/pharmacy')
    cy.url().should('include', '/pharmacy')
    cy.contains('Dashboard').should('be.visible')
    
    cy.visit('/pharmacy/inventory', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Farmasi', status: 'Aktif' }));
      }
    })
    cy.contains('Katalog Produk').should('be.visible')
  })

  it('6: Modul Kasir (POS / Transaksi)', () => {
    loginAs('Kasir', '/cashier')
    cy.url().should('include', '/cashier')
    cy.contains('Dashboard').should('be.visible')
    
    cy.visit('/cashier/checkout', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-token-bypass');
        win.localStorage.setItem('user', JSON.stringify({ role: 'Kasir', status: 'Aktif' }));
      }
    })
    cy.contains('Kasir POS').should('be.visible')
  })

})
