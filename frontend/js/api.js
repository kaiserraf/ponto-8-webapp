// =====================================================
//  api.js — Camada de acesso ao backend
//  Todas as chamadas HTTP ficam aqui. As páginas HTML
//  importam este arquivo e usam as funções exportadas.
//
//  PADRONIZAÇÃO: este arquivo absorveu o antigo osApi.js.
//  Antes, metade dos endpoints de OS (insertOrderParts,
//  deleteOrderParts, insertOrderLabor, deleteOrderLabor,
//  generatePdf, getUsers) usava um request() duplicado
//  sem retry automático de refresh token. Agora tudo passa
//  pelo mesmo request(), com o mesmo comportamento.
// =====================================================

const BASE_URL = 'http://localhost:3333';

// ---------- Helper HTTP interno ----------

/**
 * Realiza uma requisição HTTP genérica.
 * Lê o token JWT do localStorage e o inclui automaticamente.
 * Se o servidor retornar 401, tenta refresh automático uma vez.
 * Retorna { data, ok, status }.
 */
async function request(method, path, body = null) {
  let token = localStorage.getItem('token');

  // Sem token — tenta refresh antes da primeira requisição
  if (!token) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      token = localStorage.getItem('token');
    }
  }

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  };

  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${path}`, opts);

    // Token expirado — tenta renovar uma vez e repete
    if (res.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        const newToken = localStorage.getItem('token');
        if (newToken) opts.headers['Authorization'] = `Bearer ${newToken}`;
        const retryRes = await fetch(`${BASE_URL}${path}`, opts);
        if (retryRes.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/index.html';
          return { data: null, ok: false, status: 401 };
        }
        let retryData = null;
        const retryText = await retryRes.text();
        if (retryText) retryData = JSON.parse(retryText);
        return { data: retryData, ok: retryRes.ok, status: retryRes.status };
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/index.html';
        return { data: null, ok: false, status: 401 };
      }
    }

    // Tenta parsear JSON; 204 retorna null
    let data = null;
    const text = await res.text();
    if (text) data = JSON.parse(text);

    return { data, ok: res.ok, status: res.status };
  } catch (err) {
    console.error('[api] Erro de rede:', err);
    return { data: null, ok: false, status: 0 };
  }
}

/** Tenta renovar o accessToken usando o refreshToken armazenado */
async function tryRefresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ============================================================
//  AUTENTICAÇÃO  /login /refresh /logout
// ============================================================

/**
 * Autentica o usuário. POST /login
 * Não usa o request() genérico de propósito: um 401 aqui significa
 * "credenciais inválidas", não "sessão expirada" — então não deve
 * disparar o fluxo de refresh/redirect automático que request() faz
 * para os demais endpoints autenticados.
 */
export async function login(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    let data = null;
    const text = await res.text();
    if (text) data = JSON.parse(text);
    return { data, ok: res.ok, status: res.status };
  } catch (err) {
    console.error('[api] Erro de rede no login:', err);
    return { data: null, ok: false, status: 0 };
  }
}

// ============================================================
//  CLIENTES  /clients
// ============================================================

export const getClients    = ()           => request('GET',    '/clients');
export const getClientById = (id)         => request('GET',    `/clients/${id}`);
export const createClient  = (client)     => request('POST',   '/clients/post', client);
export const updateClient  = (id, fields) => request('PATCH',  `/clients/update/${id}`, fields);
export const deleteClient  = (id)         => request('DELETE', `/clients/${id}`);

// ============================================================
//  PEÇAS  /parts
// ============================================================

export const getParts    = ()           => request('GET',    '/parts');
export const getPartById = (id)         => request('GET',    `/parts/${id}`);
export const createPart  = (part)       => request('POST',   '/parts/post', part);
export const updatePart  = (id, fields) => request('PATCH',  `/parts/update/${id}`, fields);
export const deletePart  = (id)         => request('DELETE', `/parts/${id}`);

// ============================================================
//  VEÍCULOS  /vehicle
// ============================================================

export const getVehicles    = ()            => request('GET',    '/vehicle');
export const getVehicleById = (id)          => request('GET',    `/vehicle/${id}`);
export const createVehicle  = (vehicle)     => request('POST',   '/vehicle/post', vehicle);
export const updateVehicle  = (id, fields)  => request('PATCH',  `/vehicle/update/${id}`, fields);
export const deleteVehicle  = (id)          => request('DELETE', `/vehicle/${id}`);

// ============================================================
//  SERVIÇOS (MÃO DE OBRA)  /labor
// ============================================================

export const getLabors    = ()           => request('GET',    '/labor');
export const getLaborById = (id)         => request('GET',    `/labor/${id}`);
export const createLabor  = (labor)      => request('POST',   '/labor/post', labor);
export const updateLabor  = (id, fields) => request('PATCH',  `/labor/update/${id}`, fields);
export const deleteLabor  = (id)         => request('DELETE', `/labor/${id}`);

// ============================================================
//  ORDENS DE SERVIÇO  /os
// ============================================================

export const getOs           = ()             => request('GET',    '/os');
export const getOsById       = (id)           => request('GET',    `/os/${id}`);
export const createOs        = (body)         => request('POST',   '/os/post', body);
export const updateOs        = (id, fields)   => request('PATCH',  `/os/update/${id}`, fields);
export const updateOsPdfPath = (id, pdfPath)  => request('PATCH',  `/os/pdfPath/${id}`, { pdfPath });
export const deleteOs        = (id)           => request('DELETE', `/os/${id}`);

// ---------- Peças da OS ----------

/** Adiciona peça na OS. POST /os/:id/parts */
export const insertOrderParts = (idSo, body) =>
  request('POST', `/os/${idSo}/parts`, body);

/** Remove peça da OS. DELETE /os/:id/parts/:partId */
export const deleteOrderParts = (idSo, idPart) =>
  request('DELETE', `/os/${idSo}/parts/${idPart}`);

// ---------- Serviços da OS ----------

/** Adiciona serviço na OS. POST /os/:id/labor */
export const insertOrderLabor = (idSo, body) =>
  request('POST', `/os/${idSo}/labor`, body);

/** Remove serviço da OS. DELETE /os/:id/labor/:laborId */
export const deleteOrderLabor = (idSo, idLabor) =>
  request('DELETE', `/os/${idSo}/labor/${idLabor}`);

// ---------- PDF ----------

/** Gera o PDF da OS. POST /os/:id/pdf */
export const generatePdf = (idSo) =>
  request('POST', `/os/${idSo}/pdf`);

// ============================================================
//  USUÁRIOS  /users
// ============================================================

/** Lista todos os usuários do sistema (mecânicos). GET /users */
export const getUsers = () => request('GET', '/users');
