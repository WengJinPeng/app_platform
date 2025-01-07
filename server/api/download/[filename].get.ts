
import { promises as fs } from 'fs'
import path from 'path'
import { sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const uploadDir = path.resolve(process.cwd(), config.uploadDir)
  const filename = getRouterParam(event, 'filename')
  const filePath = path.join(uploadDir, filename)

  try {
    const fileStream = fs.createReadStream(filePath)
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
    return sendStream(event, fileStream)
  } catch (error) {
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }
})