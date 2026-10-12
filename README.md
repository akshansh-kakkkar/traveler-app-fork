# TourNet

`TourNet is a travel planner  that helps people turn their trip into an organized, time-aware daily itinerary`

### TechStack

- Project Setup Better-T-Stack
- Tanstack-router
- Uniwind Native 
- Express Backend
- RunTime Bun
- TRPC Api
- Better Auth Authentication
- Database Postgres
- orm Prisma
- DB setup neon
- packageManager Bun
- PWA turborepo

### Features

- Authentication using Better Auth
- Create Trip
- Read Trip
- Update Trip
- Delete Trip
- Get All Trips
- Get Single Trip
- Reorder Trips
- Create Itinerary
- Read Itinerary
- Get Itinerary
- Get all Items from Itinerary
- Get single Item from Itinerary
- Update Itinerary
- Delete Itinerary
- ReOrder Itinerary

### Semi Ready Features

- Places Feature Database
- overpass query across kl covering 6 types of places
- toPlace() map osm tags to the schema
- upsert so osmId doesn't rerun already verified places by guides

- a screen to display api data from the server: infinite scroll, category filters, unverified badge, loading and error

### API Routes


#### Trip Routes

- `/api/trips/create`
- `/api/trips/getAll`
- `/api/trips/getAll`
- `/api/trips/update`
- `/api/trips/delete`
- `/api/trips/reorder`

#### Itinerary Routes

- `/api/itinerary/create`
- `/api/itinerary/getAll`
- `/api/itinerary/getOne`
- `/api/itinerary/update`
- `/api/itinerary/delete`
- `/api/itinerary/reorder`

### Project Structure
apps/
	native/ Expo app (Expo router, uniwind, heroui naive)
	web/ landing page and dashboard (tanstack router, vite)
	server/ API server
packages/
	api/ tRPC routers and itinerary generation
	auth/ Better auth config
	db/ prisma schema and client
	env/ env vars
	ui/ shared UI

### Itinerary Generation
- anchor based geo retrieval (pick a place and build candidate list close to that anchor to reduce travel times)
- per day validation so travel is reduced
- groq call for ordering and reasons
- items that fail validation are removed

### Mobile App
Screens: Discover, Itinerary, My trips, Home and Trip detail
Sign in/up as modal
Design tokens in `apps/native/global.css`, components in `apps/native/components/ui`

### Running on physical phone
- EXPO_PUBLIC_SERVER_URL must be your pcs land ip ovoer `http://` or `10.0.2.2`
- same wifi
- `bun expo start -c`

*Please note this is an incomplete product and  api endpoints can be tested using postman*
