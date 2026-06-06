export const apiSections = [
  {
    "file": "src/server/html.js",
    "module": "@nativefragments/core/server",
    "title": "Server HTML",
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js",
    "types": [
      {
        "name": "RawHtml",
        "description": "",
        "properties": [],
        "type": "{ [RAW]: true, value: string }",
        "line": 3,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L3"
      },
      {
        "name": "DeclarativeShadowOptions",
        "description": "",
        "properties": [
          {
            "name": "styles",
            "type": "string[]",
            "optional": true,
            "default": "[]",
            "description": "CSS text rendered into `<style>` tags inside the declarative shadow root.",
            "rest": false
          },
          {
            "name": "html",
            "type": "string",
            "optional": true,
            "default": "\"\"",
            "description": "Trusted shadow root HTML. Build dynamic HTML with {@link html} before passing it here.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 64,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L64"
      },
      {
        "name": "HtmlAttrs",
        "description": "",
        "properties": [],
        "type": "Record<string, string | number | boolean | null | undefined>",
        "line": 103,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L103"
      }
    ],
    "symbols": [
      {
        "name": "raw",
        "signature": "raw(value?) → RawHtml",
        "line": 19,
        "description": "Mark a value as trusted HTML. Use this only for framework-generated markup or content that has already been validated. Ordinary interpolated values in {@link html} are escaped by default.",
        "params": [
          {
            "name": "value",
            "type": "unknown",
            "optional": true,
            "default": "\"\"",
            "description": "HTML to insert without escaping.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "RawHtml",
          "description": "Trusted HTML wrapper."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L19"
      },
      {
        "name": "escapeHtml",
        "signature": "escapeHtml(value) → string",
        "line": 30,
        "description": "Escape a value for safe insertion into HTML text or attribute context.",
        "params": [
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Value to escape.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "string",
          "description": "Escaped HTML string."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L30"
      },
      {
        "name": "html",
        "signature": "html(strings, ...values) → string",
        "line": 55,
        "description": "Server-side HTML template tag with escaped interpolation by default. Arrays are flattened, `null`, `undefined`, and `false` become empty strings, and values returned by {@link raw} are inserted as trusted HTML.",
        "params": [
          {
            "name": "strings",
            "type": "TemplateStringsArray",
            "optional": false,
            "default": "",
            "description": "Template literal string parts.",
            "rest": false
          },
          {
            "name": "values",
            "type": "...unknown",
            "optional": false,
            "default": "",
            "description": "Interpolated values.",
            "rest": true
          }
        ],
        "properties": [],
        "returns": {
          "type": "string",
          "description": "Rendered HTML."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L55"
      },
      {
        "name": "declarativeShadow",
        "signature": "declarativeShadow(options?) → RawHtml",
        "line": 84,
        "description": "Render a declarative Shadow DOM template for server-rendered components. Put this as the first child of a custom element to avoid a flash of unstyled light DOM before the component module loads. Pair it with the browser {@link shadow} helper, which preserves an existing declarative shadow root on first upgrade and materializes declarative shadow templates inserted during fragment navigation.",
        "params": [
          {
            "name": "options",
            "type": "DeclarativeShadowOptions",
            "optional": true,
            "default": "{}",
            "description": "Shadow template options.",
            "rest": false,
            "fields": [
              {
                "name": "styles",
                "type": "string[]",
                "optional": true,
                "default": "[]",
                "description": "CSS text rendered into `<style>` tags inside the declarative shadow root.",
                "rest": false
              },
              {
                "name": "html",
                "type": "string",
                "optional": true,
                "default": "\"\"",
                "description": "Trusted shadow root HTML. Build dynamic HTML with {@link html} before passing it here.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "RawHtml",
          "description": "Trusted declarative shadow template."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L84"
      },
      {
        "name": "jsonScript",
        "signature": "jsonScript(value) → string",
        "line": 100,
        "description": "Serialize JSON for safe embedding inside an inline script tag. `<` characters are escaped so embedded JSON cannot accidentally terminate the script element.",
        "params": [
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Value to serialize.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "string",
          "description": "JSON string safe for script text."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L100"
      },
      {
        "name": "attrs",
        "signature": "attrs(attributes?) → RawHtml",
        "line": 116,
        "description": "Build escaped HTML attributes from an object. `false`, `null`, and `undefined` values are omitted. `true` values render as boolean attributes.",
        "params": [
          {
            "name": "attributes",
            "type": "HtmlAttrs",
            "optional": true,
            "default": "{}",
            "description": "Attribute map.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "RawHtml",
          "description": "Trusted HTML attribute string."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L116"
      }
    ]
  },
  {
    "file": "src/server/router.js",
    "module": "@nativefragments/core/server",
    "title": "Server Routing",
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js",
    "types": [
      {
        "name": "RouteContext",
        "description": "",
        "properties": [
          {
            "name": "request",
            "type": "Request",
            "optional": false,
            "default": "",
            "description": "Original request.",
            "rest": false
          },
          {
            "name": "url",
            "type": "URL",
            "optional": false,
            "default": "",
            "description": "Parsed request URL.",
            "rest": false
          },
          {
            "name": "params",
            "type": "Record<string, string>",
            "optional": false,
            "default": "",
            "description": "Path parameters captured from a route pattern like `/posts/:slug`.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 3,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L3"
      },
      {
        "name": "RouteMeta",
        "description": "",
        "properties": [
          {
            "name": "title",
            "type": "string",
            "optional": true,
            "default": "",
            "description": "Document title.",
            "rest": false
          },
          {
            "name": "description",
            "type": "string",
            "optional": true,
            "default": "",
            "description": "Meta description.",
            "rest": false
          },
          {
            "name": "canonical",
            "type": "string",
            "optional": true,
            "default": "",
            "description": "Canonical URL.",
            "rest": false
          },
          {
            "name": "alternates",
            "type": "{ hreflang: string, href: string }[]",
            "optional": true,
            "default": "",
            "description": "Alternate language URLs for `<link rel=\"alternate\" hreflang=\"...\">`.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 11,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L11"
      },
      {
        "name": "FragmentRenderer",
        "description": "",
        "properties": [],
        "type": "(context: RouteContext) => string | Promise<string>",
        "line": 20,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L20"
      },
      {
        "name": "FragmentDefinition",
        "description": "",
        "properties": [
          {
            "name": "name",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Fragment slot name.",
            "rest": false
          },
          {
            "name": "render",
            "type": "FragmentRenderer",
            "optional": false,
            "default": "",
            "description": "Fragment renderer.",
            "rest": false
          },
          {
            "name": "attrs",
            "type": "(attributes?: import(\"./html.js\").HtmlAttrs) => import(\"./html.js\").RawHtml",
            "optional": false,
            "default": "",
            "description": "Attributes for links and target containers using this fragment slot.",
            "rest": false
          },
          {
            "name": "prefetchAttrs",
            "type": "(mode?: \"intent\" | \"visible\" | \"load\" | \"none\", attributes?: import(\"./html.js\").HtmlAttrs) => import(\"./html.js\").RawHtml",
            "optional": false,
            "default": "",
            "description": "Attributes for links using this fragment slot with a prefetch mode.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 24,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L24"
      },
      {
        "name": "RouteDefinition",
        "description": "",
        "properties": [
          {
            "name": "meta",
            "type": "(context: RouteContext) => RouteMeta | Promise<RouteMeta>",
            "optional": true,
            "default": "",
            "description": "Function that returns metadata for the route.",
            "rest": false
          },
          {
            "name": "render",
            "type": "(context: RouteContext) => string | Promise<string>",
            "optional": false,
            "default": "",
            "description": "Function that renders route body HTML.",
            "rest": false
          },
          {
            "name": "fragments",
            "type": "Record<string, FragmentRenderer> | FragmentDefinition[]",
            "optional": true,
            "default": "",
            "description": "Named fragment renderers used by nested fragment slots.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 34,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L34"
      },
      {
        "name": "Route",
        "description": "",
        "properties": [],
        "type": "RouteDefinition & { path: string, params?: Record<string, string> }",
        "line": 44,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L44"
      }
    ],
    "symbols": [
      {
        "name": "fragment",
        "signature": "fragment(name, render) → FragmentDefinition",
        "line": 108,
        "description": "Create a named fragment definition. Use this when a route has a nested region with its own navigation. The returned object can be registered in `route(..., { fragments: [item] })` and its attributes can be reused on links and target containers.",
        "params": [
          {
            "name": "name",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Fragment slot name.",
            "rest": false
          },
          {
            "name": "render",
            "type": "FragmentRenderer",
            "optional": false,
            "default": "",
            "description": "Fragment renderer.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "FragmentDefinition",
          "description": "Fragment definition."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L108",
        "returnFields": [
          {
            "name": "name",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Fragment slot name.",
            "rest": false
          },
          {
            "name": "render",
            "type": "FragmentRenderer",
            "optional": false,
            "default": "",
            "description": "Fragment renderer.",
            "rest": false
          },
          {
            "name": "attrs",
            "type": "(attributes?: import(\"./html.js\").HtmlAttrs) => import(\"./html.js\").RawHtml",
            "optional": false,
            "default": "",
            "description": "Attributes for links and target containers using this fragment slot.",
            "rest": false
          },
          {
            "name": "prefetchAttrs",
            "type": "(mode?: \"intent\" | \"visible\" | \"load\" | \"none\", attributes?: import(\"./html.js\").HtmlAttrs) => import(\"./html.js\").RawHtml",
            "optional": false,
            "default": "",
            "description": "Attributes for links using this fragment slot with a prefetch mode.",
            "rest": false
          }
        ]
      },
      {
        "name": "route",
        "signature": "route(path, definition) → Route",
        "line": 128,
        "description": "Create a normalized route definition.",
        "params": [
          {
            "name": "path",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "URL path for the route. Use `:name` segments for path params, for example `/posts/:slug`.",
            "rest": false
          },
          {
            "name": "definition",
            "type": "RouteDefinition",
            "optional": false,
            "default": "",
            "description": "Route metadata and render functions.",
            "rest": false,
            "fields": [
              {
                "name": "meta",
                "type": "(context: RouteContext) => RouteMeta | Promise<RouteMeta>",
                "optional": true,
                "default": "",
                "description": "Function that returns metadata for the route.",
                "rest": false
              },
              {
                "name": "render",
                "type": "(context: RouteContext) => string | Promise<string>",
                "optional": false,
                "default": "",
                "description": "Function that renders route body HTML.",
                "rest": false
              },
              {
                "name": "fragments",
                "type": "Record<string, FragmentRenderer> | FragmentDefinition[]",
                "optional": true,
                "default": "",
                "description": "Named fragment renderers used by nested fragment slots.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "Route",
          "description": "Normalized route."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L128"
      },
      {
        "name": "createRoutes",
        "signature": "createRoutes(routes) → { all: Route[], match(pathname: string): Route | null }",
        "line": 141,
        "description": "Create a route manifest that can match normalized paths. Exact static routes win first, then parameterized routes are matched in declaration order.",
        "params": [
          {
            "name": "routes",
            "type": "Route[]",
            "optional": false,
            "default": "",
            "description": "Route definitions.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "{ all: Route[], match(pathname: string): Route | null }",
          "description": "Route manifest."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L141"
      },
      {
        "name": "fragmentMeta",
        "signature": "fragmentMeta(meta) → string",
        "line": 167,
        "description": "Render fragment metadata for the browser fragment router.",
        "params": [
          {
            "name": "meta",
            "type": "RouteMeta",
            "optional": false,
            "default": "",
            "description": "Metadata to embed in the fragment response.",
            "rest": false,
            "fields": [
              {
                "name": "title",
                "type": "string",
                "optional": true,
                "default": "",
                "description": "Document title.",
                "rest": false
              },
              {
                "name": "description",
                "type": "string",
                "optional": true,
                "default": "",
                "description": "Meta description.",
                "rest": false
              },
              {
                "name": "canonical",
                "type": "string",
                "optional": true,
                "default": "",
                "description": "Canonical URL.",
                "rest": false
              },
              {
                "name": "alternates",
                "type": "{ hreflang: string, href: string }[]",
                "optional": true,
                "default": "",
                "description": "Alternate language URLs for `<link rel=\"alternate\" hreflang=\"...\">`.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "string",
          "description": "Script tag containing serialized metadata."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L167"
      },
      {
        "name": "renderRoute",
        "signature": "renderRoute(options) → Promise<{ body: string, meta: Required<RouteMeta> }>",
        "line": 180,
        "description": "Render a matched route and normalize metadata defaults.",
        "params": [
          {
            "name": "options",
            "type": "{ match: Route, request: Request, slot?: string | null }",
            "optional": false,
            "default": "",
            "description": "Render options. When `slot` matches `RouteDefinition.fragments`, only that named fragment is rendered.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "Promise<{ body: string, meta: Required<RouteMeta> }>",
          "description": "Rendered route."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L180"
      },
      {
        "name": "renderFragment",
        "signature": "renderFragment(rendered) → string",
        "line": 203,
        "description": "Render a fragment response body with embedded metadata.",
        "params": [
          {
            "name": "rendered",
            "type": "{ body: string, meta: RouteMeta }",
            "optional": false,
            "default": "",
            "description": "Rendered route body and metadata.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "string",
          "description": "Fragment HTML."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L203"
      },
      {
        "name": "notFoundRoute",
        "signature": "notFoundRoute",
        "line": 211,
        "description": "Default 404 route used by adapters when a route is not matched.",
        "params": [],
        "properties": [],
        "returns": null,
        "type": "{Route}",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L211"
      }
    ]
  },
  {
    "file": "src/cloudflare/index.js",
    "module": "@nativefragments/core/cloudflare",
    "title": "Cloudflare Adapter",
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/cloudflare/index.js",
    "types": [
      {
        "name": "Route",
        "description": "",
        "properties": [],
        "type": "import(\"../server/router.js\").Route",
        "line": 81,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/cloudflare/index.js#L81"
      },
      {
        "name": "CloudflareHandlerOptions",
        "description": "",
        "properties": [
          {
            "name": "routes",
            "type": "Route[]",
            "optional": false,
            "default": "",
            "description": "App route definitions.",
            "rest": false
          },
          {
            "name": "shell",
            "type": "(rendered: { body: string, meta: object }) => string",
            "optional": false,
            "default": "",
            "description": "Function that wraps a rendered route body in a full HTML document.",
            "rest": false
          },
          {
            "name": "api",
            "type": "{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response }",
            "optional": true,
            "default": "",
            "description": "Optional Web Standards API router. Hono apps work here because they expose a compatible `fetch` method.",
            "rest": false
          },
          {
            "name": "apiPrefix",
            "type": "string",
            "optional": true,
            "default": "\"/api\"",
            "description": "URL prefix handled by `api`.",
            "rest": false
          },
          {
            "name": "notFound",
            "type": "Route",
            "optional": true,
            "default": "",
            "description": "Optional 404 route.",
            "rest": false
          },
          {
            "name": "assetsBinding",
            "type": "string",
            "optional": true,
            "default": "\"ASSETS\"",
            "description": "Cloudflare assets binding name.",
            "rest": false
          },
          {
            "name": "fragmentManifest",
            "type": "boolean",
            "optional": true,
            "default": "true",
            "description": "Whether to inject a declarative fragment manifest with Cloudflare `HTMLRewriter` when available.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 85,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/cloudflare/index.js#L85"
      }
    ],
    "symbols": [
      {
        "name": "createCloudflareHandler",
        "signature": "createCloudflareHandler(options) → { fetch(request: Request, env: Record<string, unknown>): Promise<Response> }",
        "line": 112,
        "description": "Create a Cloudflare Worker module for a Native Fragments app. Static assets are served from the configured assets binding. Normal document requests render the app shell. Requests with `x-fragment: true` return only the route body plus fragment metadata. Requests under `apiPrefix` are delegated to the optional API router before app route matching.",
        "params": [
          {
            "name": "options",
            "type": "CloudflareHandlerOptions",
            "optional": false,
            "default": "",
            "description": "Worker adapter options.",
            "rest": false,
            "fields": [
              {
                "name": "routes",
                "type": "Route[]",
                "optional": false,
                "default": "",
                "description": "App route definitions.",
                "rest": false
              },
              {
                "name": "shell",
                "type": "(rendered: { body: string, meta: object }) => string",
                "optional": false,
                "default": "",
                "description": "Function that wraps a rendered route body in a full HTML document.",
                "rest": false
              },
              {
                "name": "api",
                "type": "{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response }",
                "optional": true,
                "default": "",
                "description": "Optional Web Standards API router. Hono apps work here because they expose a compatible `fetch` method.",
                "rest": false
              },
              {
                "name": "apiPrefix",
                "type": "string",
                "optional": true,
                "default": "\"/api\"",
                "description": "URL prefix handled by `api`.",
                "rest": false
              },
              {
                "name": "notFound",
                "type": "Route",
                "optional": true,
                "default": "",
                "description": "Optional 404 route.",
                "rest": false
              },
              {
                "name": "assetsBinding",
                "type": "string",
                "optional": true,
                "default": "\"ASSETS\"",
                "description": "Cloudflare assets binding name.",
                "rest": false
              },
              {
                "name": "fragmentManifest",
                "type": "boolean",
                "optional": true,
                "default": "true",
                "description": "Whether to inject a declarative fragment manifest with Cloudflare `HTMLRewriter` when available.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "{ fetch(request: Request, env: Record<string, unknown>): Promise<Response> }",
          "description": "Cloudflare Worker module."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/cloudflare/index.js#L112"
      }
    ]
  },
  {
    "file": "public/nativefragments/router.js",
    "module": "/nativefragments/router.js",
    "title": "Browser Router",
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/router.js",
    "types": [
      {
        "name": "FragmentNavigationOptions",
        "description": "",
        "properties": [
          {
            "name": "slot",
            "type": "string",
            "optional": true,
            "default": "\"#content-slot\"",
            "description": "Selector for the element replaced by fragment responses.",
            "rest": false
          },
          {
            "name": "ttl",
            "type": "number",
            "optional": true,
            "default": "30000",
            "description": "Fragment cache time in milliseconds.",
            "rest": false
          },
          {
            "name": "prefetch",
            "type": "boolean | \"none\" | \"intent\" | \"visible\" | \"load\"",
            "optional": true,
            "default": "\"intent\"",
            "description": "Default fragment prefetch behavior. Links can override this with `data-fragment-prefetch=\"intent|visible|load|none\"`.",
            "rest": false
          },
          {
            "name": "afterNavigate",
            "type": "(event: { meta: object | null, url: URL, slot: string }) => void",
            "optional": true,
            "default": "",
            "description": "Callback fired after a successful client-side navigation.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 287,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/router.js#L287"
      }
    ],
    "symbols": [
      {
        "name": "prefetchFragment",
        "signature": "prefetchFragment(href, options?) → Promise<string | null>",
        "line": 200,
        "description": "Prefetch a same-origin fragment into the shared fragment cache.",
        "params": [
          {
            "name": "href",
            "type": "string | URL",
            "optional": false,
            "default": "",
            "description": "URL to prefetch.",
            "rest": false
          },
          {
            "name": "options",
            "type": "{ slot?: string, ttl?: number, signal?: AbortSignal }",
            "optional": true,
            "default": "{}",
            "description": "Prefetch options.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "Promise<string | null>",
          "description": "Prefetched fragment HTML, or `null` for skipped cross-origin URLs and document-like URLs such as `/agents.txt`."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/router.js#L200"
      },
      {
        "name": "installFragmentNavigation",
        "signature": "installFragmentNavigation(options?) → ((href: string, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined",
        "line": 314,
        "description": "Install same-origin fragment navigation. Clicked links are fetched with `x-fragment: true`, the configured content slot is replaced, document metadata is updated, and history state is pushed. Links with `data-fragment-slot=\"name\"` replace only the matching `[data-fragment-slot=\"name\"]` container and send `x-fragment-slot: name`. External links, document-like URLs such as `/agents.txt`, modified clicks, and links with `data-nativefragments-reload` or `data-fragment-navigation=\"false\"` keep normal browser behavior.",
        "params": [
          {
            "name": "options",
            "type": "FragmentNavigationOptions",
            "optional": true,
            "default": "{}",
            "description": "Navigation options.",
            "rest": false,
            "fields": [
              {
                "name": "slot",
                "type": "string",
                "optional": true,
                "default": "\"#content-slot\"",
                "description": "Selector for the element replaced by fragment responses.",
                "rest": false
              },
              {
                "name": "ttl",
                "type": "number",
                "optional": true,
                "default": "30000",
                "description": "Fragment cache time in milliseconds.",
                "rest": false
              },
              {
                "name": "prefetch",
                "type": "boolean | \"none\" | \"intent\" | \"visible\" | \"load\"",
                "optional": true,
                "default": "\"intent\"",
                "description": "Default fragment prefetch behavior. Links can override this with `data-fragment-prefetch=\"intent|visible|load|none\"`.",
                "rest": false
              },
              {
                "name": "afterNavigate",
                "type": "(event: { meta: object | null, url: URL, slot: string }) => void",
                "optional": true,
                "default": "",
                "description": "Callback fired after a successful client-side navigation.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "((href: string, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined",
          "description": "Navigate function, or `undefined` if the slot does not exist."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/router.js#L314"
      }
    ]
  },
  {
    "file": "public/nativefragments/component.js",
    "module": "/nativefragments/component.js",
    "title": "Shadow DOM Components",
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/component.js",
    "types": [
      {
        "name": "ShadowOptions",
        "description": "",
        "properties": [
          {
            "name": "styles",
            "type": "CSSStyleSheet[]",
            "optional": true,
            "default": "[]",
            "description": "Constructable stylesheets to adopt.",
            "rest": false
          },
          {
            "name": "html",
            "type": "string",
            "optional": true,
            "default": "\"\"",
            "description": "Shadow root HTML.",
            "rest": false
          },
          {
            "name": "hydrate",
            "type": "boolean",
            "optional": true,
            "default": "true",
            "description": "Preserve an existing declarative shadow root on the first render so server-rendered components do not flash.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 13,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/component.js#L13"
      }
    ],
    "symbols": [
      {
        "name": "sheet",
        "signature": "sheet(cssText) → CSSStyleSheet",
        "line": 7,
        "description": "Create a constructable stylesheet for Shadow DOM components.",
        "params": [
          {
            "name": "cssText",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "CSS source.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "CSSStyleSheet",
          "description": "Constructable stylesheet."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/component.js#L7"
      },
      {
        "name": "shadow",
        "signature": "shadow(element, options?) → ShadowRoot",
        "line": 53,
        "description": "Attach or reuse an open shadow root, adopt stylesheets, and set its HTML. If the element already has declarative shadow DOM from server HTML, the first call preserves that DOM by default. Fragment navigation inserts HTML with `template.innerHTML`, so declarative shadow templates are materialized manually before hydration to keep server-rendered components visible.",
        "params": [
          {
            "name": "element",
            "type": "HTMLElement",
            "optional": false,
            "default": "",
            "description": "Custom element receiving the shadow root.",
            "rest": false
          },
          {
            "name": "options",
            "type": "ShadowOptions",
            "optional": true,
            "default": "{}",
            "description": "Shadow render options.",
            "rest": false,
            "fields": [
              {
                "name": "styles",
                "type": "CSSStyleSheet[]",
                "optional": true,
                "default": "[]",
                "description": "Constructable stylesheets to adopt.",
                "rest": false
              },
              {
                "name": "html",
                "type": "string",
                "optional": true,
                "default": "\"\"",
                "description": "Shadow root HTML.",
                "rest": false
              },
              {
                "name": "hydrate",
                "type": "boolean",
                "optional": true,
                "default": "true",
                "description": "Preserve an existing declarative shadow root on the first render so server-rendered components do not flash.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "ShadowRoot",
          "description": "The element's shadow root."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/component.js#L53"
      }
    ]
  },
  {
    "file": "public/nativefragments/worker.js",
    "module": "/nativefragments/worker.js",
    "title": "Web Workers",
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/worker.js",
    "types": [
      {
        "name": "WorkerClientOptions",
        "description": "",
        "properties": [
          {
            "name": "timeout",
            "type": "number",
            "optional": true,
            "default": "30000",
            "description": "Request timeout in milliseconds.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 39,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/worker.js#L39"
      },
      {
        "name": "NativeWorkerClient",
        "description": "",
        "properties": [
          {
            "name": "call",
            "type": "(type: string, payload?: unknown, transfer?: Transferable[]) => Promise<unknown>",
            "optional": false,
            "default": "",
            "description": "Call a named worker handler.",
            "rest": false
          },
          {
            "name": "dispose",
            "type": "() => void",
            "optional": false,
            "default": "",
            "description": "Reject pending calls and remove listeners.",
            "rest": false
          },
          {
            "name": "worker",
            "type": "Worker",
            "optional": false,
            "default": "",
            "description": "The wrapped Worker instance.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 44,
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/worker.js#L44"
      }
    ],
    "symbols": [
      {
        "name": "transferResult",
        "signature": "transferResult(payload, transfer?) → { payload: T, transfer: Transferable[], [transferMarker]: true }",
        "line": 33,
        "description": "Wrap a worker response with Transferable objects.",
        "params": [
          {
            "name": "payload",
            "type": "T",
            "optional": false,
            "default": "",
            "description": "Response payload.",
            "rest": false
          },
          {
            "name": "transfer",
            "type": "Transferable[]",
            "optional": true,
            "default": "[]",
            "description": "Transferable objects to move.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "{ payload: T, transfer: Transferable[], [transferMarker]: true }",
          "description": ""
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/worker.js#L33"
      },
      {
        "name": "workerClient",
        "signature": "workerClient(worker, options?) → NativeWorkerClient",
        "line": 59,
        "description": "Create a tiny RPC client for a dedicated Web Worker.",
        "params": [
          {
            "name": "worker",
            "type": "Worker",
            "optional": false,
            "default": "",
            "description": "Worker instance.",
            "rest": false
          },
          {
            "name": "options",
            "type": "WorkerClientOptions",
            "optional": true,
            "default": "{}",
            "description": "Client options.",
            "rest": false,
            "fields": [
              {
                "name": "timeout",
                "type": "number",
                "optional": true,
                "default": "30000",
                "description": "Request timeout in milliseconds.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "NativeWorkerClient",
          "description": "Worker client."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/worker.js#L59",
        "returnFields": [
          {
            "name": "call",
            "type": "(type: string, payload?: unknown, transfer?: Transferable[]) => Promise<unknown>",
            "optional": false,
            "default": "",
            "description": "Call a named worker handler.",
            "rest": false
          },
          {
            "name": "dispose",
            "type": "() => void",
            "optional": false,
            "default": "",
            "description": "Reject pending calls and remove listeners.",
            "rest": false
          },
          {
            "name": "worker",
            "type": "Worker",
            "optional": false,
            "default": "",
            "description": "The wrapped Worker instance.",
            "rest": false
          }
        ]
      },
      {
        "name": "createWorkerClient",
        "signature": "createWorkerClient(workerOrUrl, options?) → NativeWorkerClient",
        "line": 121,
        "description": "Create a module worker and wrap it with `workerClient`.",
        "params": [
          {
            "name": "workerOrUrl",
            "type": "string | URL | Worker",
            "optional": false,
            "default": "",
            "description": "Existing Worker or worker module URL.",
            "rest": false
          },
          {
            "name": "options",
            "type": "WorkerClientOptions & { workerOptions?: WorkerOptions }",
            "optional": true,
            "default": "{}",
            "description": "Client and Worker constructor options.",
            "rest": false,
            "fields": [
              {
                "name": "timeout",
                "type": "number",
                "optional": true,
                "default": "30000",
                "description": "Request timeout in milliseconds.",
                "rest": false
              },
              {
                "name": "workerOptions",
                "type": "WorkerOptions",
                "optional": true,
                "default": "",
                "description": ""
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "NativeWorkerClient",
          "description": "Worker client."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/worker.js#L121"
      },
      {
        "name": "exposeWorker",
        "signature": "exposeWorker(handlers, scope?) → () => void",
        "line": 139,
        "description": "Expose named handlers inside a dedicated Web Worker.",
        "params": [
          {
            "name": "handlers",
            "type": "Record<string, (payload: unknown, context: { event: MessageEvent, type: string }) => unknown | Promise<unknown>>",
            "optional": false,
            "default": "",
            "description": "Worker handlers keyed by message type.",
            "rest": false
          },
          {
            "name": "scope",
            "type": "DedicatedWorkerGlobalScope",
            "optional": true,
            "default": "globalThis",
            "description": "Worker global scope.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Cleanup function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/public/nativefragments/worker.js#L139"
      }
    ]
  }
];

export const apiTypes = [
  {
    "name": "RawHtml",
    "description": "",
    "properties": [],
    "type": "{ [RAW]: true, value: string }",
    "line": 3,
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L3"
  },
  {
    "name": "HtmlAttrs",
    "description": "",
    "properties": [],
    "type": "Record<string, string | number | boolean | null | undefined>",
    "line": 103,
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/html.js#L103"
  },
  {
    "name": "RouteContext",
    "description": "",
    "properties": [
      {
        "name": "request",
        "type": "Request",
        "optional": false,
        "default": "",
        "description": "Original request.",
        "rest": false
      },
      {
        "name": "url",
        "type": "URL",
        "optional": false,
        "default": "",
        "description": "Parsed request URL.",
        "rest": false
      },
      {
        "name": "params",
        "type": "Record<string, string>",
        "optional": false,
        "default": "",
        "description": "Path parameters captured from a route pattern like `/posts/:slug`.",
        "rest": false
      }
    ],
    "type": "object",
    "line": 3,
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L3"
  },
  {
    "name": "FragmentRenderer",
    "description": "",
    "properties": [],
    "type": "(context: RouteContext) => string | Promise<string>",
    "line": 20,
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L20"
  },
  {
    "name": "Route",
    "description": "",
    "properties": [],
    "type": "RouteDefinition & { path: string, params?: Record<string, string> }",
    "line": 44,
    "source": "https://github.com/somedudeokay/nativefragments/blob/v0.4.1/src/server/router.js#L44"
  }
];
