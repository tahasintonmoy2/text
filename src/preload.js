const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const textArea = document.querySelector('#text');
  ipcRenderer.on('read-file', (e, data)=>{
      textArea.value = data;
  })
  ipcRenderer.on('saveFile',()=>{
    ipcRenderer.invoke('saveFile', textArea.value)
  })
});
