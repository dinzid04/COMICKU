
import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the home page
        page.goto("http://localhost:5000/")

        # Search for the manhwa
        search_input = page.get_by_placeholder("Cari manhwa...")
        search_input.fill("How To Fight")
        search_input.press("Enter")

        # Wait for search results to load and click the first card
        page.wait_for_selector('[data-testid^="card-manhwa-"]')
        first_card = page.locator('[data-testid^="card-manhwa-"]').first
        first_card.click()

        # Wait for the detail page to load
        page.wait_for_url(re.compile(r"/manhwa/"))

        # Verify that the cover image is visible
        cover_image = page.locator(".w-64.mx-auto.md\\:mx-0 img")
        expect(cover_image).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Verification script ran successfully and screenshot was taken.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
