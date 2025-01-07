<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">{{ route.params.name }}</h1>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">Available Versions</h2>
        <button 
          @click="enterManageMode"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-200">
          Manage
        </button>
      </div>

      <div v-if="deleteStatus" :class="`mb-4 p-4 rounded-lg ${deleteStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`">
        {{ deleteStatus.message }}
      </div>

      <!-- Show only the latest version if not in manage mode -->
      <div v-if="!isManagerMode">
        <div v-if="versions && versions.length > 0">
          <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-medium text-gray-800">Version {{ versions[0].version }}</h3>
              <p class="text-sm text-gray-600">Filename: {{ versions[0].filename }}</p>
            </div>
            <a :href="`/api/download/${versions[0].filename}`" 
               class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
              Download
            </a>
          </div>
        </div>
        <div v-else>
          <p>No versions found.</p>
        </div>
      </div>

      <!-- Show all versions and delete button if in manage mode -->
      <div v-else>
        <div v-for="version in versions" :key="version.version"
             class="bg-gray-50 rounded-lg p-4 flex items-center justify-between mb-2">
          <div>
            <h3 class="text-xl font-medium text-gray-800">Version {{ version.version }}</h3>
            <p class="text-sm text-gray-600">Filename: {{ version.filename }}</p>
          </div>
          <div class="flex space-x-2">
            <a :href="`/api/download/${version.filename}`" 
               class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
              Download
            </a>
            <button @click="deleteVersion(version.filename)"
                    class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: versions, refresh: refreshVersions } = await useFetch(`/api/apps/${route.params.name}`)
const deleteStatus = ref(null)
const isManagerMode = ref(false)

function enterManageMode() {
  const userPassword = prompt('Enter password to manage:')
  if (userPassword === '13579') {
    isManagerMode.value = true
  } else if (userPassword) {
    alert('Invalid password')
  }
}

async function deleteVersion(filename) {
  if (!confirm('Are you sure you want to delete this version?')) return

  try {
    await $fetch('/api/apps/delete', { 
      method: 'POST',
      body: { filename, password: '13579' }
    })
    deleteStatus.value = { success: true, message: 'Version deleted successfully!' }
    await refreshVersions()
  } catch (error) {
    deleteStatus.value = { success: false, message: 'Delete failed. Please try again.' }
  }
}
</script>
