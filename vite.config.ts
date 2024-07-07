import { defineConfig, createServer, PluginOption } from 'vite'
import createOtherAppViteConfig from './other-app/create-vite-config'

const port = 9616

function addOtherApp(): PluginOption {
  return {
    name: 'vite-plugin-add-other-app',
    async configureServer(viteDevServer) {
      const otherAppConfig = createOtherAppViteConfig()

      const extendedOtherAppConfig = {
        ...otherAppConfig,
        base: '/anotherApp',
        server: {
          ...(otherAppConfig.server || {}),
          middlewareMode: {
            server: viteDevServer.httpServer,
          },
          hmr: {
            port,
            server: viteDevServer.httpServer,
          },
        },
      }
      const otherAppServer = await createServer(extendedOtherAppConfig)
      viteDevServer.httpServer.on('close', () => {
        otherAppServer.close()
      })
      viteDevServer.middlewares.use('/anotherApp', otherAppServer.middlewares)
    },
  }
}

export default defineConfig(() => {
  return {
    server: {
      port,
      strictPort: true,
    },
    plugins: [addOtherApp()],
  }
})
