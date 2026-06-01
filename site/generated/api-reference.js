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
        "name": "DeclarativeShadowOptions",
        "description": "",
        "properties": [
          "{string[]} [styles=[]] CSS text rendered into `<style>` tags inside the declarative shadow root.",
          "{string} [html=\"\"] Trusted shadow root HTML. Build dynamic HTML with {@link html} before passing it here."
        ],
        "type": "object"
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
        "name": "declarativeShadow",
        "description": "Render a declarative Shadow DOM template for server-rendered components. Put this as the first child of a custom element to avoid a flash of unstyled light DOM before the component module loads. Pair it with the browser {@link shadow} helper, which preserves an existing declarative shadow root on first upgrade and materializes declarative shadow templates inserted during fragment navigation.",
        "params": [
          "{DeclarativeShadowOptions} [options={}] Shadow template options."
        ],
        "properties": [],
        "returns": "{RawHtml} Trusted declarative shadow template.",
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
          "{URL} url Parsed request URL.",
          "{Record<string, string>} params Path parameters captured from a route pattern like `/posts/:slug`."
        ],
        "type": "object"
      },
      {
        "name": "RouteMeta",
        "description": "",
        "properties": [
          "{string} [title] Document title.",
          "{string} [description] Meta description.",
          "{string} [canonical] Canonical URL.",
          "{{ hreflang: string, href: string }[]} [alternates] Alternate language URLs for `<link rel=\"alternate\" hreflang=\"...\">`."
        ],
        "type": "object"
      },
      {
        "name": "FragmentRenderer",
        "description": "",
        "properties": [],
        "type": "(context: RouteContext) => string | Promise<string>"
      },
      {
        "name": "FragmentDefinition",
        "description": "",
        "properties": [
          "{string} name Fragment slot name.",
          "{FragmentRenderer} render Fragment renderer.",
          "{(attributes?: import(\"./html.js\").HtmlAttrs) => import(\"./html.js\").RawHtml} attrs Attributes for links and target containers using this fragment slot.",
          "{(mode?: \"intent\" | \"visible\" | \"load\" | \"none\", attributes?: import(\"./html.js\").HtmlAttrs) => import(\"./html.js\").RawHtml} prefetchAttrs Attributes for links using this fragment slot with a prefetch mode."
        ],
        "type": "object"
      },
      {
        "name": "RouteDefinition",
        "description": "",
        "properties": [
          "{(context: RouteContext) => RouteMeta | Promise<RouteMeta>} [meta] Function that returns metadata for the route.",
          "{(context: RouteContext) => string | Promise<string>} render Function that renders route body HTML.",
          "{Record<string, FragmentRenderer> | FragmentDefinition[]} [fragments] Named fragment renderers used by nested fragment slots."
        ],
        "type": "object"
      },
      {
        "name": "Route",
        "description": "",
        "properties": [],
        "type": "RouteDefinition & { path: string, params?: Record<string, string> }"
      }
    ],
    "symbols": [
      {
        "name": "fragment",
        "description": "Create a named fragment definition. Use this when a route has a nested region with its own navigation. The returned object can be registered in `route(..., { fragments: [item] })` and its attributes can be reused on links and target containers.",
        "params": [
          "{string} name Fragment slot name.",
          "{FragmentRenderer} render Fragment renderer."
        ],
        "properties": [],
        "returns": "{FragmentDefinition} Fragment definition.",
        "type": ""
      },
      {
        "name": "route",
        "description": "Create a normalized route definition.",
        "params": [
          "{string} path URL path for the route. Use `:name` segments for path params, for example `/posts/:slug`.",
          "{RouteDefinition} definition Route metadata and render functions."
        ],
        "properties": [],
        "returns": "{Route} Normalized route.",
        "type": ""
      },
      {
        "name": "createRoutes",
        "description": "Create a route manifest that can match normalized paths. Exact static routes win first, then parameterized routes are matched in declaration order.",
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
          "{{ match: Route, request: Request, slot?: string | null }} options Render options. When `slot` matches `RouteDefinition.fragments`, only that named fragment is rendered."
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
          "{{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response }} [api] Optional Web Standards API router. Hono apps work here because they expose a compatible `fetch` method.",
          "{string} [apiPrefix=\"/api\"] URL prefix handled by `api`.",
          "{Route} [notFound] Optional 404 route.",
          "{string} [assetsBinding=\"ASSETS\"] Cloudflare assets binding name.",
          "{boolean} [fragmentManifest=true] Whether to inject a declarative fragment manifest with Cloudflare `HTMLRewriter` when available."
        ],
        "type": "object"
      }
    ],
    "symbols": [
      {
        "name": "createCloudflareHandler",
        "description": "Create a Cloudflare Worker module for a Native Fragments app. Static assets are served from the configured assets binding. Normal document requests render the app shell. Requests with `x-fragment: true` return only the route body plus fragment metadata. Requests under `apiPrefix` are delegated to the optional API router before app route matching.",
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
          "{boolean | \"none\" | \"intent\" | \"visible\" | \"load\"} [prefetch=\"intent\"] Default fragment prefetch behavior. Links can override this with `data-fragment-prefetch=\"intent|visible|load|none\"`.",
          "{(event: { meta: object | null, url: URL, slot: string }) => void} [afterNavigate] Callback fired after a successful client-side navigation."
        ],
        "type": "object"
      }
    ],
    "symbols": [
      {
        "name": "prefetchFragment",
        "description": "Prefetch a same-origin fragment into the shared fragment cache.",
        "params": [
          "{string | URL} href URL to prefetch.",
          "{{ slot?: string, ttl?: number, signal?: AbortSignal }} [options={}] Prefetch options."
        ],
        "properties": [],
        "returns": "{Promise<string | null>} Prefetched fragment HTML, or `null` for skipped cross-origin URLs and document-like URLs such as `/agents.txt`.",
        "type": ""
      },
      {
        "name": "installFragmentNavigation",
        "description": "Install same-origin fragment navigation. Clicked links are fetched with `x-fragment: true`, the configured content slot is replaced, document metadata is updated, and history state is pushed. Links with `data-fragment-slot=\"name\"` replace only the matching `[data-fragment-slot=\"name\"]` container and send `x-fragment-slot: name`. External links, document-like URLs such as `/agents.txt`, modified clicks, and links with `data-nativefragments-reload` or `data-fragment-navigation=\"false\"` keep normal browser behavior.",
        "params": [
          "{FragmentNavigationOptions} [options={}] Navigation options."
        ],
        "properties": [],
        "returns": "{((href: string, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined} Navigate function, or `undefined` if the slot does not exist.",
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
          "{string} [html=\"\"] Shadow root HTML.",
          "{boolean} [hydrate=true] Preserve an existing declarative shadow root on the first render so server-rendered components do not flash."
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
        "description": "Attach or reuse an open shadow root, adopt stylesheets, and set its HTML. If the element already has declarative shadow DOM from server HTML, the first call preserves that DOM by default. Fragment navigation inserts HTML with `template.innerHTML`, so declarative shadow templates are materialized manually before hydration to keep server-rendered components visible.",
        "params": [
          "{HTMLElement} element Custom element receiving the shadow root.",
          "{ShadowOptions} [options={}] Shadow render options."
        ],
        "properties": [],
        "returns": "{ShadowRoot} The element's shadow root.",
        "type": ""
      }
    ]
  },
  {
    "file": "public/nativefragments/worker.js",
    "module": "/nativefragments/worker.js",
    "title": "Web Workers",
    "types": [
      {
        "name": "WorkerClientOptions",
        "description": "",
        "properties": [
          "{number} [timeout=30000] Request timeout in milliseconds."
        ],
        "type": "object"
      },
      {
        "name": "NativeWorkerClient",
        "description": "",
        "properties": [
          "{(type: string, payload?: unknown, transfer?: Transferable[]) => Promise<unknown>} call Call a named worker handler.",
          "{() => void} dispose Reject pending calls and remove listeners.",
          "{Worker} worker The wrapped Worker instance."
        ],
        "type": "object"
      }
    ],
    "symbols": [
      {
        "name": "transferResult",
        "description": "Wrap a worker response with Transferable objects.",
        "params": [
          "{T} payload Response payload.",
          "{Transferable[]} [transfer=[]] Transferable objects to move."
        ],
        "properties": [],
        "returns": "{{ payload: T, transfer: Transferable[], [transferMarker]: true }}",
        "type": ""
      },
      {
        "name": "workerClient",
        "description": "Create a tiny RPC client for a dedicated Web Worker.",
        "params": [
          "{Worker} worker Worker instance.",
          "{WorkerClientOptions} [options={}] Client options."
        ],
        "properties": [],
        "returns": "{NativeWorkerClient} Worker client.",
        "type": ""
      },
      {
        "name": "createWorkerClient",
        "description": "Create a module worker and wrap it with `workerClient`.",
        "params": [
          "{string | URL | Worker} workerOrUrl Existing Worker or worker module URL.",
          "{WorkerClientOptions & { workerOptions?: WorkerOptions }} [options={}] Client and Worker constructor options."
        ],
        "properties": [],
        "returns": "{NativeWorkerClient} Worker client.",
        "type": ""
      },
      {
        "name": "exposeWorker",
        "description": "Expose named handlers inside a dedicated Web Worker.",
        "params": [
          "{Record<string, (payload: unknown, context: { event: MessageEvent, type: string }) => unknown | Promise<unknown>>} handlers Worker handlers keyed by message type.",
          "{DedicatedWorkerGlobalScope} [scope=globalThis] Worker global scope."
        ],
        "properties": [],
        "returns": "{() => void} Cleanup function.",
        "type": ""
      }
    ]
  }
];
