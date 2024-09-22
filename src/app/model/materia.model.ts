import { BaseModel } from "../infrastructure/base-model";
import { Horario } from "./horario.model";
import { Professor } from "./professor.model";

/**
 * Interface que define os atributos para o modelo de Matéria.
 */
export interface Materia extends BaseModel {
    nome: string;
    professores?: Professor[];
    horarios?: Horario[];
}

/**
 * Classe que implementa a interface Materia e define os atributos
 * para representar uma matéria.
 */
export class Materia implements Materia {
    id?: number;
    nome: string;
    professores?: Professor[];

    /**
     * Construtor para inicializar o objeto Materia.
     * 
     * @param nome - O nome da matéria.
     * @param professores - Lista de professores que lecionam essa matéria (opcional).
     * @param id - O identificador único da matéria (opcional).
     */
    constructor(
        nome: string = '',
        professores?: Professor[],
        id?: number
    ) {
        this.id = id;
        this.nome = nome;
        this.professores = professores || [];
    }
}