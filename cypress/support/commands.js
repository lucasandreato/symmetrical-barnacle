// ***********************************************
// Custom commands for ServeRest automation
// ***********************************************

import { faker } from 'faker'

// Comando para login via UI
Cypress.Commands.add('loginUI', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(password)
  cy.get('[data-testid="entrar"]').click()
})

// Comando para cadastro via UI
Cypress.Commands.add('registerUI', (nome, email, password, isAdmin = false) => {
  cy.visit('/cadastrarusuarios')
  cy.get('[data-testid="nome"]').type(nome)
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="password"]').type(password)
  
  if (isAdmin) {
    cy.get('[data-testid="checkbox"]').check()
  }
  
  cy.get('[data-testid="cadastrar"]').click()
})

// Comando para criar usuário via API
Cypress.Commands.add('createUserAPI', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    body: userData,
    failOnStatusCode: false
  })
})

// Comando para fazer login via API
Cypress.Commands.add('loginAPI', (email, password) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: {
      email: email,
      password: password
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    return response.body.authorization
  })
})

// Comando para criar produto via API
Cypress.Commands.add('createProductAPI', (productData, token) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/produtos`,
    headers: {
      Authorization: token
    },
    body: productData,
    failOnStatusCode: false
  })
})

// Comando para gerar dados fake
Cypress.Commands.add('generateUserData', () => {
  return {
    nome: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: 'true'
  }
})

// Comando para limpar dados de teste
Cypress.Commands.add('cleanupTestData', (userId, token) => {
  if (userId) {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('apiUrl')}/usuarios/${userId}`,
      headers: {
        Authorization: token
      },
      failOnStatusCode: false
    })
  }
})
