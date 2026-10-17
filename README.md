# Gerenciador de pedidos e gerador de recibos

[English version](README.en.md)

Aplicação web criada para organizar o estoque e registrar as vendas de uma revendedora de produtos de beleza. Ela reúne o cadastro de produtos, a montagem de um carrinho, o cálculo de vendas parceladas e a geração de recibos em PDF em uma interface que funciona no navegador.

[**Acesso à aplicação**](https://gestao-revendedora.vercel.app/)

## O que o sistema faz

- **Estoque:** cadastra produtos com nome, preço de compra, preço de venda e quantidade. Permite buscar um produto pelo nome, consultar seu saldo e lucro por unidade, e remover um cadastro.
- **Carrinho:** adiciona produtos do estoque, soma quantidades do mesmo item e mostra o valor calculado pelo preço de venda. A inclusão respeita a quantidade disponível.
- **Vendas:** recebe o nome da cliente, o número de parcelas e a data da primeira cobrança. Ao confirmar, calcula o total, reduz o estoque e salva os dados da venda.
- **Recibos:** gera um PDF da venda confirmada com cliente, itens, quantidades, total, parcelas e vencimentos. O documento mostra a data e a hora em que foi gerado.
- **Persistência:** salva estoque e vendas no `localStorage` do navegador.

## Como usar

1. Na aba **Estoque**, informe o nome do produto, o valor de compra, o valor de venda e a quantidade. Clique em **Adicionar**.
2. Use **Buscar no Estoque** para consultar um produto. A busca pelo nome ignora diferenças entre letras maiúsculas e minúsculas.
3. Na aba **Vendas/Clientes**, informe o nome da cliente, o nome de um produto cadastrado e a quantidade desejada. Clique em **Adicionar Produto**. Repita para incluir outros itens e abra o ícone do carrinho para conferir o pedido.
4. Escolha o número de parcelas e a data da primeira cobrança. Clique em **Confirmar Venda**. O sistema calcula o valor total, registra a venda e atualiza o estoque.
5. Clique em **Gerar Recibo em PDF** para baixar o documento da venda que acabou de ser confirmada.

Os preços devem ser maiores que zero; quantidades e número de parcelas devem ser números inteiros positivos. A data da primeira cobrança deve ser a de hoje ou uma data futura. Os avisos de validação aparecem nas seções correspondentes da interface.

## Como foi feito

O projeto usa **HTML**, **CSS** e **JavaScript com módulos ES**. O Vite executa o ambiente de desenvolvimento e produz os arquivos estáticos de publicação.

Em `src/control.js`, as classes `Produto`, `Estoque` e `Venda` organizam as informações e as regras principais. Esse módulo também conecta os formulários da página às operações de cadastro, busca, remoção, carrinho, confirmação da venda e emissão do recibo. O arquivo `src/modal.js` controla a abertura e o conteúdo do carrinho. A interface fica em `index.html`, `styles/style.css` e `styles/modal.module.css`.

O estoque é salvo na chave `estoqueBoti` e as vendas na chave `vendas` do `localStorage`. Para gerar o recibo, a aplicação usa **jsPDF** e **jsPDF-AutoTable**. O repositório também inclui um workflow do GitHub Actions que gera o projeto com Vite e publica os arquivos no GitHub Pages.

## Executar localmente

É necessário ter Node.js e npm instalados.

```bash
git clone https://github.com/pedrohenriquesouza1/gestao-revendedora.git
cd gestao-revendedora
npm ci
npm run dev
```

Abra no navegador o endereço local exibido pelo Vite. Para gerar e visualizar a versão de produção:

```bash
npm run build
npm run preview
```
