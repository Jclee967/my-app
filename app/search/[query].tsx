import { View, Text, FlatList, Image } from 'react-native'
import {useEffect, useState} from 'react'

import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';

import { searchPosts, getVideoList } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';


import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'

const Search = () => {
  const {query} = useLocalSearchParams<{query:string}>();
  const {data: posts, refetch} = useAppwrite(()=>{ if(query) return searchPosts(query)});

  const [refreshing, setRefreshing] = useState(false)

  useEffect(()=>{
    refetch()
  },[query])



  return ( // adding border to the component is a good debugging way
  <SafeAreaView className='bg-primary h-full'>

    <FlatList
      data={posts}
      renderItem={({ item }) => <VideoCard video={item}/>}
      keyExtractor={item => item.$id}
      ListHeaderComponent={() => (

        <View className='my-6 space-y-6 px-4'>
          <Text className='font-pmedium text-sm text-gray-100'>
            Search Results
          </Text>
          <Text className='text-2xl font-psemibold text-white'>
            {query}
          </Text>
          
          <View className='mt-6 mb-8'>
            <SearchInput initialQuery={query ?? ''}/>
          </View>
        </View>
      )}
      ListEmptyComponent={() => (  // what to show when list is empty
        <EmptyState
          title='No Videos Found'
          subtitle='No videos found for this search' 
          />
      )}
    />
  </SafeAreaView>
)
}

export default Search