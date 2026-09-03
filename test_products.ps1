Write-Host "========================================="
Write-Host "  STYLESPHERE PHASE 3 API TEST SUITE    "
Write-Host "========================================="

# 1. Categories
Write-Host "`n[TEST 1] GET /api/categories"
$catRes = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get
Write-Host "Categories Count:" $catRes.data.categories.Count
Write-Host "Sample Category:" $catRes.data.categories[0].name "(Slug:" $catRes.data.categories[0].slug ")"

# 2. All Products
Write-Host "`n[TEST 2] GET /api/products"
$prodRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get
Write-Host "Total Products:" $prodRes.data.totalProducts
Write-Host "Current Page:" $prodRes.data.page
Write-Host "Products in page:" $prodRes.data.products.Count

# 3. Search Query
Write-Host "`n[TEST 3] GET /api/products?q=silk"
$searchRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products?q=silk" -Method Get
Write-Host "Matching 'silk' count:" $searchRes.data.totalProducts

# 4. Gender Filter
Write-Host "`n[TEST 4] GET /api/products?gender=men"
$menRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products?gender=men" -Method Get
Write-Host "Men's products count:" $menRes.data.totalProducts

# 5. Price Range Filter
Write-Host "`n[TEST 5] GET /api/products?minPrice=3000&maxPrice=6000"
$priceRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products?minPrice=3000&maxPrice=6000" -Method Get
Write-Host "Price range ₹3000-₹6000 count:" $priceRes.data.totalProducts

# 6. Sorting
Write-Host "`n[TEST 6] GET /api/products?sort=price_asc"
$sortRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products?sort=price_asc" -Method Get
Write-Host "Lowest price:" $sortRes.data.products[0].price "INR (" $sortRes.data.products[0].name ")"
Write-Host "Next price:" $sortRes.data.products[1].price "INR (" $sortRes.data.products[1].name ")"

# 7. Featured Products
Write-Host "`n[TEST 7] GET /api/products/featured"
$featRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products/featured" -Method Get
Write-Host "Featured Count:" $featRes.data.products.Count

# 8. Trending Products
Write-Host "`n[TEST 8] GET /api/products/trending"
$trendRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products/trending" -Method Get
Write-Host "Trending Count:" $trendRes.data.products.Count

# 9. Single Product Details by Slug
Write-Host "`n[TEST 9] GET /api/products/silk-velvet-evening-gala-gown"
$detailRes = Invoke-RestMethod -Uri "http://localhost:5000/api/products/silk-velvet-evening-gala-gown" -Method Get
Write-Host "Product Name:" $detailRes.data.product.name
Write-Host "Brand:" $detailRes.data.product.brand
Write-Host "Price:" $detailRes.data.product.price
Write-Host "Related Products Count:" $detailRes.data.relatedProducts.Count

# 10. Invalid Slug (404 test)
Write-Host "`n[TEST 10] GET /api/products/non-existent-luxury-item"
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/products/non-existent-luxury-item" -Method Get
    Write-Host "FAILED: Expected 404"
} catch {
    Write-Host "PASSED: Rejected with 404 ->" $_.Exception.Message
}

Write-Host "`n========================================="
Write-Host "       ALL PRODUCT TESTS COMPLETE        "
Write-Host "========================================="
