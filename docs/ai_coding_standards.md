# AI Coding Standards & Guidelines

This document serves as the primary source of truth for AI agents working on this project. All code generation and modifications must adhere to these guidelines.

## 1. UI & Styling Framework
**Primary Library: daisyUI (v5+)**
- **Do NOT** build custom components from scratch if a daisyUI equivalent exists.
- **Do NOT** write custom CSS or complex arbitrary Tailwind values (e.g., `h-[500px]`, `bg-[#F3F4F6]`) when standard utility classes or daisyUI component classes can achieve the result.
- **Always** check the daisyUI documentation for component structures (Modals, Dropdowns, Cards, Buttons, Inputs, etc.).

### Styling Rules
- **Use daisyUI Semantic Classes**: Use `btn`, `btn-primary`, `card`, `input`, `badge` etc.
- **Use Theme Colors**: Use `primary`, `secondary`, `accent`, `base-100`, `base-200`, `base-300` instead of raw colors like `blue-500` or `gray-100` to support theming and dark mode automatically.
  - *Good*: `bg-base-200`, `text-primary`
  - *Bad*: `bg-gray-100`, `text-blue-600`
- **Spacing**: Use standard Tailwind spacing (e.g., `p-4`, `m-2`, `gap-4`).

## 2. Component Architecture
- **Reuse**: Extract reusable logic into generic components (e.g., `<AssigneeSelect />` instead of inline dropdowns).
- **Icons**: Use **`lucide-react`** for all icons.
- **Structure**: Keep components small and focused.

## 3. State Management
- **Redux Toolkit**: Use RDK Query for all data fetching.
- **Avoid Local Fetching**: Do not use `fetch` or `axios` in components; create an API slice endpoint.

## 4. Best Practices
- **Accessibility**: Ensure interactive elements are semantic (`<button>` vs `<div>`) and keyboard navigable.
- **Typescript**: Maintain strict typing; avoid `any` wherever possible.
- **File Structure**:
  - `src/components/ui`: Generic, reusable UI components.
  - `src/components/features`: Business-logic heavy components.
  - `src/lib/redux`: State management.

## 5. Memory Updates (for the AI)
- **Refactoring**: When modifying existing code, safeguard against regressions but aggressively refactor "custom" CSS mess into clean daisyUI components.
- **Consistency**: Match the existing design language (Rounded corners, spacing, fonts) but implement it using the framework tools.
