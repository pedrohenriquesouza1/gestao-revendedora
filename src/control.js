import { renderShop } from "./modal.js"
export let shop = []
let ultima_venda = null

class Produto {
    #nome
    #precoCompra
    #precoVenda
    #quant
    constructor(nome, precoCompra, precoVenda, quant) {
        this.#nome = nome
        this.#precoCompra = precoCompra
        this.#precoVenda = precoVenda
        this.#quant = quant
    }

    calcLucro() {
        return this.#precoVenda - this.#precoCompra
    }

    Resumo() {
        return `${this.#nome} com ${this.#quant} unidades`
    }
    
    comparadorNome(nomeBus) { //este método compara o nome com o nome que vai ser utilizado no search, no caso
        if(this.#nome.trim().toLowerCase() === nomeBus.trim().toLowerCase()) {
            return true
        } else {
            return false
        }
    }

    toJSON() {
        return {
            nome: this.#nome,
            precoCompra: this.#precoCompra,
            precoVenda: this.#precoVenda,
            quant: this.#quant
        }
    }

    darBaixa(quantVend) {
        if (!Number.isInteger(quantVend) || quantVend <= 0) {
            throw new Error('A quantidade vendida deve ser um número inteiro maior que zero.')
        }
        if (quantVend > this.#quant) {
            throw new Error('A quantidade vendida é maior que a quantidade disponível no estoque.')
        }
        this.#quant -= quantVend
        console.log(`vendidos ${quantVend} produtos`)
    }

    get precoCompra() {
        return this.#precoCompra
    }

    get precoVenda() {
        return this.#precoVenda;
    }

    get quant() {
        return this.#quant
    }
}

class Estoque {
    #lista
    constructor() {
        this.#lista = []
        this.carregarDado()
    }

    adicionar(product) {
        this.#lista.push(product)
        this.salvarDados()
        return `${product.Resumo()}`
    }

    search(nomeBus) {
        for(const value of this.#lista) {
            if(value.comparadorNome(nomeBus) === true) {
                return value
            }
        }
        return null
    }

    remove(nomeBus) {
        for(let cont = 0; cont < this.#lista.length; cont++) {
            if(this.#lista[cont].comparadorNome(nomeBus)) {
                this.#lista.splice(cont, 1)
                this.salvarDados()
                return true
            }
        }
        return false
    }   

    salvarDados() {
        const dadospSalvar = this.#lista.filter(p => p.quant > 0)
            .filter(produto => produto.quant > 0)
            .map(produto => produto.toJSON())
        localStorage.setItem('estoqueBoti', JSON.stringify(dadospSalvar))
    }

    carregarDado() {
        const dadosSalvados = localStorage.getItem('estoqueBoti')
        if(dadosSalvados) {
            const listaObj = JSON.parse(dadosSalvados)
            this.#lista = listaObj.map(
                dado => new Produto(
                    dado.nome,
                    dado.precoCompra,
                    dado.precoVenda,
                    dado.quant
                )
            ).filter(p => p.quant > 0)
        }
    }
}

class Venda {
    #nomeCliente
    #nParcelas
    #dataCobranca
    #valorTotal
    #itens
    constructor(nomeCliente, nParcelas, dataCobranca, valorTotal, itens = []) {
        this.#nomeCliente = nomeCliente
        this.#nParcelas = nParcelas
        this.#dataCobranca = new Date(dataCobranca)
        this.#valorTotal = valorTotal
        this.#itens = itens
    }

