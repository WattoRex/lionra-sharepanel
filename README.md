# Lìonra · SharePanel

**A zero-dependency, plug-and-play JavaScript library for adding a native-feel share panel to any web page.**  
One file. No build step. 19 platforms. 4 layouts. Compatible with vanilla JS, React, Vue, Angular, Next.js, Nuxt, CommonJS, ESM, and AMD.

---

## ✨ Features

- **Zero dependencies** : pure vanilla JS, ~66 KB unminified (~15 KB gzip)
- **Universal UMD format** : `<script>`, `require()`, ESM default/named `import`, AMD/RequireJS
- **19 platforms** : WhatsApp, Telegram, X/Twitter, Facebook, Messenger, Instagram, LinkedIn, Reddit, Pinterest, Bluesky, Mastodon, Discord, Slack, Teams, Snapchat, Email, SMS, Native Share API, Copy link
- **4 layouts** : `sheet` (iOS-style), `popup` (centered modal), `list` (vertical drawer), `grid` (Android-style)
- **Mobile deep links** : opens installed apps directly; falls back to web automatically after 1.5 s if the app isn't installed
- **Scroll hints** : animated bouncing arrow + fade gradient on `sheet` (→), `grid` (↓) and `list` (↓); disappear when the end is reached
- **Native Share API** : graceful fallback if unavailable
- **Dark / Light / Auto theme** : follows `html[data-theme]`
- **i18n / localization** : built-in `en` and `fr` locales; fully customizable strings
- **Fully customizable** : accent color, favicon, share text, platform order
- **TypeScript types** : `share.d.ts` included

---

## 🚀 Quick Start

```html
<button id="btn-share">Share</button>

<script src="share.js"></script>
<script>
  SharePanel.init({
    trigger: "#btn-share",
    name: "My App",
    accent: "#00e676",
  });
</script>
```

That's it.

---

## ⚙️ Options

| Option       | Default          | Description                                                        |
| ------------ | ---------------- | ------------------------------------------------------------------ |
| `trigger`    | `'#btn-share'`   | CSS selector of the button(s) that open the panel                  |
| `name`       | `document.title` | App/page name displayed in the panel header                        |
| `url`        | `location.href`  | URL to share                                                       |
| `shareText`  | `null`           | Custom share text. Use `{name}` and `{url}` as placeholders        |
| `accent`     | `'#00e676'`      | Accent color (hex, rgb…)                                           |
| `accentText` | `'#000'`         | Text color on top of the accent                                    |
| `theme`      | `'auto'`         | `'dark'` · `'light'` · `'auto'` (follows `html[data-theme]`)       |
| `favicon`    | `null`           | SVG string or image URL. `null` = auto-generated initials          |
| `locale`     | `'en'`           | UI language: `'en'`, `'fr'`, or a custom `LocaleStrings` object    |
| `platforms`  | `null`           | Array to filter / reorder platforms. `null` = all in default order |
| `layout`     | `'sheet'`        | `'sheet'` · `'popup'` · `'list'` · `'grid'`                        |

---

## 🌍 Localization (`locale`)

SharePanel ships with built-in English (`'en'`) and French (`'fr'`) translations. You can also supply a fully custom strings object.

### Built-in locales

```js
// English (default)
SharePanel.init({ trigger: "#btn-share", name: "My App" });

// French
SharePanel.init({ trigger: "#btn-share", name: "Mon App", locale: "fr" });
```

### Partial override

Pass a `LocaleStrings` object to override only the strings you need, all other strings fall back to the `'en'` base:

```js
SharePanel.init({
  trigger: "#btn-share",
  name: "My App",
  locale: {
    copyBtn: "Copy link",
    copiedBtn: "✓ Done",
    toastCopied: "✓ Copied to clipboard!",
  },
});
```

### Full custom locale

Supply every translatable string to completely replace the built-in locale:

