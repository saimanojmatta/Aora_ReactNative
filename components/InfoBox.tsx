import { StyleSheet, Text, View } from 'react-native'
type Props = {
    title:string|number|undefined,
    subtitle?:string,
    containerStyles?:string,
    titleStyles:string
}
const InfoBox = ({title,subtitle,containerStyles,titleStyles}: Props) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
        </Text>
        <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  )
}
export default InfoBox
const styles = StyleSheet.create({})