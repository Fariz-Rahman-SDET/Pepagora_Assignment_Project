# Pepagora — Post Buying Request QA Test Plan

## 1. Project Overview

| Item | Detail |
|---|---|
| Application | Pepagora |
| Feature | Post Buying Request |
| Environment | Sandbox |
| Entry URL | `https://www.sandbox.pepagora.org/post-buying-request` |
| Plan status | Exploratory draft based on observed UI; business requirements are incomplete |
| Automation | Safe Chromium Playwright suite implemented for selected non-submitting scenarios; see section 16 |
| Proposed scenarios | Registration: 4; Login: 4; Basic Buying Request: 9; Enrichment: 9; End-to-End: 4. Total: 30. |

The plan separates observed UI and behavior from unverified expectations. Unless an observed result is explicitly recorded, an expected result means “observe and compare with an approved requirement,” not a guessed acceptance rule.

## 2. Scope of Testing

- Registration and login entry points, phone-based forms, visible country selector, client-side messages, and authentication navigation.
- Basic Buying Request content, product and quantity inputs, unit options, post-type choices, required-field messages, and navigation to Enrichment.
- Enrichment questions and choices, destination/logistics, budget/payment options, additional details, final action labels, and navigation/data retention.
- Positive, negative, boundary, optional-field, recovery, and end-to-end scenarios where these can be performed without creating accounts or posting requests.
- Console/browser observations and environment blockers.

## 3. Out of Scope

- Creating a Pepagora account, completing OTP verification, logging in, or testing duplicate-account behavior with a real number.
- Activating `Publish as a Hot Lead`, `Skip enrichment - post as basic Active listing`, or `Skip & post basic →`.
- Creating a commercial buying request, contacting suppliers, or confirming quote delivery.
- Payment processing, backend/database/API correctness, security testing, load/performance testing, and production behavior.
- Any pass/fail conclusion for rules not confirmed by product requirements.

## 4. Application Access and Environment

| Attribute | Observation / requirement |
|---|---|
| Access URL | `https://www.sandbox.pepagora.org/post-buying-request` |
| Page title | `Pepagora` on Post Buying Request; `Supplier & Buyer Authentication \| Secure B2B Marketplace` on authentication pages |
| Authentication state | Unauthenticated during exploration |
| Browser | Playwright MCP browser; exact browser build and viewport were not recorded |
| Test account / phone | None provided; no valid number or credentials used |
| Test inputs used | Non-sensitive sample product text and quantity/unit for navigation; an invalid phone-format sample for client-side validation |
| Request submission | Not performed |
| Evidence | Live page snapshots and console output in the current exploration session; rerun and attach fresh evidence for formal execution |

## 5. Observed Application Navigation

1. The unauthenticated header on the buying-request page showed `Login` linking to `/authenticate?mode=login` and `Join Free` linking to `/authenticate?mode=signup`.
2. The page heading was `Post Buying Requirement`. Its progress labels were `Quick Post`, `Enrich for Better Responses`, and `Live & Receiving Quotes`.
3. The first step was headed `What are you looking for?`. It showed `Product Name`, a quantity field labelled `Quantity Required - How much do you need?`, post-type choices, and `Continue to Enrich`.
4. An empty attempt to continue showed `Product name is required` and `Unit is required`. No final posting was attempted.
5. With a harmless sample product, quantity `1`, and unit `Piece`, `Continue to Enrich` moved to the same URL and displayed `Phase 2 of 2 - Enrichment`, `Help sellers give you their best quote`, and a summary of the sample product and quantity.
6. Enrichment displayed `Back`, `Publish as a Hot Lead`, `Skip enrichment - post as basic Active listing`, and `Skip & post basic →`. These final/posting actions were not activated.
7. `Back` returned to Basic. Product, quantity, unit, and the selected/default enriched-post card were retained in the observed run. A budget choice made in Enrichment did not remain selected after returning and re-entering Enrichment.
8. The registration and login screens were reachable from the actual header links. Both showed phone-based entry with country code selection, `Continue with Phone`, `Continue with Google`, terms/privacy links, and a cross-link to the other authentication mode.
9. On signup, the visible text said `We’ll be sending code to verify your number.` No OTP screen was reached in the initial exploration. No email or password field, CAPTCHA, or email-verification control was visible in the inspected authentication screens.
10. Enrichment smart-question content varied between visits for the same sample product. Record the rendered questions and choices for each execution rather than treating one observed set as a universal fixed list.

### Observed Basic controls and copy

- Product input: text input with `combobox` role; placeholder `e.g. Brazilian Virgin Hair, Organic Cotton T Shirts...`; helper copy says to be specific and that leaving the field loads AI category ideas.
- Quantity input: value `1` in the observed initial state; placeholder `1`; no HTML `type` attribute was exposed.
- Unit dropdown choices observed: `Piece`, `Box`, `Ton`, `Set`, `Litre`, `Kg`, `Meter`, `Dozen`, `Sqft`, `Can`, `Roll`, `Coil`, `Style`, `kms`, `Person`.
- `Enriched post` was marked `Recommended` and described `Quotes expected 6–9`, `Hot Lead status`, `Spec-matched sellers`, and `AI quality moderation`.
- `Post basic` was described `Quotes expected 3–5`, `Hot Lead status`, `Category-matched`, and `Basic listing live`.
- Other visible copy included `What happens when you submit?`, `Lead captured instantly`, `We ask a few more questions (~3 min)`, `Posted to verified sellers`, and `No credit card required - Free to post`. These are displayed claims, not verified service outcomes.

### Observed Enrichment controls and copy

