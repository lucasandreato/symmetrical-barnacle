import { faker } from 'faker'

describe('Testes API - Produtos', () => {
  const apiUrl = Cypress.env('apiUrl')
  let authToken = null
  let createdProductId = null

  before(() => {
    // Setup: fazer login para obter token de administrador
    cy.fixture('users').then((users) => {
      cy.loginAPI(users.validUser.email, users.validUser.password).then((token) => {
        authToken = token
      })
    })
  })

  afterEach(() => {
    // Cleanup: remover produto criado durante o teste
    if (createdProductId) {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/produtos/${createdProductId}`,
        headers: { Authorization: authToken },
        failOnStatusCode: false
      })
      createdProductId = null
    }
  })

  it('Deve criar um novo produto com dados válidos', () => {
    const newProduct = {
      nome: `Produto Teste ${faker.commerce.productName()}`,
      preco: faker.datatype.number({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.datatype.number({ min: 1, max: 100 })
    }

    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: {
        Authorization: authToken
      },
      body: newProduct
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
      
      createdProductId = response.body._id
    })
  })

  it('Deve retornar erro ao criar produto sem autorização', () => {
    const newProduct = {
      nome: faker.commerce.productName(),
      preco: 100,
      descricao: faker.commerce.productDescription(),
      quantidade: 50
    }

    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      body: newProduct,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('message', 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
    })
  })

  it('Deve validar campos obrigatórios na criação de produto', () => {
    const invalidProduct = {
      nome: '',
      preco: '',
      descricao: '',
      quantidade: ''
    }

    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: {
        Authorization: authToken
      },
      body: invalidProduct,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('nome', 'nome não pode ficar em branco')
      expect(response.body).to.have.property('preco', 'preco deve ser um número')
      expect(response.body).to.have.property('quantidade', 'quantidade deve ser um número')
    })
  })

  it('Deve listar todos os produtos', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/produtos`
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('quantidade')
      expect(response.body).to.have.property('produtos')
      expect(response.body.produtos).to.be.an('array')
      
      if (response.body.produtos.length > 0) {
        expect(response.body.produtos[0]).to.have.all.keys('nome', 'preco', 'descricao', 'quantidade', '_id')
      }
    })
  })

  it('Deve buscar produtos com filtros', () => {
    const searchParams = new URLSearchParams({
      nome: 'Samsung',
      precoGte: '100',
      precoLte: '1000'
    })

    cy.request({
      method: 'GET',
      url: `${apiUrl}/produtos?${searchParams.toString()}`
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('produtos')
      
      // Validar que os produtos retornados atendem aos filtros
      response.body.produtos.forEach((produto) => {
        expect(produto.nome).to.contain('Samsung')
        expect(produto.preco).to.be.at.least(100)
        expect(produto.preco).to.be.at.most(1000)
      })
    })
  })

  it('Deve buscar produto por ID', () => {
    // Primeiro criar um produto
    const newProduct = {
      nome: `Produto Teste ${Date.now()}`,
      preco: 299,
      descricao: 'Produto para teste de busca por ID',
      quantidade: 10
    }

    cy.createProductAPI(newProduct, authToken).then((createResponse) => {
      expect(createResponse.status).to.eq(201)
      const productId = createResponse.body._id
      createdProductId = productId
      
      // Buscar o produto criado
      cy.request({
        method: 'GET',
        url: `${apiUrl}/produtos/${productId}`
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('nome', newProduct.nome)
        expect(response.body).to.have.property('preco', newProduct.preco)
        expect(response.body).to.have.property('descricao', newProduct.descricao)
        expect(response.body).to.have.property('quantidade', newProduct.quantidade)
        expect(response.body).to.have.property('_id', productId)
      })
    })
  })

  it('Deve atualizar um produto existente', () => {
    // Primeiro criar um produto
    const originalProduct = {
      nome: `Produto Original ${Date.now()}`,
      preco: 100,
      descricao: 'Descrição original',
      quantidade: 20
    }

    cy.createProductAPI(originalProduct, authToken).then((createResponse) => {
      const productId = createResponse.body._id
      createdProductId = productId
      
      const updatedProduct = {
        nome: 'Produto Atualizado',
        preco: 150,
        descricao: 'Descrição atualizada',
        quantidade: 30
      }
      
      // Atualizar o produto
      cy.request({
        method: 'PUT',
        url: `${apiUrl}/produtos/${productId}`,
        headers: {
          Authorization: authToken
        },
        body: updatedProduct
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Registro alterado com sucesso')
        
        // Verificar se foi realmente atualizado
        cy.request('GET', `${apiUrl}/produtos/${productId}`).then((getResponse) => {
          expect(getResponse.body.nome).to.eq(updatedProduct.nome)
          expect(getResponse.body.preco).to.eq(updatedProduct.preco)
          expect(getResponse.body.descricao).to.eq(updatedProduct.descricao)
          expect(getResponse.body.quantidade).to.eq(updatedProduct.quantidade)
        })
      })
    })
  })

  it('Deve deletar um produto', () => {
    // Primeiro criar um produto
    const productToDelete = {
      nome: `Produto para Deletar ${Date.now()}`,
      preco: 50,
      descricao: 'Este produto será deletado',
      quantidade: 5
    }

    cy.createProductAPI(productToDelete, authToken).then((createResponse) => {
      const productId = createResponse.body._id
      
      // Deletar o produto
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/produtos/${productId}`,
        headers: {
          Authorization: authToken
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Registro excluído com sucesso')
        
        // Verificar se foi realmente deletado
        cy.request({
          method: 'GET',
          url: `${apiUrl}/produtos/${productId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(400)
          expect(getResponse.body).to.have.property('message', 'Produto não encontrado')
        })
      })
      
      // Limpar referência para não tentar deletar novamente no afterEach
      createdProductId = null
    })
  })
})
