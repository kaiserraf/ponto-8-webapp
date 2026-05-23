// =====================================================
//  osApi.js — Camada de acesso ao backend para OS,
//  usuários, serviços e geração de PDF
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
    const res  = await fetch(`${BASE_URL}${path}`, opts);

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

// ── Ordens de Serviço ─────────────────────────────────────

/** Lista todas as OS */
export const getOs       = ()        => request('GET',    '/os');

/** Busca OS por ID */
export const getOsById   = (id)      => request('GET',    `/os/${id}`);

/** Cria nova OS */
export const createOs    = (body)    => request('POST',   '/os/post', body);

/** Atualiza OS (descrição, totalPrice, etc) */
export const updateOs    = (id, body)=> request('PATCH',  `/os/update/${id}`, body);

/** Remove OS */
export const deleteOs    = (id)      => request('DELETE', `/os/${id}`);

// ── Peças da OS ───────────────────────────────────────────

/** Adiciona peça na OS */
export const insertOrderParts = (idSo, body) =>
  request('POST',   `/os/${idSo}/parts`, body);

/** Remove peça da OS */
export const deleteOrderParts = (idSo, idPart) =>
  request('DELETE', `/os/${idSo}/parts/${idPart}`);

// ── Serviços da OS ────────────────────────────────────────

/** Adiciona serviço na OS */
export const insertOrderLabor = (idSo, body) =>
  request('POST',   `/os/${idSo}/labor`, body);

/** Remove serviço da OS */
export const deleteOrderLabor = (idSo, idLabor) =>
  request('DELETE', `/os/${idSo}/labor/${idLabor}`);

// ── PDF ───────────────────────────────────────────────────

/** Gera o PDF da OS — chama o endpoint que ainda precisa ser implementado */
export const generatePdf = (idSo) =>
  request('POST', `/os/${idSo}/pdf`);

// ── Usuários (mecânicos) ──────────────────────────────────

/**
 * Lista todos os usuários do sistema para popular o select de mecânicos.
 * IMPORTANTE: adicione esta rota no backend:
 *   router.get('/users', authToken, usersController.getUsers);
 */
export const getUsers = () => request('GET', '/users');

// ── Serviços (catálogo de mão de obra) ───────────────────

/** Lista serviços do catálogo */
export const getLabors = () => request('GET', '/labor');