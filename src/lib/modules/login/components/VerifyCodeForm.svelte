<script lang="ts">
	import { useFormStore } from '$lib/utils/form';
	import { m } from '$lib/paraglide/messages';
	import type { HTMLAttributes } from 'svelte/elements';

	export type VerifyCodeFormData = {
		code: string;
	};

    const { formData, handleSubmit } = useFormStore<VerifyCodeFormData>({
        code: ''
    });

	const { onsubmit, ...rest } = $props<
		{
			onsubmit?: (data: VerifyCodeFormData) => void|Promise<void>;
		} | HTMLAttributes<HTMLFormElement>
	>();
</script>


<form class="flex flex-col space-y-4" onsubmit={handleSubmit(onsubmit)} {...rest}>
	<label class="flex flex-col">
		<span class="form-label">{m.auth_verification_code_label()}</span>
		<input
			class="form-control text-center tracking-widest"
			bind:value={$formData.code}
			name="code"
			inputmode="numeric"
			maxlength="6"
			autocomplete="one-time-code"
			required
			placeholder="123456"
		/>
	</label>
</form>
