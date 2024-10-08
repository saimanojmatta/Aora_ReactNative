import { icons, images } from '@/constants';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
interface FormFieldProps {
    title: string;
    value: string;
    handleChangeText: (text: string) => void; // Accepts a string
    otherStyles?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'number-pad';
    placeholder?:string
  }
const FormField:React.FC<FormFieldProps> = ({title,value,handleChangeText,otherStyles,keyboardType,placeholder}) => {
    const[showPassword,setShowPassword]=useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>
      <View className='w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center'>
        <TextInput
        className='flex-1 text-white font-psemibold text-base'
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7B7B8B"
        onChangeText={handleChangeText}
        secureTextEntry={title==="Password" && !showPassword}
        />
        {title==="Password" && (
            <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
                <Image source={!showPassword?icons.eye:icons.eyeHide}
                className='h-6 w-6'
                resizeMode='contain'/>
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}
export default FormField
const styles = StyleSheet.create({})