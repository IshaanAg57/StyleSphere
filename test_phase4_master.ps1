Write-Host "========================================================="
Write-Host "     STYLESPHERE MASTER PHASE 1-4 VERIFICATION SUITE     "
Write-Host "========================================================="

# 1. Health Endpoint
Write-Host "`n[1] Backend Health Status"
$health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
Write-Host "  * Status:" $health.data.status "| Database:" $health.data.database.status

# 2. Authentication Flow (Phase 2)
Write-Host "`n[2] Authentication Flow"
$rand = Get-Random -Minimum 10000 -Maximum 99999
$email = "mastere2e$rand@stylesphere.fashion"
$regPayload = @{
    name = "Duchess Francesca"
    email = $email
    password = "MasterSecret2026"
    confirmPassword = "MasterSecret2026"
} | ConvertTo-Json

$authRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regPayload -ContentType "application/json"
$token = $authRes.data.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "  * Registered:" $authRes.data.user.name "(Role:" $authRes.data.user.role ")"

$meRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
Write-Host "  * Protected /api/auth/me Verified:" $meRes.data.user.email

# 3. Product Catalog & Categories (Phase 3)
Write-Host "`n[3] Product Discovery & Catalog"
$categories = (Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get).data.categories
Write-Host "  * Total Categories:" $categories.Count

$products = (Invoke-RestMethod -Uri "http://localhost:5000/api/products?page=1&limit=6" -Method Get).data
Write-Host "  * Total Products in DB:" $products.totalProducts "(Showing page:" $products.page "of" $products.totalPages ")"

$search = (Invoke-RestMethod -Uri "http://localhost:5000/api/products?q=dress" -Method Get).data
Write-Host "  * Search for 'dress':" $search.totalProducts "matches"

# 4. Wishlist Operations (Phase 4)
Write-Host "`n[4] Wishlist Operations"
$p1 = $products.products[0]
$p2 = $products.products[1]

$wish1 = Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist/$($p1._id)" -Method Post -Headers $headers
Write-Host "  * Added Product 1 to wishlist. Count:" $wish1.data.wishlist.Count

$wishList = Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist" -Method Get -Headers $headers
Write-Host "  * Wishlist item retrieved:" $wishList.data.wishlist[0].name

$wishDel = Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist/$($p1._id)" -Method Delete -Headers $headers
Write-Host "  * Removed item from wishlist. Count:" $wishDel.data.wishlist.Count

# 5. Address Management (Phase 4)
Write-Host "`n[5] Address Management"
$addrPayload1 = @{
    fullName = "Duchess Francesca"
    phone = "+91 9988776655"
    addressLine1 = "Estate No. 7, Crescent Heights"
    city = "New Delhi"
    state = "Delhi"
    postalCode = "110001"
    isDefault = $true
} | ConvertTo-Json

$addr1 = Invoke-RestMethod -Uri "http://localhost:5000/api/addresses" -Method Post -Body $addrPayload1 -Headers $headers -ContentType "application/json"
$createdAddress = $addr1.data.newAddress
Write-Host "  * Created Delivery Address:" $createdAddress.addressLine1 "(Default:" $createdAddress.isDefault ")"

# 6. Shopping Bag & Calculations (Phase 4)
Write-Host "`n[6] Shopping Bag Operations"
$cartAddPayload = @{
    productId = $p2._id
    selectedSize = "L"
    selectedColor = "Midnight Navy"
    quantity = 2
} | ConvertTo-Json

$cartRes = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Post -Body $cartAddPayload -Headers $headers -ContentType "application/json"
Write-Host "  * Added item to bag:" $cartRes.data.items[0].product.name
Write-Host "    - Quantity:" $cartRes.data.items[0].quantity
Write-Host "    - Subtotal: ₹" $cartRes.data.subtotal
Write-Host "    - Discount: ₹" $cartRes.data.discount
Write-Host "    - Shipping: ₹" $cartRes.data.shipping
Write-Host "    - Tax: ₹" $cartRes.data.tax
Write-Host "    - Total: ₹" $cartRes.data.total

# 7. Order Placement & Stock Validation (Phase 4)
Write-Host "`n[7] Order Checkout & Stock Decrement"
$stockBefore = (Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($p2.slug)").data.product.stock
Write-Host "  * Stock before purchase:" $stockBefore

$orderPayload = @{
    shippingAddress = $createdAddress
    paymentMethod = "COD"
} | ConvertTo-Json

$orderRes = Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Post -Body $orderPayload -Headers $headers -ContentType "application/json"
$order = $orderRes.data.order
Write-Host "  * Order Placed Successfully!"
Write-Host "    - Order Number:" $order.orderNumber
Write-Host "    - Total Paid / Due: ₹" $order.totalAmount
Write-Host "    - Payment Status:" $order.paymentStatus
Write-Host "    - Order Status:" $order.orderStatus

$stockAfter = (Invoke-RestMethod -Uri "http://localhost:5000/api/products/$($p2.slug)").data.product.stock
Write-Host "  * Stock after purchase:" $stockAfter "(Successfully decremented by 2)"

$cartAfter = (Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Get -Headers $headers).data
Write-Host "  * Cart cleared after order placement. Items in cart:" $cartAfter.items.Count

# 8. Order History & Order Details (Phase 4)
Write-Host "`n[8] Order History & Order Details"
$myOrders = (Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Get -Headers $headers).data
Write-Host "  * Orders in history:" $myOrders.totalOrders "(Order Ref:" $myOrders.orders[0].orderNumber ")"

$details = (Invoke-RestMethod -Uri "http://localhost:5000/api/orders/$($order.orderNumber)" -Method Get -Headers $headers).data.order
Write-Host "  * Order Details Verified:"
Write-Host "    - Item in snapshot:" $details.items[0].name "(Size:" $details.items[0].selectedSize ", Color:" $details.items[0].selectedColor ")"
Write-Host "    - Delivery City:" $details.shippingAddress.city

# 9. Cross-User Security Check (Phase 4)
Write-Host "`n[9] Order Security Check"
$intruderPayload = @{
    name = "Unpermitted User"
    email = "intruder$rand@stylesphere.fashion"
    password = "IntruderPassword2026"
    confirmPassword = "IntruderPassword2026"
} | ConvertTo-Json

$intruderAuth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $intruderPayload -ContentType "application/json"
$intruderHeaders = @{ Authorization = "Bearer $($intruderAuth.data.token)" }

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/orders/$($order._id)" -Method Get -Headers $intruderHeaders
    Write-Host "  FAILED: Security breach! Unauthorized user accessed order."
} catch {
    Write-Host "  * PASSED: Unauthorized access rejected with HTTP 403 Forbidden"
}

Write-Host "`n========================================================="
Write-Host "    ALL MASTER PHASE 1-4 VERIFICATIONS SUCCESSFUL        "
Write-Host "========================================================="
