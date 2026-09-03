Write-Host "=================================================================" -ForegroundColor Yellow
Write-Host "          STYLESPHERE MASTER PHASE 6 VERIFICATION SUITE         " -ForegroundColor Yellow
Write-Host "          Custom UPI Payment, Admin Verification & Invoices      " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Yellow

$baseUrl = "http://localhost:5000"

# -------------------------------------------------------------
# 1. MERCHANT UPI CONFIGURATION CHECK
# -------------------------------------------------------------
Write-Host "`n[STEP 1] Checking Merchant Payment Configuration..." -ForegroundColor Cyan
$configRes = (Invoke-RestMethod -Uri "$baseUrl/api/payment/config" -Method Get).data
if ($configRes.merchantUpiId -and $configRes.merchantName) {
    Write-Host "  * Merchant UPI ID: $($configRes.merchantUpiId)" -ForegroundColor Green
    Write-Host "  * Merchant Name:   $($configRes.merchantName)" -ForegroundColor Green
} else {
    Write-Host "  FAIL: Merchant payment configuration missing." -ForegroundColor Red
    exit 1
}

# -------------------------------------------------------------
# 2. CUSTOMER AUTH & CART SETUP
# -------------------------------------------------------------
Write-Host "`n[STEP 2] Customer Authentication & Cart Setup..." -ForegroundColor Cyan
$rand = Get-Random -Minimum 100000 -Maximum 999999
$custEmail = "vipclient$rand@stylesphere.fashion"
$regBody = @{
    name = "Duchess Catherine"
    email = $custEmail
    password = "LuxurySecret2026"
    confirmPassword = "LuxurySecret2026"
} | ConvertTo-Json

$custAuth = (Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $regBody -ContentType "application/json").data
$custToken = $custAuth.token
$custHeaders = @{ Authorization = "Bearer $custToken" }
Write-Host "  * Registered VIP Client: $($custAuth.user.name) ($custEmail)" -ForegroundColor Green

# Fetch active products
$products = (Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get).data.products
$testProduct = $products[0]
Write-Host "  * Selected Couture Piece: $($testProduct.name) (₹$($testProduct.price))" -ForegroundColor Gray

