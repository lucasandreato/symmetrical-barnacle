import LoginPage from '../../support/pages/LoginPage'
import HomePage from '../../support/pages/HomePage'

describe('Testes E2E - Gerenciamento de Produtos', () => {
  const loginPage = new LoginPage()
  const homePage = new HomePage()

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      loginPage.visit()
      loginPage.login(users.validUser.email, users.validUser.password)
    })
  })

  it('Deve visualizar a lista de produtos na página inicial', () => {
    homePage
      .shouldBeVisible()
      .shouldDisplayProducts()

    // Validar se os produtos têm as informações básicas
    homePage.elements.productCards().each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.card-title').should('not.be.empty')
        cy.get('.preco').should('contain', 'R$')
        cy.get('[data-testid*="adicionarNaLista"]').should('be.visible')
      })
    })
  })

  it('Deve realizar busca de produtos', () => {
    const searchTerm = 'Samsung'
    
    homePage
      .searchProduct(searchTerm)
      .shouldDisplaySearchResults(searchTerm)

    // Validar se todos os resultados contêm o termo buscado
    homePage.elements.productTitle().each(($title) => {
      cy.wrap($title).should('contain', searchTerm)
    })
  })

  it('Deve adicionar produto ao carrinho', () => {
    // Capturar informações do primeiro produto
    let productInfo = {}
    
    homePage.elements.productCards().first().within(() => {
      cy.get('.card-title').invoke('text').then((title) => {
        productInfo.title = title.trim()
      })
      
      cy.get('.preco').invoke('text').then((price) => {
        productInfo.price = price.trim()
      })
    })

    homePage.addFirstProductToCart()

    // Verificar se o produto foi adicionado (pode haver uma confirmação visual)
    cy.get('.alert, .toast, .notification').should('be.visible')
    
    // Navegar para o carrinho para confirmar
    homePage.goToCart()
    
    // Validar se chegou na página do carrinho
    cy.url().should('contain', 'carrinho')
    cy.get('h1').should('contain', 'Lista de Compras')
  })
})
