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
 * Lê o token JWT do localStorage e o inclui automaticamente
 * no header Authorization de todas as requisições.
 * Se o servidor retornar 401 (token ausente ou expirado),
 * limpa o token e redireciona para a página de login.
 *
 * Retorna { data, ok, status } para simplificar o tratamento nas páginas.
 */
async function request(method, path, body = null) {
  // Pega o token salvo após o login
  let token = localStorage.getItem('token');

  // Se não há token, tenta fazer refresh automaticamente
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
      // Inclui o Bearer token se ele existir
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  };

  // Inclui o corpo apenas quando necessário (POST / PATCH)
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${path}`, opts);

    // Token expirado — tenta renovar uma vez
    if (res.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        // Repete a requisição com o novo token
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
//  CLIENTES  /clients
// ============================================================

/** Lista todos os clientes */
export const getClients = () => request('GET', '/clients');

/** Busca cliente pelo id */
export const getClientById = (id) => request('GET', `/clients/${id}`);

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

/** Busca peça pelo id */
export const getPartById = (id) => request('GET', `/parts/${id}`);

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

// ============================================================
//  SERVIÇOS (MÃOS DE OBRA)  /labor
// ============================================================

/** Lista todos os serviços */
export const getLabors = () => request('GET', '/labor');

/** Busca serviço pelo id */
export const getLaborById = (id) => request('GET', `/labor/${id}`);

/** Cadastra novo serviço */
export const createLabor = (labor) => request('POST', '/labor/post', labor);

/**
 * Atualiza nome do serviço.
 * O backend espera { laborName: string } no body do PATCH.
 */
export const updateLabor = (id, fields) =>
  request('PATCH', `/labor/update/${id}`, fields);

/** Remove serviço pelo id */
export const deleteLabor = (id) => request('DELETE', `/labor/${id}`);

// ============================================================
//  ORDENS DE SERVIÇO  /os
// ============================================================

/** Lista todas as OS */
export const getOs = () => request('GET', '/os');

/** Busca OS pelo id */
export const getOsById = (id) => request('GET', `/os/${id}`);

/** Cria nova OS */
export const createOs = (os) => request('POST', '/os/post', os);

/** Atualiza dados da OS */
export const updateOs = (id, fields) =>
  request('PATCH', `/os/update/${id}`, fields);

/** Atualiza pdfPath da OS */
export const updateOsPdfPath = (id, pdfPath) =>
  request('PATCH', `/os/pdfPath/${id}`, { pdfPath });

/** Remove OS pelo id */
export const deleteOs = (id) => request('DELETE', `/os/${id}`);

// ============================================================
//  PEÇAS DA OS  /os/:id/parts
// ============================================================

/**
 * Busca as peças vinculadas a uma OS.
 * Não há rota GET específica no backend — usamos getOsById
 * e depois listamos order_parts via rota auxiliar.
 * Aqui chamamos o endpoint GET /os/:id que retorna a OS,
 * mas para as linhas de peças precisamos do endpoint de OS completa.
 *
 * NOTA: o backend não tem GET /os/:id/parts, então fazemos
 * uma chamada ao endpoint de criação que nos dá os dados na resposta.
 * Para listar, reutilizamos getOsById e construímos o estado no front.
 *
 * Solução prática: guardamos os dados de partes/labor retornados
 * na criação, ou buscamos via os endpoints existentes.
 *
 * Como o backend osData.ts tem findOpByIdSo mas não expõe uma rota GET,
 * fazemos getOsById e armazenamos parts/labors no estado local.
 * Para esta função, retornamos os dados da OS estendida.
 */

/**
 * Adiciona peça à OS.
 * POST /os/:id/parts  body: { idSo, idPart, amount, unitPrice }
 */
export const addPartToOs = (osId, body) =>
  request('POST', `/os/${osId}/parts`, body);

/**
 * Remove peça da OS.
 * DELETE /os/:id/parts/:partId
 */
export const removePartFromOs = (osId, partId) =>
  request('DELETE', `/os/${osId}/parts/${partId}`);

// ============================================================
//  SERVIÇOS DA OS  /os/:id/labor
// ============================================================

/**
 * Adiciona serviço à OS.
 * POST /os/:id/labor  body: { idSo, idLabor, value }
 */
export const addLaborToOs = (osId, body) =>
  request('POST', `/os/${osId}/labor`, body);

/**
 * Remove serviço da OS.
 * DELETE /os/:id/labor/:laborId
 */
export const removeLaborFromOs = (osId, laborId) =>
  request('DELETE', `/os/${osId}/labor/${laborId}`);

// ============================================================
//  AUXILIARES — busca partes/labor via endpoints de OS
// ============================================================

/**
 * Obtém as peças de uma OS.
 * Como o backend não expõe GET /os/:id/parts, fazemos workaround:
 * chamamos addPartToOs com body vazio não funciona — em vez disso,
 * exponha via GET /os/:id que retorna a OS, e para partes usamos
 * o endpoint de inserção que retorna dados.
 *
 * SOLUÇÃO REAL: como o backend tem findOpByIdSo no osData.ts
 * mas não tem rota GET pública, criamos rotas fictícias que
 * consultam via o endpoint GET /os/:id (que retorna a OS base)
 * e complementamos com as peças/serviços armazenados localmente
 * após insert/delete.
 *
 * Para simplificar, adicionamos dois endpoints GET que o backend
 * pode não ter, mas que documentamos aqui para quando forem criados.
 * Por enquanto, retornamos array vazio e o front gerencia estado local.
 */

/**
 * Busca peças vinculadas a uma OS.
 * Tenta GET /os/:id/parts — se o backend não suportar, retorna { data: [], ok: true }.
 */
export const getOsParts = async (osId) => {
  // Tentativa otimista — se o backend expor essa rota futuramente funciona
  try {
    const res = await request('GET', `/os/${osId}/parts`);
    if (res.ok) return res;
  } catch {}
  // Fallback: retorna array vazio (front controla após add/remove)
  return { data: [], ok: true, status: 200 };
};

/**
 * Busca serviços vinculados a uma OS.
 * Mesma estratégia de getOsParts.
 */
export const getOsLabors = async (osId) => {
  try {
    const res = await request('GET', `/os/${osId}/labor`);
    if (res.ok) return res;
  } catch {}
  return { data: [], ok: true, status: 200 };
};

// ============================================================
//  GERAÇÃO DE PDF  /os/:id/pdf  (quando implementado)
// ============================================================

/**
 * Solicita a geração do PDF de uma OS.
 * O backend tem generatePdf como stub em osController.ts.
 * Quando implementado, este endpoint POST /os/:id/pdf
 * chamará gerarOsPdf(id) do generatePdf.ts e atualizará o pdfPath.
 */
export const generateOsPdf = (osId) =>
  request('POST', `/os/${osId}/pdf`);