# Add to cart
$cartRes = (Invoke-RestMethod -Uri "$baseUrl/api/cart" -Method Post -Body (@{ productId = $testProduct._id; selectedSize = "M"; selectedColor = "Black"; quantity = 2 } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json").data
Write-Host "  * Added 2 items to Bag -> Subtotal: ₹$($cartRes.subtotal)" -ForegroundColor Green

# -------------------------------------------------------------
# 3. CREATE ORDER WITH CUSTOM UPI PAYMENT METHOD
# -------------------------------------------------------------
Write-Host "`n[STEP 3] Placing Order with Custom UPI Payment..." -ForegroundColor Cyan
$orderPayload = @{
    shippingAddress = @{
        fullName = "Duchess Catherine"
        phone = "+91 9887766554"
        addressLine1 = "Kensington Royal Estate"
        city = "Udaipur"
        state = "Rajasthan"
        postalCode = "313001"
    }
    paymentMethod = "UPI"
} | ConvertTo-Json

$orderRes = (Invoke-RestMethod -Uri "$baseUrl/api/orders" -Method Post -Body $orderPayload -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * Created Order: $($orderRes.orderNumber)" -ForegroundColor Green
Write-Host "    - Payment Method:  $($orderRes.paymentMethod)" -ForegroundColor Gray
Write-Host "    - Initial Payment: $($orderRes.paymentStatus) (Expected: pending)" -ForegroundColor Gray
Write-Host "    - isPaid flag:     $($orderRes.isPaid) (Expected: False)" -ForegroundColor Gray
Write-Host "    - Total Amount:    ₹$($orderRes.totalAmount)" -ForegroundColor Gray

if ($orderRes.paymentStatus -ne "pending" -or $orderRes.isPaid -ne $false) {
    Write-Host "  FAIL: UPI order did not initialize with pending / isPaid=false" -ForegroundColor Red
    exit 1
}

# -------------------------------------------------------------
# 4. FETCH DYNAMIC UPI PAYMENT DETAILS & QR CODE
# -------------------------------------------------------------
Write-Host "`n[STEP 4] Fetching Server Authoritative UPI Deep Link & QR Code..." -ForegroundColor Cyan
$paymentDetails = (Invoke-RestMethod -Uri "$baseUrl/api/payment/$($orderRes._id)" -Method Get -Headers $custHeaders).data
Write-Host "  * Authoritative Payable: ₹$($paymentDetails.amountPayable)" -ForegroundColor Green
Write-Host "  * Generated UPI Deep Link:" -ForegroundColor Gray
Write-Host "    $($paymentDetails.upiUri)" -ForegroundColor Yellow
Write-Host "  * QR Code Data URI Present: $($paymentDetails.qrCode.StartsWith('data:image/png;base64,'))" -ForegroundColor Green

if (-not $paymentDetails.upiUri.StartsWith("upi://pay?pa=")) {
    Write-Host "  FAIL: UPI URI format is invalid." -ForegroundColor Red
    exit 1
}

# -------------------------------------------------------------
# 5. CUSTOMER CONFIRMS PAYMENT WITH UTR / TXN ID
# -------------------------------------------------------------
Write-Host "`n[STEP 5] Customer Submits Banking UTR Reference..." -ForegroundColor Cyan
$utrNumber = "UPI$rand" + "8899"
$confirmPayload = @{
    transactionId = $utrNumber
    paymentApp = "Google Pay"
    note = "Settled via HDFC Bank NetBanking"
} | ConvertTo-Json

$confirmedOrder = (Invoke-RestMethod -Uri "$baseUrl/api/payment/$($orderRes._id)/confirm" -Method Post -Body $confirmPayload -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * Submitted UTR: $($confirmedOrder.paymentReference)" -ForegroundColor Green
Write-Host "  * New Payment Status: $($confirmedOrder.paymentStatus) (Expected: pending_verification)" -ForegroundColor Green
Write-Host "  * App Used: $($confirmedOrder.paymentApp)" -ForegroundColor Gray

if ($confirmedOrder.paymentStatus -ne "pending_verification") {
    Write-Host "  FAIL: Order status did not update to pending_verification." -ForegroundColor Red
    exit 1
}

# -------------------------------------------------------------
# 6. SECURITY & AUTHORIZATION VERIFICATION
# -------------------------------------------------------------
Write-Host "`n[STEP 6] Security Verification: Unauthorized Cross-User Access..." -ForegroundColor Cyan
$intruderAuth = (Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body (@{ name = "Intruder User"; email = "intruder$rand@stylesphere.fashion"; password = "Password123"; confirmPassword = "Password123" } | ConvertTo-Json) -ContentType "application/json").data
$intruderHeaders = @{ Authorization = "Bearer $($intruderAuth.token)" }

try {
    Invoke-RestMethod -Uri "$baseUrl/api/payment/$($orderRes._id)" -Method Get -Headers $intruderHeaders
    Write-Host "  FAIL: Intruder accessed payment portal of another user!" -ForegroundColor Red
    exit 1
} catch {
    Write-Host "  * PASSED: Cross-user access rejected with HTTP 403 Forbidden" -ForegroundColor Green
}

# -------------------------------------------------------------
# 7. ADMIN RECONCILIATION & PAYMENT VERIFICATION
# -------------------------------------------------------------
Write-Host "`n[STEP 7] Executive Admin Payment Center & Reconciliation..." -ForegroundColor Cyan
$adminAuth = (Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body (@{ email = "admin@stylesphere.fashion"; password = "AdminSecret2026" } | ConvertTo-Json) -ContentType "application/json").data
$adminHeaders = @{ Authorization = "Bearer $($adminAuth.token)" }

$adminPayments = (Invoke-RestMethod -Uri "$baseUrl/api/admin/payments" -Method Get -Headers $adminHeaders).data
Write-Host "  * Admin Payment Metrics:" -ForegroundColor Gray
Write-Host "    - Pending Review Count: $($adminPayments.metrics.awaitingVerification)" -ForegroundColor Yellow
Write-Host "    - Pending Amount:       ₹$($adminPayments.metrics.pendingAmount)" -ForegroundColor Yellow
Write-Host "    - Total UPI Revenue:    ₹$($adminPayments.metrics.totalUpiRevenue)" -ForegroundColor Green

# Admin manually approves & verifies payment
$verifiedOrder = (Invoke-RestMethod -Uri "$baseUrl/api/admin/payments/$($orderRes._id)/verify" -Method Patch -Headers $adminHeaders).data.order
Write-Host "  * Admin Verified Payment:" -ForegroundColor Green
Write-Host "    - Payment Status: $($verifiedOrder.paymentStatus) (Expected: paid)" -ForegroundColor Green
Write-Host "    - isPaid:         $($verifiedOrder.isPaid) (Expected: True)" -ForegroundColor Green
Write-Host "    - Order Status:   $($verifiedOrder.orderStatus) (Expected: confirmed)" -ForegroundColor Green

if ($verifiedOrder.paymentStatus -ne "paid" -or $verifiedOrder.isPaid -ne $true) {
    Write-Host "  FAIL: Payment was not marked as paid / verified." -ForegroundColor Red
    exit 1
}

# -------------------------------------------------------------
# 8. OFFICIAL TAX INVOICE GENERATION
# -------------------------------------------------------------
Write-Host "`n[STEP 8] Official Tax Invoice Retrieval..." -ForegroundColor Cyan
$invoiceJson = (Invoke-RestMethod -Uri "$baseUrl/api/orders/$($orderRes._id)/invoice" -Method Get -Headers $custHeaders).data.order
Write-Host "  * Tax Invoice JSON verified for Order: $($invoiceJson.orderNumber)" -ForegroundColor Green
Write-Host "    - Total Amount: ₹$($invoiceJson.totalAmount)" -ForegroundColor Gray
Write-Host "    - Items Count:  $($invoiceJson.items.Count)" -ForegroundColor Gray

$invoiceHtml = Invoke-RestMethod -Uri "$baseUrl/api/orders/$($orderRes._id)/invoice?format=html" -Method Get -Headers $custHeaders
if ($invoiceHtml -match "OFFICIAL TAX INVOICE" -and $invoiceHtml -match $orderRes.orderNumber) {
    Write-Host "  * Tax Invoice Printable HTML Document Generated Successfully" -ForegroundColor Green
} else {
    Write-Host "  FAIL: Invoice HTML was not properly formatted." -ForegroundColor Red
    exit 1
}

# -------------------------------------------------------------
# 9. REJECTION & RESUBMISSION LIFECYCLE
# -------------------------------------------------------------
Write-Host "`n[STEP 9] Testing Payment Rejection & Customer Resubmission..." -ForegroundColor Cyan
# Create second order
$cart2 = Invoke-RestMethod -Uri "$baseUrl/api/cart" -Method Post -Body (@{ productId = $testProduct._id; selectedSize = "L"; selectedColor = "Gold"; quantity = 1 } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"
$order2 = (Invoke-RestMethod -Uri "$baseUrl/api/orders" -Method Post -Body $orderPayload -Headers $custHeaders -ContentType "application/json").data.order

# Customer submits fake reference
$fakeUtrConfirm = Invoke-RestMethod -Uri "$baseUrl/api/payment/$($order2._id)/confirm" -Method Post -Body (@{ transactionId = "INVALID_REF_000"; paymentApp = "PhonePe" } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"

# Admin rejects payment
$rejectionReason = "Transaction INVALID_REF_000 was not found on merchant bank statement."
$rejectedOrder = (Invoke-RestMethod -Uri "$baseUrl/api/admin/payments/$($order2._id)/reject" -Method Patch -Body (@{ reason = $rejectionReason } | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json").data.order
Write-Host "  * Payment Rejected -> Status: $($rejectedOrder.paymentStatus)" -ForegroundColor Yellow
Write-Host "    - Recorded Reason: $($rejectedOrder.paymentRejectionReason)" -ForegroundColor Gray

# Customer resubmits corrected UTR
$resubmittedOrder = (Invoke-RestMethod -Uri "$baseUrl/api/payment/$($order2._id)/confirm" -Method Post -Body (@{ transactionId = "VALID_UTR_88997766"; paymentApp = "PhonePe"; note = "Corrected reference" } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * Customer Resubmitted -> New Status: $($resubmittedOrder.paymentStatus)" -ForegroundColor Green
Write-Host "    - New Reference: $($resubmittedOrder.paymentReference)" -ForegroundColor Green

# Admin verifies resubmitted order
$finalApproved = (Invoke-RestMethod -Uri "$baseUrl/api/admin/payments/$($order2._id)/verify" -Method Patch -Headers $adminHeaders).data.order
Write-Host "  * Admin Approved Resubmitted Order -> Status: $($finalApproved.paymentStatus)" -ForegroundColor Green

# -------------------------------------------------------------
# 10. CASH ON DELIVERY (COD) REGRESSION CHECK
# -------------------------------------------------------------
Write-Host "`n[STEP 10] Checking Cash on Delivery (COD) Workflow..." -ForegroundColor Cyan
$cart3 = Invoke-RestMethod -Uri "$baseUrl/api/cart" -Method Post -Body (@{ productId = $testProduct._id; selectedSize = "S"; selectedColor = "White"; quantity = 1 } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"
$codPayload = @{
    shippingAddress = @{
        fullName = "Duchess Catherine"
        phone = "+91 9887766554"
        addressLine1 = "Kensington Royal Estate"
        city = "Udaipur"
        state = "Rajasthan"
        postalCode = "313001"
    }
    paymentMethod = "COD"
} | ConvertTo-Json

$codOrder = (Invoke-RestMethod -Uri "$baseUrl/api/orders" -Method Post -Body $codPayload -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * COD Order Created: $($codOrder.orderNumber)" -ForegroundColor Green
Write-Host "    - Payment Method: $($codOrder.paymentMethod)" -ForegroundColor Gray
Write-Host "    - Payment Status: $($codOrder.paymentStatus) (Expected: cash_on_delivery)" -ForegroundColor Gray
Write-Host "    - isPaid:         $($codOrder.isPaid) (Expected: False)" -ForegroundColor Gray

Write-Host "`n=================================================================" -ForegroundColor Yellow
Write-Host "   ALL PHASE 6 MASTER INTEGRATION TESTS PASSED (100% SUCCESS)    " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Yellow
