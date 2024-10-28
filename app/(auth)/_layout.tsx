import Loader from '@/components/Loader'
import { useGlobalContext } from '@/context/GlobalContext'
import { Redirect, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
const AuthLayout = () => {
  const{isLoading,isLoggedIn}=useGlobalContext()
  if(!isLoading&& isLoggedIn) <Redirect href={'/home'}/>
  return (
    <>
    <Stack>
     <Stack.Screen
     name='sign-in'
     options={{
      headerShown:false
     }}
     />
     <Stack.Screen
     name='sign-up'
     options={{
      headerShown:false
     }}
     />
    </Stack>
    <Loader  isLoading={isLoading}/>
    <StatusBar backgroundColor='#161622' style='light'/>
    </>
    
  )
}
export default AuthLayout
const styles = StyleSheet.create({})