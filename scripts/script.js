//pegar o modal no html e adicionar a classe active para abrir e remover para fechar
const Modal = {
  toggle(){
    let overlay = document.querySelector('.modal-overlay').classList.toggle('active')
  }
}

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem('dev.finances:transations')) || []
  },

  set(transactions){
    localStorage.setItem('dev.finances:transations', JSON.stringify(transactions))
  },
}

const Transactions = {
  all: Storage.get(),

  add(transaction){
    Transactions.all.push(transaction)
    App.reload()
  },

  remove(index){
    Transactions.all.splice(index, 1)
    App.reload()
  },
  //somar entradas
  incomes(){
    let income = 0
    //pegar todas as transações
    //para cada transação,
    Transactions.all.forEach(transaction => {
      //se ela for maior que zero, somar a uma variavel e 
      if (transaction.amount > 0){
        income += transaction.amount
      }
    })
    //retornar a variavel
    return income
  },
  //calcular saidas 
  expenses(){
    let expense = 0
    //pegar todas as transações
    //para cada transação,
    Transactions.all.forEach(transaction => {
      //se ela for menor que zero, somar a uma variavel e 
      if (transaction.amount < 0){
        expense += transaction.amount
      }
    })
    //retornar a variavel
    return expense
  },
  //remover das entradas o valor das saidas
  total(){
    //pegar os valores positivos e negativos e somar
    return Transactions.expenses() + Transactions.incomes()
  }
  //então terei o total
}

//pegar meu objeto do JS e injetar no HTML

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index){
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLtransaction(transaction, index)
    DOM.transactionContainer.appendChild(tr)
    tr.dataset.index = index
  },

  innerHTMLtransaction(transaction, index){
    const incomeExpense = transaction.amount > 0 ? "income" : "expense"
    const amountValue = Utils.formatCurrency(transaction.amount)
    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${incomeExpense}">${amountValue}</td>
    <td class="date">${transaction.date}</td>
    <td><img onclick="Transactions.remove(${index})"src="./assets/minus.svg" alt="Remover Transaçâo"></td>`

    return html
  },

  updateBalance(){
    document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transactions.incomes())
    document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transactions.expenses())
    document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total())
  },

  clearTransactions(){
    DOM.transactionContainer.innerHTML = ''
  }
}

const Utils = {
  formatValues(value){
    value = Number(value) * 100

    return value
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
},

  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""
    value = String(value).replace(/\D/g, "")
    value = Number(value) / 100
    value = value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + value
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields(){
    let {description, amount, date} = Form.getValues()
    if(description.trim() === '' ||
       amount.trim() === '' ||
       date.trim() === ''){
      throw new Error('Por favor, preencha todos os campos')
    }
  },

  formatFields(){
    let {description, amount, date} = Form.getValues()

    amount = Utils.formatValues(amount)
    date = Utils.formatDate(date)
    return {
      description,
      amount,
      date,
    }
  },

  cleanFields(){
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },



  submit(event){
    event.preventDefault()
    try {
     Form.validateFields()
     const transaction = Form.formatFields()
     Transactions.add(transaction)
     Form.cleanFields()
     Modal.toggle()
    } catch (error) {
      alert(error.message)
    }
     
    
    
  }
}



const App = {
  init(){
    Transactions.all.forEach(DOM.addTransaction)
    DOM.updateBalance()
    Storage.set(Transactions.all)
  },
  reload(){
    DOM.clearTransactions()
    App.init()
  }
}

App.init()