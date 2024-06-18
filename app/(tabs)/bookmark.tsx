import { View, Text, ScrollView, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import useAppwrite from '../../lib/useAppwrite'
import { getLikedVideos, getVideoList } from '../../lib/appwrite'
import React from 'react'
import SearchInput from '../../components/SearchInput'
import { useGlobalContext } from '../../context/GlobalProvider'

const Bookmark = () => {
  
  const {user} = useGlobalContext();
  const { data: posts } = useAppwrite(() => {if(user) return getLikedVideos(user.$id)});

  return (
    <SafeAreaView className='bg-primary h-full'>
        <Text className='mt-7 ml-5 text-white text-2xl font-psemibold' >Saved Videos</Text>

        <FlatList
          data={posts}
          renderItem={({ item }) => <VideoCard video={item} />}
          keyExtractor={item => item.$id}
          ListHeaderComponent={() => (
          <View className='my-6 space-y-6 px-4'>
            {/* <SearchInput /> */}
            </View>
          )}
          ListEmptyComponent={() => (  // what to show when list is empty
            <Text className='text-xl text-center font-psemibold text-white mt-2'>No Videos Found</Text>
          )}
        />
    </SafeAreaView>
  )
}

export default Bookmark