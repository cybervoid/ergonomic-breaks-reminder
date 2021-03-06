//classes declaration
const {app, ipcMain} = require('electron');
const {createMenuTray, resetTimerMenu} = require('./lib/MenuController');
const windowController = require('./lib/WindowController');
const {TIMER_DURATION, BREAK_TIMER_DURATION} = require('./lib/Constants')
const {createTimer} = require('./lib/TimersController')


//global variables declaration
let timerProgress;

let isBreakTimer = false;
module.exports.breakWindowHandler = null
module.exports.activeTimer = null
module.exports.timeProgress = null
module.exports.menuTray = null

const isMac = process.platform === 'darwin';

if (process.env.NODE_ENV !== 'production') {
    app.commandLine.appendSwitch('remote-debugging-port', '9222');
}

/**
 * Callback function for the timer
 * @param distance
 * @param label
 * @returns {Promise<void>}
 */
const processMainTimer = (distance, label) => {

    if (distance <= 1) {
        //time is up
        timerProgress = null

        if (this.breakWindowHandler) {
            this.activeTimer = createTimer(TIMER_DURATION, this.processMainTimer)
            this.breakWindowHandler = windowController.closeBreakWindow();
        } else {
            this.initiateBreak()
        }
        isBreakTimer = !isBreakTimer;
    } else {
        timerProgress = distance;
        if (this.breakWindowHandler) {
            windowController.updateBreakTimer(label)
        }
        this.menuTray.setTitle(label);
    }
    this.timeProgress = distance
}

module.exports.initiateBreak = () => {
    this.breakWindowHandler = windowController.createBreakWindow(this.processMainTimer)
    this.activeTimer = createTimer(BREAK_TIMER_DURATION, this.processMainTimer)
}

/**
 * Stops or resume a timer based on the boolean param
 * @param resume
 */
const controlTimer = (resume = true) => {
    if (resume) {
        const initVal = this.timeProgress ? this.timeProgress / 1000 : TIMER_DURATION
        this.activeTimer = createTimer(initVal, this.processMainTimer)
    } else {
        if (this.breakWindowHandler) {
            this.breakWindowHandler = windowController.closeBreakWindow();
        }
        clearInterval(this.activeTimer);
        this.timeProgress = null
    }
}

module.exports.controlTimer = controlTimer;
module.exports.processMainTimer = processMainTimer;

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('system', async (event, ...args) => {
    let res = false
    switch (args[0]) {
        case "timer":
            switch (args[1]) {
                case "skip":
                    await resetTimer()
                    break
                case "postpone":
                    const duration = args[2] * 60
                    await resetTimer(duration)

                    break
            }
            break
    }

    return res
})

/**
 * Stops break timer and starts regular timer
 * @returns {Promise<void>}
 */
async function resetTimer(duration = false) {
    await controlTimer(false)
    module.exports.activeTimer = createTimer(duration ?? TIMER_DURATION, processMainTimer);
    resetTimerMenu()
}

//application starts
app.whenReady().then(() => {
    this.menuTray = createMenuTray()
    module.exports.activeTimer = createTimer(TIMER_DURATION, this.processMainTimer);
});
