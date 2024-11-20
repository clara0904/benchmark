﻿const { MongoClient } = require('mongodb');
const assert = require('assert');
const fs = require('fs');

// const url = 'mongodb://localhost:27017'; 
// const url = 'mongodb://root:@mylittlepassword:27017'
const url = 'mongodb://root:mylittlepassword@mongodb:27017/admin'

const dbName = 'benchmarkDB';
const collectionName = 'benchmarkCollection';

const filePath = 'benchmark_results.txt';

function saveResult(message) {
  console.log(message);
  fs.appendFileSync(filePath, message);
}

// Função para realizar a inserção de documentos
async function benchmarkInsert(client) {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  
  const start = Date.now();
  const docs = [];
  
  // Inserir 10000 documentos de exemplo
  for (let i = 0; i < 10000; i++) {
    docs.push({ index: i, name: `User${i}` });
  }
  
  await collection.insertMany(docs);
  const end = Date.now();
  const message = `Tempo para inserção de 10000 documentos: ${end - start}ms\n`;
  saveResult(message);
}

// Função para realizar a leitura de documentos
async function benchmarkRead(client) {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  
  const start = Date.now();
  await collection.find({}).toArray();
  const end = Date.now();
  const message = `Tempo para ler todos os documentos: ${end - start}ms\n`;
  saveResult(message);
}

// Função para realizar a exclusão de documentos
async function benchmarkDelete(client) {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  
  const start = Date.now();
  await collection.deleteMany({});
  const end = Date.now();
  const message = `Tempo para excluir todos os documentos: ${end - start}ms\n\n`;
  saveResult(message);
}

// Função para conectar e executar os benchmarks
async function runBenchmark() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    // Rodando os benchmarks
    await benchmarkInsert(client);
    await benchmarkRead(client);
    await benchmarkDelete(client);

    
  } catch (err) {
    console.error('Erro ao realizar benchmark', err);
  } finally {
    await client.close();
    console.log('Conexão encerrada');
  }
}


runBenchmark();