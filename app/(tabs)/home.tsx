import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import { getVideoList, getLatestVideoList } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { Models } from 'react-native-appwrite/src';
import { useGlobalContext } from '../../context/GlobalProvider'


const Home = () => {
  const {data: posts, refetch} = useAppwrite(getVideoList);
  const {data: latestPosts} = useAppwrite(getLatestVideoList);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useGlobalContext();

  const onRefresh = async() => {
    setRefreshing(true);
    // if any new videos appeared
    await refetch();
    setRefreshing(false);
    
  };

  return ( // adding border to the component is a good debugging way
    <SafeAreaView className='bg-primary h-full'>

      <FlatList
        data={posts}
        renderItem={({ item }) => <VideoCard video={item}/>}
        keyExtractor={item => item.$id}
        ListHeaderComponent={() => (

          <View className='my-6 space-y-6 px-4'>
            <View className='flex justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome Back
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {user?.username}
                </Text>
              </View>

              <View className='mt-1.5'>
                <Image source={images.logoSmall}
                  className='w-9 h-10'
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />

            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-gray-100 text-lg mb-3'>
                Latest video
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (  // what to show when list is empty
          <EmptyState
            title='No Videos Found'
            subtitle='Be the first one to upload a video' 
            />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default Home