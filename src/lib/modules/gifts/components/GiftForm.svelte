<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale, locales } from '$lib/paraglide/runtime';
	import Tabs from '$lib/components/Tabs.svelte';
	import { useFormStore } from '$lib/utils/form';
	import type { HTMLAttributes } from 'svelte/elements';

	type TagOption = {
		id: string;
		title: string;
		color?: string;
	};

	type GiftFormState = {
		titleLocalized: Record<string, string>;
		descriptionLocalized: Record<string, string>;
		imageUrl: string;
		link: string;
		priceAmount: string;
		priceCurrency: string;
		claimable: boolean;
		tagIds: string[];
	};

	export type GiftFormData = {
		title: string;
		description?: string;
		titleLocalized: Record<string, string>;
		descriptionLocalized?: Record<string, string>;
		imageUrl?: string;
		link?: string;
		price?: {
			amount: number;
			currency: string;
		};
		claimable: boolean;
		tagIds: string[];
	};

	const localeCurrencies = Array.from(
		new Set(
			locales
				.map((locale) => m.currency_code({}, { locale })?.trim().toUpperCase() ?? 'USD')
				.filter((currency): currency is string => Boolean(currency))
		)
	);

	const defaultCurrency = m.currency_code({}, { locale: getLocale() })
		.trim()
		.toUpperCase() ?? 'USD';

	function toLocalizedStateMap(value: unknown): Record<string, string> {
		const result: Record<string, string> = {};
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			return result;
		}

		for (const locale of locales) {
			const current = (value as Record<string, unknown>)[locale];
			if (typeof current === 'string') {
				result[locale] = current;
			}
		}

		return result;
	}

	function withFallbackLocaleValue(
		value: Record<string, string>,
		fallback: string | undefined
	): Record<string, string> {
		const fallbackText = fallback?.trim();
		if (!fallbackText) return value;
		if (Object.keys(value).length > 0) return value;

		const defaultLocale = getLocale();
		return {
			...value,
			[defaultLocale]: fallbackText
		};
	}

	function toRequestLocalizedMap(value: Record<string, string>): Record<string, string> | undefined {
		const result: Record<string, string> = {};
		for (const locale of locales) {
			const next = value[locale]?.trim();
			if (next) {
				result[locale] = next;
			}
		}

		return Object.keys(result).length > 0 ? result : undefined;
	}

	const { formData, handleSubmit } = useFormStore<GiftFormState>({
		titleLocalized: {},
		descriptionLocalized: {},
		imageUrl: '',
		link: '',
		priceAmount: '',
		priceCurrency: defaultCurrency,
		claimable: true,
		tagIds: []
	});

	const { onsubmit, initialData, availableTags = [], ...rest } = $props<
		{
			initialData?: Partial<GiftFormData>;
			availableTags?: TagOption[];
			onsubmit?: (data: GiftFormData) => void | Promise<void>;
		} & Omit<HTMLAttributes<HTMLFormElement>, 'onsubmit'>
	>();

	let lastInitialKey = $state('');

	$effect(() => {
		const localizedTitle = withFallbackLocaleValue(
			toLocalizedStateMap(initialData?.titleLocalized),
			initialData?.title
		);
		const localizedDescription = withFallbackLocaleValue(
			toLocalizedStateMap(initialData?.descriptionLocalized),
			initialData?.description
		);

		const next: GiftFormState = {
			titleLocalized: localizedTitle,
			descriptionLocalized: localizedDescription,
			imageUrl: initialData?.imageUrl ?? '',
			link: initialData?.link ?? '',
			priceAmount:
				initialData?.price?.amount !== undefined && initialData?.price?.amount !== null
					? String(initialData.price.amount)
					: '',
			priceCurrency: initialData?.price?.currency ?? defaultCurrency,
			claimable: initialData?.claimable ?? true,
			tagIds: [...(initialData?.tagIds ?? [])]
		};

		const nextKey = JSON.stringify(next);
		if (nextKey === lastInitialKey) return;

		lastInitialKey = nextKey;
		formData.set(next);
	});

	const submitHandler = handleSubmit(async (data) => {
		if (!onsubmit) return;

		const normalizedPriceAmount =
			data.priceAmount.toString().trim().length > 0 ? Number(data.priceAmount) : undefined;
		const titleLocalized = toRequestLocalizedMap(data.titleLocalized);
		if (!titleLocalized) {
			return;
		}

		const descriptionLocalized = toRequestLocalizedMap(data.descriptionLocalized);
		const fallbackTitle = Object.values(titleLocalized)[0];
		const fallbackDescription = descriptionLocalized
			? Object.values(descriptionLocalized)[0]
			: undefined;
		const priceAmount =
			Number.isFinite(normalizedPriceAmount) && normalizedPriceAmount !== undefined
				? normalizedPriceAmount
				: undefined;
		const priceCurrency = data.priceCurrency.trim().toUpperCase() || undefined;
		const price = priceAmount !== undefined && priceCurrency
			? { amount: priceAmount, currency: priceCurrency }
			: undefined;

		await onsubmit({
			title: fallbackTitle,
			description: fallbackDescription,
			titleLocalized,
			descriptionLocalized,
			imageUrl: data.imageUrl.trim() || undefined,
			link: data.link.trim() || undefined,
			price,
			claimable: data.claimable,
			tagIds: data.tagIds
		});
	});

	const localizedTabs = locales.map((locale) => ({
		id: locale,
		label: locale.toUpperCase()
	}));
	let activeLocalizedLocale = $state<string>(locales[0] ?? 'en');

	function updateLocalizedField(
		field: 'titleLocalized' | 'descriptionLocalized',
		locale: string,
		value: string
	) {
		formData.update((current) => ({
			...current,
			[field]: {
				...current[field],
				[locale]: value
			}
		}));
	}

	function toggleTag(tagId: string, checked: boolean) {
		formData.update((current) => {
			const hasTag = current.tagIds.includes(tagId);
			if (checked && !hasTag) {
				return { ...current, tagIds: [...current.tagIds, tagId] };
			}
			if (!checked && hasTag) {
				return { ...current, tagIds: current.tagIds.filter((id) => id !== tagId) };
			}
			return current;
		});
	}
