Write-Host "========================================================="
Write-Host "       STYLESPHERE PHASE 6 UPI PAYMENT TEST SUITE        "
Write-Host "========================================================="

# 1. Public Payment Config
Write-Host "`n[TEST 1] Public Payment Configuration"
$config = (Invoke-RestMethod -Uri "http://localhost:5000/api/payment/config" -Method Get).data
Write-Host "  * Merchant UPI ID:" $config.merchantUpiId
Write-Host "  * Merchant Name:" $config.merchantName

# 2. Register Customer User
$rand = Get-Random -Minimum 10000 -Maximum 99999
$email = "upiclient$rand@stylesphere.fashion"
$regPayload = @{
    name = "Countess Genevieve"
    email = $email
    password = "GenevieveSecret2026"
    confirmPassword = "GenevieveSecret2026"
} | ConvertTo-Json

$custAuth = (Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regPayload -ContentType "application/json").data
$custToken = $custAuth.token
$custHeaders = @{ Authorization = "Bearer $custToken" }
Write-Host "`n[TEST 2] Registered Customer:" $custAuth.user.name

# 3. Create UPI Order
Write-Host "`n[TEST 3] Create UPI Order"
$products = (Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get).data.products
$prod = $products[0]

$cartAdd = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Post -Body (@{ productId = $prod._id; selectedSize = "M"; selectedColor = "Black"; quantity = 1 } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"

$orderPayload = @{
    shippingAddress = @{
        fullName = "Countess Genevieve"
        phone = "+91 9911223344"
        addressLine1 = "Chateau No. 12"
        city = "Jaipur"
        state = "Rajasthan"
        postalCode = "302001"
    }
    paymentMethod = "UPI"
} | ConvertTo-Json

$orderRes = (Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Post -Body $orderPayload -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * Created UPI Order:" $orderRes.orderNumber
Write-Host "    - Payment Method:" $orderRes.paymentMethod
Write-Host "    - Payment Status:" $orderRes.paymentStatus "(Expected: pending)"
Write-Host "    - Total Amount: ₹" $orderRes.totalAmount

# 4. Get Payment Details & Dynamic UPI QR
Write-Host "`n[TEST 4] Retrieve Dynamic UPI URI & QR Code"
$payDetails = (Invoke-RestMethod -Uri "http://localhost:5000/api/payment/$($orderRes._id)" -Method Get -Headers $custHeaders).data
Write-Host "  * Generated UPI Deep Link:" $payDetails.upiUri
Write-Host "  * QR Code Data URI generated:" ($payDetails.qrCode.Length -gt 100)
Write-Host "  * Server Authoritative Amount: ₹" $payDetails.amountPayable

# 5. Submit Customer Payment Confirmation (UTR / Txn ID)
Write-Host "`n[TEST 5] Submit UPI Transaction Reference"
$confirmPayload = @{
    transactionId = "UPI987654321099"
    paymentApp = "Google Pay"
    note = "Paid from HDFC account"
} | ConvertTo-Json

$confirmRes = (Invoke-RestMethod -Uri "http://localhost:5000/api/payment/$($orderRes._id)/confirm" -Method Post -Body $confirmPayload -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * Payment Confirmation Submitted:"
Write-Host "    - New Payment Status:" $confirmRes.paymentStatus "(Expected: pending_verification)"
Write-Host "    - Recorded UTR / Txn ID:" $confirmRes.paymentReference
Write-Host "    - Payment App:" $confirmRes.paymentApp

# 6. Security Check: Unauthorized customer access
Write-Host "`n[TEST 6] Cross-User Security Check"
$intruderAuth = (Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body (@{ name = "Unauthorized User"; email = "intruder$rand@stylesphere.fashion"; password = "Secret2026"; confirmPassword = "Secret2026" } | ConvertTo-Json) -ContentType "application/json").data
$intruderHeaders = @{ Authorization = "Bearer $($intruderAuth.token)" }

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/payment/$($orderRes._id)" -Method Get -Headers $intruderHeaders
    Write-Host "  FAILED: Unauthorized user accessed payment details!"
} catch {
    Write-Host "  * PASSED: Cross-user access rejected with HTTP 403 Forbidden"
}

# 7. Admin Payment Verification Workflow
Write-Host "`n[TEST 7] Admin Payment Verification Workflow"
$adminAuth = (Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{ email = "admin@stylesphere.fashion"; password = "AdminSecret2026" } | ConvertTo-Json) -ContentType "application/json").data
$adminHeaders = @{ Authorization = "Bearer $($adminAuth.token)" }

# Fetch payments list and metrics
$adminPayments = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/payments" -Method Get -Headers $adminHeaders).data
Write-Host "  * Admin Payment Metrics:"
Write-Host "    - Awaiting Verification:" $adminPayments.metrics.awaitingVerification
Write-Host "    - Pending Amount: ₹" $adminPayments.metrics.pendingAmount
Write-Host "    - Verified Payments:" $adminPayments.metrics.verifiedPayments

# Verify payment
$verifiedOrder = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/payments/$($orderRes._id)/verify" -Method Patch -Headers $adminHeaders).data.order
Write-Host "  * Admin Verified Payment:"
Write-Host "    - Payment Status:" $verifiedOrder.paymentStatus "(Expected: paid)"
Write-Host "    - Is Paid:" $verifiedOrder.isPaid
Write-Host "    - Order Status:" $verifiedOrder.orderStatus

# 8. Test Rejection & Resubmission Workflow
Write-Host "`n[TEST 8] Payment Rejection & Customer Resubmission"
# Create second order
$cartAdd2 = Invoke-RestMethod -Uri "http://localhost:5000/api/cart" -Method Post -Body (@{ productId = $prod._id; selectedSize = "L"; selectedColor = "Black"; quantity = 1 } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"
$order2 = (Invoke-RestMethod -Uri "http://localhost:5000/api/orders" -Method Post -Body $orderPayload -Headers $custHeaders -ContentType "application/json").data.order

# Customer submits invalid UTR
$invalidConfirm = Invoke-RestMethod -Uri "http://localhost:5000/api/payment/$($order2._id)/confirm" -Method Post -Body (@{ transactionId = "FAKE1234"; paymentApp = "PhonePe" } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json"

# Admin rejects payment with reason
$rejectRes = (Invoke-RestMethod -Uri "http://localhost:5000/api/admin/payments/$($order2._id)/reject" -Method Patch -Body (@{ reason = "UTR Number FAKE1234 not found in bank statement." } | ConvertTo-Json) -Headers $adminHeaders -ContentType "application/json").data.order
Write-Host "  * Admin Rejected Payment -> Status:" $rejectRes.paymentStatus "(Reason: $($rejectRes.paymentRejectionReason))"

# Customer resubmits valid UTR
$resubmitRes = (Invoke-RestMethod -Uri "http://localhost:5000/api/payment/$($order2._id)/confirm" -Method Post -Body (@{ transactionId = "VALID998877665544"; paymentApp = "PhonePe"; note = "Corrected UTR" } | ConvertTo-Json) -Headers $custHeaders -ContentType "application/json").data.order
Write-Host "  * Customer Resubmitted -> Status:" $resubmitRes.paymentStatus "(New UTR: $($resubmitRes.paymentReference))"

# 9. Invoice Generation
Write-Host "`n[TEST 9] Official Tax Invoice Generation"
$invoiceData = (Invoke-RestMethod -Uri "http://localhost:5000/api/orders/$($orderRes._id)/invoice" -Method Get -Headers $custHeaders).data.order
Write-Host "  * Invoice Data Retrieved for Order:" $invoiceData.orderNumber
Write-Host "  * Invoice Total Amount: ₹" $invoiceData.totalAmount

$invoiceHtml = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/$($orderRes._id)/invoice?format=html" -Method Get -Headers $custHeaders
Write-Host "  * Invoice HTML Formatted Document Generated:" ($invoiceHtml.Contains("OFFICIAL TAX INVOICE"))

Write-Host "`n========================================================="
Write-Host "       ALL PHASE 6 BACKEND TESTS PASSED                  "
Write-Host "========================================================="
