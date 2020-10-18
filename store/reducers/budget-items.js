import {
  ADD_BUDGET_ITEM,
  DELETE_BUDGET_ITEM,
  SET_BUDGET_ITEMS,
  RESET_BUDGET_ITEMS,
} from '../actions/budget-items'
import BudgetItem from '../../models/budget-item'

const initialState = {
  budgetItems: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BUDGET_ITEMS:
      return {
        budgetItems: action.budgetItems,
      }
    case RESET_BUDGET_ITEMS:
      return {
        budgetItems: action.budgetItems,
      }
    case ADD_BUDGET_ITEM:
      const newBudgetItem = new BudgetItem(
        action.budgetItem.id,
        action.budgetItem.userId,
        action.budgetItem.budgetId,
        action.budgetItem.name,
        action.budgetItem.amount
      )
      return {
        ...state,
        budgetItems: state.budgetItems.concat(newBudgetItem),
      }
    case DELETE_BUDGET_ITEM:
      const budgetItems = state.budgetItems.filter(
        (b) => b.id != action.budgetItem.id
      )
      return {
        ...state,
        budgetItems: budgetItems,
      }
  }

  return state
}