    parcelas() {
        const parcelaValor = (this.#valorTotal / this.#nParcelas)
        for (let cont = 0; cont < this.#nParcelas; cont++) {
            let dataPag = new Date(this.#dataCobranca)
            dataPag.setMonth(dataPag.getMonth() + cont)
            console.log(`Parcela ${cont + 1}, Valor da parcela: ${parcelaValor}; Data de pagamento: ${dataPag.toLocaleDateString('pt-BR')}`)

        }
    }

    validadorDados() {
        if (!this.#nomeCliente.trim()) throw new Error('Preencha o nome da cliente!')
        if (!Number.isInteger(this.#nParcelas) || this.#nParcelas < 1) {
            throw new Error('O número de parcelas deve ser um número inteiro maior ou igual a 1.')
        }
        if (!Number.isFinite(this.#dataCobranca.getTime())) throw new Error('Informe uma data válida para a cobrança.')
        if (!Number.isFinite(this.#valorTotal) || this.#valorTotal <= 0) {
            throw new Error('O valor total da venda deve ser maior que zero.')
        }
    }

    resumoVenda() {
        this.validadorDados()
        let resumoRecibo = []
        const parcelaValor = (this.#valorTotal / this.#nParcelas).toFixed(2)
        for (let cont = 0; cont < this.#nParcelas; cont++) {
            let dataPag = new Date(this.#dataCobranca)
            dataPag.setMonth(dataPag.getMonth() + cont)
            let resumoParcela = {
                numero: cont + 1,
                preco: parcelaValor,
                vencimento: dataPag.toLocaleDateString('pt-br') 
            };
            resumoRecibo.push(resumoParcela)
        }
        return resumoRecibo
    }

    get itens() {
        return this.#itens
    }

    toJSON() {
        return {
            nomeC: this.#nomeCliente,
            parcelas: this.#nParcelas,
            data: this.#dataCobranca.toISOString(),
            total: this.#valorTotal,
            itens: this.#itens 
        }
    }
}

const gerenciadorEstoque = new Estoque()
//isso aqui é para adicionar o produtro no estoque
const msgAdicao = document.getElementById('msg-adicao')
document.getElementById('btn-adicionar').addEventListener('click', function() {
    const nomeImput = document.getElementById('input-nome')
    const inputprecoCompra = document.getElementById('input-compra')
    const inputprecoVenda = document.getElementById('input-venda')
    const inputQuant = document.getElementById('input-quant')

    const nomeProduto = nomeImput.value.trim()
    if ([inputprecoCompra, inputprecoVenda, inputQuant].some(input => input.value === '')) {
        msgAdicao.innerHTML = '<p style="color: red;">Preencha os preços e a quantidade.</p>'
        msgAdicao.style.borderLeft = '4px solid red'
        return
    }
    const compraProduto = Number(inputprecoCompra.value)
    const precoVenda = Number(inputprecoVenda.value)
    const quantidade = Number(inputQuant.value)

    if (!nomeProduto) {
        msgAdicao.innerHTML = '<p style="color: red;">Informe o nome do produto.</p>'
        msgAdicao.style.borderLeft = '4px solid red'
        return
    }
    if (!Number.isFinite(compraProduto) || compraProduto <= 0 || !Number.isFinite(precoVenda) || precoVenda <= 0) {
        msgAdicao.innerHTML = '<p style="color: red;">Os preços devem ser números válidos maiores que zero.</p>'
        msgAdicao.style.borderLeft = '4px solid red'
        return
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        msgAdicao.innerHTML = '<p style="color: red;">A quantidade deve ser um número inteiro maior que zero.</p>'
        msgAdicao.style.borderLeft = '4px solid red'
        return;
    }

    const newItem = new Produto(nomeProduto, compraProduto, precoVenda, quantidade)

    gerenciadorEstoque.adicionar(newItem)

    msgAdicao.innerHTML = `<p style="color: green;">"${nomeProduto}" foi adicionado ao estoque com sucesso.</p>`
    msgAdicao.style.borderLeft = "4px solid green"
    

    nomeImput.value = ""
    inputprecoCompra.value = ""
    inputprecoVenda.value = ""
    inputQuant.value = ""
});
//pra buscar o produto, eu só copiei de cima o esqueleto, já estava moído
document.getElementById('btn-buscar').addEventListener('click', function() {
    const nomeBuscado = document.getElementById('search-nome').value.trim()
    const divRes = document.getElementById('resultado-busca')
    if (!nomeBuscado) {
        divRes.innerHTML = '<p style="color: #d32f2f;">Digite o nome do produto para buscar.</p>'
        divRes.style.borderLeft = '4px solid #d32f2f'
        return
    }
    const res = gerenciadorEstoque.search(nomeBuscado)
    if (res != null) {
        divRes.innerHTML = `
        <p style="color: green; font-weight: bold;">Produto Encontrado!</p>
        <p>${res.Resumo()}</p>
        <p>Lucro p/ unidade: R$ ${res.calcLucro().toFixed(2)}</p>
        `;
        divRes.style.borderLeft = "4px solid green"
    }  else {
        divRes.innerHTML = `<p style="color: #d32f2f;">Produto "${nomeBuscado}" não encontrado.</p>`
        divRes.style.borderLeft = '4px solid #d32f2f'
    }
    
});
//remove o produto, aqui eu fiz a mesma coisa dos outros dois
document.getElementById('btn-remover').addEventListener('click', function(){
    const nomRem = document.getElementById('remove-nome').value.trim()
    const resRem = document.getElementById('msg-remocao')
    if (!nomRem) {
        resRem.innerHTML = '<p style="color: #d32f2f;">Digite o nome do produto para remover.</p>'
        resRem.style.borderLeft = '4px solid #d32f2f'
        return
    }
    const rem = gerenciadorEstoque.remove(nomRem) 

    if (rem) {
        resRem.innerHTML = `<p style="color: green;">"${nomRem}" foi removido do estoque.</p>`
        resRem.style.borderLeft = "4px solid green"

        document.getElementById('search-nome').value = '';
        document.getElementById('resultado-busca').innerHTML = '<span class="placeholder-text">O resultado da busca aparecerá aqui...</span>';
    } else {
        resRem.innerHTML = `<p style="color: orange;">Erro: Não foi possível remover. Produto não encontrado.</p>`
        resRem.style.borderLeft = "4px solid #d32f2f"
    }
});
document.getElementById('search-nome').addEventListener('input', function() {
    const divRes = document.getElementById('resultado-busca');
    divRes.innerHTML = '<span class="placeholder-text">O resultado da busca aparecerá aqui...</span>';
    divRes.style.borderLeft = "none"; 
});
document.getElementById('remove-nome').addEventListener('input', function() {
    const remRes = document.getElementById('msg-remocao')
    remRes.innerHTML = '<span class="placeholder-text">Se remover algum produto, ele aparece aqui...</span>'
    remRes.style.borderLeft = "none"
});

//função que adiciona produtos no carrinho, essa daqui só cuida da lógica, o código do modal está em outro arquivo
document.getElementById("btn-adicionar-item-venda").addEventListener("click", function() {
    const caixaMensagem = document.getElementById('msg-venda')
    try {
        const inputQuantidade = document.getElementById('venda-qtd').value
        const quantidadeEstoque = Number(inputQuantidade)
        const nomeProduto = document.getElementById('venda-produto-nome').value.trim()
        const produto = gerenciadorEstoque.search(nomeProduto)

        if (!nomeProduto) throw new Error('Informe o produto que deseja adicionar.')
        if (!produto) throw new Error(`O produto "${nomeProduto}" não existe no estoque.`)
        if (inputQuantidade === '' || !Number.isInteger(quantidadeEstoque) || quantidadeEstoque <= 0) {
            throw new Error('A quantidade deve ser um número inteiro maior que zero.')
        }

        const itemExistente = shop.find(item => item.nome.trim().toLowerCase() === nomeProduto.toLowerCase())
        const quantidadeNoCarrinho = itemExistente ? itemExistente.quantidadeVendida : 0
        if (quantidadeNoCarrinho + quantidadeEstoque > produto.quant) {
            throw new Error(`A quantidade solicitada excede o estoque disponível (${produto.quant} unidades).`)
        }

        if (itemExistente) {
            itemExistente.quantidadeVendida += quantidadeEstoque
            itemExistente.preco = produto.precoVenda
        } else {
            shop.push({
                nome: nomeProduto,
                quantidadeVendida: quantidadeEstoque,
                preco: produto.precoVenda
            });
        }
        renderShop(shop)
        caixaMensagem.innerHTML = ''
        caixaMensagem.style.borderLeft = 'none'
    } catch (erro) {
        caixaMensagem.innerHTML = `<p style="color: red;">${erro.message}</p>`
        caixaMensagem.style.borderLeft = '4px solid red'
    }
});
//Função de venda, totalmente refatorada
const caixaMensagem = document.getElementById('msg-venda')
document.getElementById('btn-confirmar-venda').addEventListener('click', function() {
        try {
            caixaMensagem.innerHTML = ''
            caixaMensagem.style.borderLeft = 'none'

            const name = document.getElementById('venda-cliente-nome').value.trim()
            const valorParcelas = document.getElementById('venda-parcelas').value
            const parcelas = Number(valorParcelas)
            const valorData = document.getElementById('venda-data').value
            const [ano, mes, dia] = valorData.split('-').map(Number)
            const data = valorData ? new Date(ano, mes - 1, dia) : new Date(NaN)
            const dataAtual = new Date()

            let valorTotal = 0
            dataAtual.setHours(0, 0, 0, 0)
            
            if (shop.length === 0) throw new Error('O carrinho está vazio!');
            if (valorParcelas === '' || !Number.isInteger(parcelas) || parcelas < 1) throw new Error('As parcelas devem ser um número inteiro maior ou igual a 1.');
            if (!Number.isFinite(data.getTime())) throw new Error('Informe uma data válida para a cobrança.');
            if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) throw new Error('Informe uma data válida para a cobrança.');
            if (data < dataAtual) throw new Error('A data tem que ser maior ou igual a hoje.');
            if (!name) throw new Error('Preencha o nome da cliente!');

            const quantidadesPorProduto = new Map()
            const produtosDaVenda = []
            for (let item of shop) {
                const produtoNEstoque = gerenciadorEstoque.search(item.nome)
                
                if(!produtoNEstoque) {
                    throw new Error(`O produto ${item.nome} não existe no estoque`)
                }
                if (!Number.isInteger(item.quantidadeVendida) || item.quantidadeVendida <= 0) {
                    throw new Error(`A quantidade de ${item.nome} deve ser um número inteiro maior que zero.`)
                }
                if (!Number.isFinite(produtoNEstoque.precoVenda) || produtoNEstoque.precoVenda <= 0) {
                    throw new Error(`O preço de venda de ${item.nome} é inválido.`)
                }

                const quantidadeAcumulada = (quantidadesPorProduto.get(produtoNEstoque) || 0) + item.quantidadeVendida
                if (quantidadeAcumulada > produtoNEstoque.quant) {
                    throw new Error(`Estoque insuficiente para ${item.nome}. Disponível: ${produtoNEstoque.quant}.`)
                }
                quantidadesPorProduto.set(produtoNEstoque, quantidadeAcumulada)

                let subTot = item.quantidadeVendida * produtoNEstoque.precoVenda
                if (!Number.isFinite(subTot) || subTot <= 0) throw new Error(`O subtotal de ${item.nome} é inválido.`)

                valorTotal += subTot

                item.precoUni = produtoNEstoque.precoVenda 
                item.subtotal = subTot
            }

            for (const [produto, quantidade] of quantidadesPorProduto) {
                produtosDaVenda.push({ produto, quantidade })
            }

            if (!Number.isFinite(valorTotal) || valorTotal <= 0) throw new Error('O valor total da venda deve ser maior que zero.')

            const venda = new Venda(
                name,
                parcelas,
                data,
                valorTotal,
                [...shop]
            );
            venda.validadorDados()

            for (const item of produtosDaVenda) item.produto.darBaixa(item.quantidade)
            gerenciadorEstoque.salvarDados()

            ultima_venda = venda

            const dado = localStorage.getItem('vendas')
            const listaVenda = dado ? JSON.parse(dado) : []

            listaVenda.push(venda)
            localStorage.setItem('vendas', JSON.stringify(listaVenda)) 

            shop.length = 0
            renderShop(shop)
             
            caixaMensagem.innerHTML = '<p style="color: green;">✅ Venda confirmada com sucesso!</p>';
            caixaMensagem.style.borderLeft = "4px solid green";
        } catch (erro) {
            console.error(erro.message) 
            caixaMensagem.innerHTML = `<p style="color: red;">${erro.message}.</p>`;
            caixaMensagem.style.borderLeft = "4px solid red";
        }
});


const btnPdf = document.querySelector('#btn-gerar-pdf')
btnPdf.addEventListener("click", function () {
    if (!ultima_venda) {
        window.alert('Você precisa de vender um produto para obter o recibo')
        throw new Error('Você precisa de vender um produto para obter o recibo')
    }

    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();
    const dadosDaVenda = ultima_venda.toJSON()
    const parcelas = ultima_venda.resumoVenda()
    const itens = dadosDaVenda.itens
    const dataVenda = new Date().toLocaleString('pt-BR')
    const vFormatado = dadosDaVenda.total.toFixed(2)

    doc.setFontSize(18)
    doc.setFont("Times", "bold")
    doc.text("Recibo Cliente", 15, 20)
    doc.setDrawColor(180).line(15, 23, 195, 23)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Nome do(a) Cliente: ${dadosDaVenda.nomeC}`, 15, 30)
    doc.text(`Valor total: R$${vFormatado}`, 195, 30, { align: 'right'})
    doc.text(`Data da Venda: ${dataVenda}`, 85, 37, {align: 'right'})

    const paraPDF = itens.map(item => {
        return [item.nome, item.quantidadeVendida, `R$ ${item.subtotal.toFixed(2)}`];
    });

    doc.autoTable({
        startY: 45,
        head: [['Produto', 'Quantidade', 'Preço']],
        body: paraPDF,
        theme: 'grid',
        headStyles: { fillColor: [181, 181, 181]}
    });

    const paraParcPDF = parcelas.map(pm => {
        return [pm.numero, pm.preco, pm.vencimento]
    });

    doc.text('Parcelamentos', 15, doc.lastAutoTable.finalY + 15)

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Parcela', 'Valor', 'Data de Vencimento']],
        body: paraParcPDF,
        theme: 'grid',
        headStyles: {fillColor: [181, 181, 181]},
        columnStyles: {
            0: {halign: 'Center'},
            1: {halign: 'right'},
            2: {halign: 'center'}
        }
    });

    doc.save(`Recibo-${dadosDaVenda.nomeC}.pdf`)
});
