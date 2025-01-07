import { promises as fs } from 'fs'
import path from 'path'
import formidable from 'formidable'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const uploadDir = path.resolve(process.cwd(), config.uploadDir)
  const form = formidable({})
  
  const [fields, files] = await form.parse(event.node.req)
  const file = files.file?.[0]

  const passwordField = fields.password?.[0]
  if (passwordField !== '13579') {
    throw createError({ statusCode: 403, message: 'Invalid password' })
  }
  
  if (!file) {
    throw createError({
      statusCode: 400,
      message: 'No file uploaded'
    })
  }

  const appName = path.parse(file.originalFilename || '').name
  const ext = path.extname(file.originalFilename || '')
  
  const existingFiles = await fs.readdir(uploadDir)
  const versions = existingFiles
    .filter(f => f.startsWith(appName + '_v'))
    .map(f => parseInt(f.match(/_v(\d+)/)![1]))
  
  const nextVersion = versions.length > 0 ? Math.max(...versions) + 1 : 1
  const newFileName = `${appName}_v${nextVersion}${ext}`
  
  await fs.rename(file.filepath, path.join(uploadDir, newFileName))
  
  return { success: true }
})
