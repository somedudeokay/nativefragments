export const apiSections = [
  {
    "file": "src/server/html.js",
    "module": "@nativefragments/core/server",
    "title": "Server HTML",
    "types": [
      {
        "name": "RawHtml",
        "description": "",
        "properties": [],
        "type": "{ [RAW]: true, value: string }"
      },
      {
        "name": "HtmlAttrs",
        "description": "",
        "properties": [],
        "type": "Record<string, string | number | boolean | null | undefined>"
      }
    ],
    "symbols": [
      {
        "name": "raw",
        "description": "Mark a value as trusted HTML. Use this only for framework-generated markup or content that has already been validated. Ordinary interpolated values in {@link html} are escaped by default.",
        "params": [
          "{unknown} [value=\"\"] HTML to insert without escaping."
        ],
        "properties": [],
        "returns": "{RawHtml} Trusted HTML wrapper.",
        "type": ""
      },
      {
        "name": "escapeHtml",
        "description": "Escape a value for safe insertion into HTML text or attribute context.",
        "params": [
          "{unknown} value Value to escape."
        ],
        "properties": [],
        "returns": "{string} Escaped HTML string.",
        "type": ""
      },
      {
        "name": "html",
        "description": "Server-side HTML template tag with escaped interpolation by default. Arrays are flattened, `null`, `undefined`, and `false` become empty strings, and values returned by {@link raw} are inserted as trusted HTML.",
        "params": [
          "{TemplateStringsArray} strings Template literal string parts.",
          "{...unknown} values Interpolated values."
        ],
        "properties": [],
        "returns": "{string} Rendered HTML.",
        "type": ""
      },
      {
        "name": "jsonScript",
        "description": "Serialize JSON for safe embedding inside an inline script tag. `<` characters are escaped so embedded JSON cannot accidentally terminate the script element.",
        "params": [
          "{unknown} value Value to serialize."
        ],
        "properties": [],
        "returns": "{string} JSON string safe for script text.",
        "type": ""
      },
      {
        "name": "attrs",
        "description": "Build escaped HTML attributes from an object. `false`, `null`, and `undefined` values are omitted. `true` values render as boolean attributes.",
        "params": [
          "{HtmlAttrs} [attributes={}] Attribute map."
        ],
        "properties": [],
        "returns": "{RawHtml} Trusted HTML attribute string.",
        "type": ""
      }
    ]
  },
  {
    "file": "src/server/router.js",
    "module": "@nativefragments/core/server",
    "title": "Server Routing",
    "types": [
      {
        "name": "RouteContext",
        "description": "",
        "properties": [
          "{Request} request Original request.",
          "{URL} url Parsed request URL."
        ],
        "type": "object"
      },
      {
        "name": "RouteMeta",
        "description": "",
        "properties": [
          "{string} [title] Document title.",
          "{string} [description] Meta description.",
          "{string} [canonical] Canonical URL."
        ],
        "type": "object"
      },
      {
        "name": "RouteDefinition",
        "description": "",
        "properties": [
          "{(context: RouteContext) => RouteMeta | Promise<RouteMeta>} [meta] Function that returns metadata for the route.",
          "{(context: RouteContext) => string | Promise<string>} render Function that renders route body HTML."
        ],
        "type": "object"
      },
      {
        "name": "Route",
        "description": "",
        "properties": [],
        "type": "RouteDefinition & { path: string }"
      }
    ],
    "symbols": [
      {
        "name": "route",
        "description": "Create a normalized route definition.",
        "params": [
          "{string} path URL path for the route.",
          "{RouteDefinition} definition Route metadata and render functions."
        ],
        "properties": [],
        "returns": "{Route} Normalized route.",
        "type": ""
      },
      {
        "name": "createRoutes",
        "description": "Create a route manifest that can match normalized paths.",
        "params": [
          "{Route[]} routes Route definitions."
        ],
        "properties": [],
        "returns": "{{ all: Route[], match(pathname: string): Route | null }} Route manifest.",
        "type": ""
      },
      {
        "name": "fragmentMeta",
        "description": "Render fragment metadata for the browser fragment router.",
        "params": [
          "{RouteMeta} meta Metadata to embed in the fragment response."
        ],
        "properties": [],
        "returns": "{string} Script tag containing serialized metadata.",
        "type": ""
      },
      {
        "name": "renderRoute",
        "description": "Render a matched route and normalize metadata defaults.",
        "params": [
          "{{ match: Route, request: Request }} options Render options."
        ],
        "properties": [],
        "returns": "{Promise<{ body: string, meta: Required<RouteMeta> }>} Rendered route.",
        "type": ""
      },
      {
        "name": "renderFragment",
        "description": "Render a fragment response body with embedded metadata.",
        "params": [
          "{{ body: string, meta: RouteMeta }} rendered Rendered route body and metadata."
        ],
        "properties": [],
        "returns": "{string} Fragment HTML.",
        "type": ""
      },
      {
        "name": "notFoundRoute",
        "description": "Default 404 route used by adapters when a route is not matched.",
        "params": [],
        "properties": [],
        "returns": "",
        "type": "{Route}"
      }
    ]
  },
  {
    "file": "src/cloudflare/index.js",
    "module": "@nativefragments/core/cloudflare",
    "title": "Cloudflare Adapter",
    "types": [
      {
        "name": "Route",
        "description": "",
        "properties": [],
        "type": "import(\"../server/router.js\").Route"
      },
      {
        "name": "CloudflareHandlerOptions",
        "description": "",
        "properties": [
          "{Route[]} routes App route definitions.",
          "{(rendered: { body: string, meta: object }) => string} shell Function that wraps a rendered route body in a full HTML document.",
          "{Route} [notFound] Optional 404 route.",
          "{string} [assetsBinding=\"ASSETS\"] Cloudflare assets binding name."
        ],
        "type": "object"
      }
    ],
    "symbols": [
      {
        "name": "createCloudflareHandler",
        "description": "Create a Cloudflare Worker module for a Native Fragments app. Static assets are served from the configured assets binding. Normal document requests render the app shell. Requests with `x-fragment: true` return only the route body plus fragment metadata.",
        "params": [
          "{CloudflareHandlerOptions} options Worker adapter options."
        ],
        "properties": [],
        "returns": "{{ fetch(request: Request, env: Record<string, unknown>): Promise<Response> }} Cloudflare Worker module.",
        "type": ""
      }
    ]
  },
  {
    "file": "public/nativefragments/router.js",
    "module": "/nativefragments/router.js",
    "title": "Browser Router",
    "types": [
      {
        "name": "FragmentNavigationOptions",
        "description": "",
        "properties": [
          "{string} [slot=\"#content-slot\"] Selector for the element replaced by fragment responses.",
          "{number} [ttl=30000] Fragment cache time in milliseconds.",
          "{(event: { meta: object | null, url: URL }) => void} [afterNavigate] Callback fired after a successful client-side navigation."
        ],
        "type": "object"
      }
    ],
    "symbols": [
      {
        "name": "installFragmentNavigation",
        "description": "Install same-origin fragment navigation. Clicked links are fetched with `x-fragment: true`, the configured content slot is replaced, document metadata is updated, and history state is pushed. External links and modified clicks keep normal browser behavior.",
        "params": [
          "{FragmentNavigationOptions} [options={}] Navigation options."
        ],
        "properties": [],
        "returns": "{((href: string, pushState?: boolean) => Promise<void>) | undefined} Navigate function, or `undefined` if the slot does not exist.",
        "type": ""
      }
    ]
  },
  {
    "file": "public/nativefragments/component.js",
    "module": "/nativefragments/component.js",
    "title": "Shadow DOM Components",
    "types": [
      {
        "name": "ShadowOptions",
        "description": "",
        "properties": [
          "{CSSStyleSheet[]} [styles=[]] Constructable stylesheets to adopt.",
          "{string} [html=\"\"] Shadow root HTML."
        ],
        "type": "object"
      }
    ],
    "symbols": [
      {
        "name": "sheet",
        "description": "Create a constructable stylesheet for Shadow DOM components.",
        "params": [
          "{string} cssText CSS source."
        ],
        "properties": [],
        "returns": "{CSSStyleSheet} Constructable stylesheet.",
        "type": ""
      },
      {
        "name": "shadow",
        "description": "Attach or reuse an open shadow root, adopt stylesheets, and set its HTML.",
        "params": [
          "{HTMLElement} element Custom element receiving the shadow root.",
          "{ShadowOptions} [options={}] Shadow render options."
        ],
        "properties": [],
        "returns": "{ShadowRoot} The element's shadow root.",
        "type": ""
      }
    ]
  }
];
