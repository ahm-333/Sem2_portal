$pptPath = (Resolve-Path "materials\db_lec3.ppt").Path
$outputDir = (Resolve-Path "materials\slides").Path + "\db-lec3"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$pptApp = New-Object -ComObject PowerPoint.Application
$pres = $pptApp.Presentations.Open($pptPath, 2, 0, 0)

$slidesData = @()
$totalSlides = $pres.Slides.Count
Write-Host "Total slides in db_lec3.ppt: $totalSlides"

for ($i = 1; $i -le $totalSlides; $i++) {
    $s = $pres.Slides.Item($i)
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
    
    $title = if ($lines.Count -gt 0) { $lines[0] } else { "Slide $i" }
    
    # Export slide image
    $imgFile = "$outputDir\slide_$i.png"
    $s.Export($imgFile, "PNG", 1920, 1080)
    
    $slideObj = [PSCustomObject]@{
        num = $i
        title = $title
        content = $lines
        imagePath = "materials/slides/db-lec3/slide_$i.png"
    }
    $slidesData += $slideObj
    Write-Host "Processed slide $i of $totalSlides"
}

$pres.Close()
$pptApp.Quit()

$json = $slidesData | ConvertTo-Json -Depth 5
$json | Out-File -FilePath "tools/exact_slides_text_db_lec3.json" -Encoding utf8
Write-Host "Extracted all $totalSlides slides and saved to tools/exact_slides_text_db_lec3.json"
