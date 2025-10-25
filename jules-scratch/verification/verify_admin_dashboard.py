from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Navigate to the home page and take a screenshot
    page.goto("http://localhost:5000")
    page.screenshot(path="jules-scratch/verification/home_page.png")

    # Navigate to the admin page and take a screenshot
    page.goto("http://localhost:5000/admin")
    page.screenshot(path="jules-scratch/verification/admin_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