- Header: `Phase 2 of 2 - Enrichment`; `Help sellers give you their best quote`; a lead-score display; `Skip & post basic →`.
- `Smart Questions` showed question cards with `+ Add value` controls and `Add More Attributes / not in the list above? Add your own`.
- One visit showed:
  - `What is the primary use for the tote bags? *`: `Retail resale`, `Promotional giveaways`, `Corporate gifts`, `Event merchandising`.
  - `What quantity are you looking to order? *`: `50-100`, `101-500`, `501-1000`, `>1000`.
  - `What is the most important factor affecting your budget? *`: `Material type`, `Shipping costs`, `Lead time`, `Print customization`.
  - `When do you need the tote bags delivered?`: `<2 weeks`, `2-4 weeks`, `4-6 weeks`, `Flexible timing`.
- A later visit showed different dynamically rendered questions/options for the sample product, including `What is the target price range per unit? *`. Exact question values are therefore to be captured during each run.
- `Logistics & Destination` showed `Required Lead Time` (`under 7 days`, `7-14 days`, `15-30 days`, `Flexible`); `Is this a recurring order?` (`One-time`, `Monthly recurring`, `Quarterly`); `Destination country` (observed value `India`, placeholder `e.g. India`); `Port / city` (observed value `Mumbai, Maharashtra`, placeholder `e.g. Chennai`); and `Preferred Shipping Terms` (`CIF Cost, Insurance and Freight`, `FOB Free on Board`, `DDP Delivered Duty Paid`, `Any / Negotiable`).
- `Budget & Payment` showed `Yes, set a range` and `No, I'll evaluate quotes`. Selecting the former revealed `From`, `To`, and `Currency` inputs and a `Select Currency` dropdown. Observed currency options: `₹ - INR`, `$ - USD`, `د.إ - AED`, `€ - EUR`, `£ - GBP`, `¥ - JPY`.
- `Payment Terms You Accept` showed `LC-Letter of Credit`, `TT- Telegraphic Transfer`, `100% Advanced`, `50% Advance and 50% Dispatch`, `Net 30/60`, `Escrow`, `Cash on delivery`, and `Custom Payment Terms`.
- `Anything else?` contained `Additional details` and a textarea with placeholder `Additional details suppliers should know…`.
- A visible information notice said the listing would be reviewed by an AI moderation agent before being published to verified sellers.

### Observed registration and login controls

- Signup URL: `/authenticate?mode=signup`; heading `Create free account`; field label `Mobile number`; tel input placeholder `Enter mobile number`; initial displayed country `India` / `+91`; searchable country selector; helper text `We’ll be sending code to verify your number.`; button `Continue with Phone`; `Continue with Google`; links `Terms of Use`, `Privacy Policy`, and `Sign in`.
- Login URL: `/authenticate?mode=login`; heading `Login to your account`; same visible phone field and controls; cross-link `Create an account`.
- Clicking `Continue with Phone` with an empty or clearly invalid phone value showed `Enter a Valid Mobile Number`. No valid phone was entered and no OTP was captured.
- During the invalid-input exploration the displayed country changed from India to Bolivia (`+591`). This was not investigated sufficiently to determine whether it was caused by phone parsing, selector state, or the test environment.
- The authentication console log included a failed `identity-api.sandbox.pepagora.org/auth/sendOtp` request with HTTP 500 after an invalid-input interaction. This blocks conclusions about successful OTP delivery and requires a controlled rerun with an approved sandbox test number.

## 6. Registration Test Scenarios

### REG-001 — Open registration from Join Free

- **Test Case ID:** REG-001
- **Test Case Title:** Open signup from the buying-request header
- **Module:** Registration
- **Test Type:** Navigation / positive
- **Priority:** P1
- **Preconditions:** Unauthenticated session on the target buying-request URL.
- **Test Data:** None.
- **Steps to Execute:** Activate `Join Free`; record URL, title, visible fields, links, controls, and messages. Do not enter a number.
- **Expected Result:** Signup page opens from the observed link `/authenticate?mode=signup`; compare the rendered form with the observed phone-only screen. Do not assume account creation.
- **Evidence or Observation:** Observed: heading `Create free account`, Mobile number, searchable country selector, `Continue with Phone`, `Continue with Google`, Terms/Privacy, and `Sign in`.
- **Automation Feasibility:** High for navigation and static labels; OTP/account creation requires an approved test fixture.
- **Execution Status:** Observed; formal rerun not performed.

### REG-002 — Validate empty phone on signup

- **Test Case ID:** REG-002
- **Test Case Title:** Check required phone validation without sending a code
- **Module:** Registration
- **Test Type:** Negative / mandatory-field validation
- **Priority:** P1
- **Preconditions:** Signup screen is open; phone field is empty.
- **Test Data:** Blank phone.
- **Steps to Execute:** Activate `Continue with Phone` once; record validation and any network response; stop without retrying.
- **Expected Result:** Record the actual result and compare with the approved signup validation requirement. Do not infer whether a backend call should occur.
- **Evidence or Observation:** Observed message: `Enter a Valid Mobile Number`. No OTP screen appeared.
- **Automation Feasibility:** High for client-side message; network assertion requires approved test expectations.
- **Execution Status:** Observed; no account created.

### REG-003 — Reject malformed phone input

- **Test Case ID:** REG-003
- **Test Case Title:** Explore malformed phone validation and country-code behavior
- **Module:** Registration
- **Test Type:** Negative / invalid format
- **Priority:** P1
- **Preconditions:** Signup screen open; use only a clearly synthetic, non-routable invalid value and do not retry.
- **Test Data:** Invalid short numeric string; never use a real phone number.
- **Steps to Execute:** Enter the invalid value; activate `Continue with Phone` once; record the message, displayed country/code, URL, and network outcome.
- **Expected Result:** Compare with documented phone-format and country-selection rules. No particular country switch or OTP outcome is assumed.
- **Evidence or Observation:** `Enter a Valid Mobile Number` was displayed; country display changed from India `+91` to Bolivia `+591` during exploration. A later console entry showed HTTP 500 from `/auth/sendOtp`; correlation and expected behavior require confirmation.
- **Automation Feasibility:** Medium; use a sandbox-only synthetic fixture and stub OTP delivery if approved.
- **Execution Status:** Observed exploratory behavior; needs controlled rerun.

### REG-004 — Verify OTP and duplicate-account paths

- **Test Case ID:** REG-004
- **Test Case Title:** Verify authorized signup, OTP, and duplicate-number handling
- **Module:** Registration
- **Test Type:** Positive / negative / end-to-end
- **Priority:** P1
- **Preconditions:** Product-approved disposable sandbox number, permission to create an account, and expected duplicate-account behavior documented.
- **Test Data:** Approved test number only; do not place the number, OTP, or other secrets in the plan or logs.
- **Steps to Execute:** Under authorization, submit the test number once; observe the next step and verification mechanism; use one approved test OTP only if supplied; test duplicate behavior only against a test account and only with approval.
- **Expected Result:** Compare verification, account creation, duplicate handling, and recovery with confirmed requirements. No assumed OTP screen or account outcome.
- **Evidence or Observation:** Signup copy says a code will be sent; OTP and duplicate-account behavior were not reached or tested.
- **Automation Feasibility:** Conditional; requires protected test secrets and OTP test integration.
- **Execution Status:** Blocked: no valid test number, OTP, or account-creation authorization.

## 7. Login Test Scenarios

### LOG-001 — Open login from the buying-request header

- **Test Case ID:** LOG-001
- **Test Case Title:** Open Login from the unauthenticated header
- **Module:** Login
- **Test Type:** Navigation / positive
- **Priority:** P1
- **Preconditions:** Unauthenticated session on the target URL.
- **Test Data:** None.
- **Steps to Execute:** Activate `Login`; record destination, visible form, and cross-links without entering credentials.
- **Expected Result:** Login opens at `/authenticate?mode=login`; compare visible UI with observed `Login to your account` screen.
- **Evidence or Observation:** Observed phone input, country selector, `Continue with Phone`, `Continue with Google`, Terms/Privacy, and `Create an account`.
- **Automation Feasibility:** High for route and rendered UI.
- **Execution Status:** Observed; formal rerun not performed.

### LOG-002 — Validate empty phone on login

- **Test Case ID:** LOG-002
- **Test Case Title:** Check empty login phone validation
- **Module:** Login
- **Test Type:** Negative / mandatory-field validation
- **Priority:** P1
- **Preconditions:** Login screen open; phone field empty.
- **Test Data:** Blank phone.
- **Steps to Execute:** Activate `Continue with Phone` once; capture the message and network result; do not retry.
- **Expected Result:** Compare with confirmed validation and service-call expectations.
- **Evidence or Observation:** The screen showed `Enter a Valid Mobile Number`; an OTP screen was not reached. The console log later recorded HTTP 500 from the sandbox `auth/sendOtp` endpoint after invalid-input exploration.
- **Automation Feasibility:** High for visible message; backend assertion needs expected response criteria.
- **Execution Status:** Observed; auth success blocked.

### LOG-003 — Explore malformed login phone input

- **Test Case ID:** LOG-003
- **Test Case Title:** Check invalid phone format and recovery on login
- **Module:** Login
- **Test Type:** Negative / error recovery
- **Priority:** P1
- **Preconditions:** Login screen open; approved test policy permits one malformed-input attempt.
- **Test Data:** Clearly invalid synthetic phone string; no real number or credentials.
- **Steps to Execute:** Enter the approved invalid value; submit once; record error, country-code display, URL, and whether clearing the field restores a usable state. Stop on any unexpected request/error.
- **Expected Result:** Compare messages, normalization, and recovery with confirmed requirements; no lockout or country behavior is presumed.
- **Evidence or Observation:** Invalid-input exploration on signup displayed `Enter a Valid Mobile Number`; login displayed the same message with no credentials. Country selection changed during the invalid signup interaction.
- **Automation Feasibility:** Medium; avoid repeatedly calling OTP services.
- **Execution Status:** Partially observed; controlled login-specific invalid-value run not performed.

### LOG-004 — Verify login with approved account

- **Test Case ID:** LOG-004
- **Test Case Title:** Complete authorized login and verify return path
- **Module:** Login
- **Test Type:** Positive / end-to-end
- **Priority:** P1
- **Preconditions:** Approved sandbox credentials and test OTP procedure; expected destination and session behavior documented.
- **Test Data:** Approved account only; never store credentials or OTP in plan/evidence.
- **Steps to Execute:** Complete login once using the approved procedure; record visible success state and destination; verify return to the buying-request flow if required.
- **Expected Result:** Compare with confirmed login and return-path requirements. Do not assume the successful destination.
- **Evidence or Observation:** No valid credentials or OTP were available; successful login was not observed.
- **Automation Feasibility:** Conditional; secure secret injection and OTP testing support required.
- **Execution Status:** Blocked: credentials and OTP unavailable.

## 8. Basic Buying Request Test Scenarios

### BR-001 — Verify initial Basic page and navigation labels

- **Test Case ID:** BR-001
- **Test Case Title:** Load the Basic buying-request step
- **Module:** Basic Buying Request
- **Test Type:** Positive / UI smoke
- **Priority:** P1
- **Preconditions:** Unauthenticated browser at the specified sandbox URL.
- **Test Data:** None.
- **Steps to Execute:** Load the URL; record page title, heading, progress labels, primary prompt, and header links.
- **Expected Result:** Verify the page is reachable and compare content with observed labels: `Pepagora`, `Post Buying Requirement`, `Quick Post`, `Enrich for Better Responses`, `Live & Receiving Quotes`, `What are you looking for?`.
- **Evidence or Observation:** These labels were visible. Header showed `Login` and `Join Free`.
- **Automation Feasibility:** High for rendered content and links.
- **Execution Status:** Observed; formal rerun not performed.

### BR-002 — Inspect Basic product, quantity, and unit controls

- **Test Case ID:** BR-002
- **Test Case Title:** Record Basic field labels, formats, and available units
- **Module:** Basic Buying Request
- **Test Type:** UI / field inventory
- **Priority:** P1
- **Preconditions:** Basic step is visible.
- **Test Data:** None.
- **Steps to Execute:** Inspect Product Name and quantity controls; open Unit dropdown; record type, placeholder, current value, choices, and required indicators; close without making a final submission.
- **Expected Result:** Verify observed labels/placeholders and enumerate available units; required status beyond observed error messages remains subject to requirements.
- **Evidence or Observation:** Product input has combobox role and placeholder `e.g. Brazilian Virgin Hair, Organic Cotton T Shirts...`; quantity placeholder/value `1`; Unit choices: Piece, Box, Ton, Set, Litre, Kg, Meter, Dozen, Sqft, Can, Roll, Coil, Style, kms, Person.
- **Automation Feasibility:** High for controls and options.
- **Execution Status:** Observed.

### BR-003 — Validate empty Basic continuation

- **Test Case ID:** BR-003
- **Test Case Title:** Check mandatory Basic fields when continuing empty
- **Module:** Basic Buying Request
- **Test Type:** Negative / mandatory-field validation
- **Priority:** P1
- **Preconditions:** Basic step open; product field blank and Unit unselected; quantity initially shows `1`.
- **Test Data:** Blank product and unit; default quantity left unchanged.
- **Steps to Execute:** Activate `Continue to Enrich` once; record field-level messages and focus/scroll behavior.
- **Expected Result:** Compare field validation against approved requirements; no assumption that quantity is mandatory is made.
- **Evidence or Observation:** Observed `Product name is required` and `Unit is required`. The page remained on Basic.
- **Automation Feasibility:** High for field messages and no-navigation check.
- **Execution Status:** Observed.

### BR-004 — Enter safe product text and observe autocomplete

- **Test Case ID:** BR-004
- **Test Case Title:** Explore product-name entry and AI category suggestions
- **Module:** Basic Buying Request
- **Test Type:** Positive / input behavior
- **Priority:** P1
- **Preconditions:** Basic step open; no real product, buyer, or commercial details used.
- **Test Data:** `QA Sample Cotton Tote Bag`.
- **Steps to Execute:** Enter the sample text; blur the input; record any autocomplete/category suggestions, messages, and retained value; do not assume a real category.
- **Expected Result:** Observe rendered behavior and compare with requirements for autocomplete/category selection; no suggestion behavior is assumed.
- **Evidence or Observation:** Helper copy says leaving the field loads AI category ideas. In one exploration, the combobox showed an expanded but empty listbox for the sample text; the text could still be used to continue.
- **Automation Feasibility:** Medium; generated suggestions may be dynamic and need stable acceptance criteria.
- **Execution Status:** Observed exploratory behavior.

### BR-005 — Test quantity validation and boundaries

- **Test Case ID:** BR-005
- **Test Case Title:** Explore quantity type, invalid values, and numeric boundaries
- **Module:** Basic Buying Request
- **Test Type:** Negative / boundary / data type
- **Priority:** P1
- **Preconditions:** Product and Unit set to non-sensitive values; do not continue if it could submit a request.
- **Test Data:** Blank, `0`, `1`, negative number, decimal, alphabetic text, and a large value, applied one at a time.
- **Steps to Execute:** Record which values the control accepts, normalizes, blocks, or flags; stop before any final publish action.
- **Expected Result:** Compare observed behavior with product-defined minimum, maximum, integer/decimal, and unit rules. No numeric boundary is currently known.
- **Evidence or Observation:** Quantity input displayed value/placeholder `1`; no min/max or explicit format rule was observed.
- **Automation Feasibility:** High after numeric rules are specified.
- **Execution Status:** Not Run; expected bounds need clarification.

### BR-006 — Verify post-type choices and default selection

- **Test Case ID:** BR-006
- **Test Case Title:** Inspect enriched versus basic post selection
- **Module:** Basic Buying Request
- **Test Type:** UI / selection
- **Priority:** P1
- **Preconditions:** Basic step open.
- **Test Data:** None.
- **Steps to Execute:** Record which card is selected on initial render; activate each card once; record selected styling, displayed descriptions, and any field changes. Do not publish.
- **Expected Result:** Verify selection state and copy; selection outcome and default are to be confirmed with product requirements.
- **Evidence or Observation:** Enriched post was visually active/recommended initially; the card summaries displayed the quote and lead-status claims described in section 5.
- **Automation Feasibility:** High for selection and card copy.
- **Execution Status:** Initial default observed; deliberate switching not tested.

### BR-007 — Inspect Basic explanatory copy and controls

- **Test Case ID:** BR-007
- **Test Case Title:** Verify submit explanation and free-posting copy
- **Module:** Basic Buying Request
- **Test Type:** UI / content
- **Priority:** P2
- **Preconditions:** Basic step loaded.
- **Test Data:** None.
- **Steps to Execute:** Read `What happens when you submit?` content, `Continue to Enrich`, and the free-posting text.
- **Expected Result:** Verify displayed copy without treating quote estimates, lead claims, or delivery promises as verified outcomes.
- **Evidence or Observation:** Copy included `Lead captured instantly`, optional further questions, verified sellers, and `No credit card required - Free to post`.
- **Automation Feasibility:** High for copy; actual business outcomes are not suitable for UI-only automation.
- **Execution Status:** Observed.

