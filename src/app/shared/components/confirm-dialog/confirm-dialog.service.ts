import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogType } from './model/confirm-dialog-type.model';

/**
 * Serviço responsável pela abertura e controle de diálogos de confirmação.
 * 
 * O `ConfirmDialogService` utiliza o `MatDialog` do Angular Material para abrir um diálogo de confirmação com base no tipo de ação especificado.
 * O serviço fornece uma interface para exibir diálogos de confirmação para ações como exclusão, edição e criação.
 * 
 * **Métodos Públicos:**
 * - `open(action: ConfirmDialogType): Observable<boolean>` - Abre um diálogo de confirmação com base no tipo de ação fornecido e retorna um `Observable` que emite `true` ou `false` dependendo da resposta do usuário.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
    /**
     * Mensagens e títulos associados a diferentes tipos de confirmação.
     * 
     * Este objeto é utilizado para fornecer os textos de cabeçalho e mensagem correspondentes para cada tipo de ação de confirmação.
     * 
     * @private
     * @readonly
     */
    private static readonly ACTION_TEXTS: Record<ConfirmDialogType, { header: string; message: string }> = {
        delete: { header: 'Confirmar Exclusão', message: 'Você realmente deseja excluir este item?' },
        edit: { header: 'Confirmar Edição', message: 'Você tem certeza de que deseja editar este item?' },
        create: { header: 'Confirmar Criação', message: 'Você tem certeza de que deseja criar este item?' },
    };

    /**
     * Construtor do serviço `ConfirmDialogService`.
     * 
     * Inicializa o serviço com o `MatDialog` do Angular Material, utilizado para abrir o diálogo de confirmação.
     * 
     * @param dialog - Instância do `MatDialog` usada para abrir diálogos de confirmação.
     */
    constructor(private dialog: MatDialog) { }

    /**
     * Abre um diálogo de confirmação com base no tipo de ação especificado.
     * 
     * O método utiliza o tipo de ação para determinar o texto do cabeçalho e da mensagem do diálogo, e então exibe o diálogo para o usuário.
     * Retorna um `Observable<boolean>` que emite `true` se o usuário confirmar a ação e `false` caso contrário.
     * 
     * @param action - Tipo de ação para o qual o diálogo de confirmação deve ser exibido. Deve ser um valor de `ConfirmDialogType`.
     * @returns `Observable<boolean>` - Um observable que emite `true` ou `false` com base na resposta do usuário.
     */
    public open(action: ConfirmDialogType): Observable<boolean> {
        const { header, message } = ConfirmDialogService.ACTION_TEXTS[action];
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { header, message },
        });

        return dialogRef.afterClosed();
    }
}
