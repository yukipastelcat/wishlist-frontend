import adapterAuto from '@sveltejs/adapter-auto';

let adapter = adapterAuto();

if (process.env.BUILD_TARGET === 'github-pages') {
	const { default: adapterStatic } = await import('@sveltejs/adapter-static');
	adapter = adapterStatic({
		fallback: '404.html'
	});
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter
	}
};

export default config;
