# TODO ✅

## ✅ Step 1: Add `getCategoryEmoji` function to `lib/constants.ts`

- Added comprehensive `CATEGORY_EMOJI` map covering all 170+ category slugs
- Exported `getCategoryEmoji(slug)` function

## ✅ Step 2: Update `app/page.tsx` to display emojis in category cards

- Imported `getCategoryEmoji` from constants
- Replaced `<Icon name={cat.icon} size={22} />` with `{getCategoryEmoji(cat.slug)}`
