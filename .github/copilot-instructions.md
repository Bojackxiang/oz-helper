# OzHelper — Copilot Instructions

> Full architecture rationale and examples: `docs/architecture.md`

---

## Stack

Next.js 16 (App Router) · TypeScript · Prisma ORM · TanStack Query · shadcn/ui · Tailwind CSS · React Hook Form · Zod

---

## Server vs Client Components

**Default to Server Components. Add `"use client"` only when forced.**

A component MUST be `"use client"` if it uses any of:

- Event handlers (`onClick`, `onChange`, `onSubmit`)
- React state or effects (`useState`, `useReducer`, `useEffect`, `useRef`)
- TanStack Query hooks (`useQuery`, `useMutation`, `useQueryClient`)
- Next.js client hooks (`useRouter`, `useSearchParams`, `usePathname`)
- Third-party libraries not adapted for RSC

Keep Server Components for: data-display pages, static layout, Prisma access, redirects, anything with no browser interaction.

**Push `"use client"` to leaf nodes — never add it to a page or layout just because one child needs it.**

```
// ❌ Wrong — whole page becomes client because of one hook
"use client";
export default function TasksPage() { ... }

// ✅ Correct — page is RSC, only interactive slice is client
export default async function TasksPage() {
  const tasks = await queryTasks({});  // Prisma direct
  return <TaskFeed />;                 // TaskFeed has "use client" inside
}
```

---

## Data Access Rules

Two paths, same Prisma layer underneath:

```
Server Component (RSC)
  page.tsx  →  lib/db/tasks.ts  →  lib/prisma.ts  →  Database

Client Component
  useTasks()  →  lib/api/tasks.ts  →  fetch("/api/tasks")
                                           ↓
                              app/api/tasks/route.ts
                                           ↓
                              lib/db/tasks.ts  →  Database
```

| Rule                                               |                                                 |
| -------------------------------------------------- | ----------------------------------------------- |
| `lib/db/` and `lib/prisma.ts` are **server-only**  | Never import in Client Components or `lib/api/` |
| RSC `page.tsx` calls `lib/db/` directly            | No HTTP overhead                                |
| Client Components call `lib/api/` → Route Handlers | Prisma cannot run in the browser                |
| Route Handlers live in `app/api/`                  | They call `lib/db/`, never `lib/api/`           |
| Raw Prisma calls never go in `page.tsx`            | Extract to `lib/db/{resource}.ts`               |

---

## File Structure

```
prisma/schema.prisma
lib/prisma.ts              ← Prisma singleton (server-only)
lib/db/{resource}.ts       ← DB query functions (server-only)
app/api/{resource}/route.ts ← Route Handlers (HTTP interface for clients)
lib/api/client.ts          ← Base fetch client, BASE_URL = "/api"
lib/api/{resource}.ts      ← Client-side fetch functions
hooks/queries/use-{resource}.ts   ← TanStack Query read hooks
hooks/mutations/use-{resource}.ts ← TanStack Query write hooks
types/{resource}.ts        ← TypeScript interfaces
lib/mocks/{resource}.ts    ← Dev mock data (USE_MOCKS=true)
lib/query-keys.ts          ← Centralised query key factory
```

---

## TanStack Query

- All query keys go through `queryKeys` factory in `lib/query-keys.ts` — never hardcode arrays
- `placeholderData: keepPreviousData` on all paginated / filtered lists
- `onError` in every mutation must show a `toast.error()`
- Never call `queryClient.setQueryData` for optimistic updates without full understanding
- For RSC prefetch + hydration, call `lib/db/` directly (not `lib/api/`):

```tsx
// app/page.tsx
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: queryKeys.tasks.list({ page: 1 }),
  queryFn: () => queryTasks({ page: 1, pageSize: 9 }), // ← Prisma, not fetch()
});
return (
  <HydrationBoundary state={dehydrate(queryClient)}>...</HydrationBoundary>
);
```

---

## Component Rules

- **Named exports** everywhere — default export only in `page.tsx` and `layout.tsx`
- Prop interfaces defined in the same file, named `{ComponentName}Props`
- No logic in JSX beyond ternaries and `&&` — extract to a variable above `return`
- `components/ui/` — shadcn primitives, never modify
- `components/{feature}/` — domain components
- No barrel `index.ts` files in `components/`

---

## Forms

- All forms use **React Hook Form** + **Zod** (`zodResolver`)
- Schema defined in a co-located `schema.ts` file, type inferred with `z.infer<>`
- Form components are always `"use client"` and connect to a mutation hook

---

## Naming & Code Style

- Files: `kebab-case.tsx` / `.ts`
- Hooks: `use-kebab-case.ts`
- Constants: `SCREAMING_SNAKE_CASE`
- No `any` — use `unknown` + type narrowing
- No hardcoded API URLs outside `lib/api/client.ts`
- No `console.log` in committed code
- `price` is always a `number` in types/data — format to `$45` only in UI via `formatPrice()`

---

## Mocks & Environment

```
USE_MOCKS=true            ← server-only, no NEXT_PUBLIC_ prefix
DATABASE_URL=postgresql://...
```

Mock switching lives in `lib/db/` — the flag never reaches the client bundle.

---

## Auth

- Protected routes guarded in `middleware.ts`
- Token stored as a cookie (`oz_access_token`)
- 401 in `lib/api/client.ts` clears token and redirects to `/sign-in?reason=session_expired`
