// Fix: Since @types/react seems to be missing from the environment, this file
// provides a broad definition for JSX.IntrinsicElements to allow all standard HTML tags
// and keeps the specific type for 'ion-icon'. This resolves numerous
// "Property '...' does not exist on type 'JSX.IntrinsicElements'" errors across the app.

declare namespace JSX {
  // Define a generic type for React component props to allow standard attributes like className, etc.
  type ElementProps = {
    [key: string]: any;
  };

  interface IntrinsicElements {
    // Add specific typing for the custom 'ion-icon' element.
    'ion-icon': ElementProps & {
      name: string;
    };
    // Add a broad, catch-all definition for any other JSX tag (div, button, etc.).
    [elemName: string]: ElementProps;
  }
}
