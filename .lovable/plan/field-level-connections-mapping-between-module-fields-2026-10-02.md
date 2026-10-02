# Field-level Connections (mapping between module fields)

## Goal
Inside **Parameters → Connections**, every module shows its full content: its sections (e.g. COMMERCIAL → INVENTAIRE, CATALOG) and each section's fields (Désignation, Quantité, Famille, Prix). You link fields by hand, for example:

```text
CRM.PRODUITS.PRODUIT   <-  COMMERCIAL.CATALOG.DESIGNATION
CRM.PRODUITS.QUANTITE  <-  COMMERCIAL.INVENTAIRE.QUANTITE   when CRM.PRODUITS.PRODUIT = COMMERCIAL.INVENTAIRE.DESIGNATION
CRM.PRODUITS.PRIX      <-  COMMERCIAL.CATALOG.PRIX          when CRM.PRODUITS.PRODUIT = COMMERCIAL.CATALOG.DESIGNATION
```

Only the fields you fill in become links; empty fields stay unlinked. Each link is drawn as an arrow from the source field to the target field.

## What you will see
1. **Module catalogue panel** — a tree per module: Module > Section > Fields (with type).
2. **Mapping editor** — choose a target section (e.g. CRM.PRODUITS). Each of its fields gets a row:
   - "Source" picker: any field of any other module (Module.Section.Field), or empty.
   - Optional "Condition": target field = source-section field (the matching key).
3. **Arrow diagram** — two columns (sources left, targets right) with arrows between linked fields; conditions shown as a small label on the arrow.
4. **Live preview** — for a mapping, show the first rows the link would produce (e.g. product + quantity + price), so you can check it works.
5. Mappings list with delete / enable-disable.

## Module content declaration
- Each module declares its sections and fields in the registry (sections = its data tables, fields = columns with a readable label).
- External modules you add later declare theirs the same way, so they appear automatically.
- I will add COMMERCIAL (sections CATALOG and INVENTAIRE) and a CRM section PRODUITS so your example works end-to-end.

## Technical details
- New table `module_field_mappings`: connection_id, target (module, table, column), source (module, table, column), condition (target column, source column), enabled. GRANTs + RLS restricted to `connections.create` / super-admin.
- Schema metadata: a `module_schema` entry per module in `modules.configuration` (sections/fields JSON), seeded for cms, crm, finance, message, commercial.
- New tables `com_catalog` (designation, prix, famille), `com_inventory` (designation, quantite, famille), `crm_products` (produit, quantite, prix) with grants/RLS like other modules.
- Resolver `resolveMapping()` (client, RLS-respecting): reads source tables and joins on the condition to fill target fields — used for preview and by the CRM PRODUITS tab ("Sync from mapping").
- Arrows rendered with SVG between measured field positions.
- A mapping auto-creates/uses the module→module row in `module_connections` with `data.read`.
