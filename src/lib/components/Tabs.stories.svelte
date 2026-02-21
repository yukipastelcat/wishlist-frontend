<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Tabs from './Tabs.svelte';

	const { Story } = defineMeta({
		title: 'Core/Tabs',
		component: Tabs,
		tags: ['autodocs']
	});
</script>

<Story
	name="English active"
	args={{
		tabs: [
			{ id: 'en', label: 'EN' },
			{ id: 'ru', label: 'RU' },
			{ id: 'de', label: 'DE' }
		],
		activeTabId: 'en'
	}}
/>

<Story
	name="Russian active"
	args={{
		tabs: [
			{ id: 'en', label: 'EN' },
			{ id: 'ru', label: 'RU' },
			{ id: 'de', label: 'DE' }
		],
		activeTabId: 'ru'
	}}
/>

<Story
	name="Many tabs"
	args={{
		tabs: [
			{ id: 'en', label: 'English' },
			{ id: 'ru', label: 'Russian' },
			{ id: 'de', label: 'German' },
			{ id: 'fr', label: 'French' },
			{ id: 'es', label: 'Spanish' }
		],
		activeTabId: 'fr'
	}}
/>

