export const apiSections = [
  {
    "module": "@nativefragments/core/server",
    "title": "Server HTML",
    "file": "packages/core/src/server/html.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js",
    "types": [
      {
        "name": "RawHtml",
        "description": "",
        "properties": [],
        "type": "{ [RAW]: true, value: string }",
        "line": 3,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L3"
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
        "line": 67,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L67"
      },
      {
        "name": "HtmlAttrs",
        "description": "",
        "properties": [],
        "type": "Record<string, string | number | boolean | null | undefined>",
        "line": 106,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L106"
      }
    ],
    "symbols": [
      {
        "name": "raw",
        "signature": "raw(value?) → RawHtml",
        "line": 19,
        "description": "Mark a value as trusted HTML. Use this only for framework-generated markup or content that has already been validated. Ordinary interpolated values in {@link html} are escaped by default.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L19"
      },
      {
        "name": "escapeHtml",
        "signature": "escapeHtml(value) → string",
        "line": 33,
        "description": "Escape a value for safe insertion into HTML text or attribute context.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L33"
      },
      {
        "name": "html",
        "signature": "html(strings, ...values) → string",
        "line": 58,
        "description": "Server-side HTML template tag with escaped interpolation by default. Arrays are flattened, `null`, `undefined`, and `false` become empty strings, and values returned by {@link raw} are inserted as trusted HTML.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L58"
      },
      {
        "name": "declarativeShadow",
        "signature": "declarativeShadow(options?) → RawHtml",
        "line": 87,
        "description": "Render a declarative Shadow DOM template for server-rendered components. Put this as the first child of a custom element to avoid a flash of unstyled light DOM before the component module loads. Pair it with the browser {@link shadow} helper, which preserves an existing declarative shadow root on first upgrade and materializes declarative shadow templates inserted during fragment navigation.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L87"
      },
      {
        "name": "jsonScript",
        "signature": "jsonScript(value) → string",
        "line": 103,
        "description": "Serialize JSON for safe embedding inside an inline script tag. `<` characters are escaped so embedded JSON cannot accidentally terminate the script element.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L103"
      },
      {
        "name": "attrs",
        "signature": "attrs(attributes?) → RawHtml",
        "line": 119,
        "description": "Build escaped HTML attributes from an object. `false`, `null`, and `undefined` values are omitted. `true` values render as boolean attributes.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L119"
      }
    ]
  },
  {
    "module": "@nativefragments/core/server",
    "title": "Server Routing",
    "file": "packages/core/src/server/router.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js",
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
            "name": "signal",
            "type": "AbortSignal",
            "optional": false,
            "default": "",
            "description": "Request cancellation signal.",
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
          },
          {
            "name": "defer",
            "type": "(fragment: FragmentDefinition | string, attributes?: import(\"./html.js\").HtmlAttrs) => import(\"./html.js\").RawHtml",
            "optional": false,
            "default": "",
            "description": "Render a stable loading boundary and collect a named fragment for deferred document streaming.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 3,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L3"
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
        "line": 15,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L15"
      },
      {
        "name": "FragmentRenderer",
        "description": "",
        "properties": [],
        "type": "(context: RouteContext) => string | Promise<string>",
        "line": 24,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L24"
      },
      {
        "name": "FragmentLoadingRenderer",
        "description": "",
        "properties": [],
        "type": "(context: RouteContext) => string",
        "line": 28,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L28"
      },
      {
        "name": "FragmentErrorRenderer",
        "description": "",
        "properties": [],
        "type": "(error: unknown, context: RouteContext) => string | Promise<string>",
        "line": 32,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L32"
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
            "name": "loading",
            "type": "FragmentLoadingRenderer",
            "optional": true,
            "default": "",
            "description": "Loading renderer used by deferred document streaming.",
            "rest": false
          },
          {
            "name": "error",
            "type": "FragmentErrorRenderer",
            "optional": true,
            "default": "",
            "description": "Error renderer used when a deferred fragment fails after the document response has started.",
            "rest": false
          },
          {
            "name": "timeout",
            "type": "number",
            "optional": true,
            "default": "",
            "description": "Maximum deferred render time in milliseconds.",
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
        "line": 36,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L36"
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
            "type": "Record<string, FragmentRenderer | FragmentDefinition> | FragmentDefinition[]",
            "optional": true,
            "default": "",
            "description": "Named fragment renderers used by nested fragment slots.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 51,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L51"
      },
      {
        "name": "Route",
        "description": "",
        "properties": [],
        "type": "RouteDefinition & { path: string, params?: Record<string, string> }",
        "line": 61,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L61"
      }
    ],
    "symbols": [
      {
        "name": "fragment",
        "signature": "fragment(name, definition) → FragmentDefinition",
        "line": 145,
        "description": "Create a named fragment definition. Use this when a route has a nested region with its own navigation. The returned object can be registered in `route(..., { fragments: [item] })` and its attributes can be reused on links and target containers.",
        "private": false,
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
            "name": "definition",
            "type": "FragmentRenderer | Omit<FragmentDefinition, \"name\" | \"attrs\" | \"prefetchAttrs\">",
            "optional": false,
            "default": "",
            "description": "Fragment renderer or full fragment definition.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "FragmentDefinition",
          "description": "Fragment definition."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L145",
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
            "name": "loading",
            "type": "FragmentLoadingRenderer",
            "optional": true,
            "default": "",
            "description": "Loading renderer used by deferred document streaming.",
            "rest": false
          },
          {
            "name": "error",
            "type": "FragmentErrorRenderer",
            "optional": true,
            "default": "",
            "description": "Error renderer used when a deferred fragment fails after the document response has started.",
            "rest": false
          },
          {
            "name": "timeout",
            "type": "number",
            "optional": true,
            "default": "",
            "description": "Maximum deferred render time in milliseconds.",
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
        "line": 170,
        "description": "Create a normalized route definition.",
        "private": false,
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
                "type": "Record<string, FragmentRenderer | FragmentDefinition> | FragmentDefinition[]",
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L170"
      },
      {
        "name": "createRoutes",
        "signature": "createRoutes(routes) → { all: Route[], match(pathname: string): Route | null }",
        "line": 187,
        "description": "Create a route manifest that can match normalized paths. Exact static routes win first, then parameterized routes are matched in declaration order.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L187"
      },
      {
        "name": "fragmentMeta",
        "signature": "fragmentMeta(meta) → string",
        "line": 213,
        "description": "Render fragment metadata for the browser fragment router.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L213"
      },
      {
        "name": "renderRoute",
        "signature": "renderRoute(options) → Promise<{ body: string, meta: Required<RouteMeta>, deferred: unknown[] }>",
        "line": 414,
        "description": "Render a matched route and normalize metadata defaults.",
        "private": false,
        "params": [
          {
            "name": "options",
            "type": "{ match: Route, request: Request, slot?: string | null, deferredTimeout?: number | null }",
            "optional": false,
            "default": "",
            "description": "Render options. When `slot` matches a registered named fragment, only that fragment renderer is used. Calls to `context.defer()` always collect deferred work for the adapter to stream or inline.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "Promise<{ body: string, meta: Required<RouteMeta>, deferred: unknown[] }>",
          "description": "Rendered route."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L414"
      },
      {
        "name": "renderFragment",
        "signature": "renderFragment(rendered) → string",
        "line": 482,
        "description": "Render a fragment response body with embedded metadata.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L482"
      },
      {
        "name": "notFoundRoute",
        "signature": "notFoundRoute",
        "line": 575,
        "description": "Default 404 route used by adapters when a route is not matched.",
        "private": false,
        "params": [],
        "properties": [],
        "returns": null,
        "type": "{Route}",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L575"
      }
    ]
  },
  {
    "module": "@nativefragments/core/cloudflare",
    "title": "Cloudflare Adapter",
    "file": "packages/core/src/cloudflare/index.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/cloudflare/index.js",
    "types": [
      {
        "name": "Route",
        "description": "",
        "properties": [],
        "type": "import(\"../server/router.js\").Route",
        "line": 127,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/cloudflare/index.js#L127"
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
            "type": "(rendered: { body?: string, meta: object, nonce?: string }) => string | { before: string, after: string }",
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
            "name": "deferredTimeout",
            "type": "number | null",
            "optional": true,
            "default": "15000",
            "description": "Default timeout in milliseconds for each deferred fragment renderer. Set `null` to disable.",
            "rest": false
          },
          {
            "name": "contentSecurityPolicy",
            "type": "string | false | ((options: { nonce: string, request: Request }) => string | false)",
            "optional": true,
            "default": "",
            "description": "Content Security Policy header. Defaults to `frame-ancestors 'self'`. Pass a function to build a nonce-based strict policy.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 131,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/cloudflare/index.js#L131"
      }
    ],
    "symbols": [
      {
        "name": "createCloudflareHandler",
        "signature": "createCloudflareHandler(options) → { fetch(request: Request, env: Record<string, unknown>): Promise<Response> }",
        "line": 161,
        "description": "Create a Cloudflare Worker module for a Native Fragments app. Static assets are served from the configured assets binding. Normal document requests render the app shell. Requests with `x-fragment: true` return only the route body plus fragment metadata. Requests under `apiPrefix` are delegated to the optional API router before app route matching.",
        "private": false,
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
                "type": "(rendered: { body?: string, meta: object, nonce?: string }) => string | { before: string, after: string }",
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
                "name": "deferredTimeout",
                "type": "number | null",
                "optional": true,
                "default": "15000",
                "description": "Default timeout in milliseconds for each deferred fragment renderer. Set `null` to disable.",
                "rest": false
              },
              {
                "name": "contentSecurityPolicy",
                "type": "string | false | ((options: { nonce: string, request: Request }) => string | false)",
                "optional": true,
                "default": "",
                "description": "Content Security Policy header. Defaults to `frame-ancestors 'self'`. Pass a function to build a nonce-based strict policy.",
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/cloudflare/index.js#L161"
      }
    ]
  },
  {
    "module": "/nativefragments/router.js",
    "title": "Browser Router",
    "file": "packages/core/public/nativefragments/router.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/router.js",
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
        "line": 266,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/router.js#L266"
      }
    ],
    "symbols": [
      {
        "name": "prefetchFragment",
        "signature": "prefetchFragment(href, options?) → Promise<string | null>",
        "line": 189,
        "description": "Prefetch a same-origin fragment into the shared fragment cache.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/router.js#L189"
      },
      {
        "name": "installFragmentNavigation",
        "signature": "installFragmentNavigation(options?) → ((href: string, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined",
        "line": 293,
        "description": "Install same-origin fragment navigation. Clicked links are fetched with `x-fragment: true`, the configured content slot is replaced, document metadata is updated, and history state is pushed. Links with `data-fragment-slot=\"name\"` replace only the matching `[data-fragment-slot=\"name\"]` container and send `x-fragment-slot: name`. External links, document-like URLs such as `/agents.txt`, modified clicks, and links with `data-nativefragments-reload` or `data-fragment-navigation=\"false\"` keep normal browser behavior.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/router.js#L293"
      }
    ]
  },
  {
    "module": "/nativefragments/component.js",
    "title": "Shadow DOM Components",
    "file": "packages/core/public/nativefragments/component.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/component.js",
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/component.js#L13"
      }
    ],
    "symbols": [
      {
        "name": "sheet",
        "signature": "sheet(cssText) → CSSStyleSheet",
        "line": 7,
        "description": "Create a constructable stylesheet for Shadow DOM components.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/component.js#L7"
      },
      {
        "name": "shadow",
        "signature": "shadow(element, options?) → ShadowRoot",
        "line": 53,
        "description": "Attach or reuse an open shadow root, adopt stylesheets, and set its HTML. If the element already has declarative shadow DOM from server HTML, the first call preserves that DOM by default. Fragment navigation inserts HTML with `template.innerHTML`, so declarative shadow templates are materialized manually before hydration to keep server-rendered components visible.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/component.js#L53"
      }
    ]
  },
  {
    "module": "/nativefragments/worker.js",
    "title": "Web Workers",
    "file": "packages/core/public/nativefragments/worker.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/worker.js",
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/worker.js#L39"
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/worker.js#L44"
      }
    ],
    "symbols": [
      {
        "name": "transferResult",
        "signature": "transferResult(payload, transfer?) → { payload: T, transfer: Transferable[], [transferMarker]: true }",
        "line": 33,
        "description": "Wrap a worker response with Transferable objects.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/worker.js#L33"
      },
      {
        "name": "workerClient",
        "signature": "workerClient(worker, options?) → NativeWorkerClient",
        "line": 59,
        "description": "Create a tiny RPC client for a dedicated Web Worker.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/worker.js#L59",
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
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/worker.js#L121"
      },
      {
        "name": "exposeWorker",
        "signature": "exposeWorker(handlers, scope?) → () => void",
        "line": 139,
        "description": "Expose named handlers inside a dedicated Web Worker.",
        "private": false,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/public/nativefragments/worker.js#L139"
      }
    ]
  },
  {
    "module": "@nativefragments/signals",
    "title": "State",
    "file": "packages/signals/public/nativefragments/signals.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js",
    "types": [],
    "symbols": [
      {
        "name": "state",
        "signature": "state(initial, options?) → Signal.State",
        "line": 44,
        "description": "Create a writable signal. Read it with `.get()` and update it with `.set()`.",
        "private": false,
        "params": [
          {
            "name": "initial",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Initial value.",
            "rest": false
          },
          {
            "name": "options",
            "type": "object",
            "optional": true,
            "default": "",
            "description": "Signal options (custom equality, etc.).",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "Signal.State",
          "description": "A writable signal."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L44"
      },
      {
        "name": "computed",
        "signature": "computed(callback, options?) → Signal.Computed",
        "line": 54,
        "description": "Create a read-only signal derived from other signals. It recomputes lazily when a dependency changes.",
        "private": false,
        "params": [
          {
            "name": "callback",
            "type": "() => unknown",
            "optional": false,
            "default": "",
            "description": "Computation that reads other signals.",
            "rest": false
          },
          {
            "name": "options",
            "type": "object",
            "optional": true,
            "default": "",
            "description": "Signal options.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "Signal.Computed",
          "description": "A derived, read-only signal."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L54"
      },
      {
        "name": "isSignal",
        "signature": "isSignal(value) → boolean",
        "line": 62,
        "description": "Test whether a value is a signal (state or computed).",
        "private": false,
        "params": [
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Value to test.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "boolean",
          "description": "True for a state or computed signal."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L62"
      },
      {
        "name": "read",
        "signature": "read(value) → unknown",
        "line": 73,
        "description": "Resolve a value: call `.get()` on a signal, invoke a function, or return a plain value unchanged. Lets every binding helper accept a signal, a getter, or a static value.",
        "private": false,
        "params": [
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Signal, getter, or plain value.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "unknown",
          "description": "The current value."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L73"
      },
      {
        "name": "effect",
        "signature": "effect(callback) → () => void",
        "line": 87,
        "description": "Run a callback immediately and re-run it whenever a signal it read changes (batched on the microtask queue). Return a function from the callback to run cleanup before the next run.",
        "private": false,
        "params": [
          {
            "name": "callback",
            "type": "() => (void | (() => void))",
            "optional": false,
            "default": "",
            "description": "Effect; may return a cleanup.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Dispose function that stops the effect."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L87"
      },
      {
        "name": "bindText",
        "signature": "bindText(node, value) → () => void",
        "line": 112,
        "description": "Bind a node's text content to a signal.",
        "private": false,
        "params": [
          {
            "name": "node",
            "type": "Node",
            "optional": false,
            "default": "",
            "description": "Target node.",
            "rest": false
          },
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Signal, getter, or value.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Dispose function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L112"
      },
      {
        "name": "bindHTML",
        "signature": "bindHTML(element, value) → () => void",
        "line": 124,
        "description": "Bind an element's `innerHTML` to a signal. Use trusted HTML only.",
        "private": false,
        "params": [
          {
            "name": "element",
            "type": "Element",
            "optional": false,
            "default": "",
            "description": "Target element.",
            "rest": false
          },
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Signal, getter, or value.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Dispose function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L124"
      },
      {
        "name": "bindAttr",
        "signature": "bindAttr(element, name, value) → () => void",
        "line": 138,
        "description": "Bind an attribute to a signal. `false`, `null`, and `undefined` remove the attribute; `true` renders it empty.",
        "private": false,
        "params": [
          {
            "name": "element",
            "type": "Element",
            "optional": false,
            "default": "",
            "description": "Target element.",
            "rest": false
          },
          {
            "name": "name",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Attribute name.",
            "rest": false
          },
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Signal, getter, or value.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Dispose function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L138"
      },
      {
        "name": "bindProperty",
        "signature": "bindProperty(element, property, value) → () => void",
        "line": 156,
        "description": "Bind a DOM property to a signal.",
        "private": false,
        "params": [
          {
            "name": "element",
            "type": "Element",
            "optional": false,
            "default": "",
            "description": "Target element.",
            "rest": false
          },
          {
            "name": "property",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Property name.",
            "rest": false
          },
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Signal, getter, or value.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Dispose function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L156"
      },
      {
        "name": "bindClass",
        "signature": "bindClass(element, name, value) → () => void",
        "line": 169,
        "description": "Toggle a class on an element based on a signal's truthiness.",
        "private": false,
        "params": [
          {
            "name": "element",
            "type": "Element",
            "optional": false,
            "default": "",
            "description": "Target element.",
            "rest": false
          },
          {
            "name": "name",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Class name.",
            "rest": false
          },
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Signal, getter, or value.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Dispose function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L169"
      },
      {
        "name": "bindStyle",
        "signature": "bindStyle(element, name, value) → () => void",
        "line": 183,
        "description": "Bind a style property to a signal. `false`, `null`, and `undefined` remove the property.",
        "private": false,
        "params": [
          {
            "name": "element",
            "type": "Element",
            "optional": false,
            "default": "",
            "description": "Target element.",
            "rest": false
          },
          {
            "name": "name",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "CSS property name.",
            "rest": false
          },
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Signal, getter, or value.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Dispose function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L183"
      },
      {
        "name": "model",
        "signature": "model(element, signal, eventName?) → () => void",
        "line": 202,
        "description": "Two-way bind an input-like element's `value` to a writable signal: the signal drives the element, and the element updates the signal on `eventName`.",
        "private": false,
        "params": [
          {
            "name": "element",
            "type": "HTMLElement",
            "optional": false,
            "default": "",
            "description": "Target element with a `value`.",
            "rest": false
          },
          {
            "name": "signal",
            "type": "Signal.State",
            "optional": false,
            "default": "",
            "description": "Writable signal to sync.",
            "rest": false
          },
          {
            "name": "eventName",
            "type": "string",
            "optional": true,
            "default": "\"input\"",
            "description": "DOM event that updates the signal.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Dispose function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/signals/public/nativefragments/signals.js#L202"
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
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L3"
  },
  {
    "name": "HtmlAttrs",
    "description": "",
    "properties": [],
    "type": "Record<string, string | number | boolean | null | undefined>",
    "line": 106,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L106"
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
        "name": "signal",
        "type": "AbortSignal",
        "optional": false,
        "default": "",
        "description": "Request cancellation signal.",
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
      },
      {
        "name": "defer",
        "type": "(fragment: FragmentDefinition | string, attributes?: import(\"./html.js\").HtmlAttrs) => import(\"./html.js\").RawHtml",
        "optional": false,
        "default": "",
        "description": "Render a stable loading boundary and collect a named fragment for deferred document streaming.",
        "rest": false
      }
    ],
    "type": "object",
    "line": 3,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L3"
  },
  {
    "name": "FragmentRenderer",
    "description": "",
    "properties": [],
    "type": "(context: RouteContext) => string | Promise<string>",
    "line": 24,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L24"
  },
  {
    "name": "FragmentLoadingRenderer",
    "description": "",
    "properties": [],
    "type": "(context: RouteContext) => string",
    "line": 28,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L28"
  },
  {
    "name": "FragmentErrorRenderer",
    "description": "",
    "properties": [],
    "type": "(error: unknown, context: RouteContext) => string | Promise<string>",
    "line": 32,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L32"
  },
  {
    "name": "Route",
    "description": "",
    "properties": [],
    "type": "RouteDefinition & { path: string, params?: Record<string, string> }",
    "line": 61,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L61"
  }
];
