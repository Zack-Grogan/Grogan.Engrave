# -*- coding: utf-8 -*-
"""
JDS Industries Product Image Scraper
Uses trackSkuMedia() JavaScript array to extract Cloudinary image URLs.
"""

import os
import re
import csv
import time
import json
import asyncio
import aiohttp
import aiofiles
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List
from dataclasses import dataclass, asdict
from urllib.parse import urljoin
import argparse

# Configuration
BASE_URL = "https://www.jdsindustries.com"
SEARCH_URL = BASE_URL + "/?view=search&homePage=YES&doGetSearch={sku}&fuzzySearch={sku}&qtyOrdered=0&start=1&end=15"
IMAGE_DIR = Path("scraped_images")
DATA_DIR = Path("scraped_data")
CSV_DIR = Path("Drinkware_Organized")

# Delay between requests (seconds)
REQUEST_DELAY = 0.2

# Concurrent connections
MAX_CONCURRENT = 3

@dataclass
class ProductData:
    sku: str
    name: str
    description: str = ""
    main_image_url: str = ""
    alt_image_urls: list = None
    template_url: str = ""
    scraped_at: str = ""
    error: str = ""
    
    def __post_init__(self):
        if self.alt_image_urls is None:
            self.alt_image_urls = []


def load_skus_from_csv(prefix=None):
    """Load product SKUs from CSV files."""
    products = []
    
    for csv_file in CSV_DIR.glob("*.csv"):
        if "_SampleSet" in csv_file.name or "_ReplacementPart" in csv_file.name or "_Accessory" in csv_file.name:
            continue
            
        if prefix:
            if not csv_file.name.startswith(prefix):
                continue
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if 'SKU' in row and row['SKU']:
                        products.append({
                            'sku': row['SKU'].strip(),
                            'name': row.get('NAME', '').strip(),
                            'price': row.get('PRICE EACH', ''),
                            'source_file': csv_file.name
                        })
        except Exception as e:
            print(f"Error reading {csv_file}: {e}")
    
    return products


def extract_cloudinary_images(html, sku):
    """Extract Cloudinary image URLs from trackSkuMedia() JavaScript call."""
    main_image = ""
    alt_images = []
    
    # Pattern to find the trackSkuMedia JavaScript call
    # Format: trackSkuMedia("SKU", [{...}, {...}])
    pattern = r'trackSkuMedia\s*\(\s*["\']' + re.escape(sku) + r'["\']\s*,\s*(\[.*?\])\s*\)'
    match = re.search(pattern, html, re.DOTALL | re.IGNORECASE)
    
    if match:
        try:
            # Parse the JSON array
            json_str = match.group(1)
            # Clean up the JSON string - sometimes has escaped slashes
            json_str = json_str.replace('\\"', '"')
            media_items = json.loads(json_str)
            
            # Sort by sortOrder if available
            media_items.sort(key=lambda x: x.get('sortOrder', 0))
            
            # Extract URLs - look for the 'url' or 'largeImage' field
            for i, item in enumerate(media_items):
                url = item.get('url') or item.get('largeImage') or item.get('image')
                if url:
                    if i == 0:
                        main_image = url
                    else:
                        alt_images.append(url)
                        
        except json.JSONDecodeError as e:
            print(f"JSON parse error for {sku}: {e}")
    
    # Fallback: look for Cloudinary URLs directly if trackSkuMedia parsing fails
    if not main_image:
        cloudinary_pattern = r'https://res\.cloudinary\.com/business-products/image/upload/[^"\'\s]+/' + re.escape(sku) + r'[^"\'\s]*\.(?:png|jpg|jpeg)'
        matches = re.findall(cloudinary_pattern, html, re.IGNORECASE)
        if matches:
            # Remove duplicates while preserving order
            seen = set()
            unique_matches = []
            for m in matches:
                if m not in seen:
                    seen.add(m)
                    unique_matches.append(m)
            
            if unique_matches:
                main_image = unique_matches[0]
                alt_images = unique_matches[1:10]  # Max 10 alt images
    
    # Final fallback: any Cloudinary product images
    if not main_image:
        generic_pattern = r'(https://res\.cloudinary\.com/business-products/image/upload/[^"\'\s]+\.(?:png|jpg|jpeg))'
        matches = re.findall(generic_pattern, html, re.IGNORECASE)
        if matches:
            # Filter to likely product images (not icons, buttons, etc.)
            product_images = [m for m in matches if 'products/images' in m.lower()]
            if product_images:
                main_image = product_images[0]
                alt_images = product_images[1:10]
    
    return main_image, alt_images