```js
SharePanel.init({
  trigger: "#btn-share",
  name: "My App",
  locale: {
    // Platform labels and sub-labels (shown in list layout)
    whatsapp: { label: "WhatsApp", sublabel: "Send via WhatsApp" },
    telegram: { label: "Telegram", sublabel: "Send via Telegram" },
    twitter: { label: "X", sublabel: "Post on X" },
    facebook: { label: "Facebook", sublabel: "Share on Facebook" },
    messenger: { label: "Messenger", sublabel: "Send in Messenger" },
    instagram: { label: "Instagram", sublabel: "Open Instagram" },
    linkedin: { label: "LinkedIn", sublabel: "Share on LinkedIn" },
    reddit: { label: "Reddit", sublabel: "Post on Reddit" },
    pinterest: { label: "Pinterest", sublabel: "Pin it" },
    bluesky: { label: "Bluesky", sublabel: "Post on Bluesky" },
    mastodon: { label: "Mastodon", sublabel: "Toot on Mastodon" },
    discord: { label: "Discord", sublabel: "Share in Discord" },
    slack: { label: "Slack", sublabel: "Share in Slack" },
    teams: { label: "Teams", sublabel: "Share in Teams" },
    snapchat: { label: "Snapchat", sublabel: "Send a Snap" },
    mail: { label: "Email", sublabel: "Send an email" },
    sms: { label: "SMS", sublabel: "Send a text" },
    native: { label: "Share", sublabel: "System share sheet" },
    copy: { label: "Copy", sublabel: "Copy link" },

    // UI strings
    copyBtn: "Copy",
    copiedBtn: "✓ Copied",
    copiedBtnList: "✓ Copied!",
    toastCopied: "✓ Link copied to clipboard",
    ariaClose: "Close",
    ariaShareLink: "Link to share",
  },
});
```

### `LocaleStrings` reference

| Key             | Type                  | Default (en)                   | Description                                   |
| --------------- | --------------------- | ------------------------------ | --------------------------------------------- |
| `<platform>`    | `LocalePlatformEntry` | _(built-in)_                   | Per-platform `label` and `sublabel` strings   |
| `copyBtn`       | `string`              | `'Copy'`                       | "Copy" button label (idle)                    |
| `copiedBtn`     | `string`              | `'✓ Copied'`                   | "Copy" button label after a successful copy   |
| `copiedBtnList` | `string`              | `'✓ Copied!'`                  | "Copy" button label after copy in list layout |
| `toastCopied`   | `string`              | `'✓ Link copied to clipboard'` | Toast message shown after copying             |
| `ariaClose`     | `string`              | `'Close'`                      | `aria-label` of the close button              |
| `ariaShareLink` | `string`              | `'Link to share'`              | `aria-label` of the share-link input          |

Each `LocalePlatformEntry` accepts:

| Key        | Type     | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `label`    | `string` | Short name displayed below the icon            |
| `sublabel` | `string` | Longer description shown in `list` layout only |

---

## 🎨 Layouts

| Value   | Description                                                             |
| ------- | ----------------------------------------------------------------------- |
| `sheet` | iOS-style bottom drawer : icons in a horizontally scrollable row        |
| `popup` | Centered modal : 3-column icon grid                                     |
| `list`  | Bottom drawer : vertical scrollable list with sub-labels and chevrons   |
| `grid`  | Android-style bottom drawer : 4-column icon grid, vertically scrollable |

> **Scroll hints**, on `sheet`, `grid`, and `list`, a bouncing arrow + fade gradient indicates more content is available to scroll. Both disappear automatically once the end is reached.

---

## 🌐 Supported Platforms

| Key         | Platform         | Mobile deep link                                          |
| ----------- | ---------------- | --------------------------------------------------------- |
| `native`    | Native Share API | ✅ System sheet                                           |
| `whatsapp`  | WhatsApp         | ✅ `whatsapp://`                                          |
| `telegram`  | Telegram         | ✅ `tg://`                                                |
| `twitter`   | X / Twitter      | ✅ `twitter://`                                           |
| `facebook`  | Facebook         | ✅ `fb://`                                                |
| `messenger` | Messenger        | ✅ `fb-messenger://`                                      |
| `instagram` | Instagram        | ✅ `instagram://` (opens app; URL pre-fill not supported) |
| `linkedin`  | LinkedIn         | web only                                                  |
| `reddit`    | Reddit           | web only                                                  |
| `pinterest` | Pinterest        | ✅ `pinterest://`                                         |
| `bluesky`   | Bluesky          | web only                                                  |
| `mastodon`  | Mastodon         | web only (mastodon.social)                                |
| `discord`   | Discord          | ✅ `discord://` (opens app; no pre-fill)                  |
| `slack`     | Slack            | ✅ `slack://` (opens app; no pre-fill)                    |
| `teams`     | Microsoft Teams  | ✅ `msteams://`                                           |
| `snapchat`  | Snapchat         | ✅ `snapchat://`                                          |
| `mail`      | Email            | ✅ `mailto:`                                              |
| `sms`       | SMS              | ✅ `sms:`                                                 |
| `copy`      | Copy link        | ✅ Clipboard API                                          |

> On mobile, SharePanel tries the native app scheme first. If the app is not installed, it automatically falls back to the web URL after 1.5 s.

---

## 📐 Examples

**Minimal messaging apps only:**

```js
SharePanel.init({
  trigger: "#btn-share",
  name: "My App",
  platforms: ["native", "whatsapp", "telegram", "messenger", "copy"],
});
```

