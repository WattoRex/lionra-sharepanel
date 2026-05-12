/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  Lìonra – SharePanel  ·  share.js  ·                      ║
 * ╠═══════════════════════════════════════════════════════════╣
 * ║  Format : Universal UMD                                   ║
 * ║  · <script src="share.js">          → window.SharePanel   ║
 * ║  · require('./share.js')            → CommonJS            ║
 * ║  · import SharePanel from '…'       → ESM default         ║
 * ║  · import { SharePanel } from '…'   → ESM named           ║
 * ║  · define(['SharePanel'], fn)       → AMD / RequireJS     ║
 * ╠═══════════════════════════════════════════════════════════╣
 * ║  Minimal usage:                                           ║
 * ║                                                           ║
 * ║    <script src="share.js"></script>                       ║
 * ║    <script>                                               ║
 * ║    SharePanel.init({                                      ║
 * ║      trigger : '#btn-share',                              ║
 * ║      name    : 'Your App',                                ║
 * ║    });                                                    ║
 * ║    </script>                                              ║
 * ╠═══════════════════════════════════════════════════════════╣
 * ║  Full options:                                            ║
 * ║                                                           ║
 * ║  trigger      '#btn-share'   CSS selector for the button  ║
 * ║  name         'My App'       Displayed name               ║
 * ║  url          location.href  Shared URL                   ║
 * ║  shareText    '...'          Social share text            ║
 * ║                              {name} and {url} replaced    ║
 * ║                              e.g. 'Try {name}!'           ║
 * ║  accent       '#00e676'      Accent color                 ║
 * ║  accentText   '#000'         Text color on accent         ║
 * ║  theme        'auto'         'dark'|'light'|'auto'        ║
 * ║                              auto = follows               ║
 * ║                              html[data-theme]             ║
 * ║  favicon      null           SVG string or image URL      ║
 * ║                              null = auto initials         ║
 * ║  locale       'en'           UI language                  ║
 * ║                              'en' → English (default)     ║
 * ║                              'fr' → French                ║
 * ║                              object → custom strings      ║
 * ║                              (overrides built-in locale)  ║
 * ║  platforms    null           Array to filter/reorder      ║
 * ║                              ['native','whatsapp',        ║
 * ║                               'telegram','twitter',       ║
 * ║                               'facebook','messenger',     ║
 * ║                               'linkedin','reddit',        ║
 * ║                               'pinterest','bluesky',      ║
 * ║                               'mastodon','discord',       ║
 * ║                               'slack',                    ║
 * ║                               'teams','snapchat',         ║
 * ║                               'instagram',                ║
 * ║                               'mail','sms','copy']        ║
 * ║                              null = all in this order     ║
 * ║  layout       'sheet'        Panel presentation:          ║
 * ║                              'sheet'   → iOS-style drawer ║
 * ║                                          (bottom of       ║
 * ║                                          screen)          ║
 * ║                              'popup'   → centered modal   ║
 * ║                                          3-col grid       ║
 * ║                              'list'    → vertical list    ║
 * ║                                          drawer           ║
 * ║                              'grid'    → 4-col grid       ║
 * ║                                          direct row +     ║
 * ║                                          more apps list   ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

