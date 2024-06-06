import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'


const SignIn = () => {
  const {setUser, setIsLoggedIn} = useGlobalContext();
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if ( !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields')
    }

    setIsSubmitting(true);

    try {
      await signIn({
        email: form.email,
        password: form.password
      });

      const result = await getCurrentUser();
      setUser(result ?? null); // TODO: check if user is null or undefined
      setIsLoggedIn(true);

      Alert.alert('Success', 'User signed in successfully');
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }

  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]' />
          <Text className='text-white text-2xl font-psemibold mt-10'>Log in to Aora</Text>
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
            <Text className='text-gray-100 text-lg font-pregular'>Don't have an account?</Text>
            <Link href='/sign-up' className='text-secondary text-lg font-psemibold'>Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn