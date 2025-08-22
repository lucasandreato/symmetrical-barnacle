class LoginPage {
  // Elementos
  elements = {
    emailInput: () => cy.get('[data-testid="email"]'),
    passwordInput: () => cy.get('[data-testid="senha"]'),
    loginButton: () => cy.get('[data-testid="entrar"]'),
    registerLink: () => cy.get('[data-testid="cadastrar"]'),
    alertMessage: () => cy.get('.alert'),
    homeTitle: () => cy.get('h1').contains('Serverest Store')
  }

  // Métodos
  visit() {
    cy.visit('/login')
    return this
  }

  fillEmail(email) {
    this.elements.emailInput().clear().type(email)
    return this
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password)
    return this
  }

  clickLogin() {
    this.elements.loginButton().click()
    return this
  }

  clickRegister() {
    this.elements.registerLink().click()
    return this
  }

  login(email, password) {
    this.fillEmail(email)
    this.fillPassword(password)
    this.clickLogin()
    return this
  }

  // Validações
  shouldDisplayAlert(message) {
    this.elements.alertMessage().should('contain', message)
    return this
  }

  shouldRedirectToHome() {
    this.elements.homeTitle().should('be.visible')
    cy.url().should('not.contain', '/login')
    return this
  }

  shouldStayOnLoginPage() {
    cy.url().should('contain', '/login')
    return this
  }
}

export default LoginPage
