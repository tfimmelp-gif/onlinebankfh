import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("all application launch paths use port 4007", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  const dockerfile = await readFile(new URL("../Dockerfile", import.meta.url), "utf8");
  const compose = await readFile(new URL("../compose.yaml", import.meta.url), "utf8");
  const caddy = await readFile(new URL("../infra/Caddyfile", import.meta.url), "utf8");
  const startBatch = await readFile(new URL("../start.bat", import.meta.url), "utf8");
  const stopBatch = await readFile(new URL("../stop.bat", import.meta.url), "utf8");
  assert.match(packageJson, /vinext dev --port 4007/i);
  assert.match(packageJson, /vinext start --port 4007/i);
  assert.match(dockerfile, /PORT=4007/i);
  assert.match(dockerfile, /EXPOSE 4007/i);
  assert.match(compose, /expose:\s*\["4007"\]/i);
  assert.doesNotMatch(compose, /4007:4007/i, "the app port must remain private behind Caddy");
  assert.match(caddy, /app:4007/i);
  assert.match(startBatch, /NORTHSTAR_PORT=4007/i);
  assert.match(startBatch, /Start-Process/i);
  assert.match(startBatch, /WindowStyle Hidden/i);
  assert.match(startBatch, /Invoke-WebRequest/i);
  assert.match(startBatch, /start "" "http:\/\/localhost:%NORTHSTAR_PORT%\//i);
  assert.match(stopBatch, /NORTHSTAR_PORT=4007/i);
  assert.match(startBatch, /node_modules\\vinext\\dist\\cli\.js/i);
  assert.match(stopBatch, /NORTHSTAR_TRACKED_PID/i);
  assert.match(stopBatch, /Stop-Process -Id/i);
});

test("migration enforces a balanced immutable ledger", async () => {
  const sql = await readFile(new URL("../db/migrations/0001_initial.sql", import.meta.url), "utf8");
  assert.match(sql, /unbalanced ledger transaction/i);
  assert.match(sql, /posted ledger entries are immutable/i);
  assert.match(sql, /CREATE VIEW account_statement_entries/i);
  assert.match(sql, /CREATE TABLE transfer_error_definitions/i);
  assert.match(sql, /CREATE TABLE transfer_error_change_log/i);
});

