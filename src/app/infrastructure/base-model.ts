/**
 * Interface básica para modelos que contém um identificador opcional.
 * 
 * A interface `BaseModel` serve como a base para outros modelos,
 * fornecendo um campo `id` opcional que pode ser utilizado para 
 * identificar de forma única instâncias desses modelos.
 * 
 * @property {number} [id] - Identificador opcional do modelo.
 */
export interface BaseModel {
    id?: number;
}