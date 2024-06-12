import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import {useEffect, useState} from 'react'

import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';

import { searchUserPosts, getVideoList, signOut } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';


import { icons, images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider';
import InfoBox from '../../components/InfoBox';

const Profile = () => {
  const {user, setUser, setIsLoggedIn} = useGlobalContext();
  const {data: posts, refetch} = useAppwrite(() => {if(user) return searchUserPosts(user.$id)});

  const [refreshing, setRefreshing] = useState(false)

  useEffect(()=>{
    refetch()
  },[user])

  const logout = async () =>{
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace('/sign-in')
  }

  return ( // adding border to the component is a good debugging way
  <SafeAreaView className='bg-primary h-full'>

    <FlatList
      data={posts}
      renderItem={({ item }) => <VideoCard video={item}/>}
      keyExtractor={item => item.$id}
      ListHeaderComponent={() => (

        <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
          <TouchableOpacity className='w-full items-end mb-10' onPress={logout}>
            <Image source={icons.logout} className='w-6 h-6' resizeMode='contain'/>
          </TouchableOpacity>

          {/* display user avatar */}
          <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
            <Image source={{uri: user?.avatar}} className='w-[90%] h-[90%] rounded-lg' resizeMode='cover'/>
          </View>

          <InfoBox title={user?.username} containerStyles='mt-5' titleStyles='text-lg'/>
          <View className='mt-5 flex-row'>
            <InfoBox title={String(posts?.length || 0)} subtitle='Posts' containerStyles='mr-10' titleStyles='text-xl'/>
            <InfoBox title='1.2K' subtitle='Followers' titleStyles='text-xl'/>
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

export default Profile