### BR-008 — Continue from valid-looking Basic fields

- **Test Case ID:** BR-008
- **Test Case Title:** Navigate from Quick Post to Enrichment
- **Module:** Basic Buying Request
- **Test Type:** Positive / navigation
- **Priority:** P1
- **Preconditions:** Basic step open; do not activate a final publish control.
- **Test Data:** `QA Sample Cotton Tote Bag`, quantity `1`, unit `Piece`.
- **Steps to Execute:** Enter the sample values; activate `Continue to Enrich`; record step title, summary, URL, and lead score.
- **Expected Result:** Observe and compare transition with requirements; do not infer posting or account creation from step navigation.
- **Evidence or Observation:** Observed `Phase 2 of 2 - Enrichment`, heading `Help sellers give you their best quote`, summary `QA Sample Cotton Tote Bag - 1 Piece`, and same URL.
- **Automation Feasibility:** High for step transition and displayed summary.
- **Execution Status:** Observed; no request published.

### BR-009 — Verify unit-required recovery

- **Test Case ID:** BR-009
- **Test Case Title:** Select a valid unit and recover from Basic validation
- **Module:** Basic Buying Request
- **Test Type:** Negative recovery / dropdown
- **Priority:** P2
- **Preconditions:** Basic required-field messages are displayed.
- **Test Data:** Product sample and quantity `1`; choose `Piece`.
- **Steps to Execute:** Open Unit dropdown; inspect available options; select `Piece`; enter sample product; continue to Enrichment only.
- **Expected Result:** Verify unit error clears and the next step can be reached if other requirements are met; compare with approved rules.
- **Evidence or Observation:** Unit list and successful transition after sample values were observed.
- **Automation Feasibility:** High for required message, dropdown options, and forward navigation.
- **Execution Status:** Observed.

## 9. Enrichment Test Scenarios

### ENR-001 — Inventory dynamic Smart Questions

- **Test Case ID:** ENR-001
- **Test Case Title:** Record question labels, required indicators, and current choices
- **Module:** Enrichment
- **Test Type:** UI / field inventory
- **Priority:** P1
- **Preconditions:** Enter Enrichment through the actual `Continue to Enrich` action.
- **Test Data:** Harmless product sample; note any suggested category.
- **Steps to Execute:** Record every Smart Question, visible `*` indicator, choice, `+ Add value`, and custom-attribute control for the current product; repeat only if needed to establish whether content varies.
- **Expected Result:** Compare dynamically rendered questions with requirements and record each run's set; do not assert one observed set is universal.
- **Evidence or Observation:** Three questions with `*` and one without were shown on one visit; a later visit showed different questions/options for the same sample.
- **Automation Feasibility:** Medium/low for AI-generated question content unless the suggestion set can be controlled.
- **Execution Status:** Observed; requirement/variability clarification needed.

### ENR-002 — Explore Smart Question selection and Add value

- **Test Case ID:** ENR-002
- **Test Case Title:** Select question values and inspect custom-value entry
- **Module:** Enrichment
- **Test Type:** Positive / optional behavior / interaction
- **Priority:** P2
- **Preconditions:** Enrichment open; do not submit or publish.
- **Test Data:** One harmless option per question; synthetic custom value only if approved.
- **Steps to Execute:** Select and deselect one choice per question; record whether single/multiple selections are allowed; inspect `+ Add value` and `Add More Attributes` controls without adding business data.
- **Expected Result:** Observe supported selection behavior and compare with confirmed rules; no cardinality or required-answer rule is assumed beyond visible stars.
- **Evidence or Observation:** Smart Questions included `+ Add value` and `Add More Attributes`; deeper interactions were not tested.
- **Automation Feasibility:** Medium; stable option set and selection rules needed.
- **Execution Status:** Not Run.

### ENR-003 — Inspect required lead time and recurring order

- **Test Case ID:** ENR-003
- **Test Case Title:** Check logistics choice controls
- **Module:** Enrichment
- **Test Type:** UI / selection / mandatory-indicator review
- **Priority:** P1
- **Preconditions:** Enrichment open.
- **Test Data:** None; do not submit.
- **Steps to Execute:** Record `Required Lead Time` options and `Is this a recurring order?` options; inspect visible selected states and whether any dependent fields appear when choosing an option.
- **Expected Result:** Record actual behavior; determine requiredness and dependencies only from approved requirements or explicit validation.
- **Evidence or Observation:** Options observed: `under 7 days`, `7-14 days`, `15-30 days`, `Flexible`; recurring choices `One-time`, `Monthly recurring`, `Quarterly`. Helper text says recurring orders may attract premium sellers.
- **Automation Feasibility:** High for option presence; medium for unconfirmed dependencies.
- **Execution Status:** Options observed; selections/dependencies not tested.

### ENR-004 — Inspect destination and shipping terms

- **Test Case ID:** ENR-004
- **Test Case Title:** Review country, port/city, and shipping controls
- **Module:** Enrichment
- **Test Type:** UI / dependency / optional behavior
- **Priority:** P1
- **Preconditions:** Enrichment open.
- **Test Data:** Observed defaults only; do not replace with a real destination.
- **Steps to Execute:** Record country/city values and placeholders; inspect whether changing one affects the other only if approved test data is available; record all shipping-term choices.
- **Expected Result:** Compare defaults, validation, and dependent behavior with documented requirements.
- **Evidence or Observation:** Country `India` with placeholder `e.g. India`; city `Mumbai, Maharashtra` with placeholder `e.g. Chennai`; options CIF, FOB, DDP, Any / Negotiable.
- **Automation Feasibility:** Medium; destination suggestions/data may vary by environment.
- **Execution Status:** Visible controls observed; dependency behavior not tested.

