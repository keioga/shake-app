const startBtn = document.getElementById("startBtn");
const statusDiv = document.getElementById("status");
const valX = ducument.getElementById("valX");
const valY = ducument.getElementById("valY");
const valZ = ducument.getElementById("valZ");

// センサーの値が変化するたびに呼ばれる関数
function onMotion(e){
    const acc = e.accelerationIncludingGravity;
    if(!acc) return;

    valX.textContent = acc.x;
    valY.textContent = acc.y;
    valZ.textContent = acc.z;
    
}



// 「センサー開始」ボタンが押されたときの処理
startBtn.addEventListener("click", async () =>{
    // iPhoneでは使用許可を求める必要がある
    if(typeof DeviceMotionEvent.requestPermission === "function"){
        const res=await DeviceMotionEvent.requestPermission();
        if(res !== "granted"){
            atatusDiv.textContent = "センサーが許可されませんでした";
            return;
        }
    }
    windows.addEventListener("devicemotion",onMotion);
    statusDiv.textContent = "計測中";
});