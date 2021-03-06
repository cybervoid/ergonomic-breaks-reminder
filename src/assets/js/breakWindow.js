const {ipcRenderer} = require('electron')
const {startClock} = require('../assets/js/clock')

async function skipBreak() {
    await ipcRenderer.invoke('system', 'timer', 'skip')
}

async function postpone(duration) {
    const result = await ipcRenderer.invoke('system', 'timer', 'postpone', duration)
    console.log(result);
}

function init() {
    startClock()
    ipcRenderer.on('break_timer', (event, message) => {
        document.getElementById("breakTimerCanvas").innerHTML = message.status
    });

}

//document ready replacement
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}