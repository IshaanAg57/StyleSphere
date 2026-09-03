Write-Host "--- 1. Testing Health Check ---"
$health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
$health | ConvertTo-Json -Depth 3

Write-Host "`n--- 2. Testing User Registration ---"
$rand = Get-Random -Minimum 1000 -Maximum 9999
$email = "tastemaker$rand@stylesphere.fashion"
$regBody = @{
    name = "Lady Eleanor"
    email = $email
    password = "SecretPassword123"
    confirmPassword = "SecretPassword123"
} | ConvertTo-Json

$regRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
$regRes | ConvertTo-Json -Depth 3
$token = $regRes.data.token

Write-Host "`n--- 3. Testing Duplicate Registration ---"
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
} catch {
    Write-Host "Caught expected duplicate error: $($_.Exception.Message)"
}

Write-Host "`n--- 4. Testing User Login ---"
$loginBody = @{
    email = $email
    password = "SecretPassword123"
} | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$loginRes | ConvertTo-Json -Depth 3

Write-Host "`n--- 5. Testing Invalid Login ---"
$badLoginBody = @{
    email = $email
    password = "WrongPassword999"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $badLoginBody -ContentType "application/json"
} catch {
    Write-Host "Caught expected invalid credential error: $($_.Exception.Message)"
}

Write-Host "`n--- 6. Testing GET /api/auth/me with Bearer Token ---"
$headers = @{
    Authorization = "Bearer $token"
}
$meRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
$meRes | ConvertTo-Json -Depth 3

Write-Host "`n--- 7. Testing GET /api/auth/me without Token ---"
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get
} catch {
    Write-Host "Caught expected missing token error: $($_.Exception.Message)"
}
