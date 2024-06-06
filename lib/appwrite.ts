import { Client, Account, Avatars, ID, Databases, Query } from 'react-native-appwrite/src';


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
const databases = new Databases(client)

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

    } catch (error:any) {
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

        return session;
    } catch (error) {
        console.log(error);
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
            config.videoCollectionId
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