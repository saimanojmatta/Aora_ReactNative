import { Tabs } from 'expo-router'
import { StyleSheet, Text, View,Image } from 'react-native'
import {icons} from '../../constants'


const  TabIcon=({icon,color,name,focused}:{icon:any,name:string,focused:boolean,color:string})=>{

  return (
    <View className='flex justify-center items-center gap-2'>
      <Image source={icon}
      resizeMode='contain'
      tintColor={color}
      className='h-6 w-6'
      />
      <Text className={`${focused?'font-psemibold':'font-pregular'} text-xs`} style={{color:color}}>
        {name}
      </Text>
      
    </View>
  )
}
const _layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel:false,
      tabBarActiveTintColor:"#FFA001",
      tabBarInactiveTintColor:"#CDCDE0",
      tabBarStyle:{
        backgroundColor:"#161622",
        borderTopWidth:1,
        borderTopColor:"#232533",
        height:84
      }

    }} >
      <Tabs.Screen name='home' options={{
        title:'Home',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
          <TabIcon 
          icon={icons.home} name='Home' color={color} focused={focused}/>
        )
      }}/>
      <Tabs.Screen name='bookmark' options={{
        title:'Bookmark',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
          <TabIcon 
          icon={icons.bookmark} name='Bookmark' color={color} focused={focused}/>
        )
      }}/>
      <Tabs.Screen name='create' options={{
        title:'Create',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
          <TabIcon 
          icon={icons.plus} name='Create' color={color} focused={focused}/>
        )
      }}/>
      <Tabs.Screen name='profile' options={{
        title:'Profile',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
          <TabIcon 
          icon={icons.profile} name='Profile' color={color} focused={focused}/>
        )
      }}/>
      
    </Tabs>
  )
}
export default _layout
const styles = StyleSheet.create({})