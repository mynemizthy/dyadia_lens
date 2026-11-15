Add-Type -AssemblyName System.Drawing

$baseDir = Split-Path -Parent $PSScriptRoot
$blogDir = Join-Path $baseDir "public\images\blogs"

$blogs = @(
    @{ File = (Join-Path $blogDir "blog_01_chon_do_can.jpg"); Out = (Join-Path $blogDir "blog_01_banner.jpg"); FaceOffset = 0 },
    @{ File = (Join-Path $blogDir "blog_02_silicone_hydrogel.jpg"); Out = (Join-Path $blogDir "blog_02_banner.jpg"); FaceOffset = 0 },
    @{ File = (Join-Path $blogDir "blog_03_clean_girl_lens.jpg"); Out = (Join-Path $blogDir "blog_03_banner.jpg"); FaceOffset = 20 },
    @{ File = (Join-Path $blogDir "blog_04_ve_sinh_bao_quan.jpg"); Out = (Join-Path $blogDir "blog_04_banner.jpg"); FaceOffset = 0 },
    @{ File = (Join-Path $blogDir "blog_05_mat_nhay_cam.jpg"); Out = (Join-Path $blogDir "blog_05_banner.jpg"); FaceOffset = 0 },
    @{ File = (Join-Path $blogDir "blog_06_chuan_bi_lan_dau.jpg"); Out = (Join-Path $blogDir "blog_06_banner.jpg"); FaceOffset = 0 }
)

$targetW = 1200
$targetH = 675

foreach ($b in $blogs) {
    if (-not (Test-Path $b.File)) { continue }

    $srcImg = [System.Drawing.Image]::FromFile($b.File)
    $destBmp = New-Object System.Drawing.Bitmap $targetW, $targetH
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # 1. Background: Draw full canvas ambient fill from source image
    $g.DrawImage($srcImg, 0, 0, $targetW, $targetH)

    # 2. Draw frosted glass semi-transparent layer
    $washBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(110, 255, 250, 252))
    $g.FillRectangle($washBrush, 0, 0, $targetW, $targetH)
    $washBrush.Dispose()

    # 3. Calculate centered foreground portrait
    $scale = $targetH / $srcImg.Height
    $scaledW = [int]($srcImg.Width * $scale)
    $scaledH = $targetH
    $posX = [int](($targetW - $scaledW) / 2)
    $posY = [int]$b.FaceOffset

    # Draw centered crisp subject
    $g.DrawImage($srcImg, $posX, $posY, $scaledW, $scaledH)

    # 4. Soft edge feathers
    $featherW = 40
    $pt1 = New-Object System.Drawing.Point ($posX - 5), 0
    $pt2 = New-Object System.Drawing.Point ($posX + $featherW), 0
    $c1 = [System.Drawing.Color]::FromArgb(120, 255, 250, 252)
    $c2 = [System.Drawing.Color]::FromArgb(0, 255, 250, 252)
    $leftGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $pt1, $pt2, $c1, $c2
    $g.FillRectangle($leftGrad, ($posX - 5), 0, ($featherW + 5), $targetH)
    $leftGrad.Dispose()

    $pt3 = New-Object System.Drawing.Point ($posX + $scaledW - $featherW), 0
    $pt4 = New-Object System.Drawing.Point ($posX + $scaledW + 5), 0
    $rightGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $pt3, $pt4, $c2, $c1
    $g.FillRectangle($rightGrad, ($posX + $scaledW - $featherW), 0, ($featherW + 5), $targetH)
    $rightGrad.Dispose()

    # Save output
    $destBmp.Save($b.Out, [System.Drawing.Imaging.ImageFormat]::Jpeg)

    $g.Dispose()
    $destBmp.Dispose()
    $srcImg.Dispose()
    Write-Output "Generated banner: $($b.Out)"
}
