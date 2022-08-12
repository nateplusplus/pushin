export default abstract class PushInBase {
  public container!: HTMLElement;
  public options!: {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    [key: string]: any;
  };

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

  /**
   * Get the value for an option from either HTML markup or the JavaScript API
   */
  getStringOption(name: string): string {
    let value;
    const attribute = this.getAttributeName(name);
    if (this.container.hasAttribute(attribute)) {
      value = <string>this.container!.getAttribute(attribute);
    } else if (typeof this.options[name] === 'string') {
      value = this.options[name];
    } else if (typeof this.options[name] === 'number') {
      // fail-safe in case numbers are passed in
      value = this.options[name].toString();
    }

    return value;
  }

  /**
   * Get the value for an option from either HTML markup or the JavaScript API
   */
  getStringArrayOption(name: string): string[] | [] {
    let option = [] as string[];
    const attribute = this.getAttributeName(name);
    if (this.container.hasAttribute(attribute)) {
      const value = <string>this.container!.getAttribute(attribute);
      option = value.split(',');
    } else if (this.options[name]) {
      const type = Object.prototype.toString.call(this.options[name]);
      if (type === '[object Array]') {
        option = <string[]>this.options[name];
      } else if (typeof this.options[name] === 'string') {
        // if a single string is passed in, return it in an array
        option = [this.options[name]];
      }
    }

    return option;
  }

  /**
   * Get the value for an option from either HTML markup or the JavaScript API
   */
  getNumberOption(name: string): number | null {
    let option = null;
    const attribute = this.getAttributeName(name);
    if (this.container.hasAttribute(attribute)) {
      const value = <string>this.container!.getAttribute(attribute);
      option = parseFloat(value);
    } else if (typeof this.options[name] === 'number') {
      option = this.options[name];
    } else if (typeof this.options[name] === 'string') {
      // fail-safe in case strings are passed in
      option = parseFloat(this.options[name]);
    }

    return option;
  }

  getAttributeName(name: string) {
    const kebabName = name.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      (char, idx) => (idx ? '-' : '') + char.toLowerCase()
    );
    return `data-pushin-${kebabName}`;
  }
}
