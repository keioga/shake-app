const startBtn = document.getElementById("startBtn");
const statusDiv = document.getElementById("status");

const power = document.getElementById("power");
const maxPower = document.getElementById("maxPower");

let maxValue=0;

// センサーの値が変化するたびに呼ばれる関数
function onMotion(e){
    const acc = e.accelerationIncludingGravity;
    if(!acc) return;

    const p = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z*acc.z);
    power.textContent = p.toFixed(1);
    
    if(p > maxValue){
        maxValue = p;
        maxPower.textContent = maxValue.toFixed(1);
    }

    if(p > 20){
        document.body.classList.add("shaking");
    }else{
        document.body.classList.remove("shaking");
    }
}



// 「センサー開始」ボタンが押されたときの処理
startBtn.addEventListener("click", async () =>{
    // iPhoneでは使用許可を求める必要がある
    if(typeof DeviceMotionEvent.requestPermission === "function"){
        const res=await DeviceMotionEvent.requestPermission();
        if(res !== "granted"){
            statusDiv.textContent = "センサーが許可されませんでした";
            return;
        }
    }
    window.addEventListener("devicemotion",onMotion);
    statusDiv.textContent = "計測中";
});