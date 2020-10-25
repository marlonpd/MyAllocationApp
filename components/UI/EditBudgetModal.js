import React, { useState, useEffect } from 'react'
import { View, TextInput, Button, StyleSheet, Modal } from 'react-native'

const EditBudgetModal = (props) => {
  useEffect(() => {
    setSelectedBudget(props.selectedBudget)
  }, [props.selectedBudget])

  const updateBudgetHandler = () => {
    props.onUpdateBudget(selectedBudget)
  }
  const [selectedBudget, setSelectedBudget] = useState(props.selectedBudget)

  const updateField = (e, name) => {
    setSelectedBudget({
      ...selectedBudget,
      [name]:
        name === 'name' ? e.nativeEvent.text : parseFloat(e.nativeEvent.text),
    })
  }

  const updateAmountField = (e, name) => {
    setSelectedBudget({
      ...selectedBudget,
      [name]: e.nativeEvent.text.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ''),
    })
  }

  return (
    <Modal visible={props.visible} animationType='slide'>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Name'
          name='name'
          style={styles.input}
          onChange={(e) => updateField(e, 'name')}
          value={selectedBudget.name}
        />
        <TextInput
          placeholder='Amount'
          name='amount'
          style={styles.input}
          keyboardType='numeric'
          onChange={(e) => updateAmountField(e, 'amount')}
          value={String(selectedBudget.amount)}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title='CANCEL' color='red' onPress={props.onCancelEdit} />
          </View>
          <View style={styles.button}>
            <Button title='ADD' onPress={updateBudgetHandler} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  button: {
    width: '40%',
  },
})

export default EditBudgetModal
