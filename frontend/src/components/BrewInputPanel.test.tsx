import React from "react";
import user from "@testing-library/user-event";
import { waitFor, screen } from "@testing-library/dom";
import { act } from "@testing-library/react";
import each from "jest-each";

import { BrewInputPanel } from "./BrewInputPanel";

import { MockBrewsApi } from "testing/apis";
import { render } from "@testing-library/react";
import { createTestUser } from "testing/models";

const expectedFields = [
    { name: "Bean", sampleValue: "Bourbon" },
    { name: "Bean Weight (g)", sampleValue: "12" },
    { name: "Grinder", sampleValue: "Super Grinder XL" },
    { name: "Grind Setting", sampleValue: "25" },
    { name: "Bloom Time (s)", sampleValue: "45" },
    { name: "Brew Time (s)", sampleValue: "181" },
    { name: "Water Weight (g)", sampleValue: "252.4" },
    { name: "Comment", sampleValue: "Yum" },
];

describe("BrewInputPanel", () => {
    const testUser = createTestUser();
    describe("when opened", () => {
        beforeEach(() => {
            render(
                <BrewInputPanel user={testUser} brewsApi={new MockBrewsApi()} />
            );
        });

        each(expectedFields.map((field) => [field.name])).it(
            "has the field %s",
            ([name]) => {
                expect(screen.getByLabelText("Comment")).toBeInTheDocument();
            }
        );

        it("does not have any other Fields", () => {
            expect(screen.queryAllByRole("textbox").length).toEqual(
                expectedFields.length
            );
        });

        it("has a single button labelled Add Brew", () => {
            expect(screen.getByText("Add Brew")).toBeInTheDocument();
        });
    });

    describe("on pressing Add", () => {
        let brewsApi: MockBrewsApi;
        beforeEach(async () => {
            brewsApi = new MockBrewsApi().setCapturePromises(true);
            render(<BrewInputPanel user={testUser} brewsApi={brewsApi} />);
            await act(async () => {
                for (const { name, sampleValue } of expectedFields) {
                    user.type(screen.getByLabelText(name), sampleValue);
                }
                user.click(screen.getByText("Add Brew"));
            });
        });

        it("calls the BrewsApi", async () => {
            expect(brewsApi.addBrewForUser.mock.calls.length).toEqual(1);
        });

        each(expectedFields.map((field) => [field.name, field.sampleValue])).it(
            "retains the input value on field %s",
            (name, sampleValue) => {
                expect(screen.getByLabelText(name).value).toEqual(sampleValue);
            }
        );

        describe("successful return", () => {
            beforeEach(async () => {
                await act(async () => {
                    brewsApi.addBrewForUserHandleNext((resolve) => {
                        resolve(true);
                    });
                });
            });

            each(expectedFields.map((field) => [field.name])).it(
                "clears the input value on field %s",
                (name) => {
                    expect(screen.getByLabelText(name).value).toEqual("");
                }
            );
        });

        describe("failed return", () => {
            beforeEach(async () => {
                await act(async () => {
                    brewsApi.addBrewForUserHandleNext((_, reject) => {
                        reject(Error("Some bad error!"));
                    });
                });
            });

            each(
                expectedFields.map((field) => [field.name, field.sampleValue])
            ).it("retains the input value on field %s", (name, sampleValue) => {
                expect(screen.getByLabelText(name).value).toEqual(sampleValue);
            });

            it("displays the error message", () => {
                expect(
                    screen.queryByText("Some bad error!")
                ).toBeInTheDocument();
            });
        });
    });
});
