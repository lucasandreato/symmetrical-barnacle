import { faker } from 'faker'

describe('Testes API - Usuários', () => {
  const apiUrl = Cypress.env('apiUrl')
  let createdUserId = null
  let authToken = null

  afterEach(() => {
    // Cleanup: remover usuário criado durante o teste
    if (createdUserId && authToken) {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/usuarios/${createdUserId}`,
        headers: { Authorization: authToken },
        failOnStatusCode: false
      })
      createdUserId = null
    }
  })

  it('Deve criar um novo usuário com dados válidos', () => {
    const newUser = {
      nome: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(8),
      administrador: 'true'
    }

    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: newUser
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
      
      createdUserId = response.body._id
      
      // Fazer login para obter token para cleanup
      cy.loginAPI(newUser.email, newUser.password).then((token) => {
        authToken = token
      })
    })
  })

  it('Deve retornar erro ao tentar criar usuário com email duplicado', () => {
    cy.fixture('users').then((users) => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/usuarios`,
        body: users.validUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('message', 'Este email já está sendo usado')
      })
    })
  })

  it('Deve validar campos obrigatórios na criação de usuário', () => {
    const invalidUser = {
      nome: '',
      email: '',
      password: '',
      administrador: 'false'
    }

    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: invalidUser,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('nome', 'nome não pode ficar em branco')
      expect(response.body).to.have.property('email', 'email não pode ficar em branco')
      expect(response.body).to.have.property('password', 'password não pode ficar em branco')
    })
  })

  it('Deve listar todos os usuários', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/usuarios`
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('quantidade')
      expect(response.body).to.have.property('usuarios')
      expect(response.body.usuarios).to.be.an('array')
      
      if (response.body.usuarios.length > 0) {
        expect(response.body.usuarios[0]).to.have.all.keys('nome', 'email', 'password', 'administrador', '_id')
      }
    })
  })

  it('Deve buscar usuário por ID', () => {
    // Primeiro criar um usuário para poder buscá-lo
    const newUser = cy.generateUserData()
    
    cy.createUserAPI(newUser).then((createResponse) => {
      expect(createResponse.status).to.eq(201)
      const userId = createResponse.body._id
      createdUserId = userId
      
      // Buscar o usuário criado
      cy.request({
        method: 'GET',
        url: `${apiUrl}/usuarios/${userId}`
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('nome', newUser.nome)
        expect(response.body).to.have.property('email', newUser.email)
        expect(response.body).to.have.property('_id', userId)
      })
      
      // Obter token para cleanup
      cy.loginAPI(newUser.email, newUser.password).then((token) => {
        authToken = token
      })
    })
  })
})
