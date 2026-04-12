# OzHelper — Frontend Architecture Document

> **Version:** 1.0
> **Scope:** Enterprise-grade frontend engineering standards for the OzHelper project (Next.js 16, App Router, TanStack Query, TypeScript).
> **Purpose:** This document defines folder structure, data-fetching conventions, component architecture, state management, error/loading patterns, and code standards to ensure the codebase remains maintainable as the project scales.

---

## Table of Contents

1. [Philosophy & Core Principles](#1-philosophy--core-principles)
2. [Folder Structure](#2-folder-structure)
3. [Type System](#3-type-system)
4. [API Layer](#4-api-layer)
5. [TanStack Query Setup & Conventions](#5-tanstack-query-setup--conventions)
6. [Component Architecture](#6-component-architecture)
7. [Loading & Skeleton Patterns](#7-loading--skeleton-patterns)
8. [Error Handling Patterns](#8-error-handling-patterns)
9. [State Management Strategy](#9-state-management-strategy)
10. [Mock Data & Development Workflow](#10-mock-data--development-workflow)
11. [Page Construction Pattern](#11-page-construction-pattern)
12. [Form Architecture](#12-form-architecture)
13. [Auth & Protected Routes](#13-auth--protected-routes)
14. [Code Standards & Conventions](#14-code-standards--conventions)
15. [Dependency Map](#15-dependency-map)

---

## 1. Philosophy & Core Principles

### 1.1 Separation of Concerns

Every file should have a single, clear responsibility. Never mix data definitions, business logic, UI rendering, and API calls in the same file.

| Concern | Lives in |
|---|---|
| TypeScript types / interfaces | `types/` |
| API fetch functions | `lib/api/` |
| TanStack Query hooks | `hooks/queries/` or `hooks/mutations/` |
| Mock data for development | `lib/mocks/` |
| Pure UI components (no data) | `components/ui/` |
| Feature-specific components | `components/{feature}/` |
| Page orchestration | `app/(route)/page.tsx` |
| Server-side data fetching | `app/(route)/page.tsx` (RSC) or route handlers |

### 1.2 Server Components vs Client Components

- **Prefer Server Components (RSC)** by default. They render on the server, have no bundle cost, and can directly access databases/APIs.
- **Use `"use client"` only when** the component needs: browser events, `useState`, `useEffect`, TanStack Query hooks, or third-party client-only libraries.
- **Never put TanStack Query hooks in a Server Component.** The `QueryClientProvider` boundary must wrap all client-side query consumers.

### 1.3 Data Flow Direction

```
Backend API
    ↓
lib/api/{resource}.ts          ← pure fetch functions, no React
    ↓
hooks/queries/use-{resource}.ts ← TanStack Query hooks (client)
    ↓
components/{feature}/{Component}.tsx ← receives data as props
    ↓
app/(route)/page.tsx            ← orchestrates, passes data down
```

### 1.4 Progressive Enhancement

Pages must be functional even before JavaScript hydrates. Use RSC where possible so content is visible immediately. Client interactivity layers on top.

---

## 2. Folder Structure

```
oz-helper/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (QueryClientProvider here)
│   ├── page.tsx                  # "/" — task discovery feed
│   ├── about/
│   │   └── page.tsx              # "/about" — marketing landing
│   ├── sign-in/
│   │   └── page.tsx
│   ├── sign-up/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── onboarding/
│   │   └── tasker/
│   │       └── page.tsx
│   └── (dashboard)/              # Route group — authenticated
│       ├── layout.tsx            # Sidebar layout
│       ├── dashboard/
│       │   ├── page.tsx
│       │   └── loading.tsx       # ← every page gets a loading.tsx
│       ├── tasks/
│       │   ├── page.tsx
│       │   ├── loading.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       └── loading.tsx
│       ├── messages/
│       ├── profile/
│       ├── settings/
│       └── wallet/
│
├── components/
│   ├── ui/                       # shadcn/ui primitives — never modified
│   ├── marketing/                # Landing page sections
│   ├── dashboard/                # Dashboard chrome (sidebar, etc.)
│   ├── tasks/                    # Task-feature components
│   │   ├── task-card.tsx         # ← extracted from page.tsx
│   │   ├── task-card-skeleton.tsx
│   │   ├── task-feed.tsx
│   │   ├── task-filters.tsx
│   │   └── task-detail-panel.tsx
│   ├── profile/
│   ├── wallet/
│   ├── messages/
│   └── shared/                   # Cross-feature reusable components
│       ├── page-header.tsx
│       ├── empty-state.tsx
│       ├── error-boundary.tsx
│       └── avatar-with-badge.tsx
│
├── hooks/
│   ├── queries/                  # TanStack Query read hooks
│   │   ├── use-tasks.ts
│   │   ├── use-task.ts
│   │   ├── use-profile.ts
│   │   └── use-wallet.ts
│   ├── mutations/                # TanStack Query write hooks
│   │   ├── use-create-task.ts
│   │   ├── use-submit-offer.ts
│   │   └── use-update-profile.ts
│   └── use-mobile.ts             # Existing utility hooks
│
├── lib/
│   ├── api/                      # Pure fetch functions (no React)
│   │   ├── client.ts             # Base fetch client (error handling, auth headers)
│   │   ├── tasks.ts
│   │   ├── profile.ts
│   │   ├── wallet.ts
│   │   └── messages.ts
│   ├── mocks/                    # Mock data for development
│   │   ├── tasks.ts
│   │   ├── profile.ts
│   │   └── wallet.ts
│   ├── query-client.ts           # TanStack QueryClient singleton
│   └── utils.ts                  # Existing cn() utility
│
├── types/
│   ├── task.ts
│   ├── user.ts
│   ├── wallet.ts
│   └── api.ts                    # Shared API response wrapper types
│
├── providers/
│   └── query-provider.tsx        # ReactQueryDevtools + QueryClientProvider
│
└── docs/
    ├── UI.md
    └── architecture.md           ← this file
```

---

## 3. Type System

### 3.1 Naming Conventions

- **Domain types** (match backend schema exactly): `Task`, `User`, `Offer`
- **API response wrappers**: `ApiResponse<T>`, `PaginatedResponse<T>`
- **Component prop types**: `TaskCardProps`, `TaskFiltersProps` — defined in the same file as the component
- **Form types**: `CreateTaskFormValues`, defined alongside the form schema

### 3.2 Example: `types/task.ts`

```ts
// types/task.ts

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

export interface Task {
  id: number;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  price: number;           // Always store as number, format in UI
  suburb: string;
  postcode: string;
  state: string;
  hasTools: boolean;
  photos: string[];
  postedAt: string;        // ISO 8601
  urgent: boolean;
  offers: number;
  poster: TaskPoster;
}

export interface TaskPoster {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  memberSince: string;
}

export interface TaskFilters {
  categoryId: TaskCategory | "all";
  state: string;
  search: string;
  sortBy: "newest" | "price_asc" | "price_desc" | "nearest";
}
```

### 3.3 Example: `types/api.ts`

```ts
// types/api.ts

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}
```

---

## 4. API Layer

### 4.1 Base Client (`lib/api/client.ts`)

A single base client handles auth headers, base URL, and uniform error throwing. All resource-specific fetch functions call this, never `fetch` directly.

```ts
// lib/api/client.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  // Replace with your auth provider's token retrieval
  const token = typeof window !== "undefined"
    ? localStorage.getItem("oz_access_token")
    : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.code ?? "UNKNOWN_ERROR",
      body.message ?? `HTTP ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}
```

### 4.2 Resource API Functions (`lib/api/tasks.ts`)

```ts
// lib/api/tasks.ts

import { apiClient } from "./client";
import type { Task, TaskFilters } from "@/types/task";
import type { PaginatedResponse } from "@/types/api";

export async function fetchTasks(
  filters: Partial<TaskFilters> & { page?: number; pageSize?: number },
): Promise<PaginatedResponse<Task>> {
  const params = new URLSearchParams();
  if (filters.categoryId && filters.categoryId !== "all")
    params.set("category", filters.categoryId);
  if (filters.state && filters.state !== "All States")
    params.set("state", filters.state);
  if (filters.search) params.set("q", filters.search);
  if (filters.sortBy)  params.set("sort", filters.sortBy);
  if (filters.page)    params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  return apiClient(`/tasks?${params.toString()}`);
}

export async function fetchTask(id: number): Promise<Task> {
  return apiClient(`/tasks/${id}`);
}

export async function createTask(
  payload: Omit<Task, "id" | "postedAt" | "status" | "offers" | "poster">,
): Promise<Task> {
  return apiClient("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitOffer(
  taskId: number,
  payload: { message: string; price: number },
): Promise<void> {
  return apiClient(`/tasks/${taskId}/offers`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
```

### 4.3 API Function Rules

- **Never import React** inside `lib/api/`. These are plain async functions.
- **Never handle UI state** (loading, error toasts) here. That belongs in hooks or components.
- **Always type inputs and outputs** explicitly. Use the shared types from `types/`.
- **Always throw** on error responses (the base client handles this) — never return `null` or `undefined` to mask errors.

---

## 5. TanStack Query Setup & Conventions

### 5.1 Installation

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

### 5.2 QueryClient Singleton (`lib/query-client.ts`)

```ts
// lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,        // 1 minute — data is fresh, no refetch
        gcTime: 5 * 60 * 1000,       // 5 minutes — keep in cache after unmount
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx (client errors)
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
```

### 5.3 Provider (`providers/query-provider.tsx`)

```tsx
// providers/query-provider.tsx
"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { makeQueryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState ensures a new QueryClient per browser session, not shared across requests
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

Add to `app/layout.tsx`:

```tsx
// app/layout.tsx
import { QueryProvider } from "@/providers/query-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

### 5.4 Query Key Factory

Query keys must be **centralised** to avoid hard-coded string arrays scattered across files. This ensures consistent cache invalidation.

```ts
// lib/query-keys.ts

export const queryKeys = {
  tasks: {
    all:    ()               => ["tasks"] as const,
    list:   (filters: object) => ["tasks", "list", filters] as const,
    detail: (id: number)     => ["tasks", "detail", id] as const,
  },
  profile: {
    me: () => ["profile", "me"] as const,
  },
  wallet: {
    me: () => ["wallet", "me"] as const,
    transactions: () => ["wallet", "transactions"] as const,
  },
  messages: {
    conversations: () => ["messages", "conversations"] as const,
    thread: (id: number) => ["messages", "thread", id] as const,
  },
} as const;
```

### 5.5 Query Hook Pattern (`hooks/queries/use-tasks.ts`)

```ts
// hooks/queries/use-tasks.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api/tasks";
import { queryKeys } from "@/lib/query-keys";
import type { TaskFilters } from "@/types/task";

const PAGE_SIZE = 9;

export function useTasks(
  filters: Partial<TaskFilters>,
  page = 1,
) {
  return useQuery({
    queryKey: queryKeys.tasks.list({ ...filters, page }),
    queryFn:  () => fetchTasks({ ...filters, page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,   // prevents grid flash on filter change
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn:  () => fetchTask(id),
    enabled:  !!id,
  });
}
```

### 5.6 Mutation Hook Pattern (`hooks/mutations/use-create-task.ts`)

```ts
// hooks/mutations/use-create-task.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/lib/api/tasks";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // Invalidate the tasks list so it refetches
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all() });
      toast.success("Task posted successfully!");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });
}
```

### 5.7 TanStack Query Rules

| Rule | Reason |
|---|---|
| All query keys go through `queryKeys` factory | Consistent invalidation, no typos |
| `staleTime` set globally, override per-hook only if needed | Reduces unnecessary API calls |
| Use `keepPreviousData` on paginated/filtered lists | No content flash on filter change |
| `onError` in mutations shows a toast notification | User always sees feedback |
| Never call `queryClient.setQueryData` to fake optimistic updates unless fully understood | Can cause cache corruption |
| Infinite scroll uses `useInfiniteQuery`, pagination uses `useQuery` with page param | Correct tool for each pattern |

---

## 6. Component Architecture

### 6.1 Three Component Tiers

```
Tier 1 — Primitive         components/ui/           Never modified. shadcn/ui.
Tier 2 — Feature           components/{feature}/    Domain-specific. Uses Tier 1.
Tier 3 — Page Assembly     app/(route)/page.tsx     Orchestrates. Uses Tier 2+3.
```

**Rule: data never flows upward.** Pages pass data down. Components never fetch their own data unless they are standalone "smart" containers designed for that (clearly named `*-container.tsx`).

### 6.2 Component File Anatomy

```tsx
// components/tasks/task-card.tsx

// 1. Imports — external first, then internal
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

// 2. Prop type — always explicit, never inferred from usage
interface TaskCardProps {
  task: Task;
  className?: string;
}

// 3. Component — named export, not default
export function TaskCard({ task, className }: TaskCardProps) {
  // ...
}
```

**Rules:**
- **Named exports** for all components. Default exports only in `page.tsx` and `layout.tsx` (required by Next.js).
- **Props interface defined in the same file**, named `{ComponentName}Props`.
- **No inline data, no hardcoded strings** (except labels that will eventually be i18n keys).
- **No logic** in JSX beyond ternaries and simple `&&`. Extract to a variable or helper function above the return statement.

### 6.3 Smart vs Dumb Components

| Type | Example | Has query hooks? | Has state? |
|---|---|---|---|
| Dumb / Presentational | `TaskCard`, `TaskCardSkeleton` | No | No (or minimal UI state) |
| Smart / Container | `TaskFeed` | Yes (`useTasks`) | Yes (filters, pagination) |
| Page | `app/(dashboard)/tasks/page.tsx` | Rarely (prefer RSC prefetch) | No |

### 6.4 Extracting from `page.tsx`

The current `app/page.tsx` should be refactored so that page files are **thin orchestration layers**:

```
Before (anti-pattern):
  app/page.tsx  → types + mock data + filters state + card component + page layout

After (correct):
  types/task.ts                       ← Task, TaskFilters types
  lib/mocks/tasks.ts                  ← mock data (removed in production)
  components/tasks/task-card.tsx      ← TaskCard component
  components/tasks/task-card-skeleton.tsx
  components/tasks/task-filters.tsx   ← category pills + state tabs + search
  components/tasks/task-feed.tsx      ← smart container: calls useTasks, renders grid
  app/page.tsx                        ← imports TaskFeed + MarketingHeader + footer
```

---

## 7. Loading & Skeleton Patterns

### 7.1 Next.js `loading.tsx` (RSC pages)

For Server Component pages, place a `loading.tsx` sibling file. Next.js automatically wraps the page in a `<Suspense>` boundary.

```tsx
// app/(dashboard)/tasks/loading.tsx
import { TaskCardSkeleton } from "@/components/tasks/task-card-skeleton";

export default function TasksLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
```

### 7.2 Skeleton Component Pattern

Every data-driven component that takes >200ms to load needs a matching Skeleton:

```tsx
// components/tasks/task-card-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function TaskCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Image area */}
      <Skeleton className="aspect-3/2 w-full" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />  {/* category pill */}
        <Skeleton className="h-5 w-full" />              {/* title line 1 */}
        <Skeleton className="h-5 w-3/4" />              {/* title line 2 */}
        <div className="space-y-2 border-t border-border pt-3">
          <Skeleton className="h-4 w-32" />             {/* location */}
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />           {/* poster */}
            <Skeleton className="h-4 w-16" />           {/* time */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 7.3 TanStack Query Loading Pattern

For Client Component pages using `useTasks`:

```tsx
// components/tasks/task-feed.tsx
"use client";

import { useTasks } from "@/hooks/queries/use-tasks";
import { TaskCard } from "./task-card";
import { TaskCardSkeleton } from "./task-card-skeleton";
import { TaskFeedError } from "./task-feed-error";
import type { TaskFilters } from "@/types/task";

interface TaskFeedProps {
  filters: Partial<TaskFilters>;
  page: number;
}

export function TaskFeed({ filters, page }: TaskFeedProps) {
  const { data, isLoading, isError, error } = useTasks(filters, page);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <TaskFeedError error={error} />;
  }

  if (!data?.data.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.data.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### 7.4 Loading State Hierarchy (Decision Tree)

```
Is this a full page route?
├── Yes → use loading.tsx (Suspense)
└── No (component within page)
    ├── Is it a list/grid?  → skeleton grid matching card dimensions
    ├── Is it a detail panel? → skeleton matching content layout
    └── Is it a stat/number? → <Skeleton className="h-8 w-24" />
```

---

## 8. Error Handling Patterns

### 8.1 Error Levels

| Level | Scope | Mechanism | Component |
|---|---|---|---|
| Network / API errors | Per query | TanStack Query `isError` | `*-error.tsx` inline |
| Page-level crashes | Entire page | React Error Boundary | `error.tsx` |
| Form validation | Field | React Hook Form | Inline field message |
| Auth errors (401) | Global | `apiClient` interceptor | Redirect to sign-in |
| 404 Not Found | Route | Next.js `not-found.tsx` | `not-found.tsx` |

### 8.2 Next.js `error.tsx` (Page-level boundary)

```tsx
// app/(dashboard)/tasks/error.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="max-w-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} variant="outline" className="bg-transparent">
        Try again
      </Button>
    </div>
  );
}
```

### 8.3 Inline Query Error Component

For failed data fetches within a component (not a full page crash):

```tsx
// components/tasks/task-feed-error.tsx
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

interface TaskFeedErrorProps {
  error: unknown;
}

export function TaskFeedError({ error }: TaskFeedErrorProps) {
  const queryClient = useQueryClient();
  const message = error instanceof Error ? error.message : "Unable to load tasks";

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 py-16 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-destructive" />
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent"
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all() })
        }
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
```

### 8.4 Global 401 Handling in API Client

```ts
// lib/api/client.ts (extended)
if (res.status === 401) {
  // Clear local session and redirect
  if (typeof window !== "undefined") {
    localStorage.removeItem("oz_access_token");
    window.location.href = "/sign-in?reason=session_expired";
  }
  throw new ApiError(401, "UNAUTHORIZED", "Session expired. Please sign in.");
}
```

---

## 9. State Management Strategy

### 9.1 State Classification

| State type | Where it lives | Tool |
|---|---|---|
| Server / async data | TanStack Query cache | `useQuery`, `useMutation` |
| Global UI state (theme, sidebar open) | React Context | `createContext` + Provider |
| Page-level filter/search state | Local `useState` in smart container | `useState` |
| Form state | React Hook Form | `useForm` |
| URL-driven state (active tab, filter) | URL search params | `useSearchParams` + `router.push` |

### 9.2 URL-Driven Filter State (Recommended for Task Feed)

Storing filters in the URL (`?category=garden&state=NSW`) makes pages shareable, bookmarkable, and respects browser back/forward navigation.

```tsx
// components/tasks/task-filters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "All States") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // reset to page 1 on filter change
    router.push(`?${params.toString()}`, { scroll: false });
  }

  const activeCategory = searchParams.get("category") ?? "all";
  const activeState = searchParams.get("state") ?? "All States";

  // ... render category pills and state tabs using activeCategory / activeState
}
```

### 9.3 Do Not Use

- **Redux / Zustand** for server data — TanStack Query replaces this entirely for API state.
- **Context** for frequently updated values — causes unnecessary re-renders.
- **`localStorage` for filter state** — not shareable, not SSR-friendly.

---

## 10. Mock Data & Development Workflow

### 10.1 Mock Philosophy

Mock data must mirror the exact `types/` shapes as if they came from the real API. Never use ad-hoc inline objects.

```ts
// lib/mocks/tasks.ts
import type { Task, PaginatedResponse } from "@/types";

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Backyard Lawn Mowing – approx. 80 sqm",
    description: "Need someone to mow my backyard...",
    category: "garden",
    status: "open",
    price: 45,          // number, not "$45"
    suburb: "Bondi",
    postcode: "2026",
    state: "NSW",
    hasTools: true,
    photos: [],
    postedAt: "2026-04-12T10:00:00Z",
    urgent: false,
    offers: 2,
    poster: {
      id: "user_001",
      name: "Mary T.",
      rating: 4.8,
      verified: true,
      memberSince: "2024-01",
    },
  },
  // ...
];

export const mockTasksPage: PaginatedResponse<Task> = {
  data: mockTasks,
  total: mockTasks.length,
  page: 1,
  pageSize: 9,
  hasMore: false,
};
```

### 10.2 Switching Between Mock and Real API

Use an environment variable to toggle data sources. This removes the need to change any component code:

```ts
// lib/api/tasks.ts
import { mockTasksPage } from "@/lib/mocks/tasks";

export async function fetchTasks(filters, page) {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
    // Simulate network delay in dev
    await new Promise((r) => setTimeout(r, 400));
    return mockTasksPage;
  }
  return apiClient(`/tasks?${buildParams(filters, page)}`);
}
```

`.env.local`:
```
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 11. Page Construction Pattern

### 11.1 The `page.tsx` Rule

A `page.tsx` file should ideally contain **only**:
1. Imports
2. Metadata export (if static)
3. A single default export function composed of layout + feature containers

```tsx
// app/page.tsx  (after refactor)
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { TaskDiscoveryHero } from "@/components/tasks/task-discovery-hero";
import { TaskDiscoveryFeed } from "@/components/tasks/task-discovery-feed";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <TaskDiscoveryHero />
        <TaskDiscoveryFeed />
      </main>
      <MarketingFooter />
    </div>
  );
}
```

### 11.2 Server-Side Prefetching with TanStack Query (Advanced)

For pages where SEO or initial load speed matters, prefetch data in the Server Component and hydrate the client cache:

```tsx
// app/page.tsx (RSC with hydration)
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api/tasks";
import { queryKeys } from "@/lib/query-keys";
import { TaskDiscoveryFeed } from "@/components/tasks/task-discovery-feed";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.tasks.list({ page: 1 }),
    queryFn: () => fetchTasks({ page: 1, pageSize: 9 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskDiscoveryFeed />
    </HydrationBoundary>
  );
}
```

This pattern:
- Renders HTML immediately with data (great for SEO)
- Hydrates the TanStack Query client cache on the browser
- The client component sees `isLoading: false` immediately — no flash

---

## 12. Form Architecture

All forms use **React Hook Form** + **Zod** for schema validation.

### 12.1 Form File Structure

```
components/tasks/new-task-form/
├── index.tsx         ← multi-step form shell
├── step-category.tsx
├── step-details.tsx
├── step-location.tsx
├── step-budget.tsx
├── step-review.tsx
└── schema.ts         ← Zod schema + inferred types
```

### 12.2 Schema Pattern (`schema.ts`)

```ts
// components/tasks/new-task-form/schema.ts
import { z } from "zod";

export const newTaskSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(30, "Please provide more detail"),
  suburb: z.string().min(2, "Enter your suburb"),
  postcode: z.string().regex(/^\d{4}$/, "Enter a valid 4-digit postcode"),
  budget: z.coerce.number().min(5, "Minimum budget is $5"),
});

export type NewTaskFormValues = z.infer<typeof newTaskSchema>;
```

### 12.3 Form + Mutation Integration

```tsx
// components/tasks/new-task-form/index.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask } from "@/hooks/mutations/use-create-task";
import { newTaskSchema, type NewTaskFormValues } from "./schema";

export function NewTaskForm() {
  const { mutate: createTask, isPending } = useCreateTask();

  const form = useForm<NewTaskFormValues>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: { budget: 0 },
  });

  function onSubmit(values: NewTaskFormValues) {
    createTask(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ... */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Posting…" : "Post Task"}
      </Button>
    </form>
  );
}
```

---

## 13. Auth & Protected Routes

### 13.1 Route Protection

The `(dashboard)` route group requires authentication. Protect it in `middleware.ts`:

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/tasks/new", "/messages", "/profile", "/wallet", "/settings"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("oz_access_token");
  const isProtected = PROTECTED_PREFIXES.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !token) {
    const signIn = new URL("/sign-in", req.url);
    signIn.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/new", "/messages/:path*", "/profile/:path*", "/wallet/:path*", "/settings/:path*"],
};
```

### 13.2 Auth Context

```ts
// providers/auth-provider.tsx
// Provides: useAuth() → { user, isLoading, signOut }
// Implementation depends on chosen auth provider (Clerk / NextAuth / custom JWT)
```

---

## 14. Code Standards & Conventions

### 14.1 File Naming

| Type | Convention | Example |
|---|---|---|
| Components | `kebab-case.tsx` | `task-card.tsx` |
| Hooks | `use-kebab-case.ts` | `use-tasks.ts` |
| Types | `kebab-case.ts` | `task.ts` |
| API functions | `kebab-case.ts` | `tasks.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `PAGE_SIZE = 9` |

### 14.2 Export Convention

```ts
// Named exports everywhere except page.tsx and layout.tsx
export function TaskCard(...) {}       // ✅
export default function TaskCard(...) {} // ❌ (except pages/layouts)
```

### 14.3 Import Order (enforced by ESLint)

```ts
// 1. React
import { useState, useMemo } from "react";

// 2. Next.js
import Image from "next/image";
import Link from "next/link";

// 3. External libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 4. Internal — absolute (@/)
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/queries/use-tasks";
import type { Task } from "@/types/task";

// 5. Relative
import { TaskCardSkeleton } from "./task-card-skeleton";
```

### 14.4 Strict Rules

- **No `any`**. Use `unknown` + type narrowing if type is uncertain.
- **No hardcoded API URLs** outside `lib/api/client.ts`.
- **No `console.log`** in committed code (use a proper logging utility or remove).
- **No barrel exports (`index.ts`)** in `components/`. Import directly from the file to keep bundle analysis accurate.
- **`price` is always a `number`** in data/types. Format to `$45` only in the UI layer using a utility:

```ts
// lib/utils.ts (add to existing)
export function formatPrice(cents: number): string {
  return `$${cents.toLocaleString("en-AU")}`;
}
```

---

## 15. Dependency Map

```
app/page.tsx
└── components/tasks/task-discovery-feed.tsx   ["use client"]
    ├── hooks/queries/use-tasks.ts
    │   ├── lib/api/tasks.ts
    │   │   └── lib/api/client.ts
    │   ├── lib/query-keys.ts
    │   └── (lib/mocks/tasks.ts  ← dev only)
    ├── components/tasks/task-card.tsx          [pure, no hooks]
    │   └── types/task.ts
    ├── components/tasks/task-card-skeleton.tsx [pure, no hooks]
    ├── components/tasks/task-feed-error.tsx    [uses useQueryClient]
    └── components/shared/empty-state.tsx       [pure]

app/(dashboard)/tasks/new/page.tsx
└── components/tasks/new-task-form/index.tsx   ["use client"]
    ├── hooks/mutations/use-create-task.ts
    │   ├── lib/api/tasks.ts
    │   └── lib/query-keys.ts
    └── components/tasks/new-task-form/schema.ts
```

---

## Appendix: Refactoring Checklist (Current State → Target State)

Use this checklist when migrating `app/page.tsx` to the architecture above:

- [ ] Create `types/task.ts` with proper typed interfaces
- [ ] Move mock data to `lib/mocks/tasks.ts`, convert `price` to `number`
- [ ] Create `lib/api/tasks.ts` with `fetchTasks()` and `fetchTask()`
- [ ] Create `lib/api/client.ts` base fetch utility
- [ ] Create `lib/query-keys.ts`
- [ ] Create `lib/query-client.ts` and `providers/query-provider.tsx`
- [ ] Add `<QueryProvider>` to `app/layout.tsx`
- [ ] Install `@tanstack/react-query` and `@tanstack/react-query-devtools`
- [ ] Create `hooks/queries/use-tasks.ts`
- [ ] Extract `TaskCard` to `components/tasks/task-card.tsx`
- [ ] Create `components/tasks/task-card-skeleton.tsx`
- [ ] Create `components/tasks/task-feed-error.tsx`
- [ ] Create `components/tasks/task-feed.tsx` (smart container)
- [ ] Create `components/tasks/task-filters.tsx` (category pills + state tabs)
- [ ] Slim down `app/page.tsx` to layout orchestration only
- [ ] Add `app/(dashboard)/tasks/loading.tsx`
- [ ] Add `app/(dashboard)/tasks/error.tsx`
- [ ] Add `middleware.ts` for auth protection
