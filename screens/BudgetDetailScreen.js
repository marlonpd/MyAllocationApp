import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

const BudgetDetailScreen = ({ route, navigation }) => {
  const { id, name, amount } = route.params

  return (
    <View style={styles.container}>
      <Text> Budget Detail Screen</Text>

      <Text>id: {id}</Text>
      <Text>name: {JSON.stringify(name)}</Text>
      <Text>amount: {JSON.stringify(amount)}</Text>
      <Button title='Click Here' onPress={() => alert('Button Clicked!')} />
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
})
