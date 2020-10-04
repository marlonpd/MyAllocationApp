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

import * as budgetItemsActions from '../store/actions/budget-items'

const BudgetDetailScreen = ({ route, navigation }) => {
  const { id, name, amount } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const budgetItems = useSelector((state) => state.budgetItems.budgetItems)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsLoading(true)
    dispatch(budgetItemsActions.fetchBudgetItems(id)).then(() => {
      setIsLoading(false)
    })
  }, [dispatch, id])

  const [budgetItem, setEnteredBudgetItem] = useState({
    id: id,
    name: '',
    amount: 0,
  })

  const updateField = (e, name) => {
    setEnteredBudgetItem({
      ...budgetItem,
      [name]:
        name === 'name' ? e.nativeEvent.text : parseFloat(e.nativeEvent.text),
    })
  }

  const addBudgetItemHandler = async () => {
    await dispatch(
      budgetItemsActions.addBudgetItem(id, budgetItem.name, budgetItem.amount)
    ).then((newBudgetItem) => {
      setEnteredBudgetItem({
        name: '',
        amount: 0,
      })
    })
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.fList}
        data={budgetItems}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={(itemData) => (
          <View style={styles.listItem}>
            <TouchableOpacity style={styles.itemContainer}>
              <View style={styles.inputWrap}>
                <Text style={styles.listContentLeft}>{itemData.item.name}</Text>
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.listContentRight}>
                  {itemData.item.amount}
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
          value={budgetItem.name}
        />
        <TextInput
          placeholder='Amount'
          name='amount'
          style={styles.input}
          keyboardType='numeric'
          onChange={(e) => updateField(e, 'amount')}
          value={String(budgetItem.amount)}
        />
        <Button title='ADD' onPress={addBudgetItemHandler} />
      </View>
    </View>
  )
}

export default BudgetDetailScreen

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
