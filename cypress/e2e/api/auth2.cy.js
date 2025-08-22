describe('Testes API - Autenticação', () => {
  const apiUrl = Cypress.env('apiUrl')

  it('Deve realizar login com credenciais válidas', () => {
    cy.fixture('users').then((users) => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: {
          email: users.validUser.email,
          password: users.validUser.password
        }
      }).then((response) => {
        expect(response.status).to.eq(400)
      expect(response.body).to.have.property('email', 'email não pode ficar em branco')
      expect(response.body).to.have.property('password', 'password não pode ficar em branco')
    })
  })

  it('Deve validar formato de email no login', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: 'email-invalido',
        password: 'senha123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('email', 'email deve ser um email válido')
    })
  })

  it('Deve realizar logout com token válido', () => {
    cy.fixture('users').then((users) => {
      // Primeiro fazer login para obter token
      cy.loginAPI(users.validUser.email, users.validUser.password).then((token) => {
        // Fazer logout
        cy.request({
          method: 'DELETE',
          url: `${apiUrl}/logout`,
          headers: {
            Authorization: token
          }
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('message', 'Logout realizado com sucesso')
        })
      })
    })
  })

  it('Deve retornar erro ao tentar logout sem token', () => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/logout`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('message', 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
    })
  })
})).to.eq(200)
        expect(response.body).to.have.property('message', 'Login realizado com sucesso')
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.match(/^Bearer .+/)
        
        // Validar que o token não está vazio
        const token = response.body.authorization.replace('Bearer ', '')
        expect(token).to.have.length.greaterThan(10)
      })
    })
  })

  it('Deve retornar erro para credenciais inválidas', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: 'usuario@inexistente.com',
        password: 'senhaerrada123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('message', 'Email e/ou senha inválidos')
    })
  })

  it('Deve validar campos obrigatórios no login', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: '',
        password: ''
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status
