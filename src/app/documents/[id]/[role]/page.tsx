"use client";
import { DocumentoDetail } from '@/app/models/document';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

async function getDocumentById(id: string, role: string): Promise<DocumentoDetail | null> {
  const res = await fetch(`http://localhost:5093/api/documento/${id}?role=${role}`);
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data as DocumentoDetail;
}

async function performAction(id: string, action: string, role: string) {
  const res = await fetch(`http://localhost:5093/api/documento/${id}/${action}?role=${role}`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Erro ao realizar a ação.');
  }
  return res;
}

export default function DocumentDetail({ params }: { params: { id: string, role: string } }) {
  const [documents, setDocuments] = useState<DocumentoDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar o documento
  const fetchDocuments = async () => {
    try {
      const document = await getDocumentById(params.id, params.role);
      if (!document) {
        notFound();
      }
      setDocuments(document);
    } catch (error) {
      console.error(error);
      setError('Erro ao carregar o documento.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [params.id, params.role]);

  // Função para lidar com ações
  const handleAction = async (action: string) => {
    try {
      await performAction(params.id, action, params.role);
      await fetchDocuments(); // Atualiza o documento após a ação
    } catch (error) {
      console.error(error);
      setError('Erro ao realizar a ação.');
    }
  };

  if (error) return <p>{error}</p>;
  if (!documents) return <p>Carregando...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Documento</h1>
      <p className="mb-2"><strong>ID:</strong> {documents.id}</p>
      <p className="mb-4"><strong>Conteúdo:</strong> {documents.conteudo}</p>
      <p className="mb-4"><strong>Estado:</strong> {documents.state}</p>

      <div className="mt-6 flex space-x-4">
        {documents.actions.isSaveButtonEnabled && (
          <button onClick={() => handleAction('save')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Enviar para aprovação
          </button>
        )}
        {documents.actions.isPublishButtonEnabled && (
          <button onClick={() => handleAction('publish')} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Publicar
          </button>
        )}
        {documents.actions.isApproveButtonEnabled && (
          <button onClick={() => handleAction('approve')} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
            Aprovar
          </button>
        )}
        {documents.actions.isRejectButtonEnabled && (
          <button onClick={() => handleAction('reject')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Rejeitar
          </button>
        )}
        {documents.actions.isReSubmitButtonEnabled && (
          <button onClick={() => handleAction('resubmit')} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            Reenviar
          </button>
        )}
      </div>
    </div>
  );
}
