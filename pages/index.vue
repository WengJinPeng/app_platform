<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">App Distribution Platform</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Upload New App</h2>
      <!-- Add status message -->
      <div v-if="uploadStatus" :class="`mb-4 p-4 rounded-lg ${uploadStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`">
        {{ uploadStatus.message }}
      </div>
      <form @submit.prevent="uploadFile" class="space-y-4">
        <div class="flex items-center space-x-4">
          <input type="file" ref="fileInput" 
                 class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100">
          <input type="password" v-model="password" placeholder="Enter password" class="rounded border px-2 py-1" />
          <button type="submit" 
                  class="bg-blue-600 text-white px-6 py-2 rounded-lg
                         hover:bg-blue-700 transition duration-200">
            Upload
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Available Apps</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(versions, appName) in apps" :key="appName" 
             class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition duration-200">
          <h3 class="text-xl font-medium text-gray-800 mb-2">
            <NuxtLink :to="`/app/${appName}`" class="hover:text-blue-600">
              {{ appName }}
            </NuxtLink>
          </h3>
          <p class="text-sm text-gray-600">
            Latest version: <span class="font-semibold">v{{ Math.max(...versions.map(v => v.version)) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: apps, refresh: refreshApps } = await useFetch('/api/apps')
const fileInput = ref(null)
const uploadStatus = ref(null)
const password = ref('')

async function uploadFile() {
  if (!fileInput.value?.files?.[0]) return
  
  uploadStatus.value = null
  const formData = new FormData()
  formData.append('file', fileInput.value.files[0])
  formData.append('password', password.value)

  try {
    await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    uploadStatus.value = { success: true, message: 'File uploaded successfully!' }
    fileInput.value.value = '' // Clear the input
    await refreshApps() // Use the refresh function from useFetch
  } catch (error) {
    uploadStatus.value = { success: false, message: 'Upload failed. Please try again.' }
  }
}
</script>
