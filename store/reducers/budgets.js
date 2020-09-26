import { ADD_BUDGET, SET_BUDGETS } from '../actions/budgets'
import Budget from '../../models/budget'

const initialState = {
  budgets: [],
  lastBudget: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BUDGETS:
      return {
        budgets: action.budgets,
      }
    case ADD_BUDGET:
      const newBudget = new Budget(
        action.budget.id,
        action.budget.userId,
        action.budget.name,
        action.budget.amount
      )

      return {
        ...state,
        budgets: state.budgets.concat(newBudget),
        lastBudget: newBudget,
      }
  }

  return state
}
