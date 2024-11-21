import { Collection, Db } from "mongodb";
import CustomDb from "./custom_db";

export default class CustomMongoDB extends CustomDb {
    constructor(private db: Db){
        super();
    }

    async insert(data: any): Promise<void> {
        await this.collection().insertMany(data);
    }

    async delete(): Promise<void> {
        await this.collection().deleteMany({});
    }

    async read() {
        await this.collection().find({}).toArray();
    }

    private  collection(): Collection<Document> {
        return this.db.collection('benchmarkDB');
    }
  
}