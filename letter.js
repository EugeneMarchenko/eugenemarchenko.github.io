$(document).ready(function () {
  var envelope = $("#envelope");
  var btn_open = $("#open");
  var btn_reset = $("#reset");

  envelope.click(function () {
    open();
  });
  btn_open.click(function () {
    open();
  });
  btn_reset.click(function () {
    close();
  });

  function open() {
    envelope.addClass("open").removeClass("close");
  }
  function close() {
    envelope.addClass("close").removeClass("open");
  }
});
const el = document.querySelector(".heart");
const heart = $(".heart svg");
let tl = new TimelineMax({ paused: true });
let timeline = new mojs.Timeline();

tl.add(
  TweenMax.to(heart, 0.15, {
    scaleX: 0.4,
    scaleY: 0.2,
    ease: Back.easeOut.config(4)
  })
);
tl.add(
  TweenMax.to(heart, 0.25, {
    scaleX: 1,
    scaleY: 1,
    ease: Back.easeOut.config(4)
  })
);

const burst = new mojs.Burst({
  parent: el,
  count: 10,
  radius: { 0: 80 },
  duration: 1500,
  children: {
    radius: { 15: 0 },
    easing: "cubic.out",
    degreeShift: "rand(-50,50)"
  }
});

const burst2 = new mojs.Burst({
  parent: el,
  count: 15,
  radius: { 0: 60 },
  children: {
    shape: "line",
    stroke: "white",
    fill: "none",
    scale: 1,
    scaleX: { 1: 0 },
    easing: "cubic.out",
    duration: 1000,
    degreeShift: "rand(-50, 50)"
  }
});

const bubbles = new mojs.Burst({
  parent: el,
  radius: 50,
  count: 5,
  timeline: { delay: 200 },
  children: {
    stroke: "white",
    fill: "none",
    scale: 1,
    strokeWidth: { 8: 0 },
    radius: { 0: "rand(6, 10)" },
    degreeShift: "rand(-50, 50)",
    duration: 400,
    delay: "rand(0, 250)"
  }
});

const circ_opt = {
  parent: el,
  radius: { 0: 50 },
  duration: 750,
  shape: "circle",
  fill: "none",
  stroke: "#FF4136",
  strokeWidth: 1,
  opacity: { 1: 0 }
};

const circ = new mojs.Shape({
  ...circ_opt
});

const circ2 = new mojs.Shape({
  ...circ_opt,
  delay: 100
});

timeline.add(circ, circ2);
// ===== HEART RUN AWAY 3 TIMES THEN CLICKABLE =====
let escapesLeft = 7;
let heartReadyToClick = false;
let escapeCooldown = false;

const heartBox = document.getElementById("box");      // слой с сердцем
const heartWrap = document.querySelector(".heart");   // сам блок сердца

function setHeartOffset(dx, dy){
  heartWrap.style.setProperty("--dx", dx + "px");
  heartWrap.style.setProperty("--dy", dy + "px");
}

