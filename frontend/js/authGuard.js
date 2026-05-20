// =====================================================
//  authGuard.js — Proteção de páginas internas
//
//  Importe este arquivo no topo do <script type="module">
//  de cada página protegida (home, clientes, veículos, peças, os, serviços).
//
//  Se não houver token salvo, redireciona imediatamente
//  para /html/index.html sem carregar nada da página.
// =====================================================

const token = localStorage.getItem('token');

if (!token) {
  // Redireciona para a tela de login
  window.location.replace('/html/index.html');
}

export const getToken = () => localStorage.getItem('token');

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    try {
      await fetch('http://localhost:3333/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    } catch {}
  }
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  window.location.href = '/index.html';
};