import LoginPage from '../../support/pages/LoginPage'
import HomePage from '../../support/pages/HomePage'

describe('Testes E2E - Login', () => {
  const loginPage = new LoginPage()
  const homePage = new HomePage()

  beforeEach(() => {
    loginPage.visit()
  })

  it('Deve realizar login com credenciais válidas', () => {
    cy.fixture('users').then((users) => {
      loginPage
        .login(users.validUser.email, users.validUser.password)
        .shouldRedirectToHome()
      
      homePage
        .shouldBeVisible()
        .shouldDisplayProducts()
        .shouldShowAdminButton()
    })
  })

  it('Deve exibir erro ao tentar login com credenciais inválidas', () => {
    const invalidCredentials = {
      email: 'usuario@inexistente.com',
      password: 'senhaerrada123'
    }

    loginPage
      .login(invalidCredentials.email, invalidCredentials.password)
      .shouldStayOnLoginPage()
      .shouldDisplayAlert('Email e/ou senha inválidos')
  })

  it('Deve validar campos obrigatórios do formulário de login', () => {
    loginPage
      .clickLogin()
      .shouldStayOnLoginPage()
    
    // Verificar se os campos estão sendo validados pelo HTML5
    loginPage.elements.emailInput().then(($input) => {
      expect($input[0].validationMessage).to.contain('Preencha este campo')
    })
  })
})
