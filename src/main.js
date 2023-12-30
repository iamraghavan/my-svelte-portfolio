import App from './App.svelte';
import { Router } from 'svelte-routing';

const base = '/'; // Set your base URL here

const app = new App({
  target: document.body,
  props: {
    // ...other props
  },
  context: new Map([[Router, { base }]]), // Provide the base property
});

export default app;
