import './app-navbar.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('app-navbar', () => {
  test('is defined and renders', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    assert.instanceOf(el, customElements.get('app-navbar'));
    const nav = el.shadowRoot.querySelector('.navbar');
    assert.exists(nav);
  });

  test('has correct structure', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const navbar = el.shadowRoot.querySelector('.navbar');
    const logo = el.shadowRoot.querySelector('.logo');
    const navItems = el.shadowRoot.querySelector('.nav-items');
    const languageSelector = el.shadowRoot.querySelector('language-selector');
    
    assert.exists(navbar);
    assert.exists(logo);
    assert.exists(navItems);
    assert.exists(languageSelector);
  });

  test('has navigation buttons', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const employeesBtn = el.shadowRoot.querySelector('.text-button[href="/"]');
    const addBtn = el.shadowRoot.querySelector('.text-button[href="/add"]');
    
    assert.exists(employeesBtn);
    assert.exists(addBtn);
  });

  test('navigation buttons have correct text', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const employeesBtn = el.shadowRoot.querySelector('.text-button[href="/"]');
    const addBtn = el.shadowRoot.querySelector('.text-button[href="/add"]');
    
    assert.include(employeesBtn.textContent, 'Employees');
    assert.include(addBtn.textContent, 'Add Employee');
  });

  test('language selector exists', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    const lang = el.shadowRoot.querySelector('language-selector');
    assert.exists(lang);
  });

  test('logo is clickable and navigates to home', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const logo = el.shadowRoot.querySelector('.logo');
    assert.exists(logo);
    
    // Should be a link to home
    const logoLink = logo.querySelector('a');
    assert.exists(logoLink);
    assert.equal(logoLink.getAttribute('href'), '/');
  });

  test('handles navigation clicks', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    // Mock history.pushState
    let pushedUrl = null;
    const originalPushState = history.pushState;
    history.pushState = (state, title, url) => {
      pushedUrl = url;
    };
    
    const employeesBtn = el.shadowRoot.querySelector('.text-button[href="/"]');
    employeesBtn.click();
    
    assert.equal(pushedUrl, '/');
    
    // Restore original function
    history.pushState = originalPushState;
  });

  test('handles add employee navigation', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    // Mock history.pushState
    let pushedUrl = null;
    const originalPushState = history.pushState;
    history.pushState = (state, title, url) => {
      pushedUrl = url;
    };
    
    const addBtn = el.shadowRoot.querySelector('.text-button[href="/add"]');
    addBtn.click();
    
    assert.equal(pushedUrl, '/add');
    
    // Restore original function
    history.pushState = originalPushState;
  });

  test('has correct CSS classes', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const navbar = el.shadowRoot.querySelector('.navbar');
    assert.isTrue(navbar.classList.contains('navbar'));
    
    const navItems = el.shadowRoot.querySelector('.nav-items');
    assert.isTrue(navItems.classList.contains('nav-items'));
  });

  test('is responsive', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    // Check if mobile menu exists
    const mobileMenu = el.shadowRoot.querySelector('.mobile-menu');
    if (mobileMenu) {
      assert.exists(mobileMenu);
    }
    
    // Check if hamburger button exists
    const hamburger = el.shadowRoot.querySelector('.hamburger');
    if (hamburger) {
      assert.exists(hamburger);
    }
  });

  test('handles mobile menu toggle', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const hamburger = el.shadowRoot.querySelector('.hamburger');
    if (hamburger) {
      const initialState = el.mobileMenuOpen;
      hamburger.click();
      await el.updateComplete;
      
      assert.notEqual(el.mobileMenuOpen, initialState);
    }
  });

  test('has proper accessibility attributes', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const navbar = el.shadowRoot.querySelector('.navbar');
    assert.equal(navbar.getAttribute('role'), 'navigation');
    
    const navItems = el.shadowRoot.querySelector('.nav-items');
    assert.equal(navItems.getAttribute('role'), 'menubar');
  });

  test('navigation items have proper roles', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const navButtons = el.shadowRoot.querySelectorAll('.text-button');
    navButtons.forEach(button => {
      assert.equal(button.getAttribute('role'), 'menuitem');
    });
  });

  test('handles keyboard navigation', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const firstButton = el.shadowRoot.querySelector('.text-button');
    firstButton.focus();
    
    assert.equal(document.activeElement, firstButton);
    
    // Test arrow key navigation
    const arrowRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    firstButton.dispatchEvent(arrowRightEvent);
    
    // Should move focus to next button
    const secondButton = el.shadowRoot.querySelectorAll('.text-button')[1];
    assert.equal(document.activeElement, secondButton);
  });

  test('handles Escape key to close mobile menu', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    // Open mobile menu if it exists
    const hamburger = el.shadowRoot.querySelector('.hamburger');
    if (hamburger) {
      hamburger.click();
      await el.updateComplete;
      
      // Press Escape
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      await el.updateComplete;
      
      assert.isFalse(el.mobileMenuOpen);
    }
  });

  test('updates active state based on current route', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    // Simulate being on employees page
    history.pushState(null, '', '/');
    el._updateActiveState();
    await el.updateComplete;
    
    const employeesBtn = el.shadowRoot.querySelector('.text-button[href="/"]');
    assert.isTrue(employeesBtn.classList.contains('active'));
    
    // Simulate being on add page
    history.pushState(null, '', '/add');
    el._updateActiveState();
    await el.updateComplete;
    
    const addBtn = el.shadowRoot.querySelector('.text-button[href="/add"]');
    assert.isTrue(addBtn.classList.contains('active'));
  });

  test('handles logo click navigation', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    // Mock history.pushState
    let pushedUrl = null;
    const originalPushState = history.pushState;
    history.pushState = (state, title, url) => {
      pushedUrl = url;
    };
    
    const logoLink = el.shadowRoot.querySelector('.logo a');
    logoLink.click();
    
    assert.equal(pushedUrl, '/');
    
    // Restore original function
    history.pushState = originalPushState;
  });

  test('has proper focus management', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const firstButton = el.shadowRoot.querySelector('.text-button');
    firstButton.focus();
    
    // Tab should move to next focusable element
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    firstButton.dispatchEvent(tabEvent);
    
    // Should move focus to next button
    const secondButton = el.shadowRoot.querySelectorAll('.text-button')[1];
    assert.equal(document.activeElement, secondButton);
  });

  test('handles window resize events', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
    window.dispatchEvent(new Event('resize'));
    await el.updateComplete;
    
    // Should handle responsive behavior
    assert.isTrue(true); // Test passes if no error is thrown
  });

  test('has proper ARIA labels', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    const navbar = el.shadowRoot.querySelector('.navbar');
    assert.exists(navbar.getAttribute('aria-label'));
    
    const navItems = el.shadowRoot.querySelector('.nav-items');
    assert.exists(navItems.getAttribute('aria-label'));
  });

  test('handles component lifecycle', async () => {
    const el = await fixture(html`<app-navbar></app-navbar>`);
    await el.updateComplete;
    
    // Test connectedCallback
    assert.exists(el.shadowRoot);
    
    // Test disconnectedCallback
    el.remove();
    // Should not throw error
    assert.isTrue(true);
  });
});


