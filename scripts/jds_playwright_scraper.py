"""
JDS Industries Playwright Gallery Scraper
Uses browser automation to extract all gallery images including blank versions.
"""
import asyncio
import json
import aiohttp
import aiofiles
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

# Output directories
OUTPUT_DIR = Path("scraped_images_blank")
OUTPUT_DIR.mkdir(exist_ok=True)
DATA_DIR = Path("scraped_data")
DATA_DIR.mkdir(exist_ok=True)

# LWB SKUs for MVP
SKUS = [
    # 12oz (LWB05x) 
    "LWB051", "LWB052", "LWB053", "LWB054", "LWB055", "LWB056", "LWB057", "LWB058",
    "LWB059", "LWB060", "LWB061", "LWB062", "LWB063", "LWB064", "LWB065", "LWB066",
    "LWB067", "LWB068",
    # 20oz (LWB10x)
    "LWB101", "LWB102", "LWB103", "LWB104", "LWB105", "LWB106", "LWB107", "LWB108",
    "LWB109", "LWB110", "LWB111", "LWB112", "LWB113", "LWB114", "LWB115", "LWB116",
    "LWB117", "LWB118",
    # 32oz (LWB20x)
    "LWB201", "LWB202", "LWB203", "LWB204", "LWB205", "LWB206", "LWB207", "LWB208",
    "LWB209", "LWB210", "LWB211", "LWB212", "LWB213", "LWB214", "LWB215", "LWB216",
    "LWB217", "LWB218",
    # 40oz (LWB30x)
    "LWB301", "LWB302", "LWB303", "LWB304", "LWB305", "LWB306", "LWB307", "LWB308",
    "LWB309", "LWB310", "LWB311", "LWB312", "LWB313", "LWB314", "LWB315", "LWB316",
    "LWB317", "LWB318",
]

async def download_image(url: str, filepath: Path) -> bool:
    """Download an image from URL."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=30) as response:
                if response.status == 200:
                    content = await response.read()
                    async with aiofiles.open(filepath, 'wb') as f:
                        await f.write(content)
                    return True
    except Exception as e:
        print(f"  Error downloading: {e}")
    return False

async def scrape_product_gallery(page, sku: str) -> dict:
    """Scrape all gallery images for a single product."""
    result = {
        "sku": sku,
        "gallery_images": [],
        "main_image": None,
        "blank_image": None,
        "scraped_at": datetime.now().isoformat(),
        "error": ""
    }
    
    try:
        # Navigate to product page
        url = f"https://www.jdsindustries.com/?view=search&homePage=YES&doGetSearch={sku}&fuzzy=Yes"
        await page.goto(url, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(1000)
        
        # Click "View More Images" to open gallery
        view_more = page.locator("a:has-text('View More Images')").first
        if await view_more.count() > 0:
            await view_more.click()
            await page.wait_for_timeout(2000)
        
        # Extract gallery image URLs from lightGallery
        gallery_urls = await page.evaluate("""
            () => {
                const urls = [];
                
                // Method 1: lightGallery data
                const lgItems = document.querySelectorAll('.lg-item');
                lgItems.forEach(item => {
                    const src = item.getAttribute('data-src') || item.querySelector('img')?.src;
                    if (src && src.includes('cloudinary')) urls.push(src);
                });
                
                // Method 2: Thumbnail images
                const thumbs = document.querySelectorAll('.lg-thumb-item img');
                thumbs.forEach(img => {
                    // Get high-res version by modifying the URL
                    let src = img.src;
                    if (src.includes('cloudinary')) {
                        // Convert thumbnail to large: change w_xxx to w_600
                        src = src.replace(/w_\\d+/, 'w_600').replace(/h_\\d+/, 'h_600');
                        urls.push(src);
                    }
                });
                
                // Method 3: Current large image
                const lgObject = document.querySelector('.lg-object');
                if (lgObject && lgObject.src && lgObject.src.includes('cloudinary')) {
                    urls.push(lgObject.src);
                }
                
                // Method 4: Main product slider images
                const sliderImgs = document.querySelectorAll('.jcarousel img, .productImageSlider img');
                sliderImgs.forEach(img => {
                    if (img.src && img.src.includes('cloudinary')) urls.push(img.src);
                });
                
                // Deduplicate and return
                return [...new Set(urls)];
            }
        """)
        
        result["gallery_images"] = gallery_urls
        
        # If gallery didn't work, try to get main image
        if not gallery_urls:
            main_img = await page.evaluate("""
                () => {
                    const imgs = document.querySelectorAll('img');
                    for (const img of imgs) {
                        if (img.src && img.src.includes('cloudinary') && img.src.includes('products/images')) {
                            return img.src;
                        }
                    }
                    return null;
                }
            """)
            if main_img:
                result["gallery_images"] = [main_img]
        
        # Set main and blank images
        if result["gallery_images"]:
            result["main_image"] = result["gallery_images"][0]
            # Blank image is often the last one or one without engraving
            if len(result["gallery_images"]) > 1:
                result["blank_image"] = result["gallery_images"][-1]
            else:
                result["blank_image"] = result["gallery_images"][0]
        
        # Close gallery if open
        close_btn = page.locator(".lg-close, .lg-toolbar .lg-icon").first
        if await close_btn.count() > 0:
            try:
                await close_btn.click()
                await page.wait_for_timeout(500)
            except:
                pass
                
    except Exception as e:
        result["error"] = str(e)
        print(f"  Error: {e}")
    
    return result

async def main():
    print(f"Starting Playwright scrape of {len(SKUS)} LWB products...")
    print(f"Output directory: {OUTPUT_DIR}")
    
    results = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = await context.new_page()
        
        for i, sku in enumerate(SKUS):
            print(f"Processing {sku} ({i+1}/{len(SKUS)})...")
            
            result = await scrape_product_gallery(page, sku)
            results.append(result)
            
            # Download blank image
            if result["blank_image"]:
                filepath = OUTPUT_DIR / f"{sku}_blank.png"
                success = await download_image(result["blank_image"], filepath)
                result["blank_downloaded"] = success
                print(f"  Found {len(result['gallery_images'])} images, blank: {'OK' if success else 'FAIL'}")
            else:
                print(f"  No images found")
            
            # Small delay between products
            await asyncio.sleep(0.5)
        
        await browser.close()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = DATA_DIR / f"playwright_gallery_{timestamp}.json"
    
    async with aiofiles.open(output_file, 'w') as f:
        await f.write(json.dumps(results, indent=2))
    
    # Summary
    success_count = sum(1 for r in results if r.get("blank_image"))
    multi_count = sum(1 for r in results if len(r.get("gallery_images", [])) > 1)
    
    print(f"\nScrape complete!")
    print(f"  Products with images: {success_count}/{len(SKUS)}")
    print(f"  Products with multiple images: {multi_count}")
    print(f"  Results saved to: {output_file}")
    print(f"  Images saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
