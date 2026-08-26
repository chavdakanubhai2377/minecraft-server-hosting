# Eagle Host Demo — Pages added

I added a small static website skeleton for Eagle Host to the eaglehost/payment-discord-integration branch.

Files added:
- public/index.html — Homepage (branding, features, CTA)
- public/dashboard.html — Client-side demo dashboard with mock servers
- public/panel.html — Control panel explanation / placeholder
- public/css/style.css — Shared styling

Preview these pages locally by serving the repo folder (from repo root):

python3 -m http.server 8000

Then open:
- http://localhost:8000/public/index.html
- http://localhost:8000/public/dashboard.html
- http://localhost:8000/public/panel.html

Next steps I can take (pick one):
- Wire the dashboard to the real backend and show real servers (needs API keys and backend deployed).
- Add SSO link behavior to redirect users from the dashboard to their Pterodactyl console once provisioned.
- Implement production auth and user persistence.

Tell me which to do next and provide the required credentials if you want E2E testing.
