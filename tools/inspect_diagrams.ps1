$pptPath = (Resolve-Path "materials\db_lec3.ppt").Path
$pptApp = New-Object -ComObject PowerPoint.Application
$pres = $pptApp.Presentations.Open($pptPath, 2, 0, 0)

$diagramSlideNums = @(7, 9, 10, 13, 15, 17, 19, 20, 25, 28, 32)

foreach ($num in $diagramSlideNums) {
    $s = $pres.Slides.Item($num)
    Write-Host "`n================== SLIDE $num =================="
    Write-Host "Shape count: $($s.Shapes.Count)"
    for ($j = 1; $j -le $s.Shapes.Count; $j++) {
        $sh = $s.Shapes.Item($j)
        $t = ""
        if ($sh.HasTextFrame) {
            $t = $sh.TextFrame.TextRange.Text.Trim()
        }
        Write-Host "  Shape $($j): Type=$($sh.Type), Name='$($sh.Name)', Text='$t'"
    }
}

$pres.Close()
$pptApp.Quit()
