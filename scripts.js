const Modal = {
  open() {
    document.querySelector(".modal-overlay")
    .classList.add('active')
  },
  close() {
    document.querySelector(".modal-overlay")
    .classList.remove('active')
  }
}

const transactions = [
  {
    id: 1,
    description : "Luz",
    amount: -50000,
    date: "23/05/2021"
  },
  {
    id: 2,
    description : "Criação website",
    amount: 500000,
    date: "23/05/2021"
  },
  {
    id: 3,
    description : "Internet",
    amount: -20000,
    date: "23/05/2021"
  },
  {
    id: 4,
    description : "App",
    amount: 200000,
    date: "23/05/2021"
  },
]

const Transactions = {
  incomes() {

  },
  expenses() {

  },
  total(){

  }

}

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
  
    const tr = document.createElement("tr")
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    DOM.transactionsContainer.appendChild(tr)
    
  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date" >${transaction.date}</td>
      <td>
         <img src="./assets/minus.svg" alt="Excluir">
      </td>
    
    `
    return html
  }
}

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100
    
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    
    return signal + value
  }
}

transactions.forEach(function(transaction) {
  DOM.addTransaction(transaction)
})
