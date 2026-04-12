export type TaskStatus = "open" | "in_progress" | "completed" | "cancelled";

export type TaskCategory =
  | "garden"
  | "pets"
  | "handyman"
  | "removals"
  | "cleaning"
  | "electrical"
  | "painting"
  | "errands";

export interface TaskPoster {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  memberSince: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: TaskCategory;
  categoryLabel: string;
  status: TaskStatus;
  price: number;
  suburb: string;
  postcode: string;
  state: string;
  hasTools: boolean;
  photos: string[];
  postedAt: string;
  postedAgo: string;
  urgent: boolean;
  offers: number;
  poster: TaskPoster;
}

export interface TaskFilters {
  categoryId: TaskCategory | "all";
  state: string;
  search: string;
  sortBy: "newest" | "price_asc" | "price_desc" | "nearest";
}
