import { Db, MongoClient } from "mongodb";
import CustomMongoDB from "./custom_mongodb";
import DatabaseBenchmark from "./database_benchmark";
import CargaTrabalho from "./carga_trabalho";
import TempoBenchmark from "./tempo_benchmark";
import FileGenerator from "./file_generator";

async function getMongoClient(): Promise<MongoClient> {
    const client: MongoClient = new MongoClient(`mongodb://10.0.0.204:27017`);

    return client;
}

async function createMongoBenchmark(mongoDb: Db): Promise<DatabaseBenchmark>{
    
    const customMongoDb = new CustomMongoDB(mongoDb);
    const mongoBenchmark = new DatabaseBenchmark(customMongoDb);
    
    return mongoBenchmark;
}

async function salvarListaString(lista: string[]){
    const fileGenerator = new FileGenerator();
    fileGenerator.createFile(lista);
}

async function runBenchmark(database_benchmark: DatabaseBenchmark): Promise<void> {
    const insertTrabalho = new CargaTrabalho('inserir');
    const removeTrabalho = new CargaTrabalho('remover');
    const readTrabalho = new CargaTrabalho('ler');

    const quantidades: number[] = [];

    quantidades.push(1000000);

    await database_benchmark.delete.action();

    for (let index in quantidades) {
        console.log(quantidades[index]);
        dizerTime();
        insertTrabalho.addTempo(new TempoBenchmark(await database_benchmark.insert.benchmark_in_milliseconds(quantidades[index]), quantidades[index]));
        await sleepOneMinute();
        dizerTime();        
        readTrabalho.addTempo(new TempoBenchmark(await database_benchmark.read.benchmark_in_milliseconds(), quantidades[index]));
        await sleepOneMinute();
        dizerTime();
        removeTrabalho.addTempo(new TempoBenchmark(await database_benchmark.delete.benchmark_in_milliseconds(), quantidades[index]));
        await sleepOneMinute();
    }

    dizerTime();

    salvarListaString([...insertTrabalho.toString(), ...removeTrabalho.toString(), ...readTrabalho.toString()]);
}

function dizerTime() {
    console.log((new Date()).toISOString());
}

async function sleepOneMinute(){
    await sleep(60000);
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run(){
    const mongoClient = await getMongoClient();

    try{
        await mongoClient.connect();
        const mongoDb = (mongoClient).db('benchmarkDB');
        const mongoBenchmark = await createMongoBenchmark(mongoDb);
        await runBenchmark(mongoBenchmark);
    } catch (err) {
        console.error('Erro ao realizar benchmark', err);
    } finally {
        await mongoClient.close();
        console.log('Conexão encerrada');
    }
}

run();