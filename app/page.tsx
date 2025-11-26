"use client";

import { useState, useEffect, useMemo } from "react";
import type { Verba } from "./types/verba";

// Função para remover acentos e normalizar strings
const normalizeString = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export default function Home() {
  const [verbas, setVerbas] = useState<Verba[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVerba, setSelectedVerba] = useState<Verba | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVerbas = async () => {
      try {
        const response = await fetch("/verbas.json");
        const data = await response.json();
        setVerbas(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar verbas:", error);
        setIsLoading(false);
      }
    };

    loadVerbas();
  }, []);

  const filteredVerbas = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = normalizeString(searchTerm.trim());

    return verbas.filter((verba) => {
      // Retorna apenas verbas com dtFim em branco
      if (verba.dtFim && verba.dtFim.trim() !== "") {
        return false;
      }

      // Normaliza o nome da verba e compara sem acentos
      const normalizedNome = normalizeString(verba.nome);
      const normalizedNatRubr = verba.natRubr.toLowerCase();

      return (
        normalizedNome.includes(term) ||
        normalizedNatRubr.includes(term)
      );
    });
  }, [verbas, searchTerm]);

  const handleVerbaClick = (verba: Verba) => {
    setSelectedVerba(verba);
  };

  const handleCloseDetails = () => {
    setSelectedVerba(null);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-base-content mb-4">
            Sistema de Busca de Rubricas eSocial
          </h1>
          <p className="text-lg text-base-content/80">
            Busque rubricas por nome ou código da natureza da rubrica (natRubr)
          </p>
        </div>

        {/* Search Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body p-8">
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-base font-bold text-base-content">
                  Buscar Rubrica
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o nome da rubrica ou código natRubr (ex: Salário ou 1000)..."
                  className="input input-bordered input-lg w-full pr-12 text-base-content placeholder:text-base-content/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-base-content/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
              <label className="label pt-2">
                <span className="label-text-alt text-base-content/80">
                  A busca será realizada simultaneamente por nome e código da natureza da rubrica (natRubr)
                </span>
              </label>
            </div>

          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Results */}
        {!isLoading && searchTerm.trim() && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title text-3xl text-base-content">
                  Resultados da Busca
                </h2>
                <div className="badge badge-info badge-lg gap-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {filteredVerbas.length} resultado(s) encontrado(s)
                </div>
              </div>
              {filteredVerbas.length === 0 ? (
                <div className="alert alert-warning shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="font-medium">Nenhuma rubrica encontrada com os critérios informados.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="text-base font-bold text-base-content">Nome</th>
                        <th className="text-base font-bold text-base-content text-center">Natureza da Rubrica (natRubr)</th>
                        <th className="text-base font-bold text-base-content text-center">Tipo de Rubrica (tpRubr)</th>
                        <th className="text-base font-bold text-base-content text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVerbas.map((verba, index) => (
                        <tr key={index} className="hover">
                          <td className="font-semibold text-base-content">{verba.nome}</td>
                          <td className="text-center">
                            <span className="badge badge-info badge-lg font-semibold text-white">
                              {verba.natRubr}
                            </span>
                          </td>
                          <td className="text-base text-base-content/90 text-center">{verba.tpRubr}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-info text-white font-semibold"
                              onClick={() => handleVerbaClick(verba)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !searchTerm.trim() && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 mx-auto text-base-content/40 mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-base-content/80 text-xl font-medium">
                Digite um termo de busca para começar
              </p>
              <p className="text-base-content/60 text-base mt-2">
                Você pode buscar pelo nome da rubrica ou pelo código da natureza da rubrica (natRubr)
              </p>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedVerba && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-3xl mb-6 text-base-content">Detalhes da Rubrica</h3>
              
              <div className="space-y-6">
                <div className="card bg-base-200 shadow">
                  <div className="card-body">
                    <h4 className="card-title text-xl text-base-content mb-2">Informações Básicas</h4>
                    <div className="divider my-3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-bold text-base-content mb-2">Nome:</p>
                        <p className="text-lg font-semibold text-base-content">{selectedVerba.nome}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-base-content mb-2 text-center">Natureza da Rubrica:</p>
                        <p className="text-base text-center">
                          <span className="badge badge-info badge-lg font-semibold text-white">
                            {selectedVerba.natRubr}
                          </span>
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-bold text-base-content mb-2">Tipo de Rubrica:</p>
                        <p className="text-base font-medium text-base-content">{selectedVerba.tpRubr}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200 shadow">
                  <div className="card-body">
                    <h4 className="card-title text-xl text-base-content mb-2">Códigos de Incidência</h4>
                    <div className="divider my-3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm font-bold text-base-content mb-2 text-center">Código Incidência INSS:</p>
                        <p className="text-base text-center">
                          <span className="badge badge-info badge-lg font-semibold text-white">
                            {selectedVerba.codIncCP}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-base-content mb-2 text-center">Código Incidência IRRF:</p>
                        <p className="text-base text-center">
                          <span className="badge badge-info badge-lg font-semibold text-white">
                            {selectedVerba.codIncIRRF}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-base-content mb-2 text-center">Código Incidência FGTS:</p>
                        <p className="text-base text-center">
                          <span className="badge badge-info badge-lg font-semibold text-white">
                            {selectedVerba.codIncFGTS}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-action mt-6">
                <button className="btn btn-secondary content text-base-content font-semibold text-white" onClick={handleCloseDetails}>
                  Fechar
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop" onClick={handleCloseDetails}>
              <button>fechar</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
