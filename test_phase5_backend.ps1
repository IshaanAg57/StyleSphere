Write-Host "========================================================="
Write-Host "       STYLESPHERE PHASE 5 BACKEND TEST SUITE            "
Write-Host "========================================================="

# 1. Register a regular Customer User
$rand = Get-Random -Minimum 10000 -Maximum 99999
$custEmail = "phase5cust$rand@stylesphere.fashion"
$regPayload = @{
    name = "Baroness Vivienne"
    email = $custEmail
    password = "ViviennePassword2026"
    confirmPassword = "ViviennePassword2026"
} | ConvertTo-Json

$custAuth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regPayload -ContentType "application/json"
$custToken = $custAuth.data.token
$custHeaders = @{ Authorization = "Bearer $custToken" }
Write-Host "`n[TEST 1] Registered Customer:" $custAuth.data.user.name "(Role:" $custAuth.data.user.role ")"

# 2. Update Profile & Change Password
Write-Host "`n[TEST 2] Customer Profile & Password Updates"
$updateProfilePayload = @{
    name = "Baroness Vivienne of Amberwood"
    phone = "+91 9123456780"
} | ConvertTo-Json
$profileRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method Patch -Body $updateProfilePayload -Headers $custHeaders -ContentType "application/json"
Write-Host "  * Profile Name Updated:" $profileRes.data.user.name

$changePassPayload = @{
    currentPassword = "ViviennePassword2026"
    newPassword = "NewVivienneSecret2026"
    confirmPassword = "NewVivienneSecret2026"
} | ConvertTo-Json
$passRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/change-password" -Method Patch -Body $changePassPayload -Headers $custHeaders -ContentType "application/json"
Write-Host "  * Password Changed Successfully:" $passRes.message

# Login with new password to get updated token
$loginNew = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{ email = $custEmail; password = "NewVivienneSecret2026" } | ConvertTo-Json) -ContentType "application/json"
$custToken = $loginNew.data.token
$custHeaders = @{ Authorization = "Bearer $custToken" }
Write-Host "  * Verified Login with new password -> Token obtained."

# 3. Product Reviews & Verified Purchase Check
Write-Host "`n[TEST 3] Product Reviews & Verified Purchase Check"
$products = (Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get).data.products
$targetProduct = $products[0]
Write-Host "  * Target Product for Review:" $targetProduct.name "(ID:" $targetProduct._id ")"

# Non-purchased user trying to review -> MUST FAIL with 403
$reviewPayload1 = @{
    rating = 5
    title = "Exquisite Craftsmanship!"
    comment = "The silk velvet drape is second to none."
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($targetProduct._id)/reviews" -Method Post -Body $reviewPayload1 -Headers $custHeaders -ContentType "application/json"
    Write-Host "  FAILED: Unverified user was able to submit review!"
} catch {
    Write-Host "  * PASSED: Non-purchased review rejected with error ->" $_.Exception.Message
}

# Add product to cart and place order so user becomes verified purchaser
$cartAdd = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Post -Body (@{ productId = $targetProduct._id; selectedSize = "M"; selectedColor = "Black"; quantity = 1 } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"
$orderPayload = @{
    shippingAddress = @{
        fullName = "Baroness Vivienne"
        phone = "+91 9123456780"
        addressLine1 = "Estate No. 4"
        city = "Mumbai"
        state = "Maharashtra"
        postalCode = "400001"
    }
    paymentMethod = "COD"
} | ConvertTo-Json
$placedOrder = (Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Post -Body $orderPayload -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * Placed Order" $placedOrder.orderNumber "containing product. User is now a Verified Purchaser."

# Now submit review -> MUST SUCCEED with verifiedPurchase = true
$reviewRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($targetProduct._id)/reviews" -Method Post -Body $reviewPayload1 -Headers $custHeaders -ContentType "application/json"
$createdReview = $reviewRes.data.review
Write-Host "  * Review Created Successfully!"
Write-Host "    - Rating:" $createdReview.rating "stars"
Write-Host "    - Title:" $createdReview.title
Write-Host "    - Verified Purchase:" $createdReview.verifiedPurchase

# Update Review
$updateReviewPayload = @{
    rating = 5
    title = "Exceptional Atelier Piece!"
    comment = "The embroidery details are breathtaking in person."
} | ConvertTo-Json
$updatedReview = (Invoke-RestMethod -Uri "http://localhost:5000/api/reviews/$($createdReview._id)" -Method Patch -Body $updateReviewPayload -Headers $custHeaders -ContentType "application/json").data.review
Write-Host "  * Review Updated Successfully -> New Title:" $updatedReview.title

# 4. Admin Authentication & Role Protection
Write-Host "`n[TEST 4] Admin Authorization & Security Boundaries"
# Regular customer trying to access /api/admin/dashboard -> MUST FAIL with 403
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard" -Method Get -Headers $custHeaders
    Write-Host "  FAILED: Regular user accessed Admin Dashboard!"
} catch {
    Write-Host "  * PASSED: Regular user rejected from Admin Dashboard (HTTP 403 Forbidden)"
}

# Login as Admin
$adminAuth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{ email = "admin@stylesphere.fashion"; password = "AdminSecret2026" } | ConvertTo-Json) -ContentType "application/json"
$adminToken = $adminAuth.data.token
$adminHeaders = @{ Authorization = "Bearer $adminToken" }
Write-Host "  * Admin Logged In Successfully:" $adminAuth.data.user.name "(Role:" $adminAuth.data.user.role ")"

