/* =========================================================
   search.js — สลับเปิด/ปิดแผงค้นหา (เลียนพฤติกรรม globalnav ของ Apple)
   ไฟล์เดียวในเว็บที่ใช้ JavaScript · ~25 บรรทัด · ไม่มีไลบรารี

   ทำไมต้องมี: "กดปุ่มซ้ำเพื่อปิด" + "เคอร์เซอร์เข้าช่องอัตโนมัติ"
   สองอย่างนี้ทำพร้อมกันด้วย CSS ล้วนไม่ได้
     - checkbox สลับได้ แต่โฟกัสให้ไม่ได้
     - label ชี้ที่ input โฟกัสได้ แต่กดซ้ำไม่ปิด
   Apple เองก็ใช้ JS ตรงนี้ (สลับ aria-expanded)

   ถ้า JS ไม่ทำงาน: label ยังชี้ไปที่ input อยู่ กดแล้วโฟกัสเข้า
   และ CSS :has(:focus-within) จะเปิดแผงให้เหมือนเดิม — ใช้งานได้ครบ
   ========================================================= */
(function () {
  'use strict';
  var gh = document.querySelector('.gh');
  var btn = document.querySelector('.gh__searchbtn');
  var input = document.getElementById('gh-q');
  var curtain = document.querySelector('.gh__curtain');
  if (!gh || !btn || !input) return;

  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'gh-search');

  function setOpen(open) {
    gh.classList.toggle('is-search-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
    else input.blur();
  }
  function isOpen() { return gh.classList.contains('is-search-open'); }

  btn.addEventListener('click', function (e) {
    e.preventDefault();          // กัน label ไม่ให้โฟกัสเอง จะได้คุมสถานะเองทั้งหมด
    setOpen(!isOpen());
  });
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!isOpen()); }
  });

  if (curtain) curtain.addEventListener('click', function () { setOpen(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  });

  // คลิกที่อื่นนอกแผง = ปิด (พฤติกรรมเดียวกับ Apple)
  document.addEventListener('click', function (e) {
    if (!isOpen()) return;
    if (btn.contains(e.target)) return;
    if (e.target.closest && e.target.closest('.gh__search')) return;
    setOpen(false);
  });
})();

/* =========================================================
   ไอคอนเมนูมือถือ ≡ ⇄ ✕ — ยิง SMIL <animate> ตามสถานะ checkbox
   (Apple ใช้ SVG SMIL ตัวเดียวกัน และยิง beginElement() จาก JS เหมือนกัน)
   ถ้า JS ไม่ทำงาน: เมนูยังเปิด/ปิดได้ผ่าน checkbox แค่ไอคอนไม่แปลงร่าง
   ========================================================= */
(function () {
  'use strict';
  var state = document.getElementById('gh-menustate');
  if (!state) return;
  var open  = [document.getElementById('gh-anim-top-open'),  document.getElementById('gh-anim-bottom-open')];
  var close = [document.getElementById('gh-anim-top-close'), document.getElementById('gh-anim-bottom-close')];
  if (!open[0] || !close[0]) return;

  function fire(list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] && typeof list[i].beginElement === 'function') list[i].beginElement();
    }
  }
  state.addEventListener('change', function () { fire(state.checked ? open : close); });

  // ปิดเมนูด้วย Esc (Apple ก็ทำ)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.checked) { state.checked = false; fire(close); }
  });
})();
