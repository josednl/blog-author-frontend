export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
};

export type Permission = {
  id: string;
  name: string;
  description?: string;
  roles?: Role[];
};
