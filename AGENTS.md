<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use the Ocean Deep command-center design system with JetBrains Mono headings and Work Sans body text so every application surface stays visually consistent.
- Module content (sections/fields) is declared in src/lib/modules/schema.ts; field-level links live in module_field_mappings and are resolved client-side by resolveMapping — so new modules appear in Connections by adding their schema entry.
