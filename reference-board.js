/* ═══════════════════════════════════════════════════════════════════════════
   REFERENCE BOARD (กระดานเรฟภาพอ้างอิง)
   Modular JS Engine with PSD / PNG / JPG / RefBoard Export & Import
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Active Document Proxy: Automatically resolves document.getElementById, querySelector,
  // createElement, and event targets to whichever window (Main Tab or PiP Window) currently hosts the board!
  const realDocument = (typeof window !== 'undefined' && window.document) ? window.document : {};
  const document = new Proxy(realDocument, {
    get(target, prop) {
      const active = (modalEl && modalEl.ownerDocument) ? modalEl.ownerDocument : ((pipWindow && !pipWindow.closed) ? pipWindow.document : target);
      if (prop === 'getElementById') {
        return function (id) {
          return active.getElementById(id) || target.getElementById(id);
        };
      }
      if (prop === 'querySelector') {
        return function (sel) {
          return active.querySelector(sel) || target.querySelector(sel);
        };
      }
      if (prop === 'querySelectorAll') {
        return function (sel) {
          const res = active.querySelectorAll(sel);
          return (res && res.length > 0) ? res : target.querySelectorAll(sel);
        };
      }
      if (prop === 'createElement') {
        return function (tagName, options) {
          return active.createElement(tagName, options);
        };
      }
      if (prop === 'elementFromPoint') {
        return function (x, y) {
          return active.elementFromPoint(x, y) || target.elementFromPoint(x, y);
        };
      }
      const val = active[prop];
      if (typeof val === 'function') {
        return val.bind(active);
      }
      return val;
    }
  });

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

  // Document Picture-in-Picture State (Always on Top)
  let pipWindow = null;
  let pipPlaceholders = [];
  let pipThemeObserver = null;

  // Marquee Drag Selection State
  let isMarqueeSelecting = false;
  let marqueeStartX = 0;
  let marqueeStartY = 0;

  // Undo & Redo History State Management
  const undoStack = [];
  const redoStack = [];
  const MAX_UNDO_STEPS = 50;
  let preDragSnapshot = null;

  // Internal Clipboard State (Copy / Cut / Paste)
  let internalClipboard = [];

  // DOM Elements
  let modalEl, headerEl, viewportEl, canvasEl, emptyHintEl, dropOverlayEl;
  let addFileInput, importFileInput;
  let exportModalEl, alertModalEl, arrangeModalEl, linkModalEl, linkInputEl;

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
              <button class="refboard-btn btn-accent" id="refboard-palette-toggle-btn" title="เปิด/ปิด สุ่มคู่สี">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 10 10c0 2.5-2 4.5-4.5 4.5H16a2 2 0 0 0-2 2v.5c0 1.4-1.1 2.5-2.5 2.5A10 10 0 0 1 12 2z" />
                </svg>
                <span>สุ่มคู่สี</span>
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
              <button class="refboard-btn" id="refboard-undo-btn" title="ย้อนกลับ (Ctrl+Z)" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 7v6h6"></path>
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                </svg>
                <span>ย้อนกลับ</span>
              </button>
              <button class="refboard-btn" id="refboard-redo-btn" title="ทำซ้ำ (Ctrl+Y)" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 7v6h-6"></path>
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
                </svg>
                <span>ทำซ้ำ</span>
              </button>
              <button class="refboard-btn btn-accent" id="refboard-arrange-btn" title="จัดเรียงรูปภาพทั้งหมดในกระดานให้อัตโนมัติ (แถวละ 5 รูป)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span>จัดเรียง</span>
              </button>
              <button class="refboard-btn btn-accent" id="refboard-link-btn" title="วางลิงก์ YouTube, Shorts, Google Drive, TikTok, วิดีโอ, ภาพ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>วางลิงก์</span>
              </button>
              <button class="refboard-btn btn-accent" id="refboard-import-btn" title="นำเข้าไฟล์รูปภาพ, วิดีโอ, GIF, PSD, PDF, SVG หรือไฟล์กระดานเรฟ (.refboard)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
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
              <button class="refboard-icon-btn" id="refboard-float-btn" title="แยกหน้าต่างลอยนอกจอ (Always on Top)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="3" ry="3"></rect>
                  <rect x="11" y="11" width="9" height="9" rx="1.5" ry="1.5" fill="currentColor" opacity="0.3"></rect>
                  <path d="M11 15h9"></path>
                  <path d="M15 11v9"></path>
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
            <div id="refboard-marquee-box" class="refboard-marquee-box"></div>
            <div id="refboard-group-box" class="refboard-group-box">
              <div class="ref-handle ref-handle-tl" data-ghandle="tl"></div>
              <div class="ref-handle ref-handle-tr" data-ghandle="tr"></div>
              <div class="ref-handle ref-handle-bl" data-ghandle="bl"></div>
              <div class="ref-handle ref-handle-br" data-ghandle="br"></div>
              <div class="ref-handle ref-handle-rot" data-ghandle="rot"></div>

              <div class="ref-item-toolbar ref-group-toolbar">
                <button class="ref-tb-btn btn-regroup" data-gact="regroup" title="รวมกลุ่มรูปภาพที่เลือกไว้ด้วยกัน">📦 รวมกลุ่ม</button>
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
              <strong>ลากรูปภาพ / GIF (.gif, .png, .jpg), วิดีโอ (.mp4, .webm), PSD หรือ RefBoard วางที่นี่</strong><br>
              หรือกด <span class="refboard-kbd">Ctrl</span> + <span class="refboard-kbd">V</span> เพื่อวางรูปภาพ/วิดีโอจาก Clipboard<br>
              <span style="font-size: 11px; opacity: 0.8;">ย่อ-ขยายมีเดียโดยคงอัตราส่วน | เลื่อนกระดานด้วย <span class="refboard-kbd">Space</span> + ลากเม้าส์</span>
            </div>
          </div>

          <!-- Drop Overlay -->
          <div id="refboard-drop-overlay" class="refboard-drop-overlay">
            <svg viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>วางไฟล์ลงบนกระดานเรฟ (รองรับ PNG, JPG, GIF, วิดีโอ MP4/WebM, SVG, AI, PSD, PDF, RefBoard)</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="refboard-footer">
          <div class="refboard-footer-info">
            <span id="refboard-zoom-text" class="ref-footer-zoom">ซูม: 100%</span>
            <span class="ref-footer-sep-undo">|</span>
            <span class="ref-footer-undo">ย้อนกลับ <span class="refboard-kbd notranslate" translate="no">Ctrl</span> + <span class="refboard-kbd notranslate" translate="no">Z</span> | ทำซ้ำ <span class="refboard-kbd notranslate" translate="no">Ctrl</span> + <span class="refboard-kbd notranslate" translate="no">Y</span></span>
            <span class="ref-footer-sep-clip">|</span>
            <span class="ref-footer-clip">คัดลอก <span class="refboard-kbd notranslate" translate="no">Ctrl</span> + <span class="refboard-kbd notranslate" translate="no">C</span> | ตัด <span class="refboard-kbd notranslate" translate="no">Ctrl</span> + <span class="refboard-kbd notranslate" translate="no">X</span> | วาง <span class="refboard-kbd notranslate" translate="no">Ctrl</span> + <span class="refboard-kbd notranslate" translate="no">V</span></span>
            <span class="ref-footer-sep-del">|</span>
            <span class="ref-footer-del">ลบรูปกด <span class="refboard-kbd notranslate" translate="no">Del</span></span>
          </div>
          <div class="ref-footer-brand">
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
            <div class="refboard-exp-title-wrap">
              <span class="refboard-exp-icon">📦</span>
              <div>
                <h3>ส่งออกไฟล์กระดานเรฟ</h3>
                <p class="refboard-exp-sub">เลือกประเภทไฟล์ และปรับแต่งความละเอียดตามต้องการ</p>
              </div>
            </div>
            <button class="refboard-icon-btn close-btn" id="refboard-exp-close" title="ปิดหน้าต่าง">✕</button>
          </div>

          <!-- Format Selection -->
          <div class="refboard-exp-group">
            <div class="refboard-exp-label">
              <span>เลือกรูปแบบไฟล์</span>
              <span class="refboard-exp-tag" id="ref-fmt-selected-tag">PNG Image</span>
            </div>
            <div class="refboard-exp-format-grid">
              <div class="refboard-exp-format-card active" data-fmt="png">
                <input type="radio" name="ref-fmt" value="png" checked>
                <div class="refboard-fmt-icon">🖼️</div>
                <div class="refboard-fmt-info">
                  <span class="refboard-fmt-title">PNG Image</span>
                  <span class="refboard-fmt-desc">ไฟล์ภาพพื้นหลังใส (.png)</span>
                </div>
              </div>

              <div class="refboard-exp-format-card" data-fmt="jpg">
                <input type="radio" name="ref-fmt" value="jpg">
                <div class="refboard-fmt-icon">🌄</div>
                <div class="refboard-fmt-info">
                  <span class="refboard-fmt-title">JPG Image</span>
                  <span class="refboard-fmt-desc">ไฟล์ภาพบีบอัด (.jpg)</span>
                </div>
              </div>

              <div class="refboard-exp-format-card" data-fmt="psd">
                <input type="radio" name="ref-fmt" value="psd">
                <div class="refboard-fmt-icon">🎨</div>
                <div class="refboard-fmt-info">
                  <span class="refboard-fmt-title">Photoshop</span>
                  <span class="refboard-fmt-desc">แยกเลเยอร์ Photoshop (.psd)</span>
                </div>
              </div>

              <div class="refboard-exp-format-card" data-fmt="refboard">
                <input type="radio" name="ref-fmt" value="refboard">
                <div class="refboard-fmt-icon">📁</div>
                <div class="refboard-fmt-info">
                  <span class="refboard-fmt-title">RefBoard File</span>
                  <span class="refboard-fmt-desc">บันทึกเปิดแก้ไขใหม่ (.refboard)</span>
                </div>
              </div>

              <div class="refboard-exp-format-card span-full" data-fmt="pdf">
                <input type="radio" name="ref-fmt" value="pdf">
                <div class="refboard-fmt-icon">📄</div>
                <div class="refboard-fmt-info">
                  <span class="refboard-fmt-title">PDF Document</span>
                  <span class="refboard-fmt-desc">เอกสาร PDF พร้อมจัดหน้า (.pdf)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- PDF Layout Options (Shown only when PDF format is active) -->
          <div class="refboard-exp-group" id="ref-pdf-layout-group" style="display: none;">
            <div class="refboard-exp-label">รูปแบบจัดวางหน้า PDF</div>
            <div class="refboard-exp-pdf-grid">
              <div class="refboard-exp-pdf-card active" data-pdfmode="single">
                <input type="radio" name="ref-pdf-mode" value="single" checked>
                <span class="pdf-card-icon">📜</span>
                <div>
                  <strong>หน้าเดียวผืนใหญ่</strong>
                  <p>รวมรูปภาพทั้งหมดไว้ในหน้ากระดานใหญ่หน้าเดียว</p>
                </div>
              </div>
              <div class="refboard-exp-pdf-card" data-pdfmode="multi">
                <input type="radio" name="ref-pdf-mode" value="multi">
                <span class="pdf-card-icon">📑</span>
                <div>
                  <strong>แยกหลายหน้าตามรูป</strong>
                  <p>แยกรูปภาพแต่ละอันออกเป็นหน้า PDF ของตัวเอง</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quality / Scale Settings -->
          <div id="refboard-exp-settings" class="refboard-exp-settings-box">
            <div class="refboard-exp-group" id="ref-scale-group">
              <div class="refboard-exp-slider-header">
                <span class="refboard-exp-slider-title">🔍 ความละเอียดภาพ (Scale)</span>
                <span class="refboard-exp-val" id="ref-scale-val">100%</span>
              </div>
              <input type="range" id="ref-scale-slider" min="50" max="300" step="25" value="100">
            </div>

            <div class="refboard-exp-group" id="ref-quality-group" style="margin-bottom: 0;">
              <div class="refboard-exp-slider-header">
                <span class="refboard-exp-slider-title">✨ คุณภาพภาพ (Quality)</span>
                <span class="refboard-exp-val" id="ref-quality-val">100%</span>
              </div>
              <input type="range" id="ref-quality-slider" min="10" max="100" step="5" value="100">
            </div>

            <div class="refboard-exp-group" id="ref-smart-embed-group" style="margin-top: 14px; margin-bottom: 0;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; user-select: none; color: var(--text, #fff);">
                <input type="checkbox" id="ref-smart-embed-chk" checked style="width: 16px; height: 16px; accent-color: #38bdf8; cursor: pointer;">
                <span>✨ <strong>ฝังข้อมูลกระดานเรฟ (Smart Embed)</strong> — ลากภาพกลับมาเปิดแก้ไขได้เสมอ</span>
              </label>
            </div>
          </div>

          <div class="refboard-exp-actions">
            <button class="refboard-exp-btn-cancel" id="refboard-exp-cancel">ยกเลิก</button>
            <button class="refboard-exp-btn-submit" id="refboard-exp-submit">
              <span>ดาวน์โหลดไฟล์</span>
              <span class="btn-arrow">➔</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Export Loading Overlay Modal -->
      <div id="refboard-export-loading-backdrop" class="refboard-exp-backdrop">
        <div class="refboard-exp-loading-card">
          <div class="refboard-exp-loading-header">
            <div class="refboard-exp-loading-spinner-wrap">
              <div class="refboard-exp-spinner"></div>
              <span class="refboard-exp-loading-icon">⏳</span>
            </div>
            <div class="refboard-exp-loading-texts">
              <h3 id="refboard-exp-loading-title">กำลังสร้างไฟล์...</h3>
              <p id="refboard-exp-loading-msg">กำลังจัดเตรียมรูปภาพและประมวลผลไฟล์ กรุณารอสักครู่ครับ</p>
            </div>
          </div>

          <div class="refboard-exp-progress-container">
            <div class="refboard-exp-progress-header">
              <span id="refboard-exp-progress-status">ความคืบหน้าการส่งออก</span>
              <span id="refboard-exp-progress-num" class="refboard-exp-progress-num">0%</span>
            </div>
            <div class="refboard-exp-progress-bar">
              <div id="refboard-exp-progress-fill" class="refboard-exp-progress-fill" style="width: 0%;"></div>
            </div>
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

      <!-- Link Import Dialog Modal -->
      <div id="refboard-link-backdrop" class="refboard-exp-backdrop">
        <div class="cg-modal-box" style="max-width: 480px; text-align: left;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
            <h3 class="cg-modal-title" style="margin:0; font-size:18px; display:flex; align-items:center; gap:8px;">
              <span>🔗</span> วางลิงก์มีเดีย (URL)
            </h3>
            <button class="refboard-icon-btn close-btn" id="refboard-link-close-btn" style="width:28px;height:28px;">✕</button>
          </div>
          <p style="font-size:13px; opacity:0.8; margin-bottom:14px; line-height:1.5;">
            รองรับ <strong>YouTube, YouTube Shorts, Google Drive, TikTok, Vimeo, Giphy</strong> และลิงก์รูปภาพ / วิดีโอทั่วไป
          </p>
          <div style="margin-bottom:16px;">
            <input type="text" id="refboard-link-input" placeholder="วางลิงก์ที่นี่ (https://...)" class="refboard-link-input-el">
          </div>
          <div class="cg-modal-actions" style="margin-top:10px;">
            <button class="cg-modal-btn cg-modal-btn-cancel" id="refboard-link-cancel-btn">ยกเลิก</button>
            <button class="cg-modal-btn cg-modal-btn-confirm" id="refboard-link-submit-btn" style="background:var(--text, #f0f0f0); color:var(--bg, #0d0d0d); font-weight:700;">ตกลงนำเข้า</button>
          </div>
        </div>
      </div>

      <!-- Hidden File Inputs -->
      <input type="file" id="refboard-file-import" class="refboard-file-input" accept="image/*,video/*,.gif,.mp4,.webm,.mov,.m4v,.ogg,.svg,.ai,.eps,.pdf,.psd,.refboard,.json,application/illustrator,application/postscript,image/svg+xml,application/pdf" multiple>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Cache Elements
    modalEl = document.getElementById('refboard-modal');
    headerEl = document.getElementById('refboard-header');
    viewportEl = document.getElementById('refboard-viewport');
    canvasEl = document.getElementById('refboard-canvas');
    emptyHintEl = document.getElementById('refboard-empty-hint');
    dropOverlayEl = document.getElementById('refboard-drop-overlay');
    importFileInput = document.getElementById('refboard-file-import');
    addFileInput = importFileInput;
    exportModalEl = document.getElementById('refboard-export-backdrop');
    alertModalEl = document.getElementById('refboard-alert-backdrop');
    arrangeModalEl = document.getElementById('refboard-arrange-backdrop');
    linkModalEl = document.getElementById('refboard-link-backdrop');
    linkInputEl = document.getElementById('refboard-link-input');

    if (emptyHintEl) {
      emptyHintEl.style.cursor = 'pointer';
      emptyHintEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (importFileInput) importFileInput.click();
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
    setupLinkModal();
    setupResize();
    setupGroupEvents();

    resetViewport();
  }

  // Helper Custom Alert Dialog
  function showRefAlert(title, message) {
    const titleEl = document.getElementById('refboard-alert-title');
    const msgEl = document.getElementById('refboard-alert-msg');
    const actionsEl = document.getElementById('refboard-alert-actions');
    const iconEl = document.getElementById('refboard-alert-icon');

    if (iconEl) iconEl.textContent = 'ℹ️';
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.innerHTML = message;

    actionsEl.style.flexDirection = 'row';
    actionsEl.style.width = '100%';
    actionsEl.style.gap = '12px';

    actionsEl.innerHTML = `
      <button class="cg-modal-btn cg-modal-btn-primary" id="refboard-alert-close-btn">ตกลง</button>
    `;

    alertModalEl.classList.add('open');
    document.getElementById('refboard-alert-close-btn').onclick = () => {
      alertModalEl.classList.remove('open');
    };
  }

  // Helper Custom Confirm Dialog
  function showRefConfirm(title, message, onConfirm, onCancel, confirmText = 'ตกลง', cancelText = 'ยกเลิก', isDanger = false) {
    const titleEl = document.getElementById('refboard-alert-title');
    const msgEl = document.getElementById('refboard-alert-msg');
    const actionsEl = document.getElementById('refboard-alert-actions');
    const iconEl = document.getElementById('refboard-alert-icon');

    if (iconEl) iconEl.textContent = isDanger ? '⚠️' : '❓';
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.innerHTML = message;

    const confirmClass = isDanger ? 'cg-modal-btn cg-modal-btn-confirm' : 'cg-modal-btn cg-modal-btn-primary';

    actionsEl.style.flexDirection = 'row';
    actionsEl.style.width = '100%';
    actionsEl.style.gap = '12px';

    actionsEl.innerHTML = `
      <button class="cg-modal-btn cg-modal-btn-cancel" id="refboard-alert-cancel-btn">${cancelText}</button>
      <button class="${confirmClass}" id="refboard-alert-confirm-btn">${confirmText}</button>
    `;

    alertModalEl.classList.add('open');

    document.getElementById('refboard-alert-cancel-btn').onclick = () => {
      alertModalEl.classList.remove('open');
      if (onCancel) onCancel();
    };
    document.getElementById('refboard-alert-confirm-btn').onclick = () => {
      alertModalEl.classList.remove('open');
      if (onConfirm) onConfirm();
    };
  }

  // Append / Merge imported items into current board without deleting existing items
  function appendRefBoardItems(itemsList, targetX = null, targetY = null) {
    if (!itemsList || itemsList.length === 0) return;
    pushUndoState();

    let minX = Infinity, minY = Infinity;
    itemsList.forEach((it) => {
      minX = Math.min(minX, it.x);
      minY = Math.min(minY, it.y);
    });

    const hasTarget = targetX !== null && targetY !== null;
    const offsetX = hasTarget ? (targetX - minX) : 0;
    const offsetY = hasTarget ? (targetY - minY) : 0;

    const newIds = [];
    itemsList.forEach((it, idx) => {
      const newId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5) + '_' + idx;
      const newItem = {
        ...it,
        id: newId,
        x: it.x + offsetX,
        y: it.y + offsetY,
        zIndex: ++nextZIndex
      };
      createRefImageItem(newItem);
      newIds.push(newId);
    });

    deselectAll();
    newIds.forEach((id) => selectItem(id, true));
    updateItemCount();
    showToast(`✨ รวมรูปภาพกระดานเรฟ (${itemsList.length} รูป) เข้ากับกระดานเดิมแล้ว!`);
  }

  // Replace Entire Board with imported board data
  function replaceRefBoard(boardData) {
    pushUndoState();
    clearBoard();
    if (boardData.panX !== undefined) panX = boardData.panX;
    if (boardData.panY !== undefined) panY = boardData.panY;
    if (boardData.zoom !== undefined) zoom = boardData.zoom;
    updateTransform();

    (boardData.items || []).forEach((item) => {
      createRefImageItem(item);
      if (item.zIndex > nextZIndex) nextZIndex = item.zIndex;
    });
    deselectAll();
    updateItemCount();
    showToast('✨ เปิดกระดานเรฟเรียบร้อย!');
  }

  // Smart RefBoard Import Choice Modal
  function showSmartRefBoardImportModal(boardData, file, targetX, targetY, isImage = true) {
    const titleEl = document.getElementById('refboard-alert-title');
    const msgEl = document.getElementById('refboard-alert-msg');
    const actionsEl = document.getElementById('refboard-alert-actions');
    const iconEl = document.getElementById('refboard-alert-icon');

    if (iconEl) iconEl.textContent = '✨';
    if (titleEl) titleEl.textContent = `พบกระดานเรฟ (${(boardData.items || []).length} รูป)`;
    if (msgEl) {
      msgEl.innerHTML = `
        กระดานปัจจุบันมีรูปภาพอยู่แล้ว <strong>(${itemsMap.size} รูป)</strong><br>
        <span style="font-size: 13px; color: var(--text2, #94a3b8); margin-top: 6px; display: block;">คุณต้องการเปิดใช้งานแบบใด?</span>
      `;
    }

    if (actionsEl) {
      actionsEl.style.flexDirection = 'column';
      actionsEl.style.width = '100%';
      actionsEl.style.gap = '10px';

      actionsEl.innerHTML = `
        <button class="cg-modal-btn cg-modal-btn-primary" id="ref-smart-append-btn" style="width: 100%; padding: 12px; font-size: 14px; font-weight: 700; border-radius: 12px;">รวมเข้ากระดานเดิม</button>
        <button class="cg-modal-btn cg-modal-btn-secondary" id="ref-smart-replace-btn" style="width: 100%; padding: 12px; font-size: 14px; font-weight: 700; border-radius: 12px;">แทนที่กระดานเดิม</button>
        ${isImage ? `<button class="cg-modal-btn cg-modal-btn-secondary" id="ref-smart-normal-btn" style="width: 100%; padding: 12px; font-size: 14px; font-weight: 700; border-radius: 12px;">วางเป็นรูปภาพธรรมดา</button>` : ''}
        <button class="cg-modal-btn cg-modal-btn-cancel" id="ref-smart-cancel-btn" style="width: 100%; padding: 11px; font-size: 14px; font-weight: 700; border-radius: 12px;">ยกเลิก</button>
      `;
    }

    if (alertModalEl) alertModalEl.classList.add('open');

    const cancelBtn = document.getElementById('ref-smart-cancel-btn');
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        if (alertModalEl) alertModalEl.classList.remove('open');
      };
    }

    if (isImage) {
      const normalBtn = document.getElementById('ref-smart-normal-btn');
      if (normalBtn) {
        normalBtn.onclick = () => {
          if (alertModalEl) alertModalEl.classList.remove('open');
          importMultipleImageFiles([file], targetX, targetY);
        };
      }
    }

    const replaceBtn = document.getElementById('ref-smart-replace-btn');
    if (replaceBtn) {
      replaceBtn.onclick = () => {
        if (alertModalEl) alertModalEl.classList.remove('open');
        replaceRefBoard(boardData);
      };
    }

    const appendBtn = document.getElementById('ref-smart-append-btn');
    if (appendBtn) {
      appendBtn.onclick = () => {
        if (alertModalEl) alertModalEl.classList.remove('open');
        appendRefBoardItems(boardData.items, targetX, targetY);
      };
    }
  }

  // Helper: check if desktop split-panel mode is active
  function isDesktop() {
    return window.innerWidth > 1024;
  }

  // Toggle Window Visibility & Push History State
  window.toggleRefBoard = function () {
    if (!modalEl) initRefBoardUI();
    if (pipWindow && !pipWindow.closed) {
      try { pipWindow.focus(); } catch (err) {}
      showToast('📌 กระดานเรฟกำลังลอยอยู่หน้าจอ (Always on Top)');
      return;
    }
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
      if (window.updateColorPaletteSplitLayout) window.updateColorPaletteSplitLayout();
      if (window._refboardUpdateHandle) window._refboardUpdateHandle();
    } else {
      closeRefBoardInternal();
    }
  };

  function closeRefBoardInternal(fromUserAction = false) {
    if (pipWindow && !pipWindow.closed) {
      pipWindow.close();
    }
    if (!isModalOpen) return;
    isModalOpen = false;
    if (modalEl) modalEl.classList.remove('open');
    if (exportModalEl) exportModalEl.classList.remove('open');
    if (alertModalEl) alertModalEl.classList.remove('open');
    if (arrangeModalEl) arrangeModalEl.classList.remove('open');
    if (linkModalEl) linkModalEl.classList.remove('open');
    // Remove split-panel class
    const toolsPage = document.getElementById('page-tools');
    if (toolsPage) toolsPage.classList.remove('refboard-split');
    deselectAll();
    if (window.updateColorPaletteSplitLayout) window.updateColorPaletteSplitLayout();
    if (window._refboardUpdateHandle) window._refboardUpdateHandle();

    if (fromUserAction && history.state && history.state.refBoardModalOpen) {
      history.back();
    }
  }

  // Handle Browser Back Button (popstate)
  window.addEventListener('popstate', () => {
    if (linkModalEl && linkModalEl.classList.contains('open')) {
      linkModalEl.classList.remove('open');
      return;
    }
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

  // Active Window Event Helpers (Handles both Main Window & Picture-in-Picture Window)
  function addActiveWindowListener(event, handler, options) {
    window.addEventListener(event, handler, options);
    if (pipWindow && !pipWindow.closed) {
      pipWindow.addEventListener(event, handler, options);
    }
  }

  function removeActiveWindowListener(event, handler, options) {
    window.removeEventListener(event, handler, options);
    if (pipWindow && !pipWindow.closed) {
      pipWindow.removeEventListener(event, handler, options);
    }
  }

  function handleGlobalMouseMove(e) {
    if (!isModalOpen) return;

    if (isPanning) {
      panX = e.clientX - startPanX;
      panY = e.clientY - startPanY;
      updateTransform();
    } else if (isMarqueeSelecting) {
      const rect = viewportEl.getBoundingClientRect();
      const curCanvasX = (e.clientX - rect.left - panX) / zoom;
      const curCanvasY = (e.clientY - rect.top - panY) / zoom;

      const rectX = Math.min(marqueeStartX, curCanvasX);
      const rectY = Math.min(marqueeStartY, curCanvasY);
      const rectW = Math.abs(curCanvasX - marqueeStartX);
      const rectH = Math.abs(curCanvasY - marqueeStartY);

      const marqueeBoxEl = document.getElementById('refboard-marquee-box');
      if (marqueeBoxEl) {
        marqueeBoxEl.style.transform = `translate(${rectX}px, ${rectY}px)`;
        marqueeBoxEl.style.width = `${rectW}px`;
        marqueeBoxEl.style.height = `${rectH}px`;
      }

      itemsMap.forEach((it) => {
        const rotDeg = it.rotation || 0;
        const rotRad = (rotDeg * Math.PI) / 180;
        const cos = Math.abs(Math.cos(rotRad));
        const sin = Math.abs(Math.sin(rotRad));
        const boundingW = it.width * cos + it.height * sin;
        const boundingH = it.width * sin + it.height * cos;
        const centerShiftX = (it.width - boundingW) / 2;
        const centerShiftY = (it.height - boundingH) / 2;
        const itemL = it.x + centerShiftX;
        const itemT = it.y + centerShiftY;
        const itemR = itemL + boundingW;
        const itemB = itemT + boundingH;

        const intersects = !(itemR < rectX || itemL > rectX + rectW || itemB < rectY || itemT > rectY + rectH);
        const el = it.el || document.getElementById(it.id);

        if (intersects) {
          selectedItemIds.add(it.id);
          if (el) el.classList.add('selected');
        } else if (!e.shiftKey) {
          selectedItemIds.delete(it.id);
          if (el) el.classList.remove('selected');
        }
      });

      selectedItemId = selectedItemIds.size > 0 ? (selectedItemIds.has(selectedItemId) ? selectedItemId : Array.from(selectedItemIds)[0]) : null;
      updateSelectionBox();
    }
  }

  function handleGlobalMouseUp() {
    if (isPanning) {
      isPanning = false;
      viewportEl.classList.remove('panning');
    }
    if (isMarqueeSelecting) {
      isMarqueeSelecting = false;
      const marqueeBoxEl = document.getElementById('refboard-marquee-box');
      if (marqueeBoxEl) marqueeBoxEl.classList.remove('active');
      updateSelectionBox();
    }
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
      if (e.pointerType === 'touch') return;

      const isItemOrControl = Boolean(
        e.target.closest('.ref-item') ||
        e.target.closest('.ref-item-toolbar') ||
        e.target.closest('.ref-handle') ||
        e.target.closest('.refboard-top-bar') ||
        e.target.closest('.refboard-footer') ||
        e.target.closest('.cg-modal')
      );
      const isBg = !isItemOrControl && (e.target === viewportEl || e.target === canvasEl || Boolean(e.target.closest('#refboard-viewport')));
      const isShift = e.shiftKey || false;

      if (spacePressed || e.button === 1 || (isBg && !isShift && e.button === 0 && e.altKey)) {
        // Pan Canvas Viewport
        if (e.button === 0 || e.button === 1) {
          isPanning = true;
          startPanX = e.clientX - panX;
          startPanY = e.clientY - panY;
          viewportEl.classList.add('panning');
          if (selectedItemId && isBg) deselectAll();
        }
      } else if (e.button === 0 && (isShift || isBg)) {
        // Marquee Drag Selection Box (Shift + Drag OR Drag on Empty Background)
        e.preventDefault();
        isMarqueeSelecting = true;

        const rect = viewportEl.getBoundingClientRect();
        marqueeStartX = (e.clientX - rect.left - panX) / zoom;
        marqueeStartY = (e.clientY - rect.top - panY) / zoom;

        if (!isShift) {
          deselectAll();
        }

        const marqueeBoxEl = document.getElementById('refboard-marquee-box');
        if (marqueeBoxEl) {
          marqueeBoxEl.style.transform = `translate(${marqueeStartX}px, ${marqueeStartY}px)`;
          marqueeBoxEl.style.width = '0px';
          marqueeBoxEl.style.height = '0px';
          marqueeBoxEl.classList.add('active');
        }
      }
    });

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

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
    function onDragOver(e) {
      if (!isModalOpen) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      if (dropOverlayEl && !dropOverlayEl.classList.contains('active')) {
        dropOverlayEl.classList.add('active');
      }
    }

    function onDragLeave(e) {
      if (!isModalOpen) return;
      if (!e.relatedTarget || (modalEl && !modalEl.contains(e.relatedTarget))) {
        if (dropOverlayEl) dropOverlayEl.classList.remove('active');
      }
    }

    function onDrop(e) {
      if (!isModalOpen) return;
      e.preventDefault();
      e.stopPropagation();

      if (dropOverlayEl) dropOverlayEl.classList.remove('active');

      const files = e.dataTransfer ? e.dataTransfer.files : null;
      if (!files || files.length === 0) return;

      const rect = viewportEl ? viewportEl.getBoundingClientRect() : { left: 0, top: 0 };
      const dropX = (e.clientX - rect.left - panX) / zoom;
      const dropY = (e.clientY - rect.top - panY) / zoom;
      handleFiles(files, dropX, dropY);
    }

    modalEl.addEventListener('dragenter', onDragOver);
    modalEl.addEventListener('dragover', onDragOver);
    modalEl.addEventListener('dragleave', onDragLeave);
    modalEl.addEventListener('drop', onDrop);

    viewportEl.addEventListener('dragenter', onDragOver);
    viewportEl.addEventListener('dragover', onDragOver);
    viewportEl.addEventListener('dragleave', onDragLeave);
    viewportEl.addEventListener('drop', onDrop);
  }

  // Copy / Cut / Paste Handling
  function handleGlobalPaste(e) {
    if (!isModalOpen) return;
    const isInput = e.target && (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable
    );
    if (isInput) return;

    const clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData);
    if (!clipboardData) return;

    // 1. Check native clipboard files or image/video blobs FIRST
    const files = [];
    if (clipboardData.files && clipboardData.files.length > 0) {
      for (let i = 0; i < clipboardData.files.length; i++) {
        files.push(clipboardData.files[i]);
      }
    }

    if (files.length === 0 && clipboardData.items && clipboardData.items.length > 0) {
      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i];
        if (item && (item.type.indexOf('image') !== -1 || item.type.indexOf('video') !== -1 || item.kind === 'file')) {
          const blob = item.getAsFile();
          if (blob) files.push(blob);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      handleFiles(files);
      return;
    }

    // 2. Check if user pasted a Web / Social Media URL
    const pastedText = (clipboardData.getData && clipboardData.getData('text/plain')) || '';
    const trimmedUrl = (pastedText || '').trim();
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('data:image') || trimmedUrl.startsWith('data:video')) {
      e.preventDefault();
      e.stopPropagation();
      importUrlToRefBoard(trimmedUrl);
      return;
    }

    // 3. Internal clipboard paste (Ctrl+C / Ctrl+V within board)
    if (internalClipboard.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      pasteInternalClipboard();
    }
  }

  function setupPasteHandler() {
    window.addEventListener('paste', handleGlobalPaste);
    window.addEventListener('message', handleYouTubeWindowMessage);
  }

  // Select All Items on Board
  function selectAllItems() {
    if (itemsMap.size === 0) return;
    itemsMap.forEach((it, id) => {
      selectedItemIds.add(id);
      const el = it.el || document.getElementById(id);
      if (el) el.classList.add('selected');
    });
    selectedItemId = selectedItemIds.size > 0 ? Array.from(selectedItemIds)[0] : null;
    updateSelectionBox();
  }

  // Keyboard Shortcuts (Bilingual Thai/English Physical Key Code Support)
  function handleGlobalKeyDown(e) {
    if (!isModalOpen) return;

    const isInput = e.target && (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable
    );
    if (isInput) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const key = (e.key || '').toLowerCase();
    const code = e.code || '';

    if (isCtrlOrCmd) {
      // Ctrl + Z / Cmd + Z -> Undo (or Redo if Shift is held)
      if (code === 'KeyZ' || key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      // Ctrl + Y / Cmd + Y -> Redo
      if (code === 'KeyY' || key === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl + C / Cmd + C -> Copy Selected Items
      if (code === 'KeyC' || key === 'c') {
        if (selectedItemIds.size > 0) {
          e.preventDefault();
          copySelectedItems();
        }
        return;
      }

      // Ctrl + X / Cmd + X -> Cut Selected Items
      if (code === 'KeyX' || key === 'x') {
        if (selectedItemIds.size > 0) {
          e.preventDefault();
          cutSelectedItems();
        }
        return;
      }

      // Ctrl + V / Cmd + V -> Paste Items
      if (code === 'KeyV' || key === 'v') {
        if (internalClipboard.length > 0) {
          e.preventDefault();
          pasteInternalClipboard();
        }
        return;
      }

      // Ctrl + A / Cmd + A -> Select All Items
      if (code === 'KeyA' || key === 'a') {
        e.preventDefault();
        selectAllItems();
        return;
      }
    }

    // Space Key -> Canvas Panning Mode
    if (code === 'Space' || key === ' ' || e.keyCode === 32) {
      e.preventDefault();
      if (!spacePressed) {
        spacePressed = true;
        viewportEl.classList.add('panning');
      }
    }

    // Delete / Backspace Key -> Delete Selected Items
    if (code === 'Delete' || code === 'Backspace' || key === 'delete' || key === 'backspace') {
      if (selectedItemId || selectedItemIds.size > 0) {
        e.preventDefault();
        deleteItem(selectedItemId || Array.from(selectedItemIds)[0]);
      }
    }

    // Escape Key -> Deselect / Close Modals
    if (code === 'Escape' || key === 'escape') {
      e.preventDefault();
      if (alertModalEl && alertModalEl.classList.contains('open')) {
        alertModalEl.classList.remove('open');
      } else if (exportModalEl && exportModalEl.classList.contains('open')) {
        closeExportModal();
      } else if (selectedItemId || selectedItemIds.size > 0) {
        deselectAll();
      } else {
        toggleRefBoard();
      }
    }
  }

  function handleGlobalKeyUp(e) {
    if (!isModalOpen) return;
    const code = e.code || '';
    const key = (e.key || '').toLowerCase();

    if (code === 'Space' || key === ' ' || e.keyCode === 32) {
      e.preventDefault();
      spacePressed = false;
      if (!isPanning) viewportEl.classList.remove('panning');
    }
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
  }

  // ═══ DOCUMENT PICTURE-IN-PICTURE (ALWAYS ON TOP) ═══
  async function toggleAlwaysOnTop() {
    // 1. If PiP is already open, close it to return to main tab
    if (pipWindow && !pipWindow.closed) {
      pipWindow.close();
      return;
    }

    // 2. Check Document Picture-in-Picture API support
    if (!('documentPictureInPicture' in window)) {
      showRefConfirm(
        'หน้าต่างลอยนอกจอ',
        'เบราว์เซอร์นี้ยังไม่รองรับการแยกหน้าต่างลอยออกมานอกหน้าจอครับ<br><br>' +
        '💡 <strong>คำแนะนำ:</strong><br>' +
        '• แนะนำให้เปิดใช้งานผ่าน <strong>Google Chrome</strong> หรือ <strong>Microsoft Edge</strong> บนคอมพิวเตอร์<br>' +
        '• หรือสามารถใช้ <strong>หน้าต่างลอยบนหน้าเว็บ</strong> เพื่อลากย้ายและปรับขนาดบนหน้านี้ได้ตามปกติครับ<br><br>' +
        'ต้องการเปิดใช้งานโหมดหน้าต่างลอยบนหน้าเว็บแทนหรือไม่?',
        () => {
          fallbackToggleFloatingMode();
        },
        null,
        'ใช้หน้าต่างลอยบนหน้าเว็บ',
        'ปิด'
      );
      return;
    }

    try {
      const pipW = Math.min(880, Math.round(window.innerWidth * 0.85));
      const pipH = Math.min(640, Math.round(window.innerHeight * 0.85));

      pipWindow = await window.documentPictureInPicture.requestWindow({
        width: pipW,
        height: pipH,
      });

      // Copy Stylesheets & Style tags
      copyStylesToPip(pipWindow);

      // Setup PiP Window Document
      pipWindow.document.title = 'กระดานเรฟ (Always on Top)';
      const mainTheme = window.document.documentElement.getAttribute('data-theme') || 'dark';
      pipWindow.document.documentElement.setAttribute('data-theme', mainTheme);
      pipWindow.document.documentElement.className = window.document.documentElement.className;
      pipWindow.document.body.className = window.document.body.className;
      if (isWhiteBg) {
        pipWindow.document.body.classList.add('bg-white-mode');
      }

      // Sync theme live when user toggles theme on main page
      if (pipThemeObserver) {
        pipThemeObserver.disconnect();
        pipThemeObserver = null;
      }
      pipThemeObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && (m.attributeName === 'data-theme' || m.attributeName === 'class')) {
            if (pipWindow && !pipWindow.closed) {
              const curTheme = window.document.documentElement.getAttribute('data-theme') || 'dark';
              pipWindow.document.documentElement.setAttribute('data-theme', curTheme);
              pipWindow.document.documentElement.className = window.document.documentElement.className;
            }
            break;
          }
        }
      });
      pipThemeObserver.observe(window.document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

      // Bridge global functions for PiP scope
      pipWindow.toggleColorPalette = () => {
        if (typeof window.toggleColorPalette === 'function') window.toggleColorPalette();
      };
      pipWindow.showToast = (msg, icon) => {
        if (typeof window.showToast === 'function') window.showToast(msg, icon);
      };
      pipWindow.toggleRefBoard = () => {
        if (typeof window.toggleRefBoard === 'function') window.toggleRefBoard();
      };

      // Placeholders before moving DOM
      pipPlaceholders = [];
      const dialogsToMove = [
        modalEl,
        exportModalEl,
        window.document.getElementById('refboard-export-loading-backdrop'),
        alertModalEl,
        arrangeModalEl,
        linkModalEl,
        importFileInput
      ].filter(Boolean);

      dialogsToMove.forEach((el) => {
        if (el && el.parentNode) {
          const ph = window.document.createComment(`pip-ph-${el.id || 'el'}`);
          el.parentNode.insertBefore(ph, el);
          pipPlaceholders.push({ el, ph });
        }
      });

      // Move into PiP document
      modalEl.classList.add('pip-mode');
      modalEl.classList.add('open');
      dialogsToMove.forEach((el) => {
        if (el) pipWindow.document.body.appendChild(el);
      });

      // Remove split layout on main desktop page while PiP is active
      const toolsPage = window.document.getElementById('page-tools');
      if (toolsPage) {
        toolsPage.classList.remove('refboard-split');
      }

      // Update button UI & sync button states
      updateFloatBtnPipState(true);
      updateUndoRedoUI();
      updateItemCount();
      updateActionsToggleUI();

      // Bind global event listeners to pipWindow
      pipWindow.addEventListener('mousemove', handleGlobalMouseMove);
      pipWindow.addEventListener('mouseup', handleGlobalMouseUp);
      pipWindow.addEventListener('keydown', handleGlobalKeyDown);
      pipWindow.addEventListener('keyup', handleGlobalKeyUp);
      pipWindow.addEventListener('paste', handleGlobalPaste);
      pipWindow.addEventListener('message', handleYouTubeWindowMessage);

      // Drag and drop into PiP window
      pipWindow.addEventListener('dragenter', (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (dropOverlayEl) dropOverlayEl.classList.add('active');
      });
      pipWindow.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      });
      pipWindow.addEventListener('dragleave', (e) => {
        if (!e.relatedTarget) {
          if (dropOverlayEl) dropOverlayEl.classList.remove('active');
        }
      });
      pipWindow.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropOverlayEl) dropOverlayEl.classList.remove('active');
        const files = e.dataTransfer ? e.dataTransfer.files : null;
        if (files && files.length > 0) {
          const rect = viewportEl ? viewportEl.getBoundingClientRect() : { left: 0, top: 0 };
          const dropX = (e.clientX - rect.left - panX) / zoom;
          const dropY = (e.clientY - rect.top - panY) / zoom;
          handleFiles(files, dropX, dropY);
        }
      });

      pipWindow.addEventListener('resize', () => {
        fitBoardToViewport();
      });

      // Handle close of PiP window (either from OS 'X' or pipWindow.close())
      pipWindow.addEventListener('pagehide', () => {
        restoreFromPip();
      });

      setTimeout(() => {
        fitBoardToViewport();
      }, 60);

      showToast('📌 แยกกระดานเรฟลอยหน้าจอแล้ว');
    } catch (err) {
      console.error('Document PiP Error:', err);
      pipWindow = null;

      let friendlyReason = 'เบราว์เซอร์ไม่อนุญาตให้แยกหน้าต่างลอยออกมานอกจอได้ในขณะนี้ครับ';
      const errMsg = (err && err.message) ? err.message : '';
      if (errMsg.includes('top-level browsing context')) {
        friendlyReason = 'ไม่สามารถแยกหน้าต่างลอยได้ เนื่องจากหน้าเว็บกำลังเปิดซ้อนอยู่ภายในโปรแกรมหรือหน้าต่างอื่นครับ แนะนำให้เปิดใช้งานผ่านเบราว์เซอร์โดยตรง';
      }

      showRefConfirm(
        'เปิดหน้าต่างลอยไม่สำเร็จ',
        `${friendlyReason}<br><br>` +
        '💡 <strong>คุณยังสามารถใช้หน้าต่างลอยบนหน้าเว็บนี้ได้:</strong><br>' +
        'สามารถลาก ย้ายตำแหน่ง และปรับขนาดย่อ-ขยายบนหน้าเว็บนี้ได้ตามปกติครับ<br><br>' +
        'ต้องการเปิดใช้งานโหมดหน้าต่างลอยบนหน้าเว็บแทนหรือไม่?',
        () => {
          fallbackToggleFloatingMode();
        },
        null,
        'ใช้หน้าต่างลอยบนหน้าเว็บ',
        'ปิด'
      );
    }
  }

  // Restore elements back to main page
  function restoreFromPip() {
    if (!pipWindow) return;
    pipWindow = null;

    if (pipThemeObserver) {
      pipThemeObserver.disconnect();
      pipThemeObserver = null;
    }

    modalEl.classList.remove('pip-mode');

    if (pipPlaceholders && pipPlaceholders.length > 0) {
      pipPlaceholders.forEach(({ el, ph }) => {
        if (ph && ph.parentNode) {
          ph.parentNode.insertBefore(el, ph);
          ph.remove();
        } else {
          window.document.body.appendChild(el);
        }
      });
      pipPlaceholders = [];
    } else {
      window.document.body.appendChild(modalEl);
    }

    const toolsPage = window.document.getElementById('page-tools');
    if (toolsPage && isDesktop() && isModalOpen) {
      toolsPage.classList.add('refboard-split');
    }

    updateFloatBtnPipState(false);
    updateUndoRedoUI();
    updateItemCount();
    updateActionsToggleUI();

    setTimeout(() => {
      fitBoardToViewport();
    }, 60);

    showToast('↩️ ดึงกระดานเรฟกลับเข้าหน้าเว็บเรียบร้อย');
  }

  // Copy stylesheets & styles to PiP window
  function copyStylesToPip(targetWin) {
    const doc = targetWin.document;

    // 1. Copy font preconnects
    window.document.querySelectorAll('link[rel="preconnect"], link[rel="preload"]').forEach((link) => {
      doc.head.appendChild(link.cloneNode(true));
    });

    // 2. Copy link stylesheets
    window.document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const newLink = doc.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = link.href;
      if (link.media) newLink.media = link.media;
      doc.head.appendChild(newLink);
    });

    // 3. Copy all style elements across document (head and body)
    window.document.querySelectorAll('style').forEach((st) => {
      doc.head.appendChild(st.cloneNode(true));
    });

    // 4. Copy dynamic stylesheet rules
    [...window.document.styleSheets].forEach((sheet) => {
      try {
        if (sheet.href) return;
        if (sheet.ownerNode && sheet.ownerNode.tagName === 'STYLE') return;
        if (sheet.cssRules) {
          const style = doc.createElement('style');
          style.textContent = [...sheet.cssRules].map((r) => r.cssText).join('\n');
          doc.head.appendChild(style);
        }
      } catch (e) {
        // Cross-origin restriction ignored
      }
    });

    // 5. Inject Referrer Policy Meta tag to authorize YouTube and media embeds in PiP window
    const metaRef = doc.createElement('meta');
    metaRef.name = 'referrer';
    metaRef.content = 'strict-origin-when-cross-origin';
    doc.head.appendChild(metaRef);

    // 6. Inject PiP specific layout styles
    const pipStyle = doc.createElement('style');
    pipStyle.textContent = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        background: var(--bg2, #161616) !important;
      }
      body.bg-white-mode {
        background: #ffffff !important;
      }
      .refboard-modal.pip-mode {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        transform: none !important;
        display: flex !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        z-index: 100 !important;
      }
      .refboard-modal.pip-mode #refboard-header {
        cursor: default !important;
      }
      .refboard-modal.pip-mode .ref-modal-handle {
        display: none !important;
      }
      .refboard-modal.pip-mode #refboard-max-btn {
        display: none !important;
      }
      .refboard-modal.pip-mode .ref-footer-brand {
        display: none !important;
      }
      .refboard-modal.pip-mode .refboard-footer {
        white-space: nowrap !important;
        overflow: hidden !important;
        margin: 0 !important;
        border-radius: 0 !important;
        border-top: 1px solid var(--line, #2a2a2a) !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
        line-height: normal !important;
      }
      .refboard-modal.pip-mode .refboard-kbd {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 5px !important;
        height: 18px !important;
        line-height: 18px !important;
        border-radius: 4px !important;
        background: var(--bg3, #1e1e1e) !important;
        border: 1px solid var(--line2, #333) !important;
        font-family: inherit !important;
        font-size: 11px !important;
        box-sizing: border-box !important;
        margin: 0 2px !important;
      }
    `;
    doc.head.appendChild(pipStyle);
  }

  // Update button visual state when PiP toggles
  function updateFloatBtnPipState(isPip) {
    const floatBtn = document.getElementById('refboard-float-btn');
    if (!floatBtn) return;
    floatBtn.classList.toggle('active', isPip);
    if (isPip) {
      floatBtn.title = 'ดึงกระดานเรฟกลับเข้าหน้าเว็บ';
      floatBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      `;
    } else {
      floatBtn.title = 'แยกหน้าต่างลอยนอกจอ (Always on Top)';
      floatBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="3" ry="3"></rect>
          <rect x="11" y="11" width="9" height="9" rx="1.5" ry="1.5" fill="currentColor" opacity="0.3"></rect>
          <path d="M11 15h9"></path>
          <path d="M15 11v9"></path>
        </svg>
      `;
    }
  }

  // Fallback In-Page Floating Mode
  function fallbackToggleFloatingMode() {
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

    const floatBtn = document.getElementById('refboard-float-btn');
    if (isFloatingMode) {
      if (floatBtn) {
        floatBtn.classList.add('active');
        floatBtn.title = 'สลับกลับเป็น Split-Panel';
      }
      const defaultW = Math.min(760, Math.round(window.innerWidth * 0.8));
      const defaultH = Math.min(540, Math.round(window.innerHeight * 0.8));
      modalEl.style.left = `${Math.max(20, Math.round((window.innerWidth - defaultW) / 2))}px`;
      modalEl.style.top = '80px';
      modalEl.style.width = `${defaultW}px`;
      modalEl.style.height = `${defaultH}px`;
    } else {
      if (floatBtn) {
        floatBtn.classList.remove('active');
        floatBtn.title = 'ลอยหน้าต่างเสมอ (Always on Top / PiP)';
      }
      modalEl.style.left = '';
      modalEl.style.top = '';
      modalEl.style.width = '';
      modalEl.style.height = '';
    }
  }

  // Action Buttons
  function setupActionButtons() {
    const closeBtn = document.getElementById('refboard-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (pipWindow && !pipWindow.closed) {
          pipWindow.close();
        }
        closeRefBoardInternal(true);
      });
    }

    const maxBtn = document.getElementById('refboard-max-btn');
    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        isMaximized = !isMaximized;
        modalEl.classList.toggle('maximized', isMaximized);
      });
    }

    const floatBtn = document.getElementById('refboard-float-btn');
    if (floatBtn) {
      floatBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        toggleAlwaysOnTop();
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

    const paletteToggleBtn = document.getElementById('refboard-palette-toggle-btn');
    if (paletteToggleBtn) {
      paletteToggleBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (typeof window.toggleColorPalette === 'function') {
          window.toggleColorPalette();
        }
      });
    }

    const bgBtn = document.getElementById('refboard-bg-btn');
    if (bgBtn) {
      bgBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        isWhiteBg = !isWhiteBg;
        bgBtn.classList.toggle('active', isWhiteBg);
        if (viewportEl) viewportEl.classList.toggle('bg-white-mode', isWhiteBg);
        if (pipWindow && !pipWindow.closed) {
          pipWindow.document.body.classList.toggle('bg-white-mode', isWhiteBg);
        }
        const bgText = document.getElementById('refboard-bg-text');
        if (bgText) bgText.textContent = isWhiteBg ? 'พื้นหลัง: ขาว' : 'พื้นหลัง: ธีม';
      });
    }

    const gridBtn = document.getElementById('refboard-grid-btn');
    if (gridBtn) {
      gridBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        isGridEnabled = !isGridEnabled;
        gridBtn.classList.toggle('active', isGridEnabled);
        if (viewportEl) viewportEl.classList.toggle('grid-active', isGridEnabled);
        const gridText = document.getElementById('refboard-grid-text');
        if (gridText) gridText.textContent = isGridEnabled ? 'กริด: เปิด' : 'กริด: ปิด';
      });
    }

    const undoBtn = document.getElementById('refboard-undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        undo();
      });
    }

    const redoBtn = document.getElementById('refboard-redo-btn');
    if (redoBtn) {
      redoBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        redo();
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

    const importBtn = document.getElementById('refboard-import-btn');
    if (importBtn && importFileInput) {
      importBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        importFileInput.click();
      });
    }
    if (importFileInput) {
      importFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
        e.target.value = '';
      });
    }

    const exportBtn = document.getElementById('refboard-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (itemsMap.size === 0) {
          showRefAlert('กระดานเรฟว่างเปล่า', 'ยังไม่มีรูปภาพบนกระดานเรฟ ไม่สามารถส่งออกไฟล์ได้ กรุณาเพิ่มรูปภาพก่อนครับ');
          return;
        }
        openExportModal();
      });
    }

    const clearBtn = document.getElementById('refboard-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (itemsMap.size === 0) {
          showRefAlert('กระดานเรฟว่างเปล่า', 'ไม่มีรูปภาพบนกระดานเรฟให้ล้างครับ');
          return;
        }
        showRefConfirm('ยืนยันการล้างกระดาน', `คุณต้องการล้างรูปภาพทั้งหมด (${itemsMap.size} รูป) บนกระดานเรฟใช่หรือไม่?`, () => {
          clearBoard();
        }, null, 'ล้างรูปทั้งหมด', 'ยกเลิก', true);
      });
    }
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

  // Helper: check if Reference Board is in Normal In-Page Mode (not PiP and not In-Page Floating Mode)
  function isBoardNormalMode() {
    const isPip = Boolean((pipWindow && !pipWindow.closed) || (modalEl && modalEl.classList.contains('pip-mode')));
    const isFloat = Boolean(isFloatingMode || (modalEl && modalEl.classList.contains('floating-mode')));
    return !isPip && !isFloat;
  }

  // ── YouTube Iframe PostMessage Controller ──
  function sendYouTubeCommand(iframeEl, command, args = []) {
    if (!iframeEl || !iframeEl.contentWindow) return;
    try {
      iframeEl.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: args
      }), '*');
    } catch (err) {}
  }

  function setupYouTubeIframeController(itemEl, itemData, iframeEl) {
    if (!iframeEl || itemData.embedType !== 'youtube') return;
    itemData.ytPlaying = false;
    itemData.ytMuted = false;

    const playPauseBtn = itemEl.querySelector('[data-act="yt-toggle-play"]');
    const muteBtn = itemEl.querySelector('[data-act="yt-toggle-mute"]');
    if (muteBtn) {
      muteBtn.textContent = '🔇 ปิดเสียง';
      muteBtn.title = 'คลิกเพื่อปิดเสียง';
    }

    function sendSoundOn() {
      if (!itemData.ytMuted) {
        sendYouTubeCommand(iframeEl, 'unMute');
        sendYouTubeCommand(iframeEl, 'setVolume', [100]);
        if (muteBtn) {
          muteBtn.textContent = '🔇 ปิดเสียง';
          muteBtn.title = 'คลิกเพื่อปิดเสียง';
        }
      }
    }

    iframeEl.addEventListener('load', () => {
      sendYouTubeCommand(iframeEl, 'listening');
      sendSoundOn();
      if (itemData.autoplay) {
        sendYouTubeCommand(iframeEl, 'playVideo');
      }
      setTimeout(sendSoundOn, 400);
      setTimeout(sendSoundOn, 1000);
      setTimeout(sendSoundOn, 2200);
    });
  }

  function handleYouTubeWindowMessage(e) {
    if (!e.data || typeof e.data !== 'string') return;
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (err) {
      return;
    }
    if (data.event === 'onReady') {
      itemsMap.forEach((item) => {
        if (item.embedType === 'youtube' && item.el) {
          const iframe = item.el.querySelector('iframe');
          if (iframe && iframe.contentWindow === e.source) {
            if (!item.ytMuted) {
              sendYouTubeCommand(iframe, 'unMute');
              sendYouTubeCommand(iframe, 'setVolume', [100]);
            }
            if (item.autoplay) {
              sendYouTubeCommand(iframe, 'playVideo');
            }
          }
        }
      });
      return;
    }
    if (data.event === 'infoDelivery' && data.info) {
      const info = data.info;
      itemsMap.forEach((item) => {
        if (item.embedType === 'youtube' && item.el) {
          const iframe = item.el.querySelector('iframe');
          if (iframe && iframe.contentWindow === e.source) {
            const playPauseBtn = item.el.querySelector('[data-act="yt-toggle-play"]');
            const muteBtn = item.el.querySelector('[data-act="yt-toggle-mute"]');

            if (typeof info.playerState !== 'undefined') {
              if (info.playerState === 1) {
                item.ytPlaying = true;
                if (playPauseBtn) playPauseBtn.textContent = '⏸️ พัก';
              } else if (info.playerState === 2) {
                item.ytPlaying = false;
                if (playPauseBtn) playPauseBtn.textContent = '▶️ เล่น';
              }
            }
            if (typeof info.muted !== 'undefined') {
              if (!item.ytMuted && info.muted) {
                sendYouTubeCommand(iframe, 'unMute');
                sendYouTubeCommand(iframe, 'setVolume', [100]);
              } else if (item.ytMuted) {
                if (muteBtn) {
                  muteBtn.textContent = '🔊 เปิดเสียง';
                  muteBtn.title = 'คลิกเพื่อเปิดเสียง';
                }
              }
            }
          }
        }
      });
    }
  }

  // ── Non-YouTube Video Player Controller (Scrubber, Play/Pause, Rewind/Forward 10s) ──
  function formatVideoTime(sec) {
    if (isNaN(sec) || !isFinite(sec) || sec < 0) sec = 0;
    const s = Math.floor(sec % 60);
    const m = Math.floor((sec / 60) % 60);
    const h = Math.floor(sec / 3600);
    const sStr = s < 10 ? '0' + s : s;
    if (h > 0) {
      const mStr = m < 10 ? '0' + m : m;
      return `${h}:${mStr}:${sStr}`;
    }
    return `${m}:${sStr}`;
  }

  function showVideoSeekFeedback(itemEl, text) {
    let badge = itemEl.querySelector('.ref-video-seek-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'ref-video-seek-badge';
      const crop = itemEl.querySelector('.ref-item-crop');
      if (crop) crop.appendChild(badge);
      else itemEl.appendChild(badge);
    }
    badge.textContent = text;
    badge.classList.remove('active');
    void badge.offsetWidth;
    badge.classList.add('active');
    clearTimeout(badge._seekTimer);
    badge._seekTimer = setTimeout(() => {
      badge.classList.remove('active');
    }, 600);
  }

  function renderVideoControlsHtml(itemData) {
    const rawTitle = (itemData && itemData.title) ? itemData.title : '';
    const safeTitle = String(rawTitle).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    return `
      <div class="ref-video-ctrl-bar" data-role="video-controls">
        <div class="ref-video-scrubber-wrap">
          <span class="ref-video-time-cur">0:00</span>
          <div class="ref-video-track-container" data-act="seek-track" title="ลากเพื่อเลื่อนเวลา">
            <div class="ref-video-track-bg"></div>
            <div class="ref-video-track-fill"></div>
            <div class="ref-video-track-thumb"></div>
          </div>
          <span class="ref-video-time-total">0:00</span>
        </div>
        <div class="ref-video-btns-row">
          <div class="ref-video-title-wrap" title="${safeTitle}">
            ${safeTitle ? `<span class="ref-video-title-txt">${safeTitle}</span>` : ''}
          </div>
          <div class="ref-video-center-btns">
            <button type="button" class="ref-video-btn ref-video-btn-rewind" data-act="video-rewind10" title="ถอยหลัง 10 วินาที (-10s)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              <span class="ref-video-btn-num">10</span>
            </button>
            <button type="button" class="ref-video-btn ref-video-btn-playpause" data-act="video-playpause" title="เล่น / พัก">
              <svg class="icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
              </svg>
              <svg class="icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:none; margin-left:2px;">
                <polygon points="6 4 20 12 6 20 6 4"></polygon>
              </svg>
            </button>
            <button type="button" class="ref-video-btn ref-video-btn-forward" data-act="video-forward10" title="ไปข้างหน้า 10 วินาที (+10s)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
              </svg>
              <span class="ref-video-btn-num">10</span>
            </button>
          </div>
          <div class="ref-video-side-actions">
            <div class="ref-video-vol-group" title="ระดับเสียง">
              <button type="button" class="ref-video-btn ref-video-btn-mute" data-act="video-mute" title="ปิด/เปิดเสียง (คลิก)">
                <svg class="icon-vol-mute" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
                <svg class="icon-vol-low" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <svg class="icon-vol-up" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </button>
              <div class="ref-video-vol-slider-wrap" data-act="video-vol-track" title="ลากหรือคลิกเพื่อปรับระดับเสียง">
                <div class="ref-video-vol-bg"></div>
                <div class="ref-video-vol-fill"></div>
                <div class="ref-video-vol-thumb"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setupVideoController(itemEl, itemData) {
    const video = itemEl.querySelector('video');
    const ctrlBar = itemEl.querySelector('.ref-video-ctrl-bar');
    if (!video || !ctrlBar) return;

    const trackContainer = ctrlBar.querySelector('.ref-video-track-container');
    const trackFill = ctrlBar.querySelector('.ref-video-track-fill');
    const trackThumb = ctrlBar.querySelector('.ref-video-track-thumb');
    const timeCur = ctrlBar.querySelector('.ref-video-time-cur');
    const timeTotal = ctrlBar.querySelector('.ref-video-time-total');
    const playPauseBtn = ctrlBar.querySelector('.ref-video-btn-playpause');
    const rewindBtn = ctrlBar.querySelector('.ref-video-btn-rewind');
    const forwardBtn = ctrlBar.querySelector('.ref-video-btn-forward');
    const muteBtn = ctrlBar.querySelector('.ref-video-btn-mute');
    const volGroup = ctrlBar.querySelector('.ref-video-vol-group');
    const volTrack = ctrlBar.querySelector('.ref-video-vol-slider-wrap');
    const volFill = ctrlBar.querySelector('.ref-video-vol-fill');
    const volThumb = ctrlBar.querySelector('.ref-video-vol-thumb');

    let isDragging = false;
    let isDraggingVol = false;
    let wasPlayingBeforeDrag = false;
    let lastVolume = (video.volume > 0.05) ? video.volume : 0.8;

    // Prevent item dragging when interacting with control bar
    ctrlBar.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    ctrlBar.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    }, { passive: false });

    function updateScrubber(time, duration) {
      if (!duration || duration <= 0) return;
      const pct = Math.max(0, Math.min(100, (time / duration) * 100));
      if (trackFill) trackFill.style.width = `${pct}%`;
      if (trackThumb) trackThumb.style.left = `${pct}%`;
      if (timeCur) timeCur.textContent = formatVideoTime(time);
    }

    function syncDuration() {
      if (video.duration && isFinite(video.duration)) {
        if (timeTotal) timeTotal.textContent = formatVideoTime(video.duration);
        updateScrubber(video.currentTime, video.duration);
      }
    }

    function updateVideoThumb() {
      if (!itemData.thumbnailUrl && video.videoWidth > 0 && video.videoHeight > 0) {
        try {
          const cvs = document.createElement('canvas');
          cvs.width = video.videoWidth;
          cvs.height = video.videoHeight;
          const ctx = cvs.getContext('2d');
          ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
          const thumb = cvs.toDataURL('image/jpeg', 0.88);
          if (thumb && thumb.startsWith('data:image')) {
            itemData.thumbnailUrl = thumb;
          }
        } catch (e) {}
      }
    }

    if (video.readyState >= 1) {
      syncDuration();
    }
    if (video.readyState >= 2) {
      updateVideoThumb();
    }
    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('loadeddata', updateVideoThumb);
    video.addEventListener('canplay', updateVideoThumb);
    video.addEventListener('seeked', updateVideoThumb);

    video.addEventListener('timeupdate', () => {
      if (!isDragging && video.duration) {
        updateScrubber(video.currentTime, video.duration);
      }
    });

    function syncPlayState() {
      const isPaused = video.paused;
      itemEl.classList.toggle('is-paused', isPaused);
      if (playPauseBtn) {
        const iconPlay = playPauseBtn.querySelector('.icon-play');
        const iconPause = playPauseBtn.querySelector('.icon-pause');
        if (iconPlay && iconPause) {
          iconPlay.style.display = isPaused ? 'block' : 'none';
          iconPause.style.display = isPaused ? 'none' : 'block';
        }
      }
      const topPlayBtn = itemEl.querySelector('.ref-tb-btn[data-act="toggle-play"]');
      if (topPlayBtn) {
        topPlayBtn.textContent = isPaused ? '▶️ เล่น' : '⏸️ พัก';
      }
    }

    video.addEventListener('play', syncPlayState);
    video.addEventListener('pause', syncPlayState);
    video.addEventListener('ended', syncPlayState);
    syncPlayState();

    function syncVolumeUI() {
      const isMuted = video.muted || video.volume === 0;
      const vol = isMuted ? 0 : video.volume;
      const pct = Math.round(vol * 100);

      if (volFill) volFill.style.width = `${pct}%`;
      if (volThumb) volThumb.style.left = `${pct}%`;
      if (volTrack) {
        volTrack.setAttribute('title', isMuted ? 'ปิดเสียงอยู่ (คลิกหรือลากเพื่อเปิดเสียง)' : `ระดับเสียง: ${pct}%`);
      }

      if (muteBtn) {
        const iconMute = muteBtn.querySelector('.icon-vol-mute');
        const iconLow = muteBtn.querySelector('.icon-vol-low');
        const iconUp = muteBtn.querySelector('.icon-vol-up');
        if (iconMute && iconLow && iconUp) {
          iconMute.style.display = isMuted ? 'block' : 'none';
          iconLow.style.display = (!isMuted && vol < 0.5) ? 'block' : 'none';
          iconUp.style.display = (!isMuted && vol >= 0.5) ? 'block' : 'none';
        }
        muteBtn.setAttribute('title', isMuted ? 'เปิดเสียง (คลิก)' : 'ปิดเสียง (คลิก)');
      }

      const topMuteBtn = itemEl.querySelector('.ref-tb-btn[data-act="toggle-mute"]');
      if (topMuteBtn) {
        topMuteBtn.textContent = isMuted ? '🔇 เสียง' : '🔊 เปิดเสียง';
      }

      if (!isMuted && video.volume > 0.05) {
        lastVolume = video.volume;
      }
    }

    video.addEventListener('volumechange', syncVolumeUI);
    syncVolumeUI();

    function seekToClientX(clientX) {
      if (!video.duration || !isFinite(video.duration)) return;
      const rect = trackContainer.getBoundingClientRect();
      if (rect.width <= 0) return;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetTime = ratio * video.duration;
      video.currentTime = targetTime;
      updateScrubber(targetTime, video.duration);
    }

    const hostDoc = (itemEl.ownerDocument && itemEl.ownerDocument.defaultView) || window;

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      seekToClientX(clientX);
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      trackContainer.classList.remove('dragging');
      if (!isDraggingVol) {
        ctrlBar.classList.remove('is-active');
      }
      hostDoc.removeEventListener('mousemove', onPointerMove);
      hostDoc.removeEventListener('mouseup', onPointerUp);
      hostDoc.removeEventListener('touchmove', onPointerMove);
      hostDoc.removeEventListener('touchend', onPointerUp);
      if (wasPlayingBeforeDrag) {
        video.play().catch(() => {});
      }
    }

    trackContainer.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!video.duration || !isFinite(video.duration)) return;
      isDragging = true;
      wasPlayingBeforeDrag = !video.paused;
      if (wasPlayingBeforeDrag) {
        video.pause();
      }
      trackContainer.classList.add('dragging');
      ctrlBar.classList.add('is-active');
      seekToClientX(e.clientX);
      hostDoc.addEventListener('mousemove', onPointerMove);
      hostDoc.addEventListener('mouseup', onPointerUp);
    });

    trackContainer.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      if (!video.duration || !isFinite(video.duration)) return;
      isDragging = true;
      wasPlayingBeforeDrag = !video.paused;
      if (wasPlayingBeforeDrag) {
        video.pause();
      }
      trackContainer.classList.add('dragging');
      ctrlBar.classList.add('is-active');
      if (e.touches && e.touches[0]) {
        seekToClientX(e.touches[0].clientX);
      }
      hostDoc.addEventListener('touchmove', onPointerMove, { passive: false });
      hostDoc.addEventListener('touchend', onPointerUp);
    }, { passive: false });

    // Volume Drag & Click Handling
    function setVolumeFromClientX(clientX) {
      if (!volTrack) return;
      const rect = volTrack.getBoundingClientRect();
      if (rect.width <= 0) return;
      let ratio = (clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      if (ratio < 0.03) {
        video.muted = true;
        video.volume = 0;
      } else {
        video.volume = ratio;
        video.muted = false;
        lastVolume = ratio;
      }
      syncVolumeUI();
    }

    function onVolPointerMove(e) {
      if (!isDraggingVol) return;
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      setVolumeFromClientX(clientX);
    }

    function onVolPointerUp() {
      if (!isDraggingVol) return;
      isDraggingVol = false;
      if (volTrack) volTrack.classList.remove('dragging');
      if (volGroup) volGroup.classList.remove('is-dragging');
      if (!isDragging) {
        ctrlBar.classList.remove('is-active');
      }
      hostDoc.removeEventListener('mousemove', onVolPointerMove);
      hostDoc.removeEventListener('mouseup', onVolPointerUp);
      hostDoc.removeEventListener('touchmove', onVolPointerMove);
      hostDoc.removeEventListener('touchend', onVolPointerUp);
    }

    if (volTrack) {
      volTrack.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        isDraggingVol = true;
        volTrack.classList.add('dragging');
        if (volGroup) volGroup.classList.add('is-dragging');
        ctrlBar.classList.add('is-active');
        setVolumeFromClientX(e.clientX);
        hostDoc.addEventListener('mousemove', onVolPointerMove);
        hostDoc.addEventListener('mouseup', onVolPointerUp);
      });

      volTrack.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        isDraggingVol = true;
        volTrack.classList.add('dragging');
        if (volGroup) volGroup.classList.add('is-dragging');
        ctrlBar.classList.add('is-active');
        if (e.touches && e.touches[0]) {
          setVolumeFromClientX(e.touches[0].clientX);
        }
        hostDoc.addEventListener('touchmove', onVolPointerMove, { passive: false });
        hostDoc.addEventListener('touchend', onVolPointerUp);
      }, { passive: false });
    }

    if (volGroup) {
      volGroup.addEventListener('wheel', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        let newVol = Math.max(0, Math.min(1, (video.muted ? 0 : video.volume) + delta));
        if (newVol <= 0.02) {
          video.muted = true;
          video.volume = 0;
        } else {
          video.muted = false;
          video.volume = newVol;
          lastVolume = newVol;
        }
      }, { passive: false });
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }

    if (rewindBtn) {
      rewindBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - 10);
        showVideoSeekFeedback(itemEl, '-10s');
      });
    }

    if (forwardBtn) {
      forwardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const maxTime = video.duration || (video.currentTime + 10);
        video.currentTime = Math.min(maxTime, video.currentTime + 10);
        showVideoSeekFeedback(itemEl, '+10s');
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.muted || video.volume === 0) {
          video.muted = false;
          if (video.volume === 0) {
            video.volume = lastVolume > 0.05 ? lastVolume : 0.8;
          }
        } else {
          video.muted = true;
        }
      });
    }
  }

  // ── URL & Social Media Media Parser ──
  function sanitizeEmbedUrl(url, extraOptions = {}) {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const vidId = ytMatch[1];
      const hasAutoplay = extraOptions.autoplay || url.includes('autoplay=1');
      const hasMute = extraOptions.mute === true || (extraOptions.mute !== false && url.includes('mute=1'));
      const params = new URLSearchParams();
      params.set('rel', '0');
      params.set('playsinline', '1');
      params.set('enablejsapi', '1');
      if (hasAutoplay) {
        params.set('autoplay', '1');
      }
      if (hasMute) {
        params.set('mute', '1');
      } else {
        params.set('mute', '0');
      }
      const timeMatch = url.match(/[?&](?:t|start)=([0-9hms]+)/i);
      if (timeMatch && timeMatch[1]) {
        const val = timeMatch[1];
        if (/^\d+$/.test(val)) {
          params.set('start', val);
        } else {
          let total = 0;
          const h = val.match(/(\d+)h/i);
          const m = val.match(/(\d+)m/i);
          const s = val.match(/(\d+)s/i);
          if (h) total += parseInt(h[1], 10) * 3600;
          if (m) total += parseInt(m[1], 10) * 60;
          if (s) total += parseInt(s[1], 10);
          if (total > 0) params.set('start', String(total));
        }
      }
      return `https://www.youtube.com/embed/${vidId}?${params.toString()}`;
    }
    return url;
  }

  function parseMediaUrl(rawUrl) {
    if (!rawUrl) return null;
    const url = rawUrl.trim();

    // 1. YouTube & YouTube Shorts
    const ytMatch = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const id = ytMatch[1];
      const isShorts = url.includes('/shorts/');
      const isNormal = isBoardNormalMode();
      const sanitizedUrl = sanitizeEmbedUrl(url, { autoplay: isNormal, mute: false });
      return {
        type: 'youtube',
        isEmbed: true,
        id: id,
        width: isShorts ? 360 : 540,
        height: isShorts ? 640 : 304,
        aspect: isShorts ? (360 / 640) : (16 / 9),
        embedUrl: sanitizedUrl,
        autoplay: isNormal,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        dataUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        title: isShorts ? 'YouTube Shorts' : 'YouTube Video'
      };
    }

    // 2. Google Drive Image File
    const gdMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/i);
    if (gdMatch && gdMatch[1]) {
      const fileId = gdMatch[1];
      const directImgUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
      return {
        type: 'image',
        dataUrl: directImgUrl,
        title: 'Google Drive Image'
      };
    }

    // 4. TikTok Video
    const ttMatch = url.match(/tiktok\.com\/@?[^\/]+\/video\/([0-9]+)/i);
    if (ttMatch && ttMatch[1]) {
      const id = ttMatch[1];
      return {
        type: 'tiktok',
        isEmbed: true,
        id: id,
        width: 340,
        height: 600,
        aspect: 340 / 600,
        embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
        dataUrl: '',
        title: 'TikTok Video'
      };
    }

    // 5. Vimeo Video
    const vimMatch = url.match(/vimeo\.com\/([0-9]+)/i);
    if (vimMatch && vimMatch[1]) {
      const id = vimMatch[1];
      return {
        type: 'vimeo',
        isEmbed: true,
        id: id,
        width: 520,
        height: 292,
        aspect: 16 / 9,
        embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
        dataUrl: '',
        title: 'Vimeo Video'
      };
    }

    // 6. Direct Video URL
    const lower = url.toLowerCase();
    if (lower.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i) || url.startsWith('data:video/')) {
      return {
        type: 'video',
        isVideo: true,
        width: 480,
        height: 320,
        aspect: 480 / 320,
        dataUrl: url,
        title: 'Direct Video'
      };
    }

    // 7. Direct Image / GIF URL
    if (lower.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp|avif)(\?.*)?$/i) || url.startsWith('data:image/') || url.includes('giphy.com') || url.includes('tenor.com') || url.includes('imgur.com')) {
      return {
        type: 'image',
        width: 400,
        height: 400,
        aspect: 1,
        dataUrl: url,
        title: 'Image'
      };
    }

    // 8. General fallback
    return {
      type: 'generic-url',
      url: url,
      dataUrl: url
    };
  }

  // ── Import Media from URL ──
  function importUrlToRefBoard(rawUrl, targetX = null, targetY = null) {
    if (!rawUrl) return;
    const parsed = parseMediaUrl(rawUrl);
    if (!parsed) {
      showToast('ลิงก์ไม่ถูกต้อง');
      return;
    }

    pushUndoState();
    const startX = targetX !== null ? targetX : (-panX / zoom + viewportEl.clientWidth / 2 - 200);
    const startY = targetY !== null ? targetY : (-panY / zoom + viewportEl.clientHeight / 2 - 150);

    let itemX = startX;
    let itemY = startY;
    if (isGridEnabled) {
      itemX = Math.round(itemX / 24) * 24;
      itemY = Math.round(itemY / 24) * 24;
    }

    if (parsed.type === 'generic-url') {
      const img = new Image();
      img.onload = () => {
        let w = img.naturalWidth || 400;
        let h = img.naturalHeight || 400;
        const aspect = w / h;
        const maxDim = 1500;
        if (w > maxDim || h > maxDim) {
          if (w > h) { w = maxDim; h = maxDim / aspect; }
          else { h = maxDim; w = maxDim * aspect; }
        }
        createRefImageItem({
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          dataUrl: parsed.url,
          x: itemX,
          y: itemY,
          width: Math.round(w),
          height: Math.round(h),
          aspect: aspect,
          rotation: 0,
          zIndex: ++nextZIndex
        });
        showToast('นำเข้ารูปภาพจากลิงก์เรียบร้อย! 🖼️');
      };
      img.onerror = () => {
        createRefImageItem({
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          isEmbed: true,
          embedType: 'web',
          embedUrl: parsed.url,
          dataUrl: '',
          title: 'Web Link',
          x: itemX,
          y: itemY,
          width: 500,
          height: 400,
          aspect: 500 / 400,
          rotation: 0,
          zIndex: ++nextZIndex
        });
        showToast('นำเข้าลิงก์เว็บเรียบร้อย! 🌐');
      };
      img.src = parsed.url;
      return;
    }

    if (parsed.type === 'image') {
      const img = new Image();
      img.onload = () => {
        let w = img.naturalWidth || 400;
        let h = img.naturalHeight || 400;
        const aspect = w / h;
        const maxDim = 1500;
        if (w > maxDim || h > maxDim) {
          if (w > h) { w = maxDim; h = maxDim / aspect; }
          else { h = maxDim; w = maxDim * aspect; }
        }
        createRefImageItem({
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          dataUrl: parsed.dataUrl,
          x: itemX,
          y: itemY,
          width: Math.round(w),
          height: Math.round(h),
          aspect: aspect,
          rotation: 0,
          zIndex: ++nextZIndex
        });
        showToast('นำเข้ารูปภาพ / GIF เรียบร้อย! 🖼️');
      };
      img.onerror = () => {
        showToast('ไม่สามารถโหลดรูปภาพจากลิงก์นี้ได้');
      };
      img.src = parsed.dataUrl;
      return;
    }

    if (parsed.type === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = parsed.dataUrl;
      video.onloadedmetadata = () => {
        let w = video.videoWidth || 480;
        let h = video.videoHeight || 320;
        const aspect = w / h;
        createRefImageItem({
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          dataUrl: parsed.dataUrl,
          isVideo: true,
          mediaType: 'video',
          x: itemX,
          y: itemY,
          width: Math.round(w),
          height: Math.round(h),
          aspect: aspect,
          rotation: 0,
          zIndex: ++nextZIndex
        });
        showToast('นำเข้าวิดีโอจากลิงก์เรียบร้อย! 🎬');
      };
      video.onerror = () => {
        showToast('ไม่สามารถโหลดวิดีโอจากลิงก์นี้ได้');
      };
      return;
    }

    // Embed Types (YouTube, TikTok, Vimeo)
    const isNormal = isBoardNormalMode();
    const shouldAutoplayYt = (parsed.type === 'youtube' && isNormal) || Boolean(parsed.autoplay);

    const newItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      isEmbed: true,
      embedType: parsed.type,
      embedUrl: parsed.embedUrl || sanitizeEmbedUrl(parsed.url || rawUrl, { autoplay: shouldAutoplayYt, mute: false }),
      autoplay: shouldAutoplayYt,
      thumbnailUrl: parsed.thumbnailUrl || parsed.dataUrl || '',
      dataUrl: parsed.dataUrl || parsed.thumbnailUrl || '',
      title: parsed.title,
      x: itemX,
      y: itemY,
      width: parsed.width,
      height: parsed.height,
      aspect: parsed.aspect,
      rotation: 0,
      zIndex: ++nextZIndex
    };

    // Pre-convert YouTube thumbnail to Base64 DataURL so export never encounters CORS taint
    if (parsed.type === 'youtube' && parsed.thumbnailUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const cvs = document.createElement('canvas');
          cvs.width = img.naturalWidth || img.width || 480;
          cvs.height = img.naturalHeight || img.height || 360;
          const c = cvs.getContext('2d');
          c.drawImage(img, 0, 0);
          const b64 = cvs.toDataURL('image/jpeg', 0.95);
          if (b64 && b64.startsWith('data:image')) {
            newItem.dataUrl = b64;
            newItem.thumbnailUrl = b64;
            const liveIt = itemsMap.get(newItem.id);
            if (liveIt) {
              liveIt.dataUrl = b64;
              liveIt.thumbnailUrl = b64;
            }
          }
        } catch (e) {
          console.warn('Could not convert YouTube thumb to base64:', e);
        }
      };
      img.src = parsed.thumbnailUrl;
    }

    createRefImageItem(newItem);

    if (shouldAutoplayYt) {
      showToast('นำเข้า YouTube เรียบร้อย! 🎬 กำลังเล่นคลิป...');
    } else {
      const nameMap = { youtube: 'YouTube 🔴', tiktok: 'TikTok 🎵', vimeo: 'Vimeo 🎬' };
      showToast(`นำเข้า ${nameMap[parsed.type] || 'มีเดีย'} เรียบร้อย! ✨`);
    }
  }

  // ── Smart PNG & JPEG Metadata Embedding & Extraction Engine ──
  const crcTable = (function() {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function embedRefBoardMetadataInPng(pngBuffer, boardJsonStr) {
    try {
      const keyword = 'refboard';
      const encoder = new TextEncoder();
      const keywordBytes = encoder.encode(keyword);
      const dataBytes = encoder.encode(boardJsonStr);

      const payloadLen = keywordBytes.length + 1 + dataBytes.length;
      const chunkType = encoder.encode('tEXt');

      const chunkData = new Uint8Array(4 + payloadLen);
      chunkData.set(chunkType, 0);
      chunkData.set(keywordBytes, 4);
      chunkData[4 + keywordBytes.length] = 0;
      chunkData.set(dataBytes, 4 + keywordBytes.length + 1);

      const crcValue = crc32(chunkData);

      const totalChunkBytes = new Uint8Array(4 + 4 + payloadLen + 4);
      const view = new DataView(totalChunkBytes.buffer);
      view.setUint32(0, payloadLen, false);
      totalChunkBytes.set(chunkData, 4);
      view.setUint32(4 + 4 + payloadLen, crcValue, false);

      const origBytes = new Uint8Array(pngBuffer);
      const iendPos = origBytes.length - 12;

      const resultBytes = new Uint8Array(origBytes.length + totalChunkBytes.length);
      resultBytes.set(origBytes.subarray(0, iendPos), 0);
      resultBytes.set(totalChunkBytes, iendPos);
      resultBytes.set(origBytes.subarray(iendPos), iendPos + totalChunkBytes.length);

      return resultBytes.buffer;
    } catch (e) {
      console.warn('PNG metadata embed failed:', e);
      return pngBuffer;
    }
  }

  function extractRefBoardMetadataFromPng(arrayBuffer) {
    try {
      const bytes = new Uint8Array(arrayBuffer);
      if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4E || bytes[3] !== 0x47) return null;

      let offset = 8;
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const decoder = new TextDecoder('utf-8');

      while (offset < bytes.length - 8) {
        const length = view.getUint32(offset, false);
        const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);

        if (type === 'tEXt') {
          const chunkData = bytes.subarray(offset + 8, offset + 8 + length);
          let nullIdx = -1;
          for (let i = 0; i < chunkData.length; i++) {
            if (chunkData[i] === 0) { nullIdx = i; break; }
          }
          if (nullIdx > 0) {
            const key = decoder.decode(chunkData.subarray(0, nullIdx));
            if (key === 'refboard') {
              const jsonText = decoder.decode(chunkData.subarray(nullIdx + 1));
              return JSON.parse(jsonText);
            }
          }
        }
        if (type === 'IEND') break;
        offset += 12 + length;
      }
    } catch (err) {
      console.warn('Could not parse PNG metadata:', err);
    }
    return null;
  }

  function embedRefBoardMetadataInJpg(jpgBuffer, boardJsonStr) {
    try {
      const origBytes = new Uint8Array(jpgBuffer);
      if (origBytes[0] !== 0xFF || origBytes[1] !== 0xD8) return jpgBuffer;

      const encoder = new TextEncoder();
      const payloadBytes = encoder.encode('refboard:' + boardJsonStr);
      const commentLength = 2 + payloadBytes.length;

      if (commentLength > 65535) {
        console.warn('Metadata too large for single JPEG COM marker');
        return jpgBuffer;
      }

      const comBytes = new Uint8Array(2 + 2 + payloadBytes.length);
      comBytes[0] = 0xFF;
      comBytes[1] = 0xFE;
      comBytes[2] = (commentLength >> 8) & 0xFF;
      comBytes[3] = commentLength & 0xFF;
      comBytes.set(payloadBytes, 4);

      const result = new Uint8Array(origBytes.length + comBytes.length);
      result.set(origBytes.subarray(0, 2), 0);
      result.set(comBytes, 2);
      result.set(origBytes.subarray(2), 2 + comBytes.length);

      return result.buffer;
    } catch (e) {
      console.warn('JPEG metadata embed failed:', e);
      return jpgBuffer;
    }
  }

  function extractRefBoardMetadataFromJpg(arrayBuffer) {
    try {
      const bytes = new Uint8Array(arrayBuffer);
      if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) return null;

      let offset = 2;
      const decoder = new TextDecoder('utf-8');

      while (offset < bytes.length - 4) {
        if (bytes[offset] !== 0xFF) {
          offset++;
          continue;
        }
        const marker = bytes[offset + 1];
        if (marker === 0xD9 || marker === 0xDA) break;

        const len = (bytes[offset + 2] << 8) | bytes[offset + 3];
        if (marker === 0xFE) {
          const commentData = bytes.subarray(offset + 4, offset + 2 + len);
          const text = decoder.decode(commentData);
          if (text.startsWith('refboard:')) {
            return JSON.parse(text.substring(9));
          }
        }
        offset += 2 + len;
      }
    } catch (err) {
      console.warn('Could not parse JPG metadata:', err);
    }
    return null;
  }

  async function checkForEmbeddedRefBoard(file) {
    if (!file) return null;
    const fileName = (file.name || '').toLowerCase();
    const fileType = (file.type || '').toLowerCase();
    if (!fileName.endsWith('.png') && !fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileType.includes('png') && !fileType.includes('jpeg')) {
      return null;
    }

    try {
      const buffer = await file.arrayBuffer();
      const pngMeta = extractRefBoardMetadataFromPng(buffer);
      if (pngMeta && pngMeta.items && Array.isArray(pngMeta.items) && pngMeta.items.length > 0) {
        return pngMeta;
      }
      const jpgMeta = extractRefBoardMetadataFromJpg(buffer);
      if (jpgMeta && jpgMeta.items && Array.isArray(jpgMeta.items) && jpgMeta.items.length > 0) {
        return jpgMeta;
      }
    } catch (e) {
      console.warn('Embedded refboard check failed:', e);
    }
    return null;
  }

  // Main File Dispatcher
  async function handleFiles(files, targetX = null, targetY = null) {
    if (!files) return;
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    // Check if the single imported image file contains embedded RefBoard data
    if (fileList.length === 1) {
      const singleFile = fileList[0];
      const embeddedBoard = await checkForEmbeddedRefBoard(singleFile);
      if (embeddedBoard && embeddedBoard.items && embeddedBoard.items.length > 0) {
        if (itemsMap.size === 0) {
          replaceRefBoard(embeddedBoard);
          return;
        } else {
          showSmartRefBoardImportModal(embeddedBoard, singleFile, targetX, targetY, true);
          return;
        }
      }
    }

    const imageFiles = [];
    const videoFiles = [];

    fileList.forEach((file) => {
      if (!file) return;
      const fileName = (file.name || '').toLowerCase();
      const fileType = (file.type || '').toLowerCase();

      if (fileName.endsWith('.refboard') || fileName.endsWith('.json')) {
        importRefBoardFile(file);
      } else if (fileName.endsWith('.psd')) {
        importPsdFile(file);
      } else if (fileName.endsWith('.svg') || fileType === 'image/svg+xml') {
        importSvgFile(file);
      } else if (fileName.endsWith('.pdf') || fileName.endsWith('.ai') || fileName.endsWith('.eps') || fileType === 'application/pdf') {
        importPdfFile(file);
      } else if (fileType.startsWith('video/') || fileName.endsWith('.mp4') || fileName.endsWith('.webm') || fileName.endsWith('.mov') || fileName.endsWith('.m4v') || fileName.endsWith('.ogg')) {
        videoFiles.push(file);
      } else if (fileType.startsWith('image/') || fileName.endsWith('.gif') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp') || fileName.endsWith('.bmp') || fileName.endsWith('.avif')) {
        imageFiles.push(file);
      } else if (fileType.startsWith('image')) {
        imageFiles.push(file);
      } else {
        // Fallback default: try as image
        imageFiles.push(file);
      }
    });

    if (imageFiles.length > 0) {
      importMultipleImageFiles(imageFiles, targetX, targetY);
    }
    if (videoFiles.length > 0) {
      importMultipleVideoFiles(videoFiles, targetX, targetY);
    }
  }

  // Import Video Files (.mp4, .webm, .mov, etc.)
  function importMultipleVideoFiles(files, targetX = null, targetY = null) {
    pushUndoState();
    let loadedCount = 0;
    const total = files.length;
    const loadedVideos = [];

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = dataUrl;

        video.onloadedmetadata = () => {
          let w = video.videoWidth || 480;
          let h = video.videoHeight || 320;
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

          loadedVideos.push({ index, dataUrl, w, h, aspect });
          loadedCount++;

          if (loadedCount === total) {
            loadedVideos.sort((a, b) => a.index - b.index);

            const startX = targetX !== null ? targetX : (-panX / zoom + viewportEl.clientWidth / 2 - 150);
            const startY = targetY !== null ? targetY : (-panY / zoom + viewportEl.clientHeight / 2 - 150);

            loadedVideos.forEach((item, i) => {
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
                isVideo: true,
                mediaType: 'video',
                x: itemX,
                y: itemY,
                width: Math.round(item.w),
                height: Math.round(item.h),
                fullWidth: Math.round(item.w),
                fullHeight: Math.round(item.h),
                aspect: item.aspect,
                rotation: 0,
                cropLeft: 0,
                cropTop: 0,
                cropRight: 0,
                cropBottom: 0,
                zIndex: ++nextZIndex
              });
            });
            setTimeout(fitBoardToViewport, 50);
            showToast(`นำเข้าวิดีโอเรียบร้อย (${total} ไฟล์) 🎬`);
          }
        };

        video.onerror = () => {
          loadedCount++;
          showToast(`ไม่สามารถโหลดวิดีโอ: ${file.name}`);
        };
      };
      reader.readAsDataURL(file);
    });
  }

  // Import Regular Image Files (Freeform Drag & Drop with 24px Grid Snapping)
  function importMultipleImageFiles(files, targetX = null, targetY = null) {
    pushUndoState();
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
    pushUndoState();
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

        if (itemsMap.size === 0) {
          replaceRefBoard(boardData);
        } else {
          showSmartRefBoardImportModal(boardData, file, null, null, false);
        }

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

      const cropAspect = (item.width / (item.height || 1)) || item.aspect || 1.0;
      const rotDeg = item.rotation || 0;
      const rotRad = (rotDeg * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rotRad));
      const sin = Math.abs(Math.sin(rotRad));

      const widthRatio = cos + (1 / cropAspect) * sin;
      const targetW = Math.round(colWidth / (widthRatio || 1));
      const targetH = Math.round(targetW / cropAspect);
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

      const scaleRatio = targetW / (item.width || 1);
      item.x = renderX;
      item.y = renderY;
      item.fullWidth = (item.fullWidth || item.width) * scaleRatio;
      item.fullHeight = (item.fullHeight || item.height) * scaleRatio;
      item.cropLeft = (item.cropLeft || 0) * scaleRatio;
      item.cropTop = (item.cropTop || 0) * scaleRatio;
      item.cropRight = (item.cropRight || 0) * scaleRatio;
      item.cropBottom = (item.cropBottom || 0) * scaleRatio;

      updateItemDom(item);

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

  // Setup Link Dialog Modal Options Binding
  function setupLinkModal() {
    linkModalEl = document.getElementById('refboard-link-backdrop');
    linkInputEl = document.getElementById('refboard-link-input');

    function openLinkModal() {
      if (linkModalEl) {
        linkModalEl.classList.add('open');
        linkModalEl.style.display = 'flex';
        if (linkInputEl) {
          linkInputEl.value = '';
          setTimeout(() => linkInputEl.focus(), 50);
        }
      }
    }

    function closeLinkModal() {
      if (linkModalEl) {
        linkModalEl.classList.remove('open');
        linkModalEl.style.display = 'none';
      }
    }

    const linkBtn = document.getElementById('refboard-link-btn');
    if (linkBtn) {
      linkBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openLinkModal();
      });
    }

    const linkCloseBtn = document.getElementById('refboard-link-close-btn');
    if (linkCloseBtn) {
      linkCloseBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        closeLinkModal();
      });
    }

    const linkCancelBtn = document.getElementById('refboard-link-cancel-btn');
    if (linkCancelBtn) {
      linkCancelBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        closeLinkModal();
      });
    }

    const linkSubmitBtn = document.getElementById('refboard-link-submit-btn');
    if (linkSubmitBtn) {
      linkSubmitBtn.addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (linkInputEl && linkInputEl.value.trim()) {
          importUrlToRefBoard(linkInputEl.value.trim());
          closeLinkModal();
        }
      });
    }

    if (linkInputEl) {
      linkInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (linkInputEl.value.trim()) {
            importUrlToRefBoard(linkInputEl.value.trim());
            closeLinkModal();
          }
        } else if (e.key === 'Escape') {
          closeLinkModal();
        }
      });
    }
  }

  // Interactive Mode for Video & Embed Players
  let interactiveItemId = null;

  function setInteractiveItem(itemDataOrId) {
    const id = typeof itemDataOrId === 'string' ? itemDataOrId : (itemDataOrId && itemDataOrId.id);
    if (interactiveItemId && interactiveItemId !== id) {
      exitInteractiveMode();
    }
    interactiveItemId = id;
    if (!id) return;
    const it = itemsMap.get(id);
    if (!it) return;
    const el = it.el || document.getElementById(id);
    if (el) {
      el.classList.add('is-interactive');
      selectItem(id);
      showToast('✨ เข้าสู่โหมดโต้ตอบคลิปแล้ว (คลิกนอกกรอบเพื่อสิ้นสุด)');
    }
  }

  function exitInteractiveMode() {
    if (!interactiveItemId) return;
    const it = itemsMap.get(interactiveItemId);
    if (it) {
      const el = it.el || document.getElementById(interactiveItemId);
      if (el) el.classList.remove('is-interactive');
    }
    interactiveItemId = null;
  }

  // Build Group SVG Container combining all items with full transform, crop, and media support
  function buildGroupSvgString(items, groupW, groupH, originX = null, originY = null) {
    if (!items || items.length === 0) return '';

    let minX = originX;
    let minY = originY;
    if (minX === null || minX === undefined || minY === null || minY === undefined) {
      minX = Infinity;
      minY = Infinity;
      items.forEach((it) => {
        minX = Math.min(minX, it.x);
        minY = Math.min(minY, it.y);
      });
      if (minX === Infinity) minX = 0;
      if (minY === Infinity) minY = 0;
    }

    let svgDefs = '';
    let svgInner = '';

    items.forEach((it, idx) => {
      const relX = it.x - minX;
      const relY = it.y - minY;
      const rot = it.rotation || 0;
      const w = it.width;
      const h = it.height;
      const fullW = it.fullWidth || w;
      const fullH = it.fullHeight || h;
      const cL = it.cropLeft || 0;
      const cT = it.cropTop || 0;
      const cR = it.cropRight || 0;
      const cB = it.cropBottom || 0;

      const hasCrop = cL > 0 || cT > 0 || cR > 0 || cB > 0;
      const clipId = `crop_clip_${idx}_${Math.random().toString(36).substr(2, 5)}`;

      if (hasCrop) {
        svgDefs += `<clipPath id="${clipId}"><rect x="0" y="0" width="${w}" height="${h}" /></clipPath>`;
      }

      if (it.svgContent) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(it.svgContent, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');
          const content = svgEl ? svgEl.innerHTML : '';
          if (hasCrop) {
            svgInner += `<g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})"><g clip-path="url(#${clipId})"><g transform="translate(-${cL}, -${cT})">${content}</g></g></g>`;
          } else {
            svgInner += `<g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})">${content}</g>`;
          }
        } catch (e) {
          console.warn('Error parsing child svgContent:', e);
        }
      } else {
        let imgSrc = it.thumbnailUrl || '';
        const isRawVideoUrl = typeof it.dataUrl === 'string' && (it.dataUrl.startsWith('data:video/') || /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(it.dataUrl));
        if (!imgSrc && !isRawVideoUrl) {
          imgSrc = it.dataUrl || '';
        }

        if (imgSrc) {
          if (hasCrop) {
            svgInner += `<g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})"><g clip-path="url(#${clipId})"><image href="${imgSrc}" x="-${cL}" y="-${cT}" width="${fullW}" height="${fullH}" preserveAspectRatio="none" /></g></g>`;
          } else {
            svgInner += `<g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})"><image href="${imgSrc}" width="${w}" height="${h}" preserveAspectRatio="none" /></g>`;
          }
        } else {
          // Fallback SVG graphic for videos/embeds without raster thumbnail so it never disappears
          const safeTitle = String(it.title || (it.isVideo ? 'Video' : 'Media')).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          const playRadius = Math.max(14, Math.min(w, h) * 0.16);
          const iconHalf = playRadius * 0.55;
          svgInner += `
            <g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})">
              <rect width="${w}" height="${h}" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
              <circle cx="${w / 2}" cy="${h / 2}" r="${playRadius}" fill="#6366f1" />
              <polygon points="${w / 2 - iconHalf * 0.6},${h / 2 - iconHalf} ${w / 2 + iconHalf},${h / 2} ${w / 2 - iconHalf * 0.6},${h / 2 + iconHalf}" fill="#ffffff" />
              <text x="${w / 2}" y="${Math.min(h - 12, h / 2 + playRadius + 22)}" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${safeTitle}</text>
            </g>
          `;
        }
      }
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${groupW} ${groupH}" width="${groupW}" height="${groupH}">${svgDefs ? `<defs>${svgDefs}</defs>` : ''}${svgInner}</svg>`;
  }

  // Ensure group items always have a fresh, live dataUrl across sessions and imported files
  function prepareGroupItemData(itemData) {
    if (!itemData) return;
    const isGroupItem = Boolean(
      itemData.isGroup ||
      (itemData.originalItems && itemData.originalItems.length > 0)
    );
    if (!isGroupItem) return;

    itemData.isGroup = true;
    const isBlob = typeof itemData.dataUrl === 'string' && itemData.dataUrl.startsWith('blob:');
    const isMissing = !itemData.dataUrl || itemData.dataUrl.trim() === '';

    if (isBlob || isMissing || !itemData.svgContent) {
      if (itemData.originalItems && itemData.originalItems.length > 0) {
        let minX = itemData.initialGroupX;
        let minY = itemData.initialGroupY;
        let maxX = -Infinity, maxY = -Infinity;
        if (minX === undefined || minX === null || minY === undefined || minY === null) {
          minX = Infinity;
          minY = Infinity;
          itemData.originalItems.forEach((it) => {
            minX = Math.min(minX, it.x);
            minY = Math.min(minY, it.y);
            maxX = Math.max(maxX, it.x + (it.width || 0));
            maxY = Math.max(maxY, it.y + (it.height || 0));
          });
          if (minX === Infinity) minX = 0;
          if (minY === Infinity) minY = 0;
        } else {
          itemData.originalItems.forEach((it) => {
            maxX = Math.max(maxX, it.x + (it.width || 0));
            maxY = Math.max(maxY, it.y + (it.height || 0));
          });
        }
        const gw = itemData.initialGroupWidth || itemData.width || Math.max(40, maxX - minX);
        const gh = itemData.initialGroupHeight || itemData.height || Math.max(40, maxY - minY);
        itemData.svgContent = buildGroupSvgString(itemData.originalItems, gw, gh, minX, minY);
      }
    }

    if (itemData.svgContent) {
      try {
        const blob = new Blob([itemData.svgContent], { type: 'image/svg+xml' });
        itemData.dataUrl = URL.createObjectURL(blob);
      } catch (e) {
        console.warn('Cannot create group SVG blob:', e);
      }
    }
  }

  // Create Reference Image / Video / GIF DOM Item
  function createRefImageItem(itemData) {
    prepareGroupItemData(itemData);
    itemsMap.set(itemData.id, itemData);

    if (isGridEnabled) {
      itemData.x = Math.round(itemData.x / 24) * 24;
      itemData.y = Math.round(itemData.y / 24) * 24;
    }

    const itemEl = document.createElement('div');
    itemEl.id = itemData.id;
    itemEl.className = 'ref-item' + (itemData.isVideo ? ' is-video' : '') + (itemData.isEmbed ? ' is-embed' : '');
    itemEl.style.transform = `translate(${itemData.x}px, ${itemData.y}px) rotate(${itemData.rotation || 0}deg)`;
    itemEl.style.width = `${itemData.width}px`;
    itemEl.style.height = `${itemData.height}px`;
    itemEl.style.zIndex = itemData.zIndex;

    const canUngroup = Boolean(
      itemData.isGroup ||
      (itemData.originalItems && itemData.originalItems.length > 0)
    );

    let mediaHtml = '';
    if (itemData.isEmbed) {
      if (itemData.showThumbnailOnly && itemData.thumbnailUrl) {
        mediaHtml = `<img src="${itemData.thumbnailUrl}" class="ref-item-img" alt="thumbnail">`;
      } else {
        const embedSrc = sanitizeEmbedUrl(itemData.embedUrl);
        mediaHtml = `
          <iframe src="${embedSrc}" class="ref-item-img ref-item-embed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          <div class="ref-embed-shield"></div>
        `;
      }
    } else if (itemData.isVideo) {
      mediaHtml = `
        <video src="${itemData.dataUrl}" class="ref-item-img ref-item-video" autoplay loop muted playsinline></video>
        ${renderVideoControlsHtml(itemData)}
      `;
    } else {
      mediaHtml = `<img src="${itemData.dataUrl}" class="ref-item-img" alt="ref">`;
    }

    itemEl.innerHTML = `
      <div class="ref-interactive-badge" data-act="exit-interact" title="คลิกเพื่อสิ้นสุดโหมดโต้ตอบ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>โหมดโต้ตอบ (คลิกเพื่อเสร็จสิ้น)</span>
        <span class="ref-badge-close">✕</span>
      </div>
      <div class="ref-item-crop">
        ${mediaHtml}
      </div>
      <div class="ref-handle ref-handle-tl" data-handle="tl"></div>
      <div class="ref-handle ref-handle-tr" data-handle="tr"></div>
      <div class="ref-handle ref-handle-bl" data-handle="bl"></div>
      <div class="ref-handle ref-handle-br" data-handle="br"></div>
      <div class="ref-handle ref-handle-ml" data-handle="ml"></div>
      <div class="ref-handle ref-handle-mr" data-handle="mr"></div>
      <div class="ref-handle ref-handle-mt" data-handle="mt"></div>
      <div class="ref-handle ref-handle-mb" data-handle="mb"></div>
      <div class="ref-handle ref-handle-rot" data-handle="rot"></div>
      
      <div class="ref-item-toolbar">
        <button class="ref-tb-btn btn-palette" data-act="palette" title="สกัดชุดสีจากภาพหรือเฟรมวิดีโอนี้ (ส่งไปยัง Color Generator)">🎨 สกัดสี</button>
        ${(itemData.isEmbed && !itemData.showThumbnailOnly) ? `
          <button class="ref-tb-btn btn-interact" data-act="toggle-interact" title="เปิดโหมดโต้ตอบ/ควบคุมคลิปนี้ (หรือดับเบิ้ลคลิกที่คลิป)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:-1px; margin-right:3px;">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>โต้ตอบ
          </button>
        ` : ''}
        ${(itemData.embedType === 'youtube' && !itemData.showThumbnailOnly) ? `
          <button class="ref-tb-btn btn-playpause btn-yt-playpause" data-act="yt-toggle-play" title="เล่น / พัก YouTube">⏸️ พัก</button>
          <button class="ref-tb-btn btn-mute btn-yt-mute" data-act="yt-toggle-mute" title="คลิกเพื่อปิดเสียง">🔇 ปิดเสียง</button>
        ` : ''}
        ${itemData.embedType === 'youtube' ? `
          <button class="ref-tb-btn" data-act="toggle-yt-mode" title="สลับระหว่างวิดีโอ YouTube และภาพปก">${itemData.showThumbnailOnly ? '🎬 ดูวิดีโอ' : '🖼️ ภาพปก'}</button>
        ` : ''}
        ${itemData.isEmbed && itemData.embedUrl ? `
          <button class="ref-tb-btn" data-act="open-source-link" title="เปิดลิงก์ต้นทาง">🔗 เปิดลิงก์</button>
        ` : ''}
        ${canUngroup ? '<button class="ref-tb-btn btn-ungroup" data-act="ungroup" title="แยกกลุ่มรูปภาพออกเป็นชิ้นย่อย">🧩 แยกกลุ่ม</button>' : ''}
        <button class="ref-tb-btn" data-act="front" title="นำขึ้นหน้าสุด">⬆ ขึ้นหน้า</button>
        <button class="ref-tb-btn" data-act="back" title="ส่งไปหลังสุด">⬇ ลงหลัง</button>
        <button class="ref-tb-btn del-btn" data-act="del" title="ลบ">🗑️ ลบ</button>
      </div>
    `;

    canvasEl.appendChild(itemEl);
    itemData.el = itemEl;
    itemData.imgEl = itemEl.querySelector('.ref-item-img');

    if (itemData.imgEl && canUngroup) {
      itemData.imgEl.addEventListener('error', () => {
        if (itemData.originalItems && itemData.originalItems.length > 0 && !itemEl._hasRetriedSvg) {
          itemEl._hasRetriedSvg = true;
          let minX = itemData.initialGroupX;
          let minY = itemData.initialGroupY;
          if (minX === undefined || minX === null) {
            minX = Math.min(...itemData.originalItems.map((it) => it.x));
            minY = Math.min(...itemData.originalItems.map((it) => it.y));
          }
          const gw = itemData.initialGroupWidth || itemData.width || 400;
          const gh = itemData.initialGroupHeight || itemData.height || 400;
          itemData.svgContent = buildGroupSvgString(itemData.originalItems, gw, gh, minX, minY);
          if (itemData.svgContent) {
            try {
              const blob = new Blob([itemData.svgContent], { type: 'image/svg+xml' });
              itemData.dataUrl = URL.createObjectURL(blob);
              itemData.imgEl.src = itemData.dataUrl;
            } catch (err) {}
          }
        }
      });
    }

    updateItemCount();
    bindItemEvents(itemEl, itemData);
    if (itemData.embedType === 'youtube') {
      const ytIframe = itemEl.querySelector('iframe');
      if (ytIframe) {
        setupYouTubeIframeController(itemEl, itemData, ytIframe);
      }
    }
    if (itemData.isVideo) {
      setupVideoController(itemEl, itemData);
    }
    updateItemDom(itemData);
    selectItem(itemData.id);
  }

  // Update Item DOM Properties (Size, Transform, Crop)
  function updateItemDom(itemData) {
    if (!itemData) return;
    const el = itemData.el || document.getElementById(itemData.id);
    if (!el) return;

    itemData.fullWidth = itemData.fullWidth || itemData.width;
    itemData.fullHeight = itemData.fullHeight || itemData.height;
    itemData.cropLeft = Math.max(0, itemData.cropLeft || 0);
    itemData.cropTop = Math.max(0, itemData.cropTop || 0);
    itemData.cropRight = Math.max(0, itemData.cropRight || 0);
    itemData.cropBottom = Math.max(0, itemData.cropBottom || 0);

    itemData.width = Math.max(20, itemData.fullWidth - itemData.cropLeft - itemData.cropRight);
    itemData.height = Math.max(20, itemData.fullHeight - itemData.cropTop - itemData.cropBottom);

    el.style.width = `${itemData.width}px`;
    el.style.height = `${itemData.height}px`;
    el.style.transform = `translate(${itemData.x}px, ${itemData.y}px) rotate(${itemData.rotation || 0}deg)`;

    const img = itemData.imgEl || el.querySelector('.ref-item-img');
    if (img) {
      img.style.width = `${itemData.fullWidth}px`;
      img.style.height = `${itemData.fullHeight}px`;
      img.style.transform = `translate(-${itemData.cropLeft}px, -${itemData.cropTop}px)`;
    }
  }

  // Helper: Find item located underneath current element at screen coordinates (Pass-through click)
  function getItemUnderPoint(clientX, clientY, currentItemEl) {
    if (!currentItemEl) return null;
    const oldPointerEvents = currentItemEl.style.pointerEvents;
    currentItemEl.style.pointerEvents = 'none';

    const targetEl = document.elementFromPoint(clientX, clientY);

    currentItemEl.style.pointerEvents = oldPointerEvents;

    if (!targetEl) return null;
    const refItemEl = targetEl.closest('.ref-item');
    if (refItemEl && refItemEl.id && itemsMap.has(refItemEl.id) && refItemEl.id !== currentItemEl.id) {
      return itemsMap.get(refItemEl.id);
    }
    return null;
  }

  // Bind Item Events
  function bindItemEvents(itemEl, itemData) {
    let isInteracting = false;
    let activeMode = null;
    let startX = 0, startY = 0;
    let initialX = 0, initialY = 0, initialW = 0, initialH = 0;
    let activeHandle = null;

    // Double click to enter / exit interactive mode for video/embed
    itemEl.addEventListener('dblclick', (e) => {
      if (!isModalOpen) return;
      if (e.target.closest('.ref-video-ctrl-bar')) {
        e.stopPropagation();
        return;
      }
      if (itemData.isEmbed) {
        e.stopPropagation();
        if (itemEl.classList.contains('is-interactive')) {
          exitInteractiveMode();
        } else {
          setInteractiveItem(itemData);
        }
      }
    });

    itemEl.addEventListener('mousedown', (e) => {
      if (!isModalOpen || spacePressed) return;

      const videoCtrl = e.target.closest('.ref-video-ctrl-bar');
      if (videoCtrl) {
        e.stopPropagation();
        if (!selectedItemIds.has(itemData.id)) {
          selectItem(itemData.id);
        }
        return;
      }

      const handleBtn = e.target.closest('.ref-handle');
      const tbBtn = e.target.closest('.ref-tb-btn');
      const interactBadge = e.target.closest('.ref-interactive-badge');

      if (interactBadge) {
        e.stopPropagation();
        exitInteractiveMode();
        return;
      }

      if (itemEl.classList.contains('is-interactive')) {
        if (!handleBtn && !tbBtn) {
          // Allow direct user interaction with video / YouTube controls
          return;
        }
      }

      if (tbBtn) {
        e.stopPropagation();
        const act = tbBtn.dataset.act;
        if (act === 'toggle-interact') {
          if (itemEl.classList.contains('is-interactive')) {
            exitInteractiveMode();
          } else {
            setInteractiveItem(itemData);
          }
          return;
        } else if (act === 'toggle-play') {
          const video = itemEl.querySelector('video');
          if (video) {
            if (video.paused) {
              video.play();
              tbBtn.textContent = '⏸️ พัก';
            } else {
              video.pause();
              tbBtn.textContent = '▶️ เล่น';
            }
          }
          return;
        } else if (act === 'toggle-mute') {
          const video = itemEl.querySelector('video');
          if (video) {
            video.muted = !video.muted;
            tbBtn.textContent = video.muted ? '🔇 เสียง' : '🔊 เปิดเสียง';
          }
          return;
        } else if (act === 'yt-toggle-play') {
          const iframe = itemEl.querySelector('iframe');
          if (iframe) {
            if (itemData.ytPlaying) {
              sendYouTubeCommand(iframe, 'pauseVideo');
              itemData.ytPlaying = false;
              tbBtn.textContent = '▶️ เล่น';
            } else {
              if (!itemData.ytMuted) {
                sendYouTubeCommand(iframe, 'unMute');
                sendYouTubeCommand(iframe, 'setVolume', [100]);
              }
              sendYouTubeCommand(iframe, 'playVideo');
              itemData.ytPlaying = true;
              tbBtn.textContent = '⏸️ พัก';
            }
          }
          return;
        } else if (act === 'yt-toggle-mute') {
          const iframe = itemEl.querySelector('iframe');
          if (iframe) {
            if (itemData.ytMuted) {
              sendYouTubeCommand(iframe, 'unMute');
              sendYouTubeCommand(iframe, 'setVolume', [100]);
              itemData.ytMuted = false;
              tbBtn.textContent = '🔇 ปิดเสียง';
              tbBtn.title = 'คลิกเพื่อปิดเสียง';
            } else {
              sendYouTubeCommand(iframe, 'mute');
              itemData.ytMuted = true;
              tbBtn.textContent = '🔊 เปิดเสียง';
              tbBtn.title = 'คลิกเพื่อเปิดเสียง';
            }
          }
          return;
        } else if (act === 'toggle-yt-mode') {
          itemData.showThumbnailOnly = !itemData.showThumbnailOnly;
          const crop = itemEl.querySelector('.ref-item-crop');
          if (crop) {
            if (itemData.showThumbnailOnly) {
              crop.innerHTML = `<img src="${itemData.thumbnailUrl}" class="ref-item-img" alt="thumbnail">`;
              tbBtn.textContent = '🎬 ดูวิดีโอ';
              const ytPlay = itemEl.querySelector('[data-act="yt-toggle-play"]');
              const ytMute = itemEl.querySelector('[data-act="yt-toggle-mute"]');
              if (ytPlay) ytPlay.style.display = 'none';
              if (ytMute) ytMute.style.display = 'none';
            } else {
              const shouldAutoplay = isBoardNormalMode();
              itemData.autoplay = shouldAutoplay;
              const embedSrc = sanitizeEmbedUrl(itemData.embedUrl, { autoplay: shouldAutoplay, mute: false });
              crop.innerHTML = `
                <iframe src="${embedSrc}" class="ref-item-img ref-item-embed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <div class="ref-embed-shield"></div>
              `;
              tbBtn.textContent = '🖼️ ภาพปก';
              const ytPlay = itemEl.querySelector('[data-act="yt-toggle-play"]');
              const ytMute = itemEl.querySelector('[data-act="yt-toggle-mute"]');
              if (ytPlay) ytPlay.style.display = '';
              if (ytMute) {
                ytMute.style.display = '';
                ytMute.textContent = itemData.ytMuted ? '🔊 เปิดเสียง' : '🔇 ปิดเสียง';
                ytMute.title = itemData.ytMuted ? 'คลิกเพื่อเปิดเสียง' : 'คลิกเพื่อปิดเสียง';
              }
              const newIframe = crop.querySelector('iframe');
              if (newIframe) {
                setupYouTubeIframeController(itemEl, itemData, newIframe);
              }
            }
            itemData.imgEl = crop.querySelector('.ref-item-img');
            updateItemDom(itemData);
          }
          return;
        } else if (act === 'open-source-link') {
          const targetUrl = itemData.embedUrl || itemData.url || itemData.dataUrl;
          if (targetUrl) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
          }
          return;
        } else if (act === 'palette') {
          let imgSrc = itemData.thumbnailUrl || itemData.src || (itemData.imgEl && itemData.imgEl.src) || itemData.dataUrl;
          if (itemData.isVideo) {
            const video = itemEl.querySelector('video') || itemData.imgEl;
            if (video) {
              try {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = video.videoWidth || video.clientWidth || 300;
                tempCanvas.height = video.videoHeight || video.clientHeight || 300;
                const ctx = tempCanvas.getContext('2d');
                ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
                imgSrc = tempCanvas.toDataURL('image/png');
              } catch (err) {
                console.warn('Cannot snapshot video frame:', err);
              }
            }
          }
          if (imgSrc && typeof window.extractPaletteFromImageSource === 'function') {
            const cpModal = document.getElementById('color-palette-modal');
            if (cpModal && !cpModal.classList.contains('open') && typeof window.toggleColorPalette === 'function') {
              window.toggleColorPalette();
            }
            window.extractPaletteFromImageSource(imgSrc);
          }
          return;
        } else if (act === 'front') {
          pushUndoState();
          selectedItemIds.forEach((sid) => {
            const sit = itemsMap.get(sid);
            const sel = document.getElementById(sid);
            if (sit && sel) {
              sit.zIndex = ++nextZIndex;
              sel.style.zIndex = sit.zIndex;
            }
          });
        } else if (act === 'back') {
          pushUndoState();
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
        } else if (act === 'ungroup') {
          ungroupVectorItem(itemData);
        }
        return;
      }

      const isShift = e.shiftKey || false;
      const isAlt = e.altKey || false;

      // Group Bounding Box Pass-Through Click: ONLY when Shift or Alt is explicitly held down by user
      if (itemData.isGroup && (isShift || isAlt)) {
        const passThroughItem = getItemUnderPoint(e.clientX, e.clientY, itemEl);
        if (passThroughItem) {
          e.stopPropagation();
          selectItem(passThroughItem.id, isShift);
          return;
        }
      }

      e.stopPropagation();
      selectItem(itemData.id, isShift);

      preDragSnapshot = captureSnapshot();

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

      let initialCropLeft = itemData.cropLeft || 0;
      let initialCropTop = itemData.cropTop || 0;
      let initialCropRight = itemData.cropRight || 0;
      let initialCropBottom = itemData.cropBottom || 0;
      let initialFullW = itemData.fullWidth || itemData.width;
      let initialFullH = itemData.fullHeight || itemData.height;

      let initialCropAspect = (initialW / (initialH || 1)) || itemData.aspect || 1;

      if (handleBtn) {
        activeHandle = handleBtn.dataset.handle;
        if (activeHandle === 'rot') {
          activeMode = 'rotate';
        } else if (activeHandle === 'ml' || activeHandle === 'mr' || activeHandle === 'mt' || activeHandle === 'mb') {
          activeMode = 'crop';
        } else {
          activeMode = 'resize';
        }

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

          // Drag-over visual hint for Color Palette Modal & FAB
          const cpModal = document.getElementById('color-palette-modal');
          if (cpModal && cpModal.classList.contains('open')) {
            const cpRect = cpModal.getBoundingClientRect();
            if (me.clientX >= cpRect.left && me.clientX <= cpRect.right &&
                me.clientY >= cpRect.top && me.clientY <= cpRect.bottom) {
              cpModal.classList.add('cp-dragover');
            } else {
              cpModal.classList.remove('cp-dragover');
            }
          }

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

          let newW = Math.max((distW + distH * initialCropAspect) / 2, 20);
          let newH = newW / initialCropAspect;

          let lcx = 0, lcy = 0;
          if (activeHandle === 'br') { lcx = newW / 2; lcy = newH / 2; }
          else if (activeHandle === 'tl') { lcx = -newW / 2; lcy = -newH / 2; }
          else if (activeHandle === 'tr') { lcx = newW / 2; lcy = -newH / 2; }
          else if (activeHandle === 'bl') { lcx = -newW / 2; lcy = newH / 2; }

          const newCx = anchorX + lcx * cos0 - lcy * sin0;
          const newCy = anchorY + lcx * sin0 + lcy * cos0;

          itemData.x = newCx - (newW / 2) * cos0 + (newH / 2) * sin0;
          itemData.y = newCy - (newW / 2) * sin0 - (newH / 2) * cos0;

          const scaleRatio = newW / (initialW || 1);
          itemData.fullWidth = initialFullW * scaleRatio;
          itemData.fullHeight = initialFullH * scaleRatio;
          itemData.cropLeft = initialCropLeft * scaleRatio;
          itemData.cropTop = initialCropTop * scaleRatio;
          itemData.cropRight = initialCropRight * scaleRatio;
          itemData.cropBottom = initialCropBottom * scaleRatio;

          updateItemDom(itemData);
        } else if (activeMode === 'crop') {
          const rawDx = (me.clientX - startX) / zoom;
          const rawDy = (me.clientY - startY) / zoom;

          const localDx = rawDx * cos0 + rawDy * sin0;
          const localDy = -rawDx * sin0 + rawDy * cos0;

          if (activeHandle === 'mr') {
            const maxCropRight = initialFullW - initialCropLeft - 20;
            const newCropRight = Math.max(0, Math.min(initialCropRight - localDx, maxCropRight));
            itemData.cropRight = newCropRight;
            itemData.fullWidth = initialFullW;
            itemData.fullHeight = initialFullH;
            itemData.cropLeft = initialCropLeft;
            itemData.cropTop = initialCropTop;
            itemData.cropBottom = initialCropBottom;
            itemData.x = initialX;
            itemData.y = initialY;
            updateItemDom(itemData);
          } else if (activeHandle === 'ml') {
            const maxCropLeft = initialFullW - initialCropRight - 20;
            const newCropLeft = Math.max(0, Math.min(initialCropLeft + localDx, maxCropLeft));
            itemData.cropLeft = newCropLeft;
            itemData.fullWidth = initialFullW;
            itemData.fullHeight = initialFullH;
            itemData.cropRight = initialCropRight;
            itemData.cropTop = initialCropTop;
            itemData.cropBottom = initialCropBottom;
            const deltaCropLeft = itemData.cropLeft - initialCropLeft;
            itemData.x = initialX + deltaCropLeft * cos0;
            itemData.y = initialY + deltaCropLeft * sin0;
            updateItemDom(itemData);
          } else if (activeHandle === 'mb') {
            const maxCropBottom = initialFullH - initialCropTop - 20;
            const newCropBottom = Math.max(0, Math.min(initialCropBottom - localDy, maxCropBottom));
            itemData.cropBottom = newCropBottom;
            itemData.fullWidth = initialFullW;
            itemData.fullHeight = initialFullH;
            itemData.cropLeft = initialCropLeft;
            itemData.cropTop = initialCropTop;
            itemData.cropRight = initialCropRight;
            itemData.x = initialX;
            itemData.y = initialY;
            updateItemDom(itemData);
          } else if (activeHandle === 'mt') {
            const maxCropTop = initialFullH - initialCropBottom - 20;
            const newCropTop = Math.max(0, Math.min(initialCropTop + localDy, maxCropTop));
            itemData.cropTop = newCropTop;
            itemData.fullWidth = initialFullW;
            itemData.fullHeight = initialFullH;
            itemData.cropLeft = initialCropLeft;
            itemData.cropRight = initialCropRight;
            itemData.cropBottom = initialCropBottom;
            const deltaCropTop = itemData.cropTop - initialCropTop;
            itemData.x = initialX - deltaCropTop * sin0;
            itemData.y = initialY + deltaCropTop * cos0;
            updateItemDom(itemData);
          }
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

      function onMouseUp(ue) {
        clearSmartGuides();

        let droppedOnPalette = false;
        const cpModal = document.getElementById('color-palette-modal');
        if (cpModal) {
          if (activeMode === 'move') {
            const endX = (ue && ue.clientX !== undefined) ? ue.clientX : startX;
            const endY = (ue && ue.clientY !== undefined) ? ue.clientY : startY;

            if (cpModal.classList.contains('open')) {
              const cpRect = cpModal.getBoundingClientRect();
              if (endX >= cpRect.left && endX <= cpRect.right &&
                  endY >= cpRect.top && endY <= cpRect.bottom) {
                droppedOnPalette = true;
                let imgSrc = itemData.src || (itemData.imgEl && itemData.imgEl.src) || itemData.dataUrl;
                if (itemData.isVideo) {
                  const video = itemData.imgEl || (itemData.el && itemData.el.querySelector('video'));
                  if (video) {
                    try {
                      const tempCanvas = document.createElement('canvas');
                      tempCanvas.width = video.videoWidth || video.clientWidth || 300;
                      tempCanvas.height = video.videoHeight || video.clientHeight || 300;
                      const ctx = tempCanvas.getContext('2d');
                      ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
                      imgSrc = tempCanvas.toDataURL('image/png');
                    } catch (err) {}
                  }
                }
                if (imgSrc && typeof window.extractPaletteFromImageSource === 'function') {
                  window.extractPaletteFromImageSource(imgSrc);
                }
              }
            } else {
              const fab = document.getElementById('palette-fab');
              if (fab) {
                const fabRect = fab.getBoundingClientRect();
                if (endX >= fabRect.left && endX <= fabRect.right &&
                    endY >= fabRect.top && endY <= fabRect.bottom) {
                  droppedOnPalette = true;
                  if (typeof window.toggleColorPalette === 'function') window.toggleColorPalette();
                  let imgSrc = itemData.src || (itemData.imgEl && itemData.imgEl.src) || itemData.dataUrl;
                  if (itemData.isVideo) {
                    const video = itemData.imgEl || (itemData.el && itemData.el.querySelector('video'));
                    if (video) {
                      try {
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = video.videoWidth || video.clientWidth || 300;
                        tempCanvas.height = video.videoHeight || video.clientHeight || 300;
                        const ctx = tempCanvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
                        imgSrc = tempCanvas.toDataURL('image/png');
                      } catch (err) {}
                    }
                  }
                  if (imgSrc && typeof window.extractPaletteFromImageSource === 'function') {
                    window.extractPaletteFromImageSource(imgSrc);
                  }
                }
              }
            }
          }
          cpModal.classList.remove('cp-dragover');
        }

        if (droppedOnPalette) {
          // Restore item position on reference board so it stays cleanly in place
          if (preDragSnapshot) {
            restoreSnapshot(preDragSnapshot);
          } else {
            itemData.x = initialX;
            itemData.y = initialY;
            updateItemDom(itemData);
          }
        } else {
          commitDragState();
        }

        isInteracting = false;
        activeMode = null;
        removeActiveWindowListener('mousemove', onMouseMove);
        removeActiveWindowListener('mouseup', onMouseUp);
      }

      addActiveWindowListener('mousemove', onMouseMove);
      addActiveWindowListener('mouseup', onMouseUp);
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

      let initialCropLeft = itemData.cropLeft || 0;
      let initialCropTop = itemData.cropTop || 0;
      let initialCropRight = itemData.cropRight || 0;
      let initialCropBottom = itemData.cropBottom || 0;
      let initialFullW = itemData.fullWidth || itemData.width;
      let initialFullH = itemData.fullHeight || itemData.height;

      let initialCropAspect = (initialW / (initialH || 1)) || itemData.aspect || 1;

      if (handleBtn) {
        activeHandle = handleBtn.dataset.handle;
        if (activeHandle === 'rot') {
          activeMode = 'rotate';
        } else if (activeHandle === 'ml' || activeHandle === 'mr' || activeHandle === 'mt' || activeHandle === 'mb') {
          activeMode = 'crop';
        } else {
          activeMode = 'resize';
        }

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

          // Drag-over visual hint for Color Palette Modal
          const cpModal = document.getElementById('color-palette-modal');
          if (cpModal && cpModal.classList.contains('open')) {
            const cpRect = cpModal.getBoundingClientRect();
            if (t.clientX >= cpRect.left && t.clientX <= cpRect.right &&
                t.clientY >= cpRect.top && t.clientY <= cpRect.bottom) {
              cpModal.classList.add('cp-dragover');
            } else {
              cpModal.classList.remove('cp-dragover');
            }
          }

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

          let newW = Math.max((distW + distH * initialCropAspect) / 2, 20);
          let newH = newW / initialCropAspect;

          let lcx = 0, lcy = 0;
          if (activeHandle === 'br') { lcx = newW / 2; lcy = newH / 2; }
          else if (activeHandle === 'tl') { lcx = -newW / 2; lcy = -newH / 2; }
          else if (activeHandle === 'tr') { lcx = newW / 2; lcy = -newH / 2; }
          else if (activeHandle === 'bl') { lcx = -newW / 2; lcy = newH / 2; }

          const newCx = anchorX + lcx * cos0 - lcy * sin0;
          const newCy = anchorY + lcx * sin0 + lcy * cos0;

          itemData.x = newCx - (newW / 2) * cos0 + (newH / 2) * sin0;
          itemData.y = newCy - (newW / 2) * sin0 - (newH / 2) * cos0;

          const scaleRatio = newW / (initialW || 1);
          itemData.fullWidth = initialFullW * scaleRatio;
          itemData.fullHeight = initialFullH * scaleRatio;
          itemData.cropLeft = initialCropLeft * scaleRatio;
          itemData.cropTop = initialCropTop * scaleRatio;
          itemData.cropRight = initialCropRight * scaleRatio;
          itemData.cropBottom = initialCropBottom * scaleRatio;

          updateItemDom(itemData);
        } else if (activeMode === 'crop') {
          const rawDx = (t.clientX - startX) / zoom;
          const rawDy = (t.clientY - startY) / zoom;

          const localDx = rawDx * cos0 + rawDy * sin0;
          const localDy = -rawDx * sin0 + rawDy * cos0;

          if (activeHandle === 'mr') {
            const maxCropRight = initialFullW - initialCropLeft - 20;
            const newCropRight = Math.max(0, Math.min(initialCropRight - localDx, maxCropRight));
            itemData.cropRight = newCropRight;
            itemData.fullWidth = initialFullW;
            itemData.fullHeight = initialFullH;
            itemData.cropLeft = initialCropLeft;
            itemData.cropTop = initialCropTop;
            itemData.cropBottom = initialCropBottom;
            itemData.x = initialX;
            itemData.y = initialY;
            updateItemDom(itemData);
          } else if (activeHandle === 'ml') {
            const maxCropLeft = initialFullW - initialCropRight - 20;
            const newCropLeft = Math.max(0, Math.min(initialCropLeft + localDx, maxCropLeft));
            itemData.cropLeft = newCropLeft;
            itemData.fullWidth = initialFullW;
            itemData.fullHeight = initialFullH;
            itemData.cropRight = initialCropRight;
            itemData.cropTop = initialCropTop;
            itemData.cropBottom = initialCropBottom;
            const deltaCropLeft = itemData.cropLeft - initialCropLeft;
            itemData.x = initialX + deltaCropLeft * cos0;
            itemData.y = initialY + deltaCropLeft * sin0;
            updateItemDom(itemData);
          } else if (activeHandle === 'mb') {
            const maxCropBottom = initialFullH - initialCropTop - 20;
            const newCropBottom = Math.max(0, Math.min(initialCropBottom - localDy, maxCropBottom));
            itemData.cropBottom = newCropBottom;
            itemData.fullWidth = initialFullW;
            itemData.fullHeight = initialFullH;
            itemData.cropLeft = initialCropLeft;
            itemData.cropTop = initialCropTop;
            itemData.cropRight = initialCropRight;
            itemData.x = initialX;
            itemData.y = initialY;
            updateItemDom(itemData);
          } else if (activeHandle === 'mt') {
            const maxCropTop = initialFullH - initialCropBottom - 20;
            const newCropTop = Math.max(0, Math.min(initialCropTop + localDy, maxCropTop));
            itemData.cropTop = newCropTop;
            itemData.fullWidth = initialFullW;
            itemData.fullHeight = initialFullH;
            itemData.cropLeft = initialCropLeft;
            itemData.cropRight = initialCropRight;
            itemData.cropBottom = initialCropBottom;
            const deltaCropTop = itemData.cropTop - initialCropTop;
            itemData.x = initialX - deltaCropTop * sin0;
            itemData.y = initialY + deltaCropTop * cos0;
            updateItemDom(itemData);
          }
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

      function onTouchEnd(te) {
        clearSmartGuides();

        let droppedOnPalette = false;
        const cpModal = document.getElementById('color-palette-modal');
        if (cpModal) {
          if (activeMode === 'move') {
            const endX = (te && te.changedTouches && te.changedTouches[0]) ? te.changedTouches[0].clientX : startX;
            const endY = (te && te.changedTouches && te.changedTouches[0]) ? te.changedTouches[0].clientY : startY;

            if (cpModal.classList.contains('open')) {
              const cpRect = cpModal.getBoundingClientRect();
              if (endX >= cpRect.left && endX <= cpRect.right &&
                  endY >= cpRect.top && endY <= cpRect.bottom) {
                droppedOnPalette = true;
                let imgSrc = itemData.src || (itemData.imgEl && itemData.imgEl.src) || itemData.dataUrl;
                if (itemData.isVideo) {
                  const video = itemData.imgEl || (itemData.el && itemData.el.querySelector('video'));
                  if (video) {
                    try {
                      const tempCanvas = document.createElement('canvas');
                      tempCanvas.width = video.videoWidth || video.clientWidth || 300;
                      tempCanvas.height = video.videoHeight || video.clientHeight || 300;
                      const ctx = tempCanvas.getContext('2d');
                      ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
                      imgSrc = tempCanvas.toDataURL('image/png');
                    } catch (err) {}
                  }
                }
                if (imgSrc && typeof window.extractPaletteFromImageSource === 'function') {
                  window.extractPaletteFromImageSource(imgSrc);
                }
              }
            } else {
              const fab = document.getElementById('palette-fab');
              if (fab) {
                const fabRect = fab.getBoundingClientRect();
                if (endX >= fabRect.left && endX <= fabRect.right &&
                    endY >= fabRect.top && endY <= fabRect.bottom) {
                  droppedOnPalette = true;
                  if (typeof window.toggleColorPalette === 'function') window.toggleColorPalette();
                  let imgSrc = itemData.src || (itemData.imgEl && itemData.imgEl.src) || itemData.dataUrl;
                  if (itemData.isVideo) {
                    const video = itemData.imgEl || (itemData.el && itemData.el.querySelector('video'));
                    if (video) {
                      try {
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = video.videoWidth || video.clientWidth || 300;
                        tempCanvas.height = video.videoHeight || video.clientHeight || 300;
                        const ctx = tempCanvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
                        imgSrc = tempCanvas.toDataURL('image/png');
                      } catch (err) {}
                    }
                  }
                  if (imgSrc && typeof window.extractPaletteFromImageSource === 'function') {
                    window.extractPaletteFromImageSource(imgSrc);
                  }
                }
              }
            }
          }
          cpModal.classList.remove('cp-dragover');
        }

        if (droppedOnPalette) {
          if (preDragSnapshot) {
            restoreSnapshot(preDragSnapshot);
          } else {
            itemData.x = initialX;
            itemData.y = initialY;
            updateItemDom(itemData);
          }
        } else {
          commitDragState();
        }

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

    const toolbar = itemEl.querySelector('.ref-item-toolbar');
    if (toolbar) {
      toolbar.addEventListener('click', (e) => {
        const tbBtn = e.target.closest('.ref-tb-btn');
        if (!tbBtn) return;
        e.stopPropagation();

        const act = tbBtn.dataset.act;
        if (act === 'front') {
          pushUndoState();
          itemData.zIndex = ++nextZIndex;
          itemEl.style.zIndex = itemData.zIndex;
        } else if (act === 'back') {
          pushUndoState();
          itemData.zIndex = 1;
          itemEl.style.zIndex = 1;
        } else if (act === 'del') {
          deleteItem(itemData.id);
        } else if (act === 'ungroup') {
          ungroupVectorItem(itemData);
        }
      });
    }
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
    exitInteractiveMode();
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
    pushUndoState();
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
    groupBoxEl.style.zIndex = Math.max(9998, (typeof nextZIndex === 'number' ? nextZIndex : 100) + 10);
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
      if (act === 'regroup') {
        regroupSelectedItems();
      } else if (act === 'front') {
        pushUndoState();
        selectedItemIds.forEach((sid) => {
          const sit = itemsMap.get(sid);
          const sel = document.getElementById(sid);
          if (sit && sel) {
            sit.zIndex = ++nextZIndex;
            sel.style.zIndex = sit.zIndex;
          }
        });
      } else if (act === 'back') {
        pushUndoState();
        selectedItemIds.forEach((sid) => {
          const sit = itemsMap.get(sid);
          const sel = document.getElementById(sid);
          if (sit && sel) {
            sit.zIndex = 1;
            sel.style.zIndex = 1;
          }
        });
      } else if (act === 'del') {
        pushUndoState();
        const ids = Array.from(selectedItemIds);
        ids.forEach((id) => deleteItem(id));
      }
    });

    groupBoxEl.addEventListener('mousedown', (e) => {
      if (!isModalOpen || spacePressed || e.target.closest('.ref-tb-btn')) return;

      const handleBtn = e.target.closest('.ref-handle');

      if (handleBtn) {
        e.stopPropagation();
        preDragSnapshot = captureSnapshot();
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
            fullWidth: it.fullWidth || it.width,
            fullHeight: it.fullHeight || it.height,
            cropLeft: it.cropLeft || 0,
            cropTop: it.cropTop || 0,
            cropRight: it.cropRight || 0,
            cropBottom: it.cropBottom || 0,
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
                const offsetX = st.x - anchorX;
                const offsetY = st.y - anchorY;

                sitem.x = anchorX + offsetX * scaleRatio;
                sitem.y = anchorY + offsetY * scaleRatio;

                sitem.fullWidth = Math.max(st.fullWidth * scaleRatio, 20);
                sitem.fullHeight = sitem.fullWidth / (st.aspect || 1);
                sitem.cropLeft = st.cropLeft * scaleRatio;
                sitem.cropTop = st.cropTop * scaleRatio;
                sitem.cropRight = st.cropRight * scaleRatio;
                sitem.cropBottom = st.cropBottom * scaleRatio;

                updateItemDom(sitem);
              }
            });
          }

          updateSelectionBox();
        }

        function onGroupUp() {
          removeActiveWindowListener('mousemove', onGroupMove);
          removeActiveWindowListener('mouseup', onGroupUp);
          commitDragState();
        }

        addActiveWindowListener('mousemove', onGroupMove);
        addActiveWindowListener('mouseup', onGroupUp);
        return;
      }

      let isGroupDragging = true;
      const startX = e.clientX;
      const startY = e.clientY;
      preDragSnapshot = captureSnapshot();

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
        removeActiveWindowListener('mousemove', onMove);
        removeActiveWindowListener('mouseup', onUp);
        commitDragState();
      }

      addActiveWindowListener('mousemove', onMove);
      addActiveWindowListener('mouseup', onUp);
    });
  }

  // Ensure Canvas Utility Elements (#refboard-marquee-box and #refboard-group-box) always exist
  function ensureCanvasUtilityElements() {
    if (!canvasEl) return;
    let marqueeBoxEl = document.getElementById('refboard-marquee-box');
    if (!marqueeBoxEl) {
      marqueeBoxEl = document.createElement('div');
      marqueeBoxEl.id = 'refboard-marquee-box';
      marqueeBoxEl.className = 'refboard-marquee-box';
      canvasEl.prepend(marqueeBoxEl);
    }
    let groupBoxEl = document.getElementById('refboard-group-box');
    if (!groupBoxEl) {
      groupBoxEl = document.createElement('div');
      groupBoxEl.id = 'refboard-group-box';
      groupBoxEl.className = 'refboard-group-box';
      groupBoxEl.innerHTML = `
        <div class="ref-handle ref-handle-tl" data-ghandle="tl"></div>
        <div class="ref-handle ref-handle-tr" data-ghandle="tr"></div>
        <div class="ref-handle ref-handle-bl" data-ghandle="bl"></div>
        <div class="ref-handle ref-handle-br" data-ghandle="br"></div>
        <div class="ref-handle ref-handle-rot" data-ghandle="rot"></div>

        <div class="ref-item-toolbar ref-group-toolbar">
          <button class="ref-tb-btn btn-regroup" data-gact="regroup" title="รวมกลุ่มรูปภาพที่เลือกไว้ด้วยกัน">📦 รวมกลุ่ม</button>
          <button class="ref-tb-btn" data-gact="front" title="นำกลุ่มขึ้นหน้าสุด">⬆ ขึ้นหน้า</button>
          <button class="ref-tb-btn" data-gact="back" title="ส่งกลุ่มไปหลังสุด">⬇ ลงหลัง</button>
          <button class="ref-tb-btn del-btn" data-gact="del" title="ลบรูปในกลุ่มทั้งหมด">🗑️ ลบ</button>
        </div>
      `;
      canvasEl.prepend(groupBoxEl);
      setupGroupEvents();
    }
  }

  // Clear Board safely without destroying canvas utility controls
  function clearBoard() {
    pushUndoState();
    deselectAll();
    if (canvasEl) {
      canvasEl.querySelectorAll('.ref-item, .refboard-smart-line').forEach((el) => el.remove());
    }
    itemsMap.clear();
    selectedItemId = null;
    selectedItemIds.clear();
    ensureCanvasUtilityElements();
    updateSelectionBox();
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

  // Clipboard System (Copy / Cut / Paste)
  function copySelectedItems() {
    if (!isModalOpen || selectedItemIds.size === 0) return;
    const selected = Array.from(selectedItemIds).map((id) => itemsMap.get(id)).filter(Boolean);
    if (selected.length === 0) return;

    internalClipboard = selected.map((it) => ({
      dataUrl: it.dataUrl,
      isVideo: Boolean(it.isVideo),
      isEmbed: Boolean(it.isEmbed),
      embedType: it.embedType || null,
      embedUrl: it.embedUrl || null,
      thumbnailUrl: it.thumbnailUrl || null,
      showThumbnailOnly: Boolean(it.showThumbnailOnly),
      title: it.title || null,
      mediaType: it.mediaType || (it.isVideo ? 'video' : (it.isEmbed ? 'embed' : 'image')),
      svgContent: it.svgContent || null,
      isVector: Boolean(it.isVector),
      isPdfPage: Boolean(it.isPdfPage),
      isGroup: Boolean(it.isGroup),
      originalItems: it.originalItems ? JSON.parse(JSON.stringify(it.originalItems)) : null,
      initialGroupX: it.initialGroupX,
      initialGroupY: it.initialGroupY,
      initialGroupWidth: it.initialGroupWidth,
      initialGroupHeight: it.initialGroupHeight,
      x: it.x,
      y: it.y,
      width: it.width,
      height: it.height,
      aspect: it.aspect,
      rotation: it.rotation || 0,
      cropLeft: it.cropLeft || 0,
      cropTop: it.cropTop || 0,
      cropRight: it.cropRight || 0,
      cropBottom: it.cropBottom || 0,
      fullWidth: it.fullWidth || it.width,
      fullHeight: it.fullHeight || it.height
    }));

    if (selected.length === 1 && navigator.clipboard && window.ClipboardItem && !selected[0].isVideo) {
      try {
        fetch(selected[0].dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            navigator.clipboard.write([new ClipboardItem({ [blob.type || 'image/png']: blob })]).catch(() => {});
          })
          .catch(() => {});
      } catch (err) {}
    }
  }

  function cutSelectedItems() {
    if (!isModalOpen || selectedItemIds.size === 0) return;
    copySelectedItems();
    pushUndoState();
    const ids = Array.from(selectedItemIds);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
      itemsMap.delete(id);
    });
    deselectAll();
    updateItemCount();
  }

  function pasteInternalClipboard() {
    if (!isModalOpen || internalClipboard.length === 0) return false;
    pushUndoState();
    deselectAll();

    const pastedIds = [];
    const offset = 30;

    internalClipboard.forEach((it, i) => {
      const newX = it.x + offset;
      const newY = it.y + offset;
      it.x = newX;
      it.y = newY;

      const newId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5) + '_' + i;
      const newItem = {
        id: newId,
        dataUrl: it.dataUrl,
        isVideo: Boolean(it.isVideo),
        isEmbed: Boolean(it.isEmbed),
        embedType: it.embedType || null,
        embedUrl: it.embedUrl || null,
        thumbnailUrl: it.thumbnailUrl || null,
        showThumbnailOnly: Boolean(it.showThumbnailOnly),
        title: it.title || null,
        mediaType: it.mediaType || (it.isVideo ? 'video' : (it.isEmbed ? 'embed' : 'image')),
        svgContent: it.svgContent || null,
        isVector: Boolean(it.isVector),
        isPdfPage: Boolean(it.isPdfPage),
        isGroup: Boolean(it.isGroup),
        originalItems: it.originalItems ? JSON.parse(JSON.stringify(it.originalItems)) : null,
        initialGroupX: it.initialGroupX,
        initialGroupY: it.initialGroupY,
        initialGroupWidth: it.initialGroupWidth,
        initialGroupHeight: it.initialGroupHeight,
        x: newX,
        y: newY,
        width: it.width,
        height: it.height,
        aspect: it.aspect,
        rotation: it.rotation,
        zIndex: ++nextZIndex,
        cropLeft: it.cropLeft,
        cropTop: it.cropTop,
        cropRight: it.cropRight,
        cropBottom: it.cropBottom,
        fullWidth: it.fullWidth,
        fullHeight: it.fullHeight
      };

      createRefImageItem(newItem);
      pastedIds.push(newId);
    });

    pastedIds.forEach((id) => selectItem(id, true));
    return true;
  }

  // Undo & Redo System Functions
  function captureSnapshot() {
    return Array.from(itemsMap.values()).map((item) => ({
      id: item.id,
      dataUrl: item.dataUrl,
      isVideo: Boolean(item.isVideo),
      isEmbed: Boolean(item.isEmbed),
      embedType: item.embedType || null,
      embedUrl: item.embedUrl || null,
      thumbnailUrl: item.thumbnailUrl || null,
      showThumbnailOnly: Boolean(item.showThumbnailOnly),
      title: item.title || null,
      mediaType: item.mediaType || (item.isVideo ? 'video' : (item.isEmbed ? 'embed' : 'image')),
      svgContent: item.svgContent || null,
      isVector: Boolean(item.isVector),
      isPdfPage: Boolean(item.isPdfPage),
      isGroup: Boolean(item.isGroup),
      originalItems: item.originalItems ? JSON.parse(JSON.stringify(item.originalItems)) : null,
      initialGroupX: item.initialGroupX,
      initialGroupY: item.initialGroupY,
      initialGroupWidth: item.initialGroupWidth,
      initialGroupHeight: item.initialGroupHeight,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      aspect: item.aspect,
      rotation: item.rotation || 0,
      zIndex: item.zIndex,
      cropLeft: item.cropLeft || 0,
      cropTop: item.cropTop || 0,
      cropRight: item.cropRight || 0,
      cropBottom: item.cropBottom || 0,
      fullWidth: item.fullWidth || item.width,
      fullHeight: item.fullHeight || item.height
    }));
  }

  function pushUndoState() {
    const snapshot = captureSnapshot();
    undoStack.push(snapshot);
    if (undoStack.length > MAX_UNDO_STEPS) {
      undoStack.shift();
    }
    redoStack.length = 0;
    updateUndoRedoUI();
  }

  function isStateChanged(prevSnapshot) {
    if (!prevSnapshot) return false;
    const current = captureSnapshot();
    if (current.length !== prevSnapshot.length) return true;
    for (let i = 0; i < current.length; i++) {
      const c = current[i];
      const p = prevSnapshot[i];
      if (!p) return true;
      if (
        c.id !== p.id ||
        c.x !== p.x ||
        c.y !== p.y ||
        c.width !== p.width ||
        c.height !== p.height ||
        c.rotation !== p.rotation ||
        c.zIndex !== p.zIndex ||
        c.cropLeft !== p.cropLeft ||
        c.cropTop !== p.cropTop ||
        c.cropRight !== p.cropRight ||
        c.cropBottom !== p.cropBottom
      ) {
        return true;
      }
    }
    return false;
  }

  function commitDragState() {
    if (preDragSnapshot && isStateChanged(preDragSnapshot)) {
      undoStack.push(preDragSnapshot);
      if (undoStack.length > MAX_UNDO_STEPS) {
        undoStack.shift();
      }
      redoStack.length = 0;
      updateUndoRedoUI();
    }
    preDragSnapshot = null;
  }

  function updateUndoRedoUI() {
    const undoBtn = document.getElementById('refboard-undo-btn');
    const redoBtn = document.getElementById('refboard-redo-btn');
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
  }

  function undo() {
    if (undoStack.length === 0) return;
    const currentSnapshot = captureSnapshot();
    redoStack.push(currentSnapshot);
    const previousSnapshot = undoStack.pop();
    restoreSnapshot(previousSnapshot);
    updateUndoRedoUI();
  }

  function redo() {
    if (redoStack.length === 0) return;
    const currentSnapshot = captureSnapshot();
    undoStack.push(currentSnapshot);
    const nextSnapshot = redoStack.pop();
    restoreSnapshot(nextSnapshot);
    updateUndoRedoUI();
  }

  function restoreSnapshot(snapshot) {
    if (!snapshot) return;
    deselectAll();

    const snapshotMap = new Map();
    snapshot.forEach((it) => snapshotMap.set(it.id, it));

    itemsMap.forEach((item, id) => {
      if (!snapshotMap.has(id)) {
        const el = item.el || document.getElementById(id);
        if (el) el.remove();
        itemsMap.delete(id);
        selectedItemIds.delete(id);
      }
    });

    snapshot.forEach((snapItem) => {
      if (itemsMap.has(snapItem.id)) {
        const existingItem = itemsMap.get(snapItem.id);
        Object.assign(existingItem, snapItem);
        updateItemDom(existingItem);
        if (existingItem.el) existingItem.el.style.zIndex = existingItem.zIndex;
      } else {
        createRefImageItemFromSnapshot(snapItem);
      }
    });

    updateItemCount();
    updateSelectionBox();
  }

  function createRefImageItemFromSnapshot(itemData) {
    prepareGroupItemData(itemData);
    const cloned = Object.assign({}, itemData);
    itemsMap.set(cloned.id, cloned);

    const itemEl = document.createElement('div');
    itemEl.id = cloned.id;
    itemEl.className = 'ref-item' + (cloned.isVideo ? ' is-video' : '') + (cloned.isEmbed ? ' is-embed' : '');
    itemEl.style.transform = `translate(${cloned.x}px, ${cloned.y}px) rotate(${cloned.rotation || 0}deg)`;
    itemEl.style.width = `${cloned.width}px`;
    itemEl.style.height = `${cloned.height}px`;
    itemEl.style.zIndex = cloned.zIndex;

    const canUngroup = Boolean(
      cloned.isGroup ||
      (cloned.originalItems && cloned.originalItems.length > 0)
    );

    let mediaHtml = '';
    if (cloned.isEmbed) {
      if (cloned.showThumbnailOnly && cloned.thumbnailUrl) {
        mediaHtml = `<img src="${cloned.thumbnailUrl}" class="ref-item-img" alt="thumbnail">`;
      } else {
        const embedSrc = sanitizeEmbedUrl(cloned.embedUrl);
        mediaHtml = `
          <iframe src="${embedSrc}" class="ref-item-img ref-item-embed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          <div class="ref-embed-shield"></div>
        `;
      }
    } else if (cloned.isVideo) {
      mediaHtml = `
        <video src="${cloned.dataUrl}" class="ref-item-img ref-item-video" autoplay loop muted playsinline></video>
        ${renderVideoControlsHtml(cloned)}
      `;
    } else {
      mediaHtml = `<img src="${cloned.dataUrl}" class="ref-item-img" alt="ref">`;
    }

    itemEl.innerHTML = `
      <div class="ref-interactive-badge" data-act="exit-interact" title="คลิกเพื่อสิ้นสุดโหมดโต้ตอบ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>โหมดโต้ตอบ (คลิกเพื่อเสร็จสิ้น)</span>
        <span class="ref-badge-close">✕</span>
      </div>
      <div class="ref-item-crop">
        ${mediaHtml}
      </div>
      <div class="ref-handle ref-handle-tl" data-handle="tl"></div>
      <div class="ref-handle ref-handle-tr" data-handle="tr"></div>
      <div class="ref-handle ref-handle-bl" data-handle="bl"></div>
      <div class="ref-handle ref-handle-br" data-handle="br"></div>
      <div class="ref-handle ref-handle-ml" data-handle="ml"></div>
      <div class="ref-handle ref-handle-mr" data-handle="mr"></div>
      <div class="ref-handle ref-handle-mt" data-handle="mt"></div>
      <div class="ref-handle ref-handle-mb" data-handle="mb"></div>
      <div class="ref-handle ref-handle-rot" data-handle="rot"></div>
      
      <div class="ref-item-toolbar">
        <button class="ref-tb-btn btn-palette" data-act="palette" title="สกัดชุดสีจากภาพหรือเฟรมวิดีโอนี้ (ส่งไปยัง Color Generator)">🎨 สกัดสี</button>
        ${(cloned.isEmbed && !cloned.showThumbnailOnly) ? `
          <button class="ref-tb-btn btn-interact" data-act="toggle-interact" title="เปิดโหมดโต้ตอบ/ควบคุมคลิปนี้ (หรือดับเบิ้ลคลิกที่คลิป)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:-1px; margin-right:3px;">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>โต้ตอบ
          </button>
        ` : ''}
        ${(cloned.embedType === 'youtube' && !cloned.showThumbnailOnly) ? `
          <button class="ref-tb-btn btn-playpause btn-yt-playpause" data-act="yt-toggle-play" title="เล่น / พัก YouTube">⏸️ พัก</button>
          <button class="ref-tb-btn btn-mute btn-yt-mute" data-act="yt-toggle-mute" title="คลิกเพื่อปิดเสียง">🔇 ปิดเสียง</button>
        ` : ''}
        ${cloned.embedType === 'youtube' ? `
          <button class="ref-tb-btn" data-act="toggle-yt-mode" title="สลับระหว่างวิดีโอ YouTube และภาพปก">${cloned.showThumbnailOnly ? '🎬 ดูวิดีโอ' : '🖼️ ภาพปก'}</button>
        ` : ''}
        ${cloned.isEmbed && cloned.embedUrl ? `
          <button class="ref-tb-btn" data-act="open-source-link" title="เปิดลิงก์ต้นทาง">🔗 เปิดลิงก์</button>
        ` : ''}
        ${canUngroup ? '<button class="ref-tb-btn btn-ungroup" data-act="ungroup" title="แยกกลุ่มรูปภาพออกเป็นชิ้นย่อย">🧩 แยกกลุ่ม</button>' : ''}
        <button class="ref-tb-btn" data-act="front" title="นำขึ้นหน้าสุด">⬆ ขึ้นหน้า</button>
        <button class="ref-tb-btn" data-act="back" title="ส่งไปหลังสุด">⬇ ลงหลัง</button>
        <button class="ref-tb-btn del-btn" data-act="del" title="ลบ">🗑️ ลบ</button>
      </div>
    `;

    canvasEl.appendChild(itemEl);
    cloned.el = itemEl;
    cloned.imgEl = itemEl.querySelector('.ref-item-img');

    if (cloned.imgEl && canUngroup) {
      cloned.imgEl.addEventListener('error', () => {
        if (cloned.originalItems && cloned.originalItems.length > 0 && !itemEl._hasRetriedSvg) {
          itemEl._hasRetriedSvg = true;
          let minX = cloned.initialGroupX;
          let minY = cloned.initialGroupY;
          if (minX === undefined || minX === null) {
            minX = Math.min(...cloned.originalItems.map((it) => it.x));
            minY = Math.min(...cloned.originalItems.map((it) => it.y));
          }
          const gw = cloned.initialGroupWidth || cloned.width || 400;
          const gh = cloned.initialGroupHeight || cloned.height || 400;
          cloned.svgContent = buildGroupSvgString(cloned.originalItems, gw, gh, minX, minY);
          if (cloned.svgContent) {
            try {
              const blob = new Blob([cloned.svgContent], { type: 'image/svg+xml' });
              cloned.dataUrl = URL.createObjectURL(blob);
              cloned.imgEl.src = cloned.dataUrl;
            } catch (err) {}
          }
        }
      });
    }

    bindItemEvents(itemEl, cloned);
    if (cloned.embedType === 'youtube') {
      const ytIframe = itemEl.querySelector('iframe');
      if (ytIframe) {
        setupYouTubeIframeController(itemEl, cloned, ytIframe);
      }
    }
    if (cloned.isVideo) {
      setupVideoController(itemEl, cloned);
    }
    updateItemDom(cloned);
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
    const selectedTag = document.getElementById('ref-fmt-selected-tag');

    const fmtNames = {
      png: 'PNG Image',
      jpg: 'JPG Image',
      psd: 'Photoshop PSD',
      refboard: 'RefBoard File',
      pdf: 'PDF Document'
    };
    if (selectedTag) selectedTag.textContent = fmtNames[fmt] || fmt.toUpperCase();

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
    const formatCards = document.querySelectorAll('.refboard-exp-format-card');
    const pdfCards = document.querySelectorAll('.refboard-exp-pdf-card');

    if (closeBtn) closeBtn.addEventListener('click', closeExportModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeExportModal);

    formatCards.forEach((card) => {
      card.addEventListener('click', () => {
        formatCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        const fmt = card.dataset.fmt;
        updateExportSettingsVisibility(fmt);
      });
    });

    pdfCards.forEach((card) => {
      card.addEventListener('click', () => {
        pdfCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    if (scaleSlider) {
      scaleSlider.addEventListener('input', () => {
        if (scaleVal) scaleVal.textContent = `${scaleSlider.value}%`;
      });
    }

    if (qualitySlider) {
      qualitySlider.addEventListener('input', () => {
        if (qualityVal) qualityVal.textContent = `${qualitySlider.value}%`;
      });
    }

    if (submitBtn) submitBtn.addEventListener('click', executeExport);
  }

  function openExportModal() {
    exportModalEl.classList.add('open');
    const activeOpt = document.querySelector('.refboard-exp-format-card.active');
    const fmt = activeOpt ? activeOpt.dataset.fmt : 'png';
    updateExportSettingsVisibility(fmt);
  }

  function closeExportModal() {
    exportModalEl.classList.remove('open');
  }

  function showExportLoading(title = 'กำลังสร้างไฟล์...', msg = 'กำลังจัดเตรียมรูปภาพและประมวลผลไฟล์ กรุณารอสักครู่ครับ') {
    const loadingBackdrop = document.getElementById('refboard-export-loading-backdrop');
    const titleEl = document.getElementById('refboard-exp-loading-title');
    const msgEl = document.getElementById('refboard-exp-loading-msg');
    const fillEl = document.getElementById('refboard-exp-progress-fill');
    const numEl = document.getElementById('refboard-exp-progress-num');
    const statusEl = document.getElementById('refboard-exp-progress-status');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = msg;
    if (fillEl) fillEl.style.width = '0%';
    if (numEl) numEl.textContent = '0%';
    if (statusEl) statusEl.textContent = 'เริ่มต้นประมวลผล';

    if (loadingBackdrop) loadingBackdrop.classList.add('open');
  }

  function updateExportProgress(percent, statusText, msgText) {
    const fillEl = document.getElementById('refboard-exp-progress-fill');
    const numEl = document.getElementById('refboard-exp-progress-num');
    const statusEl = document.getElementById('refboard-exp-progress-status');
    const msgEl = document.getElementById('refboard-exp-loading-msg');

    const safePercent = Math.min(100, Math.max(0, Math.round(percent)));
    if (fillEl) fillEl.style.width = `${safePercent}%`;
    if (numEl) numEl.textContent = `${safePercent}%`;
    if (statusText && statusEl) statusEl.textContent = statusText;
    if (msgText && msgEl) msgEl.textContent = msgText;
  }

  function hideExportLoading() {
    const loadingBackdrop = document.getElementById('refboard-export-loading-backdrop');
    if (loadingBackdrop) loadingBackdrop.classList.remove('open');
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
    const selectedOpt = document.querySelector('.refboard-exp-format-card.active');
    const fmt = selectedOpt ? selectedOpt.dataset.fmt : 'png';
    const scale = parseInt(document.getElementById('ref-scale-slider').value) / 100;
    const quality = parseInt(document.getElementById('ref-quality-slider').value) / 100;

    closeExportModal();

    const fmtTitles = {
      png: 'กำลังสร้างไฟล์ PNG...',
      jpg: 'กำลังสร้างไฟล์ JPG...',
      psd: 'กำลังสร้างไฟล์ Photoshop PSD...',
      refboard: 'กำลังสร้างไฟล์ RefBoard...',
      pdf: 'กำลังสร้างไฟล์ PDF...'
    };

    showExportLoading(fmtTitles[fmt] || 'กำลังสร้างไฟล์...', 'กำลังจัดเตรียมรูปภาพและประมวลผลไฟล์ กรุณารอสักครู่ครับ');

    setTimeout(() => {
      if (fmt === 'refboard') {
        exportAsRefBoardFile();
      } else if (fmt === 'psd') {
        exportAsPsdFile(scale);
      } else if (fmt === 'pdf') {
        const pdfModeOpt = document.querySelector('.refboard-exp-pdf-card.active');
        const pdfMode = pdfModeOpt ? pdfModeOpt.dataset.pdfmode : 'single';
        exportAsPdfFile(pdfMode, scale, quality);
      } else {
        exportAsImageFile(fmt, scale, quality);
      }
    }, 150);
  }

  // Export 1: RefBoard JSON File
  function exportAsRefBoardFile() {
    updateExportProgress(50, 'รวบรวมข้อมูลกระดาน...', 'กำลังเขียนโครงสร้างไฟล์ RefBoard...');
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
    updateExportProgress(100, 'สร้างไฟล์สำเร็จ!', 'กำลังเริ่มดาวน์โหลด...');
    triggerDownload(blob, generateExportFilename('refboard'));
  }

  // Helper: Draw Embed Fallback Card on Export Canvas
  function drawEmbedFallbackCard(ctx, it, x, y, w, h) {
    // Elegant Dark Card
    ctx.fillStyle = '#141414';
    ctx.fillRect(x, y, w, h);

    // Border
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    const cx = x + w / 2;
    const cy = y + h / 2 - (h > 120 ? 12 : 0);
    const iconSize = Math.max(16, Math.min(36, Math.min(w, h) * 0.25));

    if (it.embedType === 'youtube' || it.isVideo) {
      // Draw Red YouTube Badge
      ctx.fillStyle = '#ef4444';
      const bw = iconSize * 2.2;
      const bh = iconSize * 1.5;
      const r = 6;
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2 + r, cy - bh / 2);
      ctx.lineTo(cx + bw / 2 - r, cy - bh / 2);
      ctx.quadraticCurveTo(cx + bw / 2, cy - bh / 2, cx + bw / 2, cy - bh / 2 + r);
      ctx.lineTo(cx + bw / 2, cy + bh / 2 - r);
      ctx.quadraticCurveTo(cx + bw / 2, cy + bh / 2, cx + bw / 2 - r, cy + bh / 2);
      ctx.lineTo(cx - bw / 2 + r, cy + bh / 2);
      ctx.quadraticCurveTo(cx - bw / 2, cy + bh / 2, cx - bw / 2, cy + bh / 2 - r);
      ctx.lineTo(cx - bw / 2, cy - bh / 2 + r);
      ctx.quadraticCurveTo(cx - bw / 2, cy - bh / 2, cx - bw / 2 + r, cy - bh / 2);
      ctx.closePath();
      ctx.fill();

      // White Play Triangle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - iconSize * 0.35, cy - iconSize * 0.45);
      ctx.lineTo(cx + iconSize * 0.45, cy);
      ctx.lineTo(cx - iconSize * 0.35, cy + iconSize * 0.45);
      ctx.closePath();
      ctx.fill();
    } else {
      // General Media Icon
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, iconSize, 0, Math.PI * 2);
      ctx.fill();
    }

    if (h > 90) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const maxTextLen = Math.floor(w / 8);
      let titleStr = it.title || (it.embedType === 'youtube' ? 'YouTube Video' : 'Media Clip');
      if (titleStr.length > maxTextLen) titleStr = titleStr.substring(0, maxTextLen - 2) + '...';
      ctx.fillText(titleStr, cx, cy + iconSize + 14);
    }
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
    let isCompleted = false;

    const finishExport = () => {
      if (isCompleted) return;
      isCompleted = true;
      updateExportProgress(95, 'บีบอัดไฟล์ภาพและฝังข้อมูล...', 'กำลังสร้างไฟล์เพื่อดาวน์โหลด...');
      const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';

      const downloadBlobOrFallback = () => {
        try {
          renderCanvas.toBlob(async (blob) => {
            if (blob) {
              let finalBlob = blob;
              const smartEmbedChk = document.getElementById('ref-smart-embed-chk');
              if (smartEmbedChk && smartEmbedChk.checked) {
                try {
                  const boardSnapshot = {
                    version: 1.0,
                    timestamp: new Date().toISOString(),
                    panX: panX,
                    panY: panY,
                    zoom: zoom,
                    items: captureSnapshot()
                  };
                  const jsonStr = JSON.stringify(boardSnapshot);
                  const arrayBuf = await blob.arrayBuffer();

                  let embeddedBuf = null;
                  if (fmt === 'png') {
                    embeddedBuf = embedRefBoardMetadataInPng(arrayBuf, jsonStr);
                  } else if (fmt === 'jpg') {
                    embeddedBuf = embedRefBoardMetadataInJpg(arrayBuf, jsonStr);
                  }

                  if (embeddedBuf) {
                    finalBlob = new Blob([embeddedBuf], { type: mime });
                  }
                } catch (embedErr) {
                  console.warn('Smart embed error during export, saving clean image:', embedErr);
                }
              }

              updateExportProgress(100, 'สร้างไฟล์เสร็จสมบูรณ์!', 'กำลังดาวน์โหลด...');
              triggerDownload(finalBlob, generateExportFilename(fmt));
            } else {
              tryDataUrlDownload();
            }
          }, mime, quality);
        } catch (err) {
          console.warn('Canvas toBlob SecurityError, trying toDataURL fallback:', err);
          tryDataUrlDownload();
        }
      };

      const tryDataUrlDownload = () => {
        try {
          const dataUrl = renderCanvas.toDataURL(mime, quality);
          updateExportProgress(100, 'สร้างไฟล์เสร็จสมบูรณ์!', 'กำลังดาวน์โหลด...');
          triggerDownload(dataUrl, generateExportFilename(fmt));
        } catch (e2) {
          console.error('Canvas export error:', e2);
          hideExportLoading();
          showRefAlert('ส่งออกไม่สำเร็จ', 'ไม่สามารถสร้างไฟล์รูปภาพได้ กรุณาลองใหม่อีกครั้งครับ');
        }
      };

      downloadBlobOrFallback();
    };

    sortedItems.forEach((it) => {
      const renderItemMedia = (mediaEl) => {
        ctx.save();

        const itemCenterX = (it.x - minX) + it.width / 2;
        const itemCenterY = (it.y - minY) + it.height / 2;

        ctx.translate(itemCenterX, itemCenterY);
        ctx.rotate((it.rotation * Math.PI) / 180);

        const cropLeft = it.cropLeft || 0;
        const cropTop = it.cropTop || 0;
        const cropRight = it.cropRight || 0;
        const cropBottom = it.cropBottom || 0;
        const fullW = it.fullWidth || (it.width + cropLeft + cropRight);
        const fullH = it.fullHeight || (it.height + cropTop + cropBottom);

        if (mediaEl) {
          if (cropLeft > 0 || cropTop > 0 || cropRight > 0 || cropBottom > 0) {
            ctx.beginPath();
            ctx.rect(-it.width / 2, -it.height / 2, it.width, it.height);
            ctx.clip();
            ctx.drawImage(mediaEl, -it.width / 2 - cropLeft, -it.height / 2 - cropTop, fullW, fullH);
          } else {
            ctx.drawImage(mediaEl, -it.width / 2, -it.height / 2, it.width, it.height);
          }
        } else {
          // Draw fallback card for tainted or unavailable media
          drawEmbedFallbackCard(ctx, it, -it.width / 2, -it.height / 2, it.width, it.height);
        }
        ctx.restore();

        loaded++;
        const p = Math.round((loaded / sortedItems.length) * 85);
        updateExportProgress(p, `กำลังเรนเดอร์รูปภาพ (${loaded}/${sortedItems.length})...`, `จัดวางรูปภาพสำเร็จแล้ว ${p}%`);

        if (loaded === sortedItems.length) {
          finishExport();
        }
      };

      if (it.isVideo) {
        const video = it.el ? it.el.querySelector('video') : null;
        if (video) {
          renderItemMedia(video);
          return;
        }
      }

      const rawSrc = it.dataUrl || it.thumbnailUrl || '';
      if (!rawSrc) {
        renderItemMedia(null);
        return;
      }

      const img = new Image();
      if (!rawSrc.startsWith('data:') && !rawSrc.startsWith('blob:')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => {
        renderItemMedia(img);
      };

      img.onerror = () => {
        console.warn('Image load with CORS failed for export, using fallback card:', rawSrc);
        renderItemMedia(null);
      };

      img.src = rawSrc;
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
      const finishPsdLayer = (imgOrCanvas) => {
        const itemW = Math.round(it.width * scaleMultiplier);
        const itemH = Math.round(it.height * scaleMultiplier);
        const itemX = Math.round((it.x - minX) * scaleMultiplier);
        const itemY = Math.round((it.y - minY) * scaleMultiplier);

        const lCanvas = document.createElement('canvas');
        lCanvas.width = itemW;
        lCanvas.height = itemH;
        const lCtx = lCanvas.getContext('2d');

        if (imgOrCanvas) {
          if (it.rotation) {
            lCtx.translate(itemW / 2, itemH / 2);
            lCtx.rotate((it.rotation * Math.PI) / 180);
            lCtx.drawImage(imgOrCanvas, -itemW / 2, -itemH / 2, itemW, itemH);
          } else {
            lCtx.drawImage(imgOrCanvas, 0, 0, itemW, itemH);
          }
        } else {
          drawEmbedFallbackCard(lCtx, it, 0, 0, itemW, itemH);
        }

        let imgData = null;
        try {
          imgData = lCtx.getImageData(0, 0, itemW, itemH);
        } catch (e) {
          // If tainted, redraw clean fallback card
          const cleanCanvas = document.createElement('canvas');
          cleanCanvas.width = itemW;
          cleanCanvas.height = itemH;
          const cleanCtx = cleanCanvas.getContext('2d');
          drawEmbedFallbackCard(cleanCtx, it, 0, 0, itemW, itemH);
          imgData = cleanCtx.getImageData(0, 0, itemW, itemH);
        }

        layers.push({
          name: `Ref Image ${idx + 1}`,
          left: itemX,
          top: itemY,
          imageData: imgData,
          canvas: lCanvas
        });

        loaded++;
        const p = Math.round((loaded / sortedItems.length) * 80);
        updateExportProgress(p, `กำลังสร้างเลเยอร์ PSD (${loaded}/${sortedItems.length})...`, `จัดเตรียมเลเยอร์ Ref Image ${loaded}`);

        if (loaded === sortedItems.length) {
          try {
            updateExportProgress(90, 'กำลังประกอบไฟล์ PSD...', 'กำลังเขียนโครงสร้างเลเยอร์ Photoshop...');
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

            const psdLayers = [bgLayer, ...layers];

            const psdData = {
              width: boardW,
              height: boardH,
              children: psdLayers
            };
            const buffer = agPsd.writePsd(psdData);
            const blob = new Blob([buffer], { type: 'image/vnd.adobe.photoshop' });
            updateExportProgress(100, 'สร้างไฟล์ PSD สำเร็จ!', 'กำลังส่งไฟล์ดาวน์โหลด...');
            triggerDownload(blob, generateExportFilename('psd'));
          } catch (err) {
            hideExportLoading();
            showRefAlert('เกิดข้อผิดพลาด', 'เกิดข้อผิดพลาดในการสร้างไฟล์ PSD: ' + err.message);
          }
        }
      };

      if (it.isVideo) {
        const video = it.el ? it.el.querySelector('video') : null;
        if (video) {
          finishPsdLayer(video);
          return;
        }
      }

      const rawSrc = it.dataUrl || it.thumbnailUrl || '';
      if (!rawSrc) {
        finishPsdLayer(null);
        return;
      }

      const img = new Image();
      if (!rawSrc.startsWith('data:') && !rawSrc.startsWith('blob:')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => {
        finishPsdLayer(img);
      };

      img.onerror = () => {
        finishPsdLayer(null);
      };

      img.src = rawSrc;
    });
  }

  // Helper: Find %PDF- Header index inside binary file (for Adobe Illustrator .ai / .eps compatibility)
  function findPdfHeaderIndex(bytes) {
    const maxSearch = Math.min(bytes.length - 4, 65536);
    for (let i = 0; i < maxSearch; i++) {
      if (bytes[i] === 0x25 && bytes[i + 1] === 0x50 && bytes[i + 2] === 0x44 && bytes[i + 3] === 0x46 && bytes[i + 4] === 0x2D) {
        return i;
      }
    }
    return -1;
  }

  // Import PDF & Adobe Illustrator File (.pdf, .ai, .eps)
  function importPdfFile(file) {
    if (typeof pdfjsLib === 'undefined') {
      showRefAlert('ไม่พบสคริปต์ PDF', 'ไม่พบไลบรารีอ่านไฟล์ PDF/AI กรุณาลองใหม่อีกครั้งครับ');
      return;
    }

    pushUndoState();
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        let typedarray = new Uint8Array(e.target.result);

        // Auto-detect %PDF- header offset for Adobe Illustrator (.ai / .eps) files
        const pdfHeaderIdx = findPdfHeaderIndex(typedarray);
        if (pdfHeaderIdx > 0) {
          typedarray = typedarray.subarray(pdfHeaderIdx);
        } else if (pdfHeaderIdx < 0 && file.name.toLowerCase().endsWith('.ai')) {
          showRefAlert('ไม่สามารถอ่านไฟล์ .ai ได้', 'ไฟล์ .ai นี้ไม่ได้บันทึกแบบ PDF Compatible กรุณาเซฟจาก Illustrator โดยติ๊กเลือก "Create PDF Compatible File" ครับ');
          return;
        }

        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const numPages = pdf.numPages;

        const startX = -panX / zoom + (viewportEl ? viewportEl.clientWidth / 2 : 300) - 150;
        const startY = -panY / zoom + (viewportEl ? viewportEl.clientHeight / 2 : 300) - 150;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');

          let svgText = '';
          try {
            const opList = await page.getOperatorList();
            const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
            const svgEl = await svgGfx.getSVG(opList, viewport);
            if (svgEl) {
              svgText = svgEl.outerHTML;
            }
          } catch (svgErr) {
            console.warn('PDF SVGGraphics extraction notice:', svgErr);
          }

          let w = viewport.width / 2;
          let h = viewport.height / 2;
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
            svgContent: svgText,
            isVector: Boolean(svgText),
            isPdfPage: true,
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
        console.error('PDF/AI import failed:', err);
        showRefAlert('นำเข้า PDF/AI ไม่สำเร็จ', 'เกิดข้อผิดพลาดขณะอ่านไฟล์ PDF/AI หากเป็นไฟล์ .ai กรุณาเซฟโดยติ๊กเลือก "Create PDF Compatible File" ครับ');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Helper: Get group nesting depth
  function getGroupDepth(item) {
    if (!item || !item.isGroup || !item.originalItems || item.originalItems.length === 0) {
      return 1;
    }
    let maxChildDepth = 0;
    item.originalItems.forEach((child) => {
      maxChildDepth = Math.max(maxChildDepth, getGroupDepth(child));
    });
    return 1 + maxChildDepth;
  }

  // Regroup Multiple Selected Items into a Single Vector Group Item
  function regroupSelectedItems() {
    if (!isModalOpen || selectedItemIds.size <= 1) return;

    const selected = Array.from(selectedItemIds).map((id) => itemsMap.get(id)).filter(Boolean);
    if (selected.length <= 1) return;

    // Check maximum group nesting depth (Limit to 5 levels max)
    const MAX_GROUP_DEPTH = 5;
    let maxDepth = 0;
    selected.forEach((it) => {
      maxDepth = Math.max(maxDepth, getGroupDepth(it));
    });

    if (maxDepth >= MAX_GROUP_DEPTH) {
      showRefAlert(
        'ถึงขีดจำกัดการรวมกลุ่ม',
        `สามารถรวมกลุ่มซ้อนกันได้สูงสุด ${MAX_GROUP_DEPTH} ชั้นเท่านั้นครับ`
      );
      return;
    }

    pushUndoState();

    // Calculate unified bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    selected.forEach((it) => {
      minX = Math.min(minX, it.x);
      minY = Math.min(minY, it.y);
      maxX = Math.max(maxX, it.x + it.width);
      maxY = Math.max(maxY, it.y + it.height);
    });

    const groupW = Math.max(40, maxX - minX);
    const groupH = Math.max(40, maxY - minY);

    // Ensure all videos have a captured thumbnail frame before building group SVG
    selected.forEach((it) => {
      if (it.isVideo) {
        const video = (it.el ? it.el.querySelector('video') : null) || (it.imgEl && it.imgEl.tagName === 'VIDEO' ? it.imgEl : null);
        if (video) {
          try {
            const vw = video.videoWidth || it.width || 480;
            const vh = video.videoHeight || it.height || 320;
            if (vw > 0 && vh > 0) {
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = vw;
              tempCanvas.height = vh;
              const ctx = tempCanvas.getContext('2d');
              ctx.drawImage(video, 0, 0, vw, vh);
              const thumb = tempCanvas.toDataURL('image/jpeg', 0.88);
              if (thumb && thumb.startsWith('data:image')) {
                it.thumbnailUrl = thumb;
              }
            }
          } catch (e) {
            console.warn('Cannot capture video thumbnail on regroup:', e);
          }
        }
      }
    });

    // Save complete original items metadata to restore 100% exact dimensions and media types on Ungroup
    const originalItems = selected.map((it) => ({
      x: it.x,
      y: it.y,
      width: it.width,
      height: it.height,
      aspect: it.aspect || (it.width / (it.height || 1)),
      rotation: it.rotation || 0,
      cropLeft: it.cropLeft || 0,
      cropTop: it.cropTop || 0,
      cropRight: it.cropRight || 0,
      cropBottom: it.cropBottom || 0,
      fullWidth: it.fullWidth || it.width,
      fullHeight: it.fullHeight || it.height,
      dataUrl: it.dataUrl || '',
      isVideo: Boolean(it.isVideo),
      isEmbed: Boolean(it.isEmbed),
      embedType: it.embedType || null,
      embedUrl: it.embedUrl || null,
      thumbnailUrl: it.thumbnailUrl || null,
      showThumbnailOnly: Boolean(it.showThumbnailOnly),
      title: it.title || null,
      mediaType: it.mediaType || (it.isVideo ? 'video' : (it.isEmbed ? 'embed' : 'image')),
      svgContent: it.svgContent || null,
      isVector: Boolean(it.isVector),
      isPdfPage: Boolean(it.isPdfPage),
      isGroup: Boolean(it.isGroup),
      originalItems: it.originalItems ? JSON.parse(JSON.stringify(it.originalItems)) : null,
      initialGroupX: it.initialGroupX || it.x,
      initialGroupY: it.initialGroupY || it.y,
      initialGroupWidth: it.initialGroupWidth || it.width,
      initialGroupHeight: it.initialGroupHeight || it.height
    }));

    // Build SVG Group Container combining all selected items
    const combinedSvgText = buildGroupSvgString(originalItems, groupW, groupH, minX, minY);
    const blob = new Blob([combinedSvgText], { type: 'image/svg+xml' });
    const groupDataUrl = URL.createObjectURL(blob);

    // Remove old selected items
    const ids = Array.from(selectedItemIds);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
      itemsMap.delete(id);
    });
    deselectAll();

    // Create new unified Vector Group Item
    const groupId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5) + '_group';
    const groupItem = {
      id: groupId,
      dataUrl: groupDataUrl,
      svgContent: combinedSvgText,
      originalItems: originalItems,
      initialGroupX: minX,
      initialGroupY: minY,
      initialGroupWidth: groupW,
      initialGroupHeight: groupH,
      isVector: true,
      isGroup: true,
      x: minX,
      y: minY,
      width: groupW,
      height: groupH,
      aspect: groupW / (groupH || 1),
      rotation: 0,
      zIndex: ++nextZIndex
    };

    createRefImageItem(groupItem);
    selectItem(groupId);
    updateItemCount();
  }

  // Vector Ungrouping System (Restores grouped items back into individual items at current scale & position)
  function ungroupVectorItem(itemData) {
    if (!itemData || !itemData.originalItems || itemData.originalItems.length === 0) {
      return;
    }

    pushUndoState();

    const parentId = itemData.id;
    const parentEl = document.getElementById(parentId);
    if (parentEl) parentEl.remove();
    itemsMap.delete(parentId);

    const createdIds = [];

    const initGW = itemData.initialGroupWidth || itemData.width || 1;
    const initGH = itemData.initialGroupHeight || itemData.height || 1;
    const scaleX = (itemData.fullWidth || itemData.width || initGW) / initGW;
    const scaleY = (itemData.fullHeight || itemData.height || initGH) / initGH;
    const currentGroupX = itemData.x;
    const currentGroupY = itemData.y;
    const initGroupX = itemData.initialGroupX || itemData.x;
    const initGroupY = itemData.initialGroupY || itemData.y;
    const groupRot = itemData.rotation || 0;

    const gCropLeft = itemData.cropLeft || 0;
    const gCropTop = itemData.cropTop || 0;
    const gCropRight = itemData.cropRight || 0;
    const gCropBottom = itemData.cropBottom || 0;

    const groupVisLeft = gCropLeft;
    const groupVisTop = gCropTop;
    const groupVisRight = (itemData.fullWidth || itemData.width || initGW) - gCropRight;
    const groupVisBottom = (itemData.fullHeight || itemData.height || initGH) - gCropBottom;

    const rotRad = (groupRot * Math.PI) / 180;
    const cosG = Math.cos(rotRad);
    const sinG = Math.sin(rotRad);

    itemData.originalItems.forEach((orig, index) => {
      const subId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5) + '_orig' + index;

      const subFullW = Math.max(20, Math.round((orig.fullWidth || orig.width) * scaleX));
      const subFullH = Math.max(20, Math.round((orig.fullHeight || orig.height) * scaleY));

      const relX = (orig.x - initGroupX) * scaleX;
      const relY = (orig.y - initGroupY) * scaleY;

      const initSubCropL = Math.round((orig.cropLeft || 0) * scaleX);
      const initSubCropT = Math.round((orig.cropTop || 0) * scaleY);
      const initSubCropR = Math.round((orig.cropRight || 0) * scaleX);
      const initSubCropB = Math.round((orig.cropBottom || 0) * scaleY);

      let subCropL = initSubCropL;
      let subCropT = initSubCropT;
      let subCropR = initSubCropR;
      let subCropB = initSubCropB;

      // Check overlap with group visible crop bounds
      const visibleSubLeft = relX;
      const visibleSubRight = relX + subFullW - initSubCropL - initSubCropR;
      const visibleSubTop = relY;
      const visibleSubBottom = relY + subFullH - initSubCropT - initSubCropB;

      if (visibleSubLeft < groupVisLeft) {
        subCropL += Math.round(groupVisLeft - visibleSubLeft);
      }
      if (visibleSubRight > groupVisRight) {
        subCropR += Math.round(visibleSubRight - groupVisRight);
      }
      if (visibleSubTop < groupVisTop) {
        subCropT += Math.round(groupVisTop - visibleSubTop);
      }
      if (visibleSubBottom > groupVisBottom) {
        subCropB += Math.round(visibleSubBottom - groupVisBottom);
      }

      subCropL = Math.max(0, Math.min(subCropL, subFullW - 10));
      subCropR = Math.max(0, Math.min(subCropR, subFullW - subCropL - 10));
      subCropT = Math.max(0, Math.min(subCropT, subFullH - 10));
      subCropB = Math.max(0, Math.min(subCropB, subFullH - subCropT - 10));

      const subW = Math.max(20, subFullW - subCropL - subCropR);
      const subH = Math.max(20, subFullH - subCropT - subCropB);

      const deltaCropL = subCropL - initSubCropL;
      const deltaCropT = subCropT - initSubCropT;

      const relCroppedX = relX + deltaCropL - gCropLeft;
      const relCroppedY = relY + deltaCropT - gCropTop;

      const subX = currentGroupX + relCroppedX * cosG - relCroppedY * sinG;
      const subY = currentGroupY + relCroppedX * sinG + relCroppedY * cosG;

      const restoredItem = {
        ...orig,
        id: subId,
        x: subX,
        y: subY,
        width: subW,
        height: subH,
        rotation: (orig.rotation || 0) + groupRot,
        cropLeft: subCropL,
        cropTop: subCropT,
        cropRight: subCropR,
        cropBottom: subCropB,
        fullWidth: subFullW,
        fullHeight: subFullH,
        zIndex: ++nextZIndex
      };

      createRefImageItem(restoredItem);
      createdIds.push(subId);
    });

    deselectAll();
    createdIds.forEach((id) => selectItem(id, true));
    updateItemCount();
  }

  // Import Vector SVG File (.svg)
  function importSvgFile(file) {
    pushUndoState();
    const reader = new FileReader();
    reader.onload = (event) => {
      let svgText = event.target.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');

      if (!svgEl) {
        showRefAlert('อ่าน SVG ไม่สำเร็จ', 'ไฟล์ที่เลือกไม่ใช่ไฟล์ SVG ที่สมบูรณ์ครับ');
        return;
      }

      if (!svgEl.getAttribute('xmlns')) {
        svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      let w = 300, h = 300;
      if (svgEl.getAttribute('width')) w = parseFloat(svgEl.getAttribute('width')) || 300;
      if (svgEl.getAttribute('height')) h = parseFloat(svgEl.getAttribute('height')) || 300;
      if (svgEl.getAttribute('viewBox')) {
        const parts = svgEl.getAttribute('viewBox').split(/[\s,]+/);
        if (parts.length === 4) {
          const vbW = parseFloat(parts[2]);
          const vbH = parseFloat(parts[3]);
          if (vbW > 0 && vbH > 0) {
            w = vbW;
            h = vbH;
          }
        }
      }

      svgText = svgEl.outerHTML;
      const aspect = w / (h || 1);
      const maxDim = 1200;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          w = maxDim;
          h = maxDim / aspect;
        } else {
          h = maxDim;
          w = maxDim * aspect;
        }
      }

      const encodedSvg = encodeURIComponent(svgText)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;

      const offset = (itemsMap.size % 8) * 30;
      const x = -panX / zoom + (viewportEl ? viewportEl.clientWidth / 2 : 300) - w / 2 + offset;
      const y = -panY / zoom + (viewportEl ? viewportEl.clientHeight / 2 : 300) - h / 2 + offset;

      createRefImageItem({
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        dataUrl: dataUrl,
        svgContent: svgText,
        isVector: true,
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(w),
        height: Math.round(h),
        aspect: aspect,
        rotation: 0,
        zIndex: ++nextZIndex
      });
    };
    reader.readAsText(file);
  }

  // Export 5: PDF Document File (Vector PDF & Standard Raster PDF)
  async function exportAsPdfFile(pdfLayoutMode, scaleMultiplier, quality, pdfType = 'vector') {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      showRefAlert('ไม่พบสคริปต์ PDF', 'ไม่พบไลบรารีสร้างไฟล์ PDF กรุณาลองใหม่อีกครั้ง');
      return;
    }

    const items = Array.from(itemsMap.values());
    if (items.length === 0) return;

    const sortedItems = items.slice().sort((a, b) => a.zIndex - b.zIndex);

    if (pdfLayoutMode === 'multi') {
      // Multi-Page: Create PDF pages with exact custom size of each item/page
      const imagePromises = sortedItems.map((it) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ item: it, img });
          img.onerror = () => resolve({ item: it, img: null });
          img.src = it.dataUrl;
        });
      });

      const results = await Promise.all(imagePromises);
      let pdf = null;

      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (!res.img) continue;
        const it = res.item;
        const img = res.img;

        const p = Math.round(((i + 1) / results.length) * 90);
        updateExportProgress(p, `กำลังจัดหน้า PDF (${i + 1}/${results.length})...`, `สร้างหน้าเอกสารสำเร็จแล้ว ${p}%`);

        const itemW = Math.max(1, Math.round(it.width * scaleMultiplier));
        const itemH = Math.max(1, Math.round(it.height * scaleMultiplier));

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = itemW;
        tempCanvas.height = itemH;
        const ctx = tempCanvas.getContext('2d');

        ctx.save();
        if (it.rotation) {
          ctx.translate(itemW / 2, itemH / 2);
          ctx.rotate((it.rotation * Math.PI) / 180);
          ctx.translate(-itemW / 2, -itemH / 2);
        }

        const cropLeft = (it.cropLeft || 0) * scaleMultiplier;
        const cropTop = (it.cropTop || 0) * scaleMultiplier;
        const cropRight = (it.cropRight || 0) * scaleMultiplier;
        const cropBottom = (it.cropBottom || 0) * scaleMultiplier;
        const fullW = (it.fullWidth || (it.width + (it.cropLeft || 0) + (it.cropRight || 0))) * scaleMultiplier;
        const fullH = (it.fullHeight || (it.height + (it.cropTop || 0) + (it.cropBottom || 0))) * scaleMultiplier;

        if (cropLeft > 0 || cropTop > 0 || cropRight > 0 || cropBottom > 0) {
          ctx.beginPath();
          ctx.rect(0, 0, itemW, itemH);
          ctx.clip();
          ctx.drawImage(img, -cropLeft, -cropTop, fullW, fullH);
        } else {
          ctx.drawImage(img, 0, 0, itemW, itemH);
        }
        ctx.restore();

        const dataUrl = tempCanvas.toDataURL('image/jpeg', quality);
        const orientation = itemW >= itemH ? 'landscape' : 'portrait';

        if (!pdf) {
          pdf = new jsPDF({
            orientation: orientation,
            unit: 'px',
            format: [itemW, itemH]
          });
        } else {
          pdf.addPage([itemW, itemH], orientation);
        }

        let addedVector = false;
        if (pdfType === 'vector' && it.svgContent) {
          try {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(it.svgContent, 'image/svg+xml');
            const svgEl = svgDoc.querySelector('svg');
            if (svgEl) {
              if (window.svg2pdf) {
                await window.svg2pdf(svgEl, pdf, { x: 0, y: 0, width: itemW, height: itemH });
                addedVector = true;
              } else if (typeof pdf.svg === 'function') {
                await pdf.svg(svgEl, { x: 0, y: 0, width: itemW, height: itemH });
                addedVector = true;
              }
            }
          } catch (err) {
            console.warn('Vector PDF export error, fallback to image:', err);
          }
        }

        if (!addedVector) {
          pdf.addImage(dataUrl, 'JPEG', 0, 0, itemW, itemH);
        }
      }

      if (pdf) {
        pdf.save(generateExportFilename('pdf'));
        setTimeout(hideExportLoading, 400);
      }
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
      renderCanvas.width = Math.round(boardWidth * scaleMultiplier);
      renderCanvas.height = Math.round(boardHeight * scaleMultiplier);
      const ctx = renderCanvas.getContext('2d');

      ctx.scale(scaleMultiplier, scaleMultiplier);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, boardWidth, boardHeight);

      const imagePromises = sortedItems.map((it) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ item: it, img });
          img.onerror = () => resolve({ item: it, img: null });
          img.src = it.dataUrl;
        });
      });

      const results = await Promise.all(imagePromises);
      results.forEach((res) => {
        if (!res.img) return;
        const it = res.item;
        const img = res.img;

        ctx.save();
        const itemCenterX = (it.x - minX) + it.width / 2;
        const itemCenterY = (it.y - minY) + it.height / 2;
        ctx.translate(itemCenterX, itemCenterY);
        ctx.rotate((it.rotation * Math.PI) / 180);

        const cropLeft = it.cropLeft || 0;
        const cropTop = it.cropTop || 0;
        const cropRight = it.cropRight || 0;
        const cropBottom = it.cropBottom || 0;
        const fullW = it.fullWidth || (it.width + cropLeft + cropRight);
        const fullH = it.fullHeight || (it.height + cropTop + cropBottom);

        if (cropLeft > 0 || cropTop > 0 || cropRight > 0 || cropBottom > 0) {
          ctx.beginPath();
          ctx.rect(-it.width / 2, -it.height / 2, it.width, it.height);
          ctx.clip();
          ctx.drawImage(img, -it.width / 2 - cropLeft, -it.height / 2 - cropTop, fullW, fullH);
        } else {
          ctx.drawImage(img, -it.width / 2, -it.height / 2, it.width, it.height);
        }
        ctx.restore();
      });

      const finalW = Math.round(boardWidth * scaleMultiplier);
      const finalH = Math.round(boardHeight * scaleMultiplier);
      const orientation = finalW >= finalH ? 'landscape' : 'portrait';

      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: [finalW, finalH]
      });

      let addedVectorSingle = false;
      if (pdfType === 'vector') {
        try {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, finalW, finalH, 'F');

          for (const res of results) {
            const it = res.item;
            if (it.svgContent) {
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(it.svgContent, 'image/svg+xml');
              const svgEl = svgDoc.querySelector('svg');
              if (svgEl) {
                const itemX = Math.round((it.x - minX) * scaleMultiplier);
                const itemY = Math.round((it.y - minY) * scaleMultiplier);
                const itemW = Math.round(it.width * scaleMultiplier);
                const itemH = Math.round(it.height * scaleMultiplier);

                if (window.svg2pdf) {
                  await window.svg2pdf(svgEl, pdf, { x: itemX, y: itemY, width: itemW, height: itemH });
                  addedVectorSingle = true;
                } else if (typeof pdf.svg === 'function') {
                  await pdf.svg(svgEl, { x: itemX, y: itemY, width: itemW, height: itemH });
                  addedVectorSingle = true;
                }
              }
            }
          }
        } catch (vErr) {
          console.warn('Single-page vector export fallback:', vErr);
        }
      }

      if (!addedVectorSingle) {
        const imgData = renderCanvas.toDataURL('image/jpeg', quality);
        pdf.addImage(imgData, 'JPEG', 0, 0, finalW, finalH);
      }

      pdf.save(generateExportFilename('pdf'));
      setTimeout(hideExportLoading, 400);
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
    setTimeout(hideExportLoading, 400);
  }

  // ── Global Helper: Add image item to board from Data URL ──
  window.addRefBoardImageFromDataUrl = function (dataUrl) {
    if (!dataUrl) return;
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth || 400;
      let h = img.naturalHeight || 300;
      const aspect = w / h;
      const maxDim = 800;
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

      // Auto open reference board modal if not open
      const modal = document.getElementById('refboard-modal');
      if (modal && !modal.classList.contains('open')) {
        if (window.toggleRefBoard) window.toggleRefBoard();
      }
      showToast('นำเข้าภาพชุดสีลงกระดานเรฟเรียบร้อย! 🎨');
    };
    img.src = dataUrl;
  };

})();
