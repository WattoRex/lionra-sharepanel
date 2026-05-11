/**
 * Lìonra – SharePanel 
 * TypeScript declarations
 */

export interface SharePanelOptions {
  /**
   * CSS selector for the button(s) that open the panel.
   * @default '#btn-share'
   */
  trigger?: string;

  /**
   * Application or page name displayed in the panel header.
   * @default document.title
   */
  name?: string;

  /**
   * Shared URL.
   * @default location.href
   */
  url?: string;

  /**
   * Custom share text. Use `{name}` and `{url}` as variables.
   * @example 'Try {name} → {url}'
   * @default null
   */
  shareText?: string | null;

  /**
   * Accent color (hex, rgb, hsl…).
   * @default '#00e676'
   */
  accent?: string;

  /**
   * Text color placed on top of the accent color.
   * @default '#000'
   */
  accentText?: string;

  /**
   * Panel theme.
   * - `'auto'`  : follows `html[data-theme="dark"]` / `html[data-theme="light"]`
   * - `'dark'`  : forces dark theme
   * - `'light'` : forces light theme
   * @default 'auto'
   */
  theme?: 'dark' | 'light' | 'auto';

  /**
   * Favicon displayed in the header.
   * - SVG string : `'<svg>…</svg>'`
   * - Image URL  : `'/icons/app.png'`
   * - `null`     : initials generated automatically
   * @default null
   */
  favicon?: string | null;

  /**
   * UI language / locale.
   * - `'en'`            : English (default)
   * - `'fr'`            : French
   * - `LocaleStrings`   : fully custom object, overrides all built-in strings
   *
   * @example
   * // Built-in locale
   * locale: 'fr'
   *
   * @example
   * // Partial or full custom strings (merged over the 'en' base)
   * locale: { copyBtn: 'Copier', copiedBtn: '✓ Copié', toastCopied: '✓ Lien copié !' }
   *
   * @default 'en'
   */
  locale?: 'en' | 'fr' | LocaleStrings;

  /**
   * List of platforms to display (filtering and ordering).
   * `null` displays all platforms in the default order.
   *
   * Available platforms:
   * `'native'` · `'whatsapp'` · `'telegram'` · `'twitter'` · `'facebook'` ·
   * `'messenger'` · `'instagram'` · `'linkedin'` · `'reddit'` · `'pinterest'` ·
   * `'bluesky'` · `'mastodon'` · `'discord'` · `'slack'` · `'teams'` ·
   * `'snapchat'` · `'mail'` · `'sms'` · `'copy'`
   *
   * @default null
   */
  platforms?: Platform[] | null;

  /**
   * Panel layout.
   * - `'sheet'`  : iOS drawer – icons in a horizontal scrollable row
   * - `'popup'`  : centered modal – 3-column grid
   * - `'list'`   : vertically scrollable drawer with sub-labels and chevrons
   * - `'grid'`   : Android drawer – vertically scrollable 4-column grid
   * @default 'sheet'
   */
  layout?: Layout;
}

/**
 * Per-platform label and sublabel strings used in the UI.
 * All fields are optional — missing ones fall back to the built-in locale.
 */
export interface LocalePlatformEntry {
  /** Short name shown below the icon (e.g. `'Share'`, `'Partager'`). */
  label?: string;
  /** Longer description shown in list layout (e.g. `'Send via WhatsApp'`). */
  sublabel?: string;
}

/**
 * Full set of translatable strings for the SharePanel UI.
 * Pass a partial object — only the provided keys will override the built-in locale.
 */
export interface LocaleStrings {
  // ── Platform labels (all optional) ──────────────────────────
  native?: LocalePlatformEntry;
  whatsapp?: LocalePlatformEntry;
  telegram?: LocalePlatformEntry;
  twitter?: LocalePlatformEntry;
  facebook?: LocalePlatformEntry;
  messenger?: LocalePlatformEntry;
  instagram?: LocalePlatformEntry;
  linkedin?: LocalePlatformEntry;
  reddit?: LocalePlatformEntry;
  pinterest?: LocalePlatformEntry;
  bluesky?: LocalePlatformEntry;
  mastodon?: LocalePlatformEntry;
  discord?: LocalePlatformEntry;
  slack?: LocalePlatformEntry;
  teams?: LocalePlatformEntry;
  snapchat?: LocalePlatformEntry;
  mail?: LocalePlatformEntry;
  sms?: LocalePlatformEntry;
  copy?: LocalePlatformEntry;

  // ── UI strings ───────────────────────────────────────────────
  /** Label of the "Copy" button (idle state). @default 'Copy' */
  copyBtn?: string;
  /** Label of the "Copy" button after a successful copy. @default '✓ Copied' */
  copiedBtn?: string;
  /** Label of the "Copy" button in list layout after copy. @default '✓ Copied!' */
  copiedBtnList?: string;
  /** Toast message shown after copying. @default '✓ Link copied to clipboard' */
  toastCopied?: string;
  /** `aria-label` of the close button. @default 'Close' */
  ariaClose?: string;
  /** `aria-label` of the share-link input. @default 'Link to share' */
  ariaShareLink?: string;
}

/** Identifiers for supported platforms */
export type Platform =
  | 'native'
  | 'whatsapp'
  | 'telegram'
  | 'twitter'
  | 'facebook'
  | 'messenger'
  | 'instagram'
  | 'linkedin'
  | 'reddit'
  | 'pinterest'
  | 'bluesky'
  | 'mastodon'
  | 'discord'
  | 'slack'
  | 'teams'
  | 'snapchat'
  | 'mail'
  | 'sms'
  | 'copy';

/** Available layouts */
export type Layout = 'sheet' | 'popup' | 'list' | 'grid';

/** Public interface of SharePanel */
export interface SharePanelInstance {
  /**
   * Initializes the panel and attaches event handlers to the trigger buttons.
   * Must be called after the DOM is ready.
   */
  init(options?: SharePanelOptions): void;

  /** Opens the share panel programmatically. */
  open(): void;

  /** Closes the share panel programmatically. */
  close(): void;

  /**
   * Copies the URL to the clipboard and displays visual feedback.
   * Uses the Clipboard API if available, otherwise falls back to `execCommand('copy')`.
   */
  copy(): Promise<void>;
}

/** Named export — `import { SharePanel } from 'lionra-sharepanel'` */
export declare const SharePanel: SharePanelInstance;

/** Default export — `import SharePanel from 'lionra-sharepanel'` */
export default SharePanel;