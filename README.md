# 🚀 Cypress ServeRest Automation

Projeto de automação de testes E2E (End-to-End) e API utilizando Cypress para a aplicação ServeRest.

## 📋 Sobre o Projeto

Este projeto implementa testes automatizados para:
- **Frontend**: https://front.serverest.dev/
- **API**: https://serverest.dev/

### 🎯 Cenários Implementados

#### Frontend (E2E)
1. **Login de Usuário** - Validação de autenticação com credenciais válidas e inválidas
2. **Cadastro de Usuário** - Registro de novos usuários com validações
3. **Gerenciamento de Produtos** - Visualização, busca e adição ao carrinho

#### API
1. **Gerenciamento de Usuários** - CRUD completo de usuários
2. **Autenticação** - Login, logout e validações de token
3. **Gerenciamento de Produtos** - CRUD completo de produtos com autenticação

## 🛠️ Tecnologias Utilizadas

- **Cypress** - Framework de testes
- **JavaScript** - Linguagem de programação
- **Faker.js** - Geração de dados fake para testes
- **Page Object Model** - Padrão de design para organização dos testes

## 📁 Estrutura do Projeto

```
cypress-serverest-automation/
├── cypress/
│   ├── e2e/
│   │   ├── frontend/
│   │   │   ├── login.cy.js
│   │   │   ├── cadastro.cy.js
│   │   │   └── produtos.cy.js
│   │   └── api/
│   │       ├── users.cy.js
│   │       ├── auth.cy.js
│   │       └── products.cy.js
│   ├── fixtures/
│   │   ├── users.json
│   │   └── products.json
│   └── support/
│       ├── pages/
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   └── HomePage.js
│       ├── commands.js
│       └── e2e.js
├── cypress.config.js
├── package.json
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/cypress-serverest-automation.git
cd cypress-serverest-automation
```

2. Instale as dependências:
```bash
npm install
```

### Execução dos Testes

#### Modo Interativo (Cypress Test Runner)
```bash
npm run cypress:open
```

#### Modo Headless (Command Line)
```bash
# Executar todos os testes
npm run test:all

# Executar apenas testes de frontend
npm run test:frontend

# Executar apenas testes de API
npm run test:api

# Executar diretamente com Cypress
npm run cypress:run
```

## 🏗️ Padrões e Boas Práticas Implementadas

### 1. Page Object Model
- Separação clara entre lógica de teste e interação com elementos
- Reutilização de código
- Manutenibilidade aprimorada

### 2. Comandos Customizados
- `cy.loginUI()` - Login via interface
- `cy.loginAPI()` - Login via API
- `cy.createUserAPI()` - Criação de usuário via API
- `cy.generateUserData()` - Geração de dados fake

### 3. Fixtures
- Dados de teste organizados em arquivos JSON
- Facilita manutenção e reutilização

### 4. Cleanup e Setup
- Setup automático antes dos testes
- Cleanup automático após os testes
- Prevenção de dados órfãos

### 5. Validações Robustas
- Verificação de status codes
- Validação de estrutura de response
- Assertivas específicas para cada cenário

## 📊 Relatórios

Os testes geram automaticamente:
- Screenshots em caso de falha
- Vídeos da execução
- Logs detalhados no terminal

## 🔧 Configurações

### cypress.config.js
- URLs base configuradas
- Timeouts otimizados
- Configurações de vídeo e screenshot

### Variáveis de Ambiente
- `apiUrl`: URL base da API
- Configurações podem ser sobrescritas via linha de comando

## 🧪 Cenários de Teste Detalhados

### Frontend
- ✅ Login com credenciais válidas
- ✅ Login com credenciais inválidas  
- ✅ Validação de campos obrigatórios
- ✅ Cadastro de usuário administrador
- ✅ Cadastro com email duplicado
- ✅ Visualização de produtos
- ✅ Busca de produtos
- ✅ Adição ao carrinho

### API
- ✅ CRUD completo de usuários
- ✅ Validações de autenticação
- ✅ CRUD completo de produtos
- ✅ Validações de autorização
- ✅ Tratamento de erros
- ✅ Validações de campos obrigatórios

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Commits Semânticos

O projeto utiliza commits semânticos:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `test:` - Adição ou modificação de testes
- `docs:` - Alterações na documentação
- `refactor:` - Refatoração de código

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

Desenvolvido por [Seu Nome]

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
