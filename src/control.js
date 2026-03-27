let ultima_venda = null
let shop = []

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
        if(this.#nome.toLowerCase() === nomeBus.toLowerCase()) {
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
        if (quantVend <= this.#quant) {
            this.#quant -= quantVend
        } else if (quantVend >= this.#quant) {
            return "A quantidade de itens que você está tendando vender é maior que a quantidade de itens que existe"
        }
        console.log(`vendidos ${quantVend} produtos`)
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
        const dadospSalvar = this.#lista.map(b => b.toJSON())
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
            )
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
        if (this.#valorTotal <= 0) {
            throw new Error('Erro! o valor é negativo ou é 0, o valor total tem que ser maior que 1')
        } 
        if (this.#nParcelas <= 0) {
            throw new Error('Erro! o número de parcelas é menor que 0, o número de parcelas deve ser pelo menos 1')
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
//isso aqui é para adicionar o produtro no estoque, deu um trabalho imenso
document.getElementById('btn-adicionar').addEventListener('click', function() {
    const nomeImput = document.getElementById('input-nome')
    const inputprecoCompra = document.getElementById('input-compra')
    const inputprecoVenda = document.getElementById('input-venda')
    const inputQuant = document.getElementById('input-quant')

    const nomeProduto = nomeImput.value
    const compraProduto = Number(inputprecoCompra.value)
    const precoVenda = Number(inputprecoVenda.value)
    const quantidade = Number(inputQuant.value)

    if (nomeProduto === "" || inputprecoCompra.value === "") {
        window.alert("O produto não pode ter valor vazio nem nome")
        return;
    }

    const newItem = new Produto(nomeProduto, compraProduto, precoVenda, quantidade)

    gerenciadorEstoque.adicionar(newItem)
    window.alert('Produto adicionado com sucesso!')

    nomeImput.value = ""
    inputprecoCompra.value = ""
    inputprecoVenda.value = ""
    inputQuant.value = ""
});
//pra buscar o produto, eu só copiei de cima o esqueleto, já estava moído
document.getElementById('btn-buscar').addEventListener('click', function() {
    const nomeBuscado = document.getElementById('search-nome').value
    const divRes = document.getElementById('resultado-busca')
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
    const nomRem = document.getElementById('remove-nome').value
    const resRem = document.getElementById('msg-remocao')
    if (nomRem === "") return;
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
//frescurinha para a UX
document.getElementById('search-nome').addEventListener('input', function() {
    const divRes = document.getElementById('resultado-busca');
    divRes.innerHTML = '<span class="placeholder-text">O resultado da busca aparecerá aqui...</span>';
    divRes.style.borderLeft = "none"; 
});
//outra frescurinha
document.getElementById('remove-nome').addEventListener('input', function() {
    const remRes = document.getElementById('msg-remocao')
    remRes.innerHTML = '<span class="placeholder-text">Se remover algum produto, ele aparece aqui...</span>'
    remRes.style.borderLeft = "none"
});

function fazerVenda() {            
    const nomBus = document.getElementById('search-nome').value
    const caixaMensagem = document.getElementById('msg-venda')

    document.getElementById('btn-confirmar-venda').addEventListener('click', function() {
        try {
            caixaMensagem.innerHTML = ''
            caixaMensagem.style.borderLeft = 'none'

            const quantidadeEstoque = Number(document.getElementById('venda-qtd').value)
            const name = document.getElementById('venda-cliente-nome').value 
            const parcelas = Number(document.getElementById('venda-parcelas').value)
            const data = new Date (document.getElementById('venda-data').value)
            const nomeProduto = document.getElementById('venda-produto-nome').value
            const dataAtual = new Date()

            const produto = gerenciadorEstoque.search(nomeProduto)

            if(!produto) {
                throw new Error('Erro! produto não encontrado, digite novamente')
            } 


            const total = produto.precoVenda * quantidadeEstoque

            if(parcelas < 1) {
                throw new Error('As parcelas devem ser iguais ou maiores que 1')
            }

            if (data < dataAtual) {
                throw new Error('a data tem que ser maior que a data de hoje')
            }

            if (isNaN(total)) {
                throw new Error('Preço de venda não existe, preencha o campo e tente novamente')
            }
            produto.darBaixa(quantidadeEstoque)
            gerenciadorEstoque.salvarDados()

            const item = {
                nome: nomeProduto,
                quantidadeVendida: quantidadeEstoque
            }

            if (item.quantidadeVendida == 0 || item.quantidadeVendida < 0) {
                gerenciadorEstoque.remove(nomeProduto)
            }

            let f = false 

            for (let item of shop) {
                if (item.nome === nomeProduto) {
                    item.quantidadeVendida += quantidadeEstoque
                    f = true
                    break
                } 
            }

            if (!f) {
                shop.push({
                    nome: nomeProduto,
                    quantidadeVendida: quantidadeEstoque,
                    preco: produto.precoCompra
                });
            }

            const itens = [item]
            const venda = new Venda(
                name,
                parcelas,
                data,
                total,
                itens
            );

            ultima_venda = venda
            dataAtual.setHours(0, 0, 0, 0, 0)

            const dado = localStorage.getItem('vendas')
            const listaVenda = dado ? JSON.parse(dado) : []

            listaVenda.push(venda)
            localStorage.setItem('vendas', JSON.stringify(listaVenda)) 
             
            caixaMensagem.innerHTML = '<p style="color: green;">✅ Venda confirmada com sucesso!</p>';
            caixaMensagem.style.borderLeft = "4px solid green";
        } catch (erro) {
            console.error(erro.message) 
            caixaMensagem.innerHTML = `<p style="color: red;">${erro.message}.</p>`;
            caixaMensagem.style.borderLeft = "4px solid red";
            console.log("Sistema pronto para nova tentativa");
        }
    });
}

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
    const dataVenda = new Date(dadosDaVenda.data).toLocaleString('pt-br')
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
        return [item.nome, item.quantidadeVendida];
    });

    doc.autoTable({
        startY: 45,
        head: [['Produto', 'Quantidade']],
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
    