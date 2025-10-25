from playwright.sync_api import sync_playwright
import os

def run(playwright):
    output_dir = "jules-scratch/verification"
    os.makedirs(output_dir, exist_ok=True)

    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Halaman Utama
        print("Membuka halaman utama...")
        page.goto("http://localhost:5000", timeout=30000)
        page.wait_for_timeout(2000) # Tunggu sebentar untuk rendering
        home_screenshot_path = os.path.join(output_dir, "verification.png")
        page.screenshot(path=home_screenshot_path)
        print(f"Screenshot halaman utama disimpan di {home_screenshot_path}")

        # Dasbor Admin
        print("Membuka dasbor admin...")
        page.goto("http://localhost:5000/admin", timeout=30000)
        page.wait_for_timeout(2000)
        admin_screenshot_path = os.path.join(output_dir, "admin_dashboard.png")
        page.screenshot(path=admin_screenshot_path)
        print(f"Screenshot dasbor admin disimpan di {admin_screenshot_path}")

    except Exception as e:
        print(f"Terjadi error: {e}")
        error_screenshot_path = os.path.join(output_dir, "error.png")
        page.screenshot(path=error_screenshot_path)
        print(f"Screenshot error disimpan di {error_screenshot_path}")

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
