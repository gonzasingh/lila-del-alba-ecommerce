// Traduce los códigos de error de Firebase Authentication a mensajes claros para el usuario.
const MENSAJES = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email. Probá iniciar sesión.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/weak-password': 'La contraseña es muy débil: usá al menos 6 caracteres.',
  'auth/missing-password': 'Escribí tu contraseña.',
  // Firebase unifica estos tres casos para no revelar qué emails tienen cuenta
  'auth/invalid-credential': 'El email o la contraseña no son correctos.',
  'auth/user-not-found': 'El email o la contraseña no son correctos.',
  'auth/wrong-password': 'El email o la contraseña no son correctos.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Hubo demasiados intentos. Esperá unos minutos y volvé a probar.',
  'auth/network-request-failed': 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.',
  'auth/operation-not-allowed':
    'El acceso con email y contraseña no está habilitado en Firebase Authentication.',
  'app/firebase-no-configurado': 'La tienda no está conectada a Firebase todavía.',
}

export const mensajeErrorAuth = (error) =>
  MENSAJES[error?.code] ?? 'No pudimos completar la operación. Intentá de nuevo.'
