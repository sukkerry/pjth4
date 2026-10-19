"use strict";
const $ = id => document.getElementById(id);
const cv = $("game"), ctx = cv.getContext("2d");
let W, H;
function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
addEventListener("resize", resize); resize();

/* ---------- BANK SOALAN (DSKP 2.1.1 & 2.1.2) ---------- */
const BANK = {
  mudah: [ // 2.1.1 jenis penyakit akibat kuman
    {q:"Apakah yang menyebabkan kita demam dan cirit-birit?", o:["Kuman","Gula-gula","Mainan"], a:0},
    {q:"Yang manakah penyakit akibat kuman?", o:["Selesema","Patah tangan","Mengantuk"], a:0},
    {q:"Cirit-birit disebabkan oleh…", o:["Hujan","Kuman","Bunyi bising"], a:1},
    {q:"Batuk dan selesema berpunca daripada…", o:["Cahaya","Air","Kuman"], a:2},
    {q:"Kuman itu sangat…", o:["Kecil","Besar","Wangi"], a:0},
    {q:"Yang manakah penyakit kerana kuman?", o:["Demam","Tinggi badan","Pandai berlari"], a:0}
  ],
  sederhana: [ // 2.1.2 punca & kesan
    {q:"Bagaimanakah kuman merebak?", o:["Batuk tanpa tutup mulut","Menyanyi","Tidur awal"], a:0},
    {q:"Makan dengan tangan kotor boleh menyebabkan…", o:["Sakit perut","Bertambah tinggi","Kuat berlari"], a:0},
    {q:"Kesan penyakit akibat kuman ialah…", o:["Demam dan lemah badan","Gigi putih","Pandai membaca"], a:0},
    {q:"Yang manakah BUKAN penyakit akibat kuman?", o:["Kaki terseliuh","Selesema","Cirit-birit"], a:0},
    {q:"Kuman masuk ke badan apabila kita makan makanan yang…", o:["Bersih","Kotor","Panas"], a:1},
    {q:"Mengapa kita tutup mulut semasa bersin?", o:["Supaya kuman tidak merebak","Supaya nampak cantik","Supaya cepat lari"], a:0}
  ],
  mencabar: [ // campuran 2.1.1 & 2.1.2
    {q:"Antara berikut, yang manakah disebabkan oleh kuman?", o:["Cirit-birit","Terjatuh","Mengantuk","Lapar"], a:0},
    {q:"Kuman mudah membiak di tempat yang…", o:["Bersih dan kering","Kotor dan lembap","Sejuk dan bersih","Terang"], a:1},
    {q:"Apakah punca utama kita sakit perut selepas makan?", o:["Makanan dihinggapi lalat dan kuman","Makan terlalu perlahan","Minum air masak","Memakai kasut"], a:0},
    {q:"Kesan penyakit akibat kuman yang tidak dirawat ialah…", o:["Badan bertambah sihat","Badan makin lemah","Tidur nyenyak","Pandai berenang"], a:1},
    {q:"Kuman boleh merebak melalui…", o:["Bersentuhan & percikan batuk","Cahaya matahari","Bayang-bayang","Bunyi muzik"], a:0},
    {q:"Yang manakah penyakit akibat kuman?", o:["Selesema, demam & cirit-birit","Patah kaki","Terseliuh","Luka tersepit pintu"], a:0},
    {q:"Mengapa kita ke sekolah lewat apabila kuman menyebabkan demam?", o:["Badan lemah dan perlu berehat","Hari hujan","Beg berat","Suka tidur"], a:0}
  ]
};
const CFG = {
  mudah:    {name:"🌱 Mudah",     speed:.34, gap:2.0, lives:5, penalty:false, hint:true},
  sederhana:{name:"🚀 Sederhana", speed:.46, gap:1.5, lives:4, penalty:false, hint:false},
  mencabar: {name:"🔥 Mencabar",  speed:.60, gap:1.15, lives:3, penalty:true,  hint:false}
};
const GOOD = ["🧼","💧","🍎","🧴","🥦"], BAD = ["🦠","🤧","🪰"];

/* ---------- BUNYI ---------- */
let ac;
function beep(f, d = .15, type = "sine") {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = .12;
    o.connect(g); g.connect(ac.destination); o.start();
    g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + d); o.stop(ac.currentTime + d);
  } catch (e) {}
}

