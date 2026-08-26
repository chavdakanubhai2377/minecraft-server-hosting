# PG Host Backend (Demo)

This is a lightweight demo backend to make the PG Host frontend interactive locally. It includes:

- Mock REST API endpoints for starting/stopping/restarting a server
- WebSocket-based console using socket.io
- A Stripe Checkout demo endpoint (requires STRIPE_SECRET_KEY in the environment)
- Serves the static frontend from the repository root

How to run

1. Install dependencies

   cd backend
   npm install

2. Create a .env file (see .env.example) and set STRIPE_SECRET_KEY if you want to test Stripe Checkout

3. Start the server

   npm start

4. Open the frontend in a browser:

   http://localhost:3000/index.html

Notes

- This is a demo/mock backend and is not production-ready. It is intended to provide simple interactions for the frontend (start/stop, console messages, usage updates).
- For production, replace the mock logic with real server control integrations (Pterodactyl, Docker API, or your host's orchestration layer) and securely store Stripe keys.
