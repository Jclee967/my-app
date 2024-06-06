import { View, Text, Image } from 'react-native'
import React from 'react'

import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({title, subtitle}: EmptyStateProps) => {
    return (
        <View className='justify-center items-center px-4'>
            <Image className=' w-60 h-52' resizeMode='contain' source={images.empty} />
            <Text className='text-gray-100 font-pmedium text-sm'>{subtitle}</Text>
            <Text className='text-xl text-center font-psemibold text-white mt-2'>{title}</Text>

            <CustomButton 
                title='Create Video' 
                handlePress={()=>router.push('/create')}
                containerStyles='w-full my-5'
                />
        </View>
    )
}

type EmptyStateProps = {
    title: string,
    subtitle: string
}

export default EmptyState