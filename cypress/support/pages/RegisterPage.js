class RegisterPage {
  // Elementos
  elements = {
    nameInput: () => cy.get('[data-testid="nome"]'),
    emailInput: () => cy.get('[data-testid="email"]'),
    passwordInput: () => cy.get('[data-testid="password"]'),
    adminCheckbox: () => cy.get('[data-testid="checkbox"]'),
    registerButton: () => cy.get('[data-testid="cadastrar"]'),
    loginLink: () => cy.contains('Já é cadastrado?'),
    alertMessage: () => cy.get('.alert'),
    adminArea: () => cy.get('h1').contains('Bem Vindo')
  }

  // Métodos
  visit() {
    cy.visit('/cadastrarusuarios')
    return this
  }

  fillName(name) {
    this.elements.nameInput().clear().type(name)
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

  checkAdminOption() {
    this.elements.adminCheckbox().check()
    return this
  }

  clickRegister() {
    this.elements.registerButton().click()
    return this
  }

  register(userData) {
    this.fillName(userData.nome)
    this.fillEmail(userData.email)
    this.fillPassword(userData.password)
    
    if (userData.administrador === 'true') {
      this.checkAdminOption()
    }
    
    this.clickRegister()
    return this
  }

  // Validações
  shouldDisplayAlert(message) {
    this.elements.alertMessage().should('contain', message)
    return this
  }

  shouldRedirectToAdmin() {
    this.elements.adminArea().should('be.visible')
    return this
  }

  shouldStayOnRegisterPage() {
    cy.url().should('contain', '/cadastrarusuarios')
    return this
  }
}

export default RegisterPage
