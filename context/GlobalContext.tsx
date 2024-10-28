import { GetCurrentUser } from "@/lib/appwrite";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
    accountId: string;
    email: string;
    username: string;
    avatar?: string;
    $id?:string
}

interface GlobalContextType {
    isLoggedIn: boolean;
    setIsloggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
}

// Create a default context value
const defaultContextValue: GlobalContextType = {
    isLoggedIn: false,
    setIsloggedIn: () => {},
    user: null,
    setUser: () => {},
    isLoading: true,
};

const GlobalContext = createContext<GlobalContextType>(defaultContextValue);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
};

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsloggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Set loading to true initially 
    console.log(GetCurrentUser())
    useEffect(() => {
        GetCurrentUser()
            .then((res) => {
                if (res) {
                    setIsloggedIn(true);
                    setUser(res);
                } else {
                    setIsloggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsloggedIn,
                user,
                setUser,
                isLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;