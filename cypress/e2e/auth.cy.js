describe('Authentication Flow', () => {
  beforeEach(() => {
    // Vite dev server default port
    cy.visit('/login')
  })

  it('displays the login page correctly', () => {
    cy.contains('Selamat Datang Kembali').should('be.visible')
    cy.get('input[placeholder="Masukkan username atau email"]').should('be.visible')
    cy.get('input[placeholder="Masukkan kata sandi"]').should('be.visible')
    cy.contains('button', 'Masuk').should('be.visible')
  })

  it('shows error if reCAPTCHA is not checked', () => {
    cy.get('input[placeholder="Masukkan username atau email"]').type('testuser')
    cy.get('input[placeholder="Masukkan kata sandi"]').type('password123')
    cy.contains('button', 'Masuk').click()

    // Assuming the popup component renders a specific text
    cy.contains('Verifikasi Gagal').should('be.visible')
    cy.contains('Silakan centang kotak reCAPTCHA untuk memastikan Anda bukan robot.').should('be.visible')
  })

  it('successfully redirects to OTP on correct login flow', () => {
    cy.get('input[placeholder="Masukkan username atau email"]').type('testuser')
    cy.get('input[placeholder="Masukkan kata sandi"]').type('password123')
    
    // Check the reCAPTCHA dummy checkbox
    cy.get('input[type="checkbox"]').check()

    cy.contains('button', 'Masuk').click()

    // It should navigate to /otp-verification
    cy.url().should('include', '/otp-verification')
  })
})
