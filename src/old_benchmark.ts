import { MongoClient, Db, Collection } from 'mongodb';
import fs from 'fs';

const url = 'mongodb://root:mylittlepassword@mongodb:27017/admin';
const dbName = 'benchmarkDB';
const collectionName = 'benchmarkCollection';

let results: string = '';

// Função para realizar a inserção de documentos
async function benchmarkInsert(client: MongoClient): Promise<void> {
  const db: Db = client.db(dbName);
  const collection: Collection = db.collection(collectionName);

  const start = Date.now();
  const docs: Array<{ index: number, name: string }> = [];

  // Inserir 10000 documentos de exemplo
  for (let i = 0; i < 10000; i++) {
    docs.push({ index: i, name: `User${i}` });
  }

  await collection.insertMany(docs);
  const end = Date.now();
  const message = `Tempo para inserção de 10000 documentos: ${end - start}ms\n`;
  console.log(message);
  results += message;
}

// Função para realizar a leitura de documentos
async function benchmarkRead(client: MongoClient): Promise<void> {
  const db: Db = client.db(dbName);
  const collection: Collection = db.collection(collectionName);

  const start = Date.now();
  await collection.find({}).toArray();
  const end = Date.now();
  const message = `Tempo para ler todos os documentos: ${end - start}ms\n`;
  console.log(message);
  results += message;
}

// Função para realizar a exclusão de documentos
async function benchmarkDelete(client: MongoClient): Promise<void> {
  const db: Db = client.db(dbName);
  const collection: Collection = db.collection(collectionName);

  const start = Date.now();
  await collection.deleteMany({});
  const end = Date.now();
  const message = `Tempo para excluir todos os documentos: ${end - start}ms\n`;
  console.log(message);
  results += message;
}

// Função para conectar e executar os benchmarks
async function runBenchmark(): Promise<void> {
  const client: MongoClient = new MongoClient(url);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    // Rodando os benchmarks
    await benchmarkInsert(client);
    await benchmarkRead(client);
    await benchmarkDelete(client);

    const filePath: string = 'benchmark_results.txt';
    fs.writeFileSync(filePath, results);

  } catch (err) {
    console.error('Erro ao realizar benchmark', err);
  } finally {
    await client.close();
    console.log('Conexão encerrada');
  }
}

runBenchmark();
