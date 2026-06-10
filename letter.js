// ===== СЛАЙДЕР =====
var slides = Array.from(document.querySelectorAll(".bodyslider .slide"));
var index = slides.length - 1;
var dirByClass = { six:"down", five:"up", four:"right", three:"left", two:"down", one:"up" };
var transitioning = false;

// активируем последний слайд
slides.forEach(function(s){ s.classList.remove("active","go-up","go-down","go-left","go-right"); });
slides[index].classList.add("active");

slides.forEach(function(slide, i){
  slide.addEventListener("click", function(){
    if (i !== index || transitioning) return;
    transitioning = true;

    var key = ["six","five","four","three","two","one"].find(function(c){ return slide.classList.contains(c); });
    var dirMap = { six:"go-down", five:"go-up", four:"go-right", three:"go-left", two:"go-down", one:"go-up" };
    var dir = dirMap[key] || "go-up";

    slide.classList.add(dir);

    setTimeout(function(){
      slide.classList.remove("active");
      index--;
      transitioning = false;

      if (index >= 0) {
        slides[index].classList.add("active");
      } else {
        // все слайды прошли
        var bs = document.getElementById("bodyslider");
        bs.style.display = "none";
        var cs = document.getElementById("counterScene");
        cs.style.opacity = "1";
        cs.style.display = "flex";
        cs.style.pointerEvents = "auto";
      }
    }, 520);
  });
});

// ===== СЧЁТЧИК =====
var startDate = new Date('2026-01-25T11:51:00');
function updateCounter(){
  var diff = Date.now() - startDate.getTime();
  document.getElementById('days').textContent    = Math.floor(diff / 86400000);
  document.getElementById('hours').textContent   = String(Math.floor(diff/3600000)%24).padStart(2,'0');
  document.getElementById('minutes').textContent = String(Math.floor(diff/60000)%60).padStart(2,'0');
  document.getElementById('seconds').textContent = String(Math.floor(diff/1000)%60).padStart(2,'0');
}
updateCounter();
setInterval(updateCounter, 1000);

// ===== КНОПКА → КОНВЕРТ =====
document.getElementById("counterBtn").addEventListener("click", function(){
  var cs = document.getElementById("counterScene");
  cs.style.opacity = "0";
  cs.style.pointerEvents = "none";
  setTimeout(function(){
    cs.style.display = "none";
    var ew = document.getElementById("envelopeWrapper");
    ew.style.opacity = "0";
    ew.style.display = "block";
    setTimeout(function(){ ew.style.opacity = "1"; }, 30);
  }, 820);
});

// ===== КОНВЕРТ =====
$(document).ready(function(){
  $("#envelope").click(function(){
    $(this).addClass("open").removeClass("close");
  });
});
