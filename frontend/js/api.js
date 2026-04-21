// =====================================================
//  api.js — Camada de acesso ao backend
//  Todas as chamadas HTTP ficam aqui. As páginas HTML
//  importam este arquivo e usam as funções exportadas.
// =====================================================

// URL base do servidor Express (ajuste se necessário)
const BASE_URL = 'http://localhost:3333';

// ---------- Helper HTTP interno ----------

/**
 * Realiza uma requisição HTTP genérica.
 * Retorna { data, ok, status } para simplificar o tratamento nas páginas.
 */
async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  // Inclui o corpo apenas quando necessário (POST / PATCH)
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${path}`, opts);

    // Tenta parsear JSON; se vier vazio (204) retorna null
    let data = null;
    const text = await res.text();
    if (text) data = JSON.parse(text);

    return { data, ok: res.ok, status: res.status };
  } catch (err) {
    // Erro de rede (servidor offline, CORS, etc.)
    console.error('[api] Erro de rede:', err);
    return { data: null, ok: false, status: 0 };
  }
}

// ============================================================
//  CLIENTES  /clients
// ============================================================

/** Lista todos os clientes */
export const getClients = () => request('GET', '/clients');

/** Busca cliente pelo nome exato */
export const getClientByName = (name) =>
  request('GET', `/clients/${encodeURIComponent(name)}`);

/** Cadastra novo cliente */
export const createClient = (client) =>
  request('POST', '/clients/post', client);

/** Atualiza campos do cliente (PATCH parcial) */
export const updateClient = (id, fields) =>
  request('PATCH', `/clients/update/${id}`, fields);

/** Remove cliente pelo id */
export const deleteClient = (id) => request('DELETE', `/clients/${id}`);

// ============================================================
//  PEÇAS  /parts
// ============================================================

/** Lista todas as peças */
export const getParts = () => request('GET', '/parts');

/** Busca peça pelo nome */
export const getPartByName = (name) =>
  request('GET', `/parts/${encodeURIComponent(name)}`);

/** Cadastra nova peça */
export const createPart = (part) => request('POST', '/parts/post', part);

/** Atualiza campos da peça */
export const updatePart = (id, fields) =>
  request('PATCH', `/parts/update/${id}`, fields);

/** Remove peça pelo id */
export const deletePart = (id) => request('DELETE', `/parts/${id}`);

// ============================================================
//  VEÍCULOS  /vehicle
// ============================================================

/** Lista todos os veículos */
export const getVehicles = () => request('GET', '/vehicle');

/** Busca veículo pelo id */
export const getVehicleById = (id) => request('GET', `/vehicle/${id}`);

/** Cadastra novo veículo */
export const createVehicle = (vehicle) =>
  request('POST', '/vehicle/post', vehicle);

/** Atualiza campos do veículo */
export const updateVehicle = (id, fields) =>
  request('PATCH', `/vehicle/update/${id}`, fields);

/** Remove veículo pelo id */
export const deleteVehicle = (id) => request('DELETE', `/vehicle/${id}`);