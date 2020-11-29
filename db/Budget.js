import * as SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'

export default class Budget extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('myallocation.db')
  }

  static get tableName() {
    return 'budget'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      budgetId: { type: types.TEXT, not_null: true },
      userId: { type: types.INTEGER, not_null: true },
      name: { type: types.TEXT, not_null: true },
      amount: { type: types.FLOAT, default: 0 },
      isArchived: { type: types.INTEGER, default: 0 },
    }
  }

  static get lastItem() {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY column DESC LIMIT 1`
    return this.repository.databaseLayer
      .executeSql(sql)
      .then(({ rows }) => rows)
  }
}
