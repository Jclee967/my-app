import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({title, subtitle, containerStyles, titleStyles}: InfoBoxProps) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>{title}</Text>
      <Text className="text-gray-100 text-sm font-pregular text-center">{subtitle}</Text>
    </View>
  )
}

type InfoBoxProps = {
    title: string,
    subtitle?: string,
    containerStyles?: string,
    titleStyles?: string
}

export default InfoBox