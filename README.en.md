# Order manager and receipt generator

[Versão em português](README.md)

A browser-based application built to manage inventory and record sales for a beauty products reseller. It brings product registration, a shopping cart, installment calculations, and PDF receipts together in one interface.

[**Live application**](https://gestao-revendedora.vercel.app/) 

## What it does

- **Inventory:** registers products with a name, purchase price, sale price, and quantity. Users can search by name, see the available quantity and profit per unit, and remove a product record.
- **Cart:** adds products from inventory, combines quantities for the same item, and displays amounts based on the sale price. Items are checked against the available stock.
- **Sales:** accepts the customer's name, the number of installments, and the first billing date. Confirmation calculates the total, reduces inventory, and saves the sale.
- **Receipts:** generates a PDF for the confirmed sale with the customer, items, quantities, total, installment amounts, and due dates. The document includes the date and time it was generated.
- **Persistence:** stores inventory and sales in the browser's `localStorage`.

## How to use it

1. On the **Estoque** (Inventory) tab, enter the product name, purchase price, sale price, and quantity. Click **Adicionar** (Add).
2. Use **Buscar no Estoque** (Search Inventory) to find a product. Name matching is case-insensitive.
3. On the **Vendas/Clientes** (Sales/Customers) tab, enter the customer's name, a registered product's name, and the desired quantity. Click **Adicionar Produto** (Add Product). Repeat for other items and open the cart icon to review the order.
4. Select the number of installments and the first billing date. Click **Confirmar Venda** (Confirm Sale). The application calculates the total, records the sale, and updates inventory.
5. Click **Gerar Recibo em PDF** (Generate PDF Receipt) to download a receipt for the sale you just confirmed.

Prices must be greater than zero; quantities and installment counts must be positive integers. The first billing date must be today or later. Validation messages appear in the relevant sections of the interface.

## How it was built

The project uses **HTML**, **CSS**, and **JavaScript ES modules**. Vite runs the development environment and builds the static files for publishing.

In `src/control.js`, the `Produto`, `Estoque`, and `Venda` classes hold the main data and business rules. The same module connects the page's forms to product registration, search, removal, cart updates, sale confirmation, and receipt generation. `src/modal.js` controls the cart dialog and its contents. The interface is defined in `index.html`, `styles/style.css`, and `styles/modal.module.css`.

Inventory is saved under the `estoqueBoti` key and sales under the `vendas` key in `localStorage`. Receipts are generated with **jsPDF** and **jsPDF-AutoTable**. The repository also includes a GitHub Actions workflow that builds the project with Vite and publishes the static files to GitHub Pages.

## Run locally

Node.js and npm are required.

```bash
git clone https://github.com/pedrohenriquesouza1/gestao-revendedora.git
cd gestao-revendedora
npm ci
npm run dev
```

Open the local URL printed by Vite. To build and preview the production version:

```bash
npm run build
npm run preview
```
