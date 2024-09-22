import { BaseModel } from "../infrastructure/base-model";
import { Horario } from "./horario.model";

/**
 * Interface que define os atributos para o modelo de Turma.
 */
export interface Turma extends BaseModel {
    nome: string;
    horarios?: Horario[];
}

/**
 * Classe que implementa a interface Turma e define os atributos
 * para representar uma turma.
 */
export class Turma implements Turma {
    id?: number;
    nome: string;
    horarios?: Horario[];

    /**
     * Construtor para inicializar o objeto Turma.
     * 
     * @param nome - O nome da turma.
     * @param horarios - Lista de horários associados à turma (opcional).
     * @param id - O identificador único da turma (opcional).
     */
    constructor(nome: string = '', horarios?: Horario[], id?: number) {
        this.nome = nome;
        this.horarios = horarios || [];
        this.id = id;
    }
}