from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Go to the home page
        page.goto("http://localhost:5000/", wait_until="networkidle")

        print("Taking a screenshot of the homepage...")
        page.screenshot(path="jules-scratch/verification/debug_homepage.png")
        print("Homepage screenshot saved.")

        # Try a different locator strategy
        print("Attempting to click 'Favorit' link with a different locator...")
        # Using a CSS selector that targets the link containing the text 'Favorit'
        favorit_link = page.locator("a:has-text('Favorit')")

        expect(favorit_link).to_be_visible(timeout=10000)
        print("Link 'Favorit' is visible.")

        favorit_link.click()
        expect(page).to_have_url("http://localhost:5000/favorites")
        print("Successfully navigated to Favorites page.")

        # Take a final screenshot
        screenshot_path = "jules-scratch/verification/verification.png"
        page.screenshot(path=screenshot_path)
        print(f"Final screenshot saved to {screenshot_path}")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)
