import { icons } from "@/constants";
import { usePathname, router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

const SearchInput = ({
  initialQuery,
  refetch,
}: {
  initialQuery?: string | string[];
  refetch?: () => Promise<void>;
}) => {
  const pathName = usePathname();
  const [query, setQuery] = useState<string>(Array.isArray(initialQuery) ? initialQuery.join(", ") : initialQuery || "");
  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search a video topic"
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(e: string) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );
          if (pathName.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};
export default SearchInput;
