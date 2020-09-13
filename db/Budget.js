import * as SQLite from 'expo-sqlite';
import { BaseModel, types } from 'expo-sqlite-orm';

export default class Budget extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase('myallocation.db');
  }

  static get tableName() {
    return 'budget';
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      userId: { type: types.INTEGER, not_null: true },
      name: { type: types.TEXT, not_null: true },
      amount: { type: types.FLOAT, default: 0 },
    };
  }
}
