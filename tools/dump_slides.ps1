$pptApp = New-Object -ComObject PowerPoint.Application
$pptPath = (Resolve-Path "materials\db_lec2.ppt").Path
$pres = $pptApp.Presentations.Open($pptPath, 2, 0, 0)
$outFile = "tools/db_lec2_slides_text.txt"
$results = @()
for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $s = $pres.Slides.Item($i)
    $texts = @()
    foreach ($shape in $s.Shapes) {
        if ($shape.HasTextFrame) {
            $t = $shape.TextFrame.TextRange.Text.Trim()
            if ($t) { $texts += $t }
        }
    }
    $results += "=== SLIDE $i ==="
    $results += ($texts -join "`n---`n")
    $results += ""
}
$results | Out-File -FilePath $outFile -Encoding utf8
$pres.Close()
$pptApp.Quit()
Write-Output "Extracted slides text to $outFile"
