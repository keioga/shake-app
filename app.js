const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const statusDiv = document.getElementById("status");

// 歩数アプリ用
const stepsDiv = document.getElementById("steps");
const rateDiv = document.getElementById("rate");
const barDiv = document.getElementById("bar");
const distanceDiv = document.getElementById("distance");


// 歩数アプリ用
const STEP_HIGH = 11;        // この値をこえたら「1歩」
const STEP_LOW = 10;         // この値より下がったら次の歩を待つ
const MIN_INTERVAL = 250;    // 歩と歩の最短の間かく（ミリ秒）
const GOAL = 1000;           // 目標歩数
const STRIDE = 0.6;          // 歩はば（m）

// 歩数アプリ用
let steps = 0;
let smoothed = 9.8;          // なめらかにしたゆれの大きさ
let stepping = false;        // いま「上がっている」とちゅうか
let lastStepTime = 0;


alert("Ver5.01");

// センサーの値が変化するたびに呼ばれる関数
function onMotion(e) {
  const acc = e.accelerationIncludingGravity;
  if (!acc) return;

  const p = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);

  // 小さなブレを取りのぞく（平滑化）
  smoothed = smoothed * 0.8 + p * 0.2;

  const now = Date.now();
  if (!stepping && smoothed > STEP_HIGH && now - lastStepTime > MIN_INTERVAL) {
    steps = steps + 1;
    stepping = true;
    lastStepTime = now;
    updateDisplay();
  }
  if (stepping && smoothed < STEP_LOW) {
    stepping = false;
  }
}

// 表示の更新
function updateDisplay() {
  stepsDiv.textContent = steps;
  const rate = Math.round(steps / GOAL * 100);
  rateDiv.textContent = rate;
  barDiv.style.width = Math.min(rate, 100) + "%";
  distanceDiv.textContent = Math.round(steps * STRIDE);
}



resetBtn.addEventListener("click", () => {
  steps = 0;
  updateDisplay();
});

startBtn.addEventListener("click", async () => {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    const res = await DeviceMotionEvent.requestPermission();
    if (res !== "granted") {
      statusDiv.textContent = "センサーが許可されませんでした";
      return;
    }
  }
  window.addEventListener("devicemotion", onMotion);
  statusDiv.textContent = "計測中";
});

window.addEventListener("load", () => {
  document.getElementById("goal").textContent = GOAL;
  updateDisplay();
});
