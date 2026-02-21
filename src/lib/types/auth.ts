export type PermissionScope = 'create' | 'view' | 'edit' | 'delete';

export type Permission = {
	resource: string;
	scopes: PermissionScope[];
};

export type User = {
	email: string;
	permissions: Permission[];
};
