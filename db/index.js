import Budget from './Budget';
import BudgetItem from './BudgetItem';

export default {
  async initDatabase() {
    Budget.dropTable();
    Budget.dropTable();

    Budget.createTable();
    BudgetItem.createTable();
    console.log('Table created.....');
    // const props = {
    //   name: 'Bob',
    //   amount: 123,
    // };

    // const bud = new Budget(props);
    // bud.save();

    // // let user = Budget.findBy({ name: 'Bob' });
    let b = await Budget.query();
    console.log(b);
  },
  newBudget(budget) {
    return new Budget(budget);
  },
  newBudgetItem(budgetItem) {
    return new BudgetItem(budgetItem);
  },
  Budget,
  BudgetItem,
};
