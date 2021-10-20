//pegar o modal no html e adicionar a classe active para abrir e remover para fechar
const Modal = {
  toggle(){
    let overlay = document.querySelector('.modal-overlay').classList.toggle('active')
  }
}

const Transactions = {
  all: [
    {
      description:'Luz',
      amount: -50000,
      date: '23/01/21'
    },
    {
      description:'website',
      amount: 500000,
      date: '23/01/21'
    },
    {
      description:'Aluguel',
      amount: -200000,
      date: '23/01/21'
    }
  ],

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
    tr.innerHTML = DOM.innerHTMLtransaction(transaction)
    DOM.transactionContainer.appendChild(tr)
  },

  innerHTMLtransaction(transaction){
    const incomeExpense = transaction.amount > 0 ? "income" : "expense"
    const amountValue = Utils.formatCurrency(transaction.amount)
    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${incomeExpense}">${amountValue}</td>
    <td class="date">${transaction.date}</td>
    <td><img src="./assets/minus.svg" alt="Remover Transaçâo"></td>`

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
  formatCurrency(value){
    const signal = Number(value) < 0 ? '-' : ''
    value = String(value).replace(/\D/g, '')
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
    const {description, amount, date} = Form.getValues()
    if(description.trim() === '' || amount.trim() || date.trim()){
      throw new Error('por favor preencha todos os campos')
    }
  },

  submit(event){
    try {
      event.preventDefault()
      //verificar se todas as informações foram preenchidas
      Form.validateFields()
      //formatar os dados e salvar
      //salvar
      //apagar os dados do formulario 
      //fechar o modal
      //atualizar a aplicação
    } catch (error) {
      alert('Por favor, preencha todos os campos')
    }
    
  }
}

const App = {
  init(){
    Transactions.all.forEach(transaction => {
      DOM.addTransaction(transaction)
    })
    
    DOM.updateBalance()
  },
  reload(){
    DOM.clearTransactions()
    App.init()
  }
}

App.init()