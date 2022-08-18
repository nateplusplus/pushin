export default abstract class PushInBase {
  public container!: HTMLElement;
  public options!: {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    [key: string]: any;
  };

  /**
   * Get the value for an option from either HTML markup or the JavaScript API.
   * Return a string or array of strings.
   */
  getStringOption(name: string): string | string[] {
    let option;
    const attribute = this.getAttributeName(name);
    if (this.container.hasAttribute(attribute)) {
      option = <string>this.container.getAttribute(attribute);
    } else if (typeof this.options[name] === 'string') {
      option = this.options[name];
    } else if (typeof this.options[name] === 'number') {
      // fail-safe in case numbers are passed in
      option = this.options[name].toString();
    } else if (this.options[name]) {
      const type = Object.prototype.toString.call(this.options[name]);
      if (type === '[object Array]') {
        option = <string[]>this.options[name];
      }
    } else {
      option = '';
    }

    // If the string contains commas, convert it into an array
    if (typeof option === 'string' && option.includes(',')) {
      option = option.split(',');
    }

    return option;
  }

  /**
   * Get the value for an option from either HTML markup or the JavaScript API.
   * Returns a number or array of numbers.
   * If nothing found, returns null.
   */
  getNumberOption(name: string): number | number[] | null {
    let option = null;
    const attribute = this.getAttributeName(name);
    if (this.container.hasAttribute(attribute)) {
      option = <string>this.container.getAttribute(attribute);
    } else if (this.options[name]) {
      option = this.options[name];
    }

    if (typeof option === 'string') {
      option = option.split(',').map(val => parseFloat(val));
      option = option.length > 1 ? option : option[0];
    }

    return option;
  }

  /**
   * Get the value for an option from either HTML markup or the JavaScript API.
   * Returns a boolean or array of booleans.
   * If nothing found, returns null.
   */
  getBoolOption(name: string): boolean | boolean[] | null {
    let option = null;
    const attribute = this.getAttributeName(name);
    if (this.container.hasAttribute(attribute)) {
      option = <string>this.container.getAttribute(attribute);
    } else if (this.options[name]) {
      option = this.options[name];
    }

    if (typeof option === 'string') {
      option = option.split(',').map(val => (val === 'false' ? false : !!val));
      option = option.length > 1 ? option : option[0];
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
