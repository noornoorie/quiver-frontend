import en from '@/locales/en.json'
import de from '@/locales/de.json'
import { createI18n } from "vue-i18n"

export default createI18n({
  locale: 'en',
  messages: { en, de }
})
