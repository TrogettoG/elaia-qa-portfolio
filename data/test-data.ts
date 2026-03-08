/**
 * Centralized test data — NEVER hardcode these values in test files.
 * All credentials, URLs, and test inputs live here.
 *
 * Architecture notes:
 * - Registration form has NO name field (email + password + confirm only)
 * - App is an SPA: login and register live at '/'
 * - Firebase Authentication backend
 * - After login/register, URL stays at '/' but content changes to dashboard
 */

export const BASE_URL = 'https://v0-elaia.vercel.app/';

export const USERS = {
  /** Unique email per test run — avoids "email already in use" conflicts */
   newUser: {
    email: `${process.env.QA_NEW_USER_PREFIX}+${Date.now()}@mailinator.com`,
    password: 'Test@1234!',
  },
  freeUser: {
    email: process.env.QA_FREE_EMAIL ?? 'qa_free@elaia.test',
    password: process.env.QA_FREE_PASSWORD ?? 'changeme',
  },
  proUser: {
    email: process.env.QA_PRO_EMAIL ?? 'qa_pro@elaia.test',
    password: process.env.QA_PRO_PASSWORD ?? 'changeme',
  },
  invalidUser: {
    email: 'not-an-email',
    password: '123',
  },
  nonExistentUser: {
    email: 'noexiste@elaia.test',
    password: 'Test@1234',
  },
};

export const ROUTES = {
  home: '/',
};

export const TEXTS = {
  welcomeHeading: 'Hola',
  passwordMismatch: 'Las contraseñas no coinciden',
};

export const JOURNAL = {
  entryText: 'Entrada de prueba completa con reflexión del día.',
  mood: 1,
  editedEntryText: 'Texto modificado para prueba de edición.',
  editedMood: 4,
};

export const CHAT = {
  message: 'Hola Elaia, como puedes ayudarme hoy',
};

export const TIMEOUTS = {
  short: 5_000,
  medium: 10_000,
  long: 30_000,
};
