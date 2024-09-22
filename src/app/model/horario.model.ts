import { BaseModel } from "../infrastructure/base-model";
import { Materia } from "./materia.model";
import { Professor } from "./professor.model";
import { Turma } from "./turma.model";

/**
 * Tipos permitidos para os dias da semana no modelo Horario.
 */
export type DayType = 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO' | 'DOMINGO';

/**
 * Interface que define os atributos para o modelo de Horário.
 */
export interface Horario extends BaseModel {
    dia_da_semana: DayType;
    hora: string;
    professor?: Professor;
    materia?: Materia;
    turma?: Turma;
}

/**
 * Classe que implementa a interface Horario e define os atributos
 * para representar o horário de uma determinada matéria ou aula.
 */
export class Horario implements Horario {
    id?: number;
    dia_da_semana: DayType;
    hora: string;
    professor?: Professor;
    materia?: Materia;
    turma?: Turma;

    /**
     * Construtor para inicializar o objeto Horario.
     * 
     * @param dia_da_semana - O dia da semana que o horário ocorre.
     * @param hora - A hora associada ao horário.
     * @param professor - O professor responsável.
     * @param materia - A matéria relacionada ao horário.
     * @param turma - A turma associada ao horário.
     * @param id - O identificador único do horário (opcional).
     */
    constructor(
        dia_da_semana: DayType = 'SEGUNDA',
        hora: string = '00:00',
        professor?: Professor,
        materia?: Materia,
        turma?: Turma,
        id?: number,
    ) {
        this.dia_da_semana = dia_da_semana;
        this.hora = hora;
        this.professor = professor;
        this.materia = materia;
        this.turma = turma;
        this.id = id;
    }
}