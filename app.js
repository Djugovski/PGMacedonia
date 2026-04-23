/**
 * cPanel "Setup Node.js App" / Phusion Passenger startup file.
 *
 * Upload this repo (or a zip of it) to a folder on the server (e.g. ~/pg-api),
 * then in cPanel → "Setup Node.js App":
 *   • Node version:        20 or newer
 *   • Application mode:    Production
 *   • Application root:    /home/<user>/pg-api
 *   • Application URL:     /api            (e.g. https://pgmacedonia.mk/api)
 *   • Application startup file:  app.js
 *
 * Click "Create", then in the "Environment Variables" panel add:
 *   NODE_ENV                    production
 *   API_PATH_PREFIX             /           ← tells the server NOT to add /api
 *                                              because Passenger strips it already
 *   TRUST_PROXY                 true
 *   CALENDAR_DATA_FILE          /home/<user>/pg-api/data/calendar.json
 *   APP_PUBLIC_URL              https://pgmacedonia.mk
 *   CONTACT_TO_EMAIL            <your inbox>
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM
 *   CALENDAR_ADMIN_SECRET       <any long random string>
 *
 * Finally, in the cPanel terminal (or via the "Run NPM Install" button):
 *   cd ~/pg-api
 *   npm install --omit=dev
 *   npm run build:server
 *   # cPanel will auto-restart the app on file changes; you can also use
 *   # the "Restart" button in the Node.js Selector panel.
 */

// The Passenger runtime chdir's into the Application root for us, so a
// relative require works reliably.
module.exports = require('./dist-server/index.cjs')
