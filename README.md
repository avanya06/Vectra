# Vectra

A smart link hub with an owner dashboard, public profiles, contextual link rules, click analytics, QR codes and short links. Built with React, TypeScript, Vite, Express and MongoDB.

## Run locally

1. Install frontend dependencies with `npm ci`.
2. Run `npm ci` inside `server`.
3. Copy `.env.example` to `.env.development` and `server/.env.example` to `server/.env`.
4. Set a strong random `JWT_SECRET` and a MongoDB connection in the server environment. Optional Google OAuth and AI settings stay server-side.
5. Start MongoDB, then run `npm run dev` inside `server`.
6. Run `npm run dev -- --host 127.0.0.1 --port 8081` in the project root.

The frontend API URL should include `/api`, for example `http://localhost:5001/api`. Configure the backend origin, OAuth callback and short-link base for the actual environment before deployment.

## Main capabilities

- Email registration and login with JWT-protected management routes.
- Link creation, editing and deletion with contextual boost, pin and hide actions.
- Public hub retrieval with request context.
- Profile updates, tracked click records and analytics export.
- Short-code redirects and QR-code presentation.

## Verification and limitations

Frontend and backend builds compile the reviewed source. Local API checks covered registration/login, link CRUD, individual rule actions, analytics records, profile persistence and short redirects. Google OAuth and live AI-generated rules require their own configured credentials and were not fully verified in the report session.

Conflicting rule actions currently need a documented precedence policy. Current event storage does not independently measure page views and destination clicks. Production validation, authorization coverage and load testing remain further work.

## Source layout

`src/` contains the React application. `server/src/` contains Express routes, controllers, authentication middleware and Mongoose models. Environment files, dependency directories, generated bundles and personal training evidence are excluded from version control.
