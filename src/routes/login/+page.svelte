<script lang="ts">
	import { goto } from '$app/navigation';
	import { getUser, requestCode, verifyCode } from '$lib/api/auth';
	import { auth } from '$lib/stores/auth.store';
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/components/Button.svelte';
	import GetCodeForm, { type LoginFormData } from '$lib/modules/login/components/GetCodeForm.svelte';
	import VerifyCodeForm, { type VerifyCodeFormData } from '$lib/modules/login/components/VerifyCodeForm.svelte';

	type Step = 'email' | 'code';

	const GET_CODE_FORM_ID = 'get-code-form';
	const VERIFY_CODE_FORM_ID = 'verify-code-form';

	let step = $state<Step>('email');
	let email = $state<string>('');
	let error = $state<string | null>(null);
	let submitting = $state(false);

	async function requestAuthCode(formData: LoginFormData) {
		error = null;
		submitting = true;
		try {
			await requestCode(formData);
			email = formData.email;
			step = 'code';
		} catch {
			error = m.error_failed_request_verification_code();
		} finally {
			submitting = false;
		}
	}

	async function verifyAuthCode(formData: VerifyCodeFormData) {
		error = null;
		submitting = true;
		try {
			const response = await verifyCode({ email, ...formData });
			auth.setAccessToken(response.accessToken);
			const user = await getUser();
			auth.setUser(user);
			await goto('/');
		} catch {
			error = m.error_failed_verify_code();
		} finally {
			submitting = false;
		}
	}
</script>

<div class="mx-auto w-full max-w-md rounded-(--palette-radius-lg) bg-(--palette-card) p-6 shadow-sm">
	<h1 class="mb-4 text-xl font-semibold text-(--palette-fg)">{m.auth_login_title()}</h1>
	{#if step === 'email'}
		<GetCodeForm id={GET_CODE_FORM_ID} class="w-full" onsubmit={requestAuthCode} />
	{:else if step === 'code'}
		<p class="mb-2 text-sm text-(--palette-fg-muted)">{m.auth_code_sent_to({ email })}</p>
		<VerifyCodeForm id={VERIFY_CODE_FORM_ID} class="w-full" onsubmit={verifyAuthCode} />
	{/if}

	{#if error}
		<p class="mt-3 text-sm text-(--palette-danger)">{error}</p>
	{/if}

	<menu class="mt-4 flex flex-row-reverse justify-start gap-2">
		{#if step === 'email'}
			<Button form={GET_CODE_FORM_ID} type="submit" disabled={submitting}>{m.auth_continue()}</Button>
		{:else if step === 'code'}
			<Button form={VERIFY_CODE_FORM_ID} type="submit" disabled={submitting}>{m.auth_verify()}</Button>
			<Button
				type="button"
				skin="text"
				disabled={submitting}
				onclick={() => {
					step = 'email';
				}}
			>
				{m.common_back()}
			</Button>
		{/if}
	</menu>
</div>
