import Budget from '../../models/budget'
import db from '../../db'

export const ADD_BUDGET = 'ADD_BUDGET'
export const SET_BUDGETS = 'SET_BUDGETS'

export const fetchBudgets = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId
    try {
      let options = {
        eq: {
          userId: userId,
        },
      }
      const allBudgets = await db.Budget.query(options)

      const loadedBudgets = []

      for (const budget of allBudgets) {
        loadedBudgets.push(
          new Budget(budget.id, budget.userId, budget.name, budget.amount)
        )
      }
      dispatch({ type: SET_BUDGETS, budgets: loadedBudgets })
    } catch (err) {
      throw err
    }
  }
}

export const addBudget = (name, amount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const userId = getState().auth.userId

    let budget = {
      userId: userId,
      name: name,
      amount: amount,
    }

    let newBudget = new db.Budget(budget)
    await newBudget.save()

    dispatch({
      type: ADD_BUDGET,
      budget: {
        id: newBudget.id,
        userId: newBudget.userId,
        name: newBudget.name,
        amount: newBudget.amount,
      },
    })
  }
}
