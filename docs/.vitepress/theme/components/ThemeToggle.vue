<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, onMounted } from 'vue'

const { isDark } = useData()
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

function toggle() {
  isDark.value = !isDark.value
}
</script>

<template>
  <ClientOnly>
    <Teleport to=".VPFooter .container" v-if="mounted">
      <div class="theme-toggle-footer-wrapper">
        <button 
          class="theme-toggle-footer" 
          @click="toggle" 
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          aria-label="toggle dark mode"
        >
          <span class="icon">
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </span>
          <span class="text">{{ isDark ? 'Light' : 'Dark' }} Mode</span>
        </button>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.theme-toggle-footer-wrapper {
  order: -1;
}

.theme-toggle-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.25s;
  cursor: pointer;
}

.theme-toggle-footer:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  line-height: 1;
}

@media (min-width: 768px) {
  .theme-toggle-footer-wrapper {
    order: 2;
  }
}
</style>
