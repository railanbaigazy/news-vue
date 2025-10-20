<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    :disabled="disabled"
  >
    <component :is="iconComponent" v-if="iconComponent" />
    <span v-if="showText">{{ buttonText }}</span>
    <span v-if="count !== null" class="count">{{ count }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['like', 'share', 'bookmark', 'comment', 'default'].includes(value)
  },
  active: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: null
  },
  showText: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => [
  'action-btn',
  `action-btn--${props.type}`,
  `action-btn--${props.size}`,
  {
    'action-btn--active': props.active,
    'action-btn--disabled': props.disabled
  }
])

const buttonText = computed(() => {
  const texts = {
    like: props.active ? 'Лайкнуто' : 'Лайк',
    share: 'Поделиться',
    bookmark: props.active ? 'В закладках' : 'В закладки',
    comment: 'Комментарии',
    default: 'Действие'
  }
  return texts[props.type] || texts.default
})

const iconComponent = computed(() => {
  const icons = {
    like: LikeIcon,
    share: ShareIcon,
    bookmark: BookmarkIcon,
    comment: CommentIcon,
    default: null
  }
  return icons[props.type] || null
})

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<script>
const LikeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61C20.33 4.1 19.69 3.84 19 3.84C18.31 3.84 17.67 4.1 17.16 4.61L12 9.77L6.84 4.61C6.33 4.1 5.69 3.84 5 3.84C4.31 3.84 3.67 4.1 3.16 4.61C2.65 5.12 2.39 5.76 2.39 6.45C2.39 7.14 2.65 7.78 3.16 8.29L8.29 13.42L3.16 18.55C2.65 19.06 2.39 19.7 2.39 20.39C2.39 21.08 2.65 21.72 3.16 22.23C3.67 22.74 4.31 23 5 23C5.69 23 6.33 22.74 6.84 22.23L12 17.06L17.16 22.23C17.67 22.74 18.31 23 19 23C19.69 23 20.33 22.74 20.84 22.23C21.35 21.72 21.61 21.08 21.61 20.39C21.61 19.7 21.35 19.06 20.84 18.55L15.71 13.42L20.84 8.29C21.35 7.78 21.61 7.14 21.61 6.45C21.61 5.76 21.35 5.12 20.84 4.61Z" fill="currentColor"/>
    </svg>
  `
}

const ShareIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0039 5.24971 15.0114 5.37237L8.01141 9.37237C7.4507 8.90419 6.75736 8.6 6 8.6C4.12231 8.6 2.6 10.1223 2.6 12C2.6 13.8777 4.12231 15.4 6 15.4C6.75736 15.4 7.4507 15.0958 8.01141 14.6276L15.0114 18.6276C15.0039 18.7503 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C17.2426 16 16.5493 16.3042 15.9886 16.7724L8.98859 12.7724C8.99614 12.6497 9 12.5255 9 12.4C9 12.2745 8.99614 12.1503 8.98859 12.0276L15.9886 8.02763C16.5493 8.49581 17.2426 8.8 18 8.8Z" fill="currentColor"/>
    </svg>
  `
}

const BookmarkIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const CommentIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}
</script>

<style scoped>
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.action-btn:hover:not(.action-btn--disabled) {
  background-color: #f9fafb;
  border-color: #3b82f6;
}

.action-btn--active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.action-btn--medium {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

.action-btn--large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.action-btn--like:hover:not(.action-btn--disabled) {
  border-color: #ef4444;
  color: #ef4444;
}

.action-btn--like.action-btn--active {
  background-color: #ef4444;
  border-color: #ef4444;
}

.action-btn--bookmark:hover:not(.action-btn--disabled) {
  border-color: #f59e0b;
  color: #f59e0b;
}

.action-btn--bookmark.action-btn--active {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

.count {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.action-btn--active .count {
  background-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .action-btn {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
  }

  .action-btn span {
    font-size: 0.75rem;
  }
}
</style>
