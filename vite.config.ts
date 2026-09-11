import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

const defaultSiteConfig = {
  title: "GovFlow AI — Intelligent Business Approvals",
  description: "Manage licences, registrations, NOCs, inspections, renewals and government incentives from one intelligent platform.",
}

// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // .figma/make/deploy-preview passes `--mode development` for cached-preview builds.
  const emitSourcemaps = mode === 'development'

  return {
    base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [
      react(),
      tailwindcss(),
      figmaSiteConfiguration(defaultSiteConfig),
      apiChatDevPlugin(),
      figmaErrorOverlayReplay(),
      figmaReactRefreshBoundaryFallback(),
      figmaMakeKitPlugin({ storiesGlob: '/src/**/*.stories.{ts,tsx,js,jsx}' }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
      strictPort: true,
      watch: { ignored: ['**/.figma/**'] },
    },
    preview: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
    },
  }
})

/** Local dev middleware proxying /api/chat to Gemini API in vite dev */
function apiChatDevPlugin(): Plugin {
  function getDevFallbackResponse(prompt: string, action: string = 'chat', businessProfile?: any): string {
    const p = (prompt || '').toLowerCase()
    if (action === 'analyze') {
      return `### GovFlow AI Statutory Compliance Analysis
Based on your business profile (${businessProfile?.sector || 'Manufacturing'} in ${businessProfile?.city || 'Sriperumbudur, Tamil Nadu'}), here are the top 5 mandatory approvals required:

1. **Factory Licence (Factories Act 1948)**: Mandatory for manufacturing units employing 10+ workers with power. Department: Directorate of Industrial Safety & Health.
2. **Consent to Establish & Operate (CTE/CTO)**: Required under Water & Air Acts before commissioning. Department: Tamil Nadu Pollution Control Board (TNPCB).
3. **Fire Safety No-Objection Certificate (NOC)**: Mandatory safety clearance for industrial premises. Department: TN Fire & Rescue Services.
4. **Local Authority Trade Licence**: Statutory operating licence for industrial land usage. Department: CMDA / Local Municipality.
5. **MSME Udyam Registration**: Recommended for statutory benefits, priority credit, and government scheme eligibility. Department: Ministry of MSME.`
    }

    if (p.includes('status') || p.includes('approval') || p.includes('my app')) {
      return `Here is the current status of your active applications for **NovaTech Manufacturing Pvt Ltd**:

• **Fire Safety Approval (#GF-2026-1024)**: Inspection Scheduled for Sept 20, 2026. Prepare premises equipment.
• **Pollution Control NOC (#GF-2026-1021)**: Under Review by TNPCB. Query pending — response required within 7 days.
• **Factory Licence (#GF-2026-1018)**: Approved. Valid until May 2027.
• **Local Trade Licence (#GF-2026-1030)**: Documents Required. Please upload 3 missing files.
• **MSME Udyam Registration (#GF-2026-1033)**: Submitted. Expected completion: 7-10 days.`
    }

    if (p.includes('missing') || p.includes('document') || p.includes('file')) {
      return `Here is your document compliance status:

• **Verified (8/12)**: Certificate of Incorporation, PAN Card, GST Certificate, Land Lease, Insurance Policy, etc.
• **Needs Action (2)**: Project Report & Consent to Establish (CTE) require review.
• **Missing Critical Docs (2)**:
  1. *Environmental Impact Assessment (EIA)* — required to unblock Pollution Control NOC.
  2. *Water Source Declaration* — required for Local Trade Licence.

You can upload these directly under the **Documents** section.`
    }

    if (p.includes('renew') || p.includes('fire') || p.includes('expiry')) {
      return `### Upcoming Statutory Renewals Alert:

1. **Fire Safety Certificate**: Due on **September 24, 2026** (14 days remaining). Urgent action required — schedule pre-inspection.
2. **Pollution Control CTO**: Due on **October 12, 2026** (32 days remaining). Renewal window is open.
3. **Factory Licence Renewal**: Due May 2027 (Good standing).

Would you like me to guide you through the Fire Safety renewal checklist?`
    }

    if (p.includes('scheme') || p.includes('subsidy') || p.includes('grant') || p.includes('incentive')) {
      return `### Matched Government Incentive Schemes:

1. **MSME Credit Guarantee Scheme (CGTMSE)** — *94% Match*
   • Benefit: Collateral-free credit up to ₹2 Crore.
2. **Tamil Nadu Capital Subsidy Scheme** — *89% Match*
   • Benefit: Capital investment subsidy up to 25% on eligible fixed assets.
3. **SIPCOT Industrial Park Land Incentive** — *86% Match*
   • Benefit: Subsidized industrial infrastructure in Sriperumbudur zone.

View full eligibility criteria in the **Gov Schemes** tab.`
    }

    if (p.includes('delay') || p.includes('pollution') || p.includes('tnpcb')) {
      return `Your **Pollution Control NOC (#GF-2026-1021)** has been under review for 82 days (exceeding the statutory 45-day SLA).

**Recommended Actions:**
1. Submit response to the department query regarding effluent treatment specs.
2. Upload the missing Environmental Impact Assessment (EIA) document.
3. File a statutory grievance via GovFlow's **Grievances** module if review exceeds 90 days.`
    }

    return `Thank you for your query regarding business compliance. 

As **GovFlow AI Assistant**, I am tracking **NovaTech Manufacturing Pvt Ltd** (Sriperumbudur, Tamil Nadu).

Key Summary:
• **Overall Compliance Health Score**: 92% (Optimal)
• **Immediate Actions**:
  1. Prepare premises for Fire Safety Inspection (Sept 20).
  2. Upload missing Environmental Impact Assessment to clear TNPCB query.
  3. Review 3 matched government incentive schemes.

How else can I assist with your statutory approvals or licences today?`
  }

  return {
    name: 'api-chat-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] === '/api/chat' && req.method === 'POST') {
          let bodyStr = ''
          req.on('data', (chunk) => { bodyStr += chunk })
          req.on('end', async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {}
              const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim()

              if (apiKey && /^AIza[0-9A-Za-z_-]{20,}$/.test(apiKey)) {
                const { action, messages, newMessage, businessProfile } = body
                const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

                const SYSTEM_CONTEXT = `You are GovFlow AI Assistant, an intelligent compliance advisor for Indian businesses.
You help business owners understand government approvals, licences, NOCs, registrations, and compliance requirements.
The current user is managing "NovaTech Manufacturing Pvt Ltd" — a medium-sized manufacturing unit in Sriperumbudur, Tamil Nadu with 150 employees.
Their active applications include: Fire Safety Approval (Inspection Scheduled), Pollution Control NOC (Under Review), Factory Licence (Approved), Local Authority Trade Licence (Documents Required), MSME Udyam Registration (Submitted), Business Registration (Approved).
Be concise, professional, and helpful. Use specific Indian regulatory context. Format responses clearly with bullet points where appropriate. Keep answers under 200 words unless a detailed explanation is needed.`

                let contents = []
                if (action === 'analyze') {
                  const prompt = `Analyze the compliance requirements for this business:
${Object.entries(businessProfile || {}).map(([k, v]) => `${k}: ${v}`).join('\n')}
List the top 5 most critical approvals/licences needed with brief explanations. Be specific to Indian regulations.`
                  contents = [{ role: 'user', parts: [{ text: SYSTEM_CONTEXT + '\n\n' + prompt }] }]
                } else {
                  contents = [
                    { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
                    { role: 'model', parts: [{ text: 'Understood. I am GovFlow AI Assistant, ready to help with compliance and approvals.' }] },
                    ...(Array.isArray(messages) ? messages : []).map((m: any) => ({
                      role: m.role === 'model' ? 'model' : 'user',
                      parts: [{ text: m.text || '' }],
                    })),
                    { role: 'user', parts: [{ text: newMessage || 'Hello' }] },
                  ]
                }

                const geminiRes = await fetch(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents,
                    generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
                  }),
                })

                if (geminiRes.ok) {
                  const data = await geminiRes.json()
                  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
                  if (text) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ text }))
                    return
                  }
                }
              }
            } catch {
              // Fall through to fallback engine
            }

            const body = bodyStr ? JSON.parse(bodyStr || '{}') : {}
            const text = getDevFallbackResponse(body.newMessage || '', body.action, body.businessProfile)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ text }))
          })
        } else {
          next()
        }
      })
    },
  }
}



