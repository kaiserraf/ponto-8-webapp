// =====================================================
//  auth-guard.js — Proteção de páginas internas
//
//  Importe este arquivo no topo do <script type="module">
//  de cada página protegida (home, clientes, veículos, peças).
//
//  Se não houver token salvo, redireciona imediatamente
//  para /auth.html sem carregar nada da página.
// =====================================================

const token = localStorage.getItem('token');

if (!token) {
  // O login agora é o index.html na raiz
  window.location.replace('/index.html');
}

export const getToken = () => localStorage.getItem('token');

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/index.html';
};