/* ═══════════════════════════════════════════════════════════════════════════
   REFERENCE BOARD (กระดานเรฟภาพอ้างอิง)
   Modular JS Engine with PSD / PNG / JPG / RefBoard Export & Import
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // State Management
  let isModalOpen = false;
  let isMaximized = false;
  let isFloatingMode = false;
  let isGridEnabled = false; // Grid snapping OFF by default
  let isWhiteBg = false; // White solid background toggle state
  let isActionsCollapsed = false; // Action buttons collapsed toggle state (default false = shown)
  let panX = 0;
  let panY = 0;
  let zoom = 1.0;
  let isPanning = false;
  let startPanX = 0;
  let startPanY = 0;
  let spacePressed = false;
  let selectedItemId = null;
  const selectedItemIds = new Set();
  let nextZIndex = 1;

  // DOM Elements
  let modalEl, headerEl, viewportEl, canvasEl, emptyHintEl, dropOverlayEl;
  let addFileInput, importFileInput;
  let exportModalEl, alertModalEl, arrangeModalEl;

  // Store Items Data: Map<id, { id, dataUrl, x, y, width, height, aspect, rotation, zIndex }>
  const itemsMap = new Map();

  // Initialize UI on DOM Ready
  document.addEventListener('DOMContentLoaded', initRefBoardUI);

  function initRefBoardUI() {
    if (document.getElementById('refboard-modal')) return;

    // Inject Main Modal & Dialogs HTML
    const modalHtml = `
      <div id="refboard-modal" class="refboard-modal">
        <!-- Header -->
        <div id="refboard-header" class="refboard-header">
          <div class="refboard-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>กระดานเรฟ (Ref Board)</span>
            <span class="refboard-title-badge" id="refboard-count-badge">0 รูป</span>
          </div>
          <div class="refboard-header-right">
            <div class="refboard-actions" id="refboard-actions-list">
              <button class="refboard-btn refboard-toggle-btn" id="refboard-toggle-actions-btn" title="ซ้อน/แสดงเมนูปุ่มกด">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                <span id="refboard-toggle-text">ซ้อนปุ่ม</span>
              </button>
              <button class="refboard-btn" id="refboard-bg-btn" title="สลับสีพื้นหลังกระดาน (มืด/ขาว)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 3v18"></path>
                </svg>
                <span id="refboard-bg-text">พื้นหลัง: ธีม</span>
              </button>
              <button class="refboard-btn" id="refboard-grid-btn" title="เปิด/ปิด ระบบแม่เหล็กกริด">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span id="refboard-grid-text">กริด: ปิด</span>
              </button>
              <button class="refboard-btn btn-accent" id="refboard-arrange-btn" title="จัดเรียงรูปภาพทั้งหมดในกระดานให้อัตโนมัติ (แถวละ 5 รูป)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span>จัดเรียง</span>
              </button>
              <button class="refboard-btn btn-accent" id="refboard-add-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>เพิ่มรูป</span>
              </button>
              <button class="refboard-btn" id="refboard-import-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>นำเข้า</span>
              </button>
              <button class="refboard-btn" id="refboard-export-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>ส่งออก</span>
              </button>
              <button class="refboard-btn btn-danger" id="refboard-clear-btn" title="ล้างกระดาน">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>ล้างกระดาน</span>
              </button>
            </div>

            <div class="refboard-window-btns">
              <button class="refboard-icon-btn" id="refboard-float-btn" title="เปลี่ยนเป็นหน้าต่างลอย / Split">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>
              </button>
              <button class="refboard-icon-btn" id="refboard-max-btn" title="ขยายเต็มจอ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
              <button class="refboard-icon-btn close-btn" id="refboard-close-btn" title="ปิดหน้าต่าง">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Viewport & Canvas -->
        <div id="refboard-viewport" class="refboard-viewport">
          <div id="refboard-canvas" class="refboard-canvas">
            <div id="refboard-group-box" class="refboard-group-box">
              <div class="ref-handle ref-handle-tl" data-ghandle="tl"></div>
              <div class="ref-handle ref-handle-tr" data-ghandle="tr"></div>
              <div class="ref-handle ref-handle-bl" data-ghandle="bl"></div>
              <div class="ref-handle ref-handle-br" data-ghandle="br"></div>
              <div class="ref-handle ref-handle-rot" data-ghandle="rot"></div>

              <div class="ref-item-toolbar ref-group-toolbar">
                <button class="ref-tb-btn" data-gact="front" title="นำกลุ่มขึ้นหน้าสุด">⬆ ขึ้นหน้า</button>
                <button class="ref-tb-btn" data-gact="back" title="ส่งกลุ่มไปหลังสุด">⬇ ลงหลัง</button>
                <button class="ref-tb-btn del-btn" data-gact="del" title="ลบรูปในกลุ่มทั้งหมด">🗑️ ลบ</button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div id="refboard-empty-hint" class="refboard-empty-hint">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <div>
              <strong>ลากรูปภาพ (.png, .jpg), ไฟล์ PSD (.psd) หรือไฟล์บอร์ด (.refboard) เข้ามาวางที่นี่</strong><br>
              หรือกด <span class="refboard-kbd">Ctrl</span> + <span class="refboard-kbd">V</span> เพื่อวางรูปภาพจาก Clipboard<br>
              <span style="font-size: 11px; opacity: 0.8;">ย่อ-ขยายรูปโดยคงอัตราส่วน | เลื่อนกระดานด้วย <span class="refboard-kbd">Space</span> + ลากเม้าส์</span>
            </div>
          </div>

          <!-- Drop Overlay -->
          <div id="refboard-drop-overlay" class="refboard-drop-overlay">
            <svg viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>วางไฟล์ลงบนกระดานเรฟ (รองรับ PNG, JPG, PSD, RefBoard)</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="refboard-footer">
          <div class="refboard-footer-info">
            <span id="refboard-zoom-text">ซูม: 100%</span>
            <span>|</span>
            <span>ลบรูปกด <span class="refboard-kbd">Del</span></span>
          </div>
          <div>
            <span>Reference Board System</span>
          </div>
        </div>

        <!-- Resize Handles (Floating mode - 4 Corners) -->
        <div class="ref-modal-handle ref-modal-handle-tl" data-mhandle="tl"></div>
        <div class="ref-modal-handle ref-modal-handle-tr" data-mhandle="tr"></div>
        <div class="ref-modal-handle ref-modal-handle-bl" data-mhandle="bl"></div>
        <div class="ref-modal-handle ref-modal-handle-br" data-mhandle="br"></div>
      </div>

      <!-- Export Selection Modal -->
      <div id="refboard-export-backdrop" class="refboard-exp-backdrop">
        <div class="refboard-exp-card">
          <div class="refboard-exp-header">
            <h3>ส่งออกไฟล์กระดานเรฟ (Export Board)</h3>
            <button class="refboard-icon-btn close-btn" id="refboard-exp-close">✕</button>
          </div>
          
          <div class="refboard-exp-group">
            <span class="refboard-exp-label">เลือกประเภทไฟล์ (File Format):</span>
            <div class="refboard-exp-grid">
              <div class="refboard-exp-opt active" data-fmt="png">
                <input type="radio" name="ref-fmt" value="png" checked>
                <span>PNG Image (.png)</span>
              </div>
              <div class="refboard-exp-opt" data-fmt="jpg">
                <input type="radio" name="ref-fmt" value="jpg">
                <span>JPG Image (.jpg)</span>
              </div>
              <div class="refboard-exp-opt" data-fmt="psd">
                <input type="radio" name="ref-fmt" value="psd">
                <span>Photoshop (.psd)</span>
              </div>
              <div class="refboard-exp-opt" data-fmt="refboard">
                <input type="radio" name="ref-fmt" value="refboard">
                <span>RefBoard (.refboard)</span>
              </div>
              <div class="refboard-exp-opt" data-fmt="pdf">
                <input type="radio" name="ref-fmt" value="pdf">
                <span>PDF Document (.pdf)</span>
              </div>
            </div>
          </div>

          <!-- PDF Layout Mode Option -->
          <div class="refboard-exp-group" id="ref-pdf-layout-group" style="display: none;">
            <span class="refboard-exp-label">รูปแบบหน้า PDF (PDF Layout):</span>
            <div class="refboard-exp-grid">
              <div class="refboard-exp-pdf-mode active" data-pdfmode="single">
                <input type="radio" name="ref-pdf-mode" value="single" checked>
                <span>หน้าเดียวผืนใหญ่ (Single Board Page)</span>
              </div>
              <div class="refboard-exp-pdf-mode" data-pdfmode="multi">
                <input type="radio" name="ref-pdf-mode" value="multi">
                <span>แยกหลายหน้า A4 (Multi-Page A4)</span>
              </div>
            </div>
          </div>

          <!-- Quality / Scale Settings -->
          <div id="refboard-exp-settings">
            <div class="refboard-exp-group" id="ref-scale-group">
              <span class="refboard-exp-label">ความละเอียดภาพ (Resolution Scale):</span>
              <div class="refboard-exp-slider-wrap">
                <input type="range" id="ref-scale-slider" min="50" max="300" step="25" value="100">
                <span class="refboard-exp-val" id="ref-scale-val">100%</span>
              </div>
            </div>

            <div class="refboard-exp-group" id="ref-quality-group">
              <span class="refboard-exp-label">คุณภาพภาพ (Quality):</span>
              <div class="refboard-exp-slider-wrap">
                <input type="range" id="ref-quality-slider" min="10" max="100" step="5" value="100">
                <span class="refboard-exp-val" id="ref-quality-val">100%</span>
              </div>
            </div>
          </div>

          <div class="refboard-exp-actions">
            <button class="refboard-exp-btn-cancel" id="refboard-exp-cancel">ยกเลิก</button>
            <button class="refboard-exp-btn-submit" id="refboard-exp-submit">ดาวน์โหลดไฟล์</button>
          </div>
        </div>
      </div>

      <!-- Alert & Confirm Dialog Modal -->
      <div id="refboard-alert-backdrop" class="refboard-exp-backdrop">
        <div class="cg-modal-box">
          <div class="cg-modal-icon" id="refboard-alert-icon">⚠️</div>
          <h3 class="cg-modal-title" id="refboard-alert-title">แจ้งเตือน</h3>
          <p class="cg-modal-text" id="refboard-alert-msg"></p>
          <div class="cg-modal-actions" id="refboard-alert-actions">
            <button class="cg-modal-btn cg-modal-btn-confirm" id="refboard-alert-ok-btn">ตกลง</button>
          </div>
        </div>
      </div>

      <!-- Arrange Customization Options Modal -->
      <div id="refboard-arrange-backdrop" class="refboard-exp-backdrop">
        <div class="cg-modal-box" style="max-width: 420px; text-align: left;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
            <h3 class="cg-modal-title" style="margin:0; font-size:18px; display:flex; align-items:center; gap:8px;">
              <span>📐</span> ตั้งค่าการจัดเรียง
            </h3>
            <button class="refboard-icon-btn close-btn" id="refboard-arrange-close-btn" style="width:28px;height:28px;">✕</button>
          </div>

          <!-- Options Form -->
          <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
            <!-- Number of Columns Option -->
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px; font-weight:600;">
                <span>จำนวนคอลัมน์ (Columns)</span>
                <span id="refboard-arrange-cols-val" style="color:var(--text, #f0f0f0); font-weight:700;">5 คอลัมน์</span>
              </div>
              <input type="range" id="refboard-arrange-cols-range" min="1" max="10" value="5" style="width:100%; accent-color:var(--text, #f0f0f0); cursor:pointer;">
            </div>

            <!-- Column Width Option -->
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px; font-weight:600;">
                <span>ความกว้างรูปภาพ (Width)</span>
                <span id="refboard-arrange-width-val" style="color:var(--text, #f0f0f0); font-weight:700;">1500 px</span>
              </div>
              <input type="range" id="refboard-arrange-width-range" min="500" max="5000" step="50" value="1500" style="width:100%; accent-color:var(--text, #f0f0f0); cursor:pointer;">
            </div>

            <!-- Image Gap Option -->
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px; font-weight:600;">
                <span>ระยะห่างระหว่างรูป (Gap)</span>
                <span id="refboard-arrange-gap-val" style="color:var(--text, #f0f0f0); font-weight:700;">10 px</span>
              </div>
              <input type="range" id="refboard-arrange-gap-range" min="0" max="50" step="2" value="10" style="width:100%; accent-color:var(--text, #f0f0f0); cursor:pointer;">
            </div>
          </div>

          <!-- Actions -->
          <div class="cg-modal-actions">
            <button class="cg-modal-btn cg-modal-btn-cancel" id="refboard-arrange-cancel-btn">ยกเลิก</button>
            <button class="cg-modal-btn cg-modal-btn-confirm" id="refboard-arrange-submit-btn" style="background:var(--text, #f0f0f0); color:var(--bg, #0d0d0d); font-weight:700;">ตกลงจัดเรียง</button>
          </div>
        </div>
      </div>

      <!-- Hidden File Inputs -->
      <input type="file" id="refboard-file-add" class="refboard-file-input" accept="image/*,.psd,.refboard,.json,.pdf" multiple>
      <input type="file" id="refboard-file-import" class="refboard-file-input" accept="image/*,.psd,.refboard,.json,.pdf" multiple>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Cache Elements
    modalEl = document.getElementById('refboard-modal');
    headerEl = document.getElementById('refboard-header');
    viewportEl = document.getElementById('refboard-viewport');
    canvasEl = document.getElementById('refboard-canvas');
    emptyHintEl = document.getElementById('refboard-empty-hint');
    dropOverlayEl = document.getElementById('refboard-drop-overlay');
    addFileInput = document.getElementById('refboard-file-add');
    importFileInput = document.getElementById('refboard-file-import');
    exportModalEl = document.getElementById('refboard-export-backdrop');
    alertModalEl = document.getElementById('refboard-alert-backdrop');
    arrangeModalEl = document.getElementById('refboard-arrange-backdrop');

    if (emptyHintEl) {
      emptyHintEl.style.cursor = 'pointer';
      emptyHintEl.addEventListener('click', (e) => {
        e.stopPropagation();
        addFileInput.click();
      });
    }

    const zoomTextEl = document.getElementById('refboard-zoom-text');
    if (zoomTextEl) {
      zoomTextEl.style.cursor = 'pointer';
      zoomTextEl.title = 'คลิกเพื่อปรับมุมมองให้พอดีหน้าจอ (Fit to Screen)';
      zoomTextEl.addEventListener('click', (e) => {
        e.stopPropagation();
        fitBoardToViewport();
      });
    }

    if (viewportEl && isGridEnabled) {
      viewportEl.classList.add('grid-active');
    }

    // Bind Event Listeners
    setupHeaderDrag();
    setupCanvasPanZoom();
    setupDragAndDrop();
    setupPasteHandler();
    setupKeyboardShortcuts();
    setupActionButtons();
    setupExportModal();
    setupArrangeModal();
    setupResize();
    setupGroupEvents();

    resetViewport();
  }

  // Helper Custom Alert Dialog
  function showRefAlert(title, message) {
    const titleEl = document.getElementById('refboard-alert-title');
    const msgEl = document.getElementById('refboard-alert-msg');
    const actionsEl = document.getElementById('refboard-alert-actions');

    titleEl.textContent = title;
    msgEl.textContent = message;

    actionsEl.innerHTML = `
      <button class="cg-modal-btn cg-modal-btn-confirm" id="refboard-alert-close-btn" style="background:#38bdf8;color:#000">ตกลง</button>
    `;

    alertModalEl.classList.add('open');
    document.getElementById('refboard-alert-close-btn').onclick = () => {
      alertModalEl.classList.remove('open');
    };
  }

  // Helper Custom Confirm Dialog
  function showRefConfirm(title, message, onConfirm) {
    const titleEl = document.getElementById('refboard-alert-title');
    const msgEl = document.getElementById('refboard-alert-msg');
    const actionsEl = document.getElementById('refboard-alert-actions');

    titleEl.textContent = title;
    msgEl.textContent = message;

    actionsEl.innerHTML = `
      <button class="cg-modal-btn cg-modal-btn-cancel" id="refboard-alert-cancel-btn">ยกเลิก</button>
      <button class="cg-modal-btn cg-modal-btn-confirm" id="refboard-alert-confirm-btn">ตกลง (ล้างรูปภาพ)</button>
    `;

    alertModalEl.classList.add('open');

    document.getElementById('refboard-alert-cancel-btn').onclick = () => {
      alertModalEl.classList.remove('open');
    };
    document.getElementById('refboard-alert-confirm-btn').onclick = () => {
      alertModalEl.classList.remove('open');
      if (onConfirm) onConfirm();
    };
  }

  // Helper: check if desktop split-panel mode is active
  function isDesktop() {
    return window.innerWidth > 1024;
  }

  // Toggle Window Visibility & Push History State
  window.toggleRefBoard = function () {
    if (!modalEl) initRefBoardUI();
    isModalOpen = !isModalOpen;
    if (isModalOpen) {
      modalEl.classList.add('open');
      history.pushState({ refBoardModalOpen: true }, '');
      if (isDesktop()) {
        const toolsPage = document.getElementById('page-tools');
        if (toolsPage) toolsPage.classList.add('refboard-split');
      }
      setTimeout(() => {
        fitBoardToViewport();
      }, 50);
      if (window._refboardUpdateHandle) window._refboardUpdateHandle();
    } else {
      closeRefBoardInternal();
    }
  };

  function closeRefBoardInternal(fromUserAction = false) {
    if (!isModalOpen) return;
    isModalOpen = false;
    if (modalEl) modalEl.classList.remove('open');
    if (exportModalEl) exportModalEl.classList.remove('open');
    if (alertModalEl) alertModalEl.classList.remove('open');
    if (arrangeModalEl) arrangeModalEl.classList.remove('open');
    // Remove split-panel class
    const toolsPage = document.getElementById('page-tools');
    if (toolsPage) toolsPage.classList.remove('refboard-split');
    deselectAll();
    if (window._refboardUpdateHandle) window._refboardUpdateHandle();

    if (fromUserAction && history.state && history.state.refBoardModalOpen) {
      history.back();
    }
  }

  // Handle Browser Back Button (popstate)
  window.addEventListener('popstate', () => {
    if (arrangeModalEl && arrangeModalEl.classList.contains('open')) {
      arrangeModalEl.classList.remove('open');
      return;
    }
    if (alertModalEl && alertModalEl.classList.contains('open')) {
      alertModalEl.classList.remove('open');
      return;
    }
    if (exportModalEl && exportModalEl.classList.contains('open')) {
      closeExportModal();
      return;
    }
    if (isModalOpen) {
      closeRefBoardInternal();
    }
  });

  // Fit Board Content to Viewport Screen (Auto Fit)
  function fitBoardToViewport() {
    if (!viewportEl) return;
    const vw = viewportEl.clientWidth || window.innerWidth;
    const vh = viewportEl.clientHeight || window.innerHeight;

    if (itemsMap.size === 0) {
      panX = vw / 2;
      panY = vh / 2;
      zoom = 1.0;
      updateTransform();
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    itemsMap.forEach((it) => {
      minX = Math.min(minX, it.x);
      minY = Math.min(minY, it.y);
      maxX = Math.max(maxX, it.x + it.width);
      maxY = Math.max(maxY, it.y + it.height);
    });

    const contentW = Math.max(maxX - minX, 100);
    const contentH = Math.max(maxY - minY, 100);
    const padding = 80;

    const scaleX = (vw - padding) / contentW;
    const scaleY = (vh - padding) / contentH;
    let fitZoom = Math.min(scaleX, scaleY);
    fitZoom = Math.min(Math.max(fitZoom, 0.02), 1.0); // Allow zoom out to 0.02 (2%)

    const contentCenterX = minX + contentW / 2;
    const contentCenterY = minY + contentH / 2;

    zoom = fitZoom;
    panX = vw / 2 - contentCenterX * zoom;
    panY = vh / 2 - contentCenterY * zoom;

    updateTransform();
  }

  // Reset Pan/Zoom
  function resetViewport() {
    if (itemsMap.size > 0) {
      fitBoardToViewport();
    } else {
      panX = (viewportEl ? viewportEl.clientWidth : window.innerWidth) / 2;
      panY = (viewportEl ? viewportEl.clientHeight : window.innerHeight) / 2;
      zoom = 1.0;
      updateTransform();
    }
  }

  function updateTransform() {
    canvasEl.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    canvasEl.style.setProperty('--ref-zoom', zoom);
    canvasEl.style.setProperty('--ref-inv-zoom', (1 / zoom).toFixed(4));
    const zoomText = document.getElementById('refboard-zoom-text');
    if (zoomText) zoomText.textContent = `ซูม: ${Math.round(zoom * 100)}%`;
  }

  // Header Window Dragging (Mouse & Touch)
  function setupHeaderDrag() {
    let isDraggingModal = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    function onStart(e) {
      if (!isModalOpen || e.target.closest('button') || isMaximized) return;
      if (isDesktop() && !isFloatingMode) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      isDraggingModal = true;
      startX = clientX;
      startY = clientY;
      const rect = modalEl.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      function onMove(me) {
        if (!isDraggingModal) return;
        const curX = me.touches ? me.touches[0].clientX : me.clientX;
        const curY = me.touches ? me.touches[0].clientY : me.clientY;
        const dx = curX - startX;
        const dy = curY - startY;

        modalEl.style.left = `${initialLeft + dx}px`;
        modalEl.style.top = `${initialTop + dy}px`;
      }

      function onEnd() {
        isDraggingModal = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      }

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    }

    headerEl.addEventListener('mousedown', onStart);
    headerEl.addEventListener('touchstart', onStart, { passive: false });
  }

  // Resize floating modal by dragging any of the 4 corner handles
  function setupResize() {
    const handles = modalEl.querySelectorAll('.ref-modal-handle');

    handles.forEach((handle) => {
      handle.addEventListener('mousedown', (e) => {
        if (!isFloatingMode && isDesktop()) return;
        e.preventDefault();
        e.stopPropagation();

        const type = handle.dataset.mhandle;
        const startX = e.clientX;
        const startY = e.clientY;
        const rect = modalEl.getBoundingClientRect();
        const startW = rect.width;
        const startH = rect.height;
        const startL = rect.left;
        const startT = rect.top;

        document.body.style.userSelect = 'none';

        function onMove(me) {
          const dx = me.clientX - startX;
          const dy = me.clientY - startY;

          let newW = startW, newH = startH, newL = startL, newT = startT;

          if (type.includes('r')) newW = Math.max(startW + dx, 320);
          if (type.includes('b')) newH = Math.max(startH + dy, 260);

          if (type.includes('l')) {
            const possibleW = startW - dx;
            if (possibleW > 320) {
              newW = possibleW;
              newL = startL + dx;
            }
          }

          if (type.includes('t')) {
            const possibleH = startH - dy;
            if (possibleH > 260) {
              newH = possibleH;
              newT = startT + dy;
            }
          }

          modalEl.style.width = `${newW}px`;
          modalEl.style.height = `${newH}px`;
          modalEl.style.left = `${newL}px`;
          modalEl.style.top = `${newT}px`;
        }

        function onUp() {
          document.body.style.userSelect = '';
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        }

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });
    });
  }

  // Canvas Pan & Zoom
  function setupCanvasPanZoom() {
    viewportEl.addEventListener('wheel', (e) => {
      if (!isModalOpen) return;
      e.preventDefault();

      const rect = viewportEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.02), 5.0);

      panX = mouseX - (mouseX - panX) * (newZoom / zoom);
      panY = mouseY - (mouseY - panY) * (newZoom / zoom);
      zoom = newZoom;

      updateTransform();
    }, { passive: false });

    viewportEl.addEventListener('mousedown', (e) => {
      if (!isModalOpen) return;
      const isBg = e.target === viewportEl || e.target === canvasEl || e.target === emptyHintEl;
      if (spacePressed || isBg || e.button === 1) {
        if (e.button === 0 || e.button === 1) {
          isPanning = true;
          startPanX = e.clientX - panX;
          startPanY = e.clientY - panY;
          viewportEl.classList.add('panning');
          if (selectedItemId && isBg) deselectAll();
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isModalOpen || !isPanning) return;
      panX = e.clientX - startPanX;
      panY = e.clientY - startPanY;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (isPanning) {
        isPanning = false;
        viewportEl.classList.remove('panning');
      }
    });

    // Touch Events for Mobile Panning (1 finger) and Pinch-to-Zoom (2 fingers)
    let initialTouchDist = 0;
    let initialTouchZoom = 1.0;
    let touchStartPanX = 0;
    let touchStartPanY = 0;
    let isTouchPanning = false;

    function getTouchDistance(e) {
      if (e.touches.length < 2) return 0;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.hypot(dx, dy);
    }

    function getTouchCenter(e) {
      if (e.touches.length < 2) {
        return {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
      return {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    }

    viewportEl.addEventListener('touchstart', (e) => {
      if (!isModalOpen) return;
      const isBg = e.target === viewportEl || e.target === canvasEl || e.target === emptyHintEl || e.target.closest('#refboard-empty-hint');

      if (e.touches.length === 2) {
        // 2-finger Pinch-Zoom Gesture
        e.preventDefault();
        initialTouchDist = getTouchDistance(e);
        initialTouchZoom = zoom;
        isTouchPanning = false;
        if (selectedItemId) deselectAll();
      } else if (e.touches.length === 1 && isBg) {
        // 1-finger Canvas Panning
        isTouchPanning = true;
        touchStartPanX = e.touches[0].clientX - panX;
        touchStartPanY = e.touches[0].clientY - panY;
        viewportEl.classList.add('panning');
        if (selectedItemId) deselectAll();
      }
    }, { passive: false });

    viewportEl.addEventListener('touchmove', (e) => {
      if (!isModalOpen) return;

      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDist = getTouchDistance(e);
        if (initialTouchDist === 0) {
          initialTouchDist = currentDist;
          initialTouchZoom = zoom;
        } else if (currentDist > 0) {
          const scaleRatio = currentDist / initialTouchDist;
          const newZoom = Math.min(Math.max(initialTouchZoom * scaleRatio, 0.02), 5.0);

          const rect = viewportEl.getBoundingClientRect();
          const center = getTouchCenter(e);
          const touchX = center.x - rect.left;
          const touchY = center.y - rect.top;

          panX = touchX - (touchX - panX) * (newZoom / zoom);
          panY = touchY - (touchY - panY) * (newZoom / zoom);
          zoom = newZoom;

          updateTransform();
        }
      } else if (e.touches.length === 1 && isTouchPanning) {
        e.preventDefault();
        panX = e.touches[0].clientX - touchStartPanX;
        panY = e.touches[0].clientY - touchStartPanY;
        updateTransform();
      }
    }, { passive: false });

    viewportEl.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        initialTouchDist = 0;
      }
      if (e.touches.length === 0) {
        isTouchPanning = false;
        viewportEl.classList.remove('panning');
      }
    });

    viewportEl.addEventListener('touchcancel', () => {
      initialTouchDist = 0;
      isTouchPanning = false;
      viewportEl.classList.remove('panning');
    });
  }

  // Drag & Drop File Handling
  function setupDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      modalEl.addEventListener(eventName, (e) => {
        if (!isModalOpen) return;
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    viewportEl.addEventListener('dragenter', () => {
      if (isModalOpen) dropOverlayEl.classList.add('active');
    });

    dropOverlayEl.addEventListener('dragleave', (e) => {
      if (e.target === dropOverlayEl) {
        dropOverlayEl.classList.remove('active');
      }
    });

    let lastDropTime = 0;

    function onDrop(e) {
      if (!isModalOpen) return;
      e.preventDefault();
      e.stopPropagation();

      dropOverlayEl.classList.remove('active');

      const now = Date.now();
      if (now - lastDropTime < 300) return;
      lastDropTime = now;

      const files = e.dataTransfer ? e.dataTransfer.files : null;
      if (files && files.length > 0) {
        const rect = viewportEl.getBoundingClientRect();
        const dropX = (e.clientX - rect.left - panX) / zoom;
        const dropY = (e.clientY - rect.top - panY) / zoom;
        handleFiles(files, dropX, dropY);
      }
    }

    viewportEl.addEventListener('drop', onDrop);
  }

  // Copy / Paste Handling
  function setupPasteHandler() {
    window.addEventListener('paste', (e) => {
      if (!isModalOpen) return;
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      const files = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) files.push(blob);
        }
      }
      if (files.length > 0) handleFiles(files);
    });
  }

  // Keyboard Shortcuts
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (!isModalOpen) return;

      if (e.code === 'Space' && !spacePressed && e.target.tagName !== 'INPUT') {
        spacePressed = true;
        viewportEl.classList.add('panning');
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && (selectedItemId || selectedItemIds.size > 0) && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        deleteItem(selectedItemId || Array.from(selectedItemIds)[0]);
      }

      if (e.key === 'Escape') {
        if (alertModalEl && alertModalEl.classList.contains('open')) {
          alertModalEl.classList.remove('open');
        } else if (exportModalEl && exportModalEl.classList.contains('open')) {
          closeExportModal();
        } else if (selectedItemId) {
          deselectAll();
        } else {
          toggleRefBoard();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!isModalOpen) return;
      if (e.code === 'Space') {
        spacePressed = false;
        if (!isPanning) viewportEl.classList.remove('panning');
      }
    });
  }

  // Action Buttons
  function setupActionButtons() {
    const closeBtn = document.getElementById('refboard-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeRefBoardInternal(true);
      });
    }

    document.getElementById('refboard-max-btn').addEventListener('click', () => {
      isMaximized = !isMaximized;
      modalEl.classList.toggle('maximized', isMaximized);
    });

    const floatBtn = document.getElementById('refboard-float-btn');
    if (floatBtn) {
      floatBtn.addEventListener('click', () => {
        isFloatingMode = !isFloatingMode;
        modalEl.classList.toggle('floating-mode', isFloatingMode);

        const toolsPage = document.getElementById('page-tools');
        if (toolsPage) {
          if (isFloatingMode) {
            toolsPage.classList.remove('refboard-split');
          } else if (isDesktop() && isModalOpen) {
            toolsPage.classList.add('refboard-split');
          }
        }

        if (isFloatingMode) {
          floatBtn.classList.add('active');
          floatBtn.title = 'สลับกลับเป็น Split-Panel';
          const defaultW = Math.min(760, Math.round(window.innerWidth * 0.8));
          const defaultH = Math.min(540, Math.round(window.innerHeight * 0.8));
          modalEl.style.left = `${Math.max(20, Math.round((window.innerWidth - defaultW) / 2))}px`;
          modalEl.style.top = '80px';
          modalEl.style.width = `${defaultW}px`;
          modalEl.style.height = `${defaultH}px`;
        } else {
          floatBtn.classList.remove('active');
          floatBtn.title = 'เปลี่ยนเป็นหน้าต่างลอย';
          modalEl.style.left = '';
          modalEl.style.top = '';
          modalEl.style.width = '';
          modalEl.style.height = '';
        }
      });
    }

    const toggleActionsBtn = document.getElementById('refboard-toggle-actions-btn');
    if (toggleActionsBtn) {
      toggleActionsBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        isActionsCollapsed = !isActionsCollapsed;
        updateActionsToggleUI();
      });
    }

    const bgBtn = document.getElementById('refboard-bg-btn');
    if (bgBtn) {
      bgBtn.addEventListener('click', () => {
        isWhiteBg = !isWhiteBg;
        bgBtn.classList.toggle('active', isWhiteBg);
        if (viewportEl) viewportEl.classList.toggle('bg-white-mode', isWhiteBg);
        const bgText = document.getElementById('refboard-bg-text');
        if (bgText) bgText.textContent = isWhiteBg ? 'พื้นหลัง: ขาว' : 'พื้นหลัง: ธีม';
      });
    }

    const gridBtn = document.getElementById('refboard-grid-btn');
    if (gridBtn) {
      gridBtn.addEventListener('click', () => {
        isGridEnabled = !isGridEnabled;
        gridBtn.classList.toggle('active', isGridEnabled);
        if (viewportEl) viewportEl.classList.toggle('grid-active', isGridEnabled);
        const gridText = document.getElementById('refboard-grid-text');
        if (gridText) gridText.textContent = isGridEnabled ? 'กริด: เปิด' : 'กริด: ปิด';
      });
    }

    const arrangeBtn = document.getElementById('refboard-arrange-btn');
    if (arrangeBtn) {
      arrangeBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (itemsMap.size === 0) {
          showRefAlert('กระดานเรฟว่างเปล่า', 'ยังไม่มีรูปภาพบนกระดานเรฟให้จัดเรียงครับ');
          return;
        }
        if (arrangeModalEl) {
          arrangeModalEl.style.display = '';
          arrangeModalEl.classList.add('open');
        }
      });
    }

    document.getElementById('refboard-add-btn').addEventListener('click', () => addFileInput.click());
    addFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFiles(e.target.files);
      e.target.value = '';
    });

    document.getElementById('refboard-import-btn').addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFiles(e.target.files);
      e.target.value = '';
    });

    document.getElementById('refboard-export-btn').addEventListener('click', () => {
      if (itemsMap.size === 0) {
        showRefAlert('กระดานเรฟว่างเปล่า', 'ยังไม่มีรูปภาพบนกระดานเรฟ ไม่สามารถส่งออกไฟล์ได้ กรุณาเพิ่มรูปภาพก่อนครับ');
        return;
      }
      openExportModal();
    });

    document.getElementById('refboard-clear-btn').addEventListener('click', () => {
      if (itemsMap.size === 0) {
        showRefAlert('กระดานเรฟว่างเปล่า', 'ไม่มีรูปภาพบนกระดานเรฟให้ล้างครับ');
        return;
      }
      showRefConfirm('ยืนยันการล้างกระดาน', `คุณต้องการล้างรูปภาพทั้งหมด (${itemsMap.size} รูป) บนกระดานเรฟใช่หรือไม่?`, () => {
        clearBoard();
      });
    });
  }

  // Toggle Action Buttons Collapse State
  function updateActionsToggleUI() {
    const actionsList = document.getElementById('refboard-actions-list');
    const toggleBtn = document.getElementById('refboard-toggle-actions-btn');
    if (!actionsList || !toggleBtn) return;

    const toggleIcon = toggleBtn.querySelector('svg');
    const toggleText = document.getElementById('refboard-toggle-text');

    if (isActionsCollapsed) {
      actionsList.classList.add('collapsed');
      toggleBtn.classList.add('active-collapsed');
      if (toggleIcon) {
        toggleIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
      }
      if (toggleText) {
        toggleText.textContent = 'แสดงปุ่ม';
      }
    } else {
      actionsList.classList.remove('collapsed');
      toggleBtn.classList.remove('active-collapsed');
      if (toggleIcon) {
        toggleIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
      }
      if (toggleText) {
        toggleText.textContent = 'ซ้อนปุ่ม';
      }
    }
  }

  // Main File Dispatcher
  function handleFiles(files, targetX = null, targetY = null) {
    const fileList = Array.from(files);
    const imageFiles = [];

    fileList.forEach((file) => {
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.refboard') || fileName.endsWith('.json')) {
        importRefBoardFile(file);
      } else if (fileName.endsWith('.psd')) {
        importPsdFile(file);
      } else if (fileName.endsWith('.pdf')) {
        importPdfFile(file);
      } else if (file.type.startsWith('image/')) {
        imageFiles.push(file);
      }
    });

    if (imageFiles.length > 0) {
      importMultipleImageFiles(imageFiles, targetX, targetY);
    }
  }

  // Import Regular Image Files (Freeform Drag & Drop with 24px Grid Snapping)
  function importMultipleImageFiles(files, targetX = null, targetY = null) {
    let loadedCount = 0;
    const total = files.length;
    const loadedImages = [];

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          let w = img.naturalWidth || 300;
          let h = img.naturalHeight || 300;
          const aspect = w / h;

          const maxDim = 1500;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              w = maxDim;
              h = maxDim / aspect;
            } else {
              h = maxDim;
              w = maxDim * aspect;
            }
          }

          loadedImages.push({ index, dataUrl, w, h, aspect });
          loadedCount++;

          if (loadedCount === total) {
            loadedImages.sort((a, b) => a.index - b.index);

            const startX = targetX !== null ? targetX : (-panX / zoom + viewportEl.clientWidth / 2 - 150);
            const startY = targetY !== null ? targetY : (-panY / zoom + viewportEl.clientHeight / 2 - 150);

            loadedImages.forEach((item, i) => {
              const offset = (i % 8) * 30;
              let itemX = startX + offset;
              let itemY = startY + offset;

              if (isGridEnabled) {
                itemX = Math.round(itemX / 24) * 24;
                itemY = Math.round(itemY / 24) * 24;
              }

              createRefImageItem({
                id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5) + '_' + i,
                dataUrl: item.dataUrl,
                x: itemX,
                y: itemY,
                width: item.w,
                height: item.h,
                aspect: item.aspect,
                rotation: 0,
                zIndex: ++nextZIndex
              });
            });
            setTimeout(fitBoardToViewport, 50);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  // Import Regular Image File
  function importImageFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        let w = img.naturalWidth || 300;
        let h = img.naturalHeight || 300;
        const aspect = w / h;

        const maxDim = 1500;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            w = maxDim;
            h = maxDim / aspect;
          } else {
            h = maxDim;
            w = maxDim * aspect;
          }
        }

        const offset = (itemsMap.size % 8) * 30;
        const x = -panX / zoom + 100 + offset;
        const y = -panY / zoom + 100 + offset;

        createRefImageItem({
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          dataUrl: dataUrl,
          x: x,
          y: y,
          width: w,
          height: h,
          aspect: aspect,
          rotation: 0,
          zIndex: ++nextZIndex
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  // Helper to extract Data URL from agPsd layer
  function getLayerDataUrl(layer) {
    if (layer.canvas) {
      return layer.canvas.toDataURL('image/png');
    }
    if (layer.imageData) {
      const c = document.createElement('canvas');
      c.width = layer.imageData.width;
      c.height = layer.imageData.height;
      const ctx = c.getContext('2d');
      ctx.putImageData(layer.imageData, 0, 0);
      return c.toDataURL('image/png');
    }
    return null;
  }

  // Import Photoshop PSD File (.psd)
  function importPsdFile(file) {
    if (typeof agPsd === 'undefined') {
      showRefAlert('กำลังโหลดสคริปต์', 'กำลังโหลดสคริปต์อ่าน PSD กรุณาลองใหม่อีกครั้งในสองสามวินาที');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const psd = agPsd.readPsd(buffer, { loadImageData: true, skipThumbnail: true });

        let loadedLayers = [];
        const psdWidth = psd.width || 800;
        const psdHeight = psd.height || 800;

        function traverseLayers(list) {
          if (!list || !Array.isArray(list)) return;
          list.forEach((layer) => {
            if (layer.children && layer.children.length > 0) {
              traverseLayers(layer.children);
            } else if (layer.canvas || layer.imageData) {
              const url = getLayerDataUrl(layer);
              if (url) {
                loadedLayers.push({
                  url: url,
                  left: layer.left || 0,
                  top: layer.top || 0,
                  w: layer.width || (layer.canvas ? layer.canvas.width : 300),
                  h: layer.height || (layer.canvas ? layer.canvas.height : 300)
                });
              }
            }
          });
        }

        if (psd.children && psd.children.length > 0) {
          traverseLayers(psd.children);
        }

        if (loadedLayers.length === 0) {
          const mainUrl = getLayerDataUrl(psd);
          if (mainUrl) {
            loadedLayers.push({
              url: mainUrl,
              left: 0,
              top: 0,
              w: psdWidth,
              h: psdHeight
            });
          }
        }

        if (loadedLayers.length === 0) {
          showRefAlert('ไม่พบรูปภาพ', 'ไม่พบรูปภาพหรือ Layer ที่เปิดอ่านได้ในไฟล์ PSD นี้');
          return;
        }

        const basePosX = -panX / zoom + 100;
        const basePosY = -panY / zoom + 100;

        let scaleFactor = 1.0;
        if (psdWidth > 1500 || psdHeight > 1500) {
          scaleFactor = Math.min(1500 / psdWidth, 1500 / psdHeight);
        }

        loadedLayers.forEach((l) => {
          addPsdLayerToBoard(
            l.url,
            l.w * scaleFactor,
            l.h * scaleFactor,
            basePosX + l.left * scaleFactor,
            basePosY + l.top * scaleFactor
          );
        });

      } catch (err) {
        showRefAlert('เกิดข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเปิดไฟล์ PSD: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function addPsdLayerToBoard(dataUrl, targetW, targetH, posX, posY) {
    const img = new Image();
    img.onload = () => {
      let w = targetW || img.naturalWidth || 300;
      let h = targetH || img.naturalHeight || 300;
      const aspect = w / h;

      createRefImageItem({
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        dataUrl: dataUrl,
        x: posX !== undefined ? posX : (-panX / zoom + 100),
        y: posY !== undefined ? posY : (-panY / zoom + 100),
        width: w,
        height: h,
        aspect: aspect,
        rotation: 0,
        zIndex: ++nextZIndex
      });
    };
    img.src = dataUrl;
  }

  // Import .refboard / JSON File
  function importRefBoardFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const boardData = JSON.parse(e.target.result);
        if (!boardData || !Array.isArray(boardData.items)) {
          showRefAlert('ไฟล์ไม่ถูกต้อง', 'รูปแบบไฟล์ .refboard ไม่ถูกต้อง');
          return;
        }

        clearBoard();

        if (boardData.panX !== undefined) panX = boardData.panX;
        if (boardData.panY !== undefined) panY = boardData.panY;
        if (boardData.zoom !== undefined) zoom = boardData.zoom;
        updateTransform();

        boardData.items.forEach((item) => {
          createRefImageItem(item);
          if (item.zIndex > nextZIndex) nextZIndex = item.zIndex;
        });

      } catch (err) {
        showRefAlert('เกิดข้อผิดพลาด', 'เกิดข้อผิดพลาดในการอ่านไฟล์นำเข้า: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // Clear Photoshop Smart Guide Lines
  function clearSmartGuides() {
    if (!canvasEl) return;
    const lines = canvasEl.querySelectorAll('.refboard-smart-line');
    lines.forEach((l) => l.remove());
  }

  // Photoshop-Style Smart Alignment Guides & Magnetic Grid Snapping
  function applyPhotoshopSmartGuides(draggedItem, rawX, rawY, width, height) {
    clearSmartGuides();
    if (!isGridEnabled) return { x: rawX, y: rawY };

    const snapThreshold = 10;
    let snappedX = rawX;
    let snappedY = rawY;

    const curL = rawX;
    const curR = rawX + width;
    const curCX = rawX + width / 2;

    const curT = rawY;
    const curB = rawY + height;
    const curCY = rawY + height / 2;

    let xSnapped = false;
    let ySnapped = false;

    itemsMap.forEach((other) => {
      if (other.id === draggedItem.id) return;

      const othL = other.x;
      const othR = other.x + other.width;
      const othCX = other.x + other.width / 2;

      const othT = other.y;
      const othB = other.y + other.height;
      const othCY = other.y + other.height / 2;

      // X-Axis Alignments (Left, Right, Center)
      if (!xSnapped) {
        if (Math.abs(curL - othL) < snapThreshold) {
          snappedX = othL; xSnapped = true; renderGuideLine('v', othL);
        } else if (Math.abs(curR - othR) < snapThreshold) {
          snappedX = othR - width; xSnapped = true; renderGuideLine('v', othR);
        } else if (Math.abs(curL - othR) < snapThreshold) {
          snappedX = othR; xSnapped = true; renderGuideLine('v', othR);
        } else if (Math.abs(curR - othL) < snapThreshold) {
          snappedX = othL - width; xSnapped = true; renderGuideLine('v', othL);
        } else if (Math.abs(curCX - othCX) < snapThreshold) {
          snappedX = othCX - width / 2; xSnapped = true; renderGuideLine('v', othCX);
        }
      }

      // Y-Axis Alignments (Top, Bottom, Center)
      if (!ySnapped) {
        if (Math.abs(curT - othT) < snapThreshold) {
          snappedY = othT; ySnapped = true; renderGuideLine('h', othT);
        } else if (Math.abs(curB - othB) < snapThreshold) {
          snappedY = othB - height; ySnapped = true; renderGuideLine('h', othB);
        } else if (Math.abs(curT - othB) < snapThreshold) {
          snappedY = othB; ySnapped = true; renderGuideLine('h', othB);
        } else if (Math.abs(curB - othT) < snapThreshold) {
          snappedY = othT - height; ySnapped = true; renderGuideLine('h', othT);
        } else if (Math.abs(curCY - othCY) < snapThreshold) {
          snappedY = othCY - height / 2; ySnapped = true; renderGuideLine('h', othCY);
        }
      }
    });

    // Document Grid Snapping (24px grid step)
    if (!xSnapped) {
      const gridStep = 24;
      const nearestX = Math.round(rawX / gridStep) * gridStep;
      if (Math.abs(rawX - nearestX) < snapThreshold) {
        snappedX = nearestX;
      }
    }
    if (!ySnapped) {
      const gridStep = 24;
      const nearestY = Math.round(rawY / gridStep) * gridStep;
      if (Math.abs(rawY - nearestY) < snapThreshold) {
        snappedY = nearestY;
      }
    }

    return { x: snappedX, y: snappedY };
  }

  function renderGuideLine(type, position) {
    const line = document.createElement('div');
    line.className = `refboard-smart-line line-${type}`;
    if (type === 'v') {
      line.style.left = `${position}px`;
    } else {
      line.style.top = `${position}px`;
    }
    canvasEl.appendChild(line);
  }

  // Rearrange items on the board in a Pinterest-style Masonry Grid (Customizable Cols, Width, Gap)
  function arrangeBoardMasonryGrid(customCols = 5, customWidth = 1500, customGap = 10) {
    if (itemsMap.size === 0) return;

    const isGroupArranging = selectedItemIds.size > 1;
    let items = [];

    let groupMinX = Infinity, groupMinY = Infinity;
    if (isGroupArranging) {
      selectedItemIds.forEach((id) => {
        const it = itemsMap.get(id);
        if (!it) return;
        items.push(it);

        const rotDeg = it.rotation || 0;
        const rotRad = (rotDeg * Math.PI) / 180;
        const cos = Math.abs(Math.cos(rotRad));
        const sin = Math.abs(Math.sin(rotRad));
        const boundingW = it.width * cos + it.height * sin;
        const boundingH = it.width * sin + it.height * cos;
        const centerShiftX = (it.width - boundingW) / 2;
        const centerShiftY = (it.height - boundingH) / 2;
        const visualLeft = it.x + centerShiftX;
        const visualTop = it.y + centerShiftY;
        groupMinX = Math.min(groupMinX, visualLeft);
        groupMinY = Math.min(groupMinY, visualTop);
      });
    } else {
      items = Array.from(itemsMap.values());
    }

    if (items.length === 0) return;

    items.sort((a, b) => a.zIndex - b.zIndex);

    const cols = Math.max(1, customCols);
    const colWidth = Math.max(50, customWidth);
    const gap = Math.max(0, customGap);

    const startX = isGroupArranging ? groupMinX : (-panX / zoom + 50);
    const startY = isGroupArranging ? groupMinY : (-panY / zoom + 50);

    const colHeights = new Array(cols).fill(0);

    let snappedStartX = startX;
    let snappedStartY = startY;
    if (isGridEnabled) {
      snappedStartX = Math.round(startX / 24) * 24;
      snappedStartY = Math.round(startY / 24) * 24;
    }

    items.forEach((item) => {
      let minCol = 0;
      let minH = colHeights[0];
      for (let c = 1; c < cols; c++) {
        if (colHeights[c] < minH) {
          minH = colHeights[c];
          minCol = c;
        }
      }

      const aspect0 = item.aspect || (item.width / item.height) || 1.0;
      const rotDeg = item.rotation || 0;
      const rotRad = (rotDeg * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rotRad));
      const sin = Math.abs(Math.sin(rotRad));

      const widthRatio = cos + (1 / aspect0) * sin;
      const targetW = Math.round(colWidth / (widthRatio || 1));
      const targetH = Math.round(targetW / aspect0);
      const boundingW = Math.round(targetW * cos + targetH * sin);
      const boundingH = Math.round(targetW * sin + targetH * cos);

      let newX = snappedStartX + minCol * (colWidth + gap);
      let newY = snappedStartY + colHeights[minCol];

      if (isGridEnabled) {
        newX = Math.round(newX / 24) * 24;
        newY = Math.round(newY / 24) * 24;
      }

      // CSS center transform offset correction
      const centerShiftX = (targetW - boundingW) / 2;
      const centerShiftY = (targetH - boundingH) / 2;

      const renderX = newX - centerShiftX;
      const renderY = newY - centerShiftY;

      item.x = renderX;
      item.y = renderY;
      item.width = targetW;
      item.height = targetH;

      const el = item.el || document.getElementById(item.id);
      if (el) {
        item.el = el;
        el.style.transform = `translate(${renderX}px, ${renderY}px) rotate(${rotDeg}deg)`;
        el.style.width = `${targetW}px`;
        el.style.height = `${targetH}px`;
        const img = el.querySelector('.ref-item-img');
        if (img) {
          img.style.width = `${targetW}px`;
          img.style.height = `${targetH}px`;
        }
      }

      colHeights[minCol] += boundingH + gap;
    });

    updateSelectionBox();
    setTimeout(fitBoardToViewport, 50);
  }

  // Setup Arrange Modal Options Binding
  function setupArrangeModal() {
    if (!arrangeModalEl) return;

    const colsRange = document.getElementById('refboard-arrange-cols-range');
    const colsVal = document.getElementById('refboard-arrange-cols-val');
    const widthRange = document.getElementById('refboard-arrange-width-range');
    const widthVal = document.getElementById('refboard-arrange-width-val');
    const gapRange = document.getElementById('refboard-arrange-gap-range');
    const gapVal = document.getElementById('refboard-arrange-gap-val');

    if (colsRange) {
      colsRange.addEventListener('input', () => {
        if (colsVal) colsVal.textContent = `${colsRange.value} คอลัมน์`;
      });
    }

    if (widthRange) {
      widthRange.addEventListener('input', () => {
        if (widthVal) widthVal.textContent = `${widthRange.value} px`;
      });
    }

    if (gapRange) {
      gapRange.addEventListener('input', () => {
        if (gapVal) gapVal.textContent = `${gapRange.value} px`;
      });
    }

    function closeArrangeModal() {
      if (arrangeModalEl) {
        arrangeModalEl.classList.remove('open');
        arrangeModalEl.style.display = 'none';
      }
    }

    const closeBtns = [
      document.getElementById('refboard-arrange-close-btn'),
      document.getElementById('refboard-arrange-cancel-btn')
    ];

    closeBtns.forEach((btn) => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          if (e) { e.preventDefault(); e.stopPropagation(); }
          closeArrangeModal();
        });
      }
    });

    const submitBtn = document.getElementById('refboard-arrange-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const cols = parseInt(colsRange ? colsRange.value : 5);
        const colWidth = parseInt(widthRange ? widthRange.value : 1500);
        const gap = parseInt(gapRange ? gapRange.value : 10);

        arrangeBoardMasonryGrid(cols, colWidth, gap);
        closeArrangeModal();
      });
    }
  }

  // Create Reference Image DOM Item
  function createRefImageItem(itemData) {
    itemsMap.set(itemData.id, itemData);

    if (isGridEnabled) {
      itemData.x = Math.round(itemData.x / 24) * 24;
      itemData.y = Math.round(itemData.y / 24) * 24;
    }

    const itemEl = document.createElement('div');
    itemEl.id = itemData.id;
    itemEl.className = 'ref-item';
    itemEl.style.transform = `translate(${itemData.x}px, ${itemData.y}px) rotate(${itemData.rotation}deg)`;
    itemEl.style.width = `${itemData.width}px`;
    itemEl.style.height = `${itemData.height}px`;
    itemEl.style.zIndex = itemData.zIndex;

    itemEl.innerHTML = `
      <img src="${itemData.dataUrl}" class="ref-item-img" alt="ref">
      <div class="ref-handle ref-handle-tl" data-handle="tl"></div>
      <div class="ref-handle ref-handle-tr" data-handle="tr"></div>
      <div class="ref-handle ref-handle-bl" data-handle="bl"></div>
      <div class="ref-handle ref-handle-br" data-handle="br"></div>
      <div class="ref-handle ref-handle-rot" data-handle="rot"></div>
      
      <div class="ref-item-toolbar">
        <button class="ref-tb-btn" data-act="front" title="นำขึ้นหน้าสุด">⬆ ขึ้นหน้า</button>
        <button class="ref-tb-btn" data-act="back" title="ส่งไปหลังสุด">⬇ ลงหลัง</button>
        <button class="ref-tb-btn del-btn" data-act="del" title="ลบรูป">🗑️ ลบ</button>
      </div>
    `;

    canvasEl.appendChild(itemEl);
    itemData.el = itemEl;
    itemData.imgEl = itemEl.querySelector('.ref-item-img');

    updateItemCount();
    bindItemEvents(itemEl, itemData);
    selectItem(itemData.id);
  }

  // Bind Item Events
  function bindItemEvents(itemEl, itemData) {
    let isInteracting = false;
    let activeMode = null;
    let startX = 0, startY = 0;
    let initialX = 0, initialY = 0, initialW = 0, initialH = 0;
    let activeHandle = null;

    itemEl.addEventListener('mousedown', (e) => {
      if (!isModalOpen || spacePressed) return;
      e.stopPropagation();

      const isShift = e.shiftKey || false;
      selectItem(itemData.id, isShift);

      const handleBtn = e.target.closest('.ref-handle');
      const tbBtn = e.target.closest('.ref-tb-btn');

      if (tbBtn) {
        const act = tbBtn.dataset.act;
        if (act === 'front') {
          selectedItemIds.forEach((sid) => {
            const sit = itemsMap.get(sid);
            const sel = document.getElementById(sid);
            if (sit && sel) {
              sit.zIndex = ++nextZIndex;
              sel.style.zIndex = sit.zIndex;
            }
          });
        } else if (act === 'back') {
          selectedItemIds.forEach((sid) => {
            const sit = itemsMap.get(sid);
            const sel = document.getElementById(sid);
            if (sit && sel) {
              sit.zIndex = 1;
              sel.style.zIndex = 1;
            }
          });
        } else if (act === 'del') {
          deleteItem(itemData.id);
        }
        return;
      }

      isInteracting = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = itemData.x;
      initialY = itemData.y;
      initialW = itemData.width;
      initialH = itemData.height;

      const groupInitialPositions = new Map();
      selectedItemIds.forEach((sid) => {
        const sitem = itemsMap.get(sid);
        if (sitem) {
          const sel = sitem.el || document.getElementById(sid);
          groupInitialPositions.set(sid, { x: sitem.x, y: sitem.y, el: sel });
        }
      });

      let anchorX = 0, anchorY = 0;
      let rotDeg0 = itemData.rotation || 0;
      let rotRad0 = (rotDeg0 * Math.PI) / 180;
      let cos0 = Math.cos(rotRad0);
      let sin0 = Math.sin(rotRad0);

      if (handleBtn) {
        activeHandle = handleBtn.dataset.handle;
        activeMode = activeHandle === 'rot' ? 'rotate' : 'resize';

        if (activeMode === 'resize') {
          const cx0 = initialX + initialW / 2;
          const cy0 = initialY + initialH / 2;
          let lx0 = 0, ly0 = 0;

          if (activeHandle === 'br') { lx0 = -initialW / 2; ly0 = -initialH / 2; }
          else if (activeHandle === 'tl') { lx0 = initialW / 2; ly0 = initialH / 2; }
          else if (activeHandle === 'tr') { lx0 = -initialW / 2; ly0 = initialH / 2; }
          else if (activeHandle === 'bl') { lx0 = initialW / 2; ly0 = -initialH / 2; }

          anchorX = cx0 + lx0 * cos0 - ly0 * sin0;
          anchorY = cy0 + lx0 * sin0 + ly0 * cos0;
        }
      } else {
        activeMode = 'move';
      }

      function onMouseMove(me) {
        if (!isInteracting) return;

        if (activeMode === 'move') {
          const dx = (me.clientX - startX) / zoom;
          const dy = (me.clientY - startY) / zoom;

          if (selectedItemIds.size > 1) {
            selectedItemIds.forEach((sid) => {
              const initPos = groupInitialPositions.get(sid);
              const sitem = itemsMap.get(sid);
              if (initPos && sitem) {
                let rawX = initPos.x + dx;
                let rawY = initPos.y + dy;
                if (isGridEnabled) {
                  rawX = Math.round(rawX / 24) * 24;
                  rawY = Math.round(rawY / 24) * 24;
                }
                sitem.x = rawX;
                sitem.y = rawY;
                if (initPos.el) {
                  initPos.el.style.transform = `translate(${rawX}px, ${rawY}px) rotate(${sitem.rotation || 0}deg)`;
                }
              }
            });
          } else {
            const rawX = initialX + dx;
            const rawY = initialY + dy;

            const snapResult = applyPhotoshopSmartGuides(itemData, rawX, rawY, itemData.width, itemData.height);
            itemData.x = snapResult.x;
            itemData.y = snapResult.y;
            itemEl.style.transform = `translate(${snapResult.x}px, ${snapResult.y}px) rotate(${itemData.rotation}deg)`;
          }
        } else if (activeMode === 'resize') {
          const vpRect = viewportEl ? viewportEl.getBoundingClientRect() : { left: 0, top: 0 };
          const curPointerX = (me.clientX - vpRect.left - panX) / zoom;
          const curPointerY = (me.clientY - vpRect.top - panY) / zoom;

          const vecX = curPointerX - anchorX;
          const vecY = curPointerY - anchorY;

          const localW = vecX * cos0 + vecY * sin0;
          const localH = -vecX * sin0 + vecY * cos0;

          let distW = 0, distH = 0;
          if (activeHandle === 'br') { distW = localW; distH = localH; }
          else if (activeHandle === 'tl') { distW = -localW; distH = -localH; }
          else if (activeHandle === 'tr') { distW = localW; distH = -localH; }
          else if (activeHandle === 'bl') { distW = -localW; distH = localH; }

          let newW = Math.max((distW + distH * itemData.aspect) / 2, 30);
          let newH = newW / itemData.aspect;

          let lcx = 0, lcy = 0;
          if (activeHandle === 'br') { lcx = newW / 2; lcy = newH / 2; }
          else if (activeHandle === 'tl') { lcx = -newW / 2; lcy = -newH / 2; }
          else if (activeHandle === 'tr') { lcx = newW / 2; lcy = -newH / 2; }
          else if (activeHandle === 'bl') { lcx = -newW / 2; lcy = newH / 2; }

          const newCx = anchorX + lcx * cos0 - lcy * sin0;
          const newCy = anchorY + lcx * sin0 + lcy * cos0;

          itemData.x = newCx - newW / 2;
          itemData.y = newCy - newH / 2;
          itemData.width = newW;
          itemData.height = newH;

          itemEl.style.width = `${newW}px`;
          itemEl.style.height = `${newH}px`;
          if (itemData.imgEl) {
            itemData.imgEl.style.width = `${newW}px`;
            itemData.imgEl.style.height = `${newH}px`;
          }
          itemEl.style.transform = `translate(${itemData.x}px, ${itemData.y}px) rotate(${rotDeg0}deg)`;
        } else if (activeMode === 'rotate') {
          const rect = itemEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const rad = Math.atan2(me.clientY - centerY, me.clientX - centerX);
          let deg = rad * (180 / Math.PI) + 90;

          // Snap rotation to 15-degree steps if Ctrl key is pressed or Grid mode is enabled
          if (me.ctrlKey || me.metaKey || isGridEnabled) {
            deg = Math.round(deg / 15) * 15;
          }

          itemData.rotation = deg;
          itemEl.style.transform = `translate(${itemData.x}px, ${itemData.y}px) rotate(${deg}deg)`;
        }

        updateSelectionBox();
      }

      function onMouseUp() {
        clearSmartGuides();
        isInteracting = false;
        activeMode = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    // Mobile Touch Handling for Individual Item Dragging & Resizing
    itemEl.addEventListener('touchstart', (e) => {
      if (!isModalOpen || e.touches.length !== 1) return;
      e.stopPropagation();

      selectItem(itemData.id);

      const touch = e.touches[0];
      const handleBtn = e.target.closest('.ref-handle');
      const tbBtn = e.target.closest('.ref-tb-btn');

      if (tbBtn) return;

      isInteracting = true;
      startX = touch.clientX;
      startY = touch.clientY;
      initialX = itemData.x;
      initialY = itemData.y;
      initialW = itemData.width;
      initialH = itemData.height;

      let anchorX = 0, anchorY = 0;
      let rotDeg0 = itemData.rotation || 0;
      let rotRad0 = (rotDeg0 * Math.PI) / 180;
      let cos0 = Math.cos(rotRad0);
      let sin0 = Math.sin(rotRad0);

      if (handleBtn) {
        activeHandle = handleBtn.dataset.handle;
        activeMode = activeHandle === 'rot' ? 'rotate' : 'resize';

        if (activeMode === 'resize') {
          const cx0 = initialX + initialW / 2;
          const cy0 = initialY + initialH / 2;
          let lx0 = 0, ly0 = 0;

          if (activeHandle === 'br') { lx0 = -initialW / 2; ly0 = -initialH / 2; }
          else if (activeHandle === 'tl') { lx0 = initialW / 2; ly0 = initialH / 2; }
          else if (activeHandle === 'tr') { lx0 = -initialW / 2; ly0 = initialH / 2; }
          else if (activeHandle === 'bl') { lx0 = initialW / 2; ly0 = -initialH / 2; }

          anchorX = cx0 + lx0 * cos0 - ly0 * sin0;
          anchorY = cy0 + lx0 * sin0 + ly0 * cos0;
        }
      } else {
        activeMode = 'move';
      }

      function onTouchMove(te) {
        if (!isInteracting || te.touches.length !== 1) return;
        te.preventDefault();
        const t = te.touches[0];

        if (activeMode === 'move') {
          const dx = (t.clientX - startX) / zoom;
          const dy = (t.clientY - startY) / zoom;

          if (selectedItemIds.size > 1) {
            selectedItemIds.forEach((sid) => {
              const initPos = groupInitialPositions.get(sid);
              const sitem = itemsMap.get(sid);
              if (initPos && sitem) {
                let rawX = initPos.x + dx;
                let rawY = initPos.y + dy;
                if (isGridEnabled) {
                  rawX = Math.round(rawX / 24) * 24;
                  rawY = Math.round(rawY / 24) * 24;
                }
                sitem.x = rawX;
                sitem.y = rawY;
                if (initPos.el) {
                  initPos.el.style.transform = `translate(${rawX}px, ${rawY}px) rotate(${sitem.rotation || 0}deg)`;
                }
              }
            });
          } else {
            const rawX = initialX + dx;
            const rawY = initialY + dy;
            const snapResult = applyPhotoshopSmartGuides(itemData, rawX, rawY, itemData.width, itemData.height);
            itemData.x = snapResult.x;
            itemData.y = snapResult.y;
            itemEl.style.transform = `translate(${snapResult.x}px, ${snapResult.y}px) rotate(${itemData.rotation}deg)`;
          }
        } else if (activeMode === 'resize') {
          const vpRect = viewportEl ? viewportEl.getBoundingClientRect() : { left: 0, top: 0 };
          const curPointerX = (t.clientX - vpRect.left - panX) / zoom;
          const curPointerY = (t.clientY - vpRect.top - panY) / zoom;

          const vecX = curPointerX - anchorX;
          const vecY = curPointerY - anchorY;

          const localW = vecX * cos0 + vecY * sin0;
          const localH = -vecX * sin0 + vecY * cos0;

          let distW = 0, distH = 0;
          if (activeHandle === 'br') { distW = localW; distH = localH; }
          else if (activeHandle === 'tl') { distW = -localW; distH = -localH; }
          else if (activeHandle === 'tr') { distW = localW; distH = -localH; }
          else if (activeHandle === 'bl') { distW = -localW; distH = localH; }

          let newW = Math.max((distW + distH * itemData.aspect) / 2, 30);
          let newH = newW / itemData.aspect;

          let lcx = 0, lcy = 0;
          if (activeHandle === 'br') { lcx = newW / 2; lcy = newH / 2; }
          else if (activeHandle === 'tl') { lcx = -newW / 2; lcy = -newH / 2; }
          else if (activeHandle === 'tr') { lcx = newW / 2; lcy = -newH / 2; }
          else if (activeHandle === 'bl') { lcx = -newW / 2; lcy = newH / 2; }

          const newCx = anchorX + lcx * cos0 - lcy * sin0;
          const newCy = anchorY + lcx * sin0 + lcy * cos0;

          itemData.x = newCx - newW / 2;
          itemData.y = newCy - newH / 2;
          itemData.width = newW;
          itemData.height = newH;

          itemEl.style.width = `${newW}px`;
          itemEl.style.height = `${newH}px`;
          if (itemData.imgEl) {
            itemData.imgEl.style.width = `${newW}px`;
            itemData.imgEl.style.height = `${newH}px`;
          }
          itemEl.style.transform = `translate(${itemData.x}px, ${itemData.y}px) rotate(${rotDeg0}deg)`;
        } else if (activeMode === 'rotate') {
          const rect = itemEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const rad = Math.atan2(t.clientY - centerY, t.clientX - centerX);
          let deg = rad * (180 / Math.PI) + 90;

          if (isGridEnabled) {
            deg = Math.round(deg / 15) * 15;
          }

          itemData.rotation = deg;
          itemEl.style.transform = `translate(${itemData.x}px, ${itemData.y}px) rotate(${deg}deg)`;
        }

        updateSelectionBox();
      }

      function onTouchEnd() {
        clearSmartGuides();
        isInteracting = false;
        activeMode = null;
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
      }

      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchcancel', onTouchEnd);
    }, { passive: false });
  }

  // Selection
  function selectItem(id, isShift = false) {
    if (!id || !itemsMap.has(id)) return;

    if (isShift) {
      if (selectedItemIds.has(id)) {
        selectedItemIds.delete(id);
        const el = document.getElementById(id);
        if (el) el.classList.remove('selected');
      } else {
        selectedItemIds.add(id);
        const el = document.getElementById(id);
        if (el) el.classList.add('selected');
      }
    } else {
      if (!selectedItemIds.has(id)) {
        deselectAll();
        selectedItemIds.add(id);
        const el = document.getElementById(id);
        if (el) el.classList.add('selected');
      }
    }

    selectedItemId = selectedItemIds.size > 0 ? (selectedItemIds.has(id) ? id : Array.from(selectedItemIds)[0]) : null;
    updateSelectionBox();
  }

  function deselectAll() {
    selectedItemIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('selected');
    });
    selectedItemIds.clear();
    selectedItemId = null;
    updateSelectionBox();
  }

  // Delete Item
  function deleteItem(id) {
    if (selectedItemIds.has(id) && selectedItemIds.size > 1) {
      const ids = Array.from(selectedItemIds);
      ids.forEach((delId) => {
        const el = document.getElementById(delId);
        if (el) el.remove();
        itemsMap.delete(delId);
      });
      deselectAll();
      updateItemCount();
      return;
    }

    const el = document.getElementById(id);
    if (el) el.remove();
    itemsMap.delete(id);
    selectedItemIds.delete(id);
    if (selectedItemId === id) selectedItemId = Array.from(selectedItemIds)[0] || null;
    updateItemCount();
    updateSelectionBox();
  }

  // Update Unified Group Bounding Box
  function updateSelectionBox() {
    const groupBoxEl = document.getElementById('refboard-group-box');
    if (!groupBoxEl) return;

    if (selectedItemIds.size <= 1) {
      groupBoxEl.classList.remove('active');
      if (modalEl) modalEl.classList.remove('refboard-multi-select');
      return;
    }

    if (modalEl) modalEl.classList.add('refboard-multi-select');

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    selectedItemIds.forEach((id) => {
      const it = itemsMap.get(id);
      if (!it) return;

      const rotDeg = it.rotation || 0;
      const rotRad = (rotDeg * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rotRad));
      const sin = Math.abs(Math.sin(rotRad));

      const boundingW = it.width * cos + it.height * sin;
      const boundingH = it.width * sin + it.height * cos;

      const centerShiftX = (it.width - boundingW) / 2;
      const centerShiftY = (it.height - boundingH) / 2;

      const visualLeft = it.x + centerShiftX;
      const visualTop = it.y + centerShiftY;

      minX = Math.min(minX, visualLeft);
      minY = Math.min(minY, visualTop);
      maxX = Math.max(maxX, visualLeft + boundingW);
      maxY = Math.max(maxY, visualTop + boundingH);
    });

    if (minX === Infinity) {
      groupBoxEl.classList.remove('active');
      if (modalEl) modalEl.classList.remove('refboard-multi-select');
      return;
    }

    const groupW = Math.max(maxX - minX, 10);
    const groupH = Math.max(maxY - minY, 10);

    groupBoxEl.style.transform = `translate(${minX}px, ${minY}px)`;
    groupBoxEl.style.width = `${groupW}px`;
    groupBoxEl.style.height = `${groupH}px`;
    groupBoxEl.classList.add('active');
  }

  // Setup Group Box Events
  function setupGroupEvents() {
    const groupBoxEl = document.getElementById('refboard-group-box');
    if (!groupBoxEl) return;

    groupBoxEl.addEventListener('click', (e) => {
      const tbBtn = e.target.closest('.ref-tb-btn');
      if (!tbBtn) return;
      e.stopPropagation();

      const act = tbBtn.dataset.gact;
      if (act === 'front') {
        selectedItemIds.forEach((sid) => {
          const sit = itemsMap.get(sid);
          const sel = document.getElementById(sid);
          if (sit && sel) {
            sit.zIndex = ++nextZIndex;
            sel.style.zIndex = sit.zIndex;
          }
        });
      } else if (act === 'back') {
        selectedItemIds.forEach((sid) => {
          const sit = itemsMap.get(sid);
          const sel = document.getElementById(sid);
          if (sit && sel) {
            sit.zIndex = 1;
            sel.style.zIndex = 1;
          }
        });
      } else if (act === 'del') {
        const ids = Array.from(selectedItemIds);
        ids.forEach((id) => deleteItem(id));
      }
    });

    groupBoxEl.addEventListener('mousedown', (e) => {
      if (!isModalOpen || spacePressed || e.target.closest('.ref-tb-btn')) return;

      const handleBtn = e.target.closest('.ref-handle');

      if (handleBtn) {
        e.stopPropagation();
        const ghandle = handleBtn.dataset.ghandle;
        const vpRect = viewportEl ? viewportEl.getBoundingClientRect() : { left: 0, top: 0 };
        const startPointerX = (e.clientX - vpRect.left - panX) / zoom;
        const startPointerY = (e.clientY - vpRect.top - panY) / zoom;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const initialItemsState = new Map();

        selectedItemIds.forEach((id) => {
          const it = itemsMap.get(id);
          if (!it) return;

          const rotDeg = it.rotation || 0;
          const rotRad = (rotDeg * Math.PI) / 180;
          const cos = Math.abs(Math.cos(rotRad));
          const sin = Math.abs(Math.sin(rotRad));
          const boundingW = it.width * cos + it.height * sin;
          const boundingH = it.width * sin + it.height * cos;
          const centerShiftX = (it.width - boundingW) / 2;
          const centerShiftY = (it.height - boundingH) / 2;
          const visualLeft = it.x + centerShiftX;
          const visualTop = it.y + centerShiftY;

          minX = Math.min(minX, visualLeft);
          minY = Math.min(minY, visualTop);
          maxX = Math.max(maxX, visualLeft + boundingW);
          maxY = Math.max(maxY, visualTop + boundingH);

          initialItemsState.set(id, {
            x: it.x,
            y: it.y,
            w: it.width,
            h: it.height,
            aspect: it.aspect,
            rotation: rotDeg,
            el: it.el || document.getElementById(id),
            imgEl: it.imgEl || document.querySelector(`#${id} .ref-item-img`)
          });
        });

        const initGroupW = Math.max(maxX - minX, 10);
        const initGroupH = Math.max(maxY - minY, 10);
        const groupCX = minX + initGroupW / 2;
        const groupCY = minY + initGroupH / 2;
        const startAngle = Math.atan2(startPointerY - groupCY, startPointerX - groupCX);

        let anchorX = minX, anchorY = minY;
        if (ghandle === 'tl') { anchorX = maxX; anchorY = maxY; }
        else if (ghandle === 'tr') { anchorX = minX; anchorY = maxY; }
        else if (ghandle === 'bl') { anchorX = maxX; anchorY = minY; }
        else if (ghandle === 'br') { anchorX = minX; anchorY = minY; }

        function onGroupMove(me) {
          const curPointerX = (me.clientX - vpRect.left - panX) / zoom;
          const curPointerY = (me.clientY - vpRect.top - panY) / zoom;

          if (ghandle === 'rot') {
            const curAngle = Math.atan2(curPointerY - groupCY, curPointerX - groupCX);
            let dDeg = (curAngle - startAngle) * (180 / Math.PI);

            if (me.ctrlKey || me.metaKey || isGridEnabled) {
              dDeg = Math.round(dDeg / 15) * 15;
            }

            const dRad = (dDeg * Math.PI) / 180;
            const cosD = Math.cos(dRad);
            const sinD = Math.sin(dRad);

            selectedItemIds.forEach((sid) => {
              const st = initialItemsState.get(sid);
              const sitem = itemsMap.get(sid);
              if (st && sitem) {
                const icx0 = st.x + st.w / 2;
                const icy0 = st.y + st.h / 2;
                const relX = icx0 - groupCX;
                const relY = icy0 - groupCY;

                const newRelX = relX * cosD - relY * sinD;
                const newRelY = relX * sinD + relY * cosD;

                const newIcx = groupCX + newRelX;
                const newIcy = groupCY + newRelY;

                sitem.x = newIcx - st.w / 2;
                sitem.y = newIcy - st.h / 2;
                sitem.rotation = st.rotation + dDeg;

                if (st.el) {
                  st.el.style.transform = `translate(${sitem.x}px, ${sitem.y}px) rotate(${sitem.rotation}deg)`;
                }
              }
            });
          } else {
            const vecX = curPointerX - anchorX;
            const vecY = curPointerY - anchorY;

            let distW = 0, distH = 0;
            if (ghandle === 'br') { distW = vecX; distH = vecY; }
            else if (ghandle === 'tl') { distW = -vecX; distH = -vecY; }
            else if (ghandle === 'tr') { distW = vecX; distH = -vecY; }
            else if (ghandle === 'bl') { distW = -vecX; distH = vecY; }

            const scaleW = distW / initGroupW;
            const scaleH = distH / initGroupH;
            const scaleRatio = Math.max((scaleW + scaleH) / 2, 0.05);

            selectedItemIds.forEach((sid) => {
              const st = initialItemsState.get(sid);
              const sitem = itemsMap.get(sid);
              if (st && sitem) {
                sitem.width = Math.max(st.w * scaleRatio, 20);
                sitem.height = sitem.width / st.aspect;

                const offsetX = st.x - anchorX;
                const offsetY = st.y - anchorY;

                sitem.x = anchorX + offsetX * scaleRatio;
                sitem.y = anchorY + offsetY * scaleRatio;

                if (st.el) {
                  st.el.style.width = `${sitem.width}px`;
                  st.el.style.height = `${sitem.height}px`;
                  st.el.style.transform = `translate(${sitem.x}px, ${sitem.y}px) rotate(${st.rotation}deg)`;
                }
                if (st.imgEl) {
                  st.imgEl.style.width = `${sitem.width}px`;
                  st.imgEl.style.height = `${sitem.height}px`;
                }
              }
            });
          }

          updateSelectionBox();
        }

        function onGroupUp() {
          window.removeEventListener('mousemove', onGroupMove);
          window.removeEventListener('mouseup', onGroupUp);
        }

        window.addEventListener('mousemove', onGroupMove);
        window.addEventListener('mouseup', onGroupUp);
        return;
      }

      let isGroupDragging = true;
      const startX = e.clientX;
      const startY = e.clientY;

      const groupInitialPositions = new Map();
      selectedItemIds.forEach((sid) => {
        const sitem = itemsMap.get(sid);
        if (sitem) {
          const sel = sitem.el || document.getElementById(sid);
          groupInitialPositions.set(sid, { x: sitem.x, y: sitem.y, el: sel });
        }
      });

      function onMove(me) {
        if (!isGroupDragging) return;
        const dx = (me.clientX - startX) / zoom;
        const dy = (me.clientY - startY) / zoom;

        selectedItemIds.forEach((sid) => {
          const initPos = groupInitialPositions.get(sid);
          const sitem = itemsMap.get(sid);
          if (initPos && sitem) {
            let rawX = initPos.x + dx;
            let rawY = initPos.y + dy;
            if (isGridEnabled) {
              rawX = Math.round(rawX / 24) * 24;
              rawY = Math.round(rawY / 24) * 24;
            }
            sitem.x = rawX;
            sitem.y = rawY;
            if (initPos.el) {
              initPos.el.style.transform = `translate(${rawX}px, ${rawY}px) rotate(${sitem.rotation || 0}deg)`;
            }
          }
        });

        updateSelectionBox();
      }

      function onUp() {
        isGroupDragging = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      }

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });
  }

  // Clear Board
  function clearBoard() {
    canvasEl.innerHTML = '';
    itemsMap.clear();
    selectedItemId = null;
    updateItemCount();
  }

  function updateItemCount() {
    const badge = document.getElementById('refboard-count-badge');
    const count = itemsMap.size;
    if (badge) badge.textContent = `${count} รูป`;
    if (emptyHintEl) {
      emptyHintEl.style.display = count === 0 ? 'flex' : 'none';
    }
  }

  // EXPORT SYSTEM
  function updateExportSettingsVisibility(fmt) {
    const expSettings = document.getElementById('refboard-exp-settings');
    const scaleGroup = document.getElementById('ref-scale-group');
    const qualityGroup = document.getElementById('ref-quality-group');
    const pdfLayoutGroup = document.getElementById('ref-pdf-layout-group');
    const scaleSlider = document.getElementById('ref-scale-slider');
    const scaleVal = document.getElementById('ref-scale-val');
    const qualitySlider = document.getElementById('ref-quality-slider');
    const qualityVal = document.getElementById('ref-quality-val');

    if (fmt === 'png' || fmt === 'jpg' || fmt === 'psd' || fmt === 'pdf') {
      if (expSettings) expSettings.style.display = 'block';
      if (scaleGroup) scaleGroup.style.display = 'block';
      if (qualityGroup) qualityGroup.style.display = (fmt === 'jpg' || fmt === 'pdf') ? 'block' : 'none';
      if (pdfLayoutGroup) pdfLayoutGroup.style.display = fmt === 'pdf' ? 'block' : 'none';

      if (scaleSlider) scaleSlider.value = 100;
      if (scaleVal) scaleVal.textContent = '100%';
      if (qualitySlider) qualitySlider.value = 100;
      if (qualityVal) qualityVal.textContent = '100%';
    } else {
      if (expSettings) expSettings.style.display = 'none';
      if (pdfLayoutGroup) pdfLayoutGroup.style.display = 'none';
    }
  }

  function setupExportModal() {
    const closeBtn = document.getElementById('refboard-exp-close');
    const cancelBtn = document.getElementById('refboard-exp-cancel');
    const submitBtn = document.getElementById('refboard-exp-submit');
    const scaleSlider = document.getElementById('ref-scale-slider');
    const scaleVal = document.getElementById('ref-scale-val');
    const qualitySlider = document.getElementById('ref-quality-slider');
    const qualityVal = document.getElementById('ref-quality-val');
    const formatOpts = document.querySelectorAll('.refboard-exp-opt');
    const pdfOpts = document.querySelectorAll('.refboard-exp-pdf-mode');

    closeBtn.addEventListener('click', closeExportModal);
    cancelBtn.addEventListener('click', closeExportModal);

    formatOpts.forEach((opt) => {
      opt.addEventListener('click', () => {
        formatOpts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        const fmt = opt.dataset.fmt;
        updateExportSettingsVisibility(fmt);
      });
    });

    pdfOpts.forEach((opt) => {
      opt.addEventListener('click', () => {
        pdfOpts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    scaleSlider.addEventListener('input', () => {
      scaleVal.textContent = `${scaleSlider.value}%`;
    });

    qualitySlider.addEventListener('input', () => {
      qualityVal.textContent = `${qualitySlider.value}%`;
    });

    submitBtn.addEventListener('click', executeExport);
  }

  function openExportModal() {
    exportModalEl.classList.add('open');
    const activeOpt = document.querySelector('.refboard-exp-opt.active');
    const fmt = activeOpt ? activeOpt.dataset.fmt : 'png';
    updateExportSettingsVisibility(fmt);
  }

  function closeExportModal() {
    exportModalEl.classList.remove('open');
  }

  // Filename format: (HH-mm-ss)_Toru_board.[ext] (NO DATE!)
  function generateExportFilename(ext) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${hh}-${mm}-${ss}_Toru_board.${ext}`;
  }

  function executeExport() {
    const selectedOpt = document.querySelector('.refboard-exp-opt.active');
    const fmt = selectedOpt ? selectedOpt.dataset.fmt : 'png';
    const scale = parseInt(document.getElementById('ref-scale-slider').value) / 100;
    const quality = parseInt(document.getElementById('ref-quality-slider').value) / 100;

    closeExportModal();

    if (fmt === 'refboard') {
      exportAsRefBoardFile();
    } else if (fmt === 'psd') {
      exportAsPsdFile(scale);
    } else if (fmt === 'pdf') {
      const pdfModeOpt = document.querySelector('.refboard-exp-pdf-mode.active');
      const pdfMode = pdfModeOpt ? pdfModeOpt.dataset.pdfmode : 'single';
      exportAsPdfFile(pdfMode, scale, quality);
    } else {
      exportAsImageFile(fmt, scale, quality);
    }
  }

  // Export 1: RefBoard JSON File
  function exportAsRefBoardFile() {
    const boardData = {
      version: 1.0,
      timestamp: new Date().toISOString(),
      panX: panX,
      panY: panY,
      zoom: zoom,
      items: Array.from(itemsMap.values())
    };

    const jsonStr = JSON.stringify(boardData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    triggerDownload(blob, generateExportFilename('refboard'));
  }

  // Export 2 & 3: PNG / JPG Image Render
  function exportAsImageFile(fmt, scaleMultiplier, quality) {
    const items = Array.from(itemsMap.values());
    if (items.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    items.forEach((it) => {
      minX = Math.min(minX, it.x);
      minY = Math.min(minY, it.y);
      maxX = Math.max(maxX, it.x + it.width);
      maxY = Math.max(maxY, it.y + it.height);
    });

    const padding = 40;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const boardWidth = Math.max(maxX - minX, 100);
    const boardHeight = Math.max(maxY - minY, 100);

    const renderCanvas = document.createElement('canvas');
    renderCanvas.width = boardWidth * scaleMultiplier;
    renderCanvas.height = boardHeight * scaleMultiplier;
    const ctx = renderCanvas.getContext('2d');

    ctx.scale(scaleMultiplier, scaleMultiplier);

    if (fmt === 'jpg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, boardWidth, boardHeight);
    }

    const sortedItems = items.slice().sort((a, b) => a.zIndex - b.zIndex);
    let loaded = 0;

    sortedItems.forEach((it) => {
      const img = new Image();
      img.onload = () => {
        ctx.save();

        const itemCenterX = (it.x - minX) + it.width / 2;
        const itemCenterY = (it.y - minY) + it.height / 2;

        ctx.translate(itemCenterX, itemCenterY);
        ctx.rotate((it.rotation * Math.PI) / 180);

        ctx.drawImage(img, -it.width / 2, -it.height / 2, it.width, it.height);
        ctx.restore();

        loaded++;
        if (loaded === sortedItems.length) {
          const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
          renderCanvas.toBlob((blob) => {
            triggerDownload(blob, generateExportFilename(fmt));
          }, mime, quality);
        }
      };
      img.src = it.dataUrl;
    });
  }

  // Export 4: Photoshop PSD Document
  function exportAsPsdFile(scaleMultiplier) {
    if (typeof agPsd === 'undefined') {
      showRefAlert('ไม่พบสคริปต์', 'ไม่พบสคริปต์สร้างไฟล์ PSD กรุณาลองใหม่อีกครั้ง');
      return;
    }

    const items = Array.from(itemsMap.values());
    if (items.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    items.forEach((it) => {
      minX = Math.min(minX, it.x);
      minY = Math.min(minY, it.y);
      maxX = Math.max(maxX, it.x + it.width);
      maxY = Math.max(maxY, it.y + it.height);
    });

    const padding = 40;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const boardW = Math.round((maxX - minX) * scaleMultiplier);
    const boardH = Math.round((maxY - minY) * scaleMultiplier);

    const sortedItems = items.slice().sort((a, b) => a.zIndex - b.zIndex);
    const layers = [];
    let loaded = 0;

    sortedItems.forEach((it, idx) => {
      const img = new Image();
      img.onload = () => {
        const itemW = Math.round(it.width * scaleMultiplier);
        const itemH = Math.round(it.height * scaleMultiplier);
        const itemX = Math.round((it.x - minX) * scaleMultiplier);
        const itemY = Math.round((it.y - minY) * scaleMultiplier);

        const lCanvas = document.createElement('canvas');
        lCanvas.width = itemW;
        lCanvas.height = itemH;
        const lCtx = lCanvas.getContext('2d');

        if (it.rotation) {
          lCtx.translate(itemW / 2, itemH / 2);
          lCtx.rotate((it.rotation * Math.PI) / 180);
          lCtx.drawImage(img, -itemW / 2, -itemH / 2, itemW, itemH);
        } else {
          lCtx.drawImage(img, 0, 0, itemW, itemH);
        }

        const imgData = lCtx.getImageData(0, 0, itemW, itemH);

        layers.push({
          name: `Ref Image ${idx + 1}`,
          left: itemX,
          top: itemY,
          imageData: imgData,
          canvas: lCanvas
        });

        loaded++;
        if (loaded === sortedItems.length) {
          try {
            // Create dedicated Black Background Layer at position 0 (bottom)
            const bgCanvas = document.createElement('canvas');
            bgCanvas.width = boardW;
            bgCanvas.height = boardH;
            const bgCtx = bgCanvas.getContext('2d');
            bgCtx.fillStyle = '#0d0d0d';
            bgCtx.fillRect(0, 0, boardW, boardH);

            const bgImageData = bgCtx.getImageData(0, 0, boardW, boardH);
            const bgLayer = {
              name: 'Background Black',
              left: 0,
              top: 0,
              canvas: bgCanvas,
              imageData: bgImageData
            };

            // Unshift background layer so user image layers remain 100% separate above it
            const psdLayers = [bgLayer, ...layers];

            const psdData = {
              width: boardW,
              height: boardH,
              children: psdLayers
            };
            const buffer = agPsd.writePsd(psdData);
            const blob = new Blob([buffer], { type: 'image/vnd.adobe.photoshop' });
            triggerDownload(blob, generateExportFilename('psd'));
          } catch (err) {
            showRefAlert('เกิดข้อผิดพลาด', 'เกิดข้อผิดพลาดในการสร้างไฟล์ PSD: ' + err.message);
          }
        }
      };
      img.src = it.dataUrl;
    });
  }

  // Import PDF Document File (Renders all PDF pages into images on the canvas)
  function importPdfFile(file) {
    if (typeof pdfjsLib === 'undefined') {
      showRefAlert('ไม่พบสคริปต์ PDF', 'ไม่พบไลบรารีอ่านไฟล์ PDF กรุณาลองใหม่อีกครั้งครับ');
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const numPages = pdf.numPages;

        const startX = -panX / zoom + (viewportEl ? viewportEl.clientWidth / 2 : 300) - 150;
        const startY = -panY / zoom + (viewportEl ? viewportEl.clientHeight / 2 : 300) - 150;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');

          let w = viewport.width;
          let h = viewport.height;
          const aspect = w / h;
          const maxDim = 1500;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              w = maxDim;
              h = maxDim / aspect;
            } else {
              h = maxDim;
              w = maxDim * aspect;
            }
          }

          const offset = ((pageNum - 1) % 8) * 35;
          createRefImageItem({
            id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5) + '_pdf' + pageNum,
            dataUrl: dataUrl,
            x: startX + offset,
            y: startY + offset,
            width: w,
            height: h,
            aspect: aspect,
            rotation: 0,
            zIndex: ++nextZIndex
          });
        }
      } catch (err) {
        console.error('PDF import failed:', err);
        showRefAlert('นำเข้า PDF ไม่สำเร็จ', 'เกิดข้อผิดพลาดขณะอ่านไฟล์ PDF กรุณาตรวจสอบว่าเป็นไฟล์ PDF ที่สมบูรณ์ครับ');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Export 5: PDF Document File (Single Page / Multi-Page A4)
  function exportAsPdfFile(pdfLayoutMode, scaleMultiplier, quality) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      showRefAlert('ไม่พบสคริปต์ PDF', 'ไม่พบไลบรารีสร้างไฟล์ PDF กรุณาลองใหม่อีกครั้ง');
      return;
    }

    const items = Array.from(itemsMap.values());
    if (items.length === 0) return;

    if (pdfLayoutMode === 'multi') {
      // Multi-Page A4 (1 image per page)
      const sortedItems = items.slice().sort((a, b) => a.zIndex - b.zIndex);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const a4W = 210;
      const a4H = 297;
      const margin = 10;
      const maxW = a4W - margin * 2;
      const maxH = a4H - margin * 2;

      let loaded = 0;

      sortedItems.forEach((it, index) => {
        const img = new Image();
        img.onload = () => {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = it.width * scaleMultiplier;
          tempCanvas.height = it.height * scaleMultiplier;
          const ctx = tempCanvas.getContext('2d');
          ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

          const dataUrl = tempCanvas.toDataURL('image/jpeg', quality);
          const aspect = it.width / it.height;

          let renderW = maxW;
          let renderH = maxW / aspect;
          if (renderH > maxH) {
            renderH = maxH;
            renderW = maxH * aspect;
          }

          const posX = (a4W - renderW) / 2;
          const posY = (a4H - renderH) / 2;

          if (index > 0) {
            pdf.addPage('a4', 'portrait');
          }

          pdf.addImage(dataUrl, 'JPEG', posX, posY, renderW, renderH);

          loaded++;
          if (loaded === sortedItems.length) {
            pdf.save(generateExportFilename('pdf'));
          }
        };
        img.src = it.dataUrl;
      });
    } else {
      // Single Page Overview Board
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      items.forEach((it) => {
        minX = Math.min(minX, it.x);
        minY = Math.min(minY, it.y);
        maxX = Math.max(maxX, it.x + it.width);
        maxY = Math.max(maxY, it.y + it.height);
      });

      const padding = 40;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;

      const boardWidth = Math.max(maxX - minX, 100);
      const boardHeight = Math.max(maxY - minY, 100);

      const renderCanvas = document.createElement('canvas');
      renderCanvas.width = boardWidth * scaleMultiplier;
      renderCanvas.height = boardHeight * scaleMultiplier;
      const ctx = renderCanvas.getContext('2d');

      ctx.scale(scaleMultiplier, scaleMultiplier);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, boardWidth, boardHeight);

      const sortedItems = items.slice().sort((a, b) => a.zIndex - b.zIndex);
      let loaded = 0;

      sortedItems.forEach((it) => {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          const itemCenterX = (it.x - minX) + it.width / 2;
          const itemCenterY = (it.y - minY) + it.height / 2;
          ctx.translate(itemCenterX, itemCenterY);
          ctx.rotate((it.rotation * Math.PI) / 180);
          ctx.drawImage(img, -it.width / 2, -it.height / 2, it.width, it.height);
          ctx.restore();

          loaded++;
          if (loaded === sortedItems.length) {
            const imgData = renderCanvas.toDataURL('image/jpeg', quality);
            const orientation = boardWidth >= boardHeight ? 'landscape' : 'portrait';
            const pdf = new jsPDF({
              orientation: orientation,
              unit: 'px',
              format: [boardWidth, boardHeight]
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, boardWidth, boardHeight);
            pdf.save(generateExportFilename('pdf'));
          }
        };
        img.src = it.dataUrl;
      });
    }
  }

  // Trigger File Download
  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

})();
