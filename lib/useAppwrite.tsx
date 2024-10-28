import { useEffect, useState } from "react"
import { Alert } from "react-native"

const useAppwrite = <T,>(fn: () => Promise<T[]>)  => {
  const[data,setData]=useState<T[]>([])
  const[isLoading,setLoading]=useState(true)
  const fetchData=async()=>{
    try{
      const res=await fn()
      setData(res)
    }catch(err){
      if(err instanceof Error){
        Alert.alert('Error',err.message)
      }
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchData()
  },[])
  const refetch=()=>fetchData()
  return {data,refetch,isLoading}
}
export default useAppwrite