# Receipt Generator & Inventory System / Gerador de Recibos e Sistema de Estoque

This project is a pragmatic solution developed to automate the generation of sales receipts and inventory management for a beauty products reseller. It replaces manual paperwork with an automated system that calculates installments, due dates, and generates PDF receipts.

Este projeto é uma solução pragmática desenvolvida para automatizar a geração de recibos de venda e o gerenciamento de estoque para uma revendedora de produtos de beleza. Ele substitui o trabalho manual por um sistema automatizado que calcula parcelas, datas de vencimento e gera recibos em PDF.

## 🚀 Features / Funcionalidades
Inventory Management: Full CRUD for products with cost and sale price calculation.

Installment Logic: Automatic calculation of monthly installments based on a start date.

PDF Generation: Creates professional receipts ready to be shared via WhatsApp.

Local Persistence: Data is stored locally in the browser for privacy and speed.

Gestão de Estoque: CRUD completo de produtos com cálculo de preço de custo e venda.

Lógica de Parcelamento: Cálculo automático de parcelas mensais baseado em uma data de início.

Geração de PDF: Cria recibos profissionais prontos para serem compartilhados via WhatsApp.

Persistência Local: Dados salvos localmente no navegador para privacidade e agilidade.

## 🧠 Logic Planning (The "Wireframe" Approach) / Planejamento Lógico
Unlike generic AI-generated templates, this project follows a strict Logic-First approach. Before implementation, the entire data flow was mapped using Excalidraw to ensure:

Data integrity between the Inventory and Sales modules.

Accurate date manipulation for credit payments.

A clean User Experience (UX) focused on efficiency.

Diferente de templates genéricos gerados por IA, este projeto segue uma abordagem de Lógica Primeiro. Antes da implementação, todo o fluxo de dados foi mapeado usando o Excalidraw para garantir:

Integridade de dados entre os módulos de Estoque e Vendas.

Manipulação precisa de datas para pagamentos parcelados.

Uma experiência de usuário (UX) limpa e focada em eficiência.

### 🛠️ Tech Stack / Tecnologias
Vanilla JavaScript (ES6+): Object-Oriented Programming (Classes, Private Methods).

HTML5 & CSS3: Responsive Layout and custom styling.

Local Storage API: For data persistence.

JavaScript Puro (ES6+): Programação Orientada a Objetos (Classes, Métodos Privados).

HTML5 e CSS3: Layout responsivo e estilização customizada.

API Local Storage: Para persistência de dados.

### 📜 How it Works / Como funciona

#### wireframe 
![alt text](image.png)
The system architecture follows the logical flow mapped in the wireframe above, ensuring a seamless transition from inventory to the final receipt:

A arquitetura do sistema segue o fluxo lógico mapeado no wireframe acima, garantindo uma transição fluida do estoque para o recibo final:

##### 1. Data Retrieval (Input) / Recuperação de Dados (Entrada)
Product Linkage: The system fetches the unit price and name directly from the Inventory Class based on the user's selection.

Vínculo de Produto: O sistema busca o preço unitário e o nome diretamente da Classe Estoque com base na seleção do usuário.

Variable Inputs: The user defines the customer's name, the number of installments, and the billing start date.

Entradas Variáveis: O usuário define o nome da cliente, o número de parcelas e a data de início da cobrança.

##### 2. Processing Engine (The Logic) / Mecanismo de Processamento (A Lógica)
Installment Calculation: The total price is divided by the number of installments. The system uses a loop to project future dates, ensuring each payment falls on the same day of the following months.

Cálculo de Parcelas: O preço total é dividido pelo número de parcelas. O sistema usa um loop para projetar datas futuras, garantindo que cada pagamento caia no mesmo dia dos meses seguintes.

Data Integrity: Since the inventory is the "Source of Truth", any price update in the stock is reflected in new receipts.

Integridade de Dados: Como o estoque é a "Fonte da Verdade", qualquer atualização de preço no estoque é refletida nos novos recibos.

##### 3. Document Output / Saída do Documento
Dynamic Preview: A visual template is populated in real-time with the calculated data.

Preview Dinâmico: Um template visual é preenchido em tempo real com os dados calculados.

PDF Export: The HTML structure is converted into a clean PDF file, optimized for mobile sharing (WhatsApp).

Exportação para PDF: A estrutura HTML é convertida em um arquivo PDF limpo, otimizado para compartilhamento via celular (WhatsApp).