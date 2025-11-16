# React Examples Hub

This repository groups several standalone React playgrounds. Each project retains its own `package.json`, build scripts, and dependencies so you can explore or reuse them independently.

## Repository Layout

- `projects/grid-clash` – A modernized tic-tac-toe experience with solo CPU mode, scoreboard, and polished UI.

> Every additional experiment should live inside `projects/<project-name>` to keep the root clean.

## Working on a Project

```bash
cd projects/grid-clash
npm install
npm start
```

Each project exposes the usual Create React App scripts (`start`, `test`, `build`). Run commands from within the project directory to avoid cross-project dependency conflicts.

## Adding a New Project

1. Create a directory under `projects/` and scaffold your React app there (`npx create-react-app projects/new-app` or similar).
2. Ensure its dependencies are installed locally (`cd projects/new-app && npm install`).
3. Document the app in its own `README.md` and add a short entry to the section above.

This structure keeps every demo isolated while sharing a single Git repository. Let me know when you’re ready to add another project or automate the scaffold.
