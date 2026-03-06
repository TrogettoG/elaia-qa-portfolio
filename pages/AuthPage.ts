import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for authentication screens.
 *
 * Architecture notes (confirmed via MCP exploration 2026-03-03):
 * - App is an SPA — login and register both live at '/'
 * - No name/username field exists in the registration form
 * - Login/Register are toggled via tab buttons at the top
 * - Firebase Authentication backend
 * - After successful register/login the URL stays at '/' but content changes
 */
export class AuthPage {
  readonly page: Page;

  // Inputs
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  // Buttons
  readonly registerTabButton: Locator;
  readonly loginTabButton: Locator;
  readonly createAccountButton: Locator;
  readonly loginSubmitButton: Locator;
  readonly googleAuthButton: Locator;

  // Toggle "Recordar mi sesión" — custom <button type="button"> (login form only)
  readonly rememberMeToggle: Locator;

  // Switch links (bottom of form)
  readonly switchToRegisterLink: Locator;
  readonly switchToLoginLink: Locator;

  // Error / feedback
  readonly passwordMismatchError: Locator;
  /** Generic inline form error (any <p> with error color #FF6B6B) */
  readonly inlineFormError: Locator;
  /** Login-specific error message */
  readonly loginErrorMessage: Locator;
  /** The registration form itself — used to assert the user was NOT redirected */
  readonly registerForm: Locator;

  // Logout / Profile
  readonly profileButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput            = page.locator('input[type="email"]');
    this.passwordInput         = page.locator('input[type="password"]').first();
    this.confirmPasswordInput  = page.locator('input[type="password"]').last();

    this.registerTabButton     = page.locator('button:has-text("Registrarse")').first();
    this.loginTabButton        = page.locator('button:has-text("Iniciar Sesión")').first();
    this.createAccountButton   = page.locator('button:has-text("Crear Cuenta")');
    this.loginSubmitButton     = page.locator('button:has-text("Iniciar Sesión")').nth(1);
    this.googleAuthButton      = page.locator('button:has-text("Continuar con Google")');

    this.rememberMeToggle      = page.locator('button[type="button"].w-5.h-5');

    this.switchToRegisterLink  = page.locator('button:has-text("¿No tienes cuenta?")');
    this.switchToLoginLink     = page.locator('button:has-text("¿Ya tienes cuenta?")');

    this.passwordMismatchError = page.locator('p:has-text("Las contraseñas no coinciden")');
    this.inlineFormError       = page.locator('p.text-sm.text-\\[\\#FF6B6B\\]');
    this.loginErrorMessage     = page.locator('p.text-sm.text-\\[\\#FF6B6B\\]');
    this.registerForm          = page.locator('button:has-text("Crear Cuenta")');

    this.profileButton         = page.getByRole('button', { name: /^[A-Z]$/ });
    this.logoutButton          = page.getByRole('button', { name: 'Cerrar Sesión' });
  }

  async gotoRegister() {
    await this.page.goto('/');
    await this.registerTabButton.click();
  }

  async gotoLogin() {
    await this.page.goto('/');
    // Login tab is active by default — no click needed
  }

  async register(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.createAccountButton.click();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  async logout() {
    await this.profileButton.click();
    await this.logoutButton.click();
  }
}