**Light popup with custom share text:**

```js
SharePanel.init({
  trigger: "#btn-share",
  name: "My App",
  shareText: "Check out {name} → {url}",
  accent: "#6264a7",
  accentText: "#fff",
  theme: "light",
  layout: "popup",
});
```

**Android-style grid with custom favicon:**

```js
SharePanel.init({
  trigger: "#btn-share",
  name: "My App",
  favicon: "/icons/app-icon.png",
  layout: "grid",
  accent: "#1877f2",
});
```

**French locale:**

```js
SharePanel.init({
  trigger: "#btn-share",
  name: "Mon App",
  locale: "fr",
});
```

**Custom locale strings (partial override):**

```js
SharePanel.init({
  trigger: "#btn-share",
  name: "My App",
  locale: {
    copyBtn: "Copy link",
    toastCopied: "✓ Link copied!",
  },
});
```

**Programmatic control:**

```js
SharePanel.open();
SharePanel.close();
SharePanel.copy(); // copies URL to clipboard
```

---

## 📦 Installation

### Option 1 : Script tag (no tooling required)

```
my-project/
├── index.html
├── share.js
└── share.d.ts
```

```html
<script src="share.js"></script>
<script>
  SharePanel.init({ trigger: "#btn-share", name: "My App" });
</script>
```

### Option 2 : npm / yarn

```bash
npm install lionra-sharepanel
# or
yarn add lionra-sharepanel
```

### Option 3 : CDN (jsDelivr / unpkg)

```html
<script src="https://cdn.jsdelivr.net/npm/lionra-sharepanel/share.js"></script>
<!-- or -->
<script src="https://unpkg.com/lionra-sharepanel/share.js"></script>
```

---

## 🔌 Integration

### Vanilla HTML

```html
<script src="share.js"></script>
<script>
  SharePanel.init({ trigger: "#btn-share", name: "My App" });
</script>
```

### ESM (Vite, Rollup, Webpack 5+)

[Vite Live Demo :](https://stackblitz.com/edit/vite-ziwh6tjt?file=package.json,main.js)

```js
import SharePanel from "lionra-sharepanel";
// or named import
import { SharePanel } from "lionra-sharepanel";

SharePanel.init({ trigger: "#btn-share", name: "My App" });
```

### CommonJS (Node.js, Webpack legacy, Browserify)

```js
const SharePanel = require("lionra-sharepanel");

SharePanel.init({ trigger: "#btn-share", name: "My App" });
```

### AMD / RequireJS

```js
define(["SharePanel"], function (SharePanel) {
  SharePanel.init({ trigger: "#btn-share", name: "My App" });
});
```

### React / Next.js

[React / Next Live Demo :](https://stackblitz.com/edit/react-t4j2nwf9?file=src%2FApp.js)

```jsx
import { useEffect } from "react";
import SharePanel from "lionra-sharepanel";

export default function ShareButton() {
  useEffect(() => {
    SharePanel.init({ trigger: "#btn-share", name: "My App" });
  }, []);

  return <button id="btn-share">Share</button>;
}
```

> SharePanel manipulates the DOM directly, always call `init()` inside `useEffect` (React) or `onMounted` (Vue) to ensure the DOM is ready.

### Vue 3 / Nuxt

[Vue Live Demo :](https://stackblitz.com/edit/vue-zsha1jgo?file=src%2FApp.vue)

```vue
<script>
import SharePanel from "lionra-sharepanel";

export default {
  name: "App",

  mounted() {
    SharePanel.init({
      trigger: "#btn-share",
      name: "My App",
      layout: "sheet",
      locale: "en",
    });
  },
};
</script>

<template>
  <button id="btn-share">Share</button>
</template>
```

**TypeScript**, `share.d.ts` is picked up automatically by Volar/Vetur. If not, add to `tsconfig.json`:

```json
{ "compilerOptions": { "types": ["lionra-sharepanel"] } }
```

### Angular

[Angular Live Demo :](https://stackblitz.com/edit/angular-wwna1yqz?file=src%2Fmain.ts)

```ts
import { Component, AfterViewInit } from "@angular/core";
import SharePanel from "lionra-sharepanel";

@Component({
  selector: "app-share",
  template: `<button id="btn-share">Share</button>`,
})
export class ShareComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    SharePanel.init({ trigger: "#btn-share", name: "My App" });
  }
}
```

**TypeScript**, if types are not resolved, add to `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "lionra-sharepanel": ["./node_modules/lionra-sharepanel/share.d.ts"]
    }
  }
}
```

---

## 📄 License

MIT © Lìonra
