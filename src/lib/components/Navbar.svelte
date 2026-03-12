<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { auth } from '$lib/stores/auth.store';
	import { m } from '$lib/paraglide/messages';
	import {
		getLocale,
		locales,
		localizeHref,
		setLocale,
		type Locale
	} from '$lib/paraglide/runtime';
	import { FontAwesomeIcon } from 'fontawesome-svelte';
	import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
	import Button from './Button.svelte';

	const { user } = auth;
	const logoutIcon = faArrowRightFromBracket as any;
	let selectedLocale = $state<Locale>(getLocale());

	$effect(() => {
		selectedLocale = getLocale();
	});

	async function handleLocaleChange(event: Event) {
		const nextLocale = (event.currentTarget as HTMLSelectElement).value as Locale;
		if (!locales.includes(nextLocale) || nextLocale === getLocale()) return;

		const nextHref = localizeHref(`${page.url.pathname}${page.url.search}`, {
			locale: nextLocale
		});

		await setLocale(nextLocale, { reload: false });
		await goto(nextHref);
	}
</script>

<header class="sticky top-0 z-10 bg-(--palette-accent-tint) backdrop-blur-lg">
	<div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<div
			class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-(--palette-accent) to-(--palette-accent-dark) shadow-sm me-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-gift h-5 w-5 text-(--palette-fg-on-dark)"
				><rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path
					d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"
				></path><path
					d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"
				></path></svg
			>
		</div>
		<div class="flex flex-col me-auto">
			<h1 class="font-semibold tracking-tight text-(--palette-fg)">{m.app_name_wishlist()}</h1>
			{#if $user}
				<span class="hidden text-xs text-(--palette-fg-muted) sm:block">
					{m.nav_welcome({ email: $user.email })}
				</span>
			{/if}
		</div>

		<nav class="flex items-center gap-2">
			<label class="sr-only" for="locale-switcher">{m.nav_language_label()}</label>
			<select
				id="locale-switcher"
				class="form-select px-2.5 py-1.5 text-sm"
				value={selectedLocale}
				onchange={handleLocaleChange}
			>
				{#each locales as locale}
					<option value={locale}>{locale.toUpperCase()}</option>
				{/each}
			</select>
			{#if !$user}
				<Button type="link" skin="cta" href="/login">
					{m.auth_sign_in()}
				</Button>
			{:else}
				<Button skin="text" type="link" href="/logout">
					<FontAwesomeIcon icon={logoutIcon} />
					<span>
						{m.auth_sign_out()}
					</span>
				</Button>
			{/if}
		</nav>
	</div>
</header>
