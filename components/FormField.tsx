import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react'
import {icons} from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles }: FormFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className='text-gray-100 text-base font-pmedium'>{title}</Text>
            <View className='border-2 border-black-200 w-full h-16 px-4 rounded-2xl 
            bg-black-100 focus:border-secondary items-center flex-row'>
                <TextInput className='flex-1 text-white font-psemibold text-base'
                 value={value}
                 placeholder={placeholder}
                 placeholderTextColor='#7b7b8b'
                 onChangeText={handleChangeText}
                 secureTextEntry={title ==='Password' && !showPassword}
                />

                {/* create a touchableopacity that contains an image to toggle the password visibility */}
                {title === 'Password' && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image source={!showPassword? icons.eye : icons.eyeHide}
                        resizeMode='contain' className='w-6 h-6' />
                    </TouchableOpacity>
                )}

            </View>

        </View>
    )
}

type FormFieldProps = {
    title: string,
    value: string,
    placeholder?: string,
    handleChangeText: (text: string) => void,
    otherStyles?: string
}


export default FormField