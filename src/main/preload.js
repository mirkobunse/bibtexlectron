const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {

    /*
     * The IPC example from the electron-react-boilerplate. See src/renderer/index.ejs
     * for how this example is called and track the effects in the main console and in
     * the in-app console.
     */
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },

    /*
     * Provide window.electron.ipcRenderer.on(channel, func) for registering callbacks.
     */
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },

    /*
     * Provide window.electron.ipcRenderer.once(channel, func) for registering callbacks
     * that are de-registed after their first invocation.
     */
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },

    /*
     * Provide window.electron.ipcRenderer.invoke(channel, ...args) for sending a request
     * which the main process answers via ipcMain.handle(channel, ...).
     */
    invoke(channel, ...args) {
      const validChannels = ['open-file', 'read-file'];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      } else {
        return new Promise((resolve, reject) => reject("invalid channel " + channel))
      }
    },
  },

  /*
   * electron-store for persistance of preferences, app state, cache, etc
   */
  store: {
    get(property) {
      return ipcRenderer.sendSync("electron-store-get", property);
    },
    set(property, val) {
      ipcRenderer.send("electron-store-set", property, val);
    },
    delete(property) {
      ipcRenderer.send("electron-store-delete", property);
    },
    // TODO: other methods like has(), reset(), etc.
  },

  /*
   * Provide window.electron.openExternal(url) for opening URLs in the web browser.
   *
   * shell.openExternal seems to work only here, in src/main/preload.js, but not
   * in src/main/main.ts.
   */
  openExternal(url) {
    return shell.openExternal(url) // return a Promise<void>
  },

});
