import { MongoClient } from "mongodb";

async function connectToMongoDB(): Promise<MongoClient> {
    const url = 'mongodb://root:mylittlepassword@mongodb:27017/admin';
    const client: MongoClient = new MongoClient(url);
  
    await client.connect();

    return client;
}