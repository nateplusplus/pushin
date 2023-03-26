export default abstract class PushInBase {
  public container?: HTMLElement | null;
  public settings!: {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    [key: string]: any;
  };

  /**
   * Get the value for an option from either HTML markup or the JavaScript API.
   * Return a string or array of strings.
   */
  getStringOption(name: string, container = this.container): string | string[] {
    let option;
    const attribute = this.getAttributeName(name);
    if (container?.hasAttribute(attribute)) {
      option = <string>container.getAttribute(attribute);
    } else if (typeof this.settings[name] === 'string') {
      option = this.settings[name];
    } else if (typeof this.settings[name] === 'number') {
      // fail-safe in case numbers are passed in
      option = this.settings[name].toString();
    } else if (this.settings[name]) {
      const type = Object.prototype.toString.call(this.settings[name]);
      if (type === '[object Array]') {
        option = <string[]>this.settings[name];
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
  getNumberOption(
    name: string,
    container = this.container
  ): number | number[] | null {
    let option = null;
    const attribute = this.getAttributeName(name);
    if (container?.hasAttribute(attribute)) {
      option = <string>container.getAttribute(attribute);
    } else if (this.settings[name]) {
      option = this.settings[name];
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
  getBoolOption(
    name: string,
    container = this.container
  ): boolean | boolean[] | null {
    let option = null;
    const attribute = this.getAttributeName(name);
    if (container?.hasAttribute(attribute)) {
      option = <string>container.getAttribute(attribute);
    } else if (this.settings[name]) {
      option = this.settings[name];
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
