# DK Elite — Converter hero-video.mov para MP4
# Executa este ficheiro com clique direito > "Executar com PowerShell"

$origem = "$PSScriptRoot\images\hero-video.mov"
$destino = "$PSScriptRoot\images\hero-video.mp4"

Write-Host "Verificando ffmpeg..." -ForegroundColor Cyan

# Verificar se ffmpeg está disponível
$ffmpegPath = Get-Command ffmpeg -ErrorAction SilentlyContinue

if ($ffmpegPath) {
    Write-Host "ffmpeg encontrado! Convertendo..." -ForegroundColor Green
    ffmpeg -i $origem -vcodec h264 -acodec aac -strict -2 -crf 23 -preset fast $destino
    Write-Host "Conversao completa! Ficheiro criado em: $destino" -ForegroundColor Green
} else {
    Write-Host "ffmpeg nao encontrado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPCAO MAIS SIMPLES: Renomear o ficheiro." -ForegroundColor Cyan
    Write-Host "O teu video .mov provavelmente ja esta em formato H.264 (iPhone grava assim)." -ForegroundColor White
    Write-Host "Vamos tentar copiar o .mov como .mp4..." -ForegroundColor White
    Write-Host ""

    if (Test-Path $origem) {
        Copy-Item $origem $destino
        Write-Host "Ficheiro copiado: hero-video.mp4" -ForegroundColor Green
        Write-Host "Se o video ainda nao aparecer no browser, vai a https://www.freeconvert.com/mov-to-mp4" -ForegroundColor Yellow
        Write-Host "e converte o ficheiro manualmente." -ForegroundColor Yellow
    } else {
        Write-Host "ERRO: Nao encontrei o ficheiro: $origem" -ForegroundColor Red
        Write-Host "Confirma que o video esta na pasta images\" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Prima Enter para fechar..."
Read-Host
