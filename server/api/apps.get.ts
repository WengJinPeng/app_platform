import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const uploadDir = path.resolve(process.cwd(), config.uploadDir)
  const files = await fs.readdir(uploadDir)
  const apps: Record<string, Array<{version: number, filename: string}>> = {}
  
  files.forEach(file => {
    const match = file.match(/(.+)_v(\d+)/)
    if (match) {
      const [, name, version] = match
      if (!apps[name]) {
        apps[name] = []
      }
      apps[name].push({
        version: parseInt(version),
        filename: file
      })
    }
  })

  return apps
})
