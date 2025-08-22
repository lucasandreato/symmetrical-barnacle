class HomePage {
  // Elementos
  elements = {
    title: () => cy.get('h1').contains('Serverest Store'),
    searchInput: () => cy.get('[data-testid="pesquisar"]'),
    productCards: () => cy.get('.card'),
    productTitle: () => cy.get('.card-title'),
    productPrice: () => cy.get('.preco'),
    addToCartButton: () => cy.get('[data-testid*="adicionarNaLista"]'),
    cartButton: () => cy.get('[data-testid="carrinho"]'),
    logoutButton: () => cy.get('[data-testid="logout"]'),
    adminAreaButton: () => cy.get('[data-testid="cadastrar-produtos"]')
  }

  // Métodos
  visit() {
    cy.visit('/')
    return this
  }

  searchProduct(productName) {
    this.elements.searchInput().type(productName)
    return this
  }

  addFirstProductToCart() {
    this.elements.addToCartButton().first().click()
    return this
  }

  goToCart() {
    this.elements.cartButton().click()
    return this
  }

  logout() {
    this.elements.logoutButton().click()
    return this
  }

  goToAdminArea() {
    this.elements.adminAreaButton().click()
    return this
  }

  // Validações
  shouldBeVisible() {
    this.elements.title().should('be.visible')
    return this
  }

  shouldDisplayProducts() {
    this.elements.productCards().should('have.length.greaterThan', 0)
    return this
  }

  shouldDisplaySearchResults(searchTerm) {
    this.elements.productTitle().should('contain', searchTerm)
    return this
  }

  shouldShowAdminButton() {
    this.elements.adminAreaButton().should('be.visible')
    return this
  }
}

export default HomePage
