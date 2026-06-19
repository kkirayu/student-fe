describe('Basic Routing Navigation', () => {
  it('loads the main landing page', () => {
    cy.visit('/')
    // Ensure that it doesn't render the 404 page
    cy.contains('404').should('not.exist')
  })

  it('loads the registration page', () => {
    cy.visit('/register')
    // We expect some registration related text to exist, like "Daftar" or "Buat Akun"
    cy.contains('Daftar', { matchCase: false }).should('be.visible')
  })

  it('loads the login page', () => {
    cy.visit('/login')
    cy.contains('Selamat Datang Kembali', { matchCase: false }).should('be.visible')
  })

  it('shows 404 for unknown routes', () => {
    cy.visit('/this-route-does-not-exist', { failOnStatusCode: false })
    cy.contains('404').should('be.visible')
    cy.contains('Halaman tidak ditemukan').should('be.visible')
  })
})
