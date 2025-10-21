from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the home page
        page.goto("http://localhost:5000")

        # Expect the Login button to be visible
        login_button = page.get_by_role("link", name="Login")
        expect(login_button).to_be_visible()

        # Take a screenshot of the home page
        page.screenshot(path="jules-scratch/verification/01_home_page.png")

        # Click the login button to navigate to the auth page
        login_button.click()

        # Expect the page to be the auth page
        expect(page).to_have_url("http://localhost:5000/auth")

        # Expect the "Sign In" heading to be visible
        signin_heading = page.get_by_role("heading", name="Sign In")
        expect(signin_heading).to_be_visible()

        # Take a screenshot of the auth page
        page.screenshot(path="jules-scratch/verification/02_auth_page.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)
