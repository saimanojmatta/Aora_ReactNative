import { icons } from '@/constants'
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native'

type Props = {}
const SearchInput = (props: Props) => {
    const[query,setQuery]=useState<string>('')
  return (
    <View className='flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary'>
      <TextInput 
      className='text-base mt-0.5 text-white flex-1 font-pregular'
      value={query}
      placeholder='Search a video topic'
      placeholderTextColor={'#CDCDE0'}
      onChangeText={(e:string)=>setQuery(e)}
      />
      <TouchableOpacity
      onPress={()=>{
        if(query==="")
            return Alert.alert("Missing Query",
        "Please input something to search results across database"
        )
      }}  
      >
      <Image source={icons.search} className="w-5 h-5" resizeMode="contain"/>
     </TouchableOpacity>
    </View>
  )
}
export default SearchInput