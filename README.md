# Redux Essentials Tutorial Example

This project contains the setup and code from the "Redux Essentials" tutorial example app in the Redux docs ( https://redux.js.org/tutorials/essentials/part-3-data-flow ).

The `master` branch has a single commit that already has the initial project configuration in place. You can use this as the starting point to follow along with the instructions from the tutorial.

The `tutorial-steps-ts` branch has the actual code commits from the tutorial. You can look at these to see how the official tutorial actually implements each piece of functionality along the way.

This project was bootstrapped with [Vite](https://vitejs.dev/), and is based on the [official Redux Toolkit + Vite template](https://github.com/reduxjs/redux-templates/tree/master/packages/vite-template-redux).

## Package Managers

This project is set up to use NPM as the package manager, with a `package-lock.json` lockfile. NPM is used because it is the package manager that works most reliably inside the StackBlitz WebContainer environment used for the embedded examples in the Redux docs.

If you prefer to use another package manager, such as pnpm, Yarn, or Bun, delete `package-lock.json` and install dependencies with your preferred package manager. Note that `package.json` pins `rolldown` to 1.2.8 via the `overrides` field; that works around a bug in rolldown 1.2.9's WebContainer fallback loader and only matters when running on StackBlitz.

## Fake API

The app talks to a fake REST API implemented with [Mock Service Worker](https://mswjs.io/). It uses the `msw/native` entry point, which intercepts `fetch` calls directly in the page instead of registering a browser service worker. That lets the app run inside browser-based sandboxes like StackBlitz, which do not allow apps to register their own service workers. One side effect: the fake API requests do not show up in the browser's Network tab.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.<br />

### `npm run build`

Builds the app for production to the `dist` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

## Learn More

You can learn more about building and deploying in the [Vite docs](https://vitejs.dev/).

To learn React, check out the [React documentation](https://react.dev).
