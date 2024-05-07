import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen options={{ headerShown: false }} name="sign-in" />
        <Stack.Screen options={{ headerShown: false }} name="sign-up" />
      </Stack>
    </>
  )
}

export default AuthLayout