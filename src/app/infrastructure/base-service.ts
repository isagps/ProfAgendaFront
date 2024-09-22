import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseModel } from './base-model';
import { Page } from '../model/page.model';
import { apiUrl } from '../util/config.utils';

/**
 * Serviço base para operações CRUD genéricas em recursos da API.
 * 
 * Este serviço fornece métodos comuns para realizar operações de criação, leitura, atualização e
 * exclusão (CRUD) em qualquer modelo que estenda `BaseModel`. Ele abstrai a lógica de comunicação
 * com a API, permitindo reutilização e redução de código repetitivo em serviços específicos.
 * 
 * @template T Tipo que estende `BaseModel`. Define o modelo de dados com o qual o serviço irá operar.
 * 
 * ### Exemplo de Uso:
 * 
 * ```typescript
 * // user.model.ts
 * import { BaseModel } from './base-model';
 * 
 * export interface User extends BaseModel {
 *     id: number;
 *     name: string;
 *     email: string;
 *     // Outros campos específicos do usuário...
 * }
 * 
 * // user.service.ts
 * import { Injectable } from '@angular/core';
 * import { HttpClient } from '@angular/common/http';
 * import { BaseService } from './base.service';
 * import { User } from './user.model';
 * 
 * @Injectable({
 *     providedIn: 'root'
 * })
 * export class UserService extends BaseService<User> {
 *     constructor(http: HttpClient) {
 *         super(http, 'users'); // 'users' é o endpoint específico para o modelo User
 *     }
 *     
 *     // Métodos adicionais específicos para User, se necessário...
 * }
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class BaseService<T extends BaseModel> {
    /**
     * URL completa do endpoint da API para o modelo específico.
     * 
     * @private
     * @type {string}
     */
    public readonly apiEndpoint: string;
    public readonly endpoint: string;

    /**
     * Conjunto de cabeçalhos HTTP padrão para as requisições.
     * 
     * @private
     * @type {HttpHeaders}
     */
    private readonly httpHeaders: HttpHeaders;

    /**apiEndpoint
     * Cria uma instância do serviço base.
     * 
     * @param {HttpClient} http Instância do `HttpClient` para realizar requisições HTTP.
     * @param {string} endpoint Endpoint específico da API para o modelo. Por exemplo, 'users' para recursos de usuários.
     */
    constructor(
        private http: HttpClient,
        @Inject(String) endpoint: string
    ) {
        this.apiEndpoint = `${apiUrl}/${endpoint}`;
        this.endpoint = `${endpoint}`;
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }

    /**
     * Obtém uma lista paginada de itens do recurso.
     * 
     * Realiza uma requisição GET para o endpoint da API, retornando uma página de itens com base nos parâmetros fornecidos.
     * 
     * @param {number} [pageNumber=1] Número da página a ser obtida. **Default:** `1`.
     * @param {number} [pageSize=10] Quantidade de itens por página. **Default:** `10`.
     * @param {string} [filter=''] Termo de filtro para busca de itens. **Default:** `''` (sem filtro).
     * @returns {Observable<Page<T>>} Um `Observable` que emite uma instância de `Page<T>`, contendo os itens e metadados de paginação.
     * 
     * ### Exemplo de Uso:
     * 
     * ```typescript
     * this.userService.getAll(2, 20, 'admin').subscribe(page => {
     *     console.log(page.items); // Itens da página 2 com filtro 'admin'
     *     console.log(page.totalItems); // Total de itens disponíveis
     * });
     * ```
     */
    public getAll(pageNumber: number = 1, pageSize: number = 10, filter: string = ''): Observable<Page> {
        const params = new HttpParams()
            .set('page_number', pageNumber.toString())
            .set('page_size', pageSize.toString())
            .set('filter', filter);

        return this.http.get<Page>(this.apiEndpoint, { params }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Obtém todos os itens do recurso sem paginação.
     * 
     * Realiza uma requisição GET para o endpoint `/all`, retornando todos os itens disponíveis.
     * 
     * @returns {Observable<T[]>} Um `Observable` que emite um array de itens do tipo `T`.
     * 
     * ### Exemplo de Uso:
     * 
     * ```typescript
     * this.userService.getAllWithoutPagination().subscribe(users => {
     *     console.log(users); // Lista completa de usuários
     * });
     * ```
     */
    public getAllWithoutPagination(): Observable<T[]> {
        const url = `${this.apiEndpoint}/all`;
        return this.http.get<T[]>(url).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Obtém um único item pelo seu identificador único (ID).
     * 
     * Realiza uma requisição GET para o endpoint específico do item.
     * 
     * @param {number} id Identificador único do item a ser obtido.
     * @returns {Observable<T>} Um `Observable` que emite o item do tipo `T`.
     * 
     * ### Exemplo de Uso:
     * 
     * ```typescript
     * this.userService.getById(1).subscribe(user => {
     *     console.log(user); // Detalhes do usuário com ID 1
     * });
     * ```
     */
    public getById(id: number): Observable<T> {
        const url = `${this.apiEndpoint}/${id}`;
        return this.http.get<T>(url).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Cria um novo item no recurso.
     * 
     * Realiza uma requisição POST para o endpoint da API com os dados do novo item.
     * 
     * @param {T} data Dados do item a ser criado.
     * @returns {Observable<T>} Um `Observable` que emite o item criado.
     * 
     * ### Exemplo de Uso:
     * 
     * ```typescript
     * const newUser: User = { id: 0, name: 'João', email: 'joao@example.com' };
     * this.userService.create(newUser).subscribe(createdUser => {
     *     console.log(createdUser); // Usuário criado com ID gerado pelo backend
     * });
     * ```
     */
    public create(data: T): Observable<T> {
        return this.http.post<T>(`${this.apiEndpoint}/`, data, { headers: this.httpHeaders }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Atualiza um item existente no recurso.
     * 
     * Realiza uma requisição PUT para o endpoint específico do item com os dados atualizados.
     * 
     * @param {number} id Identificador único do item a ser atualizado.
     * @param {T} data Dados atualizados do item.
     * @returns {Observable<T>} Um `Observable` que emite o item atualizado.
     * 
     * ### Exemplo de Uso:
     * 
     * ```typescript
     * const updatedUser: User = { id: 1, name: 'João Silva', email: 'joao.silva@example.com' };
     * this.userService.update(1, updatedUser).subscribe(user => {
     *     console.log(user); // Usuário atualizado
     * });
     * ```
     */
    public update(id: number, data: T): Observable<T> {
        const url = `${this.apiEndpoint}/${id}`;
        return this.http.put<T>(url, data, { headers: this.httpHeaders }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Remove um item do recurso pelo seu identificador único (ID).
     * 
     * Realiza uma requisição DELETE para o endpoint específico do item.
     * 
     * @param {number} id Identificador único do item a ser removido.
     * @returns {Observable<void>} Um `Observable` que completa sem emitir valor.
     * 
     * ### Exemplo de Uso:
     * 
     * ```typescript
     * this.userService.delete(1).subscribe(() => {
     *     console.log('Usuário removido com sucesso.');
     * });
     * ```
     */
    public delete(id: number): Observable<void> {
        const url = `${this.apiEndpoint}/${id}`;
        return this.http.delete<void>(url).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Conta o número total de itens no recurso.
     * 
     * Realiza uma requisição GET para o endpoint `/count`, retornando o total de itens disponíveis.
     * 
     * @returns {Observable<number>} Um `Observable` que emite o número total de itens.
     * 
     * ### Exemplo de Uso:
     * 
     * ```typescript
     * this.userService.countAll().subscribe(total => {
     *     console.log(`Total de usuários: ${total}`);
     * });
     * ```
     */
    public countAll(): Observable<number> {
        const url = `${this.apiEndpoint}/count`;
        return this.http.get<{ total_count: number }>(url).pipe(
            map(response => response.total_count),
            catchError(this.handleError)
        );
    }

    /**
     * Manipula erros ocorridos durante as requisições HTTP.
     * 
     * Assume que o backend fornece mensagens de erro apropriadas no campo `message` da resposta.
     * 
     * @private
     * @param {HttpErrorResponse} error Erro HTTP recebido da requisição.
     * @returns {Observable<never>} Um `Observable` que lança um erro com uma mensagem amigável.
     * 
     * ### Detalhes do Tratamento de Erros:
     * 
     * - **Erro com Mensagem do Backend**: Se o erro contém uma mensagem no campo `error.message`, essa mensagem é utilizada.
     * - **Erro de Conexão**: Se o status do erro é `0`, indica um problema de conexão ou rede, e uma mensagem apropriada é retornada.
     * - **Erro Desconhecido**: Para quaisquer outros casos, uma mensagem genérica é retornada.
     * 
     * Além disso, os detalhes completos do erro são registrados no console para fins de depuração.
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Ocorreu um erro desconhecido.';

        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 0) {
            errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.';
        }

        console.error('Detalhes do erro:', error);
        return throwError(() => new Error(errorMessage));
    }
}