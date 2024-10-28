import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ResizeMode, Video } from 'expo-av'
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'

import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { icons } from '@/constants'
import { useGlobalContext } from '@/context/GlobalContext'
import { createVideoPost, FileAsset } from '@/lib/appwrite'

interface FormState {
  title: string;
  video: DocumentPicker.DocumentPickerResult | null;
  thumbnail: DocumentPicker.DocumentPickerResult | null;
  prompt: string;
}

const Create = () => {
  const { user } = useGlobalContext()
  console.log("CreateUser",user)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<FormState>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: '',
  })

  const OpenPicker = async (selectType: "image" | "video") => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === "image" ? ["image/png", 'image/jpg', 'image/jpeg'] : ['video/mp4', 'video/gif']
    })
    if (!result.canceled) {
      if (selectType === "image") {
        setForm(prev => ({
          ...prev,
          thumbnail: result
        }))
      } else if (selectType === "video") {
        setForm(prev => ({
          ...prev,
          video: result
        }))
      }
    } else {
      setTimeout(() => {
        Alert.alert('Document Picked', JSON.stringify(result, null, 2))
      }, 100)
    }
  }

  const handleSubmit = async () => {
    if (form.prompt === "" || form.title === "" || !form.thumbnail || !form.video) {
      return Alert.alert("Please provide all fields")
    }
    setUploading(true)
    try {
      if (!user?.$id) throw new Error("User not found")
      
        const thumbnailAsset: FileAsset = {
          uri: form.thumbnail?.assets?.[0]?.uri ?? '',
          name: form.thumbnail?.assets?.[0]?.name ?? '',
          type: form.thumbnail?.assets?.[0]?.mimeType ?? '',
          size: form.thumbnail?.assets?.[0]?.size ?? 0,
        }
        
        const videoAsset: FileAsset = {
          uri: form.video?.assets?.[0]?.uri ?? '',
          name: form.video?.assets?.[0]?.name ?? '',
          type: form.video?.assets?.[0]?.mimeType ?? '',
          size: form.video?.assets?.[0]?.size ?? 0,
        }

      await createVideoPost({
        title: form.title,
        thumbnail: thumbnailAsset,
        video: videoAsset,
        prompt: form.prompt,
        userId: user.$id
      })
     
      Alert.alert("Success", "Post uploaded Successfully")
      router.push('/home')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message)
      }
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      })
      setUploading(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold'>
          Upload Video
        </Text>
        <FormField
          title='Video Title'
          value={form.title}
          placeholder='Give your video a catchy title'
          handleChangeText={(e: string) => setForm(prev => ({ ...prev, title: e }))}
          otherStyles='mt-10'
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => OpenPicker("video")}>
            {form.video?.assets?.[0]?.uri ? (
              <Video
                source={{ uri: form.video.assets[0].uri }}
                className='w-full h-64 rounded-2xl'
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            )  : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    alt='upload'
                    className='w-1/2 h-1/2'
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className='text-base text-gray-100 font-pmedium'>
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => OpenPicker("image")} >
            {form.thumbnail?.assets?.[0]?.uri ? (
              <Image
                source={{ uri: form.thumbnail.assets[0].uri }}
                resizeMode='cover'
                className='w-full h-64 rounded-2xl'
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode='contain'
                  alt='upload'
                  className='w-5 h-5'
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title='AI Prompt'
          value={form.prompt}
          placeholder='The AI prompt of your video...'
          handleChangeText={(e: string) => setForm(prev => ({ ...prev, prompt: e }))}
          otherStyles='mt-7'
        />
        <CustomButton
          title='Submit & publish'
          handlePress={handleSubmit}
          containerStyles='mt-7'
          isloading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create