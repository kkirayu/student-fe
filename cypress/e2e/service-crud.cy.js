describe('Service Rates Management CRUD', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    // Mock API response
    cy.intercept('GET', '**/services', { 
      body: [{ id: 1, name: 'Vaksin Rabies', category: 'Vaksin', price: 150000, status: 'Tersedia' }] 
    }).as('getServices')
  })

  it('Dapat menambah layanan baru (Add)', () => {
    cy.intercept('POST', '**/services', { statusCode: 201, body: { success: true } }).as('addService')
    
    cy.visit('/admin/services/add')
    cy.get('h1').contains('Tambah Layanan Baru').should('be.visible')
    
    // Isi Form
    cy.get('input[name="name"]').type('Grooming Kucing Reguler')
    cy.get('select[name="category"]').select('Grooming')
    cy.get('input[name="price"]').type('80000')
    cy.get('select[name="status"]').select('Tersedia')

    // Submit
    cy.get('button[type="submit"]').contains('Simpan Layanan').click()
    
    // Verifikasi API dipanggil
    cy.wait('@addService').its('request.body').should('deep.include', {
      name: 'Grooming Kucing Reguler',
      category: 'Grooming',
      price: '80000'
    })
  })

  it('Dapat mengedit data layanan (Edit)', () => {
    // Mock detail
    cy.intercept('GET', '**/services/1', { 
      statusCode: 200, 
      body: { 
        success: true, 
        data: { id: 1, name: 'Vaksin Rabies', category: 'Vaksin', price: 150000, status: 'Tersedia' }
      } 
    }).as('getServiceDetail')
    cy.intercept('PUT', '**/services/1', { statusCode: 200, body: { success: true } }).as('editService')

    cy.visit('/admin/services/edit/1')
    cy.wait('@getServiceDetail')

    cy.get('h1').contains('Edit Layanan').should('be.visible')

    // Ubah data harga
    cy.get('input[name="price"]').clear().type('160000')
    cy.get('button[type="submit"]').contains('Simpan Perubahan').click()

    cy.wait('@editService').its('request.body').should('deep.include', {
      price: '160000'
    })
  })

  it('Dapat menghapus data layanan (Delete)', () => {
    cy.intercept('DELETE', '**/services/1', { statusCode: 200, body: { success: true } }).as('deleteService')
    
    cy.visit('/admin/services')
    cy.wait('@getServices')

    // Cari tombol delete dan klik icon Trash2 (terletak di class hover:text-red-500)
    cy.get('button').find('.lucide-trash-2').first().click()

    // SweetAlert Konfirmasi
    cy.get('.swal2-confirm').should('be.visible').click()

    cy.wait('@deleteService')
    cy.get('.swal2-title').contains('Berhasil').should('be.visible')
  })
})
