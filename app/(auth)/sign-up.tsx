import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { images } from '@/constants'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import {  Alert, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const SignUp = () => {
 const[form,SetForm]=useState({
  username:'',
  email:'',
  password:"",
 })
 const[isSubmitting,setIsSubmitting]=useState(false)
 const submit=async()=>{
  if(form.username===""||form.email===""||form.password===""){
    Alert.alert("Error","Please fill in all the fields")
  }
  setIsSubmitting(true)
  try {
    const result=await createUser(form.email,form.password,form.username)
    //set it to global state
    router.replace('/home')
    
  } catch (error) {
    console.log(error)
    if(error instanceof Error){
      Alert.alert('Error message',error.message)
    }else {
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
          <Text className='text-2xl font-semibold text-white mt-10 font-psemibold'>Sign Up to Aora
          </Text>
          <FormField
           title="Username"
           value={form.username}
           handleChangeText={(e)=>SetForm({...form,username:e})}
           otherStyles='mt-10'
          />
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
          title='Sign Up'
          handlePress={submit}
          containerStyles='mt-7'
          isloading={isSubmitting}
          />
          <View className='flex  pt-5 flex-row gap-2 justify-center'>
            <Text className='text-lg text-gray-100 font-pregular'>
             Have an account already?
            </Text>
            <Link href={'/sign-in'}
            className='text-lg font-psemibold text-secondary'>
            Login
            </Link>
          </View>

        </View>
      </ScrollView>
      
    </SafeAreaView>
  )
}
export default SignUp
const styles = StyleSheet.create({})