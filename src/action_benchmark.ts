import CustomDb from "./custom_db";

export abstract class ActionBenchmark<T>{
    constructor(protected db: CustomDb){
    }

    public abstract action(): Promise<void>;
    abstract preAction(data: T): Promise<void>;

    async benchmark_in_milliseconds(data: T): Promise<number>{
        this.preAction(data);

        const inicio = Date.now();

        await this.action();
    
        const fim = Date.now();

        return fim - inicio;
    }
}

export  class InsertBechmark extends ActionBenchmark<number>{
    private  docs: Array<{ index: number, name: string }> = [];

    async preAction(data: number): Promise<void> {
        for (let i = 0; i < data; i++) {
            this.docs.push({ index: i, name: `User${i}` });
        }
    }   

    async action(): Promise<void> {
        await this.db.insert(this.docs);
    }

}


export  class DeleteBechmark extends ActionBenchmark<void>{

    async preAction(data: void): Promise<void> {
    }   

    async action(): Promise<void> {
        await this.db.delete();
    }

}


export  class ReadBechmark extends ActionBenchmark<void>{

    async preAction(data: void): Promise<void> {
    }   

    async action(): Promise<void> {
        await this.db.read();
    }

}