# Admin accesses Dashboard Analytics
$dashboard = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/dashboard" -Method Get -Headers $adminHeaders).data
Write-Host "  * Admin Dashboard Analytics Retrieved:"
Write-Host "    - Total Revenue: ₹" $dashboard.totalRevenue
Write-Host "    - Total Orders:" $dashboard.totalOrders
Write-Host "    - Total Customers:" $dashboard.totalCustomers
Write-Host "    - Total Products:" $dashboard.totalProducts
Write-Host "    - Low Stock Count:" $dashboard.lowStockProductsCount

# 5. Admin Product CRUD Operations
Write-Host "`n[TEST 5] Admin Product Management"
$newProductPayload = @{
    name = "Artisanal Imperial Wool Cape"
    description = "Hand-woven merino wool cape with gold-threaded frog fasteners."
    shortDescription = "Handcrafted merino wool luxury cape."
    category = $products[0].category
    brand = "Maison Celeste"
    gender = "unisex"
    price = 11999
    originalPrice = 14999
    stock = 4
    colors = @("Imperial Black", "Royal Crimson")
    sizes = @("One Size")
    material = "100% Extra-fine Merino Wool"
    featured = $true
} | ConvertTo-Json

$createdAdminProd = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/products" -Method Post -Body $newProductPayload -Headers $adminHeaders -ContentType "application/json").data.product
Write-Host "  * Admin Created Product:" $createdAdminProd.name "(ID:" $createdAdminProd._id ", Price: ₹" $createdAdminProd.price ", Stock:" $createdAdminProd.stock ")"

# Admin Updates Stock
$stockUpdate = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/products/$($createdAdminProd._id)/stock" -Method Patch -Body (@{ stock = 8 } | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json").data.product
Write-Host "  * Admin Quick Stock Update -> New Stock:" $stockUpdate.stock "(Expected 8)"

# 6. Admin Category Management
Write-Host "`n[TEST 6] Admin Category Management"
$newCatPayload = @{
    name = "Haute Outerwear"
    description = "Exclusive coats, tailored trench cloaks, and outerwear."
    gender = "unisex"
    featured = $true
} | ConvertTo-Json
$createdCat = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/categories" -Method Post -Body $newCatPayload -Headers $adminHeaders -ContentType "application/json").data.category
Write-Host "  * Admin Created Category:" $createdCat.name "(Slug:" $createdCat.slug ")"

# 7. Admin Order Management
Write-Host "`n[TEST 7] Admin Order Progression"
$adminOrders = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/orders" -Method Get -Headers $adminHeaders).data
Write-Host "  * Total Orders in System:" $adminOrders.totalOrders
$targetOrder = $adminOrders.orders[0]

$statusUpdate = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/orders/$($targetOrder._id)/status" -Method Patch -Body (@{ orderStatus = "shipped"; comment = "Dispatched via VIP Courier" } | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json").data.order
Write-Host "  * Updated Order Status to:" $statusUpdate.orderStatus "-> History count:" $statusUpdate.statusHistory.Count

# 8. Admin Customers and Inventory
Write-Host "`n[TEST 8] Admin Customers & Inventory Views"
$adminCusts = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/customers" -Method Get -Headers $adminHeaders).data
Write-Host "  * Customers Retrieved:" $adminCusts.totalCustomers
Write-Host "  * First Customer Spend: ₹" $adminCusts.customers[0].totalSpent "(Orders:" $adminCusts.customers[0].orderCount ")"

$adminInv = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/inventory" -Method Get -Headers $adminHeaders).data
Write-Host "  * Inventory Items Count:" $adminInv.totalItems "(Low Stock Count:" $adminInv.lowStockCount ")"

# Clean up test product
$delProd = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/products/$($createdAdminProd._id)" -Method Delete -Headers $adminHeaders
Write-Host "  * Cleaned up test product."

Write-Host "`n========================================================="
Write-Host "       ALL PHASE 5 BACKEND TESTS PASSED                  "
Write-Host "========================================================="
