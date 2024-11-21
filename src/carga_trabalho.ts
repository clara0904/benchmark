import TempoBenchmark from "./tempo_benchmark";

export default class CargaTrabalho{
    constructor(private tipoTrabalho: string, private tempos: TempoBenchmark[] = []){

    }

    addTempo(tempo: TempoBenchmark){
        this.tempos.push(tempo);
    }

    toString(): string[]{
        const list: string[] = [];

        for(let tempo of this.tempos){
            list.push(`Tempo para ${this.tipoTrabalho} ${tempo.quantidade} documentos: ${tempo.time} milissegundos`);
        }

        return list;
    }
}