import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import { Link } from 'expo-router'
import CustomButton from '../../components/CustomButton'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    console.log(form)
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]' />
          <Text className='text-white text-2xl font-psemibold mt-10'>Sign up to Aora</Text>
          <FormField
            title='Username'
            value={form.username}
            handleChangeText={(e) => { setForm({ ...form, email: e }) }}
            otherStyles='mt-10'
          />

          <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e) => { setForm({ ...form, email: e }) }}
            otherStyles='mt-4'
          />

          <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e) => { setForm({ ...form, password: e }) }}
            otherStyles='mt-4'
          />

          <CustomButton
            title='Sign in'
            handlePress={handleSubmit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-gray-100 text-lg font-pregular'>Have an account already?</Text>
            <Link href='/sign-in' className='text-secondary text-lg font-psemibold'>Sign in</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp