import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// Listen on the IPv4 address. Otherwise Windows can bind to IPv6 only,
		// and a browser that tries 127.0.0.1 can't connect.
		host: '127.0.0.1',
		// Don't watch the built copy of the site. Rebuilding it while the
		// dev server runs can lock files on Windows and crash the server.
		watch: { ignored: ['**/build/**'] }
	}
});
