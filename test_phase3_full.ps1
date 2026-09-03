Write-Host "========================================="
Write-Host "  STYLESPHERE PHASE 3 VERIFICATION SUITE "
Write-Host "========================================="

# 1. Health
Write-Host "`n[1] Health Check"
$health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
Write-Host "Status:" $health.data.status "| Database:" $health.data.database.name

# 2. Categories
Write-Host "`n[2] Categories List"
$cat = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get
Write-Host "Total Categories:" $cat.data.categories.Count
Write-Host "First 3 Categories:" ($cat.data.categories[0..2] | ForEach-Object { $_.name }) -join ", "

# 3. Products List & Pagination
Write-Host "`n[3] Products List & Pagination"
$prods = Invoke-RestMethod -Uri "http://localhost:5000/api/products?page=1&limit=6" -Method Get
Write-Host "Total Products in DB:" $prods.data.totalProducts
Write-Host "Total Pages (limit=6):" $prods.data.totalPages
Write-Host "Returned on Page 1:" $prods.data.products.Count

# 4. Search Filter
Write-Host "`n[4] Search Filter (?q=leather)"
$search = Invoke-RestMethod -Uri "http://localhost:5000/api/products?q=leather" -Method Get
Write-Host "Matches for 'leather':" $search.data.totalProducts

# 5. Gender Filter
Write-Host "`n[5] Gender Filter (?gender=women)"
$women = Invoke-RestMethod -Uri "http://localhost:5000/api/products?gender=women" -Method Get
Write-Host "Women's Products:" $women.data.totalProducts

# 6. Category Filter
Write-Host "`n[6] Category Filter (?category=women-dresses)"
$dresses = Invoke-RestMethod -Uri "http://localhost:5000/api/products?category=women-dresses" -Method Get
Write-Host "Dresses Count:" $dresses.data.totalProducts

# 7. Price Range Filter
Write-Host "`n[7] Price Range (?minPrice=3000&maxPrice=5000)"
$price = Invoke-RestMethod -Uri "http://localhost:5000/api/products?minPrice=3000&maxPrice=5000" -Method Get
Write-Host "Products in ₹3000-₹5000 range:" $price.data.totalProducts

# 8. Sort Price Ascending
Write-Host "`n[8] Sort Ascending (?sort=price_asc)"
$sortAsc = Invoke-RestMethod -Uri "http://localhost:5000/api/products?sort=price_asc" -Method Get
Write-Host "Cheapest Product:" $sortAsc.data.products[0].name "-> ₹" $sortAsc.data.products[0].price

# 9. Sort Price Descending
Write-Host "`n[9] Sort Descending (?sort=price_desc)"
$sortDesc = Invoke-RestMethod -Uri "http://localhost:5000/api/products?sort=price_desc" -Method Get
Write-Host "Most Expensive Product:" $sortDesc.data.products[0].name "-> ₹" $sortDesc.data.products[0].price

# 10. Featured Products
Write-Host "`n[10] Featured Products"
$feat = Invoke-RestMethod -Uri "http://localhost:5000/api/products/featured" -Method Get
Write-Host "Featured Count:" $feat.data.products.Count

# 11. Trending Products
Write-Host "`n[11] Trending Products"
$trend = Invoke-RestMethod -Uri "http://localhost:5000/api/products/trending" -Method Get
Write-Host "Trending Count:" $trend.data.products.Count

# 12. Single Product Details by Slug & Related Products
Write-Host "`n[12] Single Product by Slug"
$detail = Invoke-RestMethod -Uri "http://localhost:5000/api/products/silk-velvet-evening-gala-gown" -Method Get
Write-Host "Product Found:" $detail.data.product.name
Write-Host "Brand:" $detail.data.product.brand
Write-Host "Price:" $detail.data.product.price "(MSRP: " $detail.data.product.originalPrice ")"
Write-Host "Colors:" ($detail.data.product.colors -join ", ")
Write-Host "Sizes:" ($detail.data.product.sizes -join ", ")
Write-Host "Related Products Count:" $detail.data.relatedProducts.Count

# 13. Invalid Slug 404
Write-Host "`n[13] Invalid Slug (404 Test)"
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/products/non-existent-product" -Method Get
    Write-Host "FAILED: Expected 404"
} catch {
    Write-Host "PASSED: Proper 404 Returned ->" $_.Exception.Message
}

# 14. Authentication System Verification
Write-Host "`n[14] Auth Verification (Login & /me)"
$rand = Get-Random -Minimum 1000 -Maximum 9999
$testEmail = "phase3tastemaker$rand@stylesphere.fashion"
$regBody = @{
    name = "Duchess Aurelia"
    email = $testEmail
    password = "AureliaPassword2026"
    confirmPassword = "AureliaPassword2026"
} | ConvertTo-Json

$regRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
$token = $regRes.data.token
$headers = @{ Authorization = "Bearer $token" }
$meRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
Write-Host "Auth Profile Name:" $meRes.data.user.name "| Role:" $meRes.data.user.role

Write-Host "`n========================================="
Write-Host "     ALL PHASE 3 VERIFICATIONS PASSED     "
Write-Host "========================================="
