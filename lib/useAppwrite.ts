import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn : Function) =>{
    
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)


  const fetchData = async () => {
    
    setIsLoading(true);
    try {
      const videoList = await fn();
      setData(videoList);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() =>{
    fetchData();
  }, [])

  const refetch = () => fetchData();
  // console.log(data)
  return {
    data,
    refetch,
    isLoading
  }
}

export default useAppwrite;