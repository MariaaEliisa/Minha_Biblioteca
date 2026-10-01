# Minha Biblioteca: tutorial de React Native com Expo

Este projeto é uma aplicação didática para cadastro, consulta, edição e exclusão de livros. Ele foi construído com **React Native**, **Expo**, **React Navigation** e **Axios**.

O objetivo deste README é explicar como a aplicação funciona e servir como um roteiro de estudo para alunos.

## 1. O que a aplicação faz

O usuário percorre este fluxo:

1. Informa email e senha na tela de login.
2. A aplicação envia os dados para a API ReqRes.
3. Se o login funcionar, um token é salvo no dispositivo.
4. O usuário acessa a tela inicial.
5. Na tela de livros, pode consultar, editar e excluir registros.
6. Na tela de novo livro, pode cadastrar título, autor, ano, gênero e ISBN.

Os dados dos livros são armazenados na API MockAPI. Portanto, eles continuam disponíveis mesmo quando o aplicativo é fechado, pois não ficam somente na memória do celular.

## 2. Tecnologias utilizadas

- **React Native**: criação de telas para Android, iOS e Web.
- **Expo**: ferramentas para executar e testar o aplicativo.
- **React Navigation**: navegação entre telas.
- **Axios**: realização de requisições HTTP.
- **AsyncStorage**: armazenamento local do token de login.
- **ReqRes**: API de demonstração para autenticação.
- **MockAPI**: API de demonstração para os dados dos livros.

## 3. Preparando o ambiente

É necessário ter Node.js e npm instalados.

Na pasta do projeto, execute:

```bash
npm install
```

Depois, inicie o Expo:

```bash
npm start
```

O terminal exibirá opções para abrir o projeto no Expo Go, em um emulador ou no navegador. Para executar diretamente no navegador, use:

```bash
npm run web
```

## 4. Credenciais de teste

O projeto usa a conta de demonstração do ReqRes:

```text
Email: eve.holt@reqres.in
Senha: cityslicka
```

Esses dados são usados somente para obter um token de teste. Isso não representa um sistema real de usuários.

## 5. Entendendo a estrutura do projeto

```text
.
├── App.js                         # ponto de entrada do aplicativo
├── index.js                       # inicialização do Expo
├── package.json                   # dependências e scripts
└── src/
    ├── components/
    │   └── BookItem.js            # visual de um livro da lista
    ├── contexts/
    │   └── AuthContext.js         # estado global de autenticação
    ├── navigation/
    │   ├── AppNavigator.js        # telas disponíveis após login
    │   ├── AuthNavigator.js       # telas disponíveis sem login
    │   └── RootNavigator.js       # escolhe o navegador correto
    ├── screens/
    │   ├── BookFormScreen.js      # formulário de cadastro/edição
    │   ├── BooksListScreen.js     # consulta, edição e exclusão
    │   ├── HomeScreen.js          # tela inicial
    │   └── LoginScreen.js         # formulário de login
    ├── services/
    │   ├── api.js                 # clientes Axios e URLs base
    │   ├── authApi.js             # requisição de login
    │   └── booksApi.js            # operações com livros
    └── utils/
        └── validators.js          # validações de formulário
```

## 6. Como o login funciona

### 6.1 Entrada da aplicação

Em `App.js`, o componente `AuthProvider` envolve o `RootNavigator`:

```jsx
<AuthProvider>
  <RootNavigator />
</AuthProvider>
```

O provider disponibiliza `token`, `loading`, `signIn` e `signOut` para qualquer tela que use `AuthContext`.

### 6.2 Escolha da navegação

`RootNavigator.js` verifica se existe um token:

- sem token: mostra `AuthNavigator`, que contém a tela de login;
- com token: mostra `AppNavigator`, que contém a área principal do aplicativo;
- enquanto verifica o armazenamento local: mostra um indicador de carregamento.

Essa separação evita que a área de livros seja exibida antes da autenticação.

### 6.3 Salvamento do token

Quando o usuário toca em **Entrar**:

1. `LoginScreen` chama `signIn` do contexto;
2. `AuthContext` chama `loginReqRes`;
3. `authApi.js` faz `POST /login` na ReqRes;
4. o token retornado é colocado no estado com `setToken`;
5. o token também é salvo com `AsyncStorage.setItem("@token", token)`;
6. o `RootNavigator` percebe a mudança e mostra a aplicação principal.

Ao tocar em **Sair**, o token é removido do estado e do `AsyncStorage`, fazendo o usuário voltar para o login.

## 7. Como os livros são armazenados

As requisições ficam separadas das telas. Essa organização facilita a manutenção e evita repetir URLs e configurações de Axios.

Em `src/services/api.js`, a URL usada atualmente é:

```text
https://6ab691a6c4c7bb67b918f272.mockapi.io/api/v1/livros
```

O serviço `booksApi.js` usa essa URL diretamente:

| Operação | Método | URL | Objetivo |
| --- | --- | --- | --- |
| Listar | `GET` | `/livros` | Busca todos os livros |
| Criar | `POST` | `/livros` | Insere um novo livro |
| Atualizar | `PUT` | `/livros/:id` | Atualiza um livro pelo id |
| Excluir | `DELETE` | `/livros/:id` | Remove um livro pelo id |

O corpo enviado no cadastro tem este formato:

