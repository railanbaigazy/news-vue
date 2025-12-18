
<template>
  <div class="comment-form-container">
    <h3 class="form-title">Оставить комментарий</h3>

    <form @submit.prevent="handleSubmit" class="comment-form">
      <!-- Имя -->
      <div class="form-group">
        <label for="name" class="form-label">
          Имя <span class="required">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-input"
          :class="{ 'form-input--error': errors.name }"
          placeholder="Введите ваше имя"
          @blur="validateField('name')"
          @input="clearError('name')"
        />
        <transition name="fade">
          <span v-show="errors.name" class="error-message">{{ errors.name }}</span>
        </transition>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label">
          Email <span class="required">*</span>
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          :class="{ 'form-input--error': errors.email }"
          placeholder="your.email@example.com"
          @blur="validateField('email')"
          @input="clearError('email')"
        />
        <transition name="fade">
          <span v-show="errors.email" class="error-message">{{ errors.email }}</span>
        </transition>
      </div>

      <!-- Комментарий -->
      <div class="form-group">
        <label for="comment" class="form-label">
          Комментарий <span class="required">*</span>
        </label>
        <textarea
          id="comment"
          v-model="formData.comment"
          class="form-textarea"
          :class="{ 'form-input--error': errors.comment }"
          placeholder="Напишите ваш комментарий..."
          rows="5"
          @blur="validateField('comment')"
          @input="clearError('comment')"
        ></textarea>
        <div class="char-counter">
          <span :class="{ 'char-counter--warning': formData.comment.length > 500 }">
            {{ formData.comment.length }} / 500 символов
          </span>
        </div>
        <transition name="fade">
          <span v-show="errors.comment" class="error-message">{{ errors.comment }}</span>
        </transition>
      </div>

      <!-- Сообщение об успехе -->
      <transition name="fade">
        <div v-show="showSuccess" class="success-message">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Комментарий успешно отправлен!
        </div>
      </transition>

      <!-- Кнопка отправки -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="isSubmitting || !isFormValid"
        :class="{ 'submit-btn--disabled': isSubmitting || !isFormValid }"
      >
        <span v-show="!isSubmitting">Отправить комментарий</span>
        <span v-show="isSubmitting">Отправка...</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const emit = defineEmits(['submit'])

const formData = reactive({
  name: '',
  email: '',
  comment: '',
})

const errors = reactive({
  name: '',
  email: '',
  comment: '',
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

// Валидация имени
const validateName = (name) => {
  if (!name || name.trim() === '') {
    return 'Имя обязательно для заполнения'
  }
  if (name.trim().length < 2) {
    return 'Имя должно содержать минимум 2 символа'
  }
  if (name.trim().length > 50) {
    return 'Имя не должно превышать 50 символов'
  }
  if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(name.trim())) {
    return 'Имя может содержать только буквы, пробелы и дефисы'
  }
  return ''
}

// Валидация email
const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email обязателен для заполнения'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return 'Введите корректный email адрес'
  }
  return ''
}

// Валидация комментария
const validateComment = (comment) => {
  if (!comment || comment.trim() === '') {
    return 'Комментарий обязателен для заполнения'
  }
  if (comment.trim().length < 10) {
    return 'Комментарий должен содержать минимум 10 символов'
  }
  if (comment.length > 500) {
    return 'Комментарий не должен превышать 500 символов'
  }
  return ''
}

// Валидация отдельного поля
const validateField = (fieldName) => {
  let error = ''
  switch (fieldName) {
    case 'name':
      error = validateName(formData.name)
      break
    case 'email':
      error = validateEmail(formData.email)
      break
    case 'comment':
      error = validateComment(formData.comment)
      break
  }
  errors[fieldName] = error
}

// Очистка ошибки при вводе
const clearError = (fieldName) => {
  if (errors[fieldName]) {
    errors[fieldName] = ''
  }
  showSuccess.value = false
}

// Проверка валидности всей формы
const isFormValid = computed(() => {
  return (
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.comment.trim() !== '' &&
    !errors.name &&
    !errors.email &&
    !errors.comment &&
    formData.comment.length <= 500 &&
    formData.comment.trim().length >= 10
  )
})

// Обработка отправки формы
const handleSubmit = async () => {
  // Валидация всех полей
  validateField('name')
  validateField('email')
  validateField('comment')

  // Если есть ошибки, не отправляем
  if (!isFormValid.value) {
    return
  }

  isSubmitting.value = true

  try {
    // Имитация отправки на сервер
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Эмитим событие с данными формы
    emit('submit', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      comment: formData.comment.trim(),
      timestamp: new Date().toISOString(),
    })

    // Показываем сообщение об успехе
    showSuccess.value = true

    // Очищаем форму
    formData.name = ''
    formData.email = ''
    formData.comment = ''
    errors.name = ''
    errors.email = ''
    errors.comment = ''

    // Скрываем сообщение об успехе через 3 секунды
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Ошибка при отправке комментария:', error)
    alert('Произошла ошибка при отправке комментария. Попробуйте еще раз.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.comment-form-container {
  margin-top: 3rem;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input--error,
.form-textarea--error {
  border-color: #ef4444;
}

.form-input--error:focus,
.form-textarea--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.char-counter {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: -0.25rem;
}

.char-counter--warning {
  color: #ef4444;
  font-weight: 600;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #d1fae5;
  border: 1px solid #10b981;
  border-radius: 0.5rem;
  color: #065f46;
  font-weight: 600;
}

.success-message svg {
  color: #10b981;
  flex-shrink: 0;
}

.submit-btn {
  padding: 0.875rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.submit-btn:hover:not(.submit-btn--disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.submit-btn:active:not(.submit-btn--disabled) {
  transform: translateY(0);
}

.submit-btn--disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 768px) {
  .comment-form-container {
    padding: 1.5rem;
    margin-top: 2rem;
  }

  .form-title {
    font-size: 1.25rem;
  }

  .submit-btn {
    width: 100%;
    align-self: stretch;
  }
}
</style>

