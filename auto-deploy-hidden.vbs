' Avvia il watcher senza finestra. Lo richiama l'attivita' di accesso a Windows.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = folder
sh.Run "cmd.exe /d /c """ & folder & "\auto-deploy-launcher.bat""", 0, False
