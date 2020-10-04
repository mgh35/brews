import each from "jest-each";
import { fetchBrewsFailed, deleteBrewFailed } from "./actions";

describe("fetchBrewsFailed", () => {
    each([
        ["string", "Some error", "Some error"],
        ["Error", new Error("Some Error"), "Some Error"],
    ]).it("handles error of type %s", (description, value, expected) => {
        expect(fetchBrewsFailed(value).error).toEqual(expected);
    });
});

describe("deleteBrewFailed", () => {
    each([
        ["string", "Some error", "Some error"],
        ["Error", new Error("Some Error"), "Some Error"],
    ]).it("handles error of type %s", (description, value, expected) => {
        expect(deleteBrewFailed(value).error).toEqual(expected);
    });
});
