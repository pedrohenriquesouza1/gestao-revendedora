import styles from "../styles/modal.module.css"
import { shop } from "./control.js"

export function initModal() {
    const modal = document.getElementById("modal-carrinho")
    const btnAbrir = document.getElementById('btn-carrinho')
    const btnFechar = document.getElementById('btn-fechar-modal')
    const btnP = document.getElementById("btn-finalizar-carrinho")

    if(!modal) return;

    modal.classList.add(styles.overlay)
    modal.removeAttribute("style")

function modalCarrinho () {
    const btnShop = document.getElementById("btn-carrinho")
    const msgCarrinho = document.getElementById("msg-carrinho")

    btnShop.classList.add('carrinho-animado')

    setTimeout( () => {
        btnShop.classList.remove('carrinho-animado');
    }, 500);

    msgCarrinho.innerHTML = '<p style="color: #e67e22;">⚠️ Estoque insuficiente!</p>'
    msgCarrinho.style.color = "#e67e22"
}

function openModal() {
    modal.classList.add(styles.open)
    document.body.style.overFlow = "hidden"
}

function closeModal () {
    modal.classList.remove(styles.open)
    document.body.style.overFlow = "auto"
}

if (btnAbrir) {
    btnAbrir.addEventListener("click", openModal)
}

if (btnFechar) {
    btnFechar.addEventListener("click", closeModal);

    if (btnP) {
        btnP.addEventListener("click", closeModal);
    }
}

modal.addEventListener("click", function (event) {
    if(event.target === modal) {
        closeModal();
    }
});

}

export function renderShop() {
    const container = document.getElementById("lista-carrinho")
    const badgeIcon = document.getElementById("contador-carrinho")

    let html = ""
    let totalItem = 0

    if(shop.length <= 0) {
        console.log("carrinho vazio debug")
        return;
    }

    for (let item of shop) {
        let valorTotal = item.quantidadeVendida * item.preco
        html += `<p style="padding: 10px 5px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
            <span><strong>${item.quantidadeVendida}x</strong> ${item.nome}</span>
            <span style="color: #666;">R$ ${valorTotal.toFixed(2)}</span>
        </p>`

        totalItem += item.quantidadeVendida
    }

    badgeIcon.innerHTML = `${totalItem}`
    container.innerHTML = html
}

initModal();