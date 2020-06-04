const main = require('../index');

module.exports = class MenuTemplate {

    getTrayMenuTemplate() {
        return [
            {
                label: 'Open', click: async () => {
                    windowController.createSettingsWindow()
                }
            },
            {type: 'separator'},
            {
                label: "Go on break",
                click: async () => {
                    this.windowsController.createBreakWindow();
                }
            },
            {type: 'separator'},
            {
                id: 'tray_start_counter',
                label: "Start counter",
                enabled: false,
                click: async (menuItem) => {
                    menuItem.enabled = false;
                    main.trayMenu.getMenuItemById('tray_pause_counter').enabled = true;
                    main.trayMenu.getMenuItemById('tray_stop_counter').enabled = true;
                    const timeLeft = main.getTimerProgress();
                    main.createTimer(timeLeft ? timeLeft / 1000 : null);
                }
            },
            {
                id: 'tray_pause_counter',
                label: "Pause counter",
                click: async (menuItem) => {
                    main.trayMenu.getMenuItemById('tray_start_counter').enabled = true;
                    menuItem.enabled = false;
                    clearInterval(main.getTimerInstance());
                    main.setTimerInstance(null);
                }
            },
            {
                id: 'tray_stop_counter',
                label: "Stop counter",
                click: async (menuItem) => {
                    clearInterval(main.getTimerInstance());
                    main.getTrayInstance().setTitle('');
                    menuItem.enabled = false;
                    main.trayMenu.getMenuItemById('tray_pause_counter').enabled = false;
                    main.trayMenu.getMenuItemById('tray_start_counter').enabled = true;
                    main.setTimerInstance(null);
                }
            },
            {type: 'separator'},
            {
                label: 'Quit',
                click: () => {
                    main.getAppInstance().quit()
                }
            }
        ]
    };

}