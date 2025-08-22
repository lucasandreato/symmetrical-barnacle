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
        expect(response.status).to.eq(200)
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
