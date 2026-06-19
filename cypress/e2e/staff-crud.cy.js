describe('Staff Management CRUD', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.intercept('GET', '**/users', { body: [{ id: 1, name: 'Budi Test', email: 'budi@test.com', phone_number: '0812345678', role: 'Dokter', status: 'Aktif' }] }).as('getStaff')
  })

  it('Dapat menambah staf baru (Add)', () => {
    cy.intercept('POST', '**/users', { statusCode: 201, body: { success: true, message: 'Berhasil' } }).as('addStaff')

    cy.visit('/admin/staff/add')

    cy.get('h1').contains('Tambah Staf Baru').should('be.visible')

    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('john.doe@klinik.com')
    cy.get('input[name="phone_number"]').type('081234567890')
    cy.get('select[name="role"]').select('Dokter')
    cy.get('input[name="password"]').type('password123')
    cy.get('select[name="status"]').select('Aktif')
    cy.get('textarea[name="address"]').type('Jl. Merdeka No. 123, Jakarta')

    cy.get('button[type="submit"]').contains('Daftarkan Staf').click()

    cy.wait('@addStaff').its('request.body').should('deep.include', {
      name: 'John Doe',
      email: 'john.doe@klinik.com',
      role: 'Dokter'
    })

    cy.url().should('include', '/admin/staff')
  })

  it('Dapat mengedit data staf (Edit)', () => {
    cy.intercept('GET', '**/users/1', {
      statusCode: 200,
      body: {
        success: true,
        data: { id: 1, name: 'Budi Test', email: 'budi@test.com', phone_number: '0812345678', role: 'Dokter', status: 'Aktif', address: 'Jl. Lama' }
      }
    }).as('getStaffDetail')
    cy.intercept('PUT', '**/users/1', { statusCode: 200, body: { success: true, message: 'Berhasil' } }).as('editStaff')

    cy.visit('/admin/staff/edit/1')
    cy.wait('@getStaffDetail')

    cy.get('h1').contains('Edit Data Staf').should('be.visible')

    cy.get('input[name="name"]').clear().type('Budi Update')
    cy.get('button[type="submit"]').contains('Simpan Perubahan').click()

    cy.wait('@editStaff').its('request.body').should('deep.include', {
      name: 'Budi Update'
    })
  })

  it('Dapat menghapus data staf (Delete)', () => {
    cy.intercept('DELETE', '**/users/1', { statusCode: 200, body: { success: true } }).as('deleteStaff')

    cy.visit('/admin/staff')
    cy.wait('@getStaff')

    cy.get('button[title="Hapus Akun"]').first().click()

    cy.get('.swal2-confirm').should('be.visible').click()

    cy.wait('@deleteStaff')
    cy.get('.swal2-title').contains('Berhasil').should('be.visible')
  })
})
