$sourcePath = "c:\Users\7azem_store\Downloads\main website"
$destinationPath = "c:\Users\7azem_store\Downloads\witra_platform_final.zip"

if (Test-Path $destinationPath) {
    Remove-Item $destinationPath -Force
}

$items = Get-ChildItem -Path $sourcePath -Exclude "node_modules", ".wrangler", ".git", "witra_platform_final.zip", "fix_reports.cjs", "zip_project.ps1"
Compress-Archive -Path $items.FullName -DestinationPath $destinationPath -Force
Write-Host "Zip file created at: $destinationPath"
