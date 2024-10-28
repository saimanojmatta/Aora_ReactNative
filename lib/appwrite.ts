// @ts-nocheck
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
interface User {
  accountId: string;
  email: string;
  username: string;
  avatar?: string;
  $id?:string;
}
export interface Creator {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: any[]; // Adjust type if you know the structure
  $updatedAt: string;
  Email: string;
  avatar: string;
  userId: string;
  username: string;
}

export interface Post {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: any[]; // Adjust type if you know the structure
  $updatedAt: string;
  creator: Creator; // Include the creator object
  prompt: string;
  thumbnail: string;
  type: string;
  video: string;
}
export interface FileAsset {
  uri: string;
  name: string;
  type: string;
  size: number;
}
interface FileToUpload {
  mimeType: string;
  [key: string]: any;
}
interface DocumentAsset {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
}
interface DocumentPickerResult {
  canceled: boolean;
  assets: DocumentAsset[] | null;
}
interface FormState {
  title: string;
  video: DocumentPickerResult | null;
  thumbnail: DocumentPickerResult | null;
  prompt: string;
}
interface VideoPostForm {
  title: string;
  thumbnail: FileAsset;
  video: FileAsset;
  prompt: string;
  userId: string;
}
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.msm.aora",
  projectId: "66f683bc001f0525dad7",
  databaseId: "66f697a60017b09914d6",
  usercollectionId: "66f697ed0028c7717f87",
  vidoecollectionId: "66f6982b0013291600f2",
  storageId: "66f69d8b002d114e8c2c",
};
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage=new Storage(client)
//sign-up
export const createUser = async (
  email: string,
  password: string,
  username: string
): Promise<User> => { // Ensure to specify that it returns a Promise<User>
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(username);
    await Signin(email, password);

    const newUserDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usercollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    // Transform Document to User type
    const newUser: User = {
      accountId: newUserDocument.accountId,
      email: newUserDocument.email,
      username: newUserDocument.username,
      avatar: newUserDocument.avatar,
      id:newUserDocument.$id // Optional
    };

    return newUser; // Return the transformed User object
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An error occurred while creating a new account");
    }
  }
};
// sign-in
export const Signin = async (email: string, password: string) => {
  try {
    const currentUser=await GetCurrentUser()
    if(currentUser){
      console.log("Session already active,Logging in directly")
      return currentUser
    }
    const session = await account.createEmailPasswordSession(email, password);
    console.log(session)
    return session;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("There is an Error occured while creating new account");
    }
  }
};
//Get Account
export const GetAccount = async () => {
  try {
    const createAccount = await account.get();
    return createAccount;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};

//Get Current Account
export const GetCurrentUser = async (): Promise<User | null> => {
  try {
    const currentAccount = await GetAccount();
    if (!currentAccount) throw new Error("No current account found");

    const currentUserResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usercollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    // console.log('currentUserResponse',currentUserResponse.documents[0].$id)

    if (currentUserResponse.documents.length === 0) {
      return null;
    }

    const currentUser = currentUserResponse.documents[0];
    console.log(currentUser)
    const user: User = {
      accountId: currentUser.accountId, //
      email: currentUser.email, //
      username: currentUser.username, //
      avatar: currentUser.avatar, //
      $id:currentUser.$id,
    };

    return user; // Return a properly structured
  } catch (err) {
    console.log("Refering to GetCurrentUser", err);
    return null; // Return null on error to match return type
  }
};

//Get all vidoes posts
export const GetAllPosts = async (): Promise<Post[]> => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vidoecollectionId
    );
    return posts.documents as Post[];
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("An unknown error occurred");
  }
};
//Get Latest Posts
export const GetLatestPosts = async (): Promise<Post[]> => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vidoecollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return posts.documents as Post[];
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("An unknown error occurred");
  }
};

//Get  videos post that matches search query
export const SearchPosts = async (query: string): Promise<Post[]> => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vidoecollectionId,
      [Query.search("type", query)]
    );
    return posts.documents as Post[];
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("An unknown error occurred");
  }
};

//Get vidoe Post created by user

export const GetUserPosts=async(userId:string):Promise<Post[]>=>{
  try{
    const posts=await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vidoecollectionId,
      [Query.equal('creator',userId)]
    )
    return posts.documents as Post[]
  }catch(err){
    throw new Error('something went wrong')
    // console.error(err instanceof Error ? err.message : 'Unknown error occurred');
    return []
  }
}
//Utilize this logout functionality if need
export const Signout = async () => {
  try {
    const session=await account.deleteSession("current"); // 'current' refers to the active session
    return session; // Indicate successful logout
  } catch (error) {
    console.error("Logout Error:", error);
    return false; // Indicate failed logout
  }
};
//upload file
export const Uploadfile = async (file: FileAsset, type: "video" | "image") => {
  if (!file) return;
  
  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      {
        type: file.type,
        ...file
      }
    );
    const fileUrl = await GetFilePreview(uploadFile.$id, type);
    return fileUrl;
  } catch (err) {
    if (err instanceof Error) {
      console.log("Getting FileUpload", err.message);
      throw new Error(err.message);
    }
  }
};

export const GetFilePreview = (fileId: string, type: "video" | "image") => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top" as const,
        100
      );
    } else {
      throw new Error("invalid file type");
    }
    if (!fileUrl) throw Error();
    return fileUrl;
  } catch (err) {
    if (err instanceof Error) {
      console.log("Getting file Preview", err.message);
      throw new Error(err.message);
    }
  }
};

export async function createVideoPost(form: VideoPostForm) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      Uploadfile(form.thumbnail, "image"),
      Uploadfile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.vidoecollectionId,
      ID.unique(),
      {
        type: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    if (error instanceof Error) {
      console.log('creatingVideoPost', error.message, error.stack);
      throw new Error(error.message);
    }
  }
}