import Button from './button/index';
import View from './view';
import Text from './text';
import Image from './image';

const components = [Button, Image, View, Text];

components.forEach((component) => {
  if (component.is) {
    window.customElements.define(component.is, component);
  }
});
