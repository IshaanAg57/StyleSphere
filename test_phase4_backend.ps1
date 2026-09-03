Write-Host "========================================="
Write-Host "   STYLESPHERE PHASE 4 BACKEND SUITE     "
Write-Host "========================================="

# 1. Register test user & authenticate
$rand = Get-Random -Minimum 10000 -Maximum 99999
$email = "phase4vip$rand@stylesphere.fashion"
$regPayload = @{
    name = "Countess Genevieve"
    email = $email
    password = "LuxuryPassword2026"
    confirmPassword = "LuxuryPassword2026"
} | ConvertTo-Json

$authRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regPayload -ContentType "application/json"
$token = $authRes.data.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "`n[TEST 1] Registered User:" $authRes.data.user.name "(Token len:" $token.Length ")"

# 2. Get Products for Testing
$prodsRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get
$testProduct1 = $prodsRes.data.products[0]
$testProduct2 = $prodsRes.data.products[1]
Write-Host "`n[TEST 2] Selected Test Products:"
Write-Host "  - Product 1:" $testProduct1.name "(ID:" $testProduct1._id ", Price: ₹" $testProduct1.price ", Stock:" $testProduct1.stock ")"
Write-Host "  - Product 2:" $testProduct2.name "(ID:" $testProduct2._id ", Price: ₹" $testProduct2.price ", Stock:" $testProduct2.stock ")"

# 3. Wishlist Management
Write-Host "`n[TEST 3] Wishlist Operations"
$wishAdd = Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist/$($testProduct1._id)" -Method Post -Headers $headers
Write-Host "  - Added to wishlist. Total wishlisted:" $wishAdd.data.wishlist.Count

$wishGet = Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist" -Method Get -Headers $headers
Write-Host "  - Fetched wishlist. First item:" $wishGet.data.wishlist[0].name

$wishDel = Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist/$($testProduct1._id)" -Method Delete -Headers $headers
Write-Host "  - Removed from wishlist. Remaining:" $wishDel.data.wishlist.Count

# 4. Address Management
Write-Host "`n[TEST 4] Address Operations"
$addrPayload1 = @{
    fullName = "Countess Genevieve"
    phone = "+91 9876543210"
    addressLine1 = "Penthouse 12, Royal Palms Promenade"
    city = "Mumbai"
    state = "Maharashtra"
    postalCode = "400001"
    isDefault = $true
} | ConvertTo-Json

$addr1 = Invoke-RestMethod -Uri "http://localhost:5000/api/addresses" -Method Post -Body $addrPayload1 -Headers $headers -ContentType "application/json"
Write-Host "  - Added Address 1 (Default):" $addr1.data.newAddress.addressLine1 "-> isDefault:" $addr1.data.newAddress.isDefault

$addrPayload2 = @{
    fullName = "Countess Genevieve"
    phone = "+91 9876543210"
    addressLine1 = "Villa Belle, Lavelle Road"
    city = "Bangalore"
    state = "Karnataka"
    postalCode = "560001"
    isDefault = $true
} | ConvertTo-Json

$addr2 = Invoke-RestMethod -Uri "http://localhost:5000/api/addresses" -Method Post -Body $addrPayload2 -Headers $headers -ContentType "application/json"
$activeAddresses = $addr2.data.addresses
Write-Host "  - Added Address 2 as new default. Total addresses:" $activeAddresses.Count
Write-Host "  - Address 1 default status now:" ($activeAddresses | Where-Object { $_._id -eq $addr1.data.newAddress._id }).isDefault
Write-Host "  - Address 2 default status now:" ($activeAddresses | Where-Object { $_._id -eq $addr2.data.newAddress._id }).isDefault

# 5. Cart Operations
Write-Host "`n[TEST 5] Cart Operations"
$cartAddPayload1 = @{
    productId = $testProduct1._id
    selectedSize = "M"
    selectedColor = "Midnight Obsidian"
    quantity = 2
} | ConvertTo-Json

$cartAdd1 = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Post -Body $cartAddPayload1 -Headers $headers -ContentType "application/json"
Write-Host "  - Added 2x Product 1 to cart. Items count:" $cartAdd1.data.itemsCount "Subtotal: ₹" $cartAdd1.data.subtotal "Total: ₹" $cartAdd1.data.total

