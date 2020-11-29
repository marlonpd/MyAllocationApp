import { nanoid } from 'nanoid/async/index.native'

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
          new Budget(
            budget.id,
            budget.budgetId,
            budget.userId,
            budget.name,
            budget.amount
          )
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
          new Budget(
            budget.id,
            budget.budgetId,
            budget.userId,
            budget.name,
            budget.amount
          )
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
      const uuid = await nanoid()
      try {
        let budget = {
          budgetId: uuid,
          userId: userId,
          name: name,
          amount: amount,
          isArchived: 0,
        }

        let newBudget = new db.Budget(budget)
        await newBudget.save()

        dispatch({
          type: ADD_BUDGET,
          budget: {
            id: newBudget.id,
            budgetId: newBudget.budgetId,
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
      const uuid = await nanoid()

      try {
        let budget = {
          budgetId: uuid,
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
            budgetId: newBudget.budgetId,
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
        const selectedBudget = await db.Budget.findBy({
          budgetId_eq: budget.budgetId,
        })

        //let selectedBudget = await db.Budget.find(budget.budgetId)
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

      let options = {
        eq: {
          budgetId: budgetId,
        },
      }

      const deleteBudget = await db.BudgetItem.destroyMany(budgetId)

      dispatch({
        type: DELETE_BUDGET,
        budget: budget,
      })
    } catch (err) {
      throw err
    }
  }
}
