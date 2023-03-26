export default abstract class PushInBase {
    container?: HTMLElement | null;
    settings: {
        [key: string]: any;
    };
    /**
     * Get the value for an option from either HTML markup or the JavaScript API.
     * Return a string or array of strings.
     */
    getStringOption(name: string, container?: HTMLElement | null | undefined): string | string[];
    /**
     * Get the value for an option from either HTML markup or the JavaScript API.
     * Returns a number or array of numbers.
     * If nothing found, returns null.
     */
    getNumberOption(name: string, container?: HTMLElement | null | undefined): number | number[] | null;
    /**
     * Get the value for an option from either HTML markup or the JavaScript API.
     * Returns a boolean or array of booleans.
     * If nothing found, returns null.
     */
    getBoolOption(name: string, container?: HTMLElement | null | undefined): boolean | boolean[] | null;
    getAttributeName(name: string): string;
}
