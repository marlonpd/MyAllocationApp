import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  View,
  Button,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { FlatList, RectButton } from 'react-native-gesture-handler'

import AppleStyleSwipeableRow from '../components/UI/AppleStyleSwipeableRow'

import * as budgetItemsActions from '../store/actions/budget-items'

const Row = ({ item }) => {
  return (
    <RectButton style={styles.rectButton}>
      <View style={styles.listItem}>
        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.inputWrap}>
            <Text style={styles.listContentLeft}>{item.name}</Text>
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.listContentRight}>
              {item.amount.toString()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </RectButton>
  )
}

const SwipeableRow = ({ item, index, nav }) => {
  const dispatch = useDispatch()

  return (
    <AppleStyleSwipeableRow item={item}>
      <Row dispatch={dispatch} item={item} sender={'budgetItem'} />
    </AppleStyleSwipeableRow>
  )
}

const BudgetDetailScreen = ({ route, navigation }) => {
  const { id } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const budgetItems = useSelector((state) => state.budgetItems.budgetItems)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsLoading(true)
    dispatch(budgetItemsActions.fetchBudgetItems(id)).then(() => {
      setIsLoading(false)
    })

    return () => {
      dispatch(budgetItemsActions.resetBudgetItems()).then(() => {
        setIsLoading(false)
      })
    }
  }, [dispatch, id])

  const [budgetItem, setEnteredBudgetItem] = useState({
    id: id,
    name: '',
    amount: '',
  })

  const updateField = (e, name) => {
    setEnteredBudgetItem({
      ...budgetItem,
      [name]: name === 'name' ? e.nativeEvent.text : e.nativeEvent.text,
    })
  }

  const updateAmountField = (e, name) => {
    setEnteredBudgetItem({
      ...budgetItem,
      [name]: e.nativeEvent.text.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''),
    })
  }

  const addBudgetItemHandler = async () => {
    await dispatch(
      budgetItemsActions.addBudgetItem(id, budgetItem.name, budgetItem.amount)
    ).then((newBudgetItem) => {
      setEnteredBudgetItem({
        name: '',
        amount: '',
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
          <SwipeableRow
            item={itemData.item}
            index={itemData.item.id.toString()}
            nav={navigation}
          />
          // <View style={styles.listItem}>
          //   <TouchableOpacity style={styles.itemContainer}>
          //     <View style={styles.inputWrap}>
          //       <Text style={styles.listContentLeft}>{itemData.item.name}</Text>
          //     </View>
          //     <View style={styles.inputWrap}>
          //       <Text style={styles.listContentRight}>
          //         {itemData.item.amount}
          //       </Text>
          //     </View>
          //   </TouchableOpacity>
          // </View>
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
          onChange={(e) => updateAmountField(e, 'amount')}
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
