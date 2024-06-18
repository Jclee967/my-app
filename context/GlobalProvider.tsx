import { createContext, useContext, useState, useEffect } from 'react';

import {Models} from 'react-native-appwrite/src';
import { getCurrentUser } from '../lib/appwrite';

interface GlobalProviderProps {
    children?: React.ReactNode
}

type GlobalContextType = {
    isLoggedIn: boolean,
    setIsLoggedIn: (value: boolean) => void,
    user: Models.Document | undefined,
    setUser: (value: Models.Document | undefined) => void,
    isLoading: boolean
}

const GlobalContext = createContext<GlobalContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: undefined,
    setUser: () => {},
    isLoading: false
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ( props: GlobalProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<Models.Document | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
        .then((res) => {
            if(res){
                setUser(res);
                setIsLoggedIn(true);
            }else{
                setIsLoggedIn(false);
                setUser(undefined);
            }
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false)); 
    }, [])

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading
        }}>
        { props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;