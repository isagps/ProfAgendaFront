import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '../infrastructure/base-service';
import { Turma } from '../model/turma.model';

/**
 * Serviço responsável por gerenciar as operações relacionadas ao modelo de Turma.
 * Extende o `BaseService` que fornece métodos CRUD básicos para manipulação de dados.
 * 
 * Este serviço utiliza a URL base `turma` para fazer requisições HTTP.
 */
@Injectable({
    providedIn: 'root'
})
export class TurmaService extends BaseService<Turma> {
    /**
     * Construtor da classe `TurmaService`.
     * 
     * @param http - Cliente HTTP usado para fazer requisições ao backend.
     */
    constructor(http: HttpClient) {
        super(http, 'turma');
    }
}
