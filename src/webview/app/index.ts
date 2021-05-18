import AppPage from './page';

const components = [AppPage];

components.forEach((component) => {
  if (component.is) {
    console.log('========', component.is);
    window.customElements.define(component.is, component);
  }
});

console.log('执行文件');
