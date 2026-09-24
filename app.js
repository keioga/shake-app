const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const statusDiv = document.getElementById("status");
const countDiv = document.getElementById("count");

const power = document.getElementById("power");
const maxPower = document.getElementById("maxPower");
const THRESHOLD = 25;     // これ以上ゆれたら「1回振った」とみなす
const COOL_TIME = 300;    // 次に数えるまで待つ時間（ミリ秒）

const timerDiv = document.getElementById("timer");
const messageDiv = document.getElementById("message");
const bestDiv = document.getElementById("best");
const GAME_TIME = 10;     // 制限時間（秒）


let playing = false;      // ゲーム中かどうか
let timerId = null;
let endTime = 0;          // ゲームが終わる時刻


const mess = document.getElementById("mess");

let count = 0;
let lastTime = 0;         // 最後に数えた時刻

let maxValue=0;

alert("Ver4.00");

// センサーの値が変化するたびに呼ばれる関数
function onMotion(e){
    if (!playing) return; 
    const acc = e.accelerationIncludingGravity;
    
    if(!acc) return;

    const p = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z*acc.z);
    const now = Date.now();
    
    if (p > THRESHOLD && now - lastTime > COOL_TIME) {
        count = count + 1;
        countDiv.textContent = count;
        lastTime = now;
    }

    // if (count % 10 == 0 && count > 1){
    //     mess.textContent = "いいね！！この調子♪";
    // }else{
    //     mess.textContent = "がんばって！♪";
    // }

    // power.textContent = p.toFixed(1);
    
    // power.style.fontsize = (20+p)+"px";
    // if(p > maxValue){
    //     maxValue = p;
    //     maxPower.textContent = maxValue.toFixed(1);
    // }

    // if(p > 20){
    //     document.body.classList.add("shaking");
    // }else{
    //     document.body.classList.remove("shaking");
    // }
}

function startGame() {
  count = 0;
  countDiv.textContent = 0;
  messageDiv.textContent = "";
  playing = true;
  endTime = Date.now() + GAME_TIME * 1000;
  statusDiv.textContent = "ふれー！";
  timerId = setInterval(updateTimer, 100);
}

function updateTimer() {
  const rest = (endTime - Date.now()) / 1000;
  if (rest <= 0) {
    timerDiv.textContent = "0.0";
    endGame();
    return;
  }
  timerDiv.textContent = rest.toFixed(1);
}

function endGame() {
  playing = false;
  clearInterval(timerId);
  statusDiv.textContent = "終了！";

  // ハイスコアの保存（ローカルストレージ）
  const best = Number(localStorage.getItem("shakeBest")) || 0;
  if (count > best) {
    localStorage.setItem("shakeBest", count);
    bestDiv.textContent = count;
    messageDiv.textContent = "新記録！おめでとう！";
  } else {
    messageDiv.textContent = "記録は " + best + " 回です";
  }
}


resetBtn.addEventListener("click", () => {
  count = 0;
  countDiv.textContent = count;
});


// 「センサー開始」ボタンが押されたときの処理
startBtn.addEventListener("click", async () => {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    const res = await DeviceMotionEvent.requestPermission();
    if (res !== "granted") {
      statusDiv.textContent = "センサーが許可されませんでした";
      return;
    }
  }
  window.addEventListener("devicemotion", onMotion);
  startGame();
});


// startBtn.addEventListener("click", async () =>{
//     // iPhoneでは使用許可を求める必要がある
//     if(typeof DeviceMotionEvent.requestPermission === "function"){
//         const res=await DeviceMotionEvent.requestPermission();
//         if(res !== "granted"){
//             statusDiv.textContent = "センサーが許可されませんでした";
//             return;
//         }
//     }
//     window.addEventListener("devicemotion",onMotion);
//     statusDiv.textContent = "計測中";
// });

window.addEventListener("load", () => {
  bestDiv.textContent = Number(localStorage.getItem("shakeBest")) || 0;
  timerDiv.textContent = GAME_TIME.toFixed(1);
});
