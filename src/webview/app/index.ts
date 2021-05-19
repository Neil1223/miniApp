import App from './app';
import Body from './body';
import PageHead from './header';
import AppPage from './page';

const components = [App, AppPage, PageHead, Body];

components.forEach((component) => {
  if (component.is) {
    window.customElements.define(component.is, component);
  }
});
