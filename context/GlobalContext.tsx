import { GetCurrentUser } from "@/lib/appwrite";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
interface GlobalContextType {
    isLoggedIn: boolean;
    setIsloggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
}
interface User {
    accountId:string,
    email:string,
    username:string,
    avatar?:string,
}
const GlobalContext=createContext<GlobalContextType | undefined>(undefined)
export const useGlobalContext=()=>useContext(GlobalContext)

const GlobalProvider=({children}:{children:ReactNode})=>{
    const[isLoggedIn,setIsloggedIn]=useState<boolean>(false)
    const[user,setUser]=useState<User|null>(null)
    const[isLoading,setIsLoading]=useState<boolean>(false)
    useEffect(()=>{
        GetCurrentUser().then((res)=>{
            if(res){
                setIsloggedIn(true)
                setUser(res)
            }else{
                setIsloggedIn(false)
                setUser(null)
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    },[])
    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsloggedIn,
            user,
            setUser,
            isLoading
            
        }}>
            {children}
            
        </GlobalContext.Provider>
    )
    
}
export default GlobalProvider