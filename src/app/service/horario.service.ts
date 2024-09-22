import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '../infrastructure/base-service';
import { Horario } from '../model/horario.model';

/**
 * Serviço responsável por gerenciar as operações relacionadas ao modelo de Horário.
 * Extende o `BaseService` que fornece métodos CRUD básicos para manipulação de dados.
 * 
 * Este serviço utiliza a URL base `horario` para fazer requisições HTTP.
 */
@Injectable({
    providedIn: 'root'
})
export class HorarioService extends BaseService<Horario> {
    /**
     * Construtor da classe `HorarioService`.
     * 
     * @param http - Cliente HTTP usado para fazer requisições ao backend.
     */
    constructor(http: HttpClient) {
        super(http, 'horario');
    }
}
