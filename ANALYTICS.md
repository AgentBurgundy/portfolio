# Mixpanel

Production visits on aibaker.io and www.aibaker.io use project token
`ae13938bd7e20932cad1a6aaadca058d`. Local development and preview hosts do not send events.

Mixpanel autocapture records interactions, and page views follow pathname changes.
Session replay samples 100% of eligible sessions. Replay text and all input values
are masked. The site has no accounts: Mixpanel's persistent anonymous visitor ID
connects repeat visits in the same browser; it does not identify a person's name.

The contact form sends these explicit events without names, email addresses,
phone numbers, businesses, or message contents:

- `Contact Form Validation Failed` (with `error_count`)
- `Contact Form Submitted` (valid submission attempt)
- `Contact Form Succeeded` (contact API reports success)
- `Contact Form Failed` (contact API or network failure)

Honeypot submissions do not send submission or outcome events. Browser tracking
restrictions and blockers can prevent collection. No account identity or People
profile is created from a contact submission.