/* ---------- STATE ---------- */
let S = null, state = "menu", last = 0, bgT = 0, shake = 0;
const clouds = Array.from({length:5}, (_, i) => ({x:Math.random(), y:.03 + Math.random() * .14, s:.6 + Math.random() * .8, v:.01 + Math.random() * .02}));
const trees = Array.from({length:8}, (_, i) => ({t:i / 8, side:i % 2 ? 1 : -1, e:["🌳","🌴","🏡","🌻"][i % 4]}));
let parts = [];

function start(level) {
  const c = CFG[level];
  S = {level, c, lane:1, px:1, lives:c.lives, score:0, objs:[], spawn:1, pool:BANK[level].slice().sort(() => Math.random() - .5),
       total:BANK[level].length, answered:0, correct:0, dodges:0, safe:0, t:0, ask:null};
  $("menu").classList.add("hidden"); $("result").classList.add("hidden");
  ["hud", "touch"].forEach(i => $(i).classList.remove("hidden"));
  $("levelName").textContent = c.name;
  hud(); state = "play"; beep(660);
}
function hud() {
  $("lives").textContent = "❤️".repeat(Math.max(0, S.lives)) + "🖤".repeat(Math.max(0, S.c.lives - S.lives));
  $("score").textContent = "⭐ " + S.score;
  $("prog").textContent = `Soalan ${S.answered}/${S.total}`;
}
function move(d) { if (state === "play") { S.lane = Math.max(0, Math.min(2, S.lane + d)); beep(400, .05); } }

/* ---------- INPUT ---------- */
addEventListener("keydown", e => {
  if (["ArrowLeft", "a", "A"].includes(e.key)) move(-1);
  if (["ArrowRight", "d", "D"].includes(e.key)) move(1);
});
$("btnL").onclick = () => move(-1); $("btnR").onclick = () => move(1);
let tx = null;
addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, {passive:true});
addEventListener("touchend", e => {
  if (tx === null) return;
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 30) move(dx > 0 ? 1 : -1);
  tx = null;
}, {passive:true});
document.querySelectorAll("[data-l]").forEach(b => b.onclick = () => start(b.dataset.l));
$("again").onclick = () => start(S.level);
$("home").onclick = () => { $("result").classList.add("hidden"); $("menu").classList.remove("hidden"); state = "menu"; };

/* ---------- SOALAN ---------- */
function askQuestion(why) {
  if (!S.pool.length) return;
  state = "quiz";
  const q = S.pool.pop();
  $("qWhy").textContent = why;
  $("qText").textContent = q.q;
  $("qFb").textContent = S.c.hint ? "💡 Pilih jawapan yang betul!" : "";
  $("qFb").style.color = "#3b2a6b";
  const box = $("qOpts"); box.innerHTML = "";
  q.o.map((t, i) => ({t, i})).sort(() => Math.random() - .5).forEach(({t, i}) => {
    const b = document.createElement("button"); b.textContent = t;
    b.onclick = () => answer(b, i === q.a, q);
    box.appendChild(b);
  });
  $("quiz").classList.remove("hidden");
}
function answer(btn, ok, q) {
  document.querySelectorAll("#qOpts button").forEach(b => { b.disabled = true; if (b.textContent === q.o[q.a]) b.classList.add("ok"); });
  S.answered++;
  if (ok) {
    S.correct++; S.score += 20; beep(880, .2); beep(1100, .3);
    $("qFb").textContent = "🎉 Hebat! Betul!"; $("qFb").style.color = "#2dc653";
    burst(W / 2, H / 2, 30);
  } else {
    btn.classList.add("no"); beep(200, .3, "sawtooth");
    $("qFb").textContent = "😅 Tidak mengapa! Jawapan: " + q.o[q.a]; $("qFb").style.color = "#e63946";
    if (S.c.penalty) S.lives--;
  }
  hud();
  setTimeout(() => {
    $("quiz").classList.add("hidden");
    if (S.lives <= 0 || S.answered >= S.total) return finish();
    S.objs = S.objs.filter(o => o.t < .35); S.safe = 1.5; state = "play"; last = performance.now();
  }, 1700);
}

