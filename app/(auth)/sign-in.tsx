import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { images } from '@/constants'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import {  Alert, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GetCurrentUser, Signin } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalContext'
const SignIn = () => {
  const{setUser,setIsloggedIn}=useGlobalContext()
 const[form,SetForm]=useState({
  email:'',
  password:"",
 })
 const[isSubmitting,setIsSubmitting]=useState(false)
 const submit=async()=>{
  if(form.email===""||form.password===""){
    Alert.alert("Error","Please fill in all the fields")
  }
  setIsSubmitting(true)
  try {
    await Signin(form.email,form.password)
    const result=await GetCurrentUser()
    setUser(result)
    setIsloggedIn(true)
    Alert.alert("Success", "User signed in successfully");
    router.replace('/home')
  } catch (error) {
    console.log(error)
    if(error instanceof Error){
      Alert.alert('Error message',error.message)
    }else{
      Alert.alert('Error','sigup error occured')
    }
  }finally{
    setIsSubmitting(false)
  }
 }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full flex justify-center h-full px-4 my-6' style={{minHeight:Dimensions.get('window').height-100}}>
          <Image source={images.logo} resizeMode='contain'
          className='w-[115px] h-[34px]'
          />
          <Text className='text-2xl font-semibold text-white mt-10 font-psemibold'>Log in to Aora
          </Text>
          <FormField
           title="email"
           value={form.email}
           handleChangeText={(e)=>SetForm({...form,email:e})}
           otherStyles='mt-7'
          keyboardType='email-address'
          />
          <FormField
           title="Password"
           value={form.password}
           handleChangeText={(e)=>SetForm({...form,password:e})}
           otherStyles='mt-7'
          />
          <CustomButton
          title='Sign In'
          handlePress={submit}
          containerStyles='mt-7'
          isloading={isSubmitting}
          />
          <View className='flex  pt-5 flex-row gap-2 justify-center'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have an account?
            </Text>
            <Link href={'/sign-up'}
            className='text-lg font-psemibold text-secondary'>
            Signup
            </Link>
          </View>

        </View>
      </ScrollView>
      
    </SafeAreaView>
  )
}
export default SignIn
const styles = StyleSheet.create({})