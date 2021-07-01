import Button from './button/index';
import View from './view';
import Image from './image';

const components = [Button, Image, View];

components.forEach((component) => {
  if (component.is) {
    window.customElements.define(component.is, component);
  }
});
