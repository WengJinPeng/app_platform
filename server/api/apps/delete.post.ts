import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const uploadDir = path.resolve(process.cwd(), config.uploadDir)
  const { filename, password } = await readBody(event)

  if (password !== '13579') {
    throw createError({ statusCode: 403, message: 'Invalid password' })
  }

  const filePath = path.join(uploadDir, filename)

  try {
    await fs.access(filePath)
    await fs.unlink(filePath)
    return { success: true, message: 'File deleted successfully' }
  } catch (error) {
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }
})