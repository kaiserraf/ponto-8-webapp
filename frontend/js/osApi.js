// =====================================================
//  osApi.js — Endpoints específicos de OS que não
//  precisam de retry de refresh token:
//  insertOrderParts/Labor, deleteOrderParts/Labor,
//  generatePdf e getUsers.
//
//  ATENÇÃO: getOs, getOsById, createOs, updateOs,
//  deleteOs e getLabors foram movidos para api.js
//  para terem o retry automático de refresh token.
// =====================================================

const BASE_URL = 'http://localhost:3333';

async function request(method, path, body = null) {
  const token = localStorage.getItem('token');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${path}`, opts);

    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/index.html';
      return { data: null, ok: false, status: 401 };
    }

    let data = null;
    const text = await res.text();
    if (text) {
      try { data = JSON.parse(text); } catch (_) { data = text; }
    }

    return { data, ok: res.ok, status: res.status };
  } catch (err) {
    console.error('[osApi] Erro de rede:', err);
    return { data: null, ok: false, status: 0 };
  }
}

// ── Peças da OS ───────────────────────────────────────────

/** Adiciona peça na OS. POST /os/:id/parts */
export const insertOrderParts = (idSo, body) =>
  request('POST',   `/os/${idSo}/parts`, body);

/** Remove peça da OS. DELETE /os/:id/parts/:partId */
export const deleteOrderParts = (idSo, idPart) =>
  request('DELETE', `/os/${idSo}/parts/${idPart}`);

// ── Serviços da OS ────────────────────────────────────────

/** Adiciona serviço na OS. POST /os/:id/labor */
export const insertOrderLabor = (idSo, body) =>
  request('POST',   `/os/${idSo}/labor`, body);

/** Remove serviço da OS. DELETE /os/:id/labor/:laborId */
export const deleteOrderLabor = (idSo, idLabor) =>
  request('DELETE', `/os/${idSo}/labor/${idLabor}`);

// ── PDF ───────────────────────────────────────────────────

/** Gera o PDF da OS. POST /os/:id/pdf */
export const generatePdf = (idSo) =>
  request('POST', `/os/${idSo}/pdf`);

// ── Usuários (mecânicos) ──────────────────────────────────

/** Lista todos os usuários do sistema. GET /users */
export const getUsers = () => request('GET', '/users');