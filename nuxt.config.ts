export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  pages: true,
  nitro: {
    storage: {
      'apps': {
        driver: 'fs',
        base: './uploads'
      }
    }
  },
  runtimeConfig: {
    uploadDir: './uploads', // Move this out of public
    public: {
      // public runtime config here
    }
  }
})
