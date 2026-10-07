/**
 * ═══════════════════════════════════════════════════════════════════
 *  FLOATING "O" & SPEECH BUBBLE COMPANION CONTROLLER
 * ═══════════════════════════════════════════════════════════════════
 *  ระบบควบคุมและบทพูดของตัวอักษร "O" และปุ่มส่งข้อความ (Easter Egg)
 *  สามารถปรับแต่งข้อความทักทายและระยะเวลาการแสดงผลได้จากส่วนนี้
 */

const FLOATING_O_CONFIG = {
  // ── บทพูด / ข้อความที่ตัว O พูด (Speech Dialogue) ──
  // ข้อความหลักที่จะแสดงในกล่องคำพูด (แสดงเป็นลำดับทีละประโยคตอนเข้าใกล้รอบแรก)
  greetingText: [
    "สวัสดี (◍•ᴗ•◍)",
    "ผมไม่ใช่ AI นะ",
    "ผมแค่ถูกจ้างมาให้อธิบายเว็บนี้",
    "ยินดีที่ได้รู้จัก (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)",
  ],

  // ข้อความทักทายรอบที่สอง (เมื่อผู้ใช้ชี้เข้ามาใกล้อีกรอบหลังจากพูดจบชุดแรกแล้ว - แนวทาง A)
  followUpGreetingText: [
    "ยังอยู่ตรงนี้เสมอนะ (´꒳`)",
    "คลิกที่ตัวผมเพื่อพาบินเล่นได้นะ!",
  ],

  // ข้อความทักทายสั้นๆ สำหรับรอบที่สามเป็นต้นไป (สุ่มพูดประโยคสั้นๆ กระชับ ไม่ยืดเยื้อ)
  subsequentGreetings: [
    "พร้อมลุยงานเสมอนะครับ (◍•ᴗ•◍)",
    "มีโปรเจกต์ใหม่ ปรึกษาโอเว่นได้ตลอดนะ!",
    "วันนี้แวะมาดูงานอะไรเป็นพิเศษไหมครับ (´꒳`)",
    "จิ้มปุ่มข้างๆ เพื่อสั่ง COMMISSION ได้เลยนะ",
    "ยินดีต้อนรับอีกครั้งนะ (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)",
  ],

  // ── การตั้งค่าเสียงพูด 8-บิต (8-bit Voice Sound Settings - Web Audio API) ──
  sound: {
    enabled: true,             // เปิด/ปิดเสียงพูด 8-บิต (true / false)
    volume: 0.12,              // ระดับความดังหลัก (ปรับเพิ่มจาก 0.055 เป็น 0.12 ให้ได้ยินชัดเจนยิ่งขึ้น)
    volumeSwing: 0.45,         // อัตราสวิงความเบา-ดัง (0.0 = ดังเท่ากันทุกพยางค์, 0.45 = พยางค์หนักเบาต่างกัน ~3 เท่า, 0.8 = ต่างกัน 8-10 เท่า)
    basePitch: 450,            // ระดับความถี่เสียงพื้นฐาน (Hz: 350 = ทุ้มเข้ม, 450 = กลางๆ น่ารัก, 560 = แหลมใส)
    pitchSwing: 110,           // ระยะสวิงสูง-ต่ำของระดับเสียง (Hz: ยิ่งมากเสียงยิ่งมีเมโลดี้ขึ้นลงเป็นธรรมชาติ เช่น 80 - 150Hz)
    waveType: 'triangle',      // ชนิดคลื่นเสียง ('triangle' = นุ่มนวลกลมกล่อม, 'square' = 8-bit ติ๊ดๆ เรโทรแท้, 'sine' = ใสนุ่ม)
    pitchGlide: 0.82,          // การสไลด์คีย์ในแต่ละพยางค์ (0.75 - 0.95: รูดคีย์ลงเลียนแบบเสียงสระ/คำพูด)
    blipSpeedMs: 76,           // ความเร็วการเคาะพยางค์ (ms: ยิ่งน้อยยิ่งพูดรัวไว เช่น 65 - 90ms)
    blipDurationMs: 44,        // ความยาวของเนื้อเสียงแต่ละพยางค์ (ms: 30 - 55ms)
    filterCutoff: 2200,        // โทนความทุ้ม-แหลม (Hz: 1500 = ทุ้มอบอุ่น, 2200 = พอดีๆ, 3500 = ใสคมชัด)
  },

  // รายการคำพูดเพิ่มเติม (สุ่มแสดงหลังจากคำแรก)
  greetingPool: [
    "สวัสดี (◍•ᴗ•◍)",
    "ยินดีที่ได้รู้จัก (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)",
    "ชี้สิ่งที่สนใจ เดี๋ยวผมอธิบายให้เอง",
    "ติ๊กตอก ๆๆ",
    "ค่าตัวผมแพงนะรู้ป่าว ୧⁠(⁠ ⁠˵⁠ ⁠°⁠ ⁠~⁠ ⁠°⁠ ⁠˵⁠ ⁠)⁠୨",
    "เจ้าของเว็บบอกว่าถ้ามาช่วยจะได้ลูกอม (⁠人⁠ ⁠•͈⁠ᴗ⁠•͈⁠)ノ由",
    "โอเคคุณชี้ไปเลยเดี๋ยวผมอธิบายให้ (⁠ ⁠•⁠ ⁠▽⁠ ⁠•⁠ ⁠)",
    "คลิกที่ตัวผม เดี๋ยวจะนั้งรออธิบายอยู่ตรงนี้ (⁠ ⁠•⁠ ⁠▽⁠ ⁠•⁠ ⁠)",
    "เมาส์ไปไหน ผมจะตามไปทางนั้น (⁠•⁠ ⁠u⁠ ⁠•⁠ )ノ~",
    "กดที่ปุ่มด้านล่างได้เลยนะ (⁠•⁠ ⁠‿⁠ ⁠•⁠ )",
    "ลูกอมๆ ₍⁠₍⁠ ⁠◝⁠(⁠　ﾟ⁠∀⁠ ﾟ⁠ ⁠)⁠◟⁠ ⁠⁾⁠⁾",
    "จ้องนานๆ ระวังหลงรักนะ (⁠ ⁠•͈⁠ ᴗ⁠ ⁠•͈⁠ )",
    "ฟิ้วววววววว (⁠・⁠o⁠・⁠)",
    "เจ้านายยยยยยยยยยยยยย (⁠・3⁠・⁠)",
    "ผมว่าเขาน่าจะลืมให้ลูกอมผมแล้วอะ (⁠๑⁠´⁠•⁠.̫⁠ ⁠•⁠ ⁠`⁠๑⁠)",
  ],

  // ข้อความเดิมตอนปุ่มหดกลับเป็นปกติ หรือตอนชี้เมาส์ (สุ่มเปลี่ยนใหม่ทุกครั้งที่เมาส์เข้ามาชี้)
  defaultButtonText: [
    "สั่ง COMMISSION ไหม?",
    "โอเคไปสั่ง COMMISSION กันเถอะ ⊂(・▽・⊂)",
    "เริ่มตกหลุมรักงานนี้แล้วสิเรา (◍•ᴗ•◍)",
  ],

  // ── ข้อความเมื่อสั่งให้ตัว O นั่งรอนิ่งๆ ตรงจุดที่วางไว้ (Stay / Placed Dialogue) ──
  stayPool: [
    "โอเคเดี๋ยวผมจะรออยู่ตรงนี้นะ(´ . .̫ . `)",
    "พักเหนื่อยแป๊บ วางผมไว้ตรงนี้แหละ ( ｡• ᵕ •｡ )",
    "ถ้าง่วงแล้ว คลิกขวาที่ตัวผมเพื่อส่งกลับบ้านได้นะ",
    "อย่าทิ้งผมไว้นานนะ (´･ω･`)",
    "เจ้านายจะไปไหนอีกแล้ว ( ・_・)ノ",
  ],

  // ── ตำแหน่งของตัว O เทียบกับเคอร์เซอร์เมาส์ (Position of O relative to mouse) ──
  // ตัวเลือกที่สามารถปรับได้:
  //   - 'bottom-right' : ขวาล่าง 
  //   - 'bottom-left'  : ซ้ายล่าง (ค่าเริ่มต้นตามที่ต้องการ)
  //   - 'top-right'    : ขวาบน
  //   - 'top-left'     : ซ้ายบน
  oPosition: 'bottom-left',

  // ── ตำแหน่งของกล่องคำพูดเทียบกับตัว O (Speech bubble position relative to O) ──
  // ตัวเลือกที่สามารถปรับได้:
  //   - 'top-left'     : บนซ้าย (ค่าเริ่มต้น)
  //   - 'top-right'    : บนขวา
  //   - 'bottom-left'  : ล่างซ้าย
  //   - 'bottom-right' : ล่างขวา
  bubblePosition: 'top-left',

  // ── การตั้งค่าระยะเวลา (Timings in milliseconds: 1000 = 1 วินาที) ──
  timing: {
    greetingHoldMs: 5000,          // เวลาที่แสดงข้อความทักทายค้างไว้ในโหมดปกติ (5 วินาที)
    introSentenceHoldMs: 2000,     // เวลาแสดงแต่ละประโยคในโหมดแนะนำตัวต่อเนื่อง (2 วินาที)
    introTransitionMs: 180,        // เวลาสลับเปลี่ยนระหว่างประโยค (0.18 วินาที)
    proximityRadius: 160,          // ระยะเคอร์เซอร์เมาส์เข้าใกล้ชื่อเพื่อเริ่มทักทาย (160px)
    proximityLeaveRadius: 320,     // ระยะเคอร์เซอร์เมาส์ออกจากชื่อก่อนเริ่มนับเวลากลับบ้าน (320px)
    proximityCooldownMs: 2500,     // เวลาเว้นช่วงก่อนทักทายรอบใหม่เมื่อจบชุด (2.5 วินาที)
    approachDelayMs: 420,          // หน่วงเวลาก่อนเริ่มกางกล่องคำพูดหลังบินไปหา O (0.42 วินาที)
    collapseResetMs: 260,          // เวลาคืนค่าข้อความหลังหดตัวกลับ (0.26 วินาที)
    glideInFlightMs: 520,          // เวลาบินเลื่อนมาจากทางขวามือ (0.52 วินาที)
    returnFlightMs: 480,           // เวลาบินกลับประจำที่เดิมทางขวามือ (0.48 วินาที)
    greetOnReload: true,           // แสดงข้อความทักทายตอนโหลด/รีเฟรชหน้าเว็บใหม่ถ้าตัว O กำลังติดตามเมาส์อยู่
    reloadGreetingDelayMs: 350,    // หน่วงเวลาก่อนเริ่มทักทายตอนโหลดหน้าเว็บใหม่ (0.35 วินาที)
    idleGreetingIntervalMs: 8000,  // แสดงข้อความทักทายทุกๆ 8 วินาที หากผู้ใช้ไม่ได้กดหรือเข้าไปชี้ปุ่ม
  },

  // ── การตั้งค่าฟิสิกส์และความเร็ว (Physics & Sizes) ──
  physics: {
    oChaseLerp: 0.055,       // ความลื่นไหลในการบินตามเมาส์ของตัว O
    fabChaseLerp: 0.095,     // ความลื่นไหลของปุ่มส่งข้อความที่บินตามตัว O
    compactBadgePx: 42,      // ขนาดเส้นผ่านศูนย์กลางตัว O ตอนย่อส่วน (px)
    oOffsetFromMouse: 16,    // ระยะห่างระหว่างตัว O กับเคอร์เซอร์เมาส์ (px)
    bubbleOffsetX: 12,       // ระยะห่างแนวนอนของกล่องคำพูดจากขอบตัว O (px)
    bubbleOffsetY: 12,       // ระยะห่างแนวตั้งของกล่องคำพูดจากขอบตัว O (px)
    pointerLength: 10,       // ความยาวแหลมของหางกล่องคำพูด (px)
    pointerBaseWidth: 12,    // ความกว้างฐานของหางกล่องคำพูด (px)
    pinnedMaxPull: 9.0,      // ระยะโน้มตัวตามเมาส์สูงสุดตอนปักหมุด (px: 3-9px)
    pinnedMaxTilt: 8.0,      // มุมเอียงตัวสูงสุดตอนปักหมุด (องศา: -8 ถึง +8)
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ── บทพูดอธิบายจุดสำคัญทั้งหมดบนหน้าหลักเมื่อชี้เมาส์ (Section Explanations) ──
  // ═════════════════════════════════════════════════════════════════════════
  // 💡 [คู่มือสำหรับคุณในการแก้ไขหรือเพิ่มข้อความในอนาคต]:
  // ─────────────────────────────────────────────────────────────────────────
  // 1. enabled:       เปิด (true) หรือ ปิด (false) ระบบอธิบายเมื่อชี้เมาส์
  // 2. hoverDelayMs:  เวลาที่ต้องชี้เมาส์ค้างไว้ก่อนตัว O จะเริ่มพูด (แนะนำ 500-750ms)
  // 3. cooldownMs:    ระยะเวลาเว้นช่วงก่อนที่จะพูดเรื่องเดิมซ้ำ (เช่น 14000 = 14 วินาที)
  // 4. วิธีใส่หลายข้อความในจุดเดียว (แบบสุ่มคำ):
  //    ✨ คุณสามารถใส่ `message` เป็นข้อความเดียว หรือใส่เป็น Array หลายๆ ข้อความได้เลยครับ!
  //    เช่น:
  //    message: [
  //      "ข้อความที่ 1 (◍•ᴗ•◍)",
  //      "ข้อความที่ 2 ⊂(・▽・⊂)",
  //      "ข้อความที่ 3 (⁠•⁠ ⁠u⁠ ⁠•⁠ )ノ"
  //    ]
  //    ทุกครั้งที่แวะมาชี้จุดนี้ ตัว O จะสุ่มประโยคใหม่ๆ ไม่ให้ซ้ำกันมาพูดให้ฟังครับ!
  // 5. ทางลัดผ่าน HTML:  สามารถใส่ attribute `data-o-talk="ข้อความ"` ที่แท็ก HTML ใดๆ ได้เลย
  // ─────────────────────────────────────────────────────────────────────────
  sectionExplaining: {
    enabled: true,
    hoverDelayMs: 650,    // ชี้ค้างไว้ 0.65 วินาทีถึงจะเริ่มพูด
    cooldownMs: 14000,    // จุดเดิมจะไม่พูดซ้ำจนกว่าจะผ่านไป 14 วินาที
    sections: [
      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 1: แถบเมนูด้านบน (Navbar & Navigation Links)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'nav-brand',
        selector: '.brand-logo, #nav-brand-name, .nav-avatar',
        message: 'ยินดีต้อนรับสู่สตูดิโอของ Toru O แวะชมผลงานตามสบายเลยนะ (⁠人⁠ ⁠•͈⁠ᴗ⁠•͈⁠)',
      },
      {
        id: 'nav-home',
        selector: '#nav-home',
        message: 'ปุ่มหน้าแรก อยากกลับมาจุดเริ่มต้นเมื่อไหร่ก็กดตรงนี้ได้นะ',
      },
      {
        id: 'nav-queue',
        selector: '#nav-queue',
        message: 'แวะมาส่องคิวงานตรงนี้ได้เลย ดูสิว่ายาวไปถึงไหนแล้ว (⁠•⁠ ⁠‿⁠ ⁠•⁠ )',
      },
      {
        id: 'nav-tools',
        selector: '#nav-tools',
        message: 'หน้ารวมเครื่องมือเจ๋งๆ สำหรับสายวาดและนักออกแบบ ลองแวะไปดูสิ!',
      },
      {
        id: 'nav-terms',
        selector: '#nav-terms',
        message: 'ข้อตกลงและกติกาจ้างงาน อ่านไว้สักนิดจะได้ทำงานร่วมกันแฮปปี้!',
      },
      {
        id: 'nav-theme',
        selector: '#nav-theme-btn',
        message: 'ปุ่มสลับธีมเว็บ! ชอบแบบมืดเท่ๆ หรือสว่างสะอาดตาลองกดดูได้เลย',
      },
      {
        id: 'nav-commission',
        selector: '#nav-commission-btn, #nav-comm-slots',
        message: 'เช็คสถานะคอมมิชชันตรงนี้ สล็อตว่างอยู่ไหมแวะมาดูสิ (◍•ᴗ•◍)',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 2: แถบเครื่องมือลัดด้านข้าง (Sidebar & Quick Tools)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'sidebar-top',
        selector: '.sidebar-btn[data-tip="หน้าหลัก"]',
        message: 'ปุ่มลัดพุ่งทะยานกลับขึ้นไปบนสุด ฟิ้ววววว (⁠・⁠o⁠・⁠)',
      },
      {
        id: 'sidebar-refboard',
        selector: '#sidebar-refboard, #refboard-fab',
        message: 'กระดานแปะ Ref งาน ช่วยจัดระเบียบภาพอ้างอิงให้วาดง่ายขึ้นเยอะเลย!',
      },
      {
        id: 'sidebar-palette',
        selector: '#sidebar-colorpalette, #palette-fab',
        message: 'เครื่องมือดูดสีและจับคู่สี สุ่มสีโดนใจได้ในคลิกเดียว ลองเล่นดูสิ!',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 3: แบนเนอร์วิดีโอด้านบน (Hero Video Banner)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'hero-video',
        selector: '.hero-video-banner, #hero-video, #video-ph',
        message: 'แบนเนอร์วิดีโอโชว์ผลงานเด่น สะดุดตาใช่ไหมล่ะ (⁠ ⁠•⁠ ⁠▽⁠ ⁠•⁠ ⁠)',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 4: ข้อมูลโปรไฟล์และโซเชียลมีเดีย (Profile & Creator Info)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'profile-avatar',
        selector: '.profile-circle, #profile-hero-ph, #profile-hero-img',
        message: 'โฉมหน้ารูปโปรไฟล์ของเจ้าของเว็บ เท่ระเบิดไปเลยใช่ไหมล่ะ!',
      },
      {
        id: 'profile-name',
        selector: '#profile-name-el',
        message: 'นี่เจ้าของผมเอง Toru O เข้าบอกถ้าผมมาช่วยจะได้ลูกอม (⁠≧⁠▽⁠≦⁠)',
      },
      {
        id: 'profile-tags',
        selector: '#profile-tags-el',
        message: 'หมวดหมู่งานหลักของที่นี่: Motion · Digital Art · Adoptable ถนัดครบเลย',
      },
      {
        id: 'contact-fab',
        selector: '#contact-fab-btn',
        message: 'ปุ่มส่งข้อความแชท ทักไปคุยเรื่องงานหรือสอบถามรายละเอียดได้เลยนะ!',
      },
      {
        id: 'home-comm-badge',
        selector: '#home-comm-badge-wrap, .home-comm-badge-wrap',
        message: 'ป้ายสถานะเปิดรับงาน! ถือคิวรอทำอยู่ สนใจจิ้มไปคุยได้เลยนะ (◍•ᴗ•◍)',
      },

      // ลิงก์โซเชียลมีเดียแต่ละช่องทาง
      {
        id: 'social-x',
        selector: '#social-x',
        message: 'ไปส่องผลงานอัปเดตไวๆ บน X (Twitter) กันได้ตรงนี้นะ (⁠•⁠ ⁠u⁠ ⁠•⁠ )ノ',
      },
      {
        id: 'social-fb',
        selector: '#social-fb',
        message: 'แวะไปกดไลก์และทักทายที่หน้า Facebook ได้นะ!',
      },
      {
        id: 'social-ig',
        selector: '#social-ig',
        message: 'แกลเลอรีรูปภาพสวยๆ บน Instagram เอ๊ะมันคืออะไรอ๊ะ? (⁠๑⁠•⁠ ⁠▽⁠ ⁠•⁠๑⁠)',
      },
      {
        id: 'social-da',
        selector: '#social-da',
        message: 'DeviantArt เหรอ? เห็นว่าเขาจะลงอดอปในนี้!',
      },

      // ภาพรวมของแถวโปรไฟล์ (ถ้าชี้พื้นที่ว่างในแถวโปรไฟล์)
      {
        id: 'profile-row',
        selector: '.profile-row',
        message: 'โซนแนะนำตัวเจ้าของเว็บ มีทั้งช่องทางติดตามและผลงานเจ๋งๆ เพียบ!',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 5: แกลเลอรีผลงานแต่ละหมวด (Galleries)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'sec-motion',
        selector: '#sec-motion, .motion-carousel-wrap, #gallery-motion',
        message: [
          'ตรงนี้งานโมชัน ขยับดุ๊กดิ๊กได้นะ ลองเลื่อนดูสิ (⁠・⁠∀⁠・⁠)ノ',
          'แอนิเมชันขยับสมูทๆ ทุกลายเส้นตั้งใจทำมากๆ เลยนะ',
          'ชอบงานชิ้นไหนเป็นพิเศษไหม เลื่อนดูได้ตามสบายเลย (◍•ᴗ•◍)',
        ],
      },
      {
        id: 'da-show-more',
        selector: '.da-show-more-btn, #da-fade-overlay',
        message: 'ยังไม่หมดนะ! กดปุ่มนี้เพื่อเปิดดูภาพวาดดิจิทัลทั้งหมดออกมาได้เลย',
      },
      {
        id: 'sec-digital',
        selector: '#sec-digital, #da-scroll-box, #gallery-digital-art',
        message: 'โซนงานวาดภาพ ดิจิทัลอาร์ตลายเส้นสวยตาแตกเลยใช่ไหมล่ะ (⁠人⁠ ⁠•͈⁠ᴗ⁠•͈⁠)',
      },
      {
        id: 'sec-adoptable',
        selector: '#sec-adoptable, #gallery-adoptable',
        message: 'น้องๆ Adoptable อยู่นี่ ระวังตกหลุมรักจนอยากรับไปเลี้ยงนะ ฅ(^•ω•^)ฅ',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 6: ส่วนท้ายของเว็บไซต์ (Footer)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'site-footer',
        selector: '.site-footer, #footer-contact',
        message: 'ด้านล่างสุดของเว็บแล้ว มีช่องทางติดต่อเพิ่มเติมตรงนี้นะครับ (⁠•⁠ ⁠‿⁠ ⁠•⁠ )',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 7: หน้าต่างแสดงรายละเอียดผลงาน (Unified Lightbox & Viewer)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'lb-close',
        selector: '.lb-close',
        message: 'ดูเสร็จแล้วคลิกตรงนี้เพื่อปิดหน้าต่างแล้วกลับไปเลือกชมงานอื่นต่อนะ',
      },
      {
        id: 'lb-video',
        selector: '#lb-vid, .lb-media video',
        message: 'วิดีโอโมชันแบบเต็มตา ดูการเคลื่อนไหวสุดลื่นไหลตรงนี้ได้เลย (⁠・⁠∀⁠・⁠)ノ',
      },
      {
        id: 'lb-image',
        selector: '#lb-img, .lb-media img',
        message: 'ภาพผลงานขนาดใหญ่ ซูมดูลายเส้นและรายละเอียดสวยๆ ได้เต็มตาเลย (⁠人⁠ ⁠•͈⁠ᴗ⁠•͈⁠)',
      },
      {
        id: 'lb-price',
        selector: '#lb-price, .lb-price',
        message: 'ป้ายราคาและสถานะ สนใจชิ้นไหนทักแชทไปสอบถามหรือสั่งซื้อได้เลยนะ (◍•ᴗ•◍)',
      },
      {
        id: 'lb-title',
        selector: '#lb-title, .lb-title',
        message: 'ชื่อผลงานและชื่อเจ้าของผลงานชิ้นนี้ครับ เท่ใช่ไหมล่ะ!',
      },
      {
        id: 'lb-desc',
        selector: '#lb-desc, .lb-desc',
        message: 'รายละเอียดผลงานและข้อตกลงการใช้งาน อ่านทำความเข้าใจได้เลยนะ (⁠•⁠ ⁠‿⁠ ⁠•⁠ )',
      },
      {
        id: 'lb-info',
        selector: '.lb-info, #lb-info',
        message: 'แผงข้อมูลผลงาน มีทั้งคำอธิบาย กฎการใช้งาน และสถานะครบถ้วน',
      },
      {
        id: 'lb-media',
        selector: '.lb-media, #lb-media',
        message: 'ส่วนแสดงมีเดียผลงานหลัก ภาพและวิดีโอถูกปรับขนาดให้รับชมได้อย่างลงตัว',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 8: หน้าตารางคิวงาน (Queue Page & Queue Table)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'queue-title',
        selector: '.queue-page-title',
        message: 'หน้ารวมตารางคิวงาน ติดตามคิวและความคืบหน้าของงานทั้งหมดได้ที่นี่เลย',
      },
      {
        id: 'queue-updated',
        selector: '#queue-updated, .queue-page-sub',
        message: 'วันที่อัปเดตสถานะคิวงานล่าสุด มั่นใจได้ว่าข้อมูลสดใหม่แน่นอน!',
      },
      {
        id: 'queue-badge',
        selector: '#queue-comm-badge-wrap, .queue-comm-badge-wrap',
        message: 'ป้ายสถานะคิวคอมมิชชัน ดูว่าตอนนี้ยังมีสล็อตว่างเปิดรับงานไหม (◍•ᴗ•◍)',
      },
      {
        id: 'queue-thead',
        selector: '.queue-table thead, .queue-table th',
        message: 'หัวตารางคิวงาน แยกประเภท สถานะ วันที่ และความคืบหน้าให้ตรวจสอบง่ายๆ',
      },
      {
        id: 'queue-row',
        selector: '#queue-tbody tr, .queue-table tbody tr',
        message: 'รายการคิวงานที่กำลังดำเนินการ เช็คสถานะและความคืบหน้าของงานตรงนี้ได้เลย (⁠•⁠ ⁠u⁠ ⁠•⁠ )ノ',
      },
      {
        id: 'queue-completed',
        selector: '#queue-completed-section, .queue-completed-section',
        message: 'โซนผลงานที่เสร็จสมบูรณ์เรียบร้อยแล้ว ส่งมอบงานถึงมือลูกค้าแฮปปี้!',
      },
      {
        id: 'queue-table-wrap',
        selector: '.queue-wrap',
        message: 'ตารางแสดงคิวงาน ทำงานตามลำดับคิวอย่างโปร่งใสและตรงเวลาครับ (⁠ ⁠•⁠ ⁠▽⁠ ⁠•⁠ ⁠)',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 9: หน้าเครื่องมือ - Character Generator (ระบบสุ่มสร้างตัวละคร)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'cg-title',
        selector: '.cg-header, .cg-title, #character-generator-root h1, #character-generator-root h2',
        message: [
          'ยินดีต้อนรับสู่ Character Generator! นึกไอเดียไม่ออกให้ระบบนี้ช่วยสุ่มได้นะ (⁠人⁠ ⁠•͈⁠ᴗ⁠•͈⁠)',
          'เครื่องมือช่วยจุดประกายไอเดียตัวละคร สุ่มได้ทั้งนิสัย อาชีพ และสไตล์เสื้อผ้าเลย!',
        ],
      },
      {
        id: 'cg-quest',
        selector: '#cg-daily-card-outer, .cg-daily-card, #cg-daily-ribbon',
        message: [
          'โจทย์ท้าทายออกแบบตัวละครประจำวัน! ลองรับคำท้าไปวาดเล่นดูสิ (⁠≧⁠▽⁠≦⁠)',
          'เควสต์ออกแบบตัวละคร มีเวลาจับเวลาถอยหลังด้วยนะ ท้าทายฝีมือสุดๆ!',
        ],
      },
      {
        id: 'cg-card',
        selector: '#cg-card-outer, #cg-card, .cg-card',
        message: [
          'การ์ดสุ่มไอเดียตัวละคร! คลิกสุ่มใหม่ หรือล็อคลักษณะเด่นที่ชอบไว้ได้นะ (◍•ᴗ•◍)',
          'ตรงนี้จะรวมจุดเด่น เผ่าพันธุ์ และพรสวรรค์ของตัวละครเอาไว้ ลองกดสุ่มดูสิ!',
        ],
      },
      {
        id: 'cg-trans',
        selector: '#cg-title-trans-btn, #cg-picker-trans-btn',
        message: 'ปุ่มแปลภาษา สลับดูชื่อลักษณะเป็นภาษาไทยหรืออังกฤษได้ตามถนัดเลยนะ',
      },
      {
        id: 'cg-saved',
        selector: '#cg-saved-count-badge, .cg-saved-section, #cg-saved-grid',
        message: [
          'คลังบันทึกไอเดียตัวละคร! สุ่มเจอตัวที่ถูกใจแล้วกดเซฟเก็บไว้ดูตรงนี้ได้เลย (⁠•⁠ ⁠‿⁠ ⁠•⁠ )',
          'ไอเดียที่บันทึกไว้จะถูกเก็บไว้ที่นี่ ไม่ต้องกลัวหายเลยล่ะ',
        ],
      },
      {
        id: 'cg-picker',
        selector: '#cg-trait-search-input, #cg-picker-body',
        message: 'หน้าต่างเลือกเจาะจงลักษณะ อยากได้ทรงผมหรืออาชีพแบบไหนพิมพ์ค้นหาได้เลย!',
      },
      {
        id: 'cg-root',
        selector: '#character-generator-root, #page-tools',
        message: 'หน้ารวมเครื่องมือสร้างสรรค์ผลงาน เลือกใช้ตัวช่วยที่ชอบได้ตามสะดวกเลยครับ (⁠•⁠ ⁠u⁠ ⁠•⁠ )ノ',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 10: หน้าเครื่องมือ - Reference Board (กระดานจัดบอร์ดภาพอ้างอิง)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'ref-canvas',
        selector: '#refboard-canvas, #refboard-viewport',
        message: [
          'ผืนผ้าใบกระดานเรฟ! ลากรูปภาพจากเครื่องมาวาง ย่อขยาย จัดกลุ่มได้อิสระเลย (⁠・⁠∀⁠・⁠)ノ',
          'พื้นที่วางภาพอ้างอิง วางได้ไม่อั้น ช่วยให้มองเห็นองค์ประกอบภาพรวมตอนวาดได้ชัดเจน!',
        ],
      },
      {
        id: 'ref-import',
        selector: '#refboard-import-btn',
        message: 'ปุ่มนำเข้ารูปภาพ จะอัปโหลดจากเครื่องหรือกดแปะ URL ภาพมาวางก็ได้นะ',
      },
      {
        id: 'ref-export',
        selector: '#refboard-export-btn, #refboard-export-backdrop',
        message: [
          'ปุ่มเซฟส่งออกกระดานเรฟ เลือกเซฟเป็นรูปภาพ PNG หรือไฟล์ PDF เก็บไว้ดูได้เลย!',
          'ส่งออกบอร์ดภาพอ้างอิงไปใช้งานต่อในโปรแกรมวาดรูปได้สบายๆ เลยครับ',
        ],
      },
      {
        id: 'ref-arrange',
        selector: '#refboard-arrange-btn',
        message: 'ปุ่มจัดระเบียบภาพอัตโนมัติ รกแค่ไหนกดปุ่มเดียวก็เรียงสวยทันใจ!',
      },
      {
        id: 'ref-grid',
        selector: '#refboard-grid-btn',
        message: 'เปิดหรือปิดตาราง Grid ช่วยเล็งตำแหน่งและระยะห่างของภาพให้เป๊ะขึ้น',
      },
      {
        id: 'ref-bg',
        selector: '#refboard-bg-btn',
        message: 'เปลี่ยนสีพื้นหลังกระดานเรฟ เลือกโทนมืดหรือสว่างให้สบายตากับงานที่กำลังทำ',
      },
      {
        id: 'ref-undo-redo',
        selector: '#refboard-undo-btn, #refboard-redo-btn',
        message: 'ปุ่มกดย้อนกลับ (Undo) และทำซ้ำ (Redo) วางภาพผิดตำแหน่งก็กดย้อนได้ตลอด',
      },
      {
        id: 'ref-header',
        selector: '#refboard-header',
        message: 'แถบควบคุมกระดานเรฟ ย่อขยายหน้าต่าง หรือตรึงไว้บนหน้าจอได้ตามใจชอบ',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 11: หน้าเครื่องมือ - Color Palette (ระบบจับคู่สีและจานสี)
      // ─────────────────────────────────────────────────────────────────────
      {
        id: 'cp-random-btn',
        selector: '#cp-title-randomize-btn, #cp-btn-random',
        message: [
          'ปุ่มสุ่มคู่สีใหม่! หรือจะกดปุ่ม Spacebar บนคีย์บอร์ดเพื่อสุ่มไวๆ ก็ได้นะ (⁠≧⁠▽⁠≦⁠)',
          'กดสุ่มเพื่อค้นหาแรงบันดาลใจคู่สีใหม่ๆ สุ่มได้ไม่จำกัดครั้งเลย!',
        ],
      },
      {
        id: 'cp-harmony',
        selector: '#cp-harmony-btn, #cp-harmony-dropdown-wrap',
        message: [
          'เมนูเลือกทฤษฎีสี! มีทั้งสีตรงข้าม สีข้างเคียง ไตรภาคี และโมโนโครมให้เลือก',
          'จับคู่สีตามหลักทฤษฎีสี อยากได้อารมณ์ภาพแบบไหนเลือกโหมดนี้ช่วยคุมโทนได้เลย (◍•ᴗ•◍)',
        ],
      },
      {
        id: 'cp-bars',
        selector: '.cp-bar, .cp-bars-container',
        message: [
          'แถบแสดงพาเลตต์สี! แต่ละช่องสามารถกดล็อค ลากสลับ หรือคลิกดูดค่าสีได้นะ',
          'คลิกที่แถบสีเพื่อดูโค้ดสี Hex หรือปรับค่าเฉดสีแบบละเอียดได้เลยครับ',
        ],
      },
      {
        id: 'cp-preview-theme',
        selector: '#cp-btn-preview-theme',
        message: 'ปุ่มพรีวิวธีม! ลองกดดูสิ หน้าเว็บนี้จะเปลี่ยนสีตามพาเลตต์ที่คุณเพิ่งสุ่มเลย ว้าวมาก!',
      },
      {
        id: 'cp-inspector',
        selector: '#cp-inspector, #cp-inspector-card',
        message: 'หน้าต่างตรวจสอบค่าสีอย่างละเอียด มีทั้งค่า RGB, HSV และค่าความต่างสี (Contrast)',
      },
      {
        id: 'cp-tabs',
        selector: '#cp-tab-saved, #cp-tab-presets',
        message: 'คลังเก็บพาเลตต์สี! มีทั้งชุดสีที่คุณกดบันทึกไว้ และพรีเซ็ตสีสวยๆ สำเร็จรูปให้เลือกใช้',
      },
      {
        id: 'cp-modal',
        selector: '#color-palette-modal',
        message: 'หน้าต่าง Color Generator สามารถลากขอบด้านขวาเพื่อปรับขนาดหน้าต่างได้ด้วยนะ (⁠•⁠ ⁠‿⁠ ⁠•⁠ )',
      },

      // ─────────────────────────────────────────────────────────────────────
      // 📌 หมวดที่ 12: หน้าคำนวณราคาคอมมิชชัน & ข้อตกลง (Commission & Terms)
      // ─────────────────────────────────────────────────────────────────────
      // 1. รายการคำนวณราคาแต่ละชิ้นที่ดึงมาจาก Google Sheets แบบเรียลไทม์
      {
        id: 'terms-info-item',
        selector: '.terms-info-item',
        message: function(el) {
          if (!el) return '';
          let title = (el.getAttribute('data-title') || '').trim();
          const price = (el.getAttribute('data-price') || '').trim();
          const isSel = el.classList.contains('calc-selected');
          // คุมความยาวชื่อบนจอมือถือ ไม่ให้ยาวเกินไป
          if (title.length > 15) {
            title = title.slice(0, 14) + '..';
          }
          if (isSel) {
            return [
              `เลือก ${title} ไว้แล้วนะ (´꒳\`)`,
              `กดซ้ำเพื่อยกเลิก ${title} ได้ครับ`,
            ];
          }
          if (price) {
            return [
              `${title} (${price}) กด [+] คำนวณได้นะ`,
              `กดปุ่ม [+] เพื่อรวมราคา ${title} ได้เลย`,
            ];
          }
          return `${title} กดดูรายละเอียดได้นะ`;
        },
      },
      // 2. ปุ่มลอยใบเสนอราคา / ดูยอดรวมคำนวณ
      {
        id: 'terms-price-fab',
        selector: '#price-fab',
        message: function() {
          const textEl = document.getElementById('price-fab-text');
          const text = textEl ? textEl.textContent.trim() : '';
          if (!text || text.includes('0') || text === '฿0' || text === 'ราคา: ฿0') {
            return [
              "กด [+] ที่รายการเพื่อคำนวณราคานะ",
              "ใบเสนอราคา! เลือกรายการได้เลย (◍•ᴗ•◍)",
            ];
          }
          return [
            `ยอดรวม ${text} จิ้มดูใบเสนอราคาได้นะ`,
            `คำนวณไว้ ${text} คลิกเปิดดูบิลได้เลย!`,
          ];
        },
      },
      // 3. หัวข้อ Commission และคำอธิบายภาพรวม
      {
        id: 'terms-commission-guide',
        selector: '#terms-commission .terms-section-title',
        message: [
          "กด [+] ตามรายการที่สนใจเพื่อคำนวณราคา",
          "เลือกสเกลภาพและฉากหลังได้ตามชอบเลยนะ",
        ],
      },
      // 4. ปุ่มลอยส่งข้อความบนหน้า Commission
      {
        id: 'terms-contact-fab',
        selector: '.terms-contact-fab',
        message: [
          "คิดราคาเสร็จแล้ว ทักแชทส่งบรีฟได้เลยนะ",
          "กดตรงนี้เพื่อเปิดแชทคุยงานกับเจ้าของผม!",
        ],
      },
      // 5. หมวดเงื่อนไขและข้อตกลง Adoptable
      {
        id: 'terms-adoptable',
        selector: '#terms-adoptable .terms-section-title',
        message: [
          "ข้อตกลงและเงื่อนไขรับเลี้ยง Adoptable",
          "อ่านกติกาลิขสิทธิ์ก่อนรับเลี้ยงน้องๆ นะ",
        ],
      },
      // 6. ปุ่มคำสั่งต่างๆ ภายในหน้าต่างใบเสนอราคา (Receipt Modal)
      {
        id: 'receipt-copy',
        selector: '.receipt-btn.copy-btn',
        message: "กดคัดลอกรายการไปส่งในแชทได้เลยนะ",
      },
      {
        id: 'receipt-save',
        selector: '.receipt-btn.save-btn',
        message: "บันทึกใบเสนอราคาเป็นรูปภาพเก็บไว้ได้นะ",
      },
      {
        id: 'receipt-reset',
        selector: '.receipt-btn.reset-btn',
        message: "ล้างรายการที่เลือกทั้งหมดเพื่อคิดใหม่",
      },
    ]
  }
};

(function initEasterEggCompanion() {
  let isChasing = false;
  let floatingEl = null;
  let floatingFabEl = null;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = 0;
  let currentY = 0;
  let currentScale = 1.0;
  let compactScale = 0.45;
  let badgeSize = 44;
  let animId = null;
  let currentTilt = 0;
  let fabX = 0;
  let fabY = 0;
  let fabGreetingActive = false;
  let isFabHovered = false;
  let isExplainingSection = false; // สถานะกำลังอธิบายจุดสำคัญ (ย้ายตำแหน่งขึ้นบนและสลับซ้ายขวาตามพื้นที่จอ)
  let isPinned = false;          // สถานะปักหมุดอยู่นิ่งตรงจุดที่วาง
  let pinnedX = 0;               // พิกัด X ที่ปักหมุด
  let pinnedY = 0;               // พิกัด Y ที่ปักหมุด
  let isDraggingO = false;       // กำลังลากตัว O อยู่หรือไม่
  let dragStartX = 0;            // จุดเริ่มต้น Pointer X ตอนลาก
  let dragStartY = 0;            // จุดเริ่มต้น Pointer Y ตอนลาก
  let dragInitialX = 0;          // ตำแหน่งเริ่มต้นของตัว O ก่อนลาก
  let dragInitialY = 0;          // ตำแหน่งเริ่มต้นของตัว O ก่อนลาก
  let hasMovedSignificantly = false; // มีการลากขยับเกิน threshold หรือไม่
  let touchHoldTimer = null;     // ตัวจับเวลากดค้าง 1 วินาทีบนมือถือเพื่อส่งกลับบ้าน
  let greetingExpandTimer = null;
  let greetingTimer = null;
  let seqTransitionTimer = null;
  let idleGreetingTimer = null;
  let isFirstGreeting = true;
  let lastGreetingIndex = 0;
  let lastDefaultIndex = -1;
  let lastStayIndex = -1;
  let sectionHoverTimer = null;
  let activeSectionKey = null;
  const sectionCooldownMap = new Map();
  const sectionLastIndexMap = new Map();
  let isDockedIntroActive = false;
  let hasPlayedDockedIntro = false;
  let lastDockedIntroTime = 0;
  let dockedIntroLeaveTimer = null;
  let dockedSeqTimer = null;
  let dockedTransitionTimer = null;
  let dockedSeqIndex = 0;
  let dockedIntroCount = 0;
  let lastSubsequentIndex = -1;

  // ═══════════════════════════════════════════════════════════════════
  //  8-BIT RETRO CHIPTUNE SPEECH SYNTHESIZER (Web Audio API)
  // ═══════════════════════════════════════════════════════════════════
  let audioCtx = null;
  let voiceTimer = null;
  let isVoiceSpeaking = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function unlockAudio() {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });

  function play8BitBlip(customFreq = null, customVol = null) {
    const sndCfg = FLOATING_O_CONFIG.sound || {};
    if (sndCfg.enabled === false) return;

    try {
      const ctx = getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // ชนิดคลื่นเสียงตาม Config (triangle = นุ่มนวล, square = เรโทร 8-bit, sine = ใสนุ่ม)
      osc.type = sndCfg.waveType || 'triangle';

      const basePitch = sndCfg.basePitch || 450;
      const freq = customFreq || basePitch;
      const now = ctx.currentTime;

      // Pitch glide ลงเบาๆ เลียนแบบจังหวะออกเสียงพยางค์
      const glideFactor = typeof sndCfg.pitchGlide === 'number' ? sndCfg.pitchGlide : 0.82;
      const durationSec = ((sndCfg.blipDurationMs || 44) / 1000);
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(80, freq * glideFactor), now + durationSec * 0.9);

      // Low-pass filter ตัดความถี่สูงแหลมบาดหูออก ให้โทนอบอุ่นแบบ Retro Gaming
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(sndCfg.filterCutoff || 2200, now);

      // คำนวณความดังพร้อม Dynamic Volume Swing (รองรับระดับความดังสูงสุดถึง 1.0)
      const baseVol = typeof sndCfg.volume === 'number' ? sndCfg.volume : 0.12;
      const finalVol = Math.max(0.005, Math.min(1.0, (customVol !== null ? customVol : baseVol)));

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(finalVol, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec + 0.005);
    } catch (_) {}
  }

  function playSpeechSoundBurst(syllableCount = 4, intervalMsOverride = null) {
    stopSpeechSound();
    isVoiceSpeaking = true;
    let count = 0;

    const sndCfg = FLOATING_O_CONFIG.sound || {};
    const basePitch = sndCfg.basePitch || 450;
    const pitchSwing = typeof sndCfg.pitchSwing === 'number' ? sndCfg.pitchSwing : 110;
    const baseVol = typeof sndCfg.volume === 'number' ? sndCfg.volume : 0.12;
    const volSwing = typeof sndCfg.volumeSwing === 'number' ? sndCfg.volumeSwing : 0.45;
    const speedMs = intervalMsOverride || (sndCfg.blipSpeedMs || 76);

    function triggerNextBlip() {
      if (!isVoiceSpeaking || count >= syllableCount) {
        clearInterval(voiceTimer);
        voiceTimer = null;
        return;
      }

      // คำนวณ Pitch Swing: ผสมผสานทำนองเมโลดี้ตามลำดับพยางค์ + ไมโครแวเรียนซ์
      const melodyCurve = Math.sin(count * 1.7) * 0.75 + (Math.random() - 0.5) * 0.5;
      let blipPitch = basePitch + (melodyCurve * pitchSwing);

      // พยางค์สุดท้ายของประโยคยกเสียงสูงขึ้นเล็กน้อย (Inflection ทักทาย)
      if (count === syllableCount - 1 && syllableCount > 2) {
        blipPitch += pitchSwing * 0.35;
      }

      // คำนวณ Volume Swing: สวิงความเบา-ดังของแต่ละพยางค์
      // พยางค์แรกให้เน้นเสียงคมชัด (accent), พยางค์ถัดๆ ไปสวิงตาม volSwing
      let volMultiplier = 1.0;
      if (count === 0) {
        volMultiplier = 1.0 + (volSwing * 0.4); // เน้นพยางค์แรก
      } else {
        const randomFactor = (Math.random() * 2 - 1); // -1 ถึง +1
        volMultiplier = 1.0 + (randomFactor * volSwing);
      }
      const blipVol = Math.max(0.005, baseVol * volMultiplier);

      play8BitBlip(blipPitch, blipVol);
      count++;
    }

    triggerNextBlip();
    voiceTimer = setInterval(triggerNextBlip, speedMs);
  }

  function stopSpeechSound() {
    isVoiceSpeaking = false;
    if (voiceTimer) {
      clearInterval(voiceTimer);
      voiceTimer = null;
    }
  }

  // ดึงข้อความทักทายจาก Config (ถ้าเป็นครั้งแรกและ greetingText เป็น Array จะส่งคืนชุดประโยคทั้งหมดเพื่อเล่นแบบต่อเนื่อง)
  function getGreetingDialogue() {
    if (isFirstGreeting) {
      isFirstGreeting = false;
      lastGreetingIndex = 0;
      if (Array.isArray(FLOATING_O_CONFIG.greetingText)) {
        return FLOATING_O_CONFIG.greetingText;
      }
      return FLOATING_O_CONFIG.greetingText || "สวัสดี (◍•ᴗ•◍)";
    }
    if (Array.isArray(FLOATING_O_CONFIG.greetingPool) && FLOATING_O_CONFIG.greetingPool.length > 0) {
      const list = FLOATING_O_CONFIG.greetingPool;
      if (list.length === 1) return list[0];
      let idx = Math.floor(Math.random() * list.length);
      if (idx === lastGreetingIndex) {
        idx = (idx + 1) % list.length;
      }
      lastGreetingIndex = idx;
      return list[idx];
    }
    if (Array.isArray(FLOATING_O_CONFIG.greetingText)) {
      return FLOATING_O_CONFIG.greetingText[0] || "สวัสดี (◍•ᴗ•◍)";
    }
    return FLOATING_O_CONFIG.greetingText || "สวัสดี (◍•ᴗ•◍)";
  }

  // ดึงข้อความปกติของปุ่ม (สุ่มเปลี่ยนใหม่ทุกครั้งที่เมาส์เข้ามาชี้)
  function getRandomDefaultButtonText() {
    if (Array.isArray(FLOATING_O_CONFIG.defaultButtonText) && FLOATING_O_CONFIG.defaultButtonText.length > 0) {
      const pool = FLOATING_O_CONFIG.defaultButtonText;
      if (pool.length === 1) return pool[0];
      let idx = Math.floor(Math.random() * pool.length);
      if (idx === lastDefaultIndex) {
        idx = (idx + 1) % pool.length;
      }
      lastDefaultIndex = idx;
      return pool[idx];
    }
    return typeof FLOATING_O_CONFIG.defaultButtonText === 'string'
      ? FLOATING_O_CONFIG.defaultButtonText
      : 'สั่ง COMMISSION ไหม?';
  }

  // ดึงข้อความตอนสั่งให้ตัว O นั่งรอนิ่งๆ ตรงจุดที่วาง (สุ่มเปลี่ยนใหม่)
  function getRandomStayDialogue() {
    if (Array.isArray(FLOATING_O_CONFIG.stayPool) && FLOATING_O_CONFIG.stayPool.length > 0) {
      const pool = FLOATING_O_CONFIG.stayPool;
      if (pool.length === 1) return pool[0];
      let idx = Math.floor(Math.random() * pool.length);
      if (idx === lastStayIndex) {
        idx = (idx + 1) % pool.length;
      }
      lastStayIndex = idx;
      return pool[idx];
    }
    return "โอเคเดี๋ยวผมจะรออยู่ตรงนี้นะ(´ . .̫ . `)";
  }

  function clearIdleGreetingTimer() {
    if (idleGreetingTimer) {
      clearTimeout(idleGreetingTimer);
      idleGreetingTimer = null;
    }
  }

  function scheduleIdleGreeting() {
    clearIdleGreetingTimer();
    if (!isChasing) return;
    const intervalMs = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.idleGreetingIntervalMs) || 8000;
    idleGreetingTimer = setTimeout(() => {
      if (!isChasing) return;
      let isHovered = isFabHovered;
      if (floatingFabEl && typeof floatingFabEl.matches === 'function') {
        isHovered = floatingFabEl.matches(':hover');
        isFabHovered = isHovered;
      }
      // ทำงานเมื่อผู้ใช้ไม่ได้กำลังชี้ปุ่ม และกล่องข้อความไม่ได้เปิดค้างอยู่
      if (!isHovered && !fabGreetingActive && floatingFabEl) {
        playGreeting(floatingFabEl);
      } else {
        scheduleIdleGreeting();
      }
    }, intervalMs);
  }

  function resetIdleGreetingTimer() {
    if (!isChasing) return;
    clearIdleGreetingTimer();
    if (!isFabHovered && !fabGreetingActive) {
      scheduleIdleGreeting();
    }
  }

  // คำนวณพิกัดเป้าหมายของตัว O (แยกซีกซ้าย-ขวาของหน้าจอตลอดเวลา ทั้งตอนปกติและตอนอธิบาย)
  function getTargetOCoords(pointerX, pointerY) {
    const offM = (FLOATING_O_CONFIG.physics && FLOATING_O_CONFIG.physics.oOffsetFromMouse) || 18;
    const oRad = (badgeSize * currentScale) / 2;
    let targetCenterX;
    let targetCenterY;

    // ── 1. แนวนอน (X): แยกครึ่งซ้าย-ขวาของจอเสมอ (ทั้งตอนปกติและตอนอธิบาย) ──
    // เมาส์อยู่ซีกซ้าย -> O ไปอยู่ทางขวาของเมาส์ (เปิดโล่งพื้นที่ซ้าย ไม่บังเนื้อหา)
    // เมาส์อยู่ซีกขวา -> O ไปอยู่ทางซ้ายของเมาส์ (ไม่ชนขอบขวาของจอ)
    const halfScreen = window.innerWidth / 2;
    if (pointerX < halfScreen) {
      targetCenterX = pointerX + offM + oRad;
    } else {
      targetCenterX = pointerX - offM - oRad;
    }

    // ── 2. แนวตั้ง (Y): แยกตามโหมดอธิบาย vs โหมดปกติ ──
    if (isExplainingSection) {
      // โหมดอธิบาย: บินลอยขึ้นด้านบนของเมาส์ (เว้นแต่ติดขอบบน pointerY < 100px ให้สลับลงล่าง)
      const topSafeMargin = 100;
      if (pointerY < topSafeMargin) {
        targetCenterY = pointerY + offM + oRad;
      } else {
        targetCenterY = pointerY - offM - oRad;
      }
    } else {
      // โหมดปกติ (ปุ่มเดิม / หดตัว / Idle ทักทาย): อยู่ด้านล่างของเมาส์เสมอ
      // หากชิดขอบล่างของจอมาก (pointerY > innerHeight - 80px) ให้สลับขึ้นบนเพื่อไม่ให้ตกจอ
      const bottomSafeMargin = window.innerHeight - 80;
      if (pointerY > bottomSafeMargin) {
        targetCenterY = pointerY - offM - oRad;
      } else {
        targetCenterY = pointerY + offM + oRad;
      }
    }

    // ป้องกันตัว O หลุดออกจากขอบเขตหน้าจอ
    targetCenterX = Math.max(oRad + 8, Math.min(window.innerWidth - oRad - 8, targetCenterX));
    targetCenterY = Math.max(oRad + 8, Math.min(window.innerHeight - oRad - 8, targetCenterY));

    return {
      x: targetCenterX - (badgeSize / 2),
      y: targetCenterY - (badgeSize / 2),
      centerX: targetCenterX,
      centerY: targetCenterY
    };
  }

  // คำนวณพิกัดเป้าหมายของกล่องคำพูด (แยกซีกซ้าย-ขวาของตัว O ตลอดเวลา ทั้งตอนปกติและตอนอธิบาย)
  function getTargetFabCoords(oCenterX, oCenterY, curW, curH, oRadius) {
    const offX = (FLOATING_O_CONFIG.physics && FLOATING_O_CONFIG.physics.bubbleOffsetX) || 12;
    const offY = (FLOATING_O_CONFIG.physics && FLOATING_O_CONFIG.physics.bubbleOffsetY) || 12;

    let targetFabX;
    let targetFabY;

    // ── 1. แนวนอน (X): แยกครึ่งซ้าย-ขวาเสมอ ──
    // หากอยู่นิ่ง (isPinned) ให้ยึดตำแหน่งตัว O เป็นเกณฑ์, หากบินตามเมาส์ให้ยึดตำแหน่งเมาส์เป็นเกณฑ์
    const halfScreen = window.innerWidth / 2;
    const refX = isPinned ? oCenterX : mouseX;
    const isLeftSide = refX < halfScreen;
    if (isLeftSide) {
      targetFabX = (oCenterX + oRadius) + offX;
    } else {
      targetFabX = (oCenterX - oRadius) - curW - offX;
    }

    // ── 2. แนวตั้ง (Y): ──
    if (isExplainingSection) {
      const topSafeMargin = 100;
      const isNearTop = mouseY < topSafeMargin;
      if (isNearTop) {
        targetFabY = (oCenterY + oRadius) + offY;
      } else {
        targetFabY = (oCenterY - oRadius) - curH - offY;
      }
    } else {
      // โหมดปกติ: กล่องคำพูดอยู่ระดับบนของตัว O (เทียบเคียงระดับเมาส์ ไม่บังด้านล่าง)
      targetFabY = (oCenterY - oRadius) - curH - offY;
    }

    // อยู่ในขอบเขตหน้าจออย่างปลอดภัยเสมอ
    targetFabX = Math.max(10, Math.min(window.innerWidth - curW - 10, targetFabX));
    targetFabY = Math.max(10, Math.min(window.innerHeight - curH - 10, targetFabY));

    return { x: targetFabX, y: targetFabY };
  }

  function clearSectionHoverTimer() {
    if (sectionHoverTimer) {
      clearTimeout(sectionHoverTimer);
      sectionHoverTimer = null;
    }
  }

  function handleSectionExplanationHover(targetEl) {
    if (!isChasing || !targetEl) return;
    const cfg = FLOATING_O_CONFIG.sectionExplaining;
    if (!cfg || cfg.enabled === false) return;

    // หากกำลังแสดงคำพูดอยู่ หรือกำลังชี้ที่ตัวกล่องคำพูดเอง ไม่ต้องแทรก
    if (fabGreetingActive || isFabHovered) return;

    // 1. ตรวจสอบ attribute data-o-talk บน element หรือบรรพบุรุษ
    if (typeof targetEl.closest === 'function') {
      const customTalkEl = targetEl.closest('[data-o-talk]');
      if (customTalkEl) {
        const msg = customTalkEl.getAttribute('data-o-talk');
        if (msg && msg.trim()) {
          queueSectionSpeech('custom:' + msg.trim(), msg.trim(), cfg, customTalkEl);
          return;
        }
      }

      // 2. ตรวจสอบตามรายการ selector ใน config
      if (Array.isArray(cfg.sections)) {
        for (let i = 0; i < cfg.sections.length; i++) {
          const sec = cfg.sections[i];
          if (!sec || !sec.selector || !sec.message) continue;
          const matchedEl = targetEl.closest(sec.selector);
          if (matchedEl) {
            let key = sec.id || sec.selector;
            const subTitle = matchedEl.getAttribute('data-title') || matchedEl.id || '';
            if (subTitle) {
              key = `${key}:${subTitle}`;
            }
            queueSectionSpeech(key, sec.message, cfg, matchedEl);
            return;
          }
        }
      }
    }

    // หากไม่ได้ชี้ส่วนสำคัญใดๆ ให้เคลียร์เวลาที่รออยู่
    clearSectionHoverTimer();
    activeSectionKey = null;
  }

  function resolveSectionMessage(messageRaw, key, matchedEl = null) {
    if (typeof messageRaw === 'function') {
      try {
        messageRaw = messageRaw(matchedEl);
      } catch (err) {
        return '';
      }
    }
    if (Array.isArray(messageRaw) && messageRaw.length > 0) {
      if (messageRaw.length === 1) return messageRaw[0];
      const lastIdx = sectionLastIndexMap.get(key);
      let idx = Math.floor(Math.random() * messageRaw.length);
      if (idx === lastIdx) {
        idx = (idx + 1) % messageRaw.length;
      }
      sectionLastIndexMap.set(key, idx);
      return messageRaw[idx];
    }
    return typeof messageRaw === 'string' ? messageRaw : '';
  }

  function queueSectionSpeech(key, message, cfg, matchedEl = null) {
    if (activeSectionKey === key && sectionHoverTimer) return;
    activeSectionKey = key;
    clearSectionHoverTimer();

    const now = Date.now();
    const cooldownMs = cfg.cooldownMs || 14000;
    const lastSpoken = sectionCooldownMap.get(key) || 0;
    if (now - lastSpoken < cooldownMs) return;

    const delayMs = cfg.hoverDelayMs || 650;
    sectionHoverTimer = setTimeout(() => {
      sectionHoverTimer = null;
      if (!isChasing || fabGreetingActive || isFabHovered || !floatingFabEl) return;
      sectionCooldownMap.set(key, Date.now());
      const finalMsg = resolveSectionMessage(message, key, matchedEl);
      if (finalMsg) {
        playGreeting(floatingFabEl, 120, finalMsg, true);
      }
    }, delayMs);
  }

  // ฟังก์ชันเล่นแอนิเมชันคำพูดทักทาย / อธิบายจุดสำคัญ (รองรับทั้งประโยคเดี่ยวและลำดับประโยคต่อเนื่อง)
  function playGreeting(floatFab, delayOverrideMs = null, customMessage = null, isSectionExplain = false) {
    if (!floatFab) return;
    clearIdleGreetingTimer();
    clearSectionHoverTimer();
    clearTimeout(greetingExpandTimer);
    clearTimeout(greetingTimer);
    clearTimeout(seqTransitionTimer);
    floatFab.classList.remove('seq-switching');
    if (floatingEl) floatingEl.classList.remove('is-speaking');
    stopSpeechSound();

    // ปรับสถานะโหมดอธิบายจุดสำคัญ (ถ้าเป็นการอธิบาย ตัว O จะบินขึ้นบนและสลับซ้ายขวา)
    isExplainingSection = Boolean(isSectionExplain);

    const fabTextEl = floatFab.querySelector('.floating-contact-fab-text');
    const delayMs = delayOverrideMs !== null ? delayOverrideMs : (FLOATING_O_CONFIG.timing.approachDelayMs || 420);
    const holdMs = FLOATING_O_CONFIG.timing.greetingHoldMs || 5000;
    const sentenceHoldMs = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.introSentenceHoldMs) || 2000;
    const transitionMs = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.introTransitionMs) || 200;

    // เตรียมข้อความ (แปลงเป็น Array เสมอเพื่อรองรับ Sequence)
    let dialogueList = [];
    if (customMessage) {
      const resolvedCustom = Array.isArray(customMessage)
        ? resolveSectionMessage(customMessage, 'direct')
        : customMessage;
      dialogueList = Array.isArray(resolvedCustom) ? resolvedCustom : [resolvedCustom];
    } else {
      const gDialogue = getGreetingDialogue();
      dialogueList = Array.isArray(gDialogue) ? gDialogue : [gDialogue];
    }
    dialogueList = dialogueList
      .map(s => (typeof s === 'string' ? s.trim() : ''))
      .filter(Boolean);
    if (dialogueList.length === 0) {
      dialogueList = ["สวัสดี (◍•ᴗ•◍)"];
    }

    if (fabTextEl) fabTextEl.textContent = dialogueList[0];
    fabGreetingActive = true;

    greetingExpandTimer = setTimeout(() => {
      if (!isChasing) {
        fabGreetingActive = false;
        isExplainingSection = false;
        if (floatingEl) floatingEl.classList.remove('is-speaking');
        stopSpeechSound();
        return;
      }
      fabGreetingActive = true;
      floatFab.classList.add('greeting-active');
      floatFab.style.cursor = 'default';
      if (fabTextEl) fabTextEl.textContent = dialogueList[0];
      if (floatingEl) floatingEl.classList.add('is-speaking');
      playSpeechSoundBurst(Math.min(6, Math.max(3, Math.round(dialogueList[0].length * 0.35))), 78);
      updateBubblePointer();

      // ── โหมดแสดงบทพูดต่อเนื่องทีละประโยค (Sequence Mode) ──
      if (dialogueList.length > 1) {
        let seqIndex = 0;
        function runNextSentence() {
          greetingTimer = setTimeout(() => {
            if (!isChasing || !fabGreetingActive) return;
            seqIndex++;
            if (seqIndex < dialogueList.length) {
              floatFab.classList.add('seq-switching');
              seqTransitionTimer = setTimeout(() => {
                if (!isChasing || !fabGreetingActive) return;
                if (fabTextEl) fabTextEl.textContent = dialogueList[seqIndex];
                floatFab.classList.remove('seq-switching');
                playSpeechSoundBurst(Math.min(6, Math.max(3, Math.round(dialogueList[seqIndex].length * 0.35))), 78);
                updateBubblePointer();
                runNextSentence();
              }, transitionMs);
            } else {
              // จบชุดประโยคทั้งหมด คืนค่ากลับสู่สถานะปกติ
              fabGreetingActive = false;
              isExplainingSection = false;
              floatFab.classList.remove('greeting-active', 'seq-switching');
              floatFab.style.cursor = '';
              isFabHovered = false;
              if (floatingEl) floatingEl.classList.remove('is-speaking');
              stopSpeechSound();
              if (fabTextEl) {
                fabTextEl.textContent = getRandomDefaultButtonText();
              }
              updateBubblePointer();
              scheduleIdleGreeting();
            }
          }, sentenceHoldMs);
        }
        runNextSentence();
      } else {
        // ── โหมดแสดงประโยคเดี่ยวตามปกติ (Single Dialogue Mode) ──
        greetingTimer = setTimeout(() => {
          if (!isChasing) {
            fabGreetingActive = false;
            isExplainingSection = false;
            if (floatingEl) floatingEl.classList.remove('is-speaking');
            stopSpeechSound();
            return;
          }
          fabGreetingActive = false;
          isExplainingSection = false;
          floatFab.classList.remove('greeting-active', 'seq-switching');
          floatFab.style.cursor = '';
          isFabHovered = false;
          if (floatingEl) floatingEl.classList.remove('is-speaking');
          stopSpeechSound();
          if (fabTextEl) {
            fabTextEl.textContent = getRandomDefaultButtonText();
          }
          updateBubblePointer();
          scheduleIdleGreeting();
        }, holdMs);
      }
    }, delayMs);
  }

  // ── ระบบทักทายแนะนำตัวเมื่อเมาส์เข้าใกล้ชื่อ (Docked Proximity Intro) ──
  function checkDockedProximity(px, py) {
    if (isChasing) return;
    const oEl = document.getElementById('easter-egg-o');
    if (!oEl) return;

    const rect = oEl.getBoundingClientRect();
    if (rect.width === 0 || rect.bottom < -50 || rect.top > window.innerHeight + 50) return;

    const oCenterX = rect.left + (rect.width / 2);
    const oCenterY = rect.top + (rect.height / 2);
    const dist = Math.hypot(px - oCenterX, py - oCenterY);

    const proxRadius = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.proximityRadius) || 160;
    const leaveRadius = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.proximityLeaveRadius) || 320;
    const cooldownMs = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.proximityCooldownMs) || 2500;

    if (!isDockedIntroActive) {
      if (dist <= proxRadius) {
        const now = Date.now();
        if (now - lastDockedIntroTime > cooldownMs) {
          startDockedIntro(oEl);
        }
      }
    } else {
      // ถ้าผู้ใช้ไม่ทำอะไรหรือเลื่อนเมาส์ออกห่างเกินระยะ ให้กลับที่เดิม
      if (dist > leaveRadius) {
        if (!dockedIntroLeaveTimer) {
          dockedIntroLeaveTimer = setTimeout(() => {
            dockedIntroLeaveTimer = null;
            if (!isDockedIntroActive || isChasing) return;
            const curRect = oEl.getBoundingClientRect();
            const curDist = Math.hypot(mouseX - (curRect.left + curRect.width / 2), mouseY - (curRect.top + curRect.height / 2));
            if (curDist > leaveRadius) {
              stopDockedIntro(false);
            }
          }, 1400);
        }
      } else {
        if (dockedIntroLeaveTimer) {
          clearTimeout(dockedIntroLeaveTimer);
          dockedIntroLeaveTimer = null;
        }
      }
    }
  }

  function startDockedIntro(oEl) {
    if (isChasing || isDockedIntroActive) return;
    if (!oEl) oEl = document.getElementById('easter-egg-o');
    if (!oEl) return;

    const origFab = document.getElementById('contact-fab-btn');
    const floatFab = createFloatingContactFab();
    if (!floatFab) return;

    isDockedIntroActive = true;
    window.__isDockedIntroSpeaking = true;
    lastDockedIntroTime = Date.now();
    hasPlayedDockedIntro = true;
    dockedSeqIndex = 0;

    // เตรียมข้อความตามรอบการเข้าใกล้ (แนวทาง A):
    // รอบที่ 1: ชุดข้อความแนะนำตัวเต็มชุด (greetingText)
    // รอบที่ 2: ชุดข้อความทักทายรอบสองสั้นๆ (followUpGreetingText)
    // รอบที่ 3 เป็นต้นไป: สุ่มข้อความสั้นกระชับ 1 ข้อความ (subsequentGreetings)
    let sentences = [];
    if (dockedIntroCount === 0) {
      if (Array.isArray(FLOATING_O_CONFIG.greetingText)) {
        sentences = FLOATING_O_CONFIG.greetingText;
      } else if (typeof FLOATING_O_CONFIG.greetingText === 'string') {
        sentences = [FLOATING_O_CONFIG.greetingText];
      }
    } else if (dockedIntroCount === 1) {
      if (Array.isArray(FLOATING_O_CONFIG.followUpGreetingText)) {
        sentences = FLOATING_O_CONFIG.followUpGreetingText;
      } else if (typeof FLOATING_O_CONFIG.followUpGreetingText === 'string') {
        sentences = [FLOATING_O_CONFIG.followUpGreetingText];
      }
    } else {
      const pool = FLOATING_O_CONFIG.subsequentGreetings || [
        "พร้อมลุยงานเสมอนะครับ (◍•ᴗ•◍)",
        "มีโปรเจกต์ใหม่ ปรึกษาโอเว่นได้ตลอดนะ!",
        "ยินดีต้อนรับอีกครั้งนะ (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)",
      ];
      if (Array.isArray(pool) && pool.length > 0) {
        let idx = Math.floor(Math.random() * pool.length);
        if (idx === lastSubsequentIndex && pool.length > 1) {
          idx = (idx + 1) % pool.length;
        }
        lastSubsequentIndex = idx;
        sentences = [pool[idx]];
      }
    }

    sentences = sentences.map(s => (typeof s === 'string' ? s.trim() : '')).filter(Boolean);
    if (sentences.length === 0) {
      sentences = ["สวัสดี (◍•ᴗ•◍)"];
    }
    dockedIntroCount++;

    const fabTextEl = floatFab.querySelector('.floating-contact-fab-text');
    if (fabTextEl) fabTextEl.textContent = sentences[0];

    // 1. ตำแหน่งเริ่มต้น: เลื่อนมาจากปุ่มส่งข้อความทางขวามือ (#contact-fab-btn)
    let startX = window.innerWidth - 80;
    let startY = 80;
    if (origFab) {
      const origRect = origFab.getBoundingClientRect();
      startX = origRect.left;
      startY = origRect.top;
    }

    // ล้างสถานะเก่า ล็อก transition เป็น none แล้ววางพิกัดเริ่มต้นไว้ที่ปุ่มขวามือทันที
    floatFab.classList.remove('returning', 'seq-switching', 'greeting-active', 'docked-intro');
    floatFab.style.setProperty('transition', 'none', 'important');
    floatFab.style.transform = `translate3d(${startX.toFixed(1)}px, ${startY.toFixed(1)}px, 0)`;
    floatFab.classList.add('active');
    floatFab.style.cursor = 'default';
    if (origFab) {
      origFab.classList.add('is-detached');
    }

    // บังคับ Reflow ให้เบราว์เซอร์รับรู้พิกัดเริ่มต้นทางขวาโดยไม่มีแอนิเมชันข้ามตำแหน่ง
    void floatFab.offsetWidth;

    const glideFlightMs = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.glideInFlightMs) || 520;
    const sentenceHoldMs = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.introSentenceHoldMs) || 2000;
    const transitionMs = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.introTransitionMs) || 180;

    // 2. ในเฟรมถัดไป ร่อนมาจากขวามือมาหาตัว O ทางซ้าย และเริ่มกางกล่องคำพูด
    requestAnimationFrame(() => {
      if (!isDockedIntroActive || isChasing) return;
      floatFab.style.removeProperty('transition');
      floatFab.classList.add('docked-intro', 'greeting-active');
      floatFab.style.transition = `transform ${glideFlightMs}ms cubic-bezier(0.16, 1.15, 0.3, 1), opacity 0.25s ease, background 0.22s ease, color 0.22s ease, border-color 0.22s ease`;
      updateDockedIntroPosition();

      const glideStart = performance.now();
      function trackGlideIn(now) {
        if (!isDockedIntroActive || isChasing) return;
        const curO = document.getElementById('easter-egg-o') || oEl;
        const floatPoly = document.getElementById('floating-bubble-pointer-poly');
        if (curO && floatPoly) {
          const oRect = curO.getBoundingClientRect();
          updateSinglePointer(floatFab, floatPoly, oRect.left + oRect.width / 2, oRect.top + oRect.height / 2);
        }
        if (now - glideStart < glideFlightMs + 20) {
          requestAnimationFrame(trackGlideIn);
        } else {
          // ถึงจุดหมายเหนือตัว O เรียบร้อย: ตรึงพิกัดปลายทาง ยิงเสียงพูด 8-บิต และเริ่มดุกดิกพูดทักทาย
          updateDockedIntroPosition();
          const curO = document.getElementById('easter-egg-o') || oEl;
          if (curO) curO.classList.add('is-speaking');
          playSpeechSoundBurst(Math.min(6, Math.max(3, Math.round(sentences[0].length * 0.35))), 78);
          startSentencePlayback();
        }
      }
      requestAnimationFrame(trackGlideIn);
    });

    function startSentencePlayback() {
      function runNextDockedSentence() {
        dockedSeqTimer = setTimeout(() => {
          if (isChasing || !isDockedIntroActive) return;
          dockedSeqIndex++;
          if (dockedSeqIndex < sentences.length) {
            floatFab.classList.add('seq-switching');
            dockedTransitionTimer = setTimeout(() => {
              if (isChasing || !isDockedIntroActive) return;
              if (fabTextEl) fabTextEl.textContent = sentences[dockedSeqIndex];
              floatFab.classList.remove('seq-switching');
              const speakingO = document.getElementById('easter-egg-o') || oEl;
              if (speakingO) speakingO.classList.add('is-speaking');
              playSpeechSoundBurst(Math.min(6, Math.max(3, Math.round(sentences[dockedSeqIndex].length * 0.35))), 78);
              updateDockedIntroPosition();
              requestAnimationFrame(() => updateDockedIntroPosition());
              runNextDockedSentence();
            }, transitionMs);
          } else {
            // พูดจบครบชุดแล้ว ค้างข้อความสุดท้ายแป๊บนึงก่อนร่อนกลับที่เดิมทางขวามือ
            dockedSeqTimer = setTimeout(() => {
              stopDockedIntro(false);
            }, 1800);
          }
        }, sentenceHoldMs);
      }

      if (sentences.length > 1) {
        runNextDockedSentence();
      } else {
        dockedSeqTimer = setTimeout(() => {
          stopDockedIntro(false);
        }, sentenceHoldMs + 600);
      }
    }
  }

  function stopDockedIntro(immediate = false) {
    if (!isDockedIntroActive && !immediate) return;
    isDockedIntroActive = false;
    window.__isDockedIntroSpeaking = false;
    lastDockedIntroTime = Date.now();
    stopSpeechSound();

    if (dockedIntroLeaveTimer) {
      clearTimeout(dockedIntroLeaveTimer);
      dockedIntroLeaveTimer = null;
    }
    if (dockedSeqTimer) {
      clearTimeout(dockedSeqTimer);
      dockedSeqTimer = null;
    }
    if (dockedTransitionTimer) {
      clearTimeout(dockedTransitionTimer);
      dockedTransitionTimer = null;
    }

    const oEl = document.getElementById('easter-egg-o');
    if (oEl) oEl.classList.remove('is-speaking');

    const origFab = document.getElementById('contact-fab-btn');

    if (floatingFabEl && !isChasing) {
      floatingFabEl.classList.remove('greeting-active', 'seq-switching');
      floatingFabEl.style.cursor = '';

      if (immediate || !origFab) {
        floatingFabEl.classList.remove('active', 'docked-intro', 'returning');
        if (origFab) origFab.classList.remove('is-detached');
      } else {
        // ร่อนกลับไปที่ปุ่มขวามือตามเดิม (#contact-fab-btn)
        const returnFlightMs = (FLOATING_O_CONFIG.timing && FLOATING_O_CONFIG.timing.returnFlightMs) || 480;
        const origRect = origFab.getBoundingClientRect();
        floatingFabEl.classList.add('returning');
        floatingFabEl.style.transition = `transform ${returnFlightMs}ms cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease`;
        floatingFabEl.style.transform = `translate3d(${origRect.left.toFixed(1)}px, ${origRect.top.toFixed(1)}px, 0)`;

        const returnStart = performance.now();
        function trackReturnGlide(now) {
          if (isChasing || isDockedIntroActive) return;
          const floatPoly = document.getElementById('floating-bubble-pointer-poly');
          const curO = document.getElementById('easter-egg-o');
          if (floatPoly && curO) {
            const oRect = curO.getBoundingClientRect();
            updateSinglePointer(floatingFabEl, floatPoly, oRect.left + oRect.width / 2, oRect.top + oRect.height / 2);
          }
          if (now - returnStart < returnFlightMs + 20) {
            requestAnimationFrame(trackReturnGlide);
          } else {
            // ถึงบ้านทางขวามือแล้ว คืนค่าปุ่มเดิม
            if (!isChasing && !isDockedIntroActive && floatingFabEl) {
              floatingFabEl.classList.remove('active', 'docked-intro', 'returning');
              if (origFab) origFab.classList.remove('is-detached');
            }
          }
        }
        requestAnimationFrame(trackReturnGlide);
      }
    }
  }

  function attachDockedHoverListeners() {
    const oEl = document.getElementById('easter-egg-o');
    const nameRow = document.getElementById('profile-name-el');
    if (oEl && !oEl.__hasDockedHover) {
      oEl.__hasDockedHover = true;
      oEl.addEventListener('mouseenter', () => {
        if (!isChasing && !isDockedIntroActive) {
          startDockedIntro(oEl);
        }
      });
    }
    if (nameRow && !nameRow.__hasDockedHover) {
      nameRow.__hasDockedHover = true;
      nameRow.addEventListener('mouseenter', () => {
        if (!isChasing && !isDockedIntroActive) {
          const targetO = document.getElementById('easter-egg-o');
          if (targetO) startDockedIntro(targetO);
        }
      });
    }
  }
  window.__attachDockedHoverListeners = attachDockedHoverListeners;

  function updateDockedIntroPosition() {
    if (!isDockedIntroActive || isChasing || !floatingFabEl) return;
    const oEl = document.getElementById('easter-egg-o');
    if (!oEl) return;

    const oRect = oEl.getBoundingClientRect();
    const fabRect = floatingFabEl.getBoundingClientRect();
    const curW = fabRect.width || 210;
    const curH = fabRect.height || 38;

    const oCenterX = oRect.left + (oRect.width / 2);
    const oCenterY = oRect.top + (oRect.height / 2);

    // วางกล่องคำพูดไว้เหนือตัว O ในระดับสายตา
    let fabX = oCenterX - 28;
    let fabY = oRect.top - curH - 14;

    // หากติดขอบบนของจอ ให้สลับลงด้านล่างของตัว O
    if (fabY < 12) {
      fabY = oRect.bottom + 14;
    }

    // ป้องกันหลุดขอบจอซ้าย-ขวา
    fabX = Math.max(12, Math.min(window.innerWidth - curW - 12, fabX));

    floatingFabEl.style.transform = `translate3d(${fabX.toFixed(1)}px, ${fabY.toFixed(1)}px, 0)`;

    // ให้หางชี้ (Speech pointer) พุ่งตรงเข้าหาจุดศูนย์กลางของตัว O บนชื่อ
    const floatPoly = document.getElementById('floating-bubble-pointer-poly');
    if (floatPoly) {
      updateSinglePointer(floatingFabEl, floatPoly, oCenterX, oCenterY);
    }
  }

  function createFloatingO() {
    if (floatingEl) return floatingEl;
    floatingEl = document.createElement('div');
    floatingEl.id = 'floating-o';
    floatingEl.className = 'floating-o';
    floatingEl.innerHTML = '<span class="floating-o-text">O</span>';
    floatingEl.setAttribute('aria-hidden', 'true');
    floatingEl.style.zIndex = '2147483647';
    floatingEl.style.cursor = 'grab';
    floatingEl.setAttribute('title', 'คลิกซ้าย: พักให้นั่งรอ / ลากไปวางที่ต่างๆ | คลิกขวา: กลับที่เดิม (มือถือกดค้าง 1 วิ)');
    document.body.appendChild(floatingEl);

    // ── 1. คลิกขวา (Right Click) บนคอมพิวเตอร์ เพื่อส่งกลับบ้าน ──
    floatingEl.addEventListener('contextmenu', e => {
      e.preventDefault();
      e.stopPropagation();
      returnHome();
    });

    // ── 2. Pointer Down (เตรียมลาก, คลิกซ้าย หรือจับเวลา 1 วินาทีบนมือถือ) ──
    floatingEl.addEventListener('pointerdown', e => {
      if (!isChasing) return;
      if (e.button === 2) { // คลิกขวา
        e.preventDefault();
        e.stopPropagation();
        returnHome();
        return;
      }
      if (e.button !== 0 && e.pointerType === 'mouse') return; // เมาส์รับเฉพาะคลิกซ้าย

      e.preventDefault();
      e.stopPropagation();

      isDraggingO = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragInitialX = currentX;
      dragInitialY = currentY;
      hasMovedSignificantly = false;
      floatingEl.style.cursor = 'grabbing';
      try { floatingEl.setPointerCapture(e.pointerId); } catch (_) {}

      // กดค้าง 1 วินาทีบนหน้าจอมือถือ/แท็บเล็ต เพื่อส่งกลับบ้าน
      clearTimeout(touchHoldTimer);
      if (e.pointerType === 'touch') {
        touchHoldTimer = setTimeout(() => {
          if (!hasMovedSignificantly && isChasing) {
            isDraggingO = false;
            floatingEl.style.cursor = 'grab';
            try { floatingEl.releasePointerCapture(e.pointerId); } catch (_) {}
            returnHome();
          }
        }, 1000);
      }
    });

    // ── 3. Pointer Move (ลากขยับตัว O ไปวางตำแหน่งต่างๆ บนหน้าจอ) ──
    floatingEl.addEventListener('pointermove', e => {
      if (!isDraggingO || !isChasing) return;
      e.preventDefault();
      e.stopPropagation();

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (Math.hypot(dx, dy) > 6) {
        hasMovedSignificantly = true;
        clearTimeout(touchHoldTimer); // ยกเลิกการกดค้างกลับบ้านเพราะเป็นการลากย้าย
      }

      let newX = dragInitialX + dx;
      let newY = dragInitialY + dy;
      // ป้องกันตัว O หลุดออกจากขอบเขตหน้าจอขณะลาก
      newX = Math.max(8, Math.min(window.innerWidth - badgeSize - 8, newX));
      newY = Math.max(8, Math.min(window.innerHeight - badgeSize - 8, newY));

      currentX = newX;
      currentY = newY;
      pinnedX = newX;
      pinnedY = newY;
    });

    // ── 4. Pointer Up / Cancel (ปล่อยวาง หรือคลิกสลับโหมดนิ่ง/ตาม) ──
    const handlePointerEnd = e => {
      clearTimeout(touchHoldTimer);
      if (!isDraggingO || !isChasing) return;
      e.preventDefault();
      e.stopPropagation();

      isDraggingO = false;
      floatingEl.style.cursor = 'grab';
      try { floatingEl.releasePointerCapture(e.pointerId); } catch (_) {}

      if (hasMovedSignificantly) {
        // [แบบที่ 2]: ลากไปวางที่ใหม่สำเร็จ -> ปักหมุดอยู่นิ่งตรงตำแหน่งนั้น
        isPinned = true;
        pinnedX = currentX;
        pinnedY = currentY;
        if (floatingFabEl) {
          playGreeting(floatingFabEl, 100, getRandomStayDialogue());
        }
      } else {
        // [แบบที่ 1]: คลิกซ้ายสั้นๆ โดยไม่ลาก -> สลับโหมดนิ่ง / บินตาม
        if (!isPinned) {
          // สั่งให้นั่งรอนิ่งๆ ตรงจุดนี้
          isPinned = true;
          pinnedX = currentX;
          pinnedY = currentY;
          if (floatingFabEl) {
            playGreeting(floatingFabEl, 100, getRandomStayDialogue());
          }
        } else {
          // สั่งให้กลับมาบินตามเมาส์ต่อ
          isPinned = false;
          if (floatingFabEl) {
            playGreeting(floatingFabEl, 100, "ไปต่อกันเถอะ ฟิ้ววว (・o・)");
          }
        }
      }
    };

    floatingEl.addEventListener('pointerup', handlePointerEnd);
    floatingEl.addEventListener('pointercancel', handlePointerEnd);

    floatingEl.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
    });

    return floatingEl;
  }

  function createFloatingContactFab() {
    if (floatingFabEl) return floatingFabEl;
    const orig = document.getElementById('contact-fab-btn');
    floatingFabEl = document.createElement('a');
    floatingFabEl.id = 'floating-contact-fab';
    floatingFabEl.className = 'contact-fab floating-contact-fab';
    floatingFabEl.style.zIndex = '2147483646';
    floatingFabEl.href = orig ? orig.href : '#';
    floatingFabEl.target = '_blank';
    floatingFabEl.setAttribute('aria-label', 'ติดต่อ');
    if (orig) {
      const origRect = orig.getBoundingClientRect();
      floatingFabEl.style.transform = `translate3d(${origRect.left.toFixed(1)}px, ${origRect.top.toFixed(1)}px, 0)`;
    } else {
      floatingFabEl.style.transform = `translate3d(${window.innerWidth - 80}px, 80px, 0)`;
    }
    floatingFabEl.innerHTML = `
      <svg class="bubble-pointer-svg" id="floating-bubble-pointer-svg" style="overflow: visible !important; position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;" aria-hidden="true">
        <polygon id="floating-bubble-pointer-poly" style="fill: var(--text) !important;" points="" />
      </svg>
      <svg class="contact-fab-icon" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
      </svg>
      <span class="floating-contact-fab-text">${Array.isArray(FLOATING_O_CONFIG.greetingText) ? (FLOATING_O_CONFIG.greetingText[0] || "สวัสดี (◍•ᴗ•◍)") : (FLOATING_O_CONFIG.greetingText || "สวัสดี (◍•ᴗ•◍)")}</span>
    `;
    document.body.appendChild(floatingFabEl);

    // ป้องกันการคลิกกล่องข้อความถ้าเวลาที่แสดงข้อความทักทายค้างไว้ยังไม่เสร็จ
    floatingFabEl.addEventListener('click', e => {
      if (fabGreetingActive || isDockedIntroActive) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.stopPropagation();
    });

    floatingFabEl.addEventListener('touchend', e => {
      if (fabGreetingActive || isDockedIntroActive) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      e.stopPropagation();
    });

    floatingFabEl.addEventListener('pointerdown', e => {
      if (fabGreetingActive || isDockedIntroActive) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Synchronize speech bubble pointer during hover expand/shrink transitions
    const syncFloatFabHover = () => {
      updateBubblePointer();
      const start = performance.now();
      function syncStep(now) {
        updateBubblePointer();
        if (now - start < 300) requestAnimationFrame(syncStep);
      }
      requestAnimationFrame(syncStep);
    };

    floatingFabEl.addEventListener('mouseenter', () => {
      isFabHovered = true;
      isExplainingSection = false;
      clearIdleGreetingTimer();
      if (!fabGreetingActive) {
        const textEl = floatingFabEl.querySelector('.floating-contact-fab-text');
        if (textEl) {
          textEl.textContent = getRandomDefaultButtonText();
        }
      }
      syncFloatFabHover();
    });

    floatingFabEl.addEventListener('mouseleave', () => {
      isFabHovered = false;
      syncFloatFabHover();
      scheduleIdleGreeting();
    });

    floatingFabEl.addEventListener('focus', () => {
      isFabHovered = true;
      clearIdleGreetingTimer();
      if (!fabGreetingActive) {
        const textEl = floatingFabEl.querySelector('.floating-contact-fab-text');
        if (textEl) {
          textEl.textContent = getRandomDefaultButtonText();
        }
      }
      syncFloatFabHover();
    });

    floatingFabEl.addEventListener('blur', () => {
      isFabHovered = false;
      syncFloatFabHover();
      scheduleIdleGreeting();
    });

    return floatingFabEl;
  }

  function updatePos(cx, cy) {
    mouseX = cx;
    mouseY = cy;
  }

  window.addEventListener('mousemove', e => {
    updatePos(e.clientX, e.clientY);
    handleSectionExplanationHover(e.target);
    checkDockedProximity(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      updatePos(touch.clientX, touch.clientY);
      checkDockedProximity(touch.clientX, touch.clientY);
      if (typeof document.elementFromPoint === 'function') {
        const touchEl = document.elementFromPoint(touch.clientX, touch.clientY);
        if (touchEl) handleSectionExplanationHover(touchEl);
      }
    }
  }, { passive: true });

  // รีเซ็ตการนับเวลา 8 วินาทีเมื่อผู้ใช้คลิกบนหน้าเว็บ
  document.addEventListener('pointerdown', () => {
    if (isChasing && !fabGreetingActive && !isFabHovered) {
      resetIdleGreetingTimer();
    }
  }, { passive: true });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isChasing) {
      returnHome();
      return;
    }
    if (isChasing && !fabGreetingActive && !isFabHovered) {
      resetIdleGreetingTimer();
    }
  });

  function updateSinglePointer(fab, poly, oTargetX, oTargetY) {
    if (!fab || !poly) return;

    const fabRect = fab.getBoundingClientRect();
    if (!fabRect.width || !fabRect.height) return;

    const W = fabRect.width;
    const H = fabRect.height;
    const R = H / 2;
    const hw = W / 2;
    const hh = H / 2;
    const d = Math.max(0, hw - R);

    // Target coordinates relative to fab top-left
    const tx = oTargetX - fabRect.left;
    const ty = oTargetY - fabRect.top;

    const dx = tx - hw;
    const dy = ty - hh;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;

    let Px, Py, nx, ny, tx_tan, ty_tan;

    // Determine surface point P facing target and local surface normal + tangent
    if (dx < -d) {
      const cx = R;
      const cy = hh;
      const rAngle = Math.atan2(ty - cy, tx - cx);
      Px = cx + R * Math.cos(rAngle);
      Py = cy + R * Math.sin(rAngle);
      nx = Math.cos(rAngle);
      ny = Math.sin(rAngle);
      tx_tan = -ny;
      ty_tan = nx;
    } else if (dx > d) {
      const cx = W - R;
      const cy = hh;
      const rAngle = Math.atan2(ty - cy, tx - cx);
      Px = cx + R * Math.cos(rAngle);
      Py = cy + R * Math.sin(rAngle);
      nx = Math.cos(rAngle);
      ny = Math.sin(rAngle);
      tx_tan = -ny;
      ty_tan = nx;
    } else {
      Px = Math.max(R, Math.min(W - R, tx));
      if (dy >= 0) {
        Py = H;
        nx = 0;
        ny = 1;
        tx_tan = 1;
        ty_tan = 0;
      } else {
        Py = 0;
        nx = 0;
        ny = -1;
        tx_tan = 1;
        ty_tan = 0;
      }
    }

    // Direction from surface point P toward target
    const vdx = tx - Px;
    const vdy = ty - Py;
    const vDist = Math.hypot(vdx, vdy);
    let ux = nx;
    let uy = ny;
    if (vDist > 0.5) {
      ux = vdx / vDist;
      uy = vdy / vDist;
    }

    // Ensure tip direction points outward
    if (ux * nx + uy * ny < 0.1) {
      ux = nx;
      uy = ny;
    }

    const L = (FLOATING_O_CONFIG.physics && FLOATING_O_CONFIG.physics.pointerLength) || 10.0;
    const tipX = Px + L * ux;
    const tipY = Py + L * uy;

    // Base is inset 4px deep into capsule body so corners never leak or detach
    const D_inset = 4.0;
    const baseW = (FLOATING_O_CONFIG.physics && FLOATING_O_CONFIG.physics.pointerBaseWidth) || 12.0;
    const halfWidth = baseW / 2;
    const baseCenterX = Px - D_inset * nx;
    const baseCenterY = Py - D_inset * ny;

    const b1X = baseCenterX - halfWidth * tx_tan;
    const b1Y = baseCenterY - halfWidth * ty_tan;

    const b2X = baseCenterX + halfWidth * tx_tan;
    const b2Y = baseCenterY + halfWidth * ty_tan;

    poly.setAttribute('points', `${b1X.toFixed(1)},${b1Y.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} ${b2X.toFixed(1)},${b2Y.toFixed(1)}`);
  }

  function updateBubblePointer() {
    // 1. Stationary original fab (when not chasing)
    const origFab = document.getElementById('contact-fab-btn');
    const origPoly = document.getElementById('bubble-pointer-poly');
    if (origFab && origPoly) {
      const oEl = document.getElementById('easter-egg-o');
      let oTargetX = origFab.getBoundingClientRect().left - 100;
      let oTargetY = origFab.getBoundingClientRect().top;
      if (isChasing && floatingEl) {
        oTargetX = currentX + (badgeSize / 2);
        oTargetY = currentY + (badgeSize / 2);
      } else if (oEl) {
        const oRect = oEl.getBoundingClientRect();
        oTargetX = oRect.left + oRect.width / 2;
        oTargetY = oRect.top + oRect.height / 2;
      }
      updateSinglePointer(origFab, origPoly, oTargetX, oTargetY);
    }

    // 2. Floating fab companion (pointing at letter O)
    if (isChasing && floatingFabEl && floatingEl) {
      const floatPoly = document.getElementById('floating-bubble-pointer-poly');
      if (floatPoly) {
        const oRect = floatingEl.getBoundingClientRect();
        const oTargetX = oRect.left + (oRect.width / 2);
        const oTargetY = oRect.top + (oRect.height / 2);
        updateSinglePointer(floatingFabEl, floatPoly, oTargetX, oTargetY);
      }
    }
  }

  function chaseLoop() {
    if (!isChasing || !floatingEl) return;

    if (isDraggingO) {
      // กำลังถูกลากด้วยเมาส์หรือนิ้ว: แสดงผลตามตำแหน่งที่ลากเรียลไทม์
      currentTilt = 0;
      floatingEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(0deg) scale(${currentScale.toFixed(4)})`;
    } else if (isPinned) {
      // ── โหมดล็อก/ปักหมุด: โน้มตัวและเอียงหันมองตามเมาส์ (~3–9px, Tilt -8° ถึง +8°) ──
      const oRad = (badgeSize * currentScale) / 2;
      const oCenterX = pinnedX + oRad;
      const oCenterY = pinnedY + oRad;
      const vdx = mouseX - oCenterX;
      const vdy = mouseY - oCenterY;
      const vDist = Math.hypot(vdx, vdy);

      // จำกัดระยะดึงดูด Magnetic Lean Offset ได้สูงสุด 9px (3-9px ตามระยะห่างเมาส์)
      const maxPull = (FLOATING_O_CONFIG.physics && FLOATING_O_CONFIG.physics.pinnedMaxPull) || 9.0;
      const pull = Math.min(maxPull, vDist * 0.024);
      const targetLookX = pinnedX + (vDist > 0.5 ? (vdx / vDist) * pull : 0);
      const targetLookY = pinnedY + (vDist > 0.5 ? (vdy / vDist) * pull : 0);

      // ค่อยๆ Lerp ตำแหน่งเข้าหาจุดมองอย่างนุ่มนวล (Look-at Lerp)
      currentX += (targetLookX - currentX) * 0.085;
      currentY += (targetLookY - currentY) * 0.085;

      // เอียงตัวมองตามทิศทางเมาส์ (-8 ถึง +8 องศา)
      const maxTilt = (FLOATING_O_CONFIG.physics && FLOATING_O_CONFIG.physics.pinnedMaxTilt) || 8.0;
      const targetTilt = Math.max(-maxTilt, Math.min(maxTilt, vDist > 0.5 ? (vdx / vDist) * maxTilt : 0));
      currentTilt += (targetTilt - currentTilt) * 0.085;

      floatingEl.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotate(${currentTilt.toFixed(2)}deg) scale(${currentScale.toFixed(4)})`;
    } else {
      // บินตามเมาส์ตามปกติ
      const oCoords = getTargetOCoords(mouseX, mouseY);
      const targetX = oCoords.x;
      const targetY = oCoords.y;

      const lerp = FLOATING_O_CONFIG.physics.oChaseLerp || 0.055;
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * lerp;
      currentY += dy * lerp;

      currentScale += (compactScale - currentScale) * 0.065;
      const tilt = Math.max(-14, Math.min(14, (dx * lerp) * 1.6));
      currentTilt = tilt;

      floatingEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${tilt}deg) scale(${currentScale.toFixed(4)})`;
    }

    // Contact button smoothly follows at the configured position relative to letter O
    if (floatingFabEl) {
      const oRect = floatingEl.getBoundingClientRect();
      const oRadius = Math.round(Math.max(oRect.width, oRect.height) / 2) || 21;
      const oCenterX = oRect.left + (oRect.width / 2);
      const oCenterY = oRect.top + (oRect.height / 2);

      const fabRect = floatingFabEl.getBoundingClientRect();
      const curW = fabRect.width || (fabGreetingActive ? 170 : 44);
      const curH = fabRect.height || 38;

      const targetFab = getTargetFabCoords(oCenterX, oCenterY, curW, curH, oRadius);

      const fabLerp = FLOATING_O_CONFIG.physics.fabChaseLerp || 0.095;
      fabX += (targetFab.x - fabX) * fabLerp;
      fabY += (targetFab.y - fabY) * fabLerp;

      // Keep speech bubble perfectly horizontal (0deg) for clean readability and precise pointer alignment
      const fabTilt = 0;

      floatingFabEl.style.transform = `translate3d(${fabX.toFixed(1)}px, ${fabY.toFixed(1)}px, 0) rotate(${fabTilt}deg)`;
    }

    updateBubblePointer();
    animId = requestAnimationFrame(chaseLoop);
  }

  function startChasing(originEl) {
    if (!originEl) originEl = document.getElementById('easter-egg-o');
    if (!originEl) return;
    if (isDockedIntroActive) {
      stopDockedIntro(true);
    }
    isChasing = false;
    cancelAnimationFrame(animId);
    clearIdleGreetingTimer();
    clearTimeout(greetingExpandTimer);
    clearTimeout(greetingTimer);
    try { localStorage.setItem('toru_floating_o_active', '1'); } catch (_) { }

    // 1. Setup floating letter O
    const floatEl = createFloatingO();
    const rect = originEl.getBoundingClientRect();
    const comp = window.getComputedStyle(originEl);

    floatEl.style.fontSize = comp.fontSize;
    floatEl.style.fontWeight = comp.fontWeight;
    floatEl.style.fontFamily = comp.fontFamily;
    floatEl.style.letterSpacing = comp.letterSpacing;
    floatEl.style.lineHeight = '1';

    const fontPx = parseFloat(comp.fontSize) || 32;
    badgeSize = Math.round(Math.max(rect.width, rect.height, fontPx) * 1.35);
    const compactPx = FLOATING_O_CONFIG.physics.compactBadgePx || 42;
    compactScale = Math.min(1, Math.max(0.35, compactPx / badgeSize));
    currentScale = 1.0;

    floatEl.style.width = `${badgeSize}px`;
    floatEl.style.height = `${badgeSize}px`;

    const originCenterX = (rect.width > 0 ? rect.left + (rect.width / 2) : window.innerWidth / 2);
    const originCenterY = (rect.height > 0 ? rect.top + (rect.height / 2) : window.innerHeight / 2);

    currentX = originCenterX - (badgeSize / 2);
    currentY = originCenterY - (badgeSize / 2);

    floatEl.classList.remove('returning');
    floatEl.style.transition = 'none';
    floatEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(0deg) scale(1)`;

    originEl.classList.add('is-detached');
    floatEl.classList.add('active');

    // 2. Setup floating contact button companion
    const origFab = document.getElementById('contact-fab-btn');
    const floatFab = createFloatingContactFab();
    clearTimeout(greetingExpandTimer);
    clearTimeout(greetingTimer);
    fabGreetingActive = false;

    if (origFab) {
      const fabRect = origFab.getBoundingClientRect();
      fabX = fabRect.left;
      fabY = fabRect.top;
      origFab.classList.add('is-detached');
    } else {
      fabX = currentX - 60;
      fabY = currentY - 40;
    }

    floatFab.classList.remove('returning', 'greeting-active');
    floatFab.classList.add('active', 'chasing-o');
    floatFab.style.transition = 'none';
    floatFab.style.transform = `translate3d(${fabX}px, ${fabY}px, 0) rotate(0deg)`;

    // 3. Animation: arrives at target position, then expands with dialogue
    isFirstGreeting = true;
    lastGreetingIndex = 0;
    lastDefaultIndex = -1;
    isPinned = false;
    isDraggingO = false;
    currentTilt = 0;
    clearTimeout(touchHoldTimer);
    clearIdleGreetingTimer();

    const fabTextEl = floatFab.querySelector('.floating-contact-fab-text');
    let initDialogue = null;
    if (hasPlayedDockedIntro) {
      initDialogue = "เมาส์ไปไหน ผมจะตามไปทางนั้น (⁠•⁠ ⁠u⁠ ⁠•⁠ )ノ~";
    }
    const initText = initDialogue || (Array.isArray(FLOATING_O_CONFIG.greetingText)
      ? (FLOATING_O_CONFIG.greetingText[0] || "สวัสดี (◍•ᴗ•◍)")
      : (FLOATING_O_CONFIG.greetingText || "สวัสดี (◍•ᴗ•◍)"));
    if (fabTextEl) fabTextEl.textContent = initText;

    isChasing = true;
    playGreeting(floatFab, null, initDialogue);

    updateBubblePointer();
    cancelAnimationFrame(animId);
    animId = requestAnimationFrame(chaseLoop);
  }

  function returnHome() {
    if (!isChasing) return;
    isChasing = false;
    isPinned = false;
    isDraggingO = false;
    currentTilt = 0;
    clearTimeout(touchHoldTimer);
    cancelAnimationFrame(animId);
    clearIdleGreetingTimer();
    clearTimeout(greetingExpandTimer);
    clearTimeout(greetingTimer);
    clearTimeout(seqTransitionTimer);
    if (floatingFabEl) floatingFabEl.classList.remove('seq-switching');
    if (floatingEl) floatingEl.classList.remove('is-speaking');
    stopSpeechSound();
    fabGreetingActive = false;
    isFabHovered = false;
    isExplainingSection = false;
    isFirstGreeting = true;
    lastGreetingIndex = 0;
    lastDefaultIndex = -1;
    clearSectionHoverTimer();
    activeSectionKey = null;
    sectionCooldownMap.clear();
    sectionLastIndexMap.clear();
    try { localStorage.removeItem('toru_floating_o_active'); } catch (_) { }

    const originEl = document.getElementById('easter-egg-o');
    const origFab = document.getElementById('contact-fab-btn');

    if (!floatingEl || !originEl) {
      if (floatingEl) floatingEl.classList.remove('active', 'returning');
      if (floatingFabEl) floatingFabEl.classList.remove('active', 'returning', 'chasing-o');
      if (originEl) originEl.classList.remove('is-detached');
      if (origFab) origFab.classList.remove('is-detached');
      return;
    }

    // Return Letter O
    const rect = originEl.getBoundingClientRect();
    const originCenterX = rect.left + (rect.width / 2);
    const originCenterY = rect.top + (rect.height / 2);
    const targetX = originCenterX - (badgeSize / 2);
    const targetY = originCenterY - (badgeSize / 2);

    floatingEl.style.transition = 'transform 0.68s cubic-bezier(0.16, 1.15, 0.3, 1)';
    void floatingEl.offsetWidth;
    floatingEl.classList.add('returning');
    floatingEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) rotate(0deg) scale(1)`;

    // Return Contact Fab
    if (floatingFabEl && origFab) {
      const destFabRect = origFab.getBoundingClientRect();
      floatingFabEl.classList.remove('greeting-active');
      floatingFabEl.classList.add('returning');
      floatingFabEl.style.cursor = '';
      floatingFabEl.style.transition = 'transform 0.68s cubic-bezier(0.16, 1.15, 0.3, 1), opacity 0.35s ease';
      floatingFabEl.style.transform = `translate3d(${destFabRect.left}px, ${destFabRect.top}px, 0) scale(1)`;
      const fabTextEl = floatingFabEl.querySelector('.floating-contact-fab-text');
      if (fabTextEl) fabTextEl.textContent = getRandomDefaultButtonText();
    }

    // Dynamically track pointer angle during return flight
    const retStart = performance.now();
    function trackReturnAnim(now) {
      if (floatingEl) {
        const r = floatingEl.getBoundingClientRect();
        currentX = r.left;
        currentY = r.top;
        updateBubblePointer();
      }
      if (now - retStart < 700) {
        requestAnimationFrame(trackReturnAnim);
      } else {
        updateBubblePointer();
      }
    }
    requestAnimationFrame(trackReturnAnim);

    // Settle back into place cleanly
    const returnMs = FLOATING_O_CONFIG.timing.returnFlightMs || 680;
    setTimeout(() => {
      floatingEl.classList.remove('active', 'returning');
      floatingEl.style.transition = 'none';
      originEl.classList.remove('is-detached');

      if (floatingFabEl) {
        floatingFabEl.classList.remove('active', 'returning', 'chasing-o');
        floatingFabEl.style.transition = 'none';
      }
      if (origFab) {
        origFab.classList.remove('is-detached');
      }
      updateBubblePointer();
    }, returnMs);
  }

  // Delegate click on #easter-egg-o or #floating-o
  function handleOTargetClick(e) {
    const oTarget = e.target.closest('#easter-egg-o');
    if (oTarget) {
      e.preventDefault();
      e.stopPropagation();
      if (isChasing && floatingEl && floatingEl.classList.contains('active')) {
        returnHome();
      } else {
        isChasing = false;
        startChasing(oTarget);
      }
      return;
    }

    if (e.target.closest('#floating-o')) {
      e.preventDefault();
      e.stopPropagation();
      // การคลิกและลาก (Pin/Drag) และคลิกขวากลับบ้าน ถูกจัดการอย่างอิสระผ่าน Pointer events และ Contextmenu แล้ว
    }
  }

  document.addEventListener('click', handleOTargetClick);
  document.addEventListener('touchend', handleOTargetClick);

  // Clean any old localStorage floating state so page always starts fresh and clean at home
  try {
    localStorage.removeItem('toru_floating_o_active');
  } catch (_) { }

  // Attach hover and proximity triggers on load
  attachDockedHoverListeners();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachDockedHoverListeners);
  }

  // Synchronize speech bubble pointer position and angle
  const fabBtn = document.getElementById('contact-fab-btn');
  if (fabBtn) {
    const syncPointerOnHover = () => {
      updateBubblePointer();
      const start = performance.now();
      function syncStep(now) {
        updateBubblePointer();
        if (now - start < 260) requestAnimationFrame(syncStep);
      }
      requestAnimationFrame(syncStep);
    };
    fabBtn.addEventListener('mouseenter', syncPointerOnHover);
    fabBtn.addEventListener('mouseleave', syncPointerOnHover);
    fabBtn.addEventListener('focus', syncPointerOnHover);
    fabBtn.addEventListener('blur', updateBubblePointer);
  }

  window.addEventListener('resize', () => {
    updateBubblePointer();
    if (isDockedIntroActive) {
      updateDockedIntroPosition();
    }
  });
  window.addEventListener('scroll', () => {
    clearSectionHoverTimer();
    updateBubblePointer();
    if (isDockedIntroActive) {
      const oEl = document.getElementById('easter-egg-o');
      if (oEl) {
        const rect = oEl.getBoundingClientRect();
        if (rect.bottom < -40 || rect.top > window.innerHeight + 40) {
          stopDockedIntro(false);
        } else {
          updateDockedIntroPosition();
        }
      }
    }
  }, { passive: true });
  setTimeout(updateBubblePointer, 150);
})();
