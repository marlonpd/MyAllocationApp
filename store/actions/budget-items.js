import BudgetItem from '../../models/budget'
import db from '../../db'

export const ADD_BUDGET_ITEM = 'ADD_BUDGET_ITEM'
export const SET_BUDGET_ITEMS = 'SET_BUDGET_ITEMS'

export const fetchBudgetItems = (budgetId) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId
    try {
      //const allBudgetItems = await db.BudgetItem({ budgetId })

      let options = {
        eq: {
          budgetId: budgetId,
        },
      }
      const allBudgetItems = await db.BudgetItem.query(options)

      // const resData = await response.json();
      // const loadedOrders = [];

      for (const item of allBudgetItems) {
        loadedBudgetItems.push(
          new BudgetItem(item.id, item.userId, item.name, item.amount)
        )
      }
      dispatch({ type: SET_BUDGET_ITEMS, budgetItems: loadedBudgetItems })
    } catch (err) {
      throw err
    }
  }
}

export const addBudgetItem = (budgetId, name, amount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const userId = getState().auth.userId

    let budgetItem = {
      userId: userId,
      budgetId: budgetId,
      name: name,
      amount: amount,
    }

    let newBudgetItem = new db.BudgetItem(budgetItem)
    await newBudgetItem.save()

    // const response = await fetch(
    //   `https://ng-prj-test.firebaseio.com/orders/${userId}.json?auth=${token}`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       cartItems,
    //       totalAmount,
    //       date: date.toISOString(),
    //     }),
    //   }
    // );

    // if (!response.ok) {
    //   throw new Error('Something went wrong!')
    // }

    // const resData = await response.json()

    dispatch({
      type: ADD_BUDGET_ITEM,
      budgetItems: {
        id: newBudgetItem.id,
        userId: newBudgetItem.userId,
        budgetId: newBudgetItem.budgetId,
        name: newBudgetItem.name,
        amount: newBudgetItem.amount,
      },
    })
  }
}
