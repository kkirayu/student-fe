describe('Admin Module', () => {
  beforeEach(() => {
    // Set viewport ke ukuran desktop agar sidebar tidak tertutup (responsive issue)
    cy.viewport(1280, 720)
  })

  describe('Staff Management (/admin/staff)', () => {
    beforeEach(() => {
      cy.visit('/admin/staff')
    })

    it('memuat halaman Manajemen Staf dengan benar', () => {
      cy.get('h1').contains('Manajemen Staf').should('be.visible')
      cy.contains('p', 'Kelola hak akses dan data pegawai klinik').should('be.visible')

      cy.contains('a', 'Tambah Staf Baru').should('be.visible')

      cy.get('input[placeholder="Cari nama atau email staf..."]').should('be.visible')

      cy.get('select').find('option').contains('Semua Role').should('exist')
    })

    it('dapat mengetik pada input pencarian staf', () => {
      cy.get('input[placeholder="Cari nama atau email staf..."]')
        .type('admin')
        .should('have.value', 'admin')
    })
  })

  describe('Service Rates Management (/admin/services)', () => {
    beforeEach(() => {
      cy.visit('/admin/services')
    })

    it('memuat halaman Daftar Layanan & Tarif dengan benar', () => {
      cy.get('h1').contains('Daftar Layanan & Tarif').should('be.visible')
      cy.contains('p', 'Kelola rincian layanan dan harga').should('be.visible')

      cy.contains('a', 'Tambah Layanan Baru').should('be.visible')

      cy.get('input[placeholder="Cari nama layanan..."]').should('be.visible')

      cy.get('select').find('option').contains('Semua Kategori').should('exist')
      cy.get('select').find('option').contains('Vaksin').should('exist')
    })

    it('dapat menggunakan filter kategori', () => {
      cy.get('select').select('Vaksin')
      cy.get('select').should('have.value', 'Vaksin')
    })
  })

})
