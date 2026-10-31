const els = document.querySelectorAll('.fade-el');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
els.forEach(el=>obs.observe(el));

// ---- Background music ----
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicToggle');

function setPlayingUI(isPlaying){
  musicBtn.classList.toggle('is-playing', isPlaying);
  musicBtn.setAttribute('aria-pressed', String(isPlaying));
  musicBtn.setAttribute('aria-label', isPlaying ? 'Jeda musik' : 'Putar musik');
}

// Coba autoplay saat halaman dibuka (banyak browser akan menolak ini
// sampai ada interaksi dari user, makanya ada fallback di bawah)
bgm.play().then(()=> setPlayingUI(true)).catch(()=> setPlayingUI(false));

// Begitu user pertama kali tap/klik di mana pun, coba mainkan lagi
function firstGesture(){
  if(bgm.paused){
    bgm.play().then(()=> setPlayingUI(true)).catch(()=>{});
  }
  document.removeEventListener('click', firstGesture);
  document.removeEventListener('touchstart', firstGesture);
}
document.addEventListener('click', firstGesture, {once:true});
document.addEventListener('touchstart', firstGesture, {once:true});

// Tombol manual play/pause
musicBtn.addEventListener('click', function(e){
  e.stopPropagation();
  if(bgm.paused){
    bgm.play().then(()=> setPlayingUI(true)).catch(()=>{});
  } else {
    bgm.pause();
    setPlayingUI(false);
  }
});

// ---- Paper notes ----
const noteOverlay = document.getElementById('noteOverlay');
const noteBigBody = document.getElementById('noteBigBody');
const noteClose = document.getElementById('noteClose');
const paperNotes = document.querySelectorAll('.paper-note');
let lastNote = null;

function openNote(note){
  lastNote = note;
  noteBigBody.innerHTML =
    note.querySelector('.note-text').innerHTML +
    note.querySelector('.note-sign').outerHTML;
  noteBigBody.scrollTop = 0;
  noteOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  noteClose.focus();
}
function closeNote(){
  noteOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
  if(lastNote) lastNote.focus();
}

paperNotes.forEach(note => {
  note.addEventListener('click', () => openNote(note));
  note.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openNote(note); }
  });
});

function markLongNotes(){
  paperNotes.forEach(note => {
    const t = note.querySelector('.note-text');
    note.classList.toggle('is-long', t.scrollHeight > t.clientHeight + 2);
  });
}
(document.fonts ? document.fonts.ready : Promise.resolve()).then(markLongNotes);
window.addEventListener('resize', markLongNotes);

noteClose.addEventListener('click', closeNote);
noteOverlay.addEventListener('click', e => { if(e.target === noteOverlay) closeNote(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeNote(); });