### ENR-005 — Inspect budget range and currency

- **Test Case ID:** ENR-005
- **Test Case Title:** Verify optional budget choice and conditional range fields
- **Module:** Enrichment
- **Test Type:** Positive / negative / conditional fields
- **Priority:** P1
- **Preconditions:** Enrichment open; do not enter amounts or publish.
- **Test Data:** None.
- **Steps to Execute:** Record initial choice state; activate `Yes, set a range`; inspect From/To/Currency controls; open currency list; return/choose `No, I'll evaluate quotes` and observe which controls remain.
- **Expected Result:** Verify conditional display and data retention with requirements; no amount validity, currency default, or mandatory rule is presumed.
- **Evidence or Observation:** `Yes, set a range` revealed From and To inputs (placeholder `0`) and `Select Currency`; currencies observed: ₹ - INR, $ - USD, د.إ - AED, € - EUR, £ - GBP, ¥ - JPY. Choice state reset after leaving and re-entering Enrichment.
- **Automation Feasibility:** High for control visibility/options; amount validation awaits requirements.
- **Execution Status:** Conditional display/options observed; switching behavior not fully tested.

### ENR-006 — Inspect payment terms

- **Test Case ID:** ENR-006
- **Test Case Title:** Review payment terms and selection behavior
- **Module:** Enrichment
- **Test Type:** UI / optional-field behavior
- **Priority:** P2
- **Preconditions:** Enrichment open.
- **Test Data:** None.
- **Steps to Execute:** Record every visible `Payment Terms You Accept` option; select one option only if permitted for non-submitting exploration; observe whether multi-select is possible.
- **Expected Result:** Compare selection cardinality and any requiredness with approved requirements.
- **Evidence or Observation:** Options shown: LC-Letter of Credit, TT- Telegraphic Transfer, 100% Advanced, 50% Advance and 50% Dispatch, Net 30/60, Escrow, Cash on delivery, Custom Payment Terms.
- **Automation Feasibility:** Medium; product rules needed.
- **Execution Status:** Options observed; selections not tested.

### ENR-007 — Inspect additional details field

- **Test Case ID:** ENR-007
- **Test Case Title:** Check optional additional-details input
- **Module:** Enrichment
- **Test Type:** UI / optional / boundary
- **Priority:** P2
- **Preconditions:** Enrichment open; do not publish.
- **Test Data:** Blank and synthetic text only; planned boundary lengths require product specification.
- **Steps to Execute:** Record the textarea label, placeholder, type, and any visible character counter/required indicator; if approved, test blank, ordinary text, and agreed length boundaries.
- **Expected Result:** Compare accepted content and limits with confirmed requirements; no maximum length or sanitization rule is assumed.
- **Evidence or Observation:** Label `Additional details`; textarea placeholder `Additional details suppliers should know…`; no HTML required flag or character limit observed.
- **Automation Feasibility:** High after limit and formatting rules are defined.
- **Execution Status:** Field observed; boundary tests not run.

### ENR-008 — Review final action without activating it

- **Test Case ID:** ENR-008
- **Test Case Title:** Identify final publish and skip actions
- **Module:** Enrichment
- **Test Type:** UI / safety checkpoint
- **Priority:** P1
- **Preconditions:** Enrichment open; use only synthetic in-memory values.
- **Test Data:** None.
- **Steps to Execute:** Record final action labels and any visible confirmation/review notice; do not activate any publish or skip-to-post button.
- **Expected Result:** Identify the control and confirm the test has not created a request. Submission outcome is out of scope without authorization.
- **Evidence or Observation:** Buttons shown: `Publish as a Hot Lead`, `Skip enrichment - post as basic Active listing`, and `Skip & post basic →`; notice states AI moderation precedes publication.
- **Automation Feasibility:** High for presence/labels; submission must remain disabled in this phase.
- **Execution Status:** Actions identified; none activated.

### ENR-009 — Test Enrichment back/forward state retention

- **Test Case ID:** ENR-009
- **Test Case Title:** Check data retention when navigating between steps
- **Module:** Enrichment
- **Test Type:** Navigation / state retention / recovery
- **Priority:** P1
- **Preconditions:** Basic to Enrichment navigation is available; no final request action.
- **Test Data:** Product `QA Sample Cotton Tote Bag`, quantity `1`, unit `Piece`; one temporary budget selection.
- **Steps to Execute:** Enter the sample on Basic; continue; choose a budget option; activate `Back`; record Basic values; return with `Continue to Enrich`; record restored/cleared Enrichment choices.
- **Expected Result:** Compare retention behavior with product requirements; no defect is declared until desired persistence is confirmed.
- **Evidence or Observation:** Basic product, quantity, unit, and enriched card state remained when going back. The Enrichment budget choice did not remain selected after returning to Basic and re-entering.
- **Automation Feasibility:** High for browser state assertions once persistence expectations are defined.
- **Execution Status:** Observed; expected persistence needs clarification.

## 10. End-to-End Test Scenarios

### E2E-001 — Navigate between signup and login

- **Test Case ID:** E2E-001
- **Test Case Title:** Verify authentication cross-navigation
- **Module:** End-to-End
- **Test Type:** Navigation / UI
- **Priority:** P1
- **Preconditions:** Start unauthenticated at the buying-request page.
- **Test Data:** None.
- **Steps to Execute:** Open Join Free; activate `Sign in`; verify Login; activate `Create an account`; verify signup. Do not enter a valid phone.
- **Expected Result:** Cross-links navigate between the observed `/authenticate?mode=signup` and `/authenticate?mode=login` pages.
- **Evidence or Observation:** Both cross-links and destinations were observed; flow traversed.
- **Automation Feasibility:** High.
- **Execution Status:** Observed.