def extract_description(html):
    """Extract product description from HTML."""
    # Look for textSKUTitle div
    patterns = [
        r'<div[^>]*class="[^"]*textSKUTitle[^"]*"[^>]*>(.*?)</div>',
        r'<div[^>]*class="[^"]*sku-desc[^"]*"[^>]*>(.*?)</div>',
        r'<div[^>]*class="[^"]*description[^"]*"[^>]*>(.*?)</div>',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
        if match:
            desc = re.sub(r'<[^>]+>', ' ', match.group(1))
            desc = re.sub(r'\s+', ' ', desc).strip()
            return desc[:500]
    
    return ""


async def fetch_product_page(session, sku, semaphore, delay):
    """Fetch and parse a single product page."""
    url = SEARCH_URL.format(sku=sku)
    
    async with semaphore:
        try:
            await asyncio.sleep(delay)
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status != 200:
                    return ProductData(sku=sku, name="", error=f"HTTP {response.status}")
                
                html = await response.text()
                
                # Use new Cloudinary extraction
                main_image, alt_images = extract_cloudinary_images(html, sku)
                description = extract_description(html)
                
                return ProductData(
                    sku=sku,
                    name="",
                    description=description,
                    main_image_url=main_image,
                    alt_image_urls=alt_images,
                    scraped_at=datetime.now().isoformat()
                )
                
        except asyncio.TimeoutError:
            return ProductData(sku=sku, name="", error="Timeout")
        except Exception as e:
            return ProductData(sku=sku, name="", error=str(e))


async def download_image(session, url, save_path, semaphore, delay):
    """Download an image file."""
    if not url:
        return False
    
    if url.startswith('//'):
        url = 'https:' + url
    elif url.startswith('/'):
        url = urljoin(BASE_URL, url)
    
    async with semaphore:
        try:
            await asyncio.sleep(delay)
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=60)) as response:
                if response.status == 200:
                    save_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    async with aiofiles.open(save_path, 'wb') as f:
                        async for chunk in response.content.iter_chunked(8192):
                            await f.write(chunk)
                    
                    return True
                    
        except Exception as e:
            print(f"Error downloading {url}: {e}")
    
    return False


async def scrape_products(products, download_images=True, delay=0.2):
    """Scrape all products with rate limiting."""
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    results = []
    
    connector = aiohttp.TCPConnector(limit=MAX_CONCURRENT, limit_per_host=MAX_CONCURRENT)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
    
    async with aiohttp.ClientSession(connector=connector, headers=headers) as session:
        print(f"\nFetching {len(products)} product pages...")
        start_time = time.time()
        
        tasks = [fetch_product_page(session, p['sku'], semaphore, delay) for p in products]
        scraped = await asyncio.gather(*tasks)
        
        elapsed = time.time() - start_time
        print(f"Fetched {len(scraped)} pages in {elapsed:.1f}s ({len(scraped)/max(elapsed,0.1):.1f} products/sec)")
        
        sku_to_csv = {p['sku']: p for p in products}
        for item in scraped:
            if item.sku in sku_to_csv:
                item.name = sku_to_csv[item.sku]['name']
            results.append(item)
        
        if download_images:
            print(f"\nDownloading images from Cloudinary...")
            IMAGE_DIR.mkdir(exist_ok=True)
            
            download_tasks = []
            for item in results:
                if item.main_image_url:
                    # Determine extension from URL
                    ext = '.png' if '.png' in item.main_image_url else '.jpg'
                    save_path = IMAGE_DIR / f"{item.sku}_main{ext}"
                    download_tasks.append(download_image(session, item.main_image_url, save_path, semaphore, delay))
                
                for i, alt_url in enumerate(item.alt_image_urls[:5]):  # Max 5 alt images
                    ext = '.png' if '.png' in alt_url else '.jpg'
                    save_path = IMAGE_DIR / f"{item.sku}_alt{i+1}{ext}"
                    download_tasks.append(download_image(session, alt_url, save_path, semaphore, delay))
            
            if download_tasks:
                img_start = time.time()
                img_results = await asyncio.gather(*download_tasks)
                img_elapsed = time.time() - img_start
                success = sum(img_results)
                print(f"Downloaded {success}/{len(download_tasks)} images in {img_elapsed:.1f}s")
    
    return results


def save_results(results, prefix="all"):
    """Save scraped data to JSON."""
    DATA_DIR.mkdir(exist_ok=True)
    
    output_file = DATA_DIR / f"scraped_{prefix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    data = [asdict(r) for r in results]
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"\nSaved results to {output_file}")
    
    success = sum(1 for r in results if not r.error)
    with_images = sum(1 for r in results if r.main_image_url)
    errors = sum(1 for r in results if r.error)
    
    print(f"\nSummary:")
    print(f"  Total products: {len(results)}")
    print(f"  Successful:     {success}")
    print(f"  With images:    {with_images}")
    print(f"  Errors:         {errors}")
    
    # Show sample of found images
    if with_images > 0:
        sample = next((r for r in results if r.main_image_url), None)
        if sample:
            print(f"\nSample image URL ({sample.sku}):")
            print(f"  {sample.main_image_url}")


def main():
    parser = argparse.ArgumentParser(description='Scrape JDS Industries product images')
    parser.add_argument('--prefix', type=str, help='Product prefix to filter (e.g., LWB, LTM)')
    parser.add_argument('--no-images', action='store_true', help='Skip image downloads')
    parser.add_argument('--delay', type=float, default=REQUEST_DELAY, help='Delay between requests')
    args = parser.parse_args()
    
    print("=" * 60)
    print("JDS Industries Product Scraper (Cloudinary)")
    print("=" * 60)
    print(f"Request delay: {args.delay}s")
    print(f"Max concurrent: {MAX_CONCURRENT}")
    print(f"Images hosted on: res.cloudinary.com/business-products")
    
    products = load_skus_from_csv(args.prefix)
    
    if not products:
        print("No products found!")
        return
    
    print(f"\nFound {len(products)} products" + (f" with prefix '{args.prefix}'" if args.prefix else ""))
    
    est_time = (len(products) * args.delay) / MAX_CONCURRENT
    print(f"Estimated time: {est_time:.0f} seconds ({est_time/60:.1f} minutes)")
    
    results = asyncio.run(scrape_products(products, download_images=not args.no_images, delay=args.delay))
    
    save_results(results, args.prefix or "all")


if __name__ == "__main__":
    main()
