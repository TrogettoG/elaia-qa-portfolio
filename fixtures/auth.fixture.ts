import { test as base } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { HomePage } from '../pages/HomePage';
import { USERS } from '../data/test-data';

type AuthFixtures = {
  authPage: AuthPage;
  homePage: HomePage;
  loggedInPage: HomePage;
};

/**
 * Extended test fixtures:
 * - authPage: AuthPage POM instance
 * - homePage: HomePage POM instance
 * - loggedInPage: HomePage pre-authenticated with freeUser
 */
export const test = base.extend<AuthFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loggedInPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);
    await authPage.gotoLogin();
    await authPage.login(USERS.freeUser.email, USERS.freeUser.password);
    await homePage.welcomeHeading.waitFor({ state: 'visible', timeout: 15_000 });
    await use(homePage);
  },
});

export { expect } from '@playwright/test';
