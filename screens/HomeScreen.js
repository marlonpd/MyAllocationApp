import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  View,
  Button,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'

import * as budgetsActions from '../store/actions/budgets'

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const budgets = useSelector((state) => state.budgets.budgets)
  useEffect(() => {
    setIsLoading(true)
    dispatch(budgetsActions.fetchBudgets()).then(() => {
      setIsLoading(false)
    })
  }, [dispatch])

  const [budget, setEnteredBudget] = useState({
    name: '',
    amount: 0,
  })

  const updateField = (e, name) => {
    setEnteredBudget({
      ...budget,
      [name]:
        name === 'name' ? e.nativeEvent.text : parseFloat(e.nativeEvent.text),
    })
  }

  const addBudgetHandler = async () => {
    await dispatch(budgetsActions.addBudget(budget.name, budget.amount)).then(
      (newBudget) => {
        setEnteredBudget({
          name: '',
          amount: 0,
        })

        navigation.navigate('BudgetDetail', {
          id: newBudget.id,
          name: newBudget.name,
          amount: newBudget.amount,
        })
      }
    )
  }

  const openBudgetHanlder = (item) => {
    navigation.navigate('BudgetDetail', {
      id: item.id,
      name: item.name,
      amount: item.amount,
    })
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.fList}
        data={budgets}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={(itemData) => (
          <View style={styles.listItem}>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => openBudgetHanlder(itemData.item)}
            >
              <View style={styles.inputWrap}>
                <Text style={styles.listContentLeft}>{itemData.item.name}</Text>
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.listContentRight}>
                  {itemData.item.amount.toString()}
                </Text>
              </View>
            </TouchableOpacity>
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
          keyboardType='numeric'
          onChange={(e) => updateField(e, 'amount')}
          value={String(budget.amount)}
        />
        <Button title='ADD' onPress={addBudgetHandler} />
      </View>
    </View>
  )
}

export default HomeScreen

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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
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
})
