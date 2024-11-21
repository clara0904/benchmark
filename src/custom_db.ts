export default abstract class CustomDb{
    abstract insert(data: any): Promise<void>;
    abstract delete(): Promise<void>;
    abstract read(): Promise<void>;
}