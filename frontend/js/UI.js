// =====================================================
//  ui.js — Utilitários de interface compartilhados
//  Importado por todas as páginas que precisam de
//  toasts, modais e loaders.
// =====================================================

// ---------- Toast ----------

let toastContainer = null;

/** Garante que o container de toasts existe no DOM */
function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

/**
 * Exibe uma notificação temporária.
 * @param {string} message - Texto do toast
 * @param {'success'|'error'} type - Tipo visual
 * @param {number} duration - Duração em ms (padrão 3000)
 */
export function toast(message, type = 'success', duration = 3000) {
  ensureToastContainer();

  const el = document.createElement('div');
  el.className = `toast ${type}`;

  // Ícone de feedback visual
  const icon = type === 'success' ? '✓' : '✕';
  el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  toastContainer.appendChild(el);

  // Remove automaticamente após a duração
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// ---------- Modal ----------

/**
 * Abre um modal pelo id do overlay.
 * @param {string} overlayId - id do elemento .modal-overlay
 */
export function openModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) overlay.classList.add('open');
}

/**
 * Fecha um modal pelo id do overlay.
 * @param {string} overlayId - id do elemento .modal-overlay
 */
export function closeModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) overlay.classList.remove('open');
}

/**
 * Fecha o modal ao clicar fora da caixa (no overlay).
 * Chame isso no DOMContentLoaded para cada modal.
 * @param {string} overlayId
 */
export function bindModalOverlayClose(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    // Só fecha se o clique foi diretamente no overlay, não no .modal interno
    if (e.target === overlay) closeModal(overlayId);
  });
}

// ---------- Spinner ----------

/**
 * Exibe ou esconde um spinner de carregamento dentro de um container.
 * @param {HTMLElement} container - Elemento que receberá o spinner
 * @param {boolean} show - true para mostrar, false para remover
 */
export function setLoading(container, show) {
  if (show) {
    container.innerHTML = '<div class="spinner"></div>';
  }
  // Quando show = false a página popula o container com o conteúdo real
}

// ---------- Confirm Delete ----------

/**
 * Solicita confirmação antes de executar uma ação destrutiva.
 * @param {string} label - Nome do item a ser removido
 * @param {Function} onConfirm - Callback executado se confirmado
 */
export function confirmDelete(label, onConfirm) {
  // Janela nativa simples — pode ser substituída por modal customizado
  if (window.confirm(`Remover "${label}"? Esta ação não pode ser desfeita.`)) {
    onConfirm();
  }
}

// ---------- Form helpers ----------

/**
 * Coleta os valores de um formulário e retorna um objeto plano.
 * Campos com value vazio são omitidos (útil para PATCH parcial).
 * @param {HTMLFormElement} form
 * @param {boolean} omitEmpty - omite campos vazios se true
 */
export function serializeForm(form, omitEmpty = false) {
  const data = {};
  const fd = new FormData(form);
  for (const [key, value] of fd.entries()) {
    if (omitEmpty && value === '') continue;
    data[key] = value;
  }
  return data;
}

/**
 * Preenche os inputs de um formulário com um objeto.
 * @param {HTMLFormElement} form
 * @param {Object} data
 */
export function fillForm(form, data) {
  for (const [key, value] of Object.entries(data)) {
    const el = form.elements[key];
    if (el) el.value = value ?? '';
  }
}

/**
 * Limpa todos os inputs de um formulário.
 * @param {HTMLFormElement} form
 */
export function clearForm(form) {
  form.reset();
}