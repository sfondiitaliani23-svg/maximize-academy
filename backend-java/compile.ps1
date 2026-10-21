$jdkPaths = @(
    "C:\Program Files\Java\jdk-21.0.10\bin",
    "C:\Program Files\Java\jdk1.8.0_211\bin",
    "C:\Program Files\Java\latest\bin"
)

$javac = $null
foreach ($path in $jdkPaths) {
    $candidate = Join-Path $path "javac.exe"
    if (Test-Path $candidate) {
        $javac = $candidate
        break
    }
}

if (-not $javac) {
    $found = Get-Command "javac" -ErrorAction SilentlyContinue
    if ($found) { $javac = $found.Source }
}

Write-Host "Uso compilatore Java: $javac"
$binDir = Join-Path $PSScriptRoot "bin"
if (-not (Test-Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir | Out-Null
}

$sourceFile = Join-Path $PSScriptRoot "src\com\maximize\academy\MaximizeAcademyServer.java"
# Compilazione target Java 8 universale (class file 52.0)
& $javac --release 8 -encoding UTF-8 -d $binDir $sourceFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Compilazione Java target 1.8 completata con successo!" -ForegroundColor Green
} else {
    Write-Error "Compilazione fallita con codice $LASTEXITCODE"
    exit $LASTEXITCODE
}