function heartCenter(){
  const r = heartWrap.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function rand(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeFromMouse(mx, my){
  if (escapeCooldown || heartReadyToClick || escapesLeft <= 0) return;

  const { x, y } = heartCenter();
  const dx = x - mx;
  const dy = y - my;

  // если мышь далеко — не убегаем
  const dist = Math.hypot(dx, dy);
  if (dist > 110) return;

  escapeCooldown = true;
  escapesLeft--;

  // выбираем направление "от мыши"
  const dirX = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(dx);
  const dirY = dy === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(dy);

  // ограничим увод, чтобы сердце не улетало за экран
  const boxRect = heartBox.getBoundingClientRect();
  const hRect = heartWrap.getBoundingClientRect();

  const maxX = Math.max(40, Math.floor((boxRect.width / 2) - hRect.width));
  const maxY = Math.max(40, Math.floor((boxRect.height / 2) - hRect.height));

  const moveX = dirX * rand(80, Math.min(220, maxX));
  const moveY = dirY * rand(60, Math.min(180, maxY));

  setHeartOffset(moveX, moveY);

  // небольшая пауза, чтобы не триггерилось сто раз подряд
  setTimeout(() => {
    escapeCooldown = false;

    if (escapesLeft <= 0) {
      // вернуть в исходное положение и сделать кликабельным
      setHeartOffset(0, 0);
      heartReadyToClick = true;
      heartWrap.classList.add("clickable");
    }
  }, 320);
}

// слушаем движение мыши по слою с сердцем
heartBox.addEventListener("mousemove", (e) => {
  escapeFromMouse(e.clientX, e.clientY);
});
// when clicking the button start the timeline/animation:
$(el).on("click", function () {
  if (!heartReadyToClick) return;  
  if ($(el).hasClass("active")) return; // защита от повторного клика

  $(el).addClass("active");

  // 💓 пульс сердца
  tl.restart();
  burst.generate().replay();
  burst2.generate().replay();
  bubbles.generate().replay();
  timeline.replay();

  // 🌫 исчезновение фона ПОСЛЕ анимации
  setTimeout(() => {
    $("#box").addClass("hide");
  }, 700); // ← регулируй тут
});
// ===== ELECTRIC LOCK (4 digits) =====
(() => {
const CODE = "2501"; // ← тут меняешь пароль на любой 4-значный

  const lockScene = document.getElementById("lockScene");
  const electricLock = document.getElementById("electricLock");
  const led = document.getElementById("lockLed");
  const dots = document.getElementById("displayDots");
  const status = document.getElementById("displayStatus");
  const box = document.getElementById("box");

  let input = "";

  function render() {
    // показываем точки вместо цифр
    const filled = "●".repeat(input.length);
    const empty = "—".repeat(4 - input.length);
    dots.textContent = (filled + empty).split("").join(" ");
  }

  function setState(type, text) {
    led.classList.remove("ready", "ok", "bad");
    if (type) led.classList.add(type);
    status.textContent = text || "";
  }

  function resetSoft() {
    input = "";
    render();
    setState("ready", "Enter 4-digit code");
  }

  function fail() {
    setState("bad", "Wrong code");
    electricLock.classList.add("shake");
    setTimeout(() => electricLock.classList.remove("shake"), 280);
    setTimeout(resetSoft, 650);
  }

  function success() {
    setState("ok", "UNLOCKED");
    // небольшая пауза, чтобы увидеть успех
    setTimeout(() => {
      electricLock.classList.add("unlocking"); // плавно исчезаем
    }, 450);

    setTimeout(() => {
      // прячем сцену замка
      lockScene.classList.add("hide");
      // показываем сердце
      box.classList.add("show");
    }, 1100);
  }

  // обработка кликов по кнопкам
  document.querySelectorAll(".key").forEach(btn => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.key;
      const action = btn.dataset.action;

      if (action === "clear") {
        resetSoft();
        return;
      }
      if (action === "back") {
        input = input.slice(0, -1);
        render();
        setState("ready", "Enter 4-digit code");
        return;
      }

      if (!k) return;

      if (input.length >= 4) return; // не даём больше 4 цифр
      input += k;
      render();

      if (input.length === 4) {
        if (input === CODE) success();
        else fail();
      } else {
        setState("ready", "Enter 4-digit code");
      }
    });
  });

  // стартовое состояние
  resetSoft();
})();

document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".bodyslider .slider > div"));
  if (!slides.length) return;

  // старт с .six
  let index = slides.length - 1;

  // направления строго по твоему сценарию
  const dirByClass = {
    six: "down",
    five: "up",
    four: "right",
    three: "left",
    two: "down",
    one: "up",
  };

  // активный только один
  slides.forEach(s => s.classList.remove("active", "up", "down", "left", "right"));
  slides[index].classList.add("active");

  slides.forEach((slide, i) => {
    slide.addEventListener("click", () => {
      if (i !== index) return;

      const key =
        slide.classList.contains("six") ? "six" :
        slide.classList.contains("five") ? "five" :
        slide.classList.contains("four") ? "four" :
        slide.classList.contains("three") ? "three" :
        slide.classList.contains("two") ? "two" :
        slide.classList.contains("one") ? "one" : null;

      const dir = dirByClass[key] || "up";

      const onEnd = (e) => {
        if (e.propertyName !== "transform") return;
        slide.removeEventListener("transitionend", onEnd);

        // после уезда: слайд остаётся "в стороне", а следующий становится активным
        slide.classList.remove("active");

        index--;

        if (slides[index]) {
          slides[index].classList.add("active");
        } else {
          // конец: только теперь открываем замок
          document.querySelector(".bodyslider")?.classList.add("hide");
        }
      };

      slide.addEventListener("transitionend", onEnd);

      // запускаем уезд
      slide.classList.add(dir);
    });
  });
});



