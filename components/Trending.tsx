import { View, Text, FlatList } from 'react-native'
type Post ={
  id:string
}
type TrendingProps={
  posts:Post[]
}
const Trending:React.FC<TrendingProps> = ({posts}) => {
  return (
    <FlatList
    data={posts}
    keyExtractor={(item)=>item.id}
    renderItem={({item})=>(
      <Text className='text-3xl text-white'>{item.id}</Text>
    )}
    horizontal
    />
  
  )
}
export default Trending