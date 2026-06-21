# Party Watcher Client

Party Watcher is a small web app for watching YouTube videos together in shared rooms.

Users can create an account, log in, browse available rooms, create a new room with a YouTube embed link, join a room, and chat with other people while watching. Room presence and messages are updated through Socket.IO.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Socket.IO client
- Axios
- Tailwind CSS / shadcn-style UI components

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The client expects the backend API and websocket server to be running on:

```text
{server_url}
```

## Available Scripts

```bash
npm run dev      # Start the local dev server
npm run build    # Build the app for production
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## Main Features

- User registration and login
- Protected room pages
- Room list with room creation
- YouTube video embed inside each room
- Real-time chat
- Room join and leave updates
