class BudgetItem {
  constructor(id, userId, budgetId, name, amount, isPaid) {
    this.id = id
    this.userId = userId
    this.budgetId = budgetId
    this.name = name
    this.amount = amount
    this.isPaid = isPaid
  }
}

export default BudgetItem
