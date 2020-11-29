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
import EditBudgetItemModal from '../components/UI/EditBudgetItemModal'

import * as budgetItemsActions from '../store/actions/budget-items'

const Row = ({ item, budgetAmount }) => {
  return (
    <RectButton style={styles.rectButton}>
      <View style={styles.listItem}>
        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.inputWrap}>
            <Text
              style={[
                styles.listContentLeft,
                item.isPaid ? styles.paidItem : null,
              ]}
            >
              {item.name}
            </Text>
          </View>
          <View style={styles.inputWrap}>
            <Text
              style={[
                styles.listContentRight,
                item.isPaid ? styles.paidItem : null,
              ]}
            >
              {item.amount.toString()}
            </Text>
            <Text>remaining: {item.runningBalance}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </RectButton>
  )
}

const SwipeableRow = ({
  item,
  index,
  nav,
  onEditBudgetItem,
  onMarkPaidBudgetItem,
  budgetAmount,
}) => {
  const dispatch = useDispatch()

  return (
    <AppleStyleSwipeableRow item={item}>
      <Row
        dispatch={dispatch}
        item={item}
        sender={'budgetItem'}
        onEditBudgetItem={onEditBudgetItem}
        onMarkPaidBudgetItem={onMarkPaidBudgetItem}
        budgetAmount={budgetAmount}
      />
    </AppleStyleSwipeableRow>
  )
}

const BudgetDetailScreen = ({ route, navigation }) => {
  const { budgetId, name } = route.params
  let { amount } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedBudgetItem, setSelectedBudgetItem] = useState({})
  let budgetItems = useSelector((state) => state.budgetItems.budgetItems)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsLoading(true)
    dispatch(budgetItemsActions.fetchBudgetItems(budgetId)).then(() => {
      setIsLoading(false)
    })

    navigation.setOptions({ title: `${name} - ${amount}` })

    return () => {
      dispatch(budgetItemsActions.resetBudgetItems()).then(() => {
        setIsLoading(false)
      })
    }
  }, [dispatch, budgetId, navigation])

  useEffect(() => {
    budgetItems.map((bi) => {
      amount = amount - bi.amount

      let newPropsObj = {
        runningBalance: amount,
      }

      return Object.assign(bi, newPropsObj)
    })
    return () => {
      budgetItems = []
    }
  }, [budgetItems])

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

  const updateBudgetItemHandler = async (budgetItem) => {
    await dispatch(budgetItemsActions.updateBudgetItem(budgetItem)).then(() => {
      setIsEditMode(false)
    })
  }

  const onMarkPaidBudgetItemHandler = async (budgetItem) => {
    await dispatch(budgetItemsActions.markPaidBudgetItem(budgetItem)).then(
      () => {
        setIsEditMode(false)
      }
    )
  }

  const editBudgetItemHandler = (budgetItem) => {
    setSelectedBudgetItem(budgetItem)
    setIsEditMode(true)
  }

  const cancelEditHandler = () => {
    setIsEditMode(false)
  }

  return (
    <View style={styles.container}>
      <EditBudgetItemModal
        visible={isEditMode}
        onUpdateBudgetItem={updateBudgetItemHandler}
        onCancelEdit={cancelEditHandler}
        selectedBudgetItem={selectedBudgetItem}
      />
      <FlatList
        style={styles.fList}
        data={budgetItems}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={(itemData) => (
          <SwipeableRow
            item={itemData.item}
            index={itemData.item.id.toString()}
            nav={navigation}
            onMarkPaidBudgetItem={onMarkPaidBudgetItemHandler}
            onEditBudgetItem={editBudgetItemHandler}
            budgetAmount={amount}
          />
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
  paidItem: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
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
