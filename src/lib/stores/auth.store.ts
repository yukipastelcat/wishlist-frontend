// src/lib/stores/auth.ts
import { derived, get, writable, type Readable } from 'svelte/store';
import type { PermissionScope, User } from '$lib/types/auth';

function createAuthStore() {
  const storedAccessToken = window.sessionStorage.getItem('accessToken');
  const accessToken = writable<string | null>(storedAccessToken);
  const user = writable<User | null>(null);
  const userEmail = writable<string | null>(null);
  const permissionStores = new Map<string, Readable<boolean>>();

  function setAccessToken(token: string) {
    accessToken.set(token);
    window.sessionStorage.setItem('accessToken', token);
  }

  function setUser(userData: User) {
    user.set(userData);
    userEmail.set(userData.email);
  }

  function clearAuth() {
    user.set(null);
    userEmail.set(null);
    accessToken.set(null);
    window.sessionStorage.removeItem('accessToken');
  }

  function hasPermissionNow(resource: string, scope: PermissionScope): boolean {
    const currentUser = get(user);
    if (!currentUser) return false;

    return currentUser.permissions.some(
      (permission) =>
        permission.resource === resource && permission.scopes.includes(scope),
    );
  }

  function hasPermission(resource: string, scope: PermissionScope): Readable<boolean> {
    const cacheKey = `${resource}:${scope}`;
    const cached = permissionStores.get(cacheKey);
    if (cached) return cached;

    const permissionStore = derived(user, ($user) => {
      if (!$user) return false;
      return $user.permissions.some(
        (permission) =>
          permission.resource === resource && permission.scopes.includes(scope),
      );
    });

    permissionStores.set(cacheKey, permissionStore);
    return permissionStore;
  }

  return {
    accessToken,
    user,
    userEmail,
    setAccessToken,
    setUser,
    clearAuth,
    hasPermission,
    hasPermissionNow,
  };
}

export const auth = createAuthStore();
