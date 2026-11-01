import asyncio
from playwright.async_api import async_playwright

BASE = "http://localhost:3100"
errors = []
console_errors = []

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))

        def report(label, ok, extra=""):
            print(f"{'OK ' if ok else 'FAIL'} - {label} {extra}")

        # 1. Landing page
        await page.goto(BASE + "/", wait_until="networkidle")
        report("Landing page loads", await page.title() != "")
        await page.click("text=Book a Service")
        await page.wait_for_url("**/doctors")
        report("Landing -> Book a Service -> /doctors", True)

        # 2. Doctors page: search, book requires login redirect
        await page.goto(BASE + "/doctors", wait_until="networkidle")
        count_before = await page.locator("text=Book Appointment").count()
        report("Doctors page shows Book Appointment buttons", count_before > 0, f"count={count_before}")
        await page.fill('input[placeholder*="Dr. Lin"]', "Rostova")
        await page.click("text=Search")
        await page.wait_for_timeout(300)
        cards = await page.locator("text=Dr. Elena Rostova").count()
        report("Doctor search filters results", cards > 0)
        await page.click("text=Book Appointment")
        await page.wait_for_url("**/login")
        report("Booking while logged out redirects to /login", True)

        # 3. Signup
        await page.goto(BASE + "/login", wait_until="networkidle")
        await page.click("text=Sign Up")
        await page.fill('input[name="name"]', "UI Test User")
        await page.fill('input[name="email"]', "uitest@example.com")
        await page.fill('input[name="phone"]', "+1 555 777 8888")
        await page.fill('input[name="password"]', "password123")
        await page.click('button:has-text("Create Account")')
        await page.wait_for_url("**/dashboard", timeout=5000)
        report("Signup -> redirected to /dashboard", True)

        # 4. Navbar profile dropdown
        await page.click('button:has-text("UI")')
        await page.wait_for_timeout(200)
        visible = await page.locator("text=My Profile").is_visible()
        report("Profile dropdown opens and shows My Profile", visible)
        await page.click("text=My Profile")
        await page.wait_for_url("**/profile")
        report("Profile dropdown -> /profile navigation", True)

        # 5. Doctors booking flow end-to-end
        await page.goto(BASE + "/doctors", wait_until="networkidle")
        await page.locator("text=Book Appointment").first.click()
        await page.wait_for_timeout(500)
        modal_visible = await page.locator("text=Select a time slot").is_visible()
        report("Booking modal opens with slot picker", modal_visible)
        # pick first available slot
        modal = page.locator(".fixed.inset-0")
        slot_buttons = await modal.locator("div.grid.grid-cols-4 button:not([disabled])").all()
        report("Available (non-disabled) slot buttons rendered", len(slot_buttons) > 0, f"count={len(slot_buttons)}")
        if slot_buttons:
            await slot_buttons[0].click()
        continue_btn = modal.locator('button:has-text("Continue to Payment")')
        is_disabled = await continue_btn.is_disabled()
        report("Continue to Payment enabled after slot selection", not is_disabled)
        await continue_btn.click()
        await page.wait_for_timeout(300)
        payment_visible = await modal.locator("text=Cardholder Name").is_visible()
        report("Payment step renders after Continue", payment_visible)
        await modal.locator('input[placeholder="4242 4242 4242 4242"]').fill("4242424242424242")
        await modal.locator('button:has-text("Pay & Confirm Booking")').click()
        await page.wait_for_url("**/dashboard", timeout=5000)
        report("Payment confirm -> redirected to /dashboard", True)
        await page.wait_for_selector("text=Cancel Booking", timeout=5000)
        booking_row = await page.locator("text=Cancel Booking").count()
        report("New booking shows Cancel Booking button", booking_row > 0)

        # 6. Cancel booking flow
        await page.click('button:has-text("Cancel Booking")')
        await page.wait_for_timeout(300)
        confirm_visible = await page.locator("text=Are you sure you want to cancel").is_visible()
        report("Cancel confirmation modal appears", confirm_visible)
        await page.click('button:has-text("Yes, Cancel Booking")')
        await page.wait_for_timeout(500)
        cancelled_visible = await page.locator("text=Cancelled").first.is_visible()
        report("Booking status shows Cancelled after confirm", cancelled_visible)

        # 7. Caretakers page + filters
        await page.goto(BASE + "/caretakers", wait_until="networkidle")
        await page.click("text=Nursing")
        await page.wait_for_timeout(300)
        nurse_visible = await page.locator("text=Sarah Jenkins").is_visible()
        report("Caretaker Nursing filter shows Sarah Jenkins", nurse_visible)
        await page.click("text=Clear All")
        await page.wait_for_timeout(300)

        # 8. Skin check
        await page.goto(BASE + "/skin-check", wait_until="networkidle")
        upload_visible = await page.locator("text=Click to upload a photo").is_visible()
        report("Skin check upload zone visible", upload_visible)

        # 9. Provider registration
        await page.goto(BASE + "/provider-register", wait_until="networkidle")
        await page.fill('input[name="fullName"]', "Dr. New Test")
        await page.fill('input[name="email"]', "newtest@clinic.com")
        await page.fill('input[name="phone"]', "+1 555 111 2222")
        await page.select_option('select[name="field"]', "Doctor")
        await page.click('label:has-text("Weekdays")')
        await page.click('button:has-text("Submit Application")')
        await page.wait_for_timeout(500)
        success_msg = await page.locator("text=Application submitted").is_visible()
        report("Provider application submits successfully", success_msg)

        # 10. Logout
        await page.click('button:has-text("UI")')
        await page.wait_for_timeout(200)
        await page.click("text=Logout")
        await page.wait_for_url(BASE + "/")
        report("Logout redirects to landing", True)

        # 11. Admin login flow
        await page.goto(BASE + "/admin/login", wait_until="networkidle")
        await page.fill('input[name="adminId"]', "wrong@x.com")
        await page.fill('input[name="password"]', "wrong")
        await page.click('button:has-text("Sign In as Admin")')
        await page.wait_for_timeout(400)
        bad_login_msg = await page.locator("text=Invalid admin ID").is_visible()
        report("Wrong admin credentials show error", bad_login_msg)

        await page.fill('input[name="adminId"]', "admin@aurora_care")
        await page.fill('input[name="password"]', "admin@aurora123")
        await page.click('button:has-text("Sign In as Admin")')
        await page.wait_for_url("**/admin/dashboard", timeout=5000)
        report("Correct admin credentials -> /admin/dashboard", True)

        # 12. Admin dashboard tabs
        for tab_text in ["Applications", "Doctor Management", "Caretaker Management", "Bookings", "Payments", "Notifications", "Stats"]:
            await page.click(f'button:has-text("{tab_text}")')
            await page.wait_for_timeout(300)
            report(f"Admin tab '{tab_text}' clickable", True)

        # 13. Admin add doctor
        await page.click('button:has-text("Doctor Management")')
        await page.wait_for_timeout(200)
        await page.fill('input[name="name"]', "Dr. UI Added")
        await page.fill('input[name="specialty"]', "Testing")
        await page.fill('input[name="phone"]', "+1 555 000 9999")
        await page.fill('input[name="fee"]', "99")
        await page.click('button:has-text("Add Doctor")')
        await page.wait_for_timeout(500)
        added_visible = await page.locator("text=Dr. UI Added").is_visible()
        report("Admin add-doctor form creates new doctor row", added_visible)

        # remove it
        row = page.locator("tr", has_text="Dr. UI Added")
        await row.locator('button:has-text("Remove")').click()
        await page.wait_for_timeout(500)
        removed = await page.locator("text=Dr. UI Added").count() == 0
        report("Admin remove-doctor button removes the row", removed)

        # 14. Admin logout
        await page.click('button:has-text("Logout")')
        await page.wait_for_url(BASE + "/", timeout=5000)
        report("Admin logout redirects to landing", True)

        await browser.close()

asyncio.run(run())
print("\n--- Console errors ---")
for e in console_errors:
    print(e)
print("\n--- Page (uncaught) errors ---")
for e in errors:
    print(e)
