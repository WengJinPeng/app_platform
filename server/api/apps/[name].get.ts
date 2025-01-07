import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const uploadDir = path.resolve(process.cwd(), config.uploadDir)
  const name = getRouterParam(event, 'name')
  const files = await fs.readdir(uploadDir)
  
  return files
    .filter(f => f.startsWith(name + '_v'))
    .map(f => ({
      filename: f,
      version: parseInt(f.match(/_v(\d+)/)![1])
    }))
    .sort((a, b) => b.version - a.version)
})
