# Registra (o toglie) l'auto-deploy di Maximize Academy senza finestre.
# Uso: powershell -File installa-auto-deploy.ps1
#      powershell -File installa-auto-deploy.ps1 -Rimuovi
param([switch]$Rimuovi)

$ErrorActionPreference = 'Stop'
$taskName = 'MaximizeAcademy-AutoDeploy'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$vbs = Join-Path $root 'auto-deploy-hidden.vbs'
$startup = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup\MaximizeAcademy-AutoDeploy.cmd'

if (Test-Path -LiteralPath $startup) {
    Remove-Item -LiteralPath $startup -Force
}
Remove-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -Name 'MaximizeAcademyAutoDeploy' -ErrorAction SilentlyContinue
Remove-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run' -Name 'MaximizeAcademyAutoDeploy' -ErrorAction SilentlyContinue
Remove-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\StartupFolder' -Name 'MaximizeAcademy-AutoDeploy.cmd' -ErrorAction SilentlyContinue

if ($Rimuovi) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Output 'Auto-deploy disinstallato. Non partira piu da solo.'
    exit 0
}

if (-not (Test-Path -LiteralPath $vbs)) {
    throw "Manca $vbs"
}

$action = New-ScheduledTaskAction -Execute 'wscript.exe' -Argument "//B `"$vbs`""
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -RestartCount 5 -RestartInterval (New-TimeSpan -Minutes 1)
$settings.ExecutionTimeLimit = 'PT0S'
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Watcher Maximize Academy, senza finestra, all'accesso." -Force | Out-Null
Write-Output 'Avvio automatico installato, senza finestra.'