/* ---------- PERMAINAN ---------- */
function spawn() {
  const lanes = [0, 1, 2].sort(() => Math.random() - .5), n = Math.random() < .3 ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const bad = i === 0 ? Math.random() < .55 : Math.random() < .5;
    S.objs.push({lane:lanes[i], t:0, bad, e:(bad ? BAD : GOOD)[Math.floor(Math.random() * (bad ? 3 : 5))], done:false});
  }
}
function update(dt) {
  S.t += dt; S.safe = Math.max(0, S.safe - dt);
  S.px += (S.lane - S.px) * Math.min(1, dt * 14);
  S.spawn -= dt; if (S.spawn <= 0) { spawn(); S.spawn = S.c.gap * (.85 + Math.random() * .4); }
  for (const o of S.objs) {
    o.t += S.c.speed * dt * (.5 + o.t);
    if (!o.done && o.t > .93 && o.t < 1.1 && Math.abs(S.px - o.lane) < .55) {
      o.done = true; o.hit = true;
      const p = pos(o.lane, o.t);
      if (o.bad) {
        if (S.safe <= 0) { S.lives--; shake = .4; beep(150, .3, "square"); burst(p.x, p.y, 14, "💥"); S.safe = 1; hud(); if (S.lives <= 0) return finish(); }
      } else { S.score += 10; burst(p.x, p.y, 12, "✨"); beep(1000, .12); hud(); if (state === "play") return askQuestion("🎁 Kamu kutip " + o.e + "!"); }
    } else if (!o.done && o.t >= 1.1) {
      o.done = true;
      if (o.bad) { S.dodges++; S.score += 5; hud(); if (S.dodges % 3 === 0 && state === "play") return askQuestion("🚗 Hebat mengelak kuman!"); }
    }
  }
  S.objs = S.objs.filter(o => o.t < 1.3);
  parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; p.l -= dt; });
  parts = parts.filter(p => p.l > 0);
}
function finish() {
  state = "end";
  ["hud", "touch"].forEach(i => $(i).classList.add("hidden"));
  const win = S.lives > 0, ratio = S.correct / S.total;
  const stars = !win ? 0 : ratio > .8 ? 3 : ratio > .5 ? 2 : 1;
  $("rTrophy").classList.toggle("hidden", !win);
  $("rTitle").textContent = win ? "🎉 Tahniah, Juara Kuman! Kamu dapat piala!" : "💪 Cuba Lagi!";
  $("rStars").innerHTML = [0, 1, 2].map(i => `<span style="animation-delay:${i * .25}s">${i < stars ? "⭐" : "☆"}</span>`).join("");
  $("rText").textContent = `Skor: ${S.score} | Jawapan betul: ${S.correct}/${S.total}. ` + (win ? "Ingat: kuman penyebab selesema, demam dan cirit-birit. Cuci tangan dan jaga kebersihan!" : "Jangan putus asa, kamu pasti boleh!");
  $("result").classList.remove("hidden");
  beep(win ? 1200 : 250, .5);
}
function burst(x, y, n, e) {
  for (let i = 0; i < n; i++) parts.push({x, y, vx:(Math.random() - .5) * 400, vy:-Math.random() * 350, l:.8 + Math.random() * .5, e:e || ["⭐","🌟","🎈","🎊"][i % 4]});
}

/* ---------- LUKISAN ---------- */
const hz = () => H * .3, py = () => H * .82, lw = () => Math.min(W * .3, 170);
function pos(lane, t) {
  const k = .2 + .8 * Math.min(t, 1.3);
  return {x:W / 2 + (lane - 1) * lw() * k * 1.0, y:hz() + (py() - hz()) * t, s:.25 + .75 * t};
}
function emoji(e, x, y, size, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = size + "px serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(e, 0, 0); ctx.restore();
}
let carType = "merah";
const CARS = {
  merah:{body:"#ff3b5c", cab:"#ff6b81"},
  biru:{body:"#2f80ed", cab:"#56a0ff"},
  bas:{body:"#ffc107", cab:"#ffd54f"},
  polis:{body:"#f1f5f9", cab:"#2f5bd3"}
};
document.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
  carType = b.dataset.c;
  document.querySelectorAll("[data-c]").forEach(x => x.classList.toggle("sel", x === b));
  beep(700, .1);
});
function car(x, y, s, tilt) {
  const rr = (a, b, w, h, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(a, b, w, h, r); ctx.fill(); };
  const C = CARS[carType], blink = Math.floor(bgT * 4) % 2;
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s / 100, s / 100);
  rr(-52, 8, 18, 34, 6, "#222"); rr(34, 8, 18, 34, 6, "#222");
  if (carType === "bas") {
    rr(-48, -56, 96, 98, 14, C.body);
    rr(-40, -48, 80, 28, 6, "#bde7ff");
    rr(-48, -8, 96, 8, 0, "#222");
    ctx.fillStyle = "#222"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center"; ctx.fillText("BAS SEKOLAH", 0, 4);
  } else {
    rr(-46, -22, 92, 62, 16, C.body);
    rr(-33, -52, 66, 38, 14, C.cab);
    rr(-27, -46, 54, 24, 8, "#bde7ff");
    if (carType === "polis") {
      rr(-46, -6, 92, 8, 0, "#2f5bd3");
      rr(-18, -62, 18, 12, 4, blink ? "#ff1744" : "#7a0c20");
      rr(0, -62, 18, 12, 4, blink ? "#1e3a8a" : "#4da3ff");
    }
  }
  rr(-40, 6, 20, 12, 5, blink ? "#ffd166" : "#fff3b0");
  rr(20, 6, 20, 12, 5, blink ? "#ffd166" : "#fff3b0");
  rr(-15, 18, 30, 14, 4, "#fff");
  ctx.fillStyle = "#3b2a6b"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center"; ctx.fillText("SIHAT", 0, 29);
  ctx.restore();
}
function draw(dt) {
  bgT += dt;
  const sh = shake > 0 ? (Math.random() - .5) * 14 : 0; shake = Math.max(0, shake - dt);
  ctx.save(); ctx.translate(sh, sh);
  let g = ctx.createLinearGradient(0, 0, 0, hz());
  g.addColorStop(0, "#5ec8ff"); g.addColorStop(1, "#d7f3ff"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, hz() + 2);
  ctx.fillStyle = "#7ddc5b"; ctx.fillRect(0, hz(), W, H);
  emoji("☀️", W * .85, hz() * .35 , 50 + Math.sin(bgT * 2) * 3, bgT * .2);
  clouds.forEach(c => { c.x = (c.x + c.v * dt) % 1.2; emoji("☁️", (c.x - .1) * W, c.y * H, 60 * c.s); });
  // jalan
  const w0 = lw() * .2 * 1.6, w1 = lw() * 1.6;
  ctx.fillStyle = "#6c6f7f"; ctx.beginPath();
  ctx.moveTo(W / 2 - w0, hz()); ctx.lineTo(W / 2 + w0, hz()); ctx.lineTo(W / 2 + w1 * 1.0 * (H / (py() - hz()) * .0 + 1.45), H); ctx.lineTo(W / 2 - w1 * 1.45, H); ctx.fill();
  ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 6; ctx.setLineDash([]);
  [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(W / 2 + s * w0, hz()); ctx.lineTo(W / 2 + s * w1 * 1.45, H); ctx.stroke(); });
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
  const off = (bgT * .6) % .1;
  for (let i = 0; i < 12; i++) {
    const a = i * .1 + off, b = a + .05;
    [-.5, .5].forEach(l => {
      const p = pos(1 + l, a), q = pos(1 + l, b);
      ctx.lineWidth = 2 + 6 * a; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    });
  }
  // pemandangan tepi
  const sp = S && state === "play" ? S.c.speed : .2;
  trees.forEach(tr => {
    tr.t += sp * dt * (.5 + tr.t) * .8; if (tr.t > 1.2) tr.t = 0;
    const k = .2 + .8 * tr.t;
    emoji(tr.e, W / 2 + tr.side * lw() * 2.3 * k * 1.1, hz() + (py() - hz()) * tr.t, 90 * k);
  });
  if (S && (state === "play" || state === "quiz")) {
    S.objs.slice().sort((a, b) => a.t - b.t).forEach(o => {
      if (o.hit) return;
      const p = pos(o.lane, o.t), sz = 80 * p.s * Math.min(1, H / 650);
      ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + sz * .4, sz * .4, sz * .12, 0, 0, 7); ctx.fill();
      emoji(o.e, p.x, p.y + Math.sin(bgT * 6 + o.lane) * 4 * p.s, sz, o.bad ? Math.sin(bgT * 5) * .3 : 0);
    });
    // pemain
    const p = pos(S.px, 1), sz = 95 * Math.min(1, H / 650), bob = Math.abs(Math.sin(bgT * 12)) * 10;
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + sz * .5, sz * .35, sz * .1, 0, 0, 7); ctx.fill();
    ctx.globalAlpha = S.safe > 0 && Math.floor(bgT * 10) % 2 ? .4 : 1;
    car(p.x, p.y - bob * .3, sz, (S.lane - S.px) * .25);
    ctx.globalAlpha = 1;
    parts.forEach(q => { ctx.globalAlpha = Math.min(1, q.l); emoji(q.e, q.x, q.y, 28); }); ctx.globalAlpha = 1;
  }
  ctx.restore();
}
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
  if (state === "play") update(dt); else if (S && state === "quiz") { parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; p.l -= dt; }); parts = parts.filter(p => p.l > 0); }
  draw(state === "quiz" ? 0 : dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
