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

// when clicking the button start the timeline/animation:
$(el).on("click", function () {
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
