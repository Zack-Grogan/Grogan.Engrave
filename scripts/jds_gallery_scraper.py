"""
JDS Industries Gallery Image Scraper
Extracts ALL images from the product gallery including blank/clean versions.
"""
import asyncio
import aiohttp
import aiofiles
import json
import re
from pathlib import Path
from datetime import datetime

# Output directories
OUTPUT_DIR = Path("scraped_images_all")
OUTPUT_DIR.mkdir(exist_ok=True)
DATA_DIR = Path("scraped_data")
DATA_DIR.mkdir(exist_ok=True)

# Semaphore for rate limiting
MAX_CONCURRENT = 3
DELAY_BETWEEN_REQUESTS = 0.3

# LWB SKUs for MVP (4 sizes x 18 colors = 72 core products + extras)
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

async def fetch_page(session: aiohttp.ClientSession, sku: str) -> str:
    """Fetch the product page HTML."""
    url = f"https://www.jdsindustries.com/?view=search&homePage=YES&doGetSearch={sku}&fuzzy=Yes"
    try:
        async with session.get(url, timeout=30) as response:
            return await response.text()
    except Exception as e:
        print(f"Error fetching {sku}: {e}")
        return ""

def extract_all_images(html: str, sku: str) -> dict:
    """Extract all image URLs from the page including gallery images."""
    result = {
        "sku": sku,
        "main_image": None,
        "gallery_images": [],
        "blank_image": None,  # Will try to identify the clean version
    }
    
    # Pattern 1: trackSkuMedia() JavaScript calls contain image URLs
    # trackSkuMedia(sku, type, url)
    track_pattern = r"trackSkuMedia\s*\(\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)"
    matches = re.findall(track_pattern, html)
    
    for match in matches:
        media_sku, media_type, media_url = match
        if media_sku.upper() == sku.upper():
            if "cloudinary" in media_url.lower() or "products/images" in media_url.lower():
                if media_url not in result["gallery_images"]:
                    result["gallery_images"].append(media_url)
    
    # Pattern 2: Direct Cloudinary URLs in data attributes or img tags
    cloudinary_pattern = r'https://res\.cloudinary\.com/business-products/image/upload[^"\'>\s]+'
    cloudinary_matches = re.findall(cloudinary_pattern, html)
    
    for url in cloudinary_matches:
        # Filter to only include URLs that reference this SKU
        if sku.upper() in url.upper() and url not in result["gallery_images"]:
            result["gallery_images"].append(url)
    
    # Pattern 3: Look for data-src and data-image attributes (lightGallery)
    data_src_pattern = r'data-src="([^"]+)"'
    data_matches = re.findall(data_src_pattern, html)
    for url in data_matches:
        if ("cloudinary" in url or "products/images" in url) and url not in result["gallery_images"]:
            result["gallery_images"].append(url)
    
    # Set main image (first one found)
    if result["gallery_images"]:
        result["main_image"] = result["gallery_images"][0]
        
        # Try to identify blank image (usually has "blank" or no engraving description)
        for url in result["gallery_images"]:
            # Blank images often have different file hash suffixes
            # or are the last images in the gallery
            lower_url = url.lower()
            if "blank" in lower_url or "plain" in lower_url or "clean" in lower_url:
                result["blank_image"] = url
                break
        
        # If no explicit blank found, assume last gallery image might be blank
        if not result["blank_image"] and len(result["gallery_images"]) > 1:
            result["blank_image"] = result["gallery_images"][-1]
    
    return result

async def download_image(session: aiohttp.ClientSession, url: str, filename: str) -> bool:
    """Download an image to the output directory."""
    filepath = OUTPUT_DIR / filename
    try:
        async with session.get(url, timeout=30) as response:
            if response.status == 200:
                content = await response.read()
                async with aiofiles.open(filepath, 'wb') as f:
                    await f.write(content)
                return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

async def process_sku(session: aiohttp.ClientSession, sku: str, semaphore: asyncio.Semaphore) -> dict:
    """Process a single SKU: fetch page, extract images, download."""
    async with semaphore:
        print(f"Processing {sku}...")
        
        html = await fetch_page(session, sku)
        if not html:
            return {"sku": sku, "error": "Failed to fetch page"}
        
        await asyncio.sleep(DELAY_BETWEEN_REQUESTS)
        
        result = extract_all_images(html, sku)
        result["scraped_at"] = datetime.now().isoformat()
        
        # Download main image
        if result["main_image"]:
            success = await download_image(session, result["main_image"], f"{sku}_main.png")
            result["main_downloaded"] = success
        
        # Download blank image if different from main
        if result["blank_image"] and result["blank_image"] != result["main_image"]:
            success = await download_image(session, result["blank_image"], f"{sku}_blank.png")
            result["blank_downloaded"] = success
        
        print(f"  {sku}: Found {len(result['gallery_images'])} images")
        return result

async def main():
    print(f"Starting scrape of {len(SKUS)} LWB products...")
    print(f"Output directory: {OUTPUT_DIR}")
    
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    
    connector = aiohttp.TCPConnector(limit=MAX_CONCURRENT)
    timeout = aiohttp.ClientTimeout(total=60)
    
    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        tasks = [process_sku(session, sku, semaphore) for sku in SKUS]
        results = await asyncio.gather(*tasks)
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = DATA_DIR / f"gallery_images_{timestamp}.json"
    
    async with aiofiles.open(output_file, 'w') as f:
        await f.write(json.dumps(results, indent=2))
    
    # Summary
    success_count = sum(1 for r in results if r.get("main_image"))
    blank_count = sum(1 for r in results if r.get("blank_image"))
    
    print(f"\nScrape complete!")
    print(f"  Products with images: {success_count}/{len(SKUS)}")
    print(f"  Products with blank images: {blank_count}")
    print(f"  Results saved to: {output_file}")
    print(f"  Images saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
