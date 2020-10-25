import React, { Component } from 'react'
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RectButton } from 'react-native-gesture-handler'

import Swipeable from 'react-native-gesture-handler/Swipeable'
import * as budgetsActions from '../../store/actions/budgets'
import * as budgetItemsActions from '../../store/actions/budget-items'

export default class AppleStyleSwipeableRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: props.item,
    }
  }

  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    })
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Archive
        </Animated.Text>
      </RectButton>
    )
  }
  renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    })

    const pressHandler = async () => {
      this.close()
      const { dispatch, sender } = this.props.children.props
      // console.log('before if text', text)
      // console.log(x)
      if (text === 'Delete') {
        if (sender === 'budget')
          dispatch(await budgetsActions.deleteBudget(this.state.item.id))

        if (sender === 'budgetItem')
          dispatch(
            await budgetItemsActions.deleteBudgetItem(this.state.item.id)
          )
      }

      if (text === 'Edit') {
        if (sender === 'budget') this.props.onEditBudget(this.state.item)

        if (sender === 'budgetItem')
          this.props.children.props.onEditBudgetItem(this.state.item)
      }

      if (text === 'Clone') {
        this.props.onCloneBudget(this.state.item)
      }
    }
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={() => pressHandler()}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    )
  }
  renderRightActions = (progress) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {this.renderRightAction('Clone', '#C8C7CD', 192, progress)}
      {this.renderRightAction('Edit', '#ffab00', 128, progress)}
      {this.renderRightAction('Delete', '#dd2c00', 64, progress)}
    </View>
  )
  updateRef = (ref) => {
    this._swipeableRow = ref
  }
  close = () => {
    this._swipeableRow.close()
  }
  render() {
    const { children } = this.props
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        //  renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
