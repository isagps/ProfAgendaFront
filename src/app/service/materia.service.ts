import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '../infrastructure/base-service';
import { Materia } from '../model/materia.model';

/**
 * Serviço responsável por gerenciar as operações relacionadas ao modelo de Matéria.
 * Extende o `BaseService` que fornece métodos CRUD básicos para manipulação de dados.
 * 
 * Este serviço utiliza a URL base `materia` para fazer requisições HTTP.
 */
@Injectable({
    providedIn: 'root'
})
export class MateriaService extends BaseService<Materia> {
    /**
     * Construtor da classe `MateriaService`.
     * 
     * @param http - Cliente HTTP usado para fazer requisições ao backend.
     */
    constructor(http: HttpClient) {
        super(http, 'materia');
    }
}
