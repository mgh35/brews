import each from "jest-each";
import { deleteBrewFailed } from "./actions";

describe("deleteBrewFailed", () => {
    each([
        ["string", "Some error", "Some error"],
        ["Error", new Error("Some Error"), "Some Error"],
    ]).it("handles error of type %s", (description, value, expected) => {
        expect(deleteBrewFailed(value).error).toEqual(expected);
    });
});
