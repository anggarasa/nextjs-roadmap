export interface Project {
  id: string | number;
  name: string;
  description?: string;
  ownerId?: string | number;
  createdAt?: string;
  updatedAt?: string
}