import Budget from '../../models/budget';
import db from '../../db';

export const ADD_BUDGETS = 'ADD_BUDGETS';
export const SET_BUDGETS = 'SET_BUDGETS';

export const fetchBudgets = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const allBudgets = await db.Budget({ userId });
      // const resData = await response.json();
      // const loadedOrders = [];

      // for (const key in resData) {
      //   loadedOrders.push(
      //     new Order(
      //       key,
      //       resData[key].cartItems,
      //       resData[key].totalAmount,
      //       new Date(resData[key].date)
      //     )
      //   );
      // }
      dispatch({ type: SET_BUDGETS, budgets: allBudgets });
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    const response = await fetch(
      `https://ng-prj-test.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date,
      },
    });
  };
};
