import { icons } from "@/constants";
import { Post } from "@/lib/appwrite";
import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ViewToken,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
const zoomIn = {
  from: {
    transform: [{ scale: 0.9 }],
  },
  to: {
    transform: [{ scale: 1 }],
  },
};

const zoomOut = {
  from: {
    transform: [{ scale: 1 }],
  },
  to: {
    transform: [{ scale: 0.9 }],
  },
};

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: Post;
  item: Post;
}) => {
  console.log("Video URL:", item.video);
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={play}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (
              status.isLoaded &&
              !status.isPlaying &&
              status.positionMillis >= (status.durationMillis ?? 0)
            ) {
              setPlay(false);
            }
          }}
          onError={(error) => {
            console.error("Video playback error:", error); // Log any errors during playback
            setPlay(false); // Optionally stop playback on error
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};
const Trending = ({ posts }: { posts: Post[] }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);
  // console.log("activeItem Logs", activeItem);
  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(
        posts.find((post) => post.$id === viewableItems[0].key) || posts[0]
      );
    }
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
    />
  );
};
export default Trending;
