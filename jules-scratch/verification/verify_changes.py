from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Verify Homepage
    page.goto("http://localhost:5000")

    # Wait for the welcome banner to be visible
    welcome_banner = page.locator("section:has-text('Baca Komik Gak Ribet')")
    expect(welcome_banner).to_be_visible(timeout=20000)

    page.screenshot(path="jules-scratch/verification/homepage.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
