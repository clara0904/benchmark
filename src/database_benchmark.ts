import { ActionBenchmark, DeleteBechmark, InsertBechmark, ReadBechmark } from "./action_benchmark";
import CustomDb from "./custom_db";

export default class DatabaseBenchmark {
    public insert: ActionBenchmark<number>;
    public delete: ActionBenchmark<void>;
    public read: ActionBenchmark<void>;

    constructor(db: CustomDb){
        this.insert = new InsertBechmark(db);
        this.delete = new DeleteBechmark(db);
        this.read = new ReadBechmark(db);
   }
}