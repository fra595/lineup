# Lineup

A mobile app connecting musicians, music directors, sound engineers, and MCs
with people hiring for events (weddings, ceremonies, graduations, corporate
events) in East Africa, built with React Native + Expo.

## Status

🚧 Story 0 complete — bare scaffold, navigation shell, no features yet.

## Getting started

```bash
npm install
npm start
```

Then scan the QR code with the Expo Go app on your phone, or press `w` to
run it in a browser.

## Project structure

```
App.js                     entry point
src/
  navigation/
    AppNavigator.js         single source of truth for screens/routes
  screens/                  one file per screen
  components/                reusable UI pieces shared across screens
  constants/
    theme.js                 shared colors, spacing, radius
```

## Backlog (story by story)

- [x] Story 0 — Project scaffold
- [ ] Story 1 — Musician sign up & profile creation
- [ ] Story 2 — Hirer sign up
- [ ] Story 3 — Browse/search musicians
- [ ] Story 4 — Musician profile detail view
- [ ] Story 5 — Hirer posts a gig
- [ ] Story 6 — Musician browses open gigs
- [ ] Story 7 — Hire request opens a chat thread
- [ ] Story 8 — In-app messaging
- [ ] Epic 6 — Payments (Flutterwave split payments), added once the free
      hire-and-chat flow is validated

## Roles

- Musician (Drums, Guitar – Acoustic/Electric, Keyboard, Vocals, Bass)
- Music Director
- Sound Engineer
- MC / Host
