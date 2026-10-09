import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// Don't watch the built copy of the site. Rebuilding it while the
		// dev server runs can lock files on Windows and crash the server.
		watch: { ignored: ['**/build/**'] }
	}
});
