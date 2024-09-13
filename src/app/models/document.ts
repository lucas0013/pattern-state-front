export interface Documento {
  id: number;
  conteudo: string;
  state: string;
}

export interface DocumentoDetail extends Documento {
  actions: Actions;
}

export interface Actions {
  isEditButtonEnabled: boolean;
  isSaveButtonEnabled: boolean;
  isPublishButtonEnabled: boolean;
  isApproveButtonEnabled: boolean;
  isRejectButtonEnabled: boolean;
  isCancelButtonEnabled: boolean;
  isReSubmitButtonEnabled: boolean;
}