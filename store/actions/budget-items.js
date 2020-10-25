import BudgetItem from '../../models/budget-item'
import db from '../../db'

export const ADD_BUDGET_ITEM = 'ADD_BUDGET_ITEM'
export const SET_BUDGET_ITEMS = 'SET_BUDGET_ITEMS'
export const RESET_BUDGET_ITEMS = 'RESET_BUDGET_ITEMS'
export const DELETE_BUDGET_ITEM = 'DELETE_BUDGET_ITEM'
export const UPDATE_BUDGET_ITEM = 'UPDATE_BUDGET_ITEM'

export const fetchBudgetItems = (budgetId) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId
    try {
      let options = {
        columns: 'id, name, amount',
        where: {
          budgetId_eq: budgetId,
        },
        order: 'id ASC',
      }

      const allBudgetItems = await db.BudgetItem.query(options)
      let loadedBudgetItems = []

      for (const item of allBudgetItems) {
        loadedBudgetItems.push(
          new BudgetItem(item.id, item.userId, budgetId, item.name, item.amount)
        )
      }
      dispatch({ type: SET_BUDGET_ITEMS, budgetItems: loadedBudgetItems })
    } catch (err) {
      throw err
    }
  }
}

export const resetBudgetItems = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: RESET_BUDGET_ITEMS, budgetItems: [] })
    } catch (err) {
      throw err
    }
  }
}

export const updateBudgetItem = (budgetItem) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const token = getState().auth.token
      const userId = getState().auth.userId

      try {
        let selectedBudgetItem = await db.BudgetItem.find(budgetItem.id)
        selectedBudgetItem.name = budgetItem.name
        selectedBudgetItem.amount = budgetItem.amount
        selectedBudgetItem.save()

        dispatch({
          type: UPDATE_BUDGET_ITEM,
          budgetItem: selectedBudgetItem,
        })

        resolve(selectedBudgetItem)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export const addBudgetItem = (budgetId, name, amount) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const token = getState().auth.token
      const userId = getState().auth.userId

      try {
        let budgetItem = {
          userId: userId,
          budgetId: budgetId,
          name: name,
          amount: amount,
        }

        let newBudgetItem = new db.BudgetItem(budgetItem)
        await newBudgetItem.save()

        dispatch({
          type: ADD_BUDGET_ITEM,
          budgetItem: {
            id: newBudgetItem.id,
            userId: newBudgetItem.userId,
            budgetId: newBudgetItem.budgetId,
            name: newBudgetItem.name,
            amount: newBudgetItem.amount,
          },
        })

        resolve(newBudgetItem)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export const cloneBudgetItems = (oldBudget, newBudget) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const token = getState().auth.token
      const userId = getState().auth.userId

      try {
        let options = {
          columns: 'id, budgetId, name, amount',
          where: {
            budgetId_eq: oldBudget.id,
          },
          order: 'id ASC',
        }

        const allBudgetItems = await db.BudgetItem.query(options)

        for (const item of allBudgetItems) {
          let budgetItem = {
            userId: userId,
            budgetId: newBudget.id,
            name: item.name,
            amount: item.amount,
          }

          let newBudgetItem = new db.BudgetItem(budgetItem)
          await newBudgetItem.save()
        }
        //dispatch({ type: SET_BUDGET_ITEMS, budgetItems: loadedBudgetItems })
      } catch (err) {
        throw err
      }
    })
  }
}

export const deleteBudgetItem = (budgetItemId) => {
  return async (dispatch, getState) => {
    try {
      const budgetItem = await db.BudgetItem.find(budgetItemId)
      budgetItem.destroy()

      dispatch({
        type: DELETE_BUDGET_ITEM,
        budgetItem: budgetItem,
      })
    } catch (err) {
      throw err
    }
  }
}