test("portal exposes customer and staff realms", async () => {
  const source = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  const customerSession = await readFile(new URL("../app/api/customer/session/route.ts", import.meta.url), "utf8");
  const customerAuth = await readFile(new URL("../server/auth/customer-session.ts", import.meta.url), "utf8");
  const customerPortal = await readFile(new URL("../app/(customer)/app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /mode: "customer" \| "admin"/);
  assert.match(source, /MFA verified/);
  assert.doesNotMatch(source, /SIMULATION ENVIRONMENT/);
  assert.match(source, /signOutCustomer/i);
  assert.match(source, /Log out of customer portal/i);
  assert.match(source, /customer-menu-logout/i);
  assert.match(customerAuth, /northstar_customer_session/i);
  assert.match(customerSession, /maxAge:\s*0/i);
  assert.match(customerSession, /createCustomerSessionToken/i);
  assert.match(customerAuth, /realm:\s*"CUSTOMER"/i);
  assert.match(customerPortal, /requireCustomerSession/i);
});

test("customer login history records real server-observed session details", async () => {
  const auth = await readFile(new URL("../server/auth/customer-session.ts", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const loginApi = await readFile(new URL("../app/api/customer/session/route.ts", import.meta.url), "utf8");
  const sessionsApi = await readFile(new URL("../app/api/customer/security/sessions/route.ts", import.meta.url), "utf8");
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  assert.match(auth, /sessionId/i);
  assert.match(auth, /isSimulationCustomerSessionActive/i);
  assert.match(service, /CREATE TABLE IF NOT EXISTS sim_customer_login_sessions/i);
  assert.match(service, /revokeSimulationCustomerSession/i);
  assert.match(loginApi, /cf-connecting-ip/i);
  assert.match(loginApi, /x-forwarded-for/i);
  assert.match(loginApi, /user-agent/i);
  assert.match(loginApi, /browserName/i);
  assert.match(loginApi, /operatingSystem/i);
  assert.match(sessionsApi, /listSimulationCustomerSessions/i);
  assert.match(workspace, /Observed IP/i);
  assert.match(workspace, /Full device information/i);
});

test("virtual cards are profile-linked and closed-loop", async () => {
  const sql = await readFile(new URL("../db/migrations/0002_virtual_cards.sql", import.meta.url), "utf8");
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  assert.match(sql, /CREATE TABLE virtual_cards/i);
  assert.match(sql, /REFERENCES users\(id\)/i);
  assert.match(sql, /CREATE TABLE card_authorizations/i);
  assert.match(workspace, /Protect your card details/i);
  assert.match(workspace, /Freeze card/i);
});

test("admin deposit, withdrawal, and website controls are modeled", async () => {
  const sql = await readFile(new URL("../db/migrations/0003_deposits_withdrawals_website.sql", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(sql, /CREATE TABLE deposit_schedules/i);
  assert.match(sql, /CREATE TABLE withdrawal_methods/i);
  assert.match(sql, /CREATE TABLE withdrawal_requests/i);
  assert.match(sql, /CREATE TABLE website_content_revisions/i);
  assert.match(shell, /Manual deposit/i);
  assert.match(shell, /Automatic schedule/i);
  assert.match(shell, /Website management/i);
});

test("website management persists authenticated revisions and drives the public landing page", async () => {
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const adminRoute = await readFile(new URL("../app/admin/api/website/route.ts", import.meta.url), "utf8");
  const publicRoute = await readFile(new URL("../app/api/website/route.ts", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  const landing = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(service, /sim_website_content_revisions/i);
  assert.match(service, /saveSimulationWebsiteRevision/i);
  assert.match(service, /status = 'ARCHIVED'/i);
  assert.match(adminRoute, /verifyAdminSessionToken/i);
  assert.match(adminRoute, /STAFF_AUTH_REQUIRED/i);
  assert.match(publicRoute, /getPublicSimulationWebsite/i);
  assert.match(shell, /AdminWebsiteWorkspace/i);
  assert.match(shell, /Publish website update/i);
  assert.match(landing, /fetch\("\/api\/website"/i);
  assert.match(landing, /websiteSettings\.maintenanceMode/i);
});

test("customer dashboard exposes profile photo and account numbers", async () => {
  const sql = await readFile(new URL("../db/migrations/0004_customer_profile_photo.sql", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const photoRoute = await readFile(new URL("../app/api/customer/profile/photo/route.ts", import.meta.url), "utf8");
  assert.match(sql, /profile_photo_object_key/i);
  assert.match(shell, /customer-photo-frame/i);
  assert.match(shell, /Account number/i);
  assert.match(shell, /resizeProfilePhoto/i);
  assert.match(shell, /\/api\/customer\/profile\/photo/i);
  assert.doesNotMatch(shell, /setProfilePhoto\(URL\.createObjectURL/i);
  assert.match(service, /CREATE TABLE IF NOT EXISTS sim_customer_profiles/i);
  assert.match(service, /saveSimulationProfilePhoto/i);
  assert.match(photoRoute, /saveSimulationProfilePhoto/i);
});

test("admin digital-asset methods expose operational controls", async () => {
  const sql = await readFile(new URL("../db/migrations/0005_e_currency_methods.sql", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(sql, /CREATE TABLE e_currency_methods/i);
  assert.match(sql, /CREATE TABLE customer_e_currency_wallets/i);
  assert.match(sql, /CREATE TABLE e_currency_instructions/i);
  assert.match(shell, /Digital-asset settlement settings/i);
  assert.match(shell, /Digital-asset methods/i);
});

test("customer beneficiaries persist bank and digital-asset details", async () => {
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/customer/beneficiaries/route.ts", import.meta.url), "utf8");
  assert.match(service, /CREATE TABLE IF NOT EXISTS sim_beneficiaries/i);
  assert.match(service, /payment_method IN \('BANK_ACCOUNT','E_CURRENCY'\)/i);
  assert.match(service, /createSimulationBeneficiary/i);
  assert.match(route, /verifyCustomerSessionToken/i);
  assert.match(workspace, /BENEFICIARY NAME/i);
  assert.match(workspace, /COUNTRY CODE/i);
  assert.match(workspace, /ACCOUNT NUMBER/i);
  assert.match(workspace, /ROUTING NUMBER/i);
  assert.match(workspace, /WALLET ADDRESS/i);
  assert.match(workspace, /Digital-asset beneficiary/i);
  assert.match(workspace, /Beneficiary saved/i);
  assert.match(workspace, /beneficiary-confirmation-modal/i);
  assert.match(workspace, /Add another/i);
});

test("live support chat persists customer and staff messages", async () => {
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const panel = await readFile(new URL("../components/LiveChatPanel.tsx", import.meta.url), "utf8");
  const customerApi = await readFile(new URL("../app/api/customer/live-chat/route.ts", import.meta.url), "utf8");
  const adminApi = await readFile(new URL("../app/admin/api/live-chat/route.ts", import.meta.url), "utf8");
  assert.match(service, /CREATE TABLE IF NOT EXISTS sim_live_chat_conversations/i);
  assert.match(service, /CREATE TABLE IF NOT EXISTS sim_live_chat_messages/i);
  assert.match(service, /postSimulationLiveChatMessage/i);
  assert.match(customerApi, /verifyCustomerSessionToken/i);
  assert.match(adminApi, /verifyAdminSessionToken/i);
  assert.match(panel, /document\.visibilityState==="visible"[\s\S]*?10_000/i);
  assert.match(panel, /Secure support channel/i);
  assert.match(panel, /realm:\s*"customer"\s*\|\s*"admin"/i);
});

test("admin transaction management updates persistent balances", async () => {
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(service, /UPDATE sim_accounts SET balance_minor = balance_minor \+ \?/i);
  assert.match(service, /reverseSimulationTransaction/i);
  assert.match(service, /effective_at/i);
  assert.match(shell, /Transaction management/i);
  assert.match(shell, /EFFECTIVE DATE AND TIME/i);
  assert.match(shell, /customer balance was updated/i);
});

test("customer internal transfers post both ledger sides", async () => {
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  assert.match(service, /postSimulationTransfer/i);
  assert.match(service, /'DEBIT'/i);
  assert.match(service, /'CREDIT'/i);
  assert.match(service, /INSUFFICIENT_FUNDS/i);
  assert.match(workspace, /Both of your account balances and transaction histories are now updated/i);
  assert.match(workspace, /Last posted payment first/i);
  assert.match(workspace, /right\.createdAt/i);
});

test("downloaded statements use a branded structured PDF layout", async () => {
  const pdf = await readFile(new URL("../lib/statement-pdf.ts", import.meta.url), "utf8");
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  assert.match(pdf, /NORTHSTAR/i);
  assert.match(pdf, /MONTHLY ACCOUNT STATEMENT/i);
  assert.match(pdf, /TRANSACTION ACTIVITY/i);
  assert.match(pdf, /CURRENT POSTED BALANCE/i);
  assert.match(pdf, /ACCOUNT STATEMENT/i);
  assert.match(pdf, /Page \$\{pageNumber\} of \$\{pageCount\}/i);
  assert.match(workspace, /makeStyledStatementPdf/i);
});

test("external transfers persist pending instructions with visible confirmation", async () => {
  const sql = await readFile(new URL("../db/migrations/0006_external_transfer_requests.sql", import.meta.url), "utf8");
  const decisions = await readFile(new URL("../db/migrations/0007_external_transfer_decisions.sql", import.meta.url), "utf8");
  const compliance = await readFile(new URL("../db/migrations/0008_compliance_transfer_mode.sql", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  const dashboard = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/portal.css", import.meta.url), "utf8");
  assert.match(sql, /CREATE TABLE IF NOT EXISTS sim_transfer_requests/i);
  assert.match(sql, /recipient_address_line1/i);
  assert.match(sql, /status TEXT NOT NULL/i);
  assert.match(service, /createSimulationExternalTransfer/i);
  assert.match(service, /decideSimulationExternalTransfer/i);
  assert.match(service, /SWIFT_BIC_REQUIRED/i);
  assert.match(decisions, /CREATE TABLE IF NOT EXISTS sim_transfer_decisions/i);
  assert.match(decisions, /FLAG_REVIEW/i);
  assert.match(compliance, /CREATE TABLE IF NOT EXISTS sim_stop_code_definitions/i);
  assert.match(compliance, /CREATE TABLE IF NOT EXISTS sim_customer_transfer_controls/i);
  assert.match(compliance, /CREATE TABLE IF NOT EXISTS sim_transfer_compliance_holds/i);
  assert.match(compliance, /CREATE TABLE IF NOT EXISTS sim_customer_compliance_codes/i);
  assert.match(service, /crypto\.subtle\.digest\("SHA-256"/i);
  assert.match(service, /requestSimulationComplianceCode/i);
  assert.match(service, /generateSimulationComplianceCode/i);
  assert.match(service, /submitSimulationComplianceCode/i);
  assert.match(service, /generateSimulationStopCodeCredential/i);
  const transferInsert = service.match(/INSERT INTO sim_transfer_requests\s*\(([\s\S]*?)\)\s*VALUES\s*\(([\s\S]*?)\)`\)/i);
  assert.ok(transferInsert, "external transfer insert should be present");
  const insertColumnCount = transferInsert[1].split(",").map((value)=>value.trim()).filter(Boolean).length;
  const insertPlaceholderCount = (transferInsert[2].match(/\?/g) ?? []).length;
  assert.equal(insertPlaceholderCount, insertColumnCount, "external transfer placeholders must match columns");
  assert.match(dashboard, /Approve & settle/i);
  assert.match(dashboard, /Flag for review/i);
  assert.match(dashboard, /Mode 2 · Compliance-code hold/i);
  assert.match(dashboard, /Generate code to send/i);
  assert.match(dashboard, /Create or update a stop code/i);
  assert.match(dashboard, /Generate customer code/i);
  assert.match(dashboard, /Copy for customer/i);
  assert.match(dashboard, /rejected without a ledger posting/i);
  assert.match(workspace, /Processing your instruction/i);
  assert.match(workspace, /Soft compliance hold/i);
  assert.match(workspace, /Request from operations/i);
  assert.match(workspace, /compliance release code, not a one-time password/i);
  assert.ok((workspace.match(/setTimeout\(resolve,5000\)/g) ?? []).length >= 3, "initial transfer and both code-entry paths should display five-second processing");
  assert.match(workspace, /The transfer remains on hold; open it from Recent transfers whenever you are ready to enter the code/i);
  assert.match(workspace, /Verifying compliance code/i);
  assert.match(workspace, /setVerificationPhase\("success"\)/i);
  assert.match(workspace, /External transfer is pending/i);
  assert.match(workspace, /Print confirmation/i);
  assert.match(workspace, /NORTHSTAR/i);
  assert.match(workspace, /ExternalTransferReceipt/i);
  assert.match(workspace, /TransferRequestDetails/i);
  assert.match(dashboard, /pendingExternalActivity/i);
  assert.match(styles, /position: absolute/i);
  assert.doesNotMatch(styles, /\.receipt-printable\s*\{[^}]*position:\s*fixed/is);
});

test("customer internal transfers require confirmation without exposing configured external mode", async () => {
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(workspace, /Confirm transfer between accounts/i);
  assert.match(workspace, /Confirm customer transfer/i);
  assert.match(workspace, /Review before sending/i);
  assert.match(workspace, /confirmInternalTransfer/i);
  assert.match(workspace, /Both of your account balances will update together/i);
  assert.doesNotMatch(workspace, /This customer’s external transfers pause on a soft hold/i);
  assert.doesNotMatch(workspace, /external-mode-banner/i);
  assert.doesNotMatch(shell, /date:.*Soft compliance hold/i);
});

test("admin can atomically onboard historical statement activity", async () => {
  const sql = await readFile(new URL("../db/migrations/0009_statement_onboarding_deposits_email.sql", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const adminApi = await readFile(new URL("../app/admin/api/banking/route.ts", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(sql, /sim_statement_onboarding_batches/i);
  assert.match(sql, /sim_statement_onboarding_entries/i);
  assert.match(service, /onboardSimulationStatement/i);
  assert.match(service, /STATEMENT_ENTRY_COUNT_INVALID/i);
  assert.match(service, /await db\.batch\(statements\)/i);
  assert.match(adminApi, /STATEMENT_ONBOARD/i);
  assert.match(shell, /Automatic statement onboarding/i);
  assert.match(shell, /Atomic statement injection/i);
});

test("customer deposits use admin-configured bank and crypto instructions", async () => {
  const sql = await readFile(new URL("../db/migrations/0009_statement_onboarding_deposits_email.sql", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const customerApi = await readFile(new URL("../app/api/customer/deposits/route.ts", import.meta.url), "utf8");
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(sql, /sim_customer_deposit_methods/i);
  assert.match(sql, /sim_customer_deposit_requests/i);
  assert.match(service, /saveSimulationDepositMethod/i);
  assert.match(service, /decideSimulationDepositRequest/i);
  assert.match(customerApi, /verifyCustomerSessionToken/i);
  assert.match(workspace, /Admin-configured instructions/i);
  assert.match(workspace, /Submit deposit for review/i);
  assert.match(shell, /Publish deposit instructions/i);
  assert.match(shell, /approved and credited to the customer ledger/i);
});

test("signup login transfer and deposit events queue email alerts", async () => {
  const sql = await readFile(new URL("../db/migrations/0009_statement_onboarding_deposits_email.sql", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const login = await readFile(new URL("../app/api/customer/session/route.ts", import.meta.url), "utf8");
  const signup = await readFile(new URL("../app/api/customer/signup/route.ts", import.meta.url), "utf8");
  const signupForm = await readFile(new URL("../components/CustomerSignupForm.tsx", import.meta.url), "utf8");
  assert.match(sql, /CREATE TABLE IF NOT EXISTS sim_email_alerts/i);
  assert.match(sql, /'SIGNUP','LOGIN','TRANSFER','DEPOSIT'/i);
  assert.match(service, /queueSimulationEmailAlert/i);
  assert.match(service, /RESEND_API_KEY/i);
  assert.match(service, /https:\/\/api\.resend\.com\/emails/i);
  assert.match(service, /authorization:\s*`Bearer \$\{resendApiKey\}`/i);
  assert.match(service, /idempotency-key/i);
  assert.match(service, /RESEND_FROM_EMAIL/i);
  assert.match(login, /eventType:\s*"LOGIN"/i);
  assert.match(signup, /eventType:\s*"SIGNUP"/i);
  assert.match(service, /eventType:\s*"TRANSFER"/i);
  assert.match(service, /eventType:\s*"DEPOSIT"/i);
  assert.match(signupForm, /confirmation email has been sent/i);
});

test("simulation disclosure is isolated to the compliance section", async () => {
  const landing = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const disclosure = await readFile(new URL("../app/simulation-disclosure/page.tsx", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  const customerAuth = await readFile(new URL("../components/AuthScreen.tsx", import.meta.url), "utf8");
  const adminAuth = await readFile(new URL("../app/admin/login/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(landing, /SIMULATION ENVIRONMENT · NO REAL FUNDS OR LIVE PAYMENT RAILS/i);
  assert.doesNotMatch(shell, /SIMULATION ENVIRONMENT · NO REAL FUNDS OR LIVE PAYMENT RAILS/i);
  assert.doesNotMatch(customerAuth, /TRAINING ENVIRONMENT/i);
  assert.doesNotMatch(adminAuth, /AUTHORIZED TRAINING STAFF/i);
  assert.match(landing, /simulation-disclosure/i);
  assert.match(disclosure, /simulated banking portal created exclusively/i);
  assert.match(disclosure, /does not hold real funds/i);
});

test("customer signup and login require expiring email OTP verification", async () => {
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const signupRoute = await readFile(new URL("../app/api/customer/signup/route.ts", import.meta.url), "utf8");
  const loginRoute = await readFile(new URL("../app/api/customer/session/route.ts", import.meta.url), "utf8");
  const signupForm = await readFile(new URL("../components/CustomerSignupForm.tsx", import.meta.url), "utf8");
  const loginForm = await readFile(new URL("../components/CustomerLoginForm.tsx", import.meta.url), "utf8");
  assert.match(service, /sim_email_verification_challenges/i);
  assert.match(service, /hashEmailOtp/i);
  assert.match(service, /10 \* 60_000/i);
  assert.match(service, /max_attempts.*5/is);
  assert.match(service, /EMAIL_OTP_RATE_LIMITED/i);
  assert.match(signupRoute, /REQUEST_VERIFICATION/i);
  assert.match(signupRoute, /VERIFY_EMAIL/i);
  assert.match(loginRoute, /REQUEST_OTP/i);
  assert.match(loginRoute, /VERIFY_OTP/i);
  assert.match(signupForm, /Check your inbox/i);
  assert.match(loginForm, /Verify your email/i);
});

test("new customer profiles always start fresh and empty", async () => {
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const adminRoute = await readFile(new URL("../app/admin/api/banking/route.ts", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  const creation = service.match(/export async function createFreshCustomerProfile[\s\S]*?\n}\n/);
  assert.ok(creation, "fresh customer creation service should exist");
  assert.match(creation[0], /sim_customer_directory/i);
  assert.match(creation[0], /accountCount:\s*0/i);
  assert.match(creation[0], /transactionCount:\s*0/i);
  assert.match(creation[0], /balanceMinor:\s*0/i);
  assert.doesNotMatch(creation[0], /INSERT INTO sim_accounts/i);
  assert.doesNotMatch(creation[0], /INSERT INTO sim_transactions/i);
  assert.match(adminRoute, /CUSTOMER_CREATE/i);
  assert.match(shell, /Fresh customer profile/i);
  assert.match(shell, /no accounts, balances, cards, or transaction history/i);
});

test("customer settings are polished and admin credentials hint is removed", async () => {
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  const adminLogin = await readFile(new URL("../components/AdminLoginForm.tsx", import.meta.url), "utf8");
  assert.match(workspace, /Security & settings/i);
  assert.match(workspace, /Your security settings are up to date/i);
  assert.match(workspace, /Communication preferences/i);
  assert.doesNotMatch(adminLogin, /Staff access credentials/i);
});

test("portal clocks and customer transaction timestamps use live server time", async () => {
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  const workspace = await readFile(new URL("../components/CustomerWorkspaces.tsx", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/customer/transfers/route.ts", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  assert.match(shell, /setInterval\(update, 1_000\)/i);
  assert.match(shell, /timeZoneName:\s*"short"/i);
  assert.doesNotMatch(shell, /Friday, July 24, 2026/i);
  assert.doesNotMatch(shell, /fallback-1/i);
  assert.match(workspace, /effectiveAt:\s*new Date\(\)\.toISOString\(\)/i);
  assert.doesNotMatch(workspace, /defaultValue="2026-07-26"/i);
  assert.match(route, /scheduledFor:\s*requestedSchedule\.toISOString\(\)/i);
  assert.match(route, /effectiveAt:\s*new Date\(\)\.toISOString\(\)/i);
  assert.match(service, /const effectiveAt = createdAt/i);
  assert.match(service, /description, decidedAt, decidedAt/i);
});

test("admin KYC activation, customer statuses, and password resets are persistent", async () => {
  const migration = await readFile(new URL("../db/migrations/0011_customer_account_status_passwords.sql", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const adminApi = await readFile(new URL("../app/admin/api/banking/route.ts", import.meta.url), "utf8");
  const loginApi = await readFile(new URL("../app/api/customer/session/route.ts", import.meta.url), "utf8");
  const session = await readFile(new URL("../server/auth/customer-session.ts", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(migration, /sim_customer_account_statuses/i);
  assert.match(migration, /'ACTIVE','INACTIVE','IN_REVIEW'/i);
  assert.match(migration, /sim_customer_credentials/i);
  assert.match(service, /decideSimulationCustomerKyc/i);
  assert.match(service, /VALUES \(\?, \?, \?, 'CHECKING', \?, 0, \?\)/i);
  assert.match(service, /updateSimulationCustomerAccountStatus/i);
  assert.match(service, /SELECT d\.user_id AS userId/i);
  assert.match(service, /ORDER BY d\.created_at DESC/i);
  assert.match(service, /resetSimulationCustomerPassword/i);
  assert.match(service, /PBKDF2/i);
  assert.match(service, /password_reset_required = 1/i);
  assert.match(service, /UPDATE sim_customer_login_sessions SET revoked_at/i);
  assert.match(adminApi, /CUSTOMER_STATUS_SET/i);
  assert.match(adminApi, /CUSTOMER_PASSWORD_RESET/i);
  assert.match(adminApi, /KYC_DECISION/i);
  assert.match(loginApi, /authenticateSimulationCustomer/i);
  assert.match(loginApi, /CHANGE_PASSWORD/i);
  assert.match(session, /createCustomerSessionToken\(email: string, userId: string, rememberMe = false\)/i);
  assert.match(shell, /Approve & activate/i);
  assert.match(shell, /Reset customer password/i);
  assert.match(shell, /<option value="ACTIVE">Active<\/option>/i);
  assert.match(shell, /<option value="INACTIVE">Inactive<\/option>/i);
  assert.match(shell, /<option value="IN_REVIEW">In review<\/option>/i);
});

test("security hardening protects admin reads, request boundaries, and transfer integrity", async () => {
  const adminApi = await readFile(new URL("../app/admin/api/banking/route.ts", import.meta.url), "utf8");
  const requestGuard = await readFile(new URL("../server/security/request.ts", import.meta.url), "utf8");
  const service = await readFile(new URL("../server/d1/sim-bank.ts", import.meta.url), "utf8");
  const caddy = await readFile(new URL("../infra/Caddyfile", import.meta.url), "utf8");
  const brandUpload = await readFile(new URL("../app/admin/api/brand-logo/route.ts", import.meta.url), "utf8");
  assert.match(adminApi, /GET\(request:Request\)[\s\S]*?verifyAdminSessionToken/i);
  assert.match(requestGuard, /CROSS_SITE_REQUEST_REJECTED/i);
  assert.match(requestGuard, /REQUEST_BODY_TOO_LARGE/i);
  assert.match(service, /simulationBankInitialization/i);
  assert.match(service, /sim_accounts_customer_nonnegative_balance/i);
  assert.match(service, /sim_idempotency_records/i);
  assert.match(service, /sim_security_rate_limits/i);
  assert.match(service, /sim_security_rate_limits\.request_count\+1/i);
  assert.match(caddy, /max_size 12MB/i);
  assert.doesNotMatch(brandUpload, /image\/svg\+xml/i);
});
