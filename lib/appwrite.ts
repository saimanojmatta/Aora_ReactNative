import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";
interface User {
    accountId: string;
    email: string;
    username: string;
    avatar?: string; 
}
export const appwriteConfig={
    endpoint:'https://cloud.appwrite.io/v1',
    platform:'com.msm.aora',
    projectId:'66f683bc001f0525dad7',
    databaseId:'66f697a60017b09914d6',
    usercollectionId:'66f697ed0028c7717f87',
    vidoeCollectionId:'66f6982b0013291600f2',
    storageId:'66f69d8b002d114e8c2c'
}
const client = new Client();
client
     .setEndpoint(appwriteConfig.endpoint)
     .setProject(appwriteConfig.projectId)
     .setPlatform(appwriteConfig.platform)
const account=new Account(client)
const avatars=new Avatars(client)
const databases=new Databases(client)
//sign-up
export  const createUser=async(email:string,password:string,username:string)=>{
   try{
    const newAccount=await account.create(
        ID.unique(),
        email,
        password,
        username
    )
    if(!newAccount)throw new Error
    const avatarUrl=avatars.getInitials(username)
    await Signin(email,password)
    const newUser=await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usercollectionId,
        ID.unique(),
        {
            accountId:newAccount,
            email,
            username,
            avatar:avatarUrl
        }
    )
    return newUser
    
   }catch(err){
    if(err instanceof Error){
        throw new Error(err.message)
    }else{
        throw  new Error('There is an Error occured while creating new account')
    }
   }
}
// sign-in
export const Signin=async(email:string,password:string)=>{
    try{
        const session=await account.createEmailPasswordSession(email,password)
        return session
        
    }catch(err){
        if(err instanceof Error){
            throw new Error(err.message)
        }else{
            throw  new Error('There is an Error occured while creating new account')
        }
       }
}
//Get Account
export const GetAccount=async()=>{
    try{
        const createAccount=await account.get()
        return createAccount
    }catch(err){
        if(err instanceof Error){
            throw new Error(err.message)
        }
    }
}

//Get Current Account
export const GetCurrentUser = async (): Promise<User | null> => {
    try {
        const currentAccount = await GetAccount();
        if (!currentAccount) throw new Error("No current account found");

        const currentUserResponse = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usercollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (currentUserResponse.documents.length === 0) {
            return null; 
        }

        const currentUser = currentUserResponse.documents[0];
      
        const user: User = {
            accountId: currentUser.accountId, // 
            email: currentUser.email,          // 
            username: currentUser.username,    // 
            avatar: currentUser.avatar          // 
        };

        return user; // Return a properly structured 
    } catch (err) {
        console.log(err);
        return null; // Return null on error to match return type
    }
};