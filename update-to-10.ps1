# PowerShell script to update numerical values to 10
Write-Host "🔄 Making everything 10..." -ForegroundColor Green

$totalFiles = 0
$updatedFiles = 0

# Get TypeScript/JavaScript files
$files = Get-ChildItem -Path . -Recurse -Include *.ts,*.tsx,*.js,*.jsx | Where-Object { $_.FullName -notmatch '(node_modules|build|dist|coverage)' }

foreach ($file in $files) {
    $totalFiles++
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $updated = $false
    
    # Update common patterns
    $patterns = @{
        'duration:\s*\d+(?!px)' = 'duration: 10'
        'timeout:\s*\d+' = 'timeout: 10'
        'delay:\s*\d+' = 'delay: 10'
        'size:\s*\d+' = 'size: 10'
        'maxItems:\s*\d+' = 'maxItems: 10'
        'limit:\s*\d+' = 'limit: 10'
        'capacity:\s*\d+' = 'capacity: 10'
        'defaultValue=\{\d+\}' = 'defaultValue={10}'
        'step=\{\d+\}' = 'step={10}'
        'min="\d+"' = 'min="10"'
        'max="\d+"' = 'max="10"'
        'between \d+ and \d+' = 'exactly 10'
        'Array length must be between \d+ and \d+' = 'Array length must be 10'
    }
    
    foreach ($pattern in $patterns.Keys) {
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $patterns[$pattern]
            $updated = $true
        }
    }
    
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $updatedFiles++
        Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "\n🎉 Complete!" -ForegroundColor Green
Write-Host "Files processed: $totalFiles" -ForegroundColor White
Write-Host "Files updated: $updatedFiles" -ForegroundColor White
Write-Host "\n🔟 Everything is now 10! 🔟" -ForegroundColor Magenta
