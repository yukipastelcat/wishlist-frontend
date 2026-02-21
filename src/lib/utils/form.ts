// useForm.ts
import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';

export function useFormStore<T extends Record<string, unknown>>(initial: T) {
  const formData: Writable<T> = writable({ ...initial });

  function handleSubmit(callback: (data: T) => void) {
    return (event?: Event) => {
      event?.preventDefault();
      callback(get(formData));
    };
  }

  return {
    formData,
    handleSubmit,
  };
}
