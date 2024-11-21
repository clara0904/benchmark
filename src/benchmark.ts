import { Db, MongoClient } from "mongodb";
import CustomMongoDB from "./custom_mongodb";
import DatabaseBenchmark from "./database_benchmark";
import CargaTrabalho from "./carga_trabalho";
import TempoBenchmark from "./tempo_benchmark";
import FileGenerator from "./file_generator";

async function getMongoClient(): Promise<MongoClient> {
    const client: MongoClient = new MongoClient(`mongodb://root:mylittlepassword@mongodb:27017/admin`);

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

    for (let i = 10000; i <= 1000000; ) {
        quantidades.push(i);
        if (i < 100000) {
            i += 10000; 
        } else {
            i += 100000; 
        }
    }

    await database_benchmark.delete.action();

    for (let index in quantidades) {
        insertTrabalho.addTempo(new TempoBenchmark(await database_benchmark.insert.benchmark_in_milliseconds(quantidades[index]), quantidades[index]));
        removeTrabalho.addTempo(new TempoBenchmark(await database_benchmark.delete.benchmark_in_milliseconds(), quantidades[index]));
        readTrabalho.addTempo(new TempoBenchmark(await database_benchmark.read.benchmark_in_milliseconds(), quantidades[index]));
    }

    salvarListaString([...insertTrabalho.toString(), ...removeTrabalho.toString(), ...readTrabalho.toString()]);
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