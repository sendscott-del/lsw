export const translations = {
  en: {
    // App
    'app.name': 'Steward',
    'app.tagline': 'I have appointed unto you to be stewards... even stewards indeed.',
    'app.taglineRef': 'D&C 104:57',
    'app.loading': 'Loading…',

    // Auth
    'auth.signInTitle': 'Sign in to your account',
    'auth.signUpTitle': 'Create your account',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'At least 6 characters',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.loading': 'Loading…',
    'auth.haveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.accountExists': 'An account with this email already exists. Try signing in instead.',
    'auth.accountCreatedSwitch': 'Account created! Switch to Sign In to continue.',

    // Header menu
    'menu.admin': 'Admin',
    'menu.userGuide': 'User Guide',
    'menu.releaseNotes': 'Release Notes',
    'menu.signOut': 'Sign Out',
    'menu.language': 'Language',
    'menu.languageEnglish': 'English',
    'menu.languageSpanish': 'Español',

    // Bottom tabs
    'tab.work': 'Work',
    'tab.reflect': 'Reflect',
    'tab.notes': 'Notes',

    // Common
    'common.save': 'Save',
    'common.saving': 'Saving…',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.continue': 'Continue',
    'common.required': 'Required',
    'common.optional': '(optional)',
    'common.error': 'Error',
    'common.success': 'Success',
  },

  es: {
    // App
    'app.name': 'Steward',
    'app.tagline': 'Os he señalado para ser mayordomos… mayordomos en verdad.',
    'app.taglineRef': 'D&C 104:57',
    'app.loading': 'Cargando…',

    // Auth
    'auth.signInTitle': 'Inicie sesión en su cuenta',
    'auth.signUpTitle': 'Cree su cuenta',
    'auth.email': 'Correo electrónico',
    'auth.emailPlaceholder': 'usted@ejemplo.com',
    'auth.password': 'Contraseña',
    'auth.passwordPlaceholder': 'Al menos 6 caracteres',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    'auth.loading': 'Cargando…',
    'auth.haveAccount': '¿Ya tiene una cuenta?',
    'auth.noAccount': '¿No tiene una cuenta?',
    'auth.accountExists': 'Ya existe una cuenta con este correo. Intente iniciar sesión.',
    'auth.accountCreatedSwitch': '¡Cuenta creada! Cambie a Iniciar Sesión para continuar.',

    // Header menu
    'menu.admin': 'Administración',
    'menu.userGuide': 'Guía del Usuario',
    'menu.releaseNotes': 'Notas de la Versión',
    'menu.signOut': 'Cerrar Sesión',
    'menu.language': 'Idioma',
    'menu.languageEnglish': 'English',
    'menu.languageSpanish': 'Español',

    // Bottom tabs
    'tab.work': 'Trabajo',
    'tab.reflect': 'Reflexionar',
    'tab.notes': 'Notas',

    // Common
    'common.save': 'Guardar',
    'common.saving': 'Guardando…',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.close': 'Cerrar',
    'common.confirm': 'Confirmar',
    'common.back': 'Volver',
    'common.continue': 'Continuar',
    'common.required': 'Requerido',
    'common.optional': '(opcional)',
    'common.error': 'Error',
    'common.success': 'Éxito',
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
