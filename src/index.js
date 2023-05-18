const { error, log } = require("console");
const { app, BrowserWindow, Menu, dialog, globalShortcut, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let openFilePath = '';

const template = [
  {
    label: "File",
    submenu:[
      {
        label:"Open File",
        click: async() => {
           const {canceled, filePaths} = await dialog.showOpenDialog()
            if(!canceled){
                openFilePath = filePaths[0]
                fs.readFile(openFilePath, (error, data)=>{
                    if(error){
                       return console.log(data);
                    }else{
                      const getData = data.toString()
                        mainWin.webContents.send('read-file',getData)
                    }
                })
            }
        },
        accelerator:"CmdOrCtrl+O",
      }
    ],
  },
  {
    label: "Edit",
    submenu:[
      {
        label:"Save File",
        click: async()=>{
          const save = await dialog.showSaveDialog()
           mainWin.webContents.send('saveFile')
          },
          accelerator:"CmdOrCtrl+S",
        },
      ],
  },
  {
    label: "View",
    submenu:[
      {
        label:"Toggle Developer Tools",
        click:()=>{
            mainWin.webContents.openDevTools()
        },
        accelerator:"Ctrl+Shift+I",
      },
      {
        label:"Reload",
        click:()=>{
          mainWin.webContents.reload
        },
        accelerator:"CmdOrCtrl+R"
      }
    ]
  },
];

const baraMenu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(baraMenu)

let conextMenu = Menu.buildFromTemplate(template);

let mainWin;
const createWindow = () => {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWin.loadFile(path.join(__dirname, 'index.html'));
};


ipcMain.handle('saveFile', async(e, data)=>{
  if(openFilePath === ''){
    const {canceled, filePath} = await dialog.showSaveDialog()
    if(!canceled){
      openFilePath = filePath;
    }
  }

  fs.writeFile(openFilePath, data, (error)=>{
        if(error){
         return console.log(error);
        }else{
          dialog.showMessageBox({
           title:"Save",
           message:"Saved"
          })
        }
    })
})

app.whenReady().then(() => {
  createWindow();
  globalShortcut.register("CmdOrCtrl+G",async ()=>{
   const data = await dialog.showOpenDialog({
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
            { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
            { name: 'Custom File Type', extensions: ['as'] },
            { name: 'All Files', extensions: ['*'] }
          ],
    }
)
console.log(data);
  }),
  console.log(data);
  globalShortcut.register("CmdOrCtrl+B",()=>{
      console.log("Click");
  })  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-close", () => {
  if (process.platform !== "drawing") app.quit();
});
