# Shared Module

**Purpose**: Reusable components, directives, pipes, and utilities used across features.

## Structure

- `components/` - Reusable UI components (loading-spinner, error-message)
- `directives/` - Custom directives (highlight, auto-focus)
- `pipes/` - Custom pipes (date-format-pipe.ts)
- `utils/` - Utility functions (http.util.ts, validators.util.ts, storage.util.ts)

## Rules

- Components must be standalone
- Should NOT depend on feature-specific logic
- Should be generic and reusable
- Document props and usage

## Naming Convention

- Components: `loading-spinner.ts` (NO .component suffix)
- Directives: `highlight.ts` (NO .directive suffix)
- Pipes: `date-format-pipe.ts` (WITH -pipe suffix)
- Utils: `http.util.ts` (WITH .util suffix)
