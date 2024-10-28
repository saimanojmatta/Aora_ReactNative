import SearchInput from "@/components/SearchInput";
import { FlatList,  StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { useEffect, useState } from "react";
import useAppwrite from "@/lib/useAppwrite";
import {  Post,  SearchPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Home = () => {
  const { query } = useLocalSearchParams();
  const searchQuery = Array.isArray(query) ? query.join(", ") : query || "";
  const { data: posts, refetch } = useAppwrite<Post>(()=>SearchPosts(searchQuery));
  console.log(posts);
  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary ">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.type}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-medium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {searchQuery}
              </Text>
              <View className="mt-6 mb-8">
                <SearchInput initialQuery={searchQuery} refetch={refetch} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos Found"
            subtitle="No vidoes found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};
export default Home;
const styles = StyleSheet.create({});