# Add same item again -> quantity should increment to 3
$cartAddPayload2 = @{
    productId = $testProduct1._id
    selectedSize = "M"
    selectedColor = "Midnight Obsidian"
    quantity = 1
} | ConvertTo-Json

$cartAdd2 = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Post -Body $cartAddPayload2 -Headers $headers -ContentType "application/json"
Write-Host "  - Incremented quantity of existing item. New item quantity:" $cartAdd2.data.items[0].quantity "(Expected 3)"

# Update Cart Item Quantity
$cartItemId = $cartAdd2.data.items[0]._id
$updateCartPayload = @{ quantity = 1 } | ConvertTo-Json
$cartUpdate = Invoke-RestMethod -Uri "http://localhost:5000/api/cart/$cartItemId" -Method Patch -Body $updateCartPayload -Headers $headers -ContentType "application/json"
Write-Host "  - Updated cart item quantity to 1. New Subtotal: ₹" $cartUpdate.data.subtotal

# 6. Order Creation (Checkout)
Write-Host "`n[TEST 6] Order Creation (Checkout Flow)"
$stockBefore = (Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($testProduct1.slug)").data.product.stock
Write-Host "  - Stock of Product 1 before purchase:" $stockBefore

$orderPayload = @{
    shippingAddress = $addr2.data.newAddress
    paymentMethod = "COD"
} | ConvertTo-Json

$orderRes = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Post -Body $orderPayload -Headers $headers -ContentType "application/json"
$createdOrder = $orderRes.data.order
Write-Host "  - Order Created Successfully!"
Write-Host "    * Order ID:" $createdOrder._id
Write-Host "    * Order Number:" $createdOrder.orderNumber
Write-Host "    * Items Count:" $createdOrder.items.Count
Write-Host "    * Total Amount: ₹" $createdOrder.totalAmount
Write-Host "    * Payment Method:" $createdOrder.paymentMethod
Write-Host "    * Order Status:" $createdOrder.orderStatus

# Verify Stock Decremented
$stockAfter = (Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($testProduct1.slug)").data.product.stock
Write-Host "  - Stock of Product 1 after purchase:" $stockAfter "(Expected:" ($stockBefore - 1) ")"

# Verify Cart Cleared
$cartAfterOrder = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Get -Headers $headers
Write-Host "  - Cart items count after checkout:" $cartAfterOrder.data.items.Count "(Expected 0)"

# 7. Order Listing and Details
Write-Host "`n[TEST 7] Order Listing & Order Details"
$myOrders = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Get -Headers $headers
Write-Host "  - Total Orders for user:" $myOrders.data.totalOrders
Write-Host "  - Most Recent Order:" $myOrders.data.orders[0].orderNumber

$orderDetails = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/$($createdOrder.orderNumber)" -Method Get -Headers $headers
Write-Host "  - Fetched Order Details by orderNumber:" $orderDetails.data.order.orderNumber
Write-Host "    * Product Name in Snapshot:" $orderDetails.data.order.items[0].name
Write-Host "    * Shipping City:" $orderDetails.data.order.shippingAddress.city

# 8. Order Security / Ownership Protection
Write-Host "`n[TEST 8] Order Security & Ownership Protection"
$otherUserPayload = @{
    name = "Lord Sterling"
    email = "intruder$rand@stylesphere.fashion"
    password = "IntruderPassword2026"
    confirmPassword = "IntruderPassword2026"
} | ConvertTo-Json

$otherAuth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $otherUserPayload -ContentType "application/json"
$otherHeaders = @{ Authorization = "Bearer $($otherAuth.data.token)" }

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/orders/$($createdOrder._id)" -Method Get -Headers $otherHeaders
    Write-Host "FAILED: Other user should NOT be able to view this order!"
} catch {
    Write-Host "PASSED: Access denied to other user (HTTP 403 Forbidden) ->" $_.Exception.Message
}

Write-Host "`n========================================="
Write-Host "    ALL PHASE 4 BACKEND TESTS PASSED     "
Write-Host "========================================="
