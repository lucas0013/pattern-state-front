// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Documento } from './models/document';

async function getDocuments(role: 'supervisor' | 'funcionario') {
  const res = await fetch(`http://localhost:5093/api/documento?role=${role}`);
  if (!res.ok) {
    throw new Error('Falha ao buscar documentos');
  }
  return res.json();
}

export default function Home() {
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [role, setRole] = useState<'supervisor' | 'funcionario'>('funcionario');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const fetchedDocuments = await getDocuments(role);
        setDocuments(fetchedDocuments);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDocuments();
  }, [role]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Documentos</h1>
      
      <div className="mb-6">
        <label htmlFor="role" className="block text-lg font-medium mb-2">Selecione o papel:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'supervisor' | 'funcionario')}
          className="border border-gray-300 p-2 rounded-md w-full"
        >
          <option value="funcionario">Funcionário</option>
          <option value="supervisor">Supervisor</option>
        </select>
      </div>
      
      <ul className="space-y-4">
        {documents.map((document: Documento) => (
          <li key={document.id} className="bg-white p-4 rounded-md shadow-md">
            <Link href={`/documents/${document.id}/${role}`}>
              {document.conteudo}
            </Link>
            <p className="text-gray-600 mt-1">Estado: {document.state}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}