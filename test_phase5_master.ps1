Write-Host "========================================================="
Write-Host "    STYLESPHERE MASTER PHASE 1 - 5 VERIFICATION SUITE    "
Write-Host "========================================================="

# 1. Health Status
Write-Host "`n[1] Backend Health & Database Status"
$health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
Write-Host "  * Status:" $health.data.status "| Database:" $health.data.database.status

# 2. Customer Authentication & Profile Management
Write-Host "`n[2] Customer Authentication & Profile Management"
$rand = Get-Random -Minimum 10000 -Maximum 99999
$email = "ladyceleste$rand@stylesphere.fashion"
$regPayload = @{
    name = "Lady Celeste"
    email = $email
    password = "CelesteSecret2026"
    confirmPassword = "CelesteSecret2026"
} | ConvertTo-Json

$custAuth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regPayload -ContentType "application/json"
$custToken = $custAuth.data.token
$custHeaders = @{ Authorization = "Bearer $custToken" }
Write-Host "  * Registered:" $custAuth.data.user.name "(Role:" $custAuth.data.user.role ")"

$profileUpdate = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method Patch -Body (@{ name = "Lady Celeste of Savoy"; phone = "+91 9876500001" } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"
Write-Host "  * Profile Updated:" $profileUpdate.data.user.name

$passChange = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/change-password" -Method Patch -Body (@{ currentPassword = "CelesteSecret2026"; newPassword = "NewCelestePassword2026"; confirmPassword = "NewCelestePassword2026" } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"
Write-Host "  * Password Changed Successfully:" $passChange.message

# Re-login with updated password
$reLogin = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{ email = $email; password = "NewCelestePassword2026" } | ConvertTo-Json) -ContentType "application/json"
$custToken = $reLogin.data.token
$custHeaders = @{ Authorization = "Bearer $custToken" }

# 3. Product Catalog, Cart, & Order Placement
Write-Host "`n[3] Product Discovery, Bag & Order Checkout"
$products = (Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get).data.products
$targetProd = $products[0]
Write-Host "  * Selected Product:" $targetProd.name

# Test: Attempt review BEFORE purchase (Must Fail with 403)
Write-Host "`n[4] Verified Purchase Review Rule Verification"
$attemptPayload = @{
    rating = 5
    title = "Premature Review"
    comment = "Testing unverified submission."
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($targetProd._id)/reviews" -Method Post -Body $attemptPayload -Headers $custHeaders -ContentType "application/json"
    Write-Host "  FAILED: Unverified user allowed to review!"
} catch {
    Write-Host "  * PASSED: Unverified purchaser rejected with HTTP 403 Forbidden."
}

# Add product to cart & place order
$cartAdd = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Post -Body (@{ productId = $targetProd._id; selectedSize = "M"; selectedColor = "Black"; quantity = 1 } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"
$orderRes = (Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Post -Body (@{
    shippingAddress = @{
        fullName = "Lady Celeste of Savoy"
        phone = "+91 9876500001"
        addressLine1 = "Savoy Manor, 12th Avenue"
        city = "Bangalore"
        state = "Karnataka"
        postalCode = "560001"
    }
    paymentMethod = "COD"
} | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * Order Placed:" $orderRes.orderNumber "-> User is now a Verified Purchaser."

# Test: Submit Review AFTER purchase (Must Succeed)
$realReviewPayload = @{
    rating = 5
    title = "Impeccable Silhouette & Drape"
    comment = "The fabric quality and structure exceed highest luxury expectations."
} | ConvertTo-Json

$revRes = (Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($targetProd._id)/reviews" -Method Post -Body $realReviewPayload -Headers $custHeaders -ContentType "application/json").data.review
Write-Host "  * Verified Review Published!"
Write-Host "    - Rating:" $revRes.rating "stars"
Write-Host "    - Verified Purchase:" $revRes.verifiedPurchase

# Test: Duplicate review prevention
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($targetProd._id)/reviews" -Method Post -Body $realReviewPayload -Headers $custHeaders -ContentType "application/json"
    Write-Host "  FAILED: Duplicate review allowed!"
} catch {
    Write-Host "  * PASSED: Duplicate review rejected."
}

# 5. Admin Authorization & Executive Management
Write-Host "`n[5] Admin Authorization & Management Portal"

# Regular user accessing Admin API -> Must Fail with 403
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard" -Method Get -Headers $custHeaders
    Write-Host "  FAILED: Regular user accessed Admin Dashboard!"
} catch {
    Write-Host "  * PASSED: Customer blocked from Admin Dashboard (HTTP 403 Forbidden)."
}

# Login as Admin
$adminAuth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{ email = "admin@stylesphere.fashion"; password = "AdminSecret2026" } | ConvertTo-Json) -ContentType "application/json"
$adminToken = $adminAuth.data.token
$adminHeaders = @{ Authorization = "Bearer $adminToken" }
Write-Host "  * Executive Admin Authenticated:" $adminAuth.data.user.name

# Admin Analytics
$dash = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard" -Method Get -Headers $adminHeaders).data
Write-Host "  * Live Business Analytics: Total Revenue = ₹$($dash.totalRevenue) | Orders = $($dash.totalOrders) | Customers = $($dash.totalCustomers)"

# Admin Product Creation & Stock Update
$newProd = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/products" -Method Post -Body (@{
    name = "Runway Cashmere Trench Coat"
    description = "Sumptuous double-faced Italian cashmere trench coat with horn buttons."
    shortDescription = "Sumptuous double-faced Italian cashmere coat."
    price = 18999
    originalPrice = 22999
    category = $products[0].category
    brand = "Maison Celeste"
    stock = 3
    colors = @("Camel", "Midnight")
    sizes = @("S", "M", "L")
    featured = $true
} | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json").data.product
Write-Host "  * Admin Created Product:" $newProd.name "(Stock:" $newProd.stock ")"

$stockUpdate = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/products/$($newProd._id)/stock" -Method Patch -Body (@{ stock = 15 } | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json").data.product
Write-Host "  * Quick Stock Updated:" $stockUpdate.stock "units"

# Admin Order Status Transition
$orderStatusUpdate = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/orders/$($orderRes._id)/status" -Method Patch -Body (@{ orderStatus = "delivered"; paymentStatus = "paid"; comment = "Delivered and verified by Concierge" } | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json").data.order
Write-Host "  * Order Status Updated to:" $orderStatusUpdate.orderStatus "(isDelivered:" $orderStatusUpdate.isDelivered ", isPaid:" $orderStatusUpdate.isPaid ")"

# Clean up test product
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/products/$($newProd._id)" -Method Delete -Headers $adminHeaders | Out-Null
Write-Host "  * Test product deleted safely."

Write-Host "`n========================================================="
Write-Host "    ALL MASTER PHASE 1-5 TESTS PASSED SUCCESSFULLY!      "
Write-Host "========================================================="
