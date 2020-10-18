import * as SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class BudgetItem extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('myallocation.db')
  }

  static get tableName() {
    return 'budget_item'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      userId: { type: types.INTEGER, not_null: true },
      budgetId: { type: types.INTEGER, not_null: true },
      name: { type: types.TEXT, not_null: true },
      amount: { type: types.FLOAT, default: 0 },
    }
  }

  static destroyMany(budgetId) {
    const sql = `DELETE FROM ${this.tableName} WHERE budgetId = ?;`
    const param = budgetId

    return this.repository.databaseLayer
      .executeSql(sql, param)
      .then(({ rows }) => {})
  }
}
