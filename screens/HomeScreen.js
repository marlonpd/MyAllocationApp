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
import EditBudgetModal from '../components/UI/EditBudgetModal'

import * as budgetsActions from '../store/actions/budgets'
import * as budgetItemsActions from '../store/actions/budget-items'

const Row = ({ item, navigation }) => {
  const openBudgetHanlder = (item) => {
    navigation.navigate('BudgetDetail', {
      id: item.id,
      name: item.name,
      amount: item.amount,
    })
  }

  return (
    <RectButton style={styles.rectButton}>
      <View style={styles.listItem}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => openBudgetHanlder(item)}
        >
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

const SwipeableRow = ({ item, index, nav, onEditBudget, onCloneBudget }) => {
  const dispatch = useDispatch()

  return (
    <AppleStyleSwipeableRow
      item={item}
      onEditBudget={onEditBudget}
      onCloneBudget={onCloneBudget}
    >
      <Row
        dispatch={dispatch}
        item={item}
        sender={'budget'}
        navigation={nav}
        onCloneBudget={onCloneBudget}
      />
    </AppleStyleSwipeableRow>
  )
}

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState({
    id: 0,
    name: '',
    amount: '',
  })
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
    amount: '',
  })

  const updateField = (e, name) => {
    setEnteredBudget({
      ...budget,
      [name]:
        name === 'name' ? e.nativeEvent.text : parseFloat(e.nativeEvent.text),
    })
  }

  const updateAmountField = (e, name) => {
    setEnteredBudget({
      ...budget,
      [name]: e.nativeEvent.text.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''),
    })
  }

  const addBudgetHandler = async () => {
    await dispatch(budgetsActions.addBudget(budget.name, budget.amount)).then(
      (newBudget) => {
        setEnteredBudget({
          name: '',
          amount: '',
        })

        navigation.navigate('BudgetDetail', {
          id: newBudget.id,
          name: newBudget.name,
          amount: newBudget.amount,
        })
      }
    )
  }

  const updateBudgetHandler = async (budget) => {
    await dispatch(budgetsActions.updateBudget(budget)).then(() => {
      setIsEditMode(false)
    })
  }

  const editBudgetHandler = (budget) => {
    setSelectedBudget({
      id: budget.id,
      name: budget.name,
      amount: budget.amount,
    })
    setIsEditMode(true)
  }

  const cloneBudgetHandler = async (budget) => {
    setIsLoading(true)
    await dispatch(budgetsActions.cloneBudget(budget)).then(
      async (newBudget) => {
        await dispatch(
          budgetItemsActions.cloneBudgetItems(budget, newBudget)
        ).then(() => {
          setIsLoading(false)
        })
      }
    )
  }

  const cancelEditHandler = () => {
    setIsEditMode(false)
  }

  return (
    <View style={styles.container}>
      <EditBudgetModal
        visible={isEditMode}
        onUpdateBudget={updateBudgetHandler}
        onCancelEdit={cancelEditHandler}
        selectedBudget={selectedBudget}
      />
      <FlatList
        style={styles.fList}
        data={budgets}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={(itemData) => (
          <SwipeableRow
            item={itemData.item}
            index={itemData.item.id.toString()}
            nav={navigation}
            onEditBudget={editBudgetHandler}
            onCloneBudget={cloneBudgetHandler}
          />
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
          onChange={(e) => updateAmountField(e, 'amount')}
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
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
  dateText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 10,
    color: '#999',
    fontWeight: 'bold',
  },
})
