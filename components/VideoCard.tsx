import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import { useState } from 'react'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av'
import { UpdateVideoLike } from '../lib/appwrite'

const VideoCard = ({ video, userId }: { video: VideoCardProps, userId?: string }) => {
    const [play, setPlay] = useState(false)
    const [liked, setLiked] = useState(userId ? video.likes.includes(userId) : false)
    
    return (
        <View className='flex-col items-center px-4 mb-14'>
            <View className='flex-row gap-3 items-start'>
                <View className='jusity-center items-center flex-row flex-1'>
                    <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
                        <Image source={{ uri: video.creator.avatar }} className='w-full h-full rounded-lg' resizeMode='cover' />
                    </View>

                    <View className='justify-center flex-1 ml-3 gap-y-1'>
                        <Text className='text-white text-sm font-semibold' numberOfLines={1}>{video.title}</Text>
                        <Text className='text-gray-100 text-xs font-pregular'>{video.creator.username}</Text>
                    </View>

                    <View className='pt-2 flex-row ml-5'>
                        {userId &&
                            <TouchableOpacity onPress={() => { UpdateVideoLike(video.$id, userId); setLiked(!liked) }}>
                                <Image source={liked ? icons.heartRed : icons.heartWhite} className='w-5 h-5 mr-4' resizeMode='contain' />
                            </TouchableOpacity>
                        }
                        <Image source={icons.menu} className='w-5 h-5' resizeMode='contain' />
                    </View>
                </View>
            </View>

            {play ? (
                <Video source={{ uri: video.video }}
                    className='w-full h-60 rounded-xl mt-3'
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded && status.didJustFinish) { // this type is discriminating unions, so we need to make sure that the status is loaded
                            setPlay(false);
                        }
                    }} />
            ) : (
                <TouchableOpacity className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}>
                    <Image source={{ uri: video.thumbnail }} className='w-full h-full rounded-xl mt-3' resizeMode='cover' />
                    <Image source={icons.play} className='absolute w-12 h-12' resizeMode='contain' />
                </TouchableOpacity>
            )}

        </View>
    )
}

type VideoCardProps = {
    $id: string,
    video: string;
    title: string;
    thumbnail: string;
    likes: string[];
    creator: {
        username: string;
        avatar: string;
    }
}


export default VideoCard