import Budget from '../../models/budget'
import db from '../../db'

export const ADD_BUDGET = 'ADD_BUDGET'
export const DELETE_BUDGET = 'DELETE_BUDGET'
export const SET_BUDGETS = 'SET_BUDGETS'
export const UPDATE_BUDGET = 'UPDATE_BUDGET'

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

export const fetchLatestBudget = () => {
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
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const token = getState().auth.token
      const userId = getState().auth.userId

      try {
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

        resolve(newBudget)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export const cloneBudget = (budgetToClone) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const token = getState().auth.token
      const userId = getState().auth.userId

      try {
        let budget = {
          userId: userId,
          name: budgetToClone.name,
          amount: budgetToClone.amount,
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

        resolve(newBudget)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export const updateBudget = (budget) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const token = getState().auth.token
      const userId = getState().auth.userId

      try {
        let selectedBudget = await db.Budget.find(budget.id)
        selectedBudget.name = budget.name
        selectedBudget.amount = budget.amount
        selectedBudget.save()

        dispatch({
          type: UPDATE_BUDGET,
          budget: selectedBudget,
        })

        resolve(selectedBudget)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export const deleteBudget = (budgetId) => {
  return async (dispatch, getState) => {
    try {
      const budget = await db.Budget.find(budgetId)
      budget.destroy()

      console.log('wat the fuck')
      console.log(budget)

      let options = {
        eq: {
          budgetId: budgetId,
        },
      }
      //const budgetItems = await db.BudgetItem.destroyMany(budgetId)
      const deleteBudget = await db.BudgetItem.destroyMany(budgetId)
      console.log('==BudgetItem=')
      console.log(deleteBudget)
      // console.log('delete===BudgetItem= budget')
      //if (deleteBudget) deleteBudget.destroy()

      //Animal.findBy({ age_eq: 12345, color_cont: '%Brown%' })

      dispatch({
        type: DELETE_BUDGET,
        budget: budget,
      })
    } catch (err) {
      throw err
    }
  }
}
