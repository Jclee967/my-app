import { Client, Account, Avatars, ID, Databases, Storage, Query, ImageGravity } from 'react-native-appwrite/src';
import { ImagePickerAsset } from 'expo-image-picker';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jess.aora",
    projectId: "663a996f001cf1f2767e",
    databaseId: "663ce568003581565b99",
    userCollectionId: "663ce5b1001088a8d63b",
    videoCollectionId: "663ce614000c1d6a99ac",
    storageId: "663d1c670001d2fd00e7"
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async ({ username, email, password }: CreateUserProps) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn({ email, password });

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                username,
                email,
                avatar: avatarUrl
            }
        );
        return newUser;
    } catch (error: any) {
        console.log(error);
        throw Error(error);
    }
}

type CreateUserProps = {
    username: string,
    email: string,
    password: string
}

export const signIn = async ({ email, password }: SignInProps) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return true;
    } catch (error) {
        console.log('Sign in error: ' + error);
        return false;
    }
}

type SignInProps = {
    email: string,
    password: string
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getVideoList = async () => {
    try {
        const videos = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        );

        return videos.documents;
    } catch (error) {
        console.log(error);
    }
}

export const getLatestVideoList = async () => {
    try {
        const videos = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        );

        return videos.documents;
    } catch (error) {
        console.log(error);
    }
}

export const searchPosts = async (query: string) => {
    try {
        const videos = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', query)]
        );

        return videos.documents;
    } catch (error) {
        console.log(error);
    }
}

export const searchUserPosts = async (user: string) => {
    try {
        const videos = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('creator', user)]
        );

        return videos.documents;
    } catch (error) {
        console.log(error);
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error);
    }
}

export const getFilePreview = async (fileId: string, type: string) => {
    let fileUrl;
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(config.storageId, fileId)
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, ImageGravity.Top, 100)
        }else{
            throw Error('Invalid file type')
        }
        
        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);

        if (error instanceof Error)
            throw Error(error.message)
    }
}

export const uploadFile = async (type: string, file?: ImagePickerAsset) => {
    if (!file || !file.mimeType || !file.fileSize || !file.uri || !file.fileName) throw Error('File missing assets');


    const asset = {
        type: file.mimeType,
        name: file.fileName,
        size: file.fileSize,
        uri: file.uri
    }

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(), asset);

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        console.log(error);
        if (error instanceof Error)
            throw Error(error.message)
    }

}

export const uploadVideo = async (form: FormProps) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile('image', form.thumbnail ),
            uploadFile('video', form.video )
        ])

        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        );
    } catch (error) {
        console.log(error);
        if (error instanceof Error)
            throw Error(error.message)
    }
}

type FormProps = {
    userId: string,
    title: string,
    video?: ImagePickerAsset,
    thumbnail?: ImagePickerAsset,
    prompt: string
}