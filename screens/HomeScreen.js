import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';

import db from '../db';

const HomeScreen = ({ navigation }) => {
  const [budget, setEnteredBudget] = useState({
    name: '',
    amount: 0,
  });
  const [allBudgets, updateAllBudget] = useState([]);

  const updateField = (e, name) => {
    console.log(e.nativeEvent.text);
    setEnteredBudget({
      ...budget,
      [name]:
        name === 'name' ? e.nativeEvent.text : parseFloat(e.nativeEvent.text),
    });
  };

  const addBudgetHandler = async () => {
    updateAllBudget((allBudgets) => [
      ...allBudgets,
      {
        id: Math.random().toString(),
        name: budget.name,
        amount: budget.amount,
      },
    ]);

    const props = {
      name: budget.name,
      amount: budget.amount,
    };

    let newBudget = new db.Budget(props);
    await newBudget.save();

    navigation.navigate('BudgetDetail', {
      name: budget.name,
      amount: budget.amount,
    });

    setEnteredBudget({
      name: '',
      amount: 0,
    });
  };

  useEffect(() => {
    async function fetchBudgets() {
      const budgets = await db.Budget.query();
      updateAllBudget(budgets);
    }
    fetchBudgets();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.fList}
        keyExtractor={(item, index) => item.id.toString()}
        data={allBudgets}
        renderItem={(itemData) => (
          <View style={styles.listItem}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.listContentLeft}
                value={itemData.item.name}
              />
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.listContentRight}
                value={String(itemData.item.amount)}
              />
            </View>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Name'
          name='name'
          style={styles.input}
          onChange={(e) => updateField(e, 'name')}
          value={budget.name}
        />
        <TextInput
          placeholder='Amount'
          name='amount'
          style={styles.input}
          onChange={(e) => updateField(e, 'amount')}
          value={String(budget.amount)}
        />
        <Button title='ADD' onPress={addBudgetHandler} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '40%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 50,
  },
  fList: {
    alignSelf: 'stretch',
    textAlign: 'center',
    width: '100%',
  },
  inputWrap: {
    flex: 1,
    borderColor: '#cccccc',
    borderBottomWidth: 1,
    marginBottom: 2,
  },
  listContentLeft: {
    flex: 1,
  },
  listContentRight: {
    flex: 1,
  },
});
