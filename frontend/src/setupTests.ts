// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// Fail if anything written to console.error
const console_error = console.error;
console.error = (message: any) => {
    console_error.apply(console, message); // keep default behaviour
    throw message instanceof Error ? message : new Error(message);
};
