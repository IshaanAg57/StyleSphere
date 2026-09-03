Write-Host "========================================="
Write-Host "  STYLESPHERE PHASE 2 AUTH TEST SUITE   "
Write-Host "========================================="

# 1. Health Check
Write-Host "`n[TEST 1] GET /api/health"
$health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
Write-Host "Service Status:" $health.data.status
Write-Host "Database Status:" $health.data.database.status
Write-Host "Database Name:" $health.data.database.name

# 2. Register with Missing Fields (should fail 400)
Write-Host "`n[TEST 2] Register with Missing Fields"
try {
    $badBody = @{ name = "Incomplete User" } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $badBody -ContentType "application/json"
    Write-Host "FAILED: Expected 400 error"
} catch {
    Write-Host "PASSED: Rejected with error ->" $_.Exception.Message
}

# 3. Register with Invalid Email (should fail 400)
Write-Host "`n[TEST 3] Register with Invalid Email"
try {
    $badEmailBody = @{ name = "John Doe"; email = "invalid-email-format"; password = "password123"; confirmPassword = "password123" } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $badEmailBody -ContentType "application/json"
    Write-Host "FAILED: Expected 400 error"
} catch {
    Write-Host "PASSED: Rejected with error ->" $_.Exception.Message
}

# 4. Register with Password Mismatch (should fail 400)
Write-Host "`n[TEST 4] Register with Password Mismatch"
try {
    $mismatchBody = @{ name = "John Doe"; email = "john@example.com"; password = "password123"; confirmPassword = "differentPassword" } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $mismatchBody -ContentType "application/json"
    Write-Host "FAILED: Expected 400 error"
} catch {
    Write-Host "PASSED: Rejected with error ->" $_.Exception.Message
}

# 5. Register with Valid Credentials (should succeed 201)
$rand = Get-Random -Minimum 1000 -Maximum 9999
$testEmail = "tastemaker$rand@stylesphere.fashion"
Write-Host "`n[TEST 5] Register Valid User ($testEmail)"
$regBody = @{
    name = "Lady Eleanor Vance"
    email = $testEmail
    password = "VanceSecretPassword2026"
    confirmPassword = "VanceSecretPassword2026"
} | ConvertTo-Json

$regRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
Write-Host "Registration Success:" $regRes.success
Write-Host "User ID:" $regRes.data.user._id
Write-Host "User Name:" $regRes.data.user.name
Write-Host "User Email:" $regRes.data.user.email
Write-Host "Assigned Role:" $regRes.data.user.role
Write-Host "Token Received (Length):" $regRes.data.token.Length
Write-Host "Password field exposed in response?:" ($null -ne $regRes.data.user.password)

$token = $regRes.data.token

# 6. Duplicate Email Registration (should fail 400)
Write-Host "`n[TEST 6] Duplicate Email Registration"
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "FAILED: Expected duplicate 400 error"
} catch {
    Write-Host "PASSED: Duplicate rejected with error ->" $_.Exception.Message
}

# 7. Login with Valid Credentials (should succeed 200)
Write-Host "`n[TEST 7] Login with Valid Credentials"
$loginBody = @{
    email = $testEmail
    password = "VanceSecretPassword2026"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "Login Success:" $loginRes.success
Write-Host "Logged In User:" $loginRes.data.user.name
Write-Host "Token Returned:" ($null -ne $loginRes.data.token)

# 8. Login with Invalid Password (should fail 401)
Write-Host "`n[TEST 8] Login with Incorrect Password"
try {
    $badLoginBody = @{ email = $testEmail; password = "WrongPassword999" } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $badLoginBody -ContentType "application/json"
    Write-Host "FAILED: Expected 401 error"
} catch {
    Write-Host "PASSED: Invalid login rejected with error ->" $_.Exception.Message
}

# 9. GET /api/auth/me with Valid Bearer JWT (should succeed 200)
Write-Host "`n[TEST 9] GET /api/auth/me with Valid Token"
$headers = @{ Authorization = "Bearer $token" }
$meRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
Write-Host "Profile Fetch Success:" $meRes.success
Write-Host "Profile Name:" $meRes.data.user.name
Write-Host "Profile Role:" $meRes.data.user.role
Write-Host "Password exposed in profile?:" ($null -ne $meRes.data.user.password)

# 10. GET /api/auth/me without Token (should fail 401)
Write-Host "`n[TEST 10] GET /api/auth/me without Token"
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get
    Write-Host "FAILED: Expected 401 error"
} catch {
    Write-Host "PASSED: Missing token rejected with error ->" $_.Exception.Message
}

# 11. GET /api/auth/me with Invalid Token (should fail 401)
Write-Host "`n[TEST 11] GET /api/auth/me with Invalid Token"
try {
    $badHeaders = @{ Authorization = "Bearer invalid_gibberish_token_123" }
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $badHeaders
    Write-Host "FAILED: Expected 401 error"
} catch {
    Write-Host "PASSED: Invalid token rejected with error ->" $_.Exception.Message
}

Write-Host "`n========================================="
Write-Host "       ALL BACKEND TESTS COMPLETE        "
Write-Host "========================================="
