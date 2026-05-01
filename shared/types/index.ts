/**
 * Shared types between frontend and backend
 */

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: number;
  servings: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducationContent {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Community {
  id: string;
  title: string;
  description: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}
