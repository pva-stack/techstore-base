# TechStore

Loja virtual da TechStore desenvolvida em React + Vite, com foco em regras de negócio, estoque, fila de espera e painel interno do lojista.

## Visão geral

Este projeto foi ajustado para respeitar regras de alta relevância para a operação da loja:

- produtos esgotados aparecem em uma aba específica;
- clientes podem entrar na fila de espera para produtos indisponíveis;
- a conta do lojista fica separada das contas de clientes;
- o painel do lojista exige acesso com senha;
- a fila de espera conta clientes únicos, mesmo quando a mesma pessoa estiver aguardando vários produtos;
- o acesso ao painel é bloqueado ao sair da área interna ou trocar de conta.

---

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run dev -- --host 0.0.0.0
   ```

3. Acesse a aplicação no navegador:

   ```text
   http://localhost:5173
   ```

> Em alguns computadores, a porta 5173 pode estar ocupada. O Vite então usa a próxima porta disponível.

---

## Estrutura do projeto

- src/App.jsx: estado global da aplicação, rotas, conta ativa, fila de espera e acesso ao painel do lojista
- src/components/Header.jsx: cabeçalho e navegação
- src/components/Footer.jsx: seletor de conta ativa e área interna
- src/pages/Loja.jsx: vitrine, filtros e aba de esgotados
- src/pages/PaginaProduto.jsx: página de detalhes do produto, disponibilidade e fila de espera
- src/pages/Carrinho.jsx: carrinho do cliente, cupons e checkout
- src/pages/Estoque.jsx: painel do lojista com indicadores e lista de espera
- src/utils/: regras de negócio como cálculo de total, cupons e formatação de preços
- src/services/: integrações com os dados da API da loja

---

## Alterações implementadas

### 1) Conta exclusiva do lojista

A aplicação agora usa uma conta separada para o lojista.

- O lojista entra escolhendo a conta "Lojista" no seletor do rodapé.
- Quando essa conta é selecionada, o sistema exige a senha antes de permitir a troca.
- Clientes comuns nunca veem o botão ou a navegação do painel do lojista.

### 2) Senha do painel do lojista

A senha configurada é:

```text
techstore2026
```

Essa senha é exigida quando:

- o usuário tenta entrar na conta de lojista;
- o painel é acessado diretamente após a autenticação;
- a conta ativa sai do painel ou muda de cliente.

A autenticação foi implementada para impedir que clientes comuns acessem as informações internas da loja.

### 3) Aba de produtos esgotados

Na vitrine, foi adicionada a categoria "Esgotados".

Isso permite que o lojista veja rapidamente os produtos sem estoque, sem misturar esse grupo com os itens disponíveis na loja.

### 4) Cliente na fila de espera

Quando um produto está indisponível, o cliente pode se cadastrar para receber aviso quanto o item voltar ao estoque.

Também existe a opção de esperar o preço quando o produto ainda está disponível no catálogo, mas o preço está em revisão.

As regras do fluxo são:

- produto com estoque > 0: o cliente pode adicionar ao carrinho normalmente;
- produto esgotado: aparece a ação de aguardar na fila;
- preço em revisão: aparece a ação de aguardar o preço;
- se o cliente já estiver na fila para aquele produto, o botão fica bloqueado e a ação aparece como "Já está na fila".

### 5) Contagem de clientes únicos na fila

A fila de espera passou a contar clientes de forma correta.

A regra atual é:

- cada e-mail representa um cliente único;
- a mesma pessoa pode estar aguardando vários itens ao mesmo tempo;
- a contagem no painel do lojista considera a pessoa uma única vez na fila geral.

Isso evita a duplicação de clientes na estatística de "Clientes na fila".

### 6) Bloqueio automático do painel

Mesmo depois de entrar no painel, a sessão interna não fica liberada para sempre.

O acesso é bloqueado quando:

- o usuário sai da rota /estoque;
- troca de conta do cliente para outra conta;
- troca da conta ativa novamente para um perfil cliente.

Isso reforça a separação entre ambiente interno e experiência do cliente.

---

## Funcionalidade do painel do lojista

O painel do lojista fica acessível apenas com a conta correta e senha válida.

### O que o painel mostra

- valor em estoque;
- produtos esperando preço;
- número de clientes na fila;
- lucro potencial;
- resumo por categoria;
- lista de produtos com situação (OK, Repor, Esgotado);
- lista de espera por produto com nome e e-mail dos clientes.

### Como acessar

1. No seletor de conta ativa, escolha "Lojista".
2. O sistema solicita uma senha.
3. Digite:

   ```text
   techstore2026
   ```

4. Se a senha estiver correta, o painel abre.
5. Se a senha estiver errada, a troca de conta não é concluída.

---

## Regras de negócio importantes

- clientes comuns não acessam páginas internas;
- produtos esgotados não podem ser adicionados ao carrinho;
- itens sem preço não são vendidos;
- clientes podem se inscrever na fila para compra futura;
- o lojista acompanha a demanda e a fila sem expor dados internos para usuários comuns;
- a fila é tratada por cliente e produto, mas a contagem geral considera clientes únicos.

---

## Dicas de testes

Para validar a loja e suas regras:

1. Acesse a loja normalmente com uma conta de cliente.
2. Vá para um produto esgotado e teste a fila de espera.
3. Troque para a conta "Lojista".
4. Digite a senha `techstore2026`.
5. Confira o painel com os dados do estoque e lista de espera.
6. Saia do painel e troque novamente para um cliente para confirmar o bloqueio.

---

## Observações finais

Este README documenta as alterações mais relevantes feitas no projeto para cumprir as regras de negócio e garantir que o painel do lojista fique protegido.

O ambiente continua funcionando no modo de desenvolvimento com Vite e pode ser usado para validação visual e comportamento do fluxo completo da loja.
