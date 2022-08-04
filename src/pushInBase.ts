export default abstract class PushInBase {
  public container!: HTMLElement;

  /**
   * Get the value for an option from either HTML markup or the JavaScript API
   */
  getOption(
    name: string,
    options: any
  ): string | string[] | number | number[] | boolean | undefined {
    let value;
    const attribute = this.getAttributeName(name);
    if (this.container.hasAttribute(attribute)) {
      value = <string>this.container!.getAttribute(attribute);
      const array = value.split(',');
      if (array.length > 1) {
        value = array;
      }
    } else if (options[name]) {
      value = options[name];
    }

    return value;
  }

  getAttributeName(name: string) {
    const kebabName = name.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      (char, idx) => (idx ? '-' : '') + char.toLowerCase()
    );
    return `data-pushin-${kebabName}`;
  }
}
