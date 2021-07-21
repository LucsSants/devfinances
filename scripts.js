const Modal = {
  body: document.querySelector("body"),
  open() {
    document.querySelector(".modal-overlay")
    .classList.add('active')
     Modal.body.style.overflow = "hidden" 
  },
  close() {
    document.querySelector(".modal-overlay")
    .classList.remove('active')
    Modal.body.style.overflow = ""
    
  }
}

const Notification = {
  
  runAlert() {
     const Alert = document.querySelector(".alert")
     Alert.classList.remove("hide")
     Alert.classList.add("show")
     setInterval(() => {
      Alert.classList.remove("show")
      Alert.classList.add("hide")
    }, 3000)

  }
  
}

const DarkMode = () => {
  const html = document.querySelector("html")
  const checkBox = document.querySelector("input[name=theme]")
  const img = document.querySelector("#moon")

  const getStyle = (element, style) => 
    window
    .getComputedStyle(element)
    .getPropertyValue(style)

    
  const initialColors = {
    smallColor: getStyle(html,"--small-color"),
    white: getStyle(html,"--white"),
    background: getStyle(html,"--background"),
    header: getStyle(html,"--header"),
    darkBlue: getStyle (html,"--dark-blue"),
    green: getStyle(html,"--green"),
    lightGreen: getStyle(html,"--light-green"),
    red: getStyle(html,"--red")
  }

  const darkMode = {
    smallColor: "#706f7cbb",
    white: "white",
    background: "#1f1f1f",
    header: "#363636",
    darkBlue: "#363f5f",
    green: "#49aa26)",
    lightGreen: "#3dd705",
    red: "#e92929"
  }

  const transformKey = key => "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()

  const changeColors = (colors) => {
    Object.keys(colors).map(key => html.style.setProperty(transformKey(key), colors[key]))
  }

  const isExistLocalStorage = (key) => 
  localStorage.getItem(key) != null


checkBox.addEventListener("change", ({target}) => {
  if (target.checked) {
    changeColors(darkMode) 
    Storage.set('modo','darkMode')
    img.innerHTML = "nights_stay"
  } else {
    changeColors(initialColors)
    Storage.set('modo','initialColors')
    img.innerHTML = "wb_sunny"
  }
})

if(!isExistLocalStorage('modo'))
  Storage.set('modo', 'initialColors')


if (Storage.get('modo') === "initialColors") {
  checkBox.removeAttribute('checked')
  changeColors(initialColors);
  img.innerHTML = "wb_sunny"
} else {
  checkBox.setAttribute('checked', "")
  changeColors(darkMode);
  img.innerHTML = "nights_stay"
}



}

const Storage = {
  
  get(key) {
    return JSON.parse(localStorage.getItem(key)) || []
  },

  set(key,value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

const Transactions = {
  all: Storage.get("dev.finances:transactions"),


  add(transaction) {
    Transactions.all.push(transaction)
    App.reload()
  },

  remove(index) {
    Transactions.all.splice(index, 1)
    App.reload()
  },

  incomes() {
    let income = 0;

    Transactions.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })
    return income;

  },
  expenses() {
    let expense = 0;

    Transactions.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense;
  },
  total(){
    return Transactions.incomes() + Transactions.expenses()
  }

}

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
  
    const tr = document.createElement("tr")
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
    
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date" >${transaction.date}</td>
      <td>
         <img onclick= "Transactions.remove(${index})" src="./assets/minus.svg" alt="Excluir">
      </td>
    
    `
    return html
  },

  updateBalance() {
    document.getElementById("incomeDisplay")
    .innerHTML = Utils.formatCurrency(Transactions.incomes())
    document.getElementById("expenseDisplay")
    .innerHTML = Utils.formatCurrency(Transactions.expenses())
    document.getElementById("totalDisplay")
    .innerHTML = Utils.formatCurrency(Transactions.total())
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
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
  },
  
  formatAmount(value) {
    value = Math.round(Number(value) * 100)
    return value
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
} 

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor preencha todos os campos!")
    }

  },
  
  formatValues() {
    let { description, amount, date } = Form.getValues()
    
    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)
    
    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  

  submit(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Transactions.add(transaction)
      Form.clearFields()

      Modal.close()
      
    } catch (error) {
      const errorMessage = document.querySelector("span.msg-p")
      errorMessage.innerHTML = error.message   
      Notification.runAlert()
      
    }
    
   // Form.formatData()
  }
} 


const App = {
  init() {
    Transactions.all.forEach(DOM.addTransaction)
    DOM.updateBalance()
    DarkMode()
    Storage.set("dev.finances:transactions", Transactions.all)
  
    
    
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }

}

App.init()