type FigmaSiteConfiguration = {
  title?: string
  description?: string
  language?: string
  robots?: {
    index?: boolean
  }
  icons?: {
    icon?: string
  }
  openGraph?: {
    image?: string
  }
  analytics?: {
    googleAnalyticsId?: string
  }
  customScripts?: {
    headStart?: string
    headEnd?: string
    bodyStart?: string
    bodyEnd?: string
  }
  accessibility?: {
    addBypassLinks?: boolean
  }
}

/** Applies /.figma/make/site.json to the generated document shell. */
function figmaSiteConfiguration(config: FigmaSiteConfiguration): Plugin {
  function sanitizeHtmlValue(value: string | undefined): string {
    return value?.replace(/[^a-zA-Z0-9_-]/g, '') || ''
  }
  function escapeHtmlText(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  function replaceHtmlCommentSlot(html: string, slotName: string, content: string): string {
    return html.replace(`<!-- ${slotName} -->`, content)
  }

  const title = config.title ?? "Figma Make App"
  const description = config.description ?? ''
  const favicon = config.icons?.icon ?? ''
  const socialImage = config.openGraph?.image ?? ''
  const language = sanitizeHtmlValue(config.language) || 'en'
  const googleAnalyticsId = sanitizeHtmlValue(config.analytics?.googleAnalyticsId)
  const headStart = config.customScripts?.headStart ?? ''
  const headEnd = config.customScripts?.headEnd ?? ''
  const bodyStart = config.customScripts?.bodyStart ?? ''
  const bodyEnd = config.customScripts?.bodyEnd ?? ''
  const robotsTxt = config.robots?.index === false ? 'User-agent: *\nDisallow: /\n' : ''

  return {
    name: 'figma-site-configuration',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!robotsTxt || req.url?.split('?')[0] !== '/robots.txt') return next()

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(robotsTxt)
      })
    },
    generateBundle() {
      if (!robotsTxt) return

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt,
      })
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let result = html
        result = replaceHtmlCommentSlot(result, 'figma:lang', language)
        result = replaceHtmlCommentSlot(result, 'figma:title', escapeHtmlText(title))
        result = replaceHtmlCommentSlot(result, 'figma:head-start', headStart)
        result = replaceHtmlCommentSlot(result, 'figma:head-end', headEnd)
        result = replaceHtmlCommentSlot(result, 'figma:body-start', bodyStart)
        result = replaceHtmlCommentSlot(result, 'figma:body-end', bodyEnd)

        const tags: HtmlTagDescriptor[] = []
        if (description) {
          tags.push({ tag: 'meta', attrs: { name: 'description', content: description }, injectTo: 'head' })
        }
        if (config.robots?.index === false) {
          tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' })
        }
        if (favicon) {
          tags.push({ tag: 'link', attrs: { rel: 'icon', href: favicon }, injectTo: 'head' })
        }
        if (title) {
          tags.push({ tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' })
        }
        if (description) {
          tags.push({ tag: 'meta', attrs: { property: 'og:description', content: description }, injectTo: 'head' })
        }
        if (socialImage) {
          tags.push(
            { tag: 'meta', attrs: { property: 'og:image', content: socialImage }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:image', content: socialImage }, injectTo: 'head' },
          )
        }

        if (googleAnalyticsId) {
          tags.push(
            {
              tag: 'script',
              attrs: {
                async: true,
                src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
              },
              injectTo: 'head',
            },
            {
              tag: 'script',
              children: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', ${JSON.stringify(googleAnalyticsId)});
`,
              injectTo: 'head',
            },
          )
        }

        if (config.accessibility?.addBypassLinks) {
          tags.push(
            {
              tag: 'style',
              children: `
  .figma-bypass-link {
    position: fixed;
    top: 8px;
    left: 8px;
    z-index: 2147483647;
    transform: translateY(-150%);
    border-radius: 6px;
    background: #111827;
    color: #fff;
    padding: 8px 12px;
    font: 600 14px/1.2 system-ui, sans-serif;
    text-decoration: none;
  }
  .figma-bypass-link:focus {
    transform: translateY(0);
  }
`,
              injectTo: 'head',
            },
            {
              tag: 'a',
              attrs: { class: 'figma-bypass-link', href: '#root' },
              children: 'Skip to content',
              injectTo: 'body-prepend',
            },
          )
        }

        return {
          html: result,
          tags,
        }
      },
    },
  }
}

/**
 * Replay the most recent build error to clients that connect after
 * it was first broadcast. Vite buffers an error payload only while
 * no clients are connected and clears the buffer on the first
 * reconnect (see `bufferedMessage` in `createWebSocketServer`), so
 * if the preview iframe reloads after Vite already delivered an
 * error to a live socket, the new socket misses the payload and
 * the overlay stays hidden even though the build is still broken.
 * We intercept `ws.send` to remember the latest error and replay
 * it on every new connection; the cache clears on a successful
 * `update` or `full-reload` so a stale overlay can't survive a
 * fixed build.
 */
function figmaErrorOverlayReplay(): Plugin {
  return {
    name: 'figma-error-overlay-replay',
    apply: 'serve',
    configureServer(server) {
      let lastError: object | null = null

      const origSend = server.ws.send.bind(server.ws) as (...args: any[]) => void
      server.ws.send = ((...args: any[]) => {
        const payload = args[0]
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          const type = (payload as { type?: string }).type
          if (type === 'error') {
            lastError = payload as object
          } else if (type === 'update' || type === 'full-reload') {
            lastError = null
          }
        }
        return origSend(...args)
      }) as typeof server.ws.send

      server.ws.on('connection', (socket) => {
        if (lastError !== null) {
          socket.send(JSON.stringify(lastError))
        }
      })
    },
  }
}

/**
 * Reload when a module that previously defined a React Refresh boundary stops
 * defining one. This happens when an agent moves a component into a new file
 * and replaces the old module with a re-export:
 *
 *   export { default } from './app/App'
 *
 * Vite otherwise accepts the update using the previous module's HMR boundary,
 * but the re-export-only transform no longer registers a replacement for the
 * mounted component family. React reports a successful refresh while leaving
 * the old tree mounted until the page is reloaded.
 */
function figmaReactRefreshBoundaryFallback(): Plugin {
  const hadRefreshBoundary = new Map<string, boolean>()
  let sendFullReload: (() => void) | null = null

  return {
    name: 'figma-react-refresh-boundary-fallback',
    apply: 'serve',
    enforce: 'post',
    configureServer(server) {
      sendFullReload = () => server.ws.send({ type: 'full-reload', path: '*' })
    },
    transform(code, id) {
      if (!/\.[jt]sx?(?:\?|$)/.test(id) || id.includes('/node_modules/')) return null

      const moduleId = id.split('?')[0] ?? id
      const hasRefreshBoundary = code.includes('registerExportsForReactRefresh')
      const previousHadRefreshBoundary = hadRefreshBoundary.get(moduleId)
      hadRefreshBoundary.set(moduleId, hasRefreshBoundary)

      if (previousHadRefreshBoundary && !hasRefreshBoundary) {
        queueMicrotask(() => sendFullReload?.())
      }

      return null
    },
  }
}

/**
 * Serves a blank render-target page at /.figma/make/kit.html that
 * the Figma preview script drives directly. The page exposes a
 * registry of every file matching `storiesGlob` on
 * window.__FIGMA__.stories so the design surface can dynamically
 * import + mount each entry into its own grid view.
 *
 * Dev-only: `apply: 'serve'` gates the plugin to `vite dev`. Prod
 * builds (`vite build`) skip it entirely so the route doesn't leak
 * into shipped bundles.
 */
function figmaMakeKitPlugin(options: { storiesGlob: string | string[] }): Plugin {
  const storiesGlob = Array.isArray(options.storiesGlob) ? options.storiesGlob : [options.storiesGlob]
  const ROUTE = '/.figma/make/kit.html'
  const VIRTUAL_ID = 'virtual:figma-stories'
  const RESOLVED_ID = '\0' + VIRTUAL_ID
  const STORIES_MODULE = `export const stories = import.meta.glob(${JSON.stringify(storiesGlob)})`
  const HTML_BOOTSTRAP = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<div id="figma-make-kit-root"></div>
<script type="module">
  import { stories } from 'virtual:figma-stories'
  window.__FIGMA__ = Object.assign(window.__FIGMA__ ?? {}, { stories })
  window.dispatchEvent(new CustomEvent('figma.ready'))
</script>
</body>
</html>`

  return {
    name: 'figma-make-kit',
    apply: 'serve',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
      return null
    },
    load(id) {
      if (id !== RESOLVED_ID) return null
      return STORIES_MODULE
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (url.split('?')[0] !== ROUTE) return next()

        try {
          res.setHeader('Content-Type', 'text/html')
          res.end(await server.transformIndexHtml(url, HTML_BOOTSTRAP))
        } catch (err) {
          next(err as Error)
        }
      })
    },
  }
}
