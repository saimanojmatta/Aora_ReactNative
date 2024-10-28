import SearchInput from '@/components/SearchInput'
import { images } from '@/constants'
import { Button, FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Trending from '../../components/Trending'
import EmptyState from '@/components/EmptyState'
import { useState } from 'react'
import useAppwrite from '@/lib/useAppwrite'
import { GetAllPosts, Post,GetLatestPosts } from '@/lib/appwrite'
import VideoCard from '@/components/VideoCard'

const Home = () => {
  const{data:posts,refetch}=useAppwrite<Post>(GetAllPosts)
  const{data:LatestPost}=useAppwrite<Post>(GetLatestPosts)
  const[refreshing,SetRefreshing]=useState(false)
  const onRefresh=async()=>{
    SetRefreshing(true)
    await refetch()
    SetRefreshing(false)
  }
  return (
   <SafeAreaView className='bg-primary '>
    <FlatList
      data={posts} 
      keyExtractor={(item)=>item.$id}
      renderItem={({item})=>(
        <VideoCard
        title={item.type}
        thumbnail={item.thumbnail}
        video={item.video}
        creator={item.creator.username}
        avatar={item.creator.avatar}

        />
        
      )}
      ListHeaderComponent={()=>(
        <View className='flex my-6 px-4 space-y-6 '>
          <View className='flex justify-between item-start flex-row mb-6'>
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                Manoj
              </Text>
            </View>
            <View className="mt-1.5">
              <Image
              source={images.logoSmall}
              className="w-9 h-10"
              resizeMode="contain"
               />
            </View>
          </View>
          <SearchInput/>
          <View className='w-full flex-1 pt-5 pb-8'>
            <Text className='ext-lg font-pregular text-gray-100 mb-3'>
              Latest Vidoes
            </Text>
            <Trending posts={LatestPost??[]}/>
          </View>
        </View>
  )}
  ListEmptyComponent={()=>(
    <EmptyState
    title="No videos Found"
    subtitle="No vidoes created yet"
    />
  )}
  refreshControl={
    <RefreshControl  refreshing={refreshing} onRefresh={onRefresh}/>
  }
    />
   
    
   </SafeAreaView>
  )
}
export default Home
const styles = StyleSheet.create({})