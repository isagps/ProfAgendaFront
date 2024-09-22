import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

/**
 * Componente de diálogo de confirmação.
 * 
 * Exibe um diálogo para confirmar ações do usuário. O diálogo apresenta um título e uma mensagem, e oferece
 * opções para o usuário confirmar ou cancelar a ação.
 * 
 * **Observação:**
 * Para utilizar este componente, use o serviço `ConfirmDialogService` para abrir o diálogo e gerenciar a interação com o usuário.
 */
@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
    ],
    preserveWhitespaces: false,
    selector: 'app-confirm-dialog',
    standalone: true,
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
    /**
     * Título do diálogo de confirmação.
     * 
     * Recebe o título a ser exibido no cabeçalho do diálogo.
     * 
     * @type {string}
     */
    public header: string;

    /**
     * Mensagem a ser exibida no corpo do diálogo.
     * 
     * Recebe a mensagem que descreve a ação que está sendo confirmada.
     * 
     * @type {string}
     */
    public message: string;

    /**
     * Construtor do componente `ConfirmDialogComponent`.
     * 
     * Inicializa o componente com os dados fornecidos e configura o título e a mensagem do diálogo.
     * 
     * @param data - Dados do diálogo fornecidos ao componente. Inclui `header` e `message`.
     * @param dialogRef - Referência ao diálogo para controlar o fechamento do mesmo.
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { header: string; message: string },
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    ) {
        this.header = data.header;
        this.message = data.message;
    }

    /**
     * Fecha o diálogo e retorna `false`.
     * 
     * Método chamado quando o usuário opta por não confirmar a ação.
     * 
     * @returns void
     */
    public onNoClick(): void {
        this.dialogRef.close(false);
    }

    /**
     * Fecha o diálogo e retorna `true`.
     * 
     * Método chamado quando o usuário confirma a ação.
     * 
     * @returns void
     */
    public onYesClick(): void {
        this.dialogRef.close(true);
    }
}