/* ─── UMD wrapper ──────────────────────────────────────────────────────────
 * Compatible avec :
 *   · <script src="share.js">               → window.SharePanel  (navigateur)
 *   · const SP = require('./share.js')       → CommonJS  (Node / Webpack legacy)
 *   · import SharePanel from './share.js'    → ESM default  (Vite, Rollup, Next…)
 *   · import { SharePanel } from './share.js'→ ESM named
 *   · define(['SharePanel'], fn)             → AMD / RequireJS
 * ─────────────────────────────────────────────────────────────────────────── */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    /* CommonJS / Node.js / Webpack legacy / Browserify */
    var _sp = factory();
    module.exports = _sp; // require('./share.js')
    module.exports.default = _sp; // import SP from './share.js'  (interop)
    module.exports.SharePanel = _sp; // import { SharePanel } from './share.js'
  } else if (typeof define === "function" && define.amd) {
    /* AMD – RequireJS */
    define("SharePanel", [], factory);
  } else {
    /* Navigateur – variable globale */
    root.SharePanel = factory();
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
        ? global
        : this,
  function () {
    "use strict";

    /* ─── Core of SharePanel ─────────────────────── */
    var SharePanel = (function () {
      /* ── Platforms icons ─────────────────── */
      const ICONS = {
        native: {
          label: "Partager",
          sublabel: "Partage natif",
          color: "linear-gradient(135deg,#5b8def,#9b59f5)",
          svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2">
                 <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                 <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                 <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
               </svg>`,
        },
        whatsapp: {
          label: "WhatsApp",
          sublabel: "Envoyer via WhatsApp",
          color: "#25d366",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
               </svg>`,
        },
        telegram: {
          label: "Telegram",
          sublabel: "Partager sur Telegram",
          color: "#229ed9",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
               </svg>`,
        },
        twitter: {
          label: "X / Twitter",
          sublabel: "Tweeter ce lien",
          color: "#000",
          border: "rgba(255,255,255,.12)",
          svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>`,
        },
        linkedin: {
          label: "LinkedIn",
          sublabel: "Partager sur LinkedIn",
          color: "#0077b5",
          svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
               </svg>`,
        },
        mail: {
          label: "Email",
          sublabel: "Envoyer par mail",
          color: "linear-gradient(135deg,#ea4335,#fbbc04)",
          svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                 <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
               </svg>`,
        },
        sms: {
          label: "SMS",
          sublabel: "Envoyer par SMS",
          color: "linear-gradient(135deg,#32d74b,#30b0c7)",
          svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
               </svg>`,
        },
        copy: {
          label: "Copier",
          sublabel: "Copier le lien",
          color: "rgba(255,255,255,.1)",
          svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2">
                 <rect x="9" y="9" width="13" height="13" rx="2"/>
                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
               </svg>`,
        },
        facebook: {
          label: "Facebook",
          sublabel: "Partager sur Facebook",
          color: "#1877f2",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
               </svg>`,
        },
        pinterest: {
          label: "Pinterest",
          sublabel: "Épingler sur Pinterest",
          color: "#e60023",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
               </svg>`,
        },
        reddit: {
          label: "Reddit",
          sublabel: "Partager sur Reddit",
          color: "#ff4500",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
               </svg>`,
        },
        bluesky: {
          label: "Bluesky",
          sublabel: "Partager sur Bluesky",
          color: "#0085ff",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
               </svg>`,
        },
        mastodon: {
          label: "Mastodon",
          sublabel: "Partager sur Mastodon",
          color: "#6364ff",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/>
               </svg>`,
        },
        discord: {
          label: "Discord",
          sublabel: "Partager sur Discord",
          color: "#5865f2",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
               </svg>`,
        },
        slack: {
          label: "Slack",
          sublabel: "Partager sur Slack",
          color: "#4a154b",
          svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                 <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
               </svg>`,
        },
        teams: {
          label: "Teams",
          sublabel: "Partager sur Teams",
          color: "#6264a7",
          svg: `<svg width="22" height="22" viewBox="0 0 16 16" fill="#fff">
                 <path d="M9.186 4.797a2.42 2.42 0 1 0-2.86-2.448h1.178c.929 0 1.682.753 1.682 1.682zm-4.295 7.738h2.613c.929 0 1.682-.753 1.682-1.682V5.58h2.783a.7.7 0 0 1 .682.716v4.294a4.197 4.197 0 0 1-4.093 4.293c-1.618-.04-3-.99-3.667-2.35Zm10.737-9.372a1.674 1.674 0 1 1-3.349 0 1.674 1.674 0 0 1 3.349 0m-2.238 9.488-.12-.002a5.2 5.2 0 0 0 .381-2.07V6.306a1.7 1.7 0 0 0-.15-.725h1.792c.39 0 .707.317.707.707v3.765a2.6 2.6 0 0 1-2.598 2.598z"/>
                 <path d="M.682 3.349h6.822c.377 0 .682.305.682.682v6.822a.68.68 0 0 1-.682.682H.682A.68.68 0 0 1 0 10.853V4.03c0-.377.305-.682.682-.682Zm5.206 2.596v-.72h-3.59v.72h1.357V9.66h.87V5.945z"/>
               </svg>`,
        },
        messenger: {
          label: "Messenger",
          sublabel: "Envoyer via Messenger",
          color: "linear-gradient(135deg,#0099ff,#a033ff,#ff5c87)",
          svg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                 <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z"/>
               </svg>`,
        },
        snapchat: {
          label: "Snapchat",
          sublabel: "Partager sur Snapchat",
          color: "#fffc00",
          svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                 <path d="M12.004 2c-1.3 0-4.4.41-5.44 3.64-.34 1.04-.24 2.8-.18 3.96l-.01.03c-.14.01-.31-.02-.51-.08-.29-.08-.6-.21-.93-.21-.63 0-1.17.35-1.17.83 0 .59.63.9 1.22 1.08.13.04.27.08.39.12.52.18.79.38.73.65-.19.87-.88 2.01-1.91 3.02-.46.45-.71.87-.71 1.37 0 .65.46 1.18 1.31 1.55.59.26 1.34.43 2.22.52.08.35.22.88.49 1.07.18.13.38.19.62.19.19 0 .41-.04.65-.09.38-.08.85-.18 1.42-.18.49 0 .87.09 1.28.27.52.24 1.07.51 1.84.51.76 0 1.32-.27 1.84-.51.41-.18.79-.27 1.28-.27.57 0 1.04.1 1.42.18.24.05.46.09.65.09.24 0 .44-.06.62-.19.27-.19.41-.72.49-1.07.88-.09 1.63-.26 2.22-.52.85-.37 1.31-.9 1.31-1.55 0-.5-.25-.92-.71-1.37-1.03-1.01-1.72-2.15-1.91-3.02-.06-.27.21-.47.73-.65.12-.04.26-.08.39-.12.59-.18 1.22-.49 1.22-1.08 0-.48-.54-.83-1.17-.83-.33 0-.64.13-.93.21-.2.06-.37.09-.51.08l-.01-.03c.06-1.16.16-2.92-.18-3.96C16.404 2.41 13.304 2 12.004 2z"/>
               </svg>`,
        },
        instagram: {
          label: "Instagram",
          sublabel: "Partager sur Instagram",
          color: "linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)",
          svg: `<svg width="21" height="21" viewBox="0 0 24 24" fill="#fff">
                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
               </svg>`,
        },
      };

      /* ── Locales ────────────────────────────────────── */
      const LOCALES = {
        en: {
          // Platform labels & sublabels
          native: { label: "Share", sublabel: "Native share" },
          whatsapp: { label: "WhatsApp", sublabel: "Send via WhatsApp" },
          telegram: { label: "Telegram", sublabel: "Share on Telegram" },
          twitter: { label: "X / Twitter", sublabel: "Tweet this link" },
          linkedin: { label: "LinkedIn", sublabel: "Share on LinkedIn" },
          facebook: { label: "Facebook", sublabel: "Share on Facebook" },
          messenger: { label: "Messenger", sublabel: "Send via Messenger" },
          instagram: { label: "Instagram", sublabel: "Share on Instagram" },
          pinterest: { label: "Pinterest", sublabel: "Pin on Pinterest" },
          reddit: { label: "Reddit", sublabel: "Share on Reddit" },
          bluesky: { label: "Bluesky", sublabel: "Share on Bluesky" },
          mastodon: { label: "Mastodon", sublabel: "Share on Mastodon" },
          discord: { label: "Discord", sublabel: "Share on Discord" },
          slack: { label: "Slack", sublabel: "Share on Slack" },
          teams: { label: "Teams", sublabel: "Share on Teams" },
          snapchat: { label: "Snapchat", sublabel: "Share on Snapchat" },
          mail: { label: "Email", sublabel: "Send by email" },
          sms: { label: "SMS", sublabel: "Send by SMS" },
          copy: { label: "Copy", sublabel: "Copy the link" },
          // UI strings
          copyBtn: "Copy",
          copiedBtn: "✓ Copied",
          copiedBtnList: "✓ Copied!",
          toastCopied: "✓ Link copied to clipboard",
          ariaClose: "Close",
          ariaShareLink: "Link to share",
        },
        fr: {
          // Platform labels & sublabels
          native: { label: "Partager", sublabel: "Partage natif" },
          whatsapp: { label: "WhatsApp", sublabel: "Envoyer via WhatsApp" },
          telegram: { label: "Telegram", sublabel: "Partager sur Telegram" },
          twitter: { label: "X / Twitter", sublabel: "Tweeter ce lien" },
          linkedin: { label: "LinkedIn", sublabel: "Partager sur LinkedIn" },
          facebook: { label: "Facebook", sublabel: "Partager sur Facebook" },
          messenger: { label: "Messenger", sublabel: "Envoyer via Messenger" },
          instagram: { label: "Instagram", sublabel: "Partager sur Instagram" },
          pinterest: { label: "Pinterest", sublabel: "Épingler sur Pinterest" },
          reddit: { label: "Reddit", sublabel: "Partager sur Reddit" },
          bluesky: { label: "Bluesky", sublabel: "Partager sur Bluesky" },
          mastodon: { label: "Mastodon", sublabel: "Partager sur Mastodon" },
          discord: { label: "Discord", sublabel: "Partager sur Discord" },
          slack: { label: "Slack", sublabel: "Partager sur Slack" },
          teams: { label: "Teams", sublabel: "Partager sur Teams" },
          snapchat: { label: "Snapchat", sublabel: "Partager sur Snapchat" },
          mail: { label: "Email", sublabel: "Envoyer par mail" },
          sms: { label: "SMS", sublabel: "Envoyer par SMS" },
          copy: { label: "Copier", sublabel: "Copier le lien" },
          // UI strings
          copyBtn: "Copier",
          copiedBtn: "✓ Copié",
          copiedBtnList: "✓ Copié !",
          toastCopied: "✓ Lien copié dans le presse-papiers",
          ariaClose: "Fermer",
          ariaShareLink: "Lien à partager",
        },
      };

      const ALL_PLATFORMS = [
        "native",
        "whatsapp",
        "telegram",
        "twitter",
        "facebook",
        "messenger",
        "linkedin",
        "reddit",
        "pinterest",
        "bluesky",
        "mastodon",
        "discord",
        "slack",
        "teams",
        "snapchat",
        "instagram",
        "mail",
        "sms",
        "copy",
      ];

      /* ── CSS commun + 3 layouts ─────────────────────── */
      const CSS = `
    /* === OVERLAY === */
    .sp-overlay {
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,.55);
      backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
      display:flex;align-items:flex-end;justify-content:center;
      padding-bottom:env(safe-area-inset-bottom);
      opacity:0;pointer-events:none;
      transition:opacity .25s cubic-bezier(.4,0,.2,1);
    }
    .sp-overlay.sp-open { opacity:1;pointer-events:all; }

    /* === LAYOUT : SHEET (défaut, iOS) === */
    .sp-overlay.sp-layout-sheet { align-items:flex-end; }

    .sp-layout-sheet .sp-panel {
      width:100%;max-width:480px;
      background:var(--sp-bg,#111);
      border-radius:20px 20px 0 0;
      padding:0 0 calc(1.5rem + env(safe-area-inset-bottom));
      transform:translateY(100%);
      transition:transform .32s cubic-bezier(.34,1.56,.64,1);
      overflow:hidden;position:relative;
    }
    .sp-overlay.sp-open.sp-layout-sheet .sp-panel { transform:translateY(0); }

    .sp-layout-sheet .sp-handle {
      width:40px;height:4px;
      background:var(--sp-muted,rgba(255,255,255,.18));
      border-radius:2px;margin:12px auto 0;
    }
    .sp-layout-sheet .sp-header {
      display:flex;align-items:center;justify-content:space-between;
      padding:1.1rem 1.25rem .75rem;
      border-bottom:1px solid var(--sp-border,rgba(255,255,255,.07));
    }
    .sp-layout-sheet .sp-meta { display:flex;align-items:center;gap:.75rem;min-width:0; }
    .sp-layout-sheet .sp-favicon {
      width:40px;height:40px;border-radius:11px;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;overflow:hidden;
    }
    .sp-layout-sheet .sp-favicon svg { width:22px;height:22px; }
    .sp-layout-sheet .sp-favicon img { width:100%;height:100%;object-fit:cover; }
    .sp-layout-sheet .sp-close {
      width:28px;height:28px;border-radius:50%;
      background:var(--sp-border,rgba(255,255,255,.08));
      border:none;cursor:pointer;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      color:var(--sp-muted2,rgba(255,255,255,.45));
      transition:background .15s,color .15s;
    }
    .sp-layout-sheet .sp-close:hover { background:rgba(255,255,255,.15);color:#fff; }
    .sp-layout-sheet .sp-icons {
      display:flex;padding:.9rem .5rem .65rem;
      overflow-x:auto;scrollbar-width:none;gap:0;
      position:relative;
    }
    .sp-layout-sheet .sp-icons::-webkit-scrollbar { display:none; }
    /* Scroll hint : fade + chevron animé droite */
    .sp-layout-sheet .sp-icons-wrap {
      position:relative;overflow:hidden;
    }
    .sp-layout-sheet .sp-icons-wrap::after {
      content:'';pointer-events:none;
      position:absolute;top:0;right:0;bottom:0;width:64px;
      background:linear-gradient(to right,transparent 0%,var(--sp-bg,#111) 75%);
      opacity:1;transition:opacity .25s;
    }
    .sp-layout-sheet .sp-scroll-arrow {
      position:absolute;right:6px;top:50%;transform:translateY(-50%);
      pointer-events:none;z-index:2;
      width:22px;height:22px;border-radius:50%;
      background:rgba(255,255,255,.13);
      display:flex;align-items:center;justify-content:center;
      animation:sp-bounce-x .9s ease-in-out infinite;
      transition:opacity .25s;
    }
    .sp-layout-sheet .sp-scroll-arrow svg { display:block; }
    @keyframes sp-bounce-x {
      0%,100% { transform:translateY(-50%) translateX(0); }
      50%      { transform:translateY(-50%) translateX(4px); }
    }
    .sp-layout-sheet .sp-icons-wrap.sp-scrolled-end::after,
    .sp-layout-sheet .sp-icons-wrap.sp-scrolled-end .sp-scroll-arrow { opacity:0; }
    .sp-layout-sheet .sp-btn {
      display:flex;flex-direction:column;align-items:center;gap:.4rem;
      flex:0 0 auto;width:74px;
      background:none;border:none;cursor:pointer;
      padding:.45rem .2rem;border-radius:12px;
      transition:background .15s;
    }
    .sp-layout-sheet .sp-btn:hover { background:var(--sp-hover,rgba(255,255,255,.06)); }
    .sp-layout-sheet .sp-btn:active { transform:scale(.93); }
    .sp-layout-sheet .sp-circle {
      width:48px;height:48px;border-radius:14px;
      display:flex;align-items:center;justify-content:center;
      transition:transform .15s;
    }
    .sp-layout-sheet .sp-btn:hover .sp-circle { transform:translateY(-2px); }
    .sp-layout-sheet .sp-lbl {
      font-size:.63rem;font-weight:500;
      color:var(--sp-muted2,rgba(255,255,255,.45));
      text-align:center;line-height:1.2;
      font-family:system-ui,sans-serif;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:68px;
    }
    .sp-layout-sheet .sp-copy-bar {
      display:flex;align-items:center;gap:.6rem;
      margin:.3rem 1.25rem 0;
      background:var(--sp-border,rgba(255,255,255,.07));
      border:1px solid var(--sp-border2,rgba(255,255,255,.12));
      border-radius:10px;padding:.5rem .55rem .5rem .9rem;
    }

    /* === LAYOUT : POPUP (modale centrée grille 3 col) === */
    .sp-overlay.sp-layout-popup { align-items:center; }

    .sp-layout-popup .sp-panel {
      width:320px;
      background:var(--sp-bg,#111);
      border-radius:18px;
      border:1px solid var(--sp-border2,rgba(255,255,255,.1));
      overflow:hidden;position:relative;
      transform:scale(.88) translateY(12px);
      opacity:0;
      transition:transform .3s cubic-bezier(.34,1.56,.64,1), opacity .25s ease;
    }
    .sp-overlay.sp-open.sp-layout-popup .sp-panel {
      transform:scale(1) translateY(0);
      opacity:1;
    }
    .sp-layout-popup .sp-handle { display:none; }
    .sp-layout-popup .sp-header {
      display:flex;align-items:center;gap:.7rem;
      padding:.9rem 1rem .7rem;
      border-bottom:1px solid var(--sp-border,rgba(255,255,255,.07));
    }
    .sp-layout-popup .sp-meta { display:flex;align-items:center;gap:.7rem;flex:1;min-width:0; }
    .sp-layout-popup .sp-favicon {
      width:34px;height:34px;border-radius:9px;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;overflow:hidden;
    }
    .sp-layout-popup .sp-favicon svg { width:18px;height:18px; }
    .sp-layout-popup .sp-favicon img { width:100%;height:100%;object-fit:cover; }
    .sp-layout-popup .sp-close {
      width:24px;height:24px;border-radius:50%;
      background:var(--sp-border,rgba(255,255,255,.08));
      border:none;cursor:pointer;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      color:var(--sp-muted2,rgba(255,255,255,.45));
      transition:background .15s,color .15s;
    }
    .sp-layout-popup .sp-close:hover { background:rgba(255,255,255,.15);color:#fff; }
    .sp-layout-popup .sp-icons {
      display:grid;grid-template-columns:repeat(3,1fr);
      gap:1px;background:var(--sp-border,rgba(255,255,255,.07));
    }
    .sp-layout-popup .sp-btn {
      display:flex;flex-direction:column;align-items:center;gap:.4rem;
      background:var(--sp-bg,#111);border:none;cursor:pointer;
      padding:.85rem .4rem;
      transition:background .15s;
    }
    .sp-layout-popup .sp-btn:hover { background:var(--sp-hover,rgba(255,255,255,.07)); }
    .sp-layout-popup .sp-btn:active { transform:scale(.94); }
    .sp-layout-popup .sp-circle {
      width:44px;height:44px;border-radius:12px;
      display:flex;align-items:center;justify-content:center;
      transition:transform .15s;
    }
    .sp-layout-popup .sp-btn:hover .sp-circle { transform:translateY(-2px); }
    .sp-layout-popup .sp-lbl {
      font-size:.62rem;font-weight:500;
      color:var(--sp-muted2,rgba(255,255,255,.45));
      text-align:center;line-height:1.2;
      font-family:system-ui,sans-serif;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;
    }
    .sp-layout-popup .sp-copy-bar {
      display:flex;align-items:center;gap:.5rem;
      margin:0;padding:.6rem .8rem;
      border-top:1px solid var(--sp-border,rgba(255,255,255,.07));
      background:var(--sp-bg,#111);
    }

    /* === LAYOUT : LIST (drawer liste verticale) === */
    .sp-overlay.sp-layout-list { align-items:flex-end; }

    .sp-layout-list .sp-panel {
      width:100%;max-width:480px;
      background:var(--sp-bg,#111);
      border-radius:20px 20px 0 0;
      padding:0 0 calc(1rem + env(safe-area-inset-bottom));
      transform:translateY(100%);
      transition:transform .32s cubic-bezier(.34,1.56,.64,1);
      overflow:hidden;position:relative;
    }
    .sp-overlay.sp-open.sp-layout-list .sp-panel { transform:translateY(0); }

    .sp-layout-list .sp-handle {
      width:40px;height:4px;
      background:var(--sp-muted,rgba(255,255,255,.18));
      border-radius:2px;margin:12px auto 0;
    }
    .sp-layout-list .sp-header {
      display:flex;align-items:center;gap:.75rem;
      padding:.9rem 1.25rem .8rem;
      border-bottom:1px solid var(--sp-border,rgba(255,255,255,.07));
    }
    .sp-layout-list .sp-meta { display:flex;align-items:center;gap:.75rem;flex:1;min-width:0; }
    .sp-layout-list .sp-favicon {
      width:36px;height:36px;border-radius:9px;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;overflow:hidden;
    }
    .sp-layout-list .sp-favicon svg { width:20px;height:20px; }
    .sp-layout-list .sp-favicon img { width:100%;height:100%;object-fit:cover; }
    .sp-layout-list .sp-close { display:none; }

    .sp-layout-list .sp-list-copy-btn {
      flex-shrink:0;padding:.35rem .9rem;
      background:var(--sp-accent,#00e676);
      color:var(--sp-accent-text,#000);
      border:none;border-radius:8px;
      font-size:.75rem;font-weight:700;cursor:pointer;
      font-family:system-ui,sans-serif;
      transition:opacity .15s,transform .15s;white-space:nowrap;
    }
    .sp-layout-list .sp-list-copy-btn:hover { opacity:.85; }
    .sp-layout-list .sp-list-copy-btn:active { transform:scale(.95); }
    .sp-layout-list .sp-list-copy-btn.sp-copied { background:#30c97a;color:#fff; }

    .sp-layout-list .sp-icons {
      display:flex;flex-direction:column;
      overflow-y:auto;scrollbar-width:none;
      max-height:55vh;
    }
    .sp-layout-list .sp-icons::-webkit-scrollbar { display:none; }
    /* Scroll hint : fade + chevron animé bas */
    .sp-layout-list .sp-icons-wrap {
      position:relative;overflow:hidden;
    }
    .sp-layout-list .sp-icons-wrap::after {
      content:'';pointer-events:none;
      position:absolute;left:0;right:0;bottom:0;height:52px;
      background:linear-gradient(to bottom,transparent 0%,var(--sp-bg,#111) 80%);
      opacity:1;transition:opacity .25s;
    }
    .sp-layout-list .sp-scroll-arrow {
      position:absolute;bottom:6px;left:50%;transform:translateX(-50%);
      pointer-events:none;z-index:2;
      width:22px;height:22px;border-radius:50%;
      background:rgba(255,255,255,.13);
      display:flex;align-items:center;justify-content:center;
      animation:sp-bounce-y .9s ease-in-out infinite;
      transition:opacity .25s;
    }
    .sp-layout-list .sp-scroll-arrow svg { display:block; }
    .sp-layout-list .sp-icons-wrap.sp-scrolled-end::after,
    .sp-layout-list .sp-icons-wrap.sp-scrolled-end .sp-scroll-arrow { opacity:0; }
    .sp-layout-list .sp-btn {
      display:flex;align-items:center;gap:.85rem;
      width:100%;background:none;border:none;cursor:pointer;
      padding:.65rem 1.25rem;
      border-bottom:1px solid var(--sp-border,rgba(255,255,255,.05));
      transition:background .15s;
      text-align:left;
    }
    .sp-layout-list .sp-btn:last-child { border-bottom:none; }
    .sp-layout-list .sp-btn:hover { background:var(--sp-hover,rgba(255,255,255,.05)); }
    .sp-layout-list .sp-btn:active { background:var(--sp-hover,rgba(255,255,255,.08)); }
    .sp-layout-list .sp-circle {
      width:38px;height:38px;border-radius:10px;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
    }
    .sp-layout-list .sp-lbl-wrap { flex:1;min-width:0; }
    .sp-layout-list .sp-lbl {
      display:block;font-size:.82rem;font-weight:600;
      color:var(--sp-text,#fff);
      font-family:system-ui,sans-serif;
    }
    .sp-layout-list .sp-sublbl {
      display:block;font-size:.7rem;
      color:var(--sp-muted2,rgba(255,255,255,.38));
      font-family:system-ui,sans-serif;
      margin-top:.05rem;
    }
    .sp-layout-list .sp-chevron {
      color:var(--sp-muted,rgba(255,255,255,.2));flex-shrink:0;
    }
    .sp-layout-list .sp-copy-bar { display:none; }

    /* === LAYOUT : GRID (grille 4 col, style Android) === */
    .sp-overlay.sp-layout-grid { align-items:flex-end; }

    .sp-layout-grid .sp-panel {
      width:100%;max-width:480px;
      background:var(--sp-bg,#111);
      border-radius:20px 20px 0 0;
      padding:0 0 calc(1rem + env(safe-area-inset-bottom));
      transform:translateY(100%);
      transition:transform .32s cubic-bezier(.34,1.56,.64,1);
      overflow:hidden;position:relative;
    }
    .sp-overlay.sp-open.sp-layout-grid .sp-panel { transform:translateY(0); }

    .sp-layout-grid .sp-handle {
      width:40px;height:4px;
      background:var(--sp-muted,rgba(255,255,255,.18));
      border-radius:2px;margin:12px auto 0;
    }
    .sp-layout-grid .sp-header {
      display:flex;align-items:center;justify-content:space-between;
      padding:1.1rem 1.25rem .75rem;
      border-bottom:1px solid var(--sp-border,rgba(255,255,255,.07));
    }
    .sp-layout-grid .sp-meta { display:flex;align-items:center;gap:.75rem;min-width:0; }
    .sp-layout-grid .sp-favicon {
      width:40px;height:40px;border-radius:11px;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;overflow:hidden;
    }
    .sp-layout-grid .sp-favicon svg { width:22px;height:22px; }
    .sp-layout-grid .sp-favicon img { width:100%;height:100%;object-fit:cover; }
    .sp-layout-grid .sp-close {
      width:28px;height:28px;border-radius:50%;
      background:var(--sp-border,rgba(255,255,255,.08));
      border:none;cursor:pointer;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      color:var(--sp-muted2,rgba(255,255,255,.45));
      transition:background .15s,color .15s;
    }
    .sp-layout-grid .sp-close:hover { background:rgba(255,255,255,.15);color:#fff; }

    /* 4-column icon grid, scrollable vertically */
    .sp-layout-grid .sp-grid-icons {
      display:grid;grid-template-columns:repeat(4,1fr);
      gap:.15rem 0;padding:.75rem .3rem .4rem;
      max-height:280px;overflow-y:auto;scrollbar-width:none;
    }
    .sp-layout-grid .sp-grid-icons::-webkit-scrollbar { display:none; }
    /* Scroll hint : fade + chevron animé bas */
    .sp-layout-grid .sp-grid-wrap {
      position:relative;overflow:hidden;
    }
    .sp-layout-grid .sp-grid-wrap::after {
      content:'';pointer-events:none;
      position:absolute;left:0;right:0;bottom:0;height:56px;
      background:linear-gradient(to bottom,transparent 0%,var(--sp-bg,#111) 75%);
      opacity:1;transition:opacity .25s;
    }
    .sp-layout-grid .sp-scroll-arrow {
      position:absolute;bottom:6px;left:50%;transform:translateX(-50%);
      pointer-events:none;z-index:2;
      width:22px;height:22px;border-radius:50%;
      background:rgba(255,255,255,.13);
      display:flex;align-items:center;justify-content:center;
      animation:sp-bounce-y .9s ease-in-out infinite;
      transition:opacity .25s;
    }
    .sp-layout-grid .sp-scroll-arrow svg { display:block; }
    @keyframes sp-bounce-y {
      0%,100% { transform:translateX(-50%) translateY(0); }
      50%      { transform:translateX(-50%) translateY(4px); }
    }
    .sp-layout-grid .sp-grid-wrap.sp-scrolled-end::after,
    .sp-layout-grid .sp-grid-wrap.sp-scrolled-end .sp-scroll-arrow { opacity:0; }
    .sp-layout-grid .sp-grid-icons .sp-btn {
      display:flex;flex-direction:column;align-items:center;gap:.38rem;
      background:none;border:none;cursor:pointer;
      padding:.5rem .15rem;border-radius:14px;
      transition:background .15s;
    }
    .sp-layout-grid .sp-grid-icons .sp-btn:hover { background:var(--sp-hover,rgba(255,255,255,.06)); }
    .sp-layout-grid .sp-grid-icons .sp-btn:active { transform:scale(.91); }
    .sp-layout-grid .sp-grid-icons .sp-circle {
      width:54px;height:54px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,.25);
    }
    .sp-layout-grid .sp-grid-icons .sp-lbl {
      font-size:.65rem;font-weight:500;
      color:var(--sp-muted2,rgba(255,255,255,.55));
      text-align:center;line-height:1.25;
      font-family:system-ui,sans-serif;
      max-width:72px;word-break:break-word;
    }

    .sp-layout-grid .sp-copy-bar {
      display:flex;align-items:center;gap:.6rem;
      margin:.5rem 1.25rem 0;
      background:var(--sp-border,rgba(255,255,255,.07));
      border:1px solid var(--sp-border2,rgba(255,255,255,.12));
      border-radius:10px;padding:.5rem .55rem .5rem .9rem;
    }
    .sp-layout-grid .sp-icons { display:none !important; }
    .sp-layout-grid .sp-share-text { display:none !important; }

    /* Light theme */
    .sp-layout-grid .sp-panel.sp-light .sp-close { color:rgba(0,0,0,.4); }
    .sp-layout-grid .sp-panel.sp-light .sp-close:hover { background:rgba(0,0,0,.1);color:#000; }
    .sp-layout-grid .sp-panel.sp-light .sp-grid-icons .sp-lbl { color:rgba(0,0,0,.5); }

    /* === ÉLÉMENTS COMMUNS === */
    .sp-favicon-initials {
      font-size:.85rem;font-weight:800;
      color:var(--sp-accent-text,#000);
      font-family:system-ui,sans-serif;
      letter-spacing:-.02em;line-height:1;text-transform:uppercase;
    }
    .sp-name {
      font-size:.85rem;font-weight:700;
      color:var(--sp-text,#fff);font-family:system-ui,sans-serif;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;
    }
    .sp-url-disp {
      font-size:.67rem;color:var(--sp-muted2,rgba(255,255,255,.38));
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
      font-family:monospace;max-width:200px;
    }
    .sp-share-text {
      margin:.65rem 1.25rem .1rem;
      padding:.55rem .8rem;
      background:var(--sp-border,rgba(255,255,255,.05));
      border-left:2px solid var(--sp-accent,#00e676);
      border-radius:0 7px 7px 0;
      font-size:.75rem;line-height:1.5;
      color:var(--sp-muted2,rgba(255,255,255,.5));
      font-family:system-ui,sans-serif;
      display:none;
    }
    .sp-share-text.sp-has-text { display:block; }
    .sp-layout-list .sp-share-text { margin:.5rem 1.25rem .1rem; }

    .sp-copy-input {
      flex:1;font-size:.72rem;font-family:monospace;
      color:var(--sp-muted2,rgba(255,255,255,.4));
      background:none;border:none;outline:none;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
      cursor:text;user-select:all;
    }
    .sp-copy-btn {
      flex-shrink:0;padding:.3rem .8rem;
      background:var(--sp-accent,#00e676);
      color:var(--sp-accent-text,#000);
      border:none;border-radius:7px;
      font-size:.72rem;font-weight:700;cursor:pointer;
      font-family:system-ui,sans-serif;
      transition:opacity .15s,transform .15s;white-space:nowrap;
    }
    .sp-copy-btn:hover { opacity:.85; }
    .sp-copy-btn:active { transform:scale(.95); }
    .sp-copy-btn.sp-copied { background:#30c97a;color:#fff; }

    .sp-toast {
      position:fixed;bottom:2rem;left:50%;
      transform:translateX(-50%) translateY(8px);
      background:var(--sp-accent,#00e676);color:var(--sp-accent-text,#000);
      padding:.38rem .9rem;border-radius:8px;
      font-size:.75rem;font-weight:700;font-family:system-ui,sans-serif;
      opacity:0;pointer-events:none;white-space:nowrap;
      z-index:10000;
      transition:opacity .2s,transform .2s;
    }
    .sp-toast.sp-show { opacity:1;transform:translateX(-50%) translateY(0); }

    /* Thème clair */
    .sp-panel.sp-light {
      --sp-bg:#f5f5f5;--sp-text:#111;
      --sp-border:rgba(0,0,0,.07);--sp-border2:rgba(0,0,0,.11);
      --sp-muted:rgba(0,0,0,.14);--sp-muted2:rgba(0,0,0,.4);
      --sp-hover:rgba(0,0,0,.05);
    }
    .sp-layout-popup .sp-panel.sp-light { border-color:rgba(0,0,0,.12); }
    .sp-panel.sp-light .sp-close { color:rgba(0,0,0,.4); }
    .sp-panel.sp-light .sp-close:hover { background:rgba(0,0,0,.1);color:#000; }
    .sp-panel.sp-light .sp-copy-input { color:rgba(0,0,0,.4); }
    .sp-layout-list .sp-panel.sp-light .sp-lbl { color:#111; }
    .sp-panel.sp-light .sp-chevron { color:rgba(0,0,0,.2); }
  `;

      /* ── Helpers ────────────────────────────────────── */
      function _initials(name) {
        return name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0])
          .join("");
      }

      function _faviconHTML(favicon, name) {
        if (!favicon)
          return `<span class="sp-favicon-initials">${_initials(name)}</span>`;
        if (favicon.trim().startsWith("<")) return favicon;
        return `<img src="${favicon}" alt="${name}" style="border-radius:11px">`;
      }

      /* ── HTML Templates Contructors ─────────────── */

      function _buildIconsSheet(platforms) {
        return platforms
          .map((key) => {
            const p = ICONS[key];
            if (!p) return "";
            const border = p.border ? `border:1px solid ${p.border};` : "";
            const label = _tPlatform(key, "label");
            return `
      <button class="sp-btn" data-sp="${key}" aria-label="${label}">
        <div class="sp-circle" style="background:${p.color};${border}">${p.svg}</div>
        <span class="sp-lbl">${label}</span>
      </button>`;
          })
          .join("");
      }

      function _buildIconsPopup(platforms) {
        return platforms
          .map((key) => {
            const p = ICONS[key];
            if (!p) return "";
            const border = p.border ? `border:1px solid ${p.border};` : "";
            const label = _tPlatform(key, "label");
            return `
      <button class="sp-btn" data-sp="${key}" aria-label="${label}">
        <div class="sp-circle" style="background:${p.color};${border}">${p.svg}</div>
        <span class="sp-lbl">${label}</span>
      </button>`;
          })
          .join("");
      }

      function _buildIconsList(platforms) {
        const SVG_CHEV = `<svg class="sp-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;
        return platforms
          .map((key) => {
            const p = ICONS[key];
            if (!p) return "";
            const border = p.border ? `border:1px solid ${p.border};` : "";
            const label = _tPlatform(key, "label");
            const sublabel = _tPlatform(key, "sublabel");
            return `
      <button class="sp-btn" data-sp="${key}" aria-label="${label}">
        <div class="sp-circle" style="background:${p.color};${border}">${p.svg}</div>
        <div class="sp-lbl-wrap">
          <span class="sp-lbl">${label}</span>
          <span class="sp-sublbl">${sublabel}</span>
        </div>
        ${SVG_CHEV}
      </button>`;
          })
          .join("");
      }

      function _buildIconsGrid(platforms) {
        return platforms
          .map((key) => {
            const p = ICONS[key];
            if (!p) return "";
            const border = p.border ? `border:1px solid ${p.border};` : "";
            return `
            <button class="sp-btn" data-sp="${key}" aria-label="${_tPlatform(key, "label")}">
            <div class="sp-circle" style="background:${p.color};${border}">${p.svg}</div>
            <span class="sp-lbl">${_tPlatform(key, "label")}</span>
      </button>`;
          })
          .join("");
      }

      function _buildHTML(platforms, layout) {
        const SVG_CLOSE = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

        let iconsHTML;
        if (layout === "popup") iconsHTML = _buildIconsPopup(platforms);
        else if (layout === "list") iconsHTML = _buildIconsList(platforms);
        else if (layout === "grid") iconsHTML = "";
        else iconsHTML = _buildIconsSheet(platforms);

        const listCopyBtn =
          layout === "list"
            ? `<button class="sp-list-copy-btn" id="sp-list-copy-btn">${_t("copyBtn")}</button>`
            : "";

        const copyBar = `
      <div class="sp-copy-bar">
      <input class="sp-copy-input" id="sp-copy-input" readonly aria-label="${_t("ariaShareLink")}" />
      <button class="sp-copy-btn" id="sp-copy-btn">${_t("copyBtn")}</button>
      </div>`;

        // SVG chevrons for scroll hints
        const SVG_CHEV_RIGHT = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`;
        const SVG_CHEV_DOWN = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;

        // Grid layout: 4-column icon grid
        let androidBlocks = "";
        if (layout === "grid") {
          const gridHTML = _buildIconsGrid(platforms);
          androidBlocks = `<div class="sp-grid-wrap" id="sp-grid-wrap"><div class="sp-grid-icons" id="sp-grid-icons">${gridHTML}</div><div class="sp-scroll-arrow" id="sp-grid-arrow">${SVG_CHEV_DOWN}</div></div>`;
        }

        // Sheet / List: wrap icons in scroll hint wrapper
        let iconsBlock;
        if (layout === "sheet") {
          iconsBlock = `<div class="sp-icons-wrap" id="sp-icons-wrap"><div class="sp-icons" id="sp-icons">${iconsHTML}</div><div class="sp-scroll-arrow" id="sp-sheet-arrow">${SVG_CHEV_RIGHT}</div></div>`;
        } else if (layout === "list") {
          iconsBlock = `<div class="sp-icons-wrap" id="sp-icons-wrap"><div class="sp-icons" id="sp-icons">${iconsHTML}</div><div class="sp-scroll-arrow" id="sp-list-arrow">${SVG_CHEV_DOWN}</div></div>`;
        } else {
          iconsBlock = `<div class="sp-icons" id="sp-icons">${iconsHTML}</div>`;
        }

        return `
    <div class="sp-overlay sp-layout-${layout}" id="sp-overlay">
      <div class="sp-panel" id="sp-sheet">
        <div class="sp-handle"></div>
        <div class="sp-header">
          <div class="sp-meta">
            <div class="sp-favicon" id="sp-favicon"></div>
            <div>
              <div class="sp-name" id="sp-name"></div>
              <div class="sp-url-disp" id="sp-url-disp"></div>
            </div>
          </div>
          ${listCopyBtn}
          <button class="sp-close" id="sp-close" aria-label="${_t("ariaClose")}">${SVG_CLOSE}</button>
        </div>

        <div class="sp-share-text" id="sp-share-text"></div>

        ${iconsBlock}

        ${androidBlocks}

        ${copyBar}
        <div class="sp-toast" id="sp-toast"></div>
      </div>
    </div>`;
      }

      /* ── State ──────────────────────────────────────── */
      let _cfg = {};
      let _injected = false;
      let _toastTimer;
      let _locale = LOCALES.en; // active locale, default: English

      // Translation helper — falls back to English if a key is missing in the active locale
      function _t(key) {
        return _locale[key] || LOCALES.en[key] || key;
      }

      // Platform label/sublabel helper
      function _tPlatform(platformKey, field) {
        const loc = _locale[platformKey] || LOCALES.en[platformKey] || {};
        return loc[field] || ICONS[platformKey]?.[field] || "";
      }

      function _destroy() {
        // Remove the previously injected panel and style
        const overlay = document.getElementById("sp-overlay");
        if (overlay) overlay.remove();
        const style = document.getElementById("sp-style");
        if (style) style.remove();
        _injected = false;
      }

      function _inject(platforms, layout) {
        if (_injected) return;

        const style = document.createElement("style");
        style.id = "sp-style"; // ← id so we can retrieve it later
        style.textContent = CSS;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML(
          "beforeend",
          _buildHTML(platforms, layout),
        );

        // Wheel scroll → horizontal (sheet + android direct row)
        const iconsEl = document.getElementById("sp-icons");
        if (layout === "sheet") {
          iconsEl.addEventListener(
            "wheel",
            (e) => {
              e.preventDefault();
              iconsEl.scrollLeft += e.deltaY;
            },
            { passive: false },
          );
          // Scroll hint: hide fade + arrow when end is reached
          const wrapEl = document.getElementById("sp-icons-wrap");
          const _updateSheetFade = () => {
            if (!wrapEl) return;
            const atEnd =
              iconsEl.scrollLeft + iconsEl.clientWidth >=
              iconsEl.scrollWidth - 4;
            wrapEl.classList.toggle("sp-scrolled-end", atEnd);
          };
          iconsEl.addEventListener("scroll", _updateSheetFade, {
            passive: true,
          });
          setTimeout(_updateSheetFade, 50);
        }
        if (layout === "list") {
          // Vertical scroll hint for list layout
          const wrapEl = document.getElementById("sp-icons-wrap");
          const _updateListFade = () => {
            if (!wrapEl) return;
            const atEnd =
              iconsEl.scrollTop + iconsEl.clientHeight >=
              iconsEl.scrollHeight - 4;
            wrapEl.classList.toggle("sp-scrolled-end", atEnd);
          };
          iconsEl.addEventListener("scroll", _updateListFade, {
            passive: true,
          });
          setTimeout(_updateListFade, 50);
        }
        // Close handlers
        const closeBtn = document.getElementById("sp-close");
        if (closeBtn) closeBtn.addEventListener("click", close);
        document.getElementById("sp-overlay").addEventListener("click", (e) => {
          if (e.target.id === "sp-overlay") close();
        });
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") close();
        });

        // Icon click delegation
        iconsEl.addEventListener("click", (e) => {
          const btn = e.target.closest("[data-sp]");
          if (!btn) return;
          const key = btn.dataset.sp;
          if (key === "copy") copy();
          else if (key === "native") _native();
          else _to(key);
        });

        // Android: click delegation for direct + more
        if (layout === "grid") {
          const gridEl = document.getElementById("sp-grid-icons");
          if (gridEl) {
            gridEl.addEventListener("click", (e) => {
              const btn = e.target.closest("[data-sp]");
              if (!btn) return;
              const key = btn.dataset.sp;
              if (key === "copy") copy();
              else if (key === "native") _native();
              else _to(key);
            });
            // Bottom fade scroll hint
            const gridWrap = document.getElementById("sp-grid-wrap");
            const _updateGridFade = () => {
              if (!gridWrap) return;
              const atEnd =
                gridEl.scrollTop + gridEl.clientHeight >=
                gridEl.scrollHeight - 4;
              gridWrap.classList.toggle("sp-scrolled-end", atEnd);
            };
            gridEl.addEventListener("scroll", _updateGridFade, {
              passive: true,
            });
            setTimeout(_updateGridFade, 50);
          }
        }

        // Copy button in bar (sheet + popup)
        const copyBtn = document.getElementById("sp-copy-btn");
        if (copyBtn) copyBtn.addEventListener("click", copy);

        // Quick copy button in header (list)
        const listCopyBtn = document.getElementById("sp-list-copy-btn");
        if (listCopyBtn) listCopyBtn.addEventListener("click", copyList);

        _injected = true;
      }

      /* ── Public API ─────────────────────────────────── */

      function init(config = {}) {
        if (typeof config.locale === "string") {
          _locale = LOCALES[config.locale] || LOCALES.en;
        } else if (
          typeof config.locale === "object" &&
          config.locale !== null
        ) {
          _locale = { ...LOCALES.en, ...config.locale };
        } else {
          _locale = LOCALES.en;
        }

        const platforms = config.platforms || ALL_PLATFORMS;
        const layout = ["sheet", "popup", "list", "grid"].includes(
          config.layout,
        )
          ? config.layout
          : "sheet";

        // Destroy the previous panel if init() is called again (React StrictMode, re-render…)
        _destroy();
        _inject(platforms, layout);

        _cfg = {
          name: config.name || document.title,
          url: config.url || location.href,
          shareText: config.shareText || null,
          accent: config.accent || "#00e676",
          accentText: config.accentText || "#000",
          theme: config.theme || "auto",
          favicon: config.favicon || null,
          layout,
          platforms,
        };

        document
          .querySelectorAll(config.trigger || "#btn-share")
          .forEach((el) => {
            // Avoid duplicate listeners if init() is called again on the same button
            el.removeEventListener("click", open);
            el.addEventListener("click", open);
          });
      }

      function open() {
        const theme =
          _cfg.theme === "auto"
            ? document.documentElement.dataset.theme || "dark"
            : _cfg.theme;

        const panel = document.getElementById("sp-sheet");
        panel.style.setProperty("--sp-accent", _cfg.accent);
        panel.style.setProperty("--sp-accent-text", _cfg.accentText);
        panel.classList.toggle("sp-light", theme === "light");

        // Favicon
        const faviconEl = document.getElementById("sp-favicon");
        faviconEl.style.background = _cfg.favicon ? "transparent" : _cfg.accent;
        faviconEl.innerHTML = _faviconHTML(_cfg.favicon, _cfg.name);

        // Header
        document.getElementById("sp-name").textContent = _cfg.name;
        document.getElementById("sp-url-disp").textContent = _cfg.url.replace(
          /^https?:\/\//,
          "",
        );

        const copyInput = document.getElementById("sp-copy-input");
        if (copyInput) copyInput.value = _cfg.url;

        // Share text
        const stEl = document.getElementById("sp-share-text");
        stEl.style.setProperty("--sp-accent", _cfg.accent);
        if (_cfg.shareText) {
          stEl.textContent = _cfg.shareText
            .replace(/\{name\}/g, _cfg.name)
            .replace(/\{url\}/g, _cfg.url);
          stEl.classList.add("sp-has-text");
        } else {
          stEl.classList.remove("sp-has-text");
        }

        // Reset copy buttons
        const cb = document.getElementById("sp-copy-btn");
        if (cb) {
          cb.textContent = _t("copyBtn");
          cb.classList.remove("sp-copied");
        }
        const lcb = document.getElementById("sp-list-copy-btn");
        if (lcb) {
          lcb.textContent = _t("copyBtn");
          lcb.classList.remove("sp-copied");
        }

        // Native button: visible only if API is available
        const nativeBtn = document.querySelector('[data-sp="native"]');
        if (nativeBtn) nativeBtn.style.display = navigator.share ? "" : "none";

        // "copy" icon adapted to the theme (sheet)
        const copyCircle = document.querySelector(
          '[data-sp="copy"] .sp-circle',
        );
        if (copyCircle) {
          copyCircle.style.background =
            theme === "light" ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.1)";
        }

        document.getElementById("sp-overlay").classList.add("sp-open");
      }

      function close() {
        document.getElementById("sp-overlay").classList.remove("sp-open");
      }

      async function _doCopy() {
        try {
          await navigator.clipboard.writeText(_cfg.url);
        } catch {
          const input = document.getElementById("sp-copy-input");
          if (input) {
            input.select();
            document.execCommand("copy");
          }
        }
        _toast(_t("toastCopied"));
      }

      async function copy() {
        await _doCopy();
        const cb = document.getElementById("sp-copy-btn");
        if (cb) {
          cb.textContent = _t("copiedBtn");
          cb.classList.add("sp-copied");
          setTimeout(() => {
            cb.textContent = _t("copyBtn");
            cb.classList.remove("sp-copied");
          }, 2400);
        }
      }

      async function copyList() {
        await _doCopy();
        const lcb = document.getElementById("sp-list-copy-btn");
        if (lcb) {
          lcb.textContent = _t("copiedBtnList");
          lcb.classList.add("sp-copied");
          setTimeout(() => {
            lcb.textContent = _t("copyBtn");

            lcb.classList.remove("sp-copied");
          }, 2400);
        }
      }

      async function _native() {
        const text = _cfg.shareText
          ? _cfg.shareText
              .replace(/\{name\}/g, _cfg.name)
              .replace(/\{url\}/g, _cfg.url)
          : _cfg.name;
        try {
          await navigator.share({ title: _cfg.name, text, url: _cfg.url });
        } catch {
          /* cancelled */
        }
      }

      function _to(platform) {
        const u = encodeURIComponent(_cfg.url);
        const t = encodeURIComponent(
          _cfg.shareText
            ? _cfg.shareText
                .replace(/\{name\}/g, _cfg.name)
                .replace(/\{url\}/g, _cfg.url)
            : _cfg.name,
        );
        const n = encodeURIComponent(_cfg.name);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        // Deep links (native schemes for mobile) + web fallback
        const deepLinks = {
          whatsapp: {
            mobile: `whatsapp://send?text=${t}%20${u}`,
            web: `https://wa.me/?text=${t}%20${u}`,
          },
          telegram: {
            mobile: `tg://msg_url?url=${u}&text=${t}`,
            web: `https://t.me/share/url?url=${u}&text=${t}`,
          },
          twitter: {
            mobile: `twitter://post?message=${t}%20${u}`,
            web: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
          },
          facebook: {
            mobile: `fb://share?href=${u}`,
            web: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
          },
          messenger: {
            mobile: `fb-messenger://share?link=${u}`,
            web: `https://www.facebook.com/dialog/send?link=${u}&app_id=291494419107518&redirect_uri=${u}`,
          },
          instagram: {
            mobile: `instagram://share?url=${u}`,
            web: `https://www.instagram.com/`,
          },
          linkedin: {
            web: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
          },
          reddit: { web: `https://www.reddit.com/submit?url=${u}&title=${t}` },
          pinterest: {
            mobile: `pinterest://pin/create/bookmarklet/?url=${u}&description=${t}`,
            web: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}`,
          },
          bluesky: { web: `https://bsky.app/intent/compose?text=${t}%20${u}` },
          mastodon: { web: `https://mastodon.social/share?text=${t}%20${u}` },
          discord: {
            mobile: `discord://`,
            web: `https://discord.com/channels/@me`,
          },
          slack: {
            mobile: `slack://open`,
            web: `https://slack.com/intl/share?url=${u}&text=${t}`,
          },
          teams: {
            mobile: `msteams://share?href=${u}&msgText=${t}`,
            web: `https://teams.microsoft.com/share?href=${u}&msgText=${t}`,
          },
          snapchat: {
            mobile: `snapchat://snap`,
            web: `https://www.snapchat.com/scan?attachmentUrl=${u}`,
          },
          mail: { web: `mailto:?subject=${n}&body=${t}%0A%0A${u}` },
          sms: { web: `sms:?body=${t}%20${u}` },
        };

        const entry = deepLinks[platform];
        if (!entry) return;

        // On mobile: attempt the native deep link, fall back to web after 1.5s if the app is not installed
        if (isMobile && entry.mobile) {
          const webUrl = entry.web;
          if (webUrl) {
            // Fallback timeout: if the app doesn't open, open the web URL
            const fallbackTimer = setTimeout(() => {
              window.open(webUrl, "_blank", "noopener");
            }, 1500);
            // If the page remains visible after the timeout, the fallback fired; otherwise the app took over
            const _cancel = () => clearTimeout(fallbackTimer);
            window.addEventListener("blur", _cancel, { once: true });
            document.addEventListener(
              "visibilitychange",
              () => {
                if (document.hidden) clearTimeout(fallbackTimer);
              },
              { once: true },
            );
            window.location.href = entry.mobile;
          } else {
            window.location.href = entry.mobile;
          }
        } else if (entry.web) {
          window.open(entry.web, "_blank", "noopener,width=600,height=500");
        }
      }

      function _toast(msg) {
        const el = document.getElementById("sp-toast");
        el.textContent = msg;
        el.classList.add("sp-show");
        clearTimeout(_toastTimer);
        _toastTimer = setTimeout(() => el.classList.remove("sp-show"), 2600);
      }

      return { init, open, close, copy };
    })(); // end SharePanel inner IIFE

    return SharePanel;
  },
); // end UMD factory
