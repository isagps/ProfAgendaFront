import { BaseModel } from "../infrastructure/base-model";
import { Horario } from "./horario.model";
import { Materia } from "./materia.model";

/**
 * Interface que define os atributos para o modelo de Professor.
 */
export interface Professor extends BaseModel {
    nome: string;
    materias?: Materia[];
    horarios?: Horario[];
}

/**
 * Classe que implementa a interface Professor e define os atributos
 * para representar um professor.
 */
export class Professor implements Professor {
    id?: number;
    nome: string;
    materias?: Materia[];
    horarios?: Horario[];

    /**
     * Construtor para inicializar o objeto Professor.
     * 
     * @param nome - O nome do professor.
     * @param materias - Lista de matérias lecionadas pelo professor (opcional).
     * @param horarios - Lista de horários do professor (opcional).
     * @param id - O identificador único do professor (opcional).
     */
    constructor(
        nome: string = '',
        materias?: Materia[],
        horarios?: Horario[],
        id?: number
    ) {
        this.id = id;
        this.nome = nome;
        this.materias = materias || [];
        this.horarios = horarios || [];
    }
}