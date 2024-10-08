import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
const CustomButton = ({title,handlePress,containerStyles,isloading,textStyles}:{title:string,handlePress:any,containerStyles:string,isloading?:boolean,textStyles?:string}) => {
  return (
    <TouchableOpacity
    onPress={handlePress}
    activeOpacity={0.7}
     className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isloading?'opacity-50':''}`}>
      <Text className={`text-primary
       text-lg font-psemibold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}
export default CustomButton
const styles = StyleSheet.create({})