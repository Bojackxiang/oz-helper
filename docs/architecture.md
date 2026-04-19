# OzHelper — Frontend Architecture Document

> **Version:** 1.0
> **Scope:** Enterprise-grade frontend engineering standards for the OzHelper project (Next.js 16, App Router, TanStack Query, Prisma ORM, TypeScript).
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
16. [Internationalisation (i18n)](#16-internationalisation-i18n)
17. [UGC Content Translation](#17-ugc-content-translation)
18. [Payment System](#18-payment-system)
19. [File & Image Storage](#19-file--image-storage)
20. [Real-time Messaging](#20-real-time-messaging)
21. [Notification System](#21-notification-system)
22. [Testing Strategy](#22-testing-strategy)
23. [Observability & Monitoring](#23-observability--monitoring)
24. [CI/CD & Deployment](#24-cicd--deployment)
25. [Security](#25-security)
26. [SEO Strategy](#26-seo-strategy)
27. [Growth Architecture (10k–200k Users)](#27-growth-architecture-10k200k-users)

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
| Prisma Client singleton | `lib/prisma.ts` |
| Server-side DB query functions | `lib/db/` |
| API route handlers (HTTP endpoints) | `app/api/` |

### 1.2 Server Components vs Client Components

This is the most important architectural decision in every component you write. The rule is: **default to Server Component, add `"use client"` only when forced to.**

#### When you MUST use `"use client"`

If your component requires **any** of the following, it must be a Client Component:

| Requirement | Examples |
|---|---|
| Browser event handlers | `onClick`, `onChange`, `onSubmit` |
| React state | `useState`, `useReducer` |
| React side effects / refs | `useEffect`, `useRef`, `useCallback` (with state dep) |
| TanStack Query hooks | `useQuery`, `useMutation`, `useQueryClient` |
| Client-side navigation hooks | `useRouter`, `useSearchParams`, `usePathname` |
| Third-party libraries not adapted for RSC | Most UI animation libs, chart libs, etc. |

#### When to keep it a Server Component (default)

| Scenario | Examples in this project |
|---|---|
| Data display pages (SEO matters) | Task list, task detail, profile page |
| Static layout and chrome | Sidebar, header, footer, page shell |
| Database access via Prisma | Any `page.tsx` that reads data on load |
| Conditional redirects | Auth guards using `redirect()` |
| No user interaction needed | `TaskCard`, `TaskCardSkeleton`, marketing sections |

#### Decision Tree

```
Does this component need user interaction (click, input, etc.)?
├── Yes → "use client"
└── No
    └── Does it need browser APIs (window, localStorage, IntersectionObserver)?
        ├── Yes → "use client"
        └── No
            └── Does it need React hooks (useState, useEffect, useQuery...)?
                ├── Yes → "use client"
                └── No → Server Component ✅  (can use Prisma directly)
```

#### Project component classification

| Component | Type | Reason |
|---|---|---|
| `app/**/page.tsx` | Server Component | Fetches data via Prisma, no interactivity |
| `app/**/layout.tsx` | Server Component | Static structure |
| `TaskCard` | Server Component | Pure display, no events |
| `TaskCardSkeleton` | Server Component | Pure display |
| Marketing sections (`HeroSection`, etc.) | Server Component | Static content |
| `TaskFeed` | **Client Component** | Uses `useQuery` + filter state |
| `TaskFilters` | **Client Component** | Uses `useState` + `useSearchParams` |
| `NewTaskForm` | **Client Component** | Uses `useForm` + `useMutation` |
| Sidebar (with collapse) | **Client Component** | Uses `useState` for open/close |
| Any `Dialog` / `Sheet` / `Dropdown` | **Client Component** | Uses `useState` for open state |

#### The golden rule: push `"use client"` to the leaf nodes

Never add `"use client"` to a page or layout just because one small child needs it. Instead, extract the interactive part into its own component and add `"use client"` only there.

```tsx
// ❌ Anti-pattern: entire page becomes Client because of one button
"use client";
export default function TasksPage() {
  // Now this page can no longer use Prisma directly
  const [open, setOpen] = useState(false);
  const tasks = ...; // forced to fetch via HTTP instead of Prisma
  return <div>...</div>;
}

// ✅ Correct: page is RSC, only the interactive slice is Client
// app/(dashboard)/tasks/page.tsx  ← RSC, Prisma direct
export default async function TasksPage() {
  const tasks = await queryTasks({});
  return (
    <div>
      <TaskList tasks={tasks} />   {/* Server Component — pure display */}
      <TaskFeed />                  {/* Client Component — has useQuery + filters */}
    </div>
  );
}
```

This keeps the HTML rendered on the server, minimises JavaScript bundle size, and ensures the best possible SEO and Time to First Byte.

- **Never put TanStack Query hooks in a Server Component.** The `QueryClientProvider` boundary must wrap all client-side query consumers.
- **Never use Prisma in a Client Component.** Prisma is Node.js-only and cannot run in the browser. Client Components always fetch data via `app/api/` Route Handlers.

### 1.3 Data Flow Direction

```
Database (Prisma ORM)
         ↓
    lib/prisma.ts                    ← Prisma Client singleton (server-only)
         ↓
    lib/db/{resource}.ts             ← server-only DB query functions

    RSC path ↙                        ↘ Client path
app/(route)/page.tsx            app/api/{resource}/route.ts
← calls lib/db/ directly         ← Route Handler, calls lib/db/
         ↓                                    ↓
components/{feature}/            lib/api/{resource}.ts
← receives data as props         ← fetch functions, calls /api/* routes
                                           ↓
                                 hooks/queries/use-{resource}.ts
                                 ← TanStack Query hooks (client)
                                           ↓
                                 components/{feature}/
                                 ← receives data as props
```

### 1.4 Progressive Enhancement

Pages must be functional even before JavaScript hydrates. Use RSC where possible so content is visible immediately. Client interactivity layers on top.

---

## 2. Folder Structure

```
oz-helper/
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Auto-generated migration files
│
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
│   ├── api/                      # Route Handlers (HTTP endpoints)
│   │   ├── tasks/
│   │   │   ├── route.ts          # GET /api/tasks, POST /api/tasks
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET /api/tasks/:id
│   │   ├── profile/
│   │   │   └── route.ts
│   │   └── wallet/
│   │       └── route.ts
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
│   ├── prisma.ts                 # Prisma Client singleton (server-only)
│   ├── db/                       # Server-only DB query functions (Node.js)
│   │   ├── tasks.ts
│   │   ├── profile.ts
│   │   └── wallet.ts
│   ├── api/                      # Client-side fetch functions (call /api/* routes)
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

## 4. Data Access Layer

This project uses **Prisma ORM** as the database layer. There are two distinct access paths depending on context:

| Context | Mechanism | Files involved |
|---|---|---|
| Server Components (RSC) | Direct Prisma call | `lib/db/{resource}.ts` |
| Client Components | `fetch` → Route Handler → Prisma | `lib/api/{resource}.ts` → `app/api/` → `lib/db/` |

### 4.1 Prisma Client Singleton (`lib/prisma.ts`)

Prisma Client must be a singleton — in development, Next.js hot-reload would otherwise exhaust the database connection pool.

```ts
// lib/prisma.ts
// SERVER-ONLY — never import this in Client Components or lib/api/
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 4.2 Server DB Query Functions (`lib/db/tasks.ts`)

All Prisma calls are centralised in `lib/db/`. These are **server-only** — called from Route Handlers and RSC pages. Never import in Client Components.

```ts
// lib/db/tasks.ts
// SERVER-ONLY — do not import in Client Components
import { prisma } from "@/lib/prisma";
import type { Task, TaskFilters } from "@/types/task";
import type { PaginatedResponse } from "@/types/api";

export async function queryTasks(
  filters: Partial<TaskFilters> & { page?: number; pageSize?: number },
): Promise<PaginatedResponse<Task>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 9;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters.categoryId && filters.categoryId !== "all"
      ? { category: filters.categoryId }
      : {}),
    ...(filters.state && filters.state !== "All States"
      ? { state: filters.state }
      : {}),
    ...(filters.search
      ? { title: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
    status: "open" as const,
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { postedAt: "desc" },
      include: { poster: true },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks as unknown as Task[],
    total,
    page,
    pageSize,
    hasMore: skip + tasks.length < total,
  };
}

export async function queryTask(id: number): Promise<Task> {
  return prisma.task.findUniqueOrThrow({
    where: { id },
    include: { poster: true },
  }) as unknown as Promise<Task>;
}

export async function createTaskRecord(
  payload: Omit<Task, "id" | "postedAt" | "status" | "offers" | "poster">,
  posterId: string,
): Promise<Task> {
  return prisma.task.create({
    data: { ...payload, posterId, status: "open" },
    include: { poster: true },
  }) as unknown as Promise<Task>;
}
```

### 4.3 API Route Handlers (`app/api/`)

Route Handlers are the HTTP interface for Client Components. They call `lib/db/` and return JSON responses.

```ts
// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { queryTasks } from "@/lib/db/tasks";
import type { TaskFilters } from "@/types/task";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filters: Partial<TaskFilters> = {
    categoryId: (searchParams.get("category") as TaskFilters["categoryId"]) ?? "all",
    state: searchParams.get("state") ?? "All States",
    search: searchParams.get("q") ?? "",
    sortBy: (searchParams.get("sort") as TaskFilters["sortBy"]) ?? "newest",
  };
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 9);

  try {
    const data = await queryTasks({ ...filters, page, pageSize });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch tasks", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
```

```ts
// app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import { queryTask } from "@/lib/db/tasks";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const task = await queryTask(Number(params.id));
    return NextResponse.json(task);
  } catch {
    return NextResponse.json(
      { message: "Task not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }
}
```

### 4.4 Base HTTP Client (`lib/api/client.ts`)

Used by Client Components to call same-origin Route Handlers. `BASE_URL` is `/api` — no external server required.

```ts
// lib/api/client.ts

const BASE_URL = "/api";

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

### 4.5 Resource Fetch Functions (`lib/api/tasks.ts`)

Used by TanStack Query hooks in Client Components. Calls the Route Handlers defined in `app/api/`.

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

### 4.6 Data Access Rules

| Rule | Reason |
|---|---|
| `lib/db/` is server-only | Prevents Prisma from leaking into the client bundle |
| `lib/prisma.ts` uses a global singleton | Prevents connection pool exhaustion during dev hot-reload |
| Route Handlers call `lib/db/`, never `lib/api/` | Avoids unnecessary HTTP round-trips on the server |
| RSC `page.tsx` calls `lib/db/` directly | No HTTP overhead — faster Time to First Byte |
| Client Components use `lib/api/` → Route Handlers | Prisma is Node.js-only, cannot run in the browser |
| Never put raw Prisma calls in `page.tsx` | Extract to `lib/db/` for reusability and testability |

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

This classification maps directly to the RSC vs Client Component boundary defined in [Section 1.2](#12-server-components-vs-client-components).

| Type | Rendering | Example | Has query hooks? | Has state? |
|---|---|---|---|---|
| Dumb / Presentational | Server Component | `TaskCard`, `TaskCardSkeleton` | No | No |
| Smart / Container | **Client Component** | `TaskFeed`, `TaskFilters` | Yes (`useQuery`) | Yes |
| Page | Server Component | `app/(dashboard)/tasks/page.tsx` | No (uses `lib/db/` directly) | No |

**Key implication:** `TaskCard` can be a Server Component because it only receives a `task` prop and renders it. `TaskFeed` must be a Client Component because it calls `useTasks()`. The page passes pre-fetched data to `TaskCard` via props, while `TaskFeed` manages its own data fetching client-side for interactive filtering.

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

### 10.2 Switching Between Mock and Real Database

Use a **server-side** environment variable to toggle data sources inside `lib/db/`. Since mocking happens on the server (Node.js only), no `NEXT_PUBLIC_` prefix is needed — the flag never reaches the client bundle.

```ts
// lib/db/tasks.ts
import { mockTasksPage } from "@/lib/mocks/tasks";

export async function queryTasks(filters, page) {
  if (process.env.USE_MOCKS === "true") {
    // Simulate database query latency
    await new Promise((r) => setTimeout(r, 400));
    return mockTasksPage;
  }
  // real Prisma query...
}
```

`.env.local`:
```
USE_MOCKS=true
DATABASE_URL=postgresql://user:password@localhost:5432/ozhelper
```

> **Note:** Because mock switching lives in `lib/db/` (server-only), the flag is never exposed to the client — safer than `NEXT_PUBLIC_USE_MOCKS`.

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

For pages where SEO or initial load speed matters, prefetch data in the Server Component using Prisma directly (no HTTP round-trip) and hydrate the client cache:

```tsx
// app/page.tsx (RSC with hydration — Prisma direct, no HTTP)
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { queryTasks } from "@/lib/db/tasks";   // ← Prisma direct, no fetch()
import { queryKeys } from "@/lib/query-keys";
import { TaskDiscoveryFeed } from "@/components/tasks/task-discovery-feed";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.tasks.list({ page: 1 }),
    queryFn: () => queryTasks({ page: 1, pageSize: 9 }), // ← Prisma, not fetch()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskDiscoveryFeed />
    </HydrationBoundary>
  );
}
```

This pattern:
- Queries the database **directly** on the server — no HTTP round-trip
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
Database (Prisma)
    └── lib/prisma.ts
            └── lib/db/tasks.ts  [server-only]
                    ├── (lib/mocks/tasks.ts  ← dev only, USE_MOCKS=true)
                    ├── app/api/tasks/route.ts     [Route Handler]
                    │       ← called by lib/api/tasks.ts via fetch()
                    └── app/page.tsx  [RSC — Prisma direct, no HTTP]
                            └── HydrationBoundary
                                    └── components/tasks/task-discovery-feed.tsx  ["use client"]
                                            ├── hooks/queries/use-tasks.ts
                                            │   ├── lib/api/tasks.ts  → GET /api/tasks
                                            │   │   └── lib/api/client.ts
                                            │   └── lib/query-keys.ts
                                            ├── components/tasks/task-card.tsx          [pure, no hooks]
                                            │   └── types/task.ts
                                            ├── components/tasks/task-card-skeleton.tsx [pure, no hooks]
                                            ├── components/tasks/task-feed-error.tsx    [uses useQueryClient]
                                            └── components/shared/empty-state.tsx       [pure]

app/(dashboard)/tasks/new/page.tsx
└── components/tasks/new-task-form/index.tsx   ["use client"]
    ├── hooks/mutations/use-create-task.ts
    │   ├── lib/api/tasks.ts  → POST /api/tasks  → app/api/tasks/route.ts  → lib/db/tasks.ts
    │   └── lib/query-keys.ts
    └── components/tasks/new-task-form/schema.ts
```

---

## 16. Internationalisation (i18n)

OzHelper supports **English (`en`)** and **Chinese (`zh`)**. UI text is handled by `next-intl`, which has first-class support for the App Router (both RSC and Client Components).

### 16.1 URL Structure

```
/en/tasks          ← English
/zh/tasks          ← Chinese
/                  ← Auto-detects browser language and redirects
```

All routes are nested under a `[locale]` dynamic segment:

```
app/
  [locale]/
    layout.tsx       ← provides locale to next-intl
    page.tsx
    (dashboard)/
      tasks/page.tsx
      ...
```

### 16.2 Translation File Structure (per-module files)

Translation files are split by feature module. This keeps files small and allows `next-intl` to load only what a page needs.

```
messages/
  en/
    common.json      ← shared actions, errors, nav labels
    tasks.json
    profile.json
    wallet.json
    auth.json
    dashboard.json
  zh/
    common.json
    tasks.json
    profile.json
    wallet.json
    auth.json
    dashboard.json
```

### 16.3 Translation File Conventions

Keys are organised by **component layer** within each file. English is the canonical source — never use Chinese as a key.

```json
// messages/zh/tasks.json
{
  "page": {
    "title": "找任务",
    "subtitle": "在你附近发现各类任务"
  },
  "card": {
    "offers": "{count} 个报价",
    "urgent": "紧急",
    "postedAt": "{time}前发布"
  },
  "filters": {
    "allCategories": "全部分类",
    "allStates": "全部州",
    "searchPlaceholder": "搜索任务..."
  },
  "empty": {
    "title": "暂无任务",
    "description": "试试调整筛选条件"
  },
  "status": {
    "open": "开放中",
    "in_progress": "进行中",
    "completed": "已完成",
    "cancelled": "已取消"
  }
}
```

```json
// messages/zh/common.json
{
  "actions": {
    "save": "保存",
    "cancel": "取消",
    "confirm": "确认",
    "back": "返回",
    "submit": "提交",
    "retry": "重试"
  },
  "errors": {
    "generic": "出了点问题，请稍后重试",
    "notFound": "页面不存在",
    "unauthorized": "请先登录"
  },
  "nav": {
    "dashboard": "仪表盘",
    "tasks": "任务",
    "messages": "消息",
    "wallet": "钱包",
    "profile": "个人主页",
    "settings": "设置"
  }
}
```

### 16.4 Usage in Components

**Server Component (RSC):**
```tsx
// app/[locale]/(dashboard)/tasks/page.tsx
import { getTranslations } from "next-intl/server";

export default async function TasksPage() {
  const t = await getTranslations("tasks");   // loads messages/{locale}/tasks.json
  return (
    <div>
      <h1>{t("page.title")}</h1>
      <p>{t("page.subtitle")}</p>
    </div>
  );
}
```

**Client Component:**
```tsx
// components/tasks/task-card.tsx
"use client";
import { useTranslations } from "next-intl";

export function TaskCard({ task }: TaskCardProps) {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");

  return (
    <div>
      <span>{t(`status.${task.status}`)}</span>               {/* dynamic key */}
      <span>{t("card.offers", { count: task.offers })}</span> {/* interpolation */}
      <button>{tCommon("actions.save")}</button>
    </div>
  );
}
```

### 16.5 i18n Rules

| Rule | Reason |
|---|---|
| Translation only happens in the UI layer | `lib/db/`, `lib/api/`, and types never contain translated strings |
| Database stores enum values in English (`"open"`, `"in_progress"`) | Translate to display text via `t("status.open")` in the UI |
| `common.json` only for truly shared strings | Don't dump everything into common — keep it focused |
| Write English keys first, then Chinese values | English is the canonical source, prevents drift |
| never use Chinese as a translation key | Keys must be language-agnostic identifiers |

---

## 17. UGC Content Translation

UI translation (Section 16) handles static text you control. **UGC (User Generated Content)** — task titles, descriptions, and messages posted by users — requires a different approach: machine translation stored in the database.

### 17.1 Strategy: Pre-translate at Publish Time (Recommended)

When a user posts a task, a background job immediately translates the content to all other supported locales and persists the result. Subsequent reads are free — no API call needed at query time.

```
User submits task
        ↓
createTaskRecord() — saves original text (e.g. English)
        ↓
Async background job triggers
        ↓
Calls Google Translate / DeepL API
        ↓
  ✅ Success → writes titleZh / descriptionZh to DB
  ❌ Failure → leaves null, UI falls back to original text
```

### 17.2 Prisma Schema

Add translated columns alongside the original fields:

```prisma
// prisma/schema.prisma
model Task {
  id              Int       @id @default(autoincrement())
  // Original content (author's language)
  titleEn         String
  descriptionEn   String
  // Translated content (nullable until translation job completes)
  titleZh         String?
  descriptionZh   String?
  // Original locale so we know which field is the source of truth
  originalLocale  String    @default("en")   // "en" | "zh"

  // ... other fields
}
```

### 17.3 DB Query with Locale-Aware Field Selection

```ts
// lib/db/tasks.ts
export async function queryTask(id: number, locale: "en" | "zh"): Promise<Task> {
  const row = await prisma.task.findUniqueOrThrow({
    where: { id },
    include: { poster: true },
  });

  // Serve translated content if available, fall back to original
  return {
    ...row,
    title:       locale === "zh" ? (row.titleZh       ?? row.titleEn)       : row.titleEn,
    description: locale === "zh" ? (row.descriptionZh ?? row.descriptionEn) : row.descriptionEn,
    translationPending: locale === "zh" && !row.titleZh,
  } as unknown as Task;
}
```

### 17.4 Translation Job

Keep the translation concern inside `lib/db/` so it never touches the UI layer:

```ts
// lib/db/translation.ts  (server-only)
import { prisma } from "@/lib/prisma";

export async function translateTask(taskId: number): Promise<void> {
  const task = await prisma.task.findUniqueOrThrow({ where: { id: taskId } });

  // Call your translation provider (Google Translate / DeepL)
  const [titleZh, descriptionZh] = await Promise.all([
    translateText(task.titleEn, "zh"),
    translateText(task.descriptionEn, "zh"),
  ]);

  await prisma.task.update({
    where: { id: taskId },
    data: { titleZh, descriptionZh },
  });
}

async function translateText(text: string, targetLocale: string): Promise<string> {
  // Google Translate example — replace with your provider
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, target: targetLocale }),
    },
  );
  const json = await res.json();
  return json.data.translations[0].translatedText;
}
```

### 17.5 UI Fallback

When a translation hasn't completed yet, show the original text with a subtle indicator:

```tsx
// components/tasks/task-card.tsx
export function TaskCard({ task }: TaskCardProps) {
  const t = useTranslations("tasks");
  return (
    <div>
      <h3>{task.title}</h3>  {/* already locale-resolved by queryTask() */}
      {task.translationPending && (
        <span className="text-xs text-muted-foreground">
          {t("card.translationPending")}  {/* "翻译处理中" */}
        </span>
      )}
    </div>
  );
}
```

### 17.6 UGC Translation Rules

| Rule | Reason |
|---|---|
| Translation resolved in `lib/db/`, not in components | Components receive already-localised data as props |
| Always fall back to original text if translation is null | Never show a blank title |
| Store `originalLocale` on the record | Needed when a Chinese user posts — translate to English, not the other way |
| Translation API key in `.env` (server-only, no `NEXT_PUBLIC_`) | Key must never reach the client bundle |
| Translation job is async and fire-and-forget at post time | Don't block the user's publish action |

---

## 18. Payment System

OzHelper uses an **escrow model**: poster funds are held by the platform until the task is marked complete, then released to the tasker minus the platform commission.

### 18.1 Provider

**Stripe** is the primary payment provider for the Australian market.

- Supports AUD natively
- Stripe Connect for tasker payouts to bank accounts
- Handles GST invoice generation
- Strong 3DS2 card authentication compliance (required under Australian regulations)

```
STRIPE_SECRET_KEY=sk_...          # server-only, never NEXT_PUBLIC_
STRIPE_PUBLISHABLE_KEY=pk_...     # safe to expose on client
STRIPE_WEBHOOK_SECRET=whsec_...   # for verifying webhook payloads
STRIPE_PLATFORM_FEE_PERCENT=10    # e.g. 10% commission
```

### 18.2 Wallet Model

```
User
  ├── walletBalance: number        ← spendable credit (AUD cents)
  ├── pendingEarnings: number      ← held in escrow
  └── StripeConnectAccountId: string  ← for payouts

Transaction
  ├── id
  ├── type: TOPUP | ESCROW_HOLD | ESCROW_RELEASE | PAYOUT | REFUND
  ├── amount: number               ← always in AUD cents
  ├── taskId?: string
  └── stripePaymentIntentId?: string
```

### 18.3 Payment Flow

```
1. Poster tops up wallet (Stripe PaymentIntent)
2. Poster accepts offer → funds move from walletBalance → escrow (TaskTransaction)
3. Task marked complete → escrow released to tasker pendingEarnings (minus commission)
4. Tasker requests payout → Stripe Connect transfer to bank account
5. Dispute raised → escrow held, manual review by admin
```

### 18.4 Route Handlers

```
app/api/payments/
  create-payment-intent/route.ts   ← creates Stripe PaymentIntent for topup
  webhook/route.ts                 ← receives Stripe webhook events
  payout/route.ts                  ← triggers Connect payout
```

**Webhook handler must verify the Stripe signature before processing any event:**

```typescript
// app/api/payments/webhook/route.ts
import Stripe from "stripe";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  // now safe to process event.type
}
```

### 18.5 Rules

| Rule | Why |
|---|---|
| All amounts stored in **AUD cents** (integer) | Avoids floating-point rounding errors |
| `price` in the UI is formatted via `formatPrice()` | `formatPrice(4500)` → `$45.00` |
| Never store card numbers or bank account numbers | Use Stripe's tokenised representation only |
| Payout only to verified Stripe Connect accounts | Prevents fraud |
| All financial Prisma operations wrapped in `prisma.$transaction()` | Atomicity — wallet + transaction record must both succeed |

---

## 19. File & Image Storage

### 19.1 Provider

**Cloudflare R2** (preferred) or **AWS S3** for file and image storage.

- R2 has no egress fees — better for image-heavy use
- S3 is a fallback if you need AWS ecosystem tools

```
STORAGE_ACCOUNT_ID=...       # Cloudflare account ID (R2)
STORAGE_ACCESS_KEY_ID=...    # server-only
STORAGE_SECRET_ACCESS_KEY=...
STORAGE_BUCKET_NAME=oz-helper-uploads
STORAGE_PUBLIC_DOMAIN=https://cdn.ozhelper.com.au
```

### 19.2 Upload Flow

```
Client → POST /api/upload/presign   (request a signed URL)
       ← { uploadUrl, publicUrl }   (signed URL from R2/S3)
Client → PUT {uploadUrl}            (upload directly to R2/S3, no proxy)
Client sends publicUrl to API       (save the URL in DB, not the file)
```

Rationale: direct-to-R2/S3 upload avoids streaming large files through the Next.js server.

### 19.3 Path Convention

```
tasks/{taskId}/cover.webp
tasks/{taskId}/attachments/{filename}
users/{userId}/avatar.webp
```

### 19.4 Rules

| Rule | Why |
|---|---|
| Convert all images to WebP before upload | Smaller file sizes, better Core Web Vitals |
| Enforce max 10MB per file at Route Handler | Prevent abuse; validate before issuing signed URL |
| Signed URLs expire in 15 minutes | Security — attacker can't reuse the URL |
| Store only the `publicUrl` in DB | Don't store signed URLs — they expire |
| Serve images through `cdn.ozhelper.com.au` | Allows CDN cache purge without changing DB |

```typescript
// Maximum enforced at Route Handler before issuing presigned URL:
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
if (fileSize > MAX_FILE_BYTES) {
  return NextResponse.json({ error: "File too large" }, { status: 413 });
}
```

---

## 20. Real-time Messaging

### 20.1 Provider

**Pusher** or **Ably** — managed WebSocket services. Both have Next.js SDKs and free tiers suitable for early-stage.

```
PUSHER_APP_ID=...
PUSHER_KEY=...                  # safe on client (NEXT_PUBLIC_PUSHER_KEY)
PUSHER_SECRET=...               # server-only
PUSHER_CLUSTER=ap4              # Sydney-region cluster
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=ap4
```

### 20.2 Message Persistence Pattern

**Write-to-DB first, push-to-channel second.** The WebSocket is a delivery optimisation; the database is the source of truth.

```typescript
// app/api/messages/route.ts
export async function POST(req: Request) {
  const message = await saveMessageToDb(data);      // 1. persist
  await pusher.trigger(                             // 2. push
    `private-chat-${message.conversationId}`,
    "new-message",
    message
  );
  return NextResponse.json(message);
}
```

### 20.3 Folder Structure

```
app/
  (dashboard)/
    messages/
      page.tsx                 ← RSC: loads conversation list
      [id]/
        page.tsx               ← RSC: loads message history
components/
  messages/
    conversation-list.tsx      ← "use client" — real-time updates
    message-feed.tsx           ← "use client" — subscribes to Pusher channel
    message-input.tsx          ← "use client" — form submission
```

### 20.4 Rules

| Rule | Why |
|---|---|
| All messages persisted in DB regardless of WebSocket delivery | Receiver may be offline |
| Authenticate Pusher channels via `/api/pusher/auth` Route Handler | Never expose the Pusher secret to the client |
| Presence channels for online status | Shows "Online" badge on user profiles |
| Do not use WebSocket for transactional operations | Payments, task status changes go through HTTP + DB |

---

## 21. Notification System

### 21.1 Channels

| Channel | Provider | When used |
|---|---|---|
| Email | **Resend** (primary) or SendGrid | New offer, task awarded, payment received |
| Push (mobile) | **Firebase Cloud Messaging (FCM)** | When React Native app is built |
| In-app | Stored in DB, polled via TanStack Query | All events, visible in notification bell |

```
RESEND_API_KEY=re_...            # server-only
```

### 21.2 In-App Notification Model

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // NEW_OFFER | TASK_AWARDED | PAYMENT_RECEIVED | NEW_MESSAGE
  title     String
  body      String
  data      Json?    // { taskId, offerId, etc. }
  readAt    DateTime?
  createdAt DateTime @default(now())
}
```

### 21.3 Trigger Points

| Event | In-app | Email |
|---|---|---|
| Tasker submits offer | ✅ poster | ✅ poster |
| Poster awards task | ✅ tasker | ✅ tasker |
| Task marked complete | ✅ both | ✅ both |
| Payment released | ✅ tasker | ✅ tasker |
| New message | ✅ recipient | If offline > 5 min |

### 21.4 Rules

| Rule | Why |
|---|---|
| All notification sending via background job queue (not inline in Route Handler) | Sending email in the request path blocks response |
| `Notification` records created synchronously; delivery is async | In-app is instant; email may take seconds |
| Unsubscribe links in all emails | CAN-SPAM / Australian Spam Act compliance |
| Never log email content to server logs | PII risk |

---

## 22. Testing Strategy

### 22.1 Philosophy: E2E Only

**OzHelper uses end-to-end tests exclusively. There are no unit tests and no integration tests.**

Rationale:
- The application is primarily data-fetching UI — unit tests on React components produce false confidence
- E2E tests validate the actual user flow through the real browser, database, and API
- AI tooling (GitHub Copilot, Cursor) can generate high-quality E2E test files from plain English descriptions — the marginal cost of test authoring is low
- For a startup-phase product, E2E coverage of critical paths catches the bugs that matter

### 22.2 Tool: Playwright

```bash
pnpm add -D @playwright/test
npx playwright install
```

```
tests/
  e2e/
    auth/
      sign-up.spec.ts
      sign-in.spec.ts
    tasks/
      post-task.spec.ts
      browse-tasks.spec.ts
      accept-offer.spec.ts
    payments/
      topup-wallet.spec.ts
      complete-task-payment.spec.ts
    messaging/
      send-message.spec.ts
```

### 22.3 Critical Flows (Must Have Coverage)

| Flow | Priority |
|---|---|
| Sign up (email + OTP) | P0 |
| Sign in and redirected to dashboard | P0 |
| Post a new task | P0 |
| Tasker submits offer | P0 |
| Poster accepts offer and funds escrow | P0 |
| Task marked complete, payment released | P0 |
| Send and receive message | P1 |
| Upload task image | P1 |
| Change app language EN ↔ ZH | P1 |

### 22.4 AI-Assisted Test Authoring

Use **GitHub Copilot** or **Cursor** to generate test files. Provide the user flow in plain English and let the AI write the Playwright selectors and assertions.

Prompt template for Copilot:
```
Write a Playwright E2E test for the following flow:
1. Navigate to /sign-up
2. Fill in email and password
3. Click "Create account"
4. Expect redirect to /onboarding
Use data-testid attributes for selectors.
```

Add `data-testid` attributes to all interactive elements that are tested:

```tsx
// ✅ Add testid to form elements
<Button data-testid="submit-task-btn" type="submit">Post Task</Button>
<Input data-testid="task-title-input" ... />
```

### 22.5 CI Integration

```yaml
# .github/workflows/e2e.yml
- name: Run Playwright tests
  run: pnpm exec playwright test
```

- Runs on every PR targeting `main` and `staging`
- Fails the PR check if any critical-flow test fails
- Upload Playwright HTML report as CI artefact on failure

### 22.6 Rules

| Rule | Why |
|---|---|
| No unit tests, no integration tests | E2E covers the user-visible contract; internals can change freely |
| No coverage thresholds | Quality over quantity — 10 reliable E2E tests beat 200 fragile unit tests |
| `data-testid` attributes for all tested elements | Selectors by role/text break with i18n or copy changes |
| Test against a real (seeded) test DB, not mocks | Mocks don't catch DB schema mismatches |
| Playwright tests in `tests/e2e/`, never in `__tests__/` | Separate from other tooling directories |

---

## 23. Observability & Monitoring

### 23.1 Error Tracking — Sentry

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```
SENTRY_DSN=https://...@sentry.io/...   # server + client
SENTRY_ORG=oz-helper
SENTRY_PROJECT=oz-helper-web
```

Sentry captures uncaught errors in both Server Components and Client Components. All errors surfaced in `app/error.tsx` should also call `Sentry.captureException`.

### 23.2 Performance Monitoring

| Tool | What it measures |
|---|---|
| **Vercel Analytics** | Core Web Vitals (LCP, CLS, INP) per route, real user data |
| **Vercel Speed Insights** | Bundle size regressions on each deploy |
| Sentry Performance | Slow API routes, DB query durations |

Enable in `next.config.mjs`:
```js
import { withSentryConfig } from "@sentry/nextjs";
export default withSentryConfig(nextConfig, sentryWebpackOptions);
```

### 23.3 Structured Logging

Use **pino** for server-side structured logs. Never `console.log` in production.

```bash
pnpm add pino pino-pretty
```

```typescript
// lib/logger.ts  (server-only)
import pino from "pino";
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: ["req.headers.authorization", "body.password"],
});
```

Log at Route Handler boundaries (request in / response out) and in `lib/db/` for slow queries.

### 23.4 Uptime Monitoring

- **Better Uptime** or **Checkly** pings `/api/health` every 60 seconds
- Create `app/api/health/route.ts` that returns `{ status: "ok", db: "ok" }` after a `prisma.$queryRaw\`SELECT 1\``
- Alert channels: Slack `#alerts` + email on-call within 60 seconds of downtime

### 23.5 Rules

| Rule | Why |
|---|---|
| Never log PII (email, phone, bank details) | Privacy Act 1988 compliance |
| `logger.error` for 5xx, `logger.warn` for 4xx | Correct severity prevents alert fatigue |
| Sentry `beforeSend` filter strips user passwords | Security |
| All Sentry + analytics calls wrapped in `if (process.env.NODE_ENV === "production")` | Don't pollute dashboards with dev noise |

---

## 24. CI/CD & Deployment

### 24.1 Environments

| Environment | Branch | URL | Database |
|---|---|---|---|
| Local dev | any | `localhost:3000` | Local Postgres or `DATABASE_URL` .env |
| Preview | feature branches | `oz-helper-{branch}.vercel.app` | Staging DB |
| Staging | `staging` | `staging.ozhelper.com.au` | Staging DB (prod-mirror) |
| Production | `main` | `ozhelper.com.au` | Production DB |

### 24.2 Vercel Deployment

- Vercel auto-deploys on every push
- Preview URLs generated for every PR — paste into PR description for review
- **Instant Rollback** available from the Vercel dashboard (revert to previous build in ~10s)

### 24.3 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main, staging]
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm type-check          # tsc --noEmit
      - run: pnpm lint                # eslint
      - run: pnpm audit --audit-level=high  # dependency security scan
  e2e:
    needs: checks
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright install --with-deps
      - run: pnpm exec playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### 24.4 Database Migration in Deploy Pipeline

Migrations run **before** the new app version boots, to prevent schema mismatch errors:

```bash
# Vercel Build Command (in Project Settings):
prisma migrate deploy && next build
```

Never run `prisma migrate dev` in production — it's for local dev only.

### 24.5 Branch Strategy

```
main          ← production; protected, requires PR + passing CI
  └── staging ← pre-production integration
        └── feature/xyz  ← short-lived feature branches (delete after merge)
```

- No long-lived feature branches
- Squash-merge to keep history clean
- Semantic commit messages: `feat:`, `fix:`, `chore:`, `docs:`

---

## 25. Security

### 25.1 Input Validation & Sanitisation

- All Route Handler inputs validated with **Zod** before touching the DB
- For any user-supplied HTML displayed in the UI: sanitise with **DOMPurify** (client-side) or **sanitize-html** (server-side)
- Never use `dangerouslySetInnerHTML` without sanitising first

```typescript
// All Route Handler bodies validated with Zod:
const body = await req.json();
const result = CreateTaskSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
}
```

### 25.2 Rate Limiting

Apply rate limiting to all `app/api/*` routes using **Upstash Rate Limit** (Redis-backed, works on Vercel Edge).

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, "1 m"),  // 60 req/min per IP
});
```

Stricter limits on auth endpoints (`/api/auth/*`): 10 req/min to block credential stuffing.

### 25.3 Authentication & CSRF

- CSRF: handled by Next.js same-origin cookie policy — `cookie: { sameSite: "lax" }` is sufficient for browser clients
- Token stored as `HttpOnly; Secure; SameSite=Lax` cookie — inaccessible to JavaScript
- All protected routes guarded in `middleware.ts` — never rely on client-side redirects for security

### 25.4 Sensitive Data

| Data type | Storage rule |
|---|---|
| Passwords | Never stored — use magic link / OAuth / Clerk |
| Card numbers | Never stored — Stripe tokenises all payment data |
| Bank account numbers | Never stored — Stripe Connect handles payouts |
| Profile photos | Stored in R2/S3 with non-guessable UUIDs in path |
| API keys | `.env` only, never committed, never logged |

### 25.5 Australian Privacy Act 1988 Compliance

- Privacy Policy page at `/privacy` explaining data collected and why
- Data Retention Policy: user data deleted within 30 days of account deletion request
- Right to Access: users can request an export of their data via `/settings/data-export`
- No data sold to third parties

### 25.6 Dependency Security

```bash
# Run in CI on every PR:
pnpm audit --audit-level=high
```

- High and Critical vulnerabilities block the PR merge
- Moderate vulnerabilities generate a warning but don't block

---

## 26. SEO Strategy

OzHelper's public pages (task listings, task detail, how-it-works, about) are critical for organic growth. All public-facing pages must implement the full SEO stack.

### 26.1 Metadata

Use `generateMetadata()` in every public `page.tsx`:

```typescript
// app/(marketing)/about/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About OzHelper – Australia's Local Task Marketplace",
    description: "...",
    alternates: {
      canonical: "https://ozhelper.com.au/about",
      languages: {
        "en-AU": "https://ozhelper.com.au/about",
        "zh-CN": "https://ozhelper.com.au/zh/about",
      },
    },
    openGraph: {
      title: "...",
      images: [{ url: "https://ozhelper.com.au/og/about.png" }],
    },
  };
}
```

### 26.2 Dynamic OG Images

Use `@vercel/og` to generate task-specific OG images at build or request time:

```
app/api/og/route.tsx   ← generates OG image with task title + price dynamically
```

### 26.3 Sitemap

Use **next-sitemap** to auto-generate `sitemap.xml` and `robots.txt` after build:

```bash
pnpm add -D next-sitemap
```

```js
// next-sitemap.config.js
module.exports = {
  siteUrl: "https://ozhelper.com.au",
  generateRobotsTxt: true,
  exclude: ["/dashboard/*", "/api/*"],
};
```

Add to `package.json`:
```json
"postbuild": "next-sitemap"
```

### 26.4 Structured Data (JSON-LD)

Add `JobPosting` or `Service` schema on task detail pages:

```tsx
// components/tasks/task-json-ld.tsx
export function TaskJsonLd({ task }: { task: Task }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": task.title,
        "description": task.description,
        "offers": { "@type": "Offer", "price": task.price / 100, "priceCurrency": "AUD" },
      })}}
    />
  );
}
```

### 26.5 Rules

| Rule | Why |
|---|---|
| Every public page has `generateMetadata()` | Default Next.js title is useless for SEO |
| `hreflang` tags on all bilingual pages | Google needs to know EN and ZH pages are equivalents |
| Canonical URL on every page | Prevents duplicate-content penalty for `/tasks?page=1` vs `/tasks` |
| Task detail pages server-rendered (RSC) | Googlebot must see content without JavaScript |
| No `noindex` on production task pages | Don't accidentally block Google from indexing content |

---

## 27. Growth Architecture (10k–200k Users)

The following patterns are **not needed at launch** but should be adopted at the thresholds listed. Document them now to avoid architectural dead ends.

### 27.1 Caching — Redis (Upstash)

**Adopt at: >1k concurrent users or >100ms average API response**

- Hot task feed: cache `queryTasks({ page: 1 })` in Redis with 30-second TTL
- Session tokens: move from DB lookup to Redis for sub-millisecond auth
- Rate limit store: Upstash Rate Limit already uses Redis (Section 25.2)
- PgBouncer connection pooling: add at 10k+ users to prevent Postgres connection exhaustion

```typescript
// lib/cache.ts
import { Redis } from "@upstash/redis";
export const redis = Redis.fromEnv();
```

### 27.2 Search

| Stage | Users | Solution |
|---|---|---|
| Launch | 0–10k | PostgreSQL full-text search (`to_tsvector`) |
| Growth | 10k–50k tasks | **Algolia** or **Typesense** (sync on task create/update) |
| Scale | 50k+ tasks + geo | PostGIS for suburb/postcode radius queries + Algolia for text |

Implement a `syncTaskToSearch()` function in `lib/db/tasks.ts` that updates the search index whenever a task is created or updated. This keeps both data sources in sync via one call site.

### 27.3 Background Job Queue

**Adopt at: first async operation that must not fail silently**

Use **Inngest** (serverless, works on Vercel) or **BullMQ** (requires Redis):

| Job | Trigger | Queue |
|---|---|---|
| UGC translation | task created | `translation` |
| Email notification | event emitted | `notifications` |
| Push notification | event emitted | `notifications` |
| Payout processing | task complete | `payments` |
| Content moderation | task/message created | `moderation` |

Replace `fire-and-forget` patterns with proper job queues before going to production with >100 daily active users.

### 27.4 Content Moderation

**Adopt at: public launch (before marketing)**

- Run **OpenAI Moderation API** on every task title + description at publish time
- Run on every message before delivery
- Flag results stored in `Task.moderationStatus: PENDING | APPROVED | FLAGGED`
- Flagged tasks held for admin review, not published to feed

### 27.5 Analytics

**Adopt at: >100 users**

- **PostHog** for product analytics: user funnels, feature flags, session replay
- Track critical funnel steps: sign-up → post task → accept offer → complete task → payout
- Self-host on Railway or managed PostHog Cloud

### 27.6 Rating System

**Adopt at: >500 completed tasks**

- Bidirectional reviews: both poster and tasker rate each other after task completion
- Star rating (1–5) + optional written review
- Average stored on `User.rating` column (recalculated on each new review)
- Anti-gaming: review window only open for 14 days post-completion; no editing after submission; flagging mechanism for abusive reviews

### 27.7 Database Scaling

| Threshold | Action |
|---|---|
| 50k users | Add read replica for `queryTasks()` and reporting queries |
| 100k users | PgBouncer connection pool in front of Postgres |
| 200k users | Evaluate shard by geography (AU East / AU West) or move to Neon/PlanetScale for native branching |

### 27.8 Admin Panel

Build a separate internal tool or use **Retool** / **Redash** for:

- Dispute resolution (view escrow, release or refund)
- User bans and content moderation queue
- Revenue dashboard (commission earned, total task volume)
- Manual translation override

---

## Appendix: Refactoring Checklist (Current State → Target State)

Use this checklist when migrating `app/page.tsx` to the architecture above:

**Prisma & Database**
- [ ] Install Prisma: `pnpm add prisma @prisma/client` and run `npx prisma init`
- [ ] Define schema in `prisma/schema.prisma` (Task, User, etc.)
- [ ] Run first migration: `npx prisma migrate dev --name init`
- [ ] Create `lib/prisma.ts` Prisma Client singleton
- [ ] Create `lib/db/tasks.ts` with `queryTasks()`, `queryTask()`, `createTaskRecord()`

**API Route Handlers**
- [ ] Create `app/api/tasks/route.ts` (GET, POST)
- [ ] Create `app/api/tasks/[id]/route.ts` (GET)

**Types & Mocks**
- [ ] Create `types/task.ts` with proper typed interfaces
- [ ] Move mock data to `lib/mocks/tasks.ts`, convert `price` to `number`

**API Client (for Client Components)**
- [ ] Create `lib/api/tasks.ts` with `fetchTasks()` and `fetchTask()`
- [ ] Create `lib/api/client.ts` base fetch utility (`BASE_URL = "/api"`)

**TanStack Query**
- [ ] Create `lib/query-keys.ts`
- [ ] Create `lib/query-client.ts` and `providers/query-provider.tsx`
- [ ] Add `<QueryProvider>` to `app/layout.tsx`
- [ ] Install `@tanstack/react-query` and `@tanstack/react-query-devtools`
- [ ] Create `hooks/queries/use-tasks.ts`

**Components**
- [ ] Extract `TaskCard` to `components/tasks/task-card.tsx`
- [ ] Create `components/tasks/task-card-skeleton.tsx`
- [ ] Create `components/tasks/task-feed-error.tsx`
- [ ] Create `components/tasks/task-feed.tsx` (smart container)
- [ ] Create `components/tasks/task-filters.tsx` (category pills + state tabs)
- [ ] Slim down `app/page.tsx` to RSC orchestration with `HydrationBoundary`

**Loading / Error / Auth**
- [ ] Add `app/(dashboard)/tasks/loading.tsx`
- [ ] Add `app/(dashboard)/tasks/error.tsx`
- [ ] Add `middleware.ts` for auth protection

**Internationalisation (i18n)**
- [ ] Install `next-intl`: `pnpm add next-intl`
- [ ] Wrap all routes under `app/[locale]/`
- [ ] Create `messages/en/` and `messages/zh/` directories
- [ ] Create `common.json`, `tasks.json`, `profile.json`, `wallet.json`, `auth.json`, `dashboard.json` for each locale
- [ ] Configure `next-intl` middleware in `middleware.ts` for locale detection and redirect
- [ ] Configure `i18n.ts` (next-intl routing config)
- [ ] Replace all hardcoded UI strings with `t()` calls

**UGC Content Translation**
- [ ] Add `GOOGLE_TRANSLATE_API_KEY` (or DeepL) to `.env` (server-only, no `NEXT_PUBLIC_`)
- [ ] Add `titleEn`, `descriptionEn`, `titleZh`, `descriptionZh`, `originalLocale` columns to Prisma `Task` model
- [ ] Run migration: `npx prisma migrate dev --name add-translation-fields`
- [ ] Create `lib/db/translation.ts` with `translateTask()` and `translateText()`
- [ ] Update `createTaskRecord()` to trigger async translation job after saving
- [ ] Update `queryTask()` and `queryTasks()` to accept `locale` param and resolve correct fields
- [ ] Add `translationPending` indicator to `TaskCard` UI

**Payment System**
- [ ] Install Stripe: `pnpm add stripe @stripe/stripe-js`
- [ ] Add `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` to `.env`
- [ ] Add `Transaction` and wallet fields to Prisma schema; run migration
- [ ] Create `app/api/payments/create-payment-intent/route.ts`
- [ ] Create `app/api/payments/webhook/route.ts` with Stripe signature verification
- [ ] Wrap all balance-change Prisma operations in `prisma.$transaction()`

**File & Image Storage**
- [ ] Create R2 bucket (or S3 bucket) and set CORS policy to allow uploads from `ozhelper.com.au`
- [ ] Add `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, `STORAGE_BUCKET_NAME` to `.env`
- [ ] Create `app/api/upload/presign/route.ts` to issue signed upload URLs
- [ ] Add WebP conversion step before issuing presigned URL (Sharp or Cloudflare Images)
- [ ] Store only `publicUrl` in DB — never the signed URL

**Real-time Messaging**
- [ ] Create Pusher account, choose `ap4` (Sydney) cluster
- [ ] Add `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `NEXT_PUBLIC_PUSHER_KEY` to `.env`
- [ ] Create `Message` and `Conversation` Prisma models; run migration
- [ ] Create `app/api/messages/route.ts` (save to DB first, then push to channel)
- [ ] Create `app/api/pusher/auth/route.ts` for private channel authentication
- [ ] Build `components/messages/message-feed.tsx` (`"use client"`) subscribing to Pusher channel

**Notification System**
- [ ] Create Resend account and add `RESEND_API_KEY` to `.env`
- [ ] Create `Notification` Prisma model; run migration
- [ ] Create `lib/notifications/` with notification type definitions and send helpers
- [ ] Move all notification sending to a background job queue (not inline in Route Handler)
- [ ] Build notification bell component polling via TanStack Query

**Testing (E2E)**
- [ ] Install Playwright: `pnpm add -D @playwright/test && npx playwright install`
- [ ] Create `playwright.config.ts` targeting `localhost:3000`
- [ ] Add `data-testid` attributes to all interactive elements in forms and nav
- [ ] Write P0 E2E tests using Copilot/Cursor (sign-up, post-task, accept-offer, payment, messaging)
- [ ] Add `e2e` job to `.github/workflows/ci.yml` running on every PR to `main` and `staging`

**Observability**
- [ ] Install Sentry: `pnpm add @sentry/nextjs && npx @sentry/wizard@latest -i nextjs`
- [ ] Add `SENTRY_DSN` to `.env`
- [ ] Add `Sentry.captureException` in `app/error.tsx`
- [ ] Install pino: `pnpm add pino` and create `lib/logger.ts` (server-only)
- [ ] Create `app/api/health/route.ts` returning `{ status: "ok", db: "ok" }`
- [ ] Enable Vercel Analytics in project settings

**CI/CD**
- [ ] Create `.github/workflows/ci.yml` with `type-check`, `lint`, `pnpm audit`, and `e2e` jobs
- [ ] Set Vercel Build Command to `prisma migrate deploy && next build`
- [ ] Protect `main` branch: require passing CI + 1 reviewer approval
- [ ] Create `staging` branch and link to staging environment in Vercel

**Security**
- [ ] Install Upstash Rate Limit: `pnpm add @upstash/ratelimit @upstash/redis`
- [ ] Add rate limiting middleware in `middleware.ts` (60 req/min general, 10 req/min on `/api/auth/*`)
- [ ] Add Zod validation to every Route Handler `req.json()` parse
- [ ] Audit all cookies: ensure `HttpOnly; Secure; SameSite=Lax` on auth token
- [ ] Add `pnpm audit --audit-level=high` step to CI pipeline
- [ ] Write Privacy Policy at `/privacy` covering Privacy Act 1988 obligations

**SEO**
- [ ] Add `generateMetadata()` to every public `page.tsx` (marketing + task listing + task detail)
- [ ] Install next-sitemap: `pnpm add -D next-sitemap` and create `next-sitemap.config.js`
- [ ] Add `"postbuild": "next-sitemap"` to `package.json`
- [ ] Add `hreflang` alternates to all bilingual pages
- [ ] Create `app/api/og/route.tsx` for dynamic OG images using `@vercel/og`
- [ ] Add JSON-LD `TaskJsonLd` component to task detail page
