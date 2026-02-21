import { writable, type Readable } from 'svelte/store';

type AsyncFn<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;

type UseAsyncActionOptions = {
	errorMessage?: string;
};

export function useAsyncAction<TArgs extends unknown[], TResult>(
	action: AsyncFn<TArgs, TResult>,
	options: UseAsyncActionOptions = {},
) {
	const pending = writable(false);
	const error = writable<string | null>(null);

	const wrappedAction = async (...args: TArgs): Promise<TResult | undefined> => {
		error.set(null);
		pending.set(true);
		try {
			return await action(...args);
		} catch (cause) {
			error.set(options.errorMessage ?? toErrorMessage(cause));
			return undefined;
		} finally {
			pending.set(false);
		}
	};

	const clearError = () => error.set(null);

	return {
		action: wrappedAction,
		pending: pending as Readable<boolean>,
		error: error as Readable<string | null>,
		clearError,
	};
}

function toErrorMessage(cause: unknown): string {
	if (typeof cause === 'object' && cause !== null) {
		const message = (cause as { message?: unknown }).message;
		if (typeof message === 'string' && message.trim().length > 0) {
			return message;
		}
	}

	return 'Request failed';
}
