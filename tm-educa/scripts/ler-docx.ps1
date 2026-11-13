param(
    [string]$DocxPath,
    [string]$OutPath
)

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($DocxPath)
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = [xml]$reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

# Extrair parágrafos
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$nodes = $xml.SelectNodes('//w:p', $ns)
$lines = @()
foreach ($p in $nodes) {
    $text = $p.InnerText.Trim()
    if ($text) {
        $lines += $text
    }
}
$lines | Out-File -FilePath $OutPath -Encoding utf8
Write-Output "Salvo em: $OutPath ($($lines.Count) linhas)"