### E2E-002 — Reach Enrichment and return to Basic

- **Test Case ID:** E2E-002
- **Test Case Title:** Complete non-submitting Quick Post to Enrichment round trip
- **Module:** End-to-End
- **Test Type:** Positive navigation / state retention
- **Priority:** P1
- **Preconditions:** Unauthenticated target page; do not activate publish.
- **Test Data:** `QA Sample Cotton Tote Bag`, quantity `1`, unit `Piece`.
- **Steps to Execute:** Enter sample values; continue; record Enrichment summary; go Back; record Basic values; continue again; record Enrichment initial state.
- **Expected Result:** Verify step navigation and record retained/reset values for comparison with stated persistence requirements.
- **Evidence or Observation:** Forward and Back navigation worked; Basic sample values were retained; budget choice was reset on re-entry.
- **Automation Feasibility:** High for navigation and state assertions.
- **Execution Status:** Observed; no request published.

### E2E-003 — Authorized basic-post lifecycle

- **Test Case ID:** E2E-003
- **Test Case Title:** Verify a basic buying-request lifecycle in sandbox
- **Module:** End-to-End
- **Test Type:** Positive / business workflow
- **Priority:** P1
- **Preconditions:** Explicit authorization to create a disposable sandbox request, approved test account, cleanup process, and requirements for confirmation/visibility.
- **Test Data:** Product-approved synthetic data only.
- **Steps to Execute:** Follow approved Basic flow; use only the approved basic action; record confirmation and cleanup request only if explicitly permitted.
- **Expected Result:** Compare with signed-off rules for publication, confirmation, and post status. Quote estimates are not acceptance criteria unless confirmed.
- **Evidence or Observation:** Final actions were not activated. The page text claims basic posts become Active and are category-matched; outcome not verified.
- **Automation Feasibility:** Conditional; requires disposable test environment and cleanup.
- **Execution Status:** Blocked: no explicit submission authorization.

### E2E-004 — Authorized enriched-post lifecycle

- **Test Case ID:** E2E-004
- **Test Case Title:** Verify enriched buying-request lifecycle in sandbox
- **Module:** End-to-End
- **Test Type:** Positive / business workflow
- **Priority:** P1
- **Preconditions:** Explicit authorization, approved account and synthetic data, cleanup process, and expected moderation/publication requirements.
- **Test Data:** Product-approved synthetic request; no commercial or personal data.
- **Steps to Execute:** Follow Basic and Enrichment; complete only approved fields; activate the authorized final action once; record confirmation/moderation/visibility and clean up if authorized.
- **Expected Result:** Compare with confirmed publication and moderation requirements; no success behavior is presumed.
- **Evidence or Observation:** Enrichment displayed `Publish as a Hot Lead`; final action was not activated.
- **Automation Feasibility:** Conditional; external business actions require controlled test fixtures.
- **Execution Status:** Blocked: no explicit submission authorization.

## 11. Boundary and Negative Test Scenarios

The following boundary/negative checks are represented by the detailed cases above. Until acceptance criteria are provided, these are exploratory checks, not pass/fail requirements:

| Test Case | Inputs / condition | Expected-result constraint |
|---|---|---|
| REG-002 / LOG-002 | Empty phone | Observed `Enter a Valid Mobile Number`; confirm whether client-side and backend behavior are expected |
| REG-003 / LOG-003 | Malformed/short synthetic phone | Record validation, country-code behavior, and service response; do not repeatedly call OTP service |
| BR-003 | Empty Product Name and Unit | Observed `Product name is required` and `Unit is required` |
| BR-005 | Quantity blank, zero, one, negative, decimal, non-numeric, very large | Minimum, maximum, integer/decimal support, and upper limit require clarification |
| ENR-005 | Empty/partial From-To range and currency | Whether both endpoints, positive values, range ordering, and currency are required is unknown |
| ENR-007 | Empty and boundary-length Additional details | Maximum length and content rules are unknown |
| ENR-009 / E2E-002 | Navigate forward/back with data | Basic retention observed; Enrichment reset observed; desired behavior requires clarification |
| E2E-003 / E2E-004 | Final post actions | Not performed; explicitly blocked until submission authorization |

Do not label an observed console error, changing AI question set, or state reset a defect unless it violates a confirmed requirement.

## 12. Test Data Requirements

- Use only approved, synthetic sandbox data; the harmless navigation sample used was `QA Sample Cotton Tote Bag`, quantity `1`, unit `Piece`.
- Do not use real buyer/supplier names, phone numbers, addresses, budgets, or commercially sensitive descriptions.
- For phone tests, use approved invalid test strings for validation only; do not use a routable number or trigger repeated OTP requests.
- Valid registration/login and duplicate-account tests require an approved disposable sandbox identity and protected OTP/credential handling.
- Quantity limits, amount boundaries, text-length limits, and allowed formats must be supplied by product/QA before asserting outcomes.
- Do not submit or publish any request as part of this plan without explicit authorization and a documented cleanup process.

## 13. Preconditions and Dependencies

- Sandbox URL must remain available and tester must record browser/version, viewport, date, and authentication state.
- Product/QA must supply acceptance criteria for requiredness, quantity bounds, amounts/currency, question cardinality, shipping/payment selections, and data retention.
- Authentication tests beyond local validation require approved test credentials, OTP delivery, and a permitted duplicate-account fixture.
- End-to-end publish tests require explicit authorization, test-only data, controlled supplier visibility, and request cleanup.
- Dynamic Smart Question content should be reproducible or have a documented tolerance if automated.
- Browser console/network logs must be captured per run, with secrets and personal data redacted.

