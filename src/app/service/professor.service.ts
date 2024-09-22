import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '../infrastructure/base-service';
import { Professor } from '../model/professor.model';

/**
 * Serviço responsável por gerenciar as operações relacionadas ao modelo de Professor.
 * Extende o `BaseService` que fornece métodos CRUD básicos para manipulação de dados.
 * 
 * Este serviço utiliza a URL base `professor` para fazer requisições HTTP.
 */
@Injectable({
    providedIn: 'root'
})
export class ProfessorService extends BaseService<Professor> {
    /**
     * Construtor da classe `ProfessorService`.
     * 
     * @param http - Cliente HTTP usado para fazer requisições ao backend.
     */
    constructor(http: HttpClient) {
        super(http, 'professor');
    }
}
