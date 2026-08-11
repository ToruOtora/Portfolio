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
            <span>วางไฟล์ลงบนกระดานเรฟ (รองรับ PNG, JPG, SVG, AI, PSD, PDF, RefBoard)</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="refboard-footer">
          <div class="refboard-footer-info">
            <span id="refboard-zoom-text">ซูม: 100%</span>
            <span>|</span>
            <span>ย้อนกลับ <span class="refboard-kbd">Ctrl</span>+<span class="refboard-kbd">Z</span> | ทำซ้ำ <span class="refboard-kbd">Ctrl</span>+<span class="refboard-kbd">Y</span></span>
            <span>|</span>
            <span>คัดลอก <span class="refboard-kbd">Ctrl</span>+<span class="refboard-kbd">C</span> | ตัด <span class="refboard-kbd">Ctrl</span>+<span class="refboard-kbd">X</span> | วาง <span class="refboard-kbd">Ctrl</span>+<span class="refboard-kbd">V</span></span>
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

      <!-- Hidden File Inputs -->
      <input type="file" id="refboard-file-add" class="refboard-file-input" accept="image/*,.svg,.ai,.eps,.pdf,.psd,.refboard,.json,application/illustrator,application/postscript,image/svg+xml,application/pdf" multiple>
      <input type="file" id="refboard-file-import" class="refboard-file-input" accept="image/*,.svg,.ai,.eps,.pdf,.psd,.refboard,.json,application/illustrator,application/postscript,image/svg+xml,application/pdf" multiple>
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
      if (e.pointerType === 'touch') return;

      const isBg = e.target === viewportEl || e.target === canvasEl || e.target === emptyHintEl || e.target.closest('#refboard-empty-hint');
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

    window.addEventListener('mousemove', (e) => {
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
    });

    window.addEventListener('mouseup', () => {
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

  // Copy / Cut / Paste Handling
  function setupPasteHandler() {
    window.addEventListener('paste', (e) => {
      if (!isModalOpen) return;
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
      if (isInput) return;

      const clipboardItems = (e.clipboardData || e.originalEvent.clipboardData).items;
      const files = [];
      for (let i = 0; i < clipboardItems.length; i++) {
        if (clipboardItems[i].type.indexOf('image') !== -1) {
          const blob = clipboardItems[i].getAsFile();
          if (blob) files.push(blob);
        }
      }
      if (files.length > 0) {
        handleFiles(files);
      } else if (internalClipboard.length > 0) {
        pasteInternalClipboard();
      }
    });
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
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
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
    });

    window.addEventListener('keyup', (e) => {
      if (!isModalOpen) return;
      const code = e.code || '';
      const key = (e.key || '').toLowerCase();

      if (code === 'Space' || key === ' ' || e.keyCode === 32) {
        e.preventDefault();
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
      } else if (fileName.endsWith('.svg')) {
        importSvgFile(file);
      } else if (fileName.endsWith('.pdf') || fileName.endsWith('.ai') || fileName.endsWith('.eps')) {
        importPdfFile(file);
      } else if (file.type.startsWith('image/')) {
        imageFiles.push(file);
      } else {
        importPdfFile(file);
      }
    });

    if (imageFiles.length > 0) {
      importMultipleImageFiles(imageFiles, targetX, targetY);
    }
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
    pushUndoState();
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

    const canUngroup = Boolean(
      itemData.isGroup ||
      (itemData.originalItems && itemData.originalItems.length > 0)
    );

    itemEl.innerHTML = `
      <div class="ref-item-crop">
        <img src="${itemData.dataUrl}" class="ref-item-img" alt="ref">
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
        ${canUngroup ? '<button class="ref-tb-btn btn-ungroup" data-act="ungroup" title="แยกกลุ่มรูปภาพออกเป็นชิ้นย่อย">🧩 แยกกลุ่ม</button>' : ''}
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

    itemEl.addEventListener('mousedown', (e) => {
      if (!isModalOpen || spacePressed) return;

      const handleBtn = e.target.closest('.ref-handle');
      const tbBtn = e.target.closest('.ref-tb-btn');

      if (tbBtn) {
        e.stopPropagation();
        const act = tbBtn.dataset.act;
        if (act === 'front') {
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

      function onMouseUp() {
        clearSmartGuides();
        isInteracting = false;
        activeMode = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        commitDragState();
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

      function onTouchEnd() {
        clearSmartGuides();
        isInteracting = false;
        activeMode = null;
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
        commitDragState();
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
          window.removeEventListener('mousemove', onGroupMove);
          window.removeEventListener('mouseup', onGroupUp);
          commitDragState();
        }

        window.addEventListener('mousemove', onGroupMove);
        window.addEventListener('mouseup', onGroupUp);
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
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        commitDragState();
      }

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });
  }

  // Clear Board
  function clearBoard() {
    pushUndoState();
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

  // Clipboard System (Copy / Cut / Paste)
  function copySelectedItems() {
    if (!isModalOpen || selectedItemIds.size === 0) return;
    const selected = Array.from(selectedItemIds).map((id) => itemsMap.get(id)).filter(Boolean);
    if (selected.length === 0) return;

    internalClipboard = selected.map((it) => ({
      dataUrl: it.dataUrl,
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

    if (selected.length === 1 && navigator.clipboard && window.ClipboardItem) {
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
    const cloned = Object.assign({}, itemData);
    itemsMap.set(cloned.id, cloned);

    const itemEl = document.createElement('div');
    itemEl.id = cloned.id;
    itemEl.className = 'ref-item';
    itemEl.style.transform = `translate(${cloned.x}px, ${cloned.y}px) rotate(${cloned.rotation || 0}deg)`;
    itemEl.style.width = `${cloned.width}px`;
    itemEl.style.height = `${cloned.height}px`;
    itemEl.style.zIndex = cloned.zIndex;

    const canUngroup = Boolean(
      cloned.isGroup ||
      (cloned.originalItems && cloned.originalItems.length > 0)
    );

    itemEl.innerHTML = `
      <div class="ref-item-crop">
        <img src="${cloned.dataUrl}" class="ref-item-img" alt="ref">
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
        ${canUngroup ? '<button class="ref-tb-btn btn-ungroup" data-act="ungroup" title="แยกกลุ่มรูปภาพออกเป็นชิ้นย่อย">🧩 แยกกลุ่ม</button>' : ''}
        <button class="ref-tb-btn" data-act="front" title="นำขึ้นหน้าสุด">⬆ ขึ้นหน้า</button>
        <button class="ref-tb-btn" data-act="back" title="ส่งไปหลังสุด">⬇ ลงหลัง</button>
        <button class="ref-tb-btn del-btn" data-act="del" title="ลบรูป">🗑️ ลบ</button>
      </div>
    `;

    canvasEl.appendChild(itemEl);
    cloned.el = itemEl;
    cloned.imgEl = itemEl.querySelector('.ref-item-img');

    bindItemEvents(itemEl, cloned);
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

        loaded++;
        const p = Math.round((loaded / sortedItems.length) * 85);
        updateExportProgress(p, `กำลังเรนเดอร์รูปภาพ (${loaded}/${sortedItems.length})...`, `จัดวางรูปภาพสำเร็จแล้ว ${p}%`);

        if (loaded === sortedItems.length) {
          updateExportProgress(95, 'บีบอัดไฟล์ภาพ...', 'กำลังสร้างไฟล์เพื่อดาวน์โหลด...');
          const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
          renderCanvas.toBlob((blob) => {
            updateExportProgress(100, 'สร้างไฟล์เสร็จสมบูรณ์!', 'กำลังดาวน์โหลด...');
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
      img.src = it.dataUrl;
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

    // Save complete original items metadata to restore 100% exact dimensions on Ungroup
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
      dataUrl: it.dataUrl,
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
    let svgDefs = '';
    let svgInner = '';
    selected.forEach((it, idx) => {
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
        const parser = new DOMParser();
        const doc = parser.parseFromString(it.svgContent, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        const content = svgEl ? svgEl.innerHTML : '';
        if (hasCrop) {
          svgInner += `<g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})"><g clip-path="url(#${clipId})"><g transform="translate(-${cL}, -${cT})">${content}</g></g></g>`;
        } else {
          svgInner += `<g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})">${content}</g>`;
        }
      } else {
        if (hasCrop) {
          svgInner += `<g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})"><g clip-path="url(#${clipId})"><image href="${it.dataUrl}" x="-${cL}" y="-${cT}" width="${fullW}" height="${fullH}" preserveAspectRatio="none" /></g></g>`;
        } else {
          svgInner += `<g transform="translate(${relX}, ${relY}) rotate(${rot}, ${w / 2}, ${h / 2})"><image href="${it.dataUrl}" width="${w}" height="${h}" preserveAspectRatio="none" /></g>`;
        }
      }
    });

    const combinedSvgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${groupW} ${groupH}" width="${groupW}" height="${groupH}">${svgDefs ? `<defs>${svgDefs}</defs>` : ''}${svgInner}</svg>`;
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

})();