## 14. Risks and Limitations

- Registration/login success, OTP behavior, duplicate-account handling, and authenticated access are unverified because no test identity was provided.
- No buying request was submitted; actual confirmation, AI moderation, seller matching, status, or quote delivery are not verified.
- Smart Question text/options varied between exploration visits for the same sample description; source and expected stability are unknown.
- Basic field boundaries and most Enrichment validation were not established. Presence of a star or the word `Required` is recorded as UI evidence but should be reconciled with acceptance criteria.
- Basic data persisted across Back/forward in the observed run, while the Enrichment budget choice reset. Intentional behavior is unknown.
- The page showed loading category subcategories during the initial snapshot; the final loaded state was not separately confirmed.
- Console logs contained blocked insecure HTTP favicon requests on HTTPS pages, Google Identity/FedCM errors, a Google initialization warning, and a sandbox `auth/sendOtp` HTTP 500 after invalid-input exploration. Treat these as environment/application observations for investigation, not confirmed product defects.
- Browser version and viewport were not captured; responsive and cross-browser coverage remains unassessed.

## 15. Requirement Clarifications

1. Is registration exclusively phone-based? Is OTP always required, and what are the expected resend, expiry, and recovery flows?
2. Are phone duplicates rejected, redirected to login, or handled some other way? What approved sandbox fixture can test this safely?
3. Why did the country display change from India `+91` to Bolivia `+591` during invalid phone entry? What country-selection/normalization behavior is expected?
4. What should happen on empty or malformed phone input before any OTP service call? What is the expected response for `/auth/sendOtp`?
5. Is the Basic quantity required, integer-only, positive-only, or bounded? What are the exact lower and upper limits?
6. Is product text accepted without choosing an AI/category suggestion? What are the field length, category, and suggestion-loading requirements?
7. Are the displayed quote counts, lead statuses, free-posting statement, and moderation claims informational or acceptance criteria?
8. Which Enrichment questions are expected for a given product/category? Are questions generated dynamically, and how should required `*` indicators behave?
9. Are question options single-select or multi-select? What is the expected behavior of `+ Add value` and `Add More Attributes`?
10. Which Enrichment fields are mandatory? Is Required Lead Time required in validation? Are destination country and port/city mandatory or dependent?
11. Which shipping and payment terms support multiple selections? Are custom payment terms a free-text entry?
12. If `Yes, set a range` is chosen, are From and To both required? Are values numeric/positive, must From be less than To, and what currency defaults are expected?
13. What are the maximum length, supported formats, and validation rules for Additional details?
14. Should Enrichment choices and typed data persist after Back/forward navigation? The budget selection was reset in the observed round trip.
15. What are the expected final actions for basic and enriched posting, authentication gate behavior, moderation results, confirmation messages, and cleanup of sandbox requests?
16. Should the category subcategory loading state, insecure favicon request, Google Identity errors, or observed auth endpoint HTTP 500 be treated as expected sandbox limitations or investigated as application issues?

## 16. Recommended Automation Strategy

- **Implemented safe suite:** `tests/pepagora.spec.ts` covers empty phone validation on signup/login, required-field validation on Basic, sample-product navigation to Enrichment with Basic-state retention on Back, conditional budget/currency controls, and incomplete/completed Enrichment states. The completed flow verifies the observed product-attribute, logistics, budget, payment, and additional-details fields and the full 100/100 checklist using synthetic values. The enriched end-to-end scenario repeats these checks before publishing.
- **Registration and login suite:** `tests/registration.spec.ts` contains REG-001 through REG-004 and login coverage LOG-001 through LOG-003. REG-001 to REG-003 and LOG-002 to LOG-003 are runnable without creating an account; malformed-phone coverage intercepts the OTP endpoint. REG-004 is opt-in (`PEPAGORA_MANUAL_REGISTRATION=1`) and LOG-001 is opt-in (`PEPAGORA_MANUAL_LOGIN=1`); both require `--headed` and pause for the user to enter phone/OTP only in the browser. The user completes signup or the offered existing-user sign-in route, navigates to the buying-request page, and resumes. No phone number or OTP is embedded in code.
- **Manual authentication setup:** Run `npm run auth:setup` to open a headed browser at signup. Complete approved registration or sign-in in the browser, then press Enter in the terminal to store the browser session in `.playwright/.auth/pepagora-user.json`. Never paste credentials or OTP into chat or commit/share the saved session.
- **Publishing policy:** Final Basic and Enriched post tests are not yet implemented. The user authorized sandbox test requests but prohibited supplier-side interaction. Because a publish action may make the request visible to suppliers and successful confirmation behavior has not been observed, keep publish automation disabled until the expected success state and request cleanup procedure are agreed.
- Begin with read-only smoke coverage for page reachability, title, navigation labels, authentication links, field labels, and dropdown options.
- Automate client-side empty validation and Basic-to-Enrichment navigation using controlled inputs; assert only confirmed messages and state behavior.
- Keep the final publish controls out of automated runs until the team provides explicit sandbox authorization, disposable data, and cleanup.
- Stub or safely isolate OTP and external Google sign-in in automated tests. Never hardcode account credentials, OTPs, or personal phone numbers.
- Capture console/network errors as diagnostics, redact sensitive values, and distinguish known sandbox-provider failures from assertions.
- For dynamic Smart Questions, assert stable structure and labels only where requirements define them; otherwise save observed question sets as exploratory evidence instead of rigid golden expectations.
- Add quantity, budget, text-length, and selection-boundary assertions only after product requirements define exact limits and expected errors.
- Validate persistence in a dedicated test once the expected Back/forward retention contract is clarified.
