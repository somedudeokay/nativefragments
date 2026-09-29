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
        "type": "{ [RAW]: true, value: string, toString(): string }",
        "line": 3,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L3"
      },
      {
        "name": "HtmlAttrs",
        "description": "",
        "properties": [],
        "type": "Record<string, string | number | boolean | null | undefined>",
        "line": 85,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L85"
      }
    ],
    "symbols": [
      {
        "name": "raw",
        "signature": "raw(value?) → RawHtml",
        "line": 28,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L28"
      },
      {
        "name": "escapeHtml",
        "signature": "escapeHtml(value) → string",
        "line": 39,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L39"
      },
      {
        "name": "html",
        "signature": "html(strings, ...values) → RawHtml",
        "line": 65,
        "description": "Server-side HTML template tag with escaped interpolation by default. Arrays are flattened, `null`, `undefined`, and `false` become empty strings, and trusted values returned by {@link html}, {@link raw}, or {@link attrs} are inserted as HTML without being re-escaped.",
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
          "type": "RawHtml",
          "description": "Rendered HTML wrapper."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L65"
      },
      {
        "name": "jsonScript",
        "signature": "jsonScript(value) → string",
        "line": 82,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L82"
      },
      {
        "name": "attrs",
        "signature": "attrs(attributes?) → RawHtml",
        "line": 100,
        "description": "Build escaped HTML attributes from an object. `false`, `null`, and `undefined` values are omitted. `true` values render as boolean attributes. Attribute names must be valid HTML-like names.",
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L100"
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
            "name": "env",
            "type": "Record<string, unknown>",
            "optional": false,
            "default": "",
            "description": "Runtime bindings for this request.",
            "rest": false
          },
          {
            "name": "context",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Runtime execution context.",
            "rest": false
          },
          {
            "name": "locals",
            "type": "Record<string, unknown>",
            "optional": false,
            "default": "",
            "description": "Application state prepared once per request.",
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
            "name": "query",
            "type": "URLSearchParams",
            "optional": false,
            "default": "",
            "description": "Parsed query parameters from `url.searchParams`.",
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
            "description": "Render a stable loading boundary and collect a named fragment for deferred HTML streaming during document loads and browser fragment navigation.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 5,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L5"
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
        "line": 21,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L21"
      },
      {
        "name": "FragmentRenderer",
        "description": "",
        "properties": [],
        "type": "(context: RouteContext) => string | import(\"./html.js\").RawHtml | Response | Promise<string | import(\"./html.js\").RawHtml | Response>",
        "line": 30,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L30"
      },
      {
        "name": "FragmentLoadingRenderer",
        "description": "",
        "properties": [],
        "type": "(context: RouteContext) => string | import(\"./html.js\").RawHtml",
        "line": 34,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L34"
      },
      {
        "name": "FragmentErrorRenderer",
        "description": "",
        "properties": [],
        "type": "(error: unknown, context: RouteContext) => string | import(\"./html.js\").RawHtml | Promise<string | import(\"./html.js\").RawHtml>",
        "line": 38,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L38"
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
            "description": "Loading renderer used by deferred HTML streaming.",
            "rest": false
          },
          {
            "name": "error",
            "type": "FragmentErrorRenderer",
            "optional": true,
            "default": "",
            "description": "Error renderer used when a deferred fragment fails after its HTML response has started.",
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
        "line": 42,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L42"
      },
      {
        "name": "RouteDefinition",
        "description": "",
        "properties": [
          {
            "name": "meta",
            "type": "(context: RouteContext) => RouteMeta | Response | Promise<RouteMeta | Response>",
            "optional": true,
            "default": "",
            "description": "Function that returns metadata for the route.",
            "rest": false
          },
          {
            "name": "status",
            "type": "number",
            "optional": true,
            "default": "200",
            "description": "Status used for rendered HTML responses.",
            "rest": false
          },
          {
            "name": "headers",
            "type": "Record<string, string> | ((context: RouteContext) => Record<string, string> | Promise<Record<string, string>>)",
            "optional": true,
            "default": "",
            "description": "Headers merged into rendered HTML responses after adapter defaults.",
            "rest": false
          },
          {
            "name": "action",
            "type": "(context: RouteContext) => Response | Promise<Response>",
            "optional": true,
            "default": "",
            "description": "POST handler for no-JavaScript mutations. Must return a native Response, usually a 303 redirect.",
            "rest": false
          },
          {
            "name": "render",
            "type": "(context: RouteContext) => string | import(\"./html.js\").RawHtml | Response | Promise<string | import(\"./html.js\").RawHtml | Response>",
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
        "line": 57,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L57"
      },
      {
        "name": "Route",
        "description": "",
        "properties": [],
        "type": "RouteDefinition & { path: string, params?: Record<string, string> }",
        "line": 73,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L73"
      }
    ],
    "symbols": [
      {
        "name": "fragment",
        "signature": "fragment(name, definition) → FragmentDefinition",
        "line": 185,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L185",
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
            "description": "Loading renderer used by deferred HTML streaming.",
            "rest": false
          },
          {
            "name": "error",
            "type": "FragmentErrorRenderer",
            "optional": true,
            "default": "",
            "description": "Error renderer used when a deferred fragment fails after its HTML response has started.",
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
        "line": 210,
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
                "type": "(context: RouteContext) => RouteMeta | Response | Promise<RouteMeta | Response>",
                "optional": true,
                "default": "",
                "description": "Function that returns metadata for the route.",
                "rest": false
              },
              {
                "name": "status",
                "type": "number",
                "optional": true,
                "default": "200",
                "description": "Status used for rendered HTML responses.",
                "rest": false
              },
              {
                "name": "headers",
                "type": "Record<string, string> | ((context: RouteContext) => Record<string, string> | Promise<Record<string, string>>)",
                "optional": true,
                "default": "",
                "description": "Headers merged into rendered HTML responses after adapter defaults.",
                "rest": false
              },
              {
                "name": "action",
                "type": "(context: RouteContext) => Response | Promise<Response>",
                "optional": true,
                "default": "",
                "description": "POST handler for no-JavaScript mutations. Must return a native Response, usually a 303 redirect.",
                "rest": false
              },
              {
                "name": "render",
                "type": "(context: RouteContext) => string | import(\"./html.js\").RawHtml | Response | Promise<string | import(\"./html.js\").RawHtml | Response>",
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L210"
      },
      {
        "name": "redirect",
        "signature": "redirect(location, status?) → Response",
        "line": 228,
        "description": "Create a redirect response.",
        "private": false,
        "params": [
          {
            "name": "location",
            "type": "string | URL",
            "optional": false,
            "default": "",
            "description": "Redirect destination.",
            "rest": false
          },
          {
            "name": "status",
            "type": "number",
            "optional": true,
            "default": "302",
            "description": "Redirect status.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "Response",
          "description": "Native redirect response."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L228"
      },
      {
        "name": "readSearch",
        "signature": "readSearch(searchParams, defaults) → T",
        "line": 247,
        "description": "Read string query parameters with defaults. Each returned key is `searchParams.get(key)` when it is a non-empty string, otherwise the default value.",
        "private": false,
        "params": [
          {
            "name": "searchParams",
            "type": "URLSearchParams",
            "optional": false,
            "default": "",
            "description": "Query parameters.",
            "rest": false
          },
          {
            "name": "defaults",
            "type": "T",
            "optional": false,
            "default": "",
            "description": "Default values.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "T",
          "description": "Query values merged with defaults."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L247"
      },
      {
        "name": "createRoutes",
        "signature": "createRoutes(routes) → { all: Route[], match(pathname: string): Route | null }",
        "line": 262,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L262"
      },
      {
        "name": "fragmentMeta",
        "signature": "fragmentMeta(meta) → import(\"./html.js\").RawHtml",
        "line": 303,
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
          "type": "import(\"./html.js\").RawHtml",
          "description": "Script tag containing serialized metadata."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L303"
      },
      {
        "name": "renderRoute",
        "signature": "renderRoute(options) → Promise<{ body: string, meta: Required<Pick<RouteMeta, \"title\" | \"description\" | \"canonical\">> & RouteMeta, deferred: unknown[], status: number, headers: Record<string, string>, cancel: (reason?: unknown) => void } | { response: Response }>",
        "line": 317,
        "description": "Render a matched route and normalize metadata defaults.",
        "private": false,
        "params": [
          {
            "name": "options",
            "type": "{ match: Route, request: Request, slot?: string | null, deferredTimeout?: number | null, scope?: import(\"./context.js\").RequestContext }",
            "optional": false,
            "default": "",
            "description": "Render options. When `slot` matches a registered named fragment, only that fragment renderer is used. Calls to `context.defer()` always collect deferred work for the adapter to stream or inline.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "Promise<{ body: string, meta: Required<Pick<RouteMeta, \"title\" | \"description\" | \"canonical\">> & RouteMeta, deferred: unknown[], status: number, headers: Record<string, string>, cancel: (reason?: unknown) => void } | { response: Response }>",
          "description": "Rendered route."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L317"
      },
      {
        "name": "renderFragment",
        "signature": "renderFragment(rendered) → import(\"./html.js\").RawHtml",
        "line": 411,
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
          "type": "import(\"./html.js\").RawHtml",
          "description": "Fragment HTML."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L411"
      },
      {
        "name": "notFoundRoute",
        "signature": "notFoundRoute",
        "line": 419,
        "description": "Default 404 route used by adapters when a route is not matched.",
        "private": false,
        "params": [],
        "properties": [],
        "returns": null,
        "type": "{Route}",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L419"
      },
      {
        "name": "errorRoute",
        "signature": "errorRoute",
        "line": 438,
        "description": "Default 500 route used by adapters when a route render fails.",
        "private": false,
        "params": [],
        "properties": [],
        "returns": null,
        "type": "{Route}",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L438"
      }
    ]
  },
  {
    "module": "@nativefragments/core/server",
    "title": "Server API",
    "file": "packages/core/src/server/api.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/api.js",
    "types": [
      {
        "name": "ApiContext",
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
            "name": "env",
            "type": "Record<string, unknown>",
            "optional": false,
            "default": "",
            "description": "Runtime environment bindings.",
            "rest": false
          },
          {
            "name": "context",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Runtime execution context.",
            "rest": false
          },
          {
            "name": "locals",
            "type": "Record<string, unknown>",
            "optional": false,
            "default": "",
            "description": "Application state prepared once per request.",
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
            "name": "query",
            "type": "URLSearchParams",
            "optional": false,
            "default": "",
            "description": "Parsed query parameters from `url.searchParams`.",
            "rest": false
          },
          {
            "name": "params",
            "type": "Record<string, string>",
            "optional": false,
            "default": "",
            "description": "Path parameters captured from the API route.",
            "rest": false
          },
          {
            "name": "signal",
            "type": "AbortSignal",
            "optional": false,
            "default": "",
            "description": "Request cancellation signal.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 14,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/api.js#L14"
      },
      {
        "name": "ApiHandler",
        "description": "",
        "properties": [],
        "type": "(context: ApiContext) => unknown | Response | Promise<unknown | Response>",
        "line": 26,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/api.js#L26"
      },
      {
        "name": "ApiRoute",
        "description": "",
        "properties": [
          {
            "name": "method",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Upper-case HTTP method.",
            "rest": false
          },
          {
            "name": "path",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Normalized API route path.",
            "rest": false
          },
          {
            "name": "handler",
            "type": "ApiHandler",
            "optional": false,
            "default": "",
            "description": "API route handler.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 30,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/api.js#L30"
      }
    ],
    "symbols": [
      {
        "name": "apiRoute",
        "signature": "apiRoute(method, path, handler) → ApiRoute",
        "line": 48,
        "description": "Create a normalized API route. Paths use the same `:param` and trailing `:rest*` segment syntax as page routes.",
        "private": false,
        "params": [
          {
            "name": "method",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "Upper-case HTTP method.",
            "rest": false
          },
          {
            "name": "path",
            "type": "string",
            "optional": false,
            "default": "",
            "description": "API path pattern.",
            "rest": false
          },
          {
            "name": "handler",
            "type": "ApiHandler",
            "optional": false,
            "default": "",
            "description": "API handler.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "ApiRoute",
          "description": "Normalized API route."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/api.js#L48"
      },
      {
        "name": "createApi",
        "signature": "createApi(routes, options?) → { fetch(request: Request, env?: Record<string, unknown>, context?: unknown, scope?: import(\"./context.js\").RequestContext): Promise<Response> }",
        "line": 97,
        "description": "Create a Fetch-compatible API router.",
        "private": false,
        "params": [
          {
            "name": "routes",
            "type": "ApiRoute[]",
            "optional": false,
            "default": "",
            "description": "API route definitions.",
            "rest": false,
            "fields": [
              {
                "name": "method",
                "type": "string",
                "optional": false,
                "default": "",
                "description": "Upper-case HTTP method.",
                "rest": false
              },
              {
                "name": "path",
                "type": "string",
                "optional": false,
                "default": "",
                "description": "Normalized API route path.",
                "rest": false
              },
              {
                "name": "handler",
                "type": "ApiHandler",
                "optional": false,
                "default": "",
                "description": "API route handler.",
                "rest": false
              }
            ]
          },
          {
            "name": "options",
            "type": "{ onError?: (event: { error: unknown, request: Request, route?: ApiRoute }) => void }",
            "optional": true,
            "default": "{}",
            "description": "API options.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "{ fetch(request: Request, env?: Record<string, unknown>, context?: unknown, scope?: import(\"./context.js\").RequestContext): Promise<Response> }",
          "description": "Fetch-compatible API router."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/api.js#L97"
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
        "line": 246,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/cloudflare/index.js#L246"
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
            "type": "(rendered: { body?: import(\"../server/html.js\").RawHtml, meta: object, nonce?: string }) => string | import(\"../server/html.js\").RawHtml | { before: string | import(\"../server/html.js\").RawHtml, after: string | import(\"../server/html.js\").RawHtml } | Promise<string | import(\"../server/html.js\").RawHtml | { before: string | import(\"../server/html.js\").RawHtml, after: string | import(\"../server/html.js\").RawHtml }>",
            "optional": false,
            "default": "",
            "description": "Function that wraps a rendered route body in a full HTML document.",
            "rest": false
          },
          {
            "name": "api",
            "type": "{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response } | import(\"../server/api.js\").ApiRoute[]",
            "optional": true,
            "default": "",
            "description": "Optional Web Standards API router or array of `apiRoute()` definitions. Hono apps work here because they expose a compatible `fetch` method.",
            "rest": false
          },
          {
            "name": "prepare",
            "type": "(scope: import(\"../server/context.js\").RequestContext) => Record<string, unknown> | Response | Promise<Record<string, unknown> | Response>",
            "optional": true,
            "default": "",
            "description": "Prepare application locals once per request, or return/throw a Response.",
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
            "name": "error",
            "type": "Route",
            "optional": true,
            "default": "",
            "description": "Optional 500 route.",
            "rest": false
          },
          {
            "name": "onError",
            "type": "({ error, request, phase }: { error: unknown, request: Request, phase: \"route\" | \"error-route\" | \"api\" | \"assets\" }) => void",
            "optional": true,
            "default": "",
            "description": "Error hook for caught route, error-route, and API failures.",
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
        "line": 250,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/cloudflare/index.js#L250"
      }
    ],
    "symbols": [
      {
        "name": "createCloudflareHandler",
        "signature": "createCloudflareHandler(options) → { fetch(request: Request, env?: Record<string, unknown>, context?: unknown): Promise<Response> }",
        "line": 286,
        "description": "Create a Cloudflare Worker module for a Native Fragments app. Static assets are served from the configured assets binding. Normal document requests render the app shell. Requests with `x-fragment: true` return the route body plus fragment metadata, using framed HTML streaming when the route has deferred content. Requests under `apiPrefix` are delegated to the optional API router before app route matching.",
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
                "type": "(rendered: { body?: import(\"../server/html.js\").RawHtml, meta: object, nonce?: string }) => string | import(\"../server/html.js\").RawHtml | { before: string | import(\"../server/html.js\").RawHtml, after: string | import(\"../server/html.js\").RawHtml } | Promise<string | import(\"../server/html.js\").RawHtml | { before: string | import(\"../server/html.js\").RawHtml, after: string | import(\"../server/html.js\").RawHtml }>",
                "optional": false,
                "default": "",
                "description": "Function that wraps a rendered route body in a full HTML document.",
                "rest": false
              },
              {
                "name": "api",
                "type": "{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response } | import(\"../server/api.js\").ApiRoute[]",
                "optional": true,
                "default": "",
                "description": "Optional Web Standards API router or array of `apiRoute()` definitions. Hono apps work here because they expose a compatible `fetch` method.",
                "rest": false
              },
              {
                "name": "prepare",
                "type": "(scope: import(\"../server/context.js\").RequestContext) => Record<string, unknown> | Response | Promise<Record<string, unknown> | Response>",
                "optional": true,
                "default": "",
                "description": "Prepare application locals once per request, or return/throw a Response.",
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
                "name": "error",
                "type": "Route",
                "optional": true,
                "default": "",
                "description": "Optional 500 route.",
                "rest": false
              },
              {
                "name": "onError",
                "type": "({ error, request, phase }: { error: unknown, request: Request, phase: \"route\" | \"error-route\" | \"api\" | \"assets\" }) => void",
                "optional": true,
                "default": "",
                "description": "Error hook for caught route, error-route, and API failures.",
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
          "type": "{ fetch(request: Request, env?: Record<string, unknown>, context?: unknown): Promise<Response> }",
          "description": "Cloudflare Worker module."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/cloudflare/index.js#L286"
      }
    ]
  },
  {
    "module": "@nativefragments/core/client/router.js",
    "title": "Browser Router",
    "file": "packages/core/client/router.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js",
    "types": [
      {
        "name": "PrefetchMode",
        "description": "",
        "properties": [],
        "type": "\"none\" | \"intent\" | \"visible\" | \"load\"",
        "line": 279,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L279"
      },
      {
        "name": "FragmentRouterOptions",
        "description": "",
        "properties": [
          {
            "name": "target",
            "type": "string | Element",
            "optional": true,
            "default": "\"#content-slot\"",
            "description": "Primary navigation target.",
            "rest": false
          },
          {
            "name": "cacheTtl",
            "type": "number",
            "optional": true,
            "default": "30000",
            "description": "Maximum completed fragment cache lifetime.",
            "rest": false
          },
          {
            "name": "cacheMaxEntries",
            "type": "number",
            "optional": true,
            "default": "100",
            "description": "Maximum cached response groups (including redirect aliases).",
            "rest": false
          },
          {
            "name": "cacheMaxBytes",
            "type": "number",
            "optional": true,
            "default": "2000000",
            "description": "Maximum retained HTML bytes.",
            "rest": false
          },
          {
            "name": "prefetch",
            "type": "PrefetchMode | boolean",
            "optional": true,
            "default": "\"intent\"",
            "description": "Default automatic prefetch policy.",
            "rest": false
          },
          {
            "name": "viewTransitions",
            "type": "boolean",
            "optional": true,
            "default": "true",
            "description": "Use View Transitions when available.",
            "rest": false
          },
          {
            "name": "signal",
            "type": "AbortSignal",
            "optional": true,
            "default": "",
            "description": "Aborting this signal tears down the router.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 283,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L283"
      },
      {
        "name": "NavigateOptions",
        "description": "",
        "properties": [
          {
            "name": "slot",
            "type": "string",
            "optional": true,
            "default": "",
            "description": "Named fragment target; omit for the primary target.",
            "rest": false
          },
          {
            "name": "history",
            "type": "\"push\" | \"replace\" | \"none\"",
            "optional": true,
            "default": "\"push\"",
            "description": "History behavior.",
            "rest": false
          },
          {
            "name": "signal",
            "type": "AbortSignal",
            "optional": true,
            "default": "",
            "description": "Abort this navigation consumer.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 295,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L295"
      },
      {
        "name": "FragmentRequestOptions",
        "description": "",
        "properties": [
          {
            "name": "slot",
            "type": "string",
            "optional": true,
            "default": "",
            "description": "Named fragment target.",
            "rest": false
          },
          {
            "name": "signal",
            "type": "AbortSignal",
            "optional": true,
            "default": "",
            "description": "Abort this request consumer.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 302,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L302"
      },
      {
        "name": "InvalidateOptions",
        "description": "",
        "properties": [
          {
            "name": "slot",
            "type": "string",
            "optional": true,
            "default": "",
            "description": "Limit invalidation to one named fragment target.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 308,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L308"
      },
      {
        "name": "FragmentRouter",
        "description": "",
        "properties": [
          {
            "name": "navigate",
            "type": "(href: string | URL, options?: NavigateOptions) => Promise<void>",
            "optional": false,
            "default": "",
            "description": "Navigate to a route or named fragment.",
            "rest": false
          },
          {
            "name": "prefetch",
            "type": "(href: string | URL, options?: FragmentRequestOptions) => Promise<void>",
            "optional": false,
            "default": "",
            "description": "Warm a completed fragment in the shared cache.",
            "rest": false
          },
          {
            "name": "invalidate",
            "type": "(href?: string | URL, options?: InvalidateOptions) => void",
            "optional": false,
            "default": "",
            "description": "Drop matching cached and in-flight fragments, or all fragments when omitted.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 313,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L313"
      }
    ],
    "symbols": [
      {
        "name": "startRouter",
        "signature": "startRouter(options?) → Readonly<FragmentRouter>",
        "line": 333,
        "description": "Start document navigation and return a small imperative controller. Links and opted-in GET forms retain their native behavior when JavaScript is unavailable. While active, same-origin navigation is upgraded with streamed HTML fragments, history, metadata, focus, scrolling, and prefetching.",
        "private": false,
        "params": [
          {
            "name": "options",
            "type": "FragmentRouterOptions",
            "optional": true,
            "default": "{}",
            "description": "Router options.",
            "rest": false,
            "fields": [
              {
                "name": "target",
                "type": "string | Element",
                "optional": true,
                "default": "\"#content-slot\"",
                "description": "Primary navigation target.",
                "rest": false
              },
              {
                "name": "cacheTtl",
                "type": "number",
                "optional": true,
                "default": "30000",
                "description": "Maximum completed fragment cache lifetime.",
                "rest": false
              },
              {
                "name": "cacheMaxEntries",
                "type": "number",
                "optional": true,
                "default": "100",
                "description": "Maximum cached response groups (including redirect aliases).",
                "rest": false
              },
              {
                "name": "cacheMaxBytes",
                "type": "number",
                "optional": true,
                "default": "2000000",
                "description": "Maximum retained HTML bytes.",
                "rest": false
              },
              {
                "name": "prefetch",
                "type": "PrefetchMode | boolean",
                "optional": true,
                "default": "\"intent\"",
                "description": "Default automatic prefetch policy.",
                "rest": false
              },
              {
                "name": "viewTransitions",
                "type": "boolean",
                "optional": true,
                "default": "true",
                "description": "Use View Transitions when available.",
                "rest": false
              },
              {
                "name": "signal",
                "type": "AbortSignal",
                "optional": true,
                "default": "",
                "description": "Aborting this signal tears down the router.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "Readonly<FragmentRouter>",
          "description": "Router controller."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L333",
        "returnFields": [
          {
            "name": "navigate",
            "type": "(href: string | URL, options?: NavigateOptions) => Promise<void>",
            "optional": false,
            "default": "",
            "description": "Navigate to a route or named fragment.",
            "rest": false
          },
          {
            "name": "prefetch",
            "type": "(href: string | URL, options?: FragmentRequestOptions) => Promise<void>",
            "optional": false,
            "default": "",
            "description": "Warm a completed fragment in the shared cache.",
            "rest": false
          },
          {
            "name": "invalidate",
            "type": "(href?: string | URL, options?: InvalidateOptions) => void",
            "optional": false,
            "default": "",
            "description": "Drop matching cached and in-flight fragments, or all fragments when omitted.",
            "rest": false
          }
        ]
      }
    ]
  },
  {
    "module": "@nativefragments/core/client/worker.js",
    "title": "Web Workers",
    "file": "packages/core/client/worker.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/worker.js",
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
        "line": 41,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/worker.js#L41"
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
            "description": "Reject pending calls, remove listeners, and terminate workers constructed by `createWorkerClient`.",
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
        "line": 46,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/worker.js#L46"
      },
      {
        "name": "NativeWorkerScope",
        "description": "",
        "properties": [
          {
            "name": "postMessage",
            "type": "(message: unknown, transfer?: Transferable[]) => void",
            "optional": false,
            "default": "",
            "description": "Post a message to the paired thread.",
            "rest": false
          },
          {
            "name": "addEventListener",
            "type": "(type: \"message\", listener: (event: MessageEvent) => void) => void",
            "optional": false,
            "default": "",
            "description": "Register a message listener.",
            "rest": false
          },
          {
            "name": "removeEventListener",
            "type": "(type: \"message\", listener: (event: MessageEvent) => void) => void",
            "optional": false,
            "default": "",
            "description": "Remove a message listener.",
            "rest": false
          }
        ],
        "type": "object",
        "line": 55,
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/worker.js#L55"
      }
    ],
    "symbols": [
      {
        "name": "transferResult",
        "signature": "transferResult(payload, transfer?) → { payload: T, transfer: Transferable[], [transferMarker]: true }",
        "line": 35,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/worker.js#L35"
      },
      {
        "name": "workerClient",
        "signature": "workerClient(worker, options?) → NativeWorkerClient",
        "line": 72,
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
            "type": "WorkerClientOptions & { owned?: boolean }",
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
              },
              {
                "name": "owned",
                "type": "boolean",
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/worker.js#L72",
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
            "description": "Reject pending calls, remove listeners, and terminate workers constructed by `createWorkerClient`.",
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
        "line": 148,
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
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/worker.js#L148"
      },
      {
        "name": "exposeWorker",
        "signature": "exposeWorker(handlers, scope?) → () => void",
        "line": 165,
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
            "type": "NativeWorkerScope",
            "optional": true,
            "default": "globalThis",
            "description": "Worker global scope.",
            "rest": false,
            "fields": [
              {
                "name": "postMessage",
                "type": "(message: unknown, transfer?: Transferable[]) => void",
                "optional": false,
                "default": "",
                "description": "Post a message to the paired thread.",
                "rest": false
              },
              {
                "name": "addEventListener",
                "type": "(type: \"message\", listener: (event: MessageEvent) => void) => void",
                "optional": false,
                "default": "",
                "description": "Register a message listener.",
                "rest": false
              },
              {
                "name": "removeEventListener",
                "type": "(type: \"message\", listener: (event: MessageEvent) => void) => void",
                "optional": false,
                "default": "",
                "description": "Remove a message listener.",
                "rest": false
              }
            ]
          }
        ],
        "properties": [],
        "returns": {
          "type": "() => void",
          "description": "Cleanup function."
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/worker.js#L165"
      }
    ]
  },
  {
    "module": "@nativefragments/lit/server",
    "title": "Lit SSR",
    "file": "packages/lit/server.js",
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/lit/server.js",
    "types": [],
    "symbols": [
      {
        "name": "renderLit",
        "signature": "renderLit(value) → Promise<import(\"@nativefragments/core/server\").RawHtml>",
        "line": 14,
        "description": "Render a Lit template or component tree to trusted server HTML. Component modules must be imported by the Worker so their custom element definitions are registered in Lit's server DOM shim.",
        "private": false,
        "params": [
          {
            "name": "value",
            "type": "unknown",
            "optional": false,
            "default": "",
            "description": "Lit template value to render.",
            "rest": false
          }
        ],
        "properties": [],
        "returns": {
          "type": "Promise<import(\"@nativefragments/core/server\").RawHtml>",
          "description": ""
        },
        "type": "",
        "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/lit/server.js#L14"
      }
    ]
  }
];

export const apiTypes = [
  {
    "name": "RawHtml",
    "description": "",
    "properties": [],
    "type": "{ [RAW]: true, value: string, toString(): string }",
    "line": 3,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L3"
  },
  {
    "name": "HtmlAttrs",
    "description": "",
    "properties": [],
    "type": "Record<string, string | number | boolean | null | undefined>",
    "line": 85,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/html.js#L85"
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
        "name": "env",
        "type": "Record<string, unknown>",
        "optional": false,
        "default": "",
        "description": "Runtime bindings for this request.",
        "rest": false
      },
      {
        "name": "context",
        "type": "unknown",
        "optional": false,
        "default": "",
        "description": "Runtime execution context.",
        "rest": false
      },
      {
        "name": "locals",
        "type": "Record<string, unknown>",
        "optional": false,
        "default": "",
        "description": "Application state prepared once per request.",
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
        "name": "query",
        "type": "URLSearchParams",
        "optional": false,
        "default": "",
        "description": "Parsed query parameters from `url.searchParams`.",
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
        "description": "Render a stable loading boundary and collect a named fragment for deferred HTML streaming during document loads and browser fragment navigation.",
        "rest": false
      }
    ],
    "type": "object",
    "line": 5,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L5"
  },
  {
    "name": "FragmentRenderer",
    "description": "",
    "properties": [],
    "type": "(context: RouteContext) => string | import(\"./html.js\").RawHtml | Response | Promise<string | import(\"./html.js\").RawHtml | Response>",
    "line": 30,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L30"
  },
  {
    "name": "FragmentLoadingRenderer",
    "description": "",
    "properties": [],
    "type": "(context: RouteContext) => string | import(\"./html.js\").RawHtml",
    "line": 34,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L34"
  },
  {
    "name": "FragmentErrorRenderer",
    "description": "",
    "properties": [],
    "type": "(error: unknown, context: RouteContext) => string | import(\"./html.js\").RawHtml | Promise<string | import(\"./html.js\").RawHtml>",
    "line": 38,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L38"
  },
  {
    "name": "Route",
    "description": "",
    "properties": [],
    "type": "RouteDefinition & { path: string, params?: Record<string, string> }",
    "line": 73,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/router.js#L73"
  },
  {
    "name": "ApiContext",
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
        "name": "env",
        "type": "Record<string, unknown>",
        "optional": false,
        "default": "",
        "description": "Runtime environment bindings.",
        "rest": false
      },
      {
        "name": "context",
        "type": "unknown",
        "optional": false,
        "default": "",
        "description": "Runtime execution context.",
        "rest": false
      },
      {
        "name": "locals",
        "type": "Record<string, unknown>",
        "optional": false,
        "default": "",
        "description": "Application state prepared once per request.",
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
        "name": "query",
        "type": "URLSearchParams",
        "optional": false,
        "default": "",
        "description": "Parsed query parameters from `url.searchParams`.",
        "rest": false
      },
      {
        "name": "params",
        "type": "Record<string, string>",
        "optional": false,
        "default": "",
        "description": "Path parameters captured from the API route.",
        "rest": false
      },
      {
        "name": "signal",
        "type": "AbortSignal",
        "optional": false,
        "default": "",
        "description": "Request cancellation signal.",
        "rest": false
      }
    ],
    "type": "object",
    "line": 14,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/api.js#L14"
  },
  {
    "name": "ApiHandler",
    "description": "",
    "properties": [],
    "type": "(context: ApiContext) => unknown | Response | Promise<unknown | Response>",
    "line": 26,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/src/server/api.js#L26"
  },
  {
    "name": "PrefetchMode",
    "description": "",
    "properties": [],
    "type": "\"none\" | \"intent\" | \"visible\" | \"load\"",
    "line": 279,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L279"
  },
  {
    "name": "NavigateOptions",
    "description": "",
    "properties": [
      {
        "name": "slot",
        "type": "string",
        "optional": true,
        "default": "",
        "description": "Named fragment target; omit for the primary target.",
        "rest": false
      },
      {
        "name": "history",
        "type": "\"push\" | \"replace\" | \"none\"",
        "optional": true,
        "default": "\"push\"",
        "description": "History behavior.",
        "rest": false
      },
      {
        "name": "signal",
        "type": "AbortSignal",
        "optional": true,
        "default": "",
        "description": "Abort this navigation consumer.",
        "rest": false
      }
    ],
    "type": "object",
    "line": 295,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L295"
  },
  {
    "name": "FragmentRequestOptions",
    "description": "",
    "properties": [
      {
        "name": "slot",
        "type": "string",
        "optional": true,
        "default": "",
        "description": "Named fragment target.",
        "rest": false
      },
      {
        "name": "signal",
        "type": "AbortSignal",
        "optional": true,
        "default": "",
        "description": "Abort this request consumer.",
        "rest": false
      }
    ],
    "type": "object",
    "line": 302,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L302"
  },
  {
    "name": "InvalidateOptions",
    "description": "",
    "properties": [
      {
        "name": "slot",
        "type": "string",
        "optional": true,
        "default": "",
        "description": "Limit invalidation to one named fragment target.",
        "rest": false
      }
    ],
    "type": "object",
    "line": 308,
    "source": "https://github.com/somedudeokay/nativefragments/blob/main/packages/core/client/router.js#L308"
  }
];