</script>

<form class="flex flex-col space-y-4" onsubmit={submitHandler} {...rest}>
	<fieldset class="flex flex-col gap-3">
		<Tabs tabs={localizedTabs} activeTabId={activeLocalizedLocale} onchange={(
			tabId
		) => (activeLocalizedLocale = tabId)} />

		<label class="flex flex-col">
			<span class="form-label">
				{m.gift_form_title({ locale: activeLocalizedLocale.toUpperCase() })}
			</span>
				<input
					class="form-control"
					name={`titleLocalized.${activeLocalizedLocale}`}
					type="text"
					maxlength="128"
					required={Object.keys($formData.titleLocalized).every(
						(locale) => !$formData.titleLocalized[locale]?.trim()
					)}
					value={$formData.titleLocalized[activeLocalizedLocale] ?? ''}
					oninput={(event) =>
						updateLocalizedField(
						'titleLocalized',
						activeLocalizedLocale,
						(event.currentTarget as HTMLInputElement).value
					)}
			/>
		</label>

		<label class="flex flex-col">
			<span class="form-label">
				{m.gift_form_description({ locale: activeLocalizedLocale.toUpperCase() })}
			</span>
			<textarea
				class="form-textarea"
				name={`descriptionLocalized.${activeLocalizedLocale}`}
				rows="3"
				value={$formData.descriptionLocalized[activeLocalizedLocale] ?? ''}
				oninput={(event) =>
					updateLocalizedField(
						'descriptionLocalized',
						activeLocalizedLocale,
						(event.currentTarget as HTMLTextAreaElement).value
					)}
			></textarea>
		</label>
	</fieldset>

	<label class="flex flex-col">
		<span class="form-label">{m.gift_form_image_url()}</span>
		<input class="form-control" bind:value={$formData.imageUrl} name="imageUrl" type="url" placeholder="https://..." />
	</label>

	<label class="flex flex-col">
		<span class="form-label">{m.gift_form_link()}</span>
		<input class="form-control" bind:value={$formData.link} name="link" type="url" placeholder="https://..." />
	</label>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<label class="flex flex-col">
			<span class="form-label">{m.gift_form_price_amount()}</span>
			<input
				class="form-control"
				bind:value={$formData.priceAmount}
				name="priceAmount"
				type="number"
				step="0.01"
				min="0"
				placeholder="199.99"
			/>
		</label>

		<label class="flex flex-col">
			<span class="form-label">{m.gift_form_price_currency()}</span>
			<select class="form-select" bind:value={$formData.priceCurrency} name="priceCurrency">
				{#each localeCurrencies as currency}
					<option value={currency}>{currency}</option>
				{/each}
			</select>
		</label>
	</div>

	<label class="flex items-center gap-2">
		<input class="form-checkbox" bind:checked={$formData.claimable} name="claimable" type="checkbox" />
		<span class="font-bold">{m.gift_form_claimable()}</span>
	</label>

	{#if availableTags.length > 0}
		<fieldset class="flex flex-col gap-2">
			<legend class="font-bold">{m.gift_form_tags()}</legend>
			{#each availableTags as tag}
				<label class="flex items-center gap-2">
					<input
						class="form-checkbox"
						type="checkbox"
						checked={$formData.tagIds.includes(tag.id)}
						onchange={(event) =>
							toggleTag(tag.id, (event.currentTarget as HTMLInputElement).checked)}
					/>
					<span>{tag.title}</span>
					{#if tag.color}
						<span
							class="inline-block h-3 w-3 rounded-full border"
							style={`background:${tag.color};`}
							aria-label={`tag color ${tag.color}`}
						></span>
					{/if}
				</label>
			{/each}
		</fieldset>
	{/if}
</form>
