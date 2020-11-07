import React, { useState, useEffect, useReducer, useCallback } from 'react'
import {
  AsyncStorage,
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import * as AppAuth from 'expo-app-auth'

export const isAndroid = () => Platform.OS === 'android'
import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors'
import * as authActions from '../../store/actions/auth'
import { Platform } from 'react-native'
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    }
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    }
    let updatedFormIsValid = true
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    }
  }
  return state
}

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [isSignup, setIsSignup] = useState(false)
  const dispatch = useDispatch()
  let [authState, setAuthState] = useState(null)

  useEffect(() => {
    ;(async () => {
      let cachedAuth = await getCachedAuthAsync()
      if (cachedAuth && !authState) {
        setAuthState(cachedAuth)
      }
    })()
  }, [])

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  })

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }])
    }
  }, [error])

  const authHandler = async () => {
    let action
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      )
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      )
    }
    setError(null)
    setIsLoading(true)
    try {
      await dispatch(action)
      // props.navigation.navigate('Shop');
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      })
    },
    [dispatchFormState]
  )

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={10} style={styles.screen}>
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id='email'
              label='E-Mail'
              keyboardType='email-address'
              required
              email
              autoCapitalize='none'
              errorText='Please enter a valid email address.'
              onInputChange={inputChangeHandler}
              initialValue=''
            />
            <Input
              id='password'
              label='Password'
              keyboardType='default'
              secureTextEntry
              required
              minLength={5}
              autoCapitalize='none'
              errorText='Please enter a valid password.'
              onInputChange={inputChangeHandler}
              initialValue=''
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size='small' color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? 'Sign Up' : 'Login'}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View>
              <Text>Expo AppAuth Example</Text>
              <Button
                title='Sign In with Google '
                onPress={async () => {
                  const _authState = await signInAsync()
                  setAuthState(_authState)
                }}
              />
              <Button
                title='Sign Out '
                onPress={async () => {
                  await signOutAsync(authState)
                  setAuthState(null)
                }}
              />
              <Text>{JSON.stringify(authState, null, 2)}</Text>
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

let config = {
  issuer: 'https://accounts.google.com',
  scopes: ['openid', 'profile', 'email', 'localId', 'offline_access'],
  /* This is the CLIENT_ID generated from a Firebase project */
  clientId:
    '198150416247-0okdv8bfavpr3bp18nido0q2eebbpao5.apps.googleusercontent.com',
}

let StorageKey = '@MyApp:CustomGoogleOAuthKey'

export async function signInAsync() {
  let authState = await AppAuth.authAsync(config)
  await cacheAuthAsync(authState)
  console.log('signInAsync', authState)
  return authState
}

async function cacheAuthAsync(authState) {
  return await AsyncStorage.setItem(StorageKey, JSON.stringify(authState))
}

export async function getCachedAuthAsync() {
  let value = await AsyncStorage.getItem(StorageKey)
  let authState = JSON.parse(value)
  console.log('getCachedAuthAsync', authState)
  if (authState) {
    if (checkIfTokenExpired(authState)) {
      return refreshAuthAsync(authState)
    } else {
      return authState
    }
  }
  return null
}

function checkIfTokenExpired({ accessTokenExpirationDate }) {
  return new Date(accessTokenExpirationDate) < new Date()
}

async function refreshAuthAsync({ refreshToken }) {
  let authState = await AppAuth.refreshAsync(config, refreshToken)
  console.log('refreshAuth', authState)
  await cacheAuthAsync(authState)
  return authState
}

export async function signOutAsync({ accessToken }) {
  try {
    await AppAuth.revokeAsync(config, {
      token: accessToken,
      isClientIdProvided: true,
    })
    await AsyncStorage.removeItem(StorageKey)
    return null
  } catch (e) {
    alert(`Failed to revoke token: ${e.message}`)
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
})

export default AuthScreen