```json
{
  "title": "Dom Casmurro",
  "author": "Machado de Assis",
  "year": "1899",
  "genre": "Romance",
  "isbn": "9780000000001"
}
```

O MockAPI cria o `id` e a data de criação automaticamente.

## 8. Cadastro de um livro

`BookFormScreen.js` controla cinco estados do formulário:

```jsx
const [title, setTitle] = useState("");
const [author, setAuthor] = useState("");
const [year, setYear] = useState("");
const [genre, setGenre] = useState("");
const [isbn, setIsbn] = useState("");
```

Cada `TextInput` atualiza um desses valores com `onChangeText`.

Ao salvar:

1. a tela verifica se título, autor, ano e gênero foram preenchidos (usando `validators.js`);
2. chama `createBook({ title, author, year, genre, isbn })`;
3. espera a resposta da API com `await`;
4. mostra a mensagem de sucesso;
5. permite voltar para a lista de livros.

Usar `await` é importante: a mensagem só deve aparecer depois que o servidor confirmar o cadastro.

## 9. Edição de um livro

O mesmo `BookFormScreen.js` é usado para edição. A tela verifica se recebeu um livro via `route.params.book`:

- se receber: preenche os campos com os dados existentes e usa `updateBook`;
- se não receber: mantém os campos vazios e usa `createBook`.

Ao editar:

1. a tela carrega os dados do livro selecionado;
2. o usuário pode alterar os campos;
3. ao salvar, chama `updateBook(id, book)` com `PUT`;
4. após sucesso, volta para a lista atualizada.

## 10. Lista, edição e exclusão de livros

`BooksListScreen.js` chama `BooksList()` quando a tela é aberta, dentro de um `useEffect`. A resposta é guardada no estado `data` e exibida por um `FlatList`.

Cada item é renderizado pelo componente reutilizável `BookItem.js`. Esse componente recebe:

- `book`: os dados do livro;
- `onEdit`: a função que será chamada ao tocar em **Editar**;
- `onDelete`: a função que será chamada ao tocar em **Excluir**.

Antes de excluir, a tela mostra um modal próprio com as opções **Cancelar** e **Excluir**. A chamada `DELETE` só acontece depois da confirmação. Se a API responder com sucesso:

1. o livro é retirado do estado local;
2. a lista é atualizada sem precisar recarregar a tela;
3. aparece a mensagem `Livro excluído com sucesso.`

Ao editar, a tela navega para `BookForm` passando o livro selecionado como parâmetro.

## 11. Conceitos importantes para estudar

### Estado

`useState` guarda valores que mudam durante o uso, como campos do formulário, lista de livros e mensagens.

### Efeitos

`useEffect` executa uma ação relacionada ao ciclo de vida da tela. Neste projeto, ele carrega os livros quando a lista é aberta e preenche os campos quando um livro está sendo editado.

### Context API

`AuthContext` compartilha o estado de autenticação sem precisar passar o token manualmente por várias telas.

### Promises e `async/await`

As requisições HTTP são assíncronas. `try/catch` trata sucesso e erro de forma organizada.

### Componentes reutilizáveis

`BookItem` concentra a apresentação de um livro. Assim, `BooksListScreen` fica responsável pela lista e pelas regras de negócio.

### CRUD

Este projeto implementa o CRUD completo:

- **Create**: cadastrar livro;
- **Read**: listar livros;
- **Update**: editar livro;
- **Delete**: excluir livro.

### Validação

`validators.js` separa a lógica de validação das telas, tornando o código mais organizado e reutilizável.

## 12. Exercícios para os alunos

1. Adicione um campo de editora ao formulário e ao payload enviado.
2. Crie uma busca por título na lista de livros.
3. Desabilite o botão de salvar enquanto a requisição estiver em andamento.
4. Mova os estilos inline para um arquivo usando `StyleSheet.create`.
5. Crie validações para formato de ISBN e tamanho mínimo do ano.
6. Mostre um indicador de carregamento durante a busca de livros.
7. Separe a URL da API em uma variável de ambiente para não deixá-la fixa no código.
8. Adicione uma tela de perfil do usuário.

## 13. Problemas comuns

### A tela não abre ou fica com erro de módulo

Confira os nomes de arquivos e pastas. No macOS e no Linux, maiúsculas e minúsculas podem fazer diferença. Depois, limpe o cache:

```bash
npx expo start -c
```

### O login falha

Verifique a conexão com a internet e use as credenciais de teste indicadas neste README. A ReqRes é uma API externa e pode mudar suas regras.

### A lista ou o cadastro retornam 404

Confira a URL em `src/services/api.js`. O recurso usado atualmente é `livros`; se você criar outro recurso no MockAPI, precisa atualizar a URL base.

### A API responde, mas a mensagem de sucesso não aparece

Verifique se a requisição está sendo aguardada com `await` e se o código não está entrando no `catch`. No Expo Web, a aplicação também exibe mensagens diretamente na tela para não depender somente de alertas nativos.

### O aplicativo não atualiza depois de uma alteração

Pare e inicie o Expo novamente ou use:

```bash
npx expo start -c
```

## 14. Próximos passos

Depois de entender este projeto, o aluno pode:

- criar uma API própria;
- adicionar cadastro real de usuários;
- proteger rotas com autenticação no servidor;
- substituir o MockAPI por um backend com banco de dados;
- adicionar testes para componentes e serviços.

Este projeto é educacional e pode ser modificado livremente para atividades de aula.
