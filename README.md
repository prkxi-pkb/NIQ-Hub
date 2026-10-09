# NIQ Resource Hub

A personal workspace for daily program management: program status, tasks with owners and due dates, overdue counts, and a searchable resource library.

## Develop

Requires Node.js 20 or newer. No third-party packages or credentials are required.

```sh
npm start
```

The server listens on port 3000. Set `PORT` to select another port.

```sh
npm test
npm run check
```

Data stays in this browser's local storage. This first version has no shared database, login, synchronization, or backup. Clearing browser storage removes entries. Use it for a personal prototype; shared team use requires a backend and access controls.

The workspace starts empty. Add programs, tasks, and resource links using the Add buttons. Mark tasks complete with the checkbox; use each section's search to find entries.
