<script lang="ts">
	import { useFormStore } from '$lib/utils/form';
	import { m } from '$lib/paraglide/messages';
	import type { HTMLAttributes } from 'svelte/elements';

	export type LoginFormData = {
		email: string;
	};

    const { formData, handleSubmit } = useFormStore<LoginFormData>({
        email: ''
    });

	const { onsubmit, ...rest } = $props<
		{
			onsubmit?: (data: LoginFormData) => void;
		} | HTMLAttributes<HTMLFormElement>
	>();
</script>

<form class="flex flex-col space-y-4" onsubmit={handleSubmit(onsubmit)} {...rest}>
	<label class="flex flex-col">
		<span class="form-label">{m.auth_email_label()}</span>
		<input
			class="form-control"
			bind:value={$formData.email}
			name="email"
			type="email"
			autocomplete="email"
			required
			placeholder="you@example.com"
		/>
	</label>
</form>
