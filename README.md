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

## Daily workflow and backups

Use **Edit** on any entry to update its fields. Renaming a program updates associated tasks; deleting a program leaves its tasks unassigned. Editing a task preserves its completion status.

Daily tasks supports combined text search, program filtering, and All/Open/Completed/Due today/Overdue filters. Dates use your browser's local calendar day.

**Export backup** downloads a versioned JSON copy of your full workspace. **Import backup** validates the file and asks before replacing all current entries. Export your current data first if you want to retain it. Invalid files leave your current data unchanged; imports are limited to 10 MB. Backups contain your workspace data, so store them appropriately.
