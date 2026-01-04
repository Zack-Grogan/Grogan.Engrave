"""
JDS Industries Template & Gallery Downloader
Uses Playwright to:
1. Download EPS templates (one per size)
2. Download ALL gallery images (11 per product)
"""
import asyncio
import json
import aiohttp
import aiofiles
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

# Output directories
TEMPLATE_DIR = Path("templates")
TEMPLATE_DIR.mkdir(exist_ok=True)
GALLERY_DIR = Path("scraped_images_gallery")
GALLERY_DIR.mkdir(exist_ok=True)
DATA_DIR = Path("scraped_data")
DATA_DIR.mkdir(exist_ok=True)

# One SKU per size for templates (templates are the same for all colors of a size)
TEMPLATE_SKUS = ["LWB051", "LWB101", "LWB201", "LWB301"]  # 12/20/32/40oz

# All SKUs for gallery images
ALL_SKUS = [
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

async def download_file(session: aiohttp.ClientSession, url: str, filepath: Path) -> bool:
    """Download a file from URL."""
    try:
        async with session.get(url, timeout=60) as response:
            if response.status == 200:
                content = await response.read()
                async with aiofiles.open(filepath, 'wb') as f:
                    await f.write(content)
                return True
    except Exception as e:
        print(f"  Error downloading {url}: {e}")
    return False

async def get_template_url(page, sku: str) -> str | None:
    """Get the S3 template URL for a SKU via AJAX."""
    try:
        result = await page.evaluate(f"""
            async () => {{
                const response = await fetch('includes/process_ajax_request.php?cmd=checkTemplateStatus&addr={sku}');
                const data = await response.json();
                return data;
            }}
        """)
        # Result should contain S3 URL or path
        if isinstance(result, dict) and result.get('status') == 'success':
            return result.get('url')
        elif isinstance(result, str):
            return result
        return None
    except Exception as e:
        print(f"  Error getting template URL for {sku}: {e}")
        return None

async def get_gallery_images(page, sku: str) -> list[str]:
    """Get all gallery images for a SKU."""
    try:
        # Navigate to product page
        url = f"https://www.jdsindustries.com/?view=search&homePage=YES&doGetSearch={sku}&fuzzy=Yes"
        await page.goto(url, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(1000)
        
        # Open gallery
        await page.evaluate(f"openProductMediaLightbox('{sku}')")
        await page.wait_for_timeout(2000)
        
        # Extract all Cloudinary image URLs
        images = await page.evaluate("""
            () => {
                const html = document.documentElement.innerHTML;
                const regex = /https:\\/\\/res\\.cloudinary\\.com\\/[^\"'<>]+/g;
                const matches = html.match(regex) || [];
                // Filter to only product images and dedupe
                const filtered = matches.filter(url => 
                    url.includes('products/images') && 
                    (url.includes('/large/') || url.includes('/medium/'))
                );
                return [...new Set(filtered)];
            }
        """)
        
        # Close gallery
        await page.keyboard.press('Escape')
        await page.wait_for_timeout(500)
        
        return images
    except Exception as e:
        print(f"  Error getting gallery for {sku}: {e}")
        return []

async def main():
    print("=" * 60)
    print("JDS Template & Gallery Downloader")
    print("=" * 60)
    
    results = {
        "templates": {},
        "galleries": {}
    }
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = await context.new_page()
        
        # First, navigate to JDS to establish session
        await page.goto("https://www.jdsindustries.com/", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        
        # Download templates (one per size)
        print("\n1. Downloading EPS templates...")
        for sku in TEMPLATE_SKUS:
            print(f"  Getting template for {sku}...")
            
            # Navigate to product page first
            url = f"https://www.jdsindustries.com/?view=search&homePage=YES&doGetSearch={sku}&fuzzy=Yes"
            await page.goto(url, wait_until="networkidle", timeout=30000)
            await page.wait_for_timeout(1000)
            
            template_url = await get_template_url(page, sku)
            if template_url:
                results["templates"][sku] = template_url
                print(f"    Found template: {template_url[:80]}...")
                
                # Download template
                async with aiohttp.ClientSession() as session:
                    filepath = TEMPLATE_DIR / f"{sku}_template.eps"
                    success = await download_file(session, template_url, filepath)
                    if success:
                        print(f"    Downloaded to {filepath}")
            else:
                print(f"    No template found")
        
        # Download all gallery images
        print("\n2. Downloading gallery images...")
        async with aiohttp.ClientSession() as session:
            for i, sku in enumerate(ALL_SKUS):
                print(f"  [{i+1}/{len(ALL_SKUS)}] {sku}...")
                
                images = await get_gallery_images(page, sku)
                results["galleries"][sku] = images
                
                if images:
                    for j, img_url in enumerate(images):
                        # Download each image
                        # Get unique part of URL for filename
                        img_name = f"{sku}_gallery_{j+1}.png"
                        filepath = GALLERY_DIR / img_name
                        
                        # Only download if not already exists
                        if not filepath.exists():
                            success = await download_file(session, img_url, filepath)
                    
                    print(f"    Found {len(images)} images")
                else:
                    print(f"    No gallery images found")
                
                await asyncio.sleep(0.3)  # Rate limiting
        
        await browser.close()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = DATA_DIR / f"templates_and_gallery_{timestamp}.json"
    
    async with aiofiles.open(output_file, 'w') as f:
        await f.write(json.dumps(results, indent=2))
    
    print("\n" + "=" * 60)
    print("Download complete!")
    print(f"  Templates: {len(results['templates'])} saved to {TEMPLATE_DIR}")
    print(f"  Galleries: {len(results['galleries'])} SKUs processed")
    print(f"  Results: {output_file}")

if __name__ == "__main__":
    asyncio.run(main())
