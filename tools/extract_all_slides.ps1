$pptApp = New-Object -ComObject PowerPoint.Application
$pptPath = "C:\Users\HP\.gemini\antigravity\brain\c5008090-f3e0-42b0-a5b8-b3a0c1815e08\scratch\db_lec2.ppt"
$pres = $pptApp.Presentations.Open($pptPath, 2, 0, 0)

$slidesData = @()

for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $s = $pres.Slides.Item($i)
    $title = ""
    $lines = @()
    
    foreach ($shape in $s.Shapes) {
        if ($shape.HasTextFrame) {
            $textRange = $shape.TextFrame.TextRange
            for ($p = 1; $p -le $textRange.Paragraphs().Count; $p++) {
                $line = $textRange.Paragraphs($p).Text.Trim()
                if ($line) {
                    $lines += $line
                }
            }
        }
    }
    
    if ($lines.Count -gt 0) {
        $title = $lines[0]
    }
    
    $slideObj = [PSCustomObject]@{
        num = $i
        title = $title
        content = $lines
    }
    $slidesData += $slideObj
}

$pres.Close()
$pptApp.Quit()

$json = $slidesData | ConvertTo-Json -Depth 5
$json | Out-File -FilePath "tools/exact_slides_text.json" -Encoding utf8
Write-Output "Extracted all $($slidesData.Count) slides successfully!"
