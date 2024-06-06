import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants'

import { Video, ResizeMode } from 'expo-av'

// zoom in scale
const zoomIn = {
  0: { opacity: 1, scale: 0.9 },
  1: { opacity: 1, scale: 1.1 },
}

// zoom out scale
const zoomOut = {
  0: { opacity: 1, scale: 1 },
  1: { opacity: 1, scale: 0.9 },
}


const TrendingItem = ({activeItem, item} : {activeItem : string, item : PostProps}) => {

  const [play, setPlay] = useState(false)
  // console.log(activeItem)

  return (
    <Animatable.View
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ?
        <Video source={{uri : item.video}}
        className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        onPlaybackStatusUpdate={(status)=>{ 
          if(status.isLoaded && status.didJustFinish){ // this type is discriminating unions, so we need to make sure that the status is loaded
            setPlay(false);
          }
        }} />
        :
        <TouchableOpacity
          className='relative justify-center items-center'
          activeOpacity={0.7}
          onPress={() => { setPlay(true) }}>
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
            resizeMode='cover' />
            <Image source={ icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'/>
        </TouchableOpacity>
      }
    </Animatable.View>
  )
}

const Trending = ( {posts} : {posts : PostProps[]}) => {
  const [activeItem, setActiveItem] = useState(posts.length>0 ? posts[0].$id : '')

  const viewableItemsChanged = ({viewableItems} : {viewableItems : any}) =>{
    if(viewableItems.length > 0){
        setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item}></TrendingItem>}
      keyExtractor={item => item.$id}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70
      }}
      horizontal
    />
    // <FlatList
    //   data={data}
    //   renderItem={({ item }) => <Text className='text-white text-xl'> {item.title}</Text>}
    //   keyExtractor={item => item.id}
    //   horizontal
    // />
    )
}

type PostProps = {
  $id: string;
  video: string;
  title: string;
  thumbnail: string;
  creator: {
    username: string;
    avatar: string;
  }
  
}

export default Trending