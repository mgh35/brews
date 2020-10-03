import React from "react";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";
import each from "jest-each";

import { BrewInputPanel } from "./BrewInputPanel";

import { MockBrewsApi } from "testing/apis";
import { render } from "@testing-library/react";
import { createTestUser } from "testing/models";
import Brew, { BrewBuilder } from "models/Brew";

const expectedFields = {
    bean: { name: "Bean", sampleValue: "Bourbon", takeFromModel: true },
    beanWeightInGrams: {
        name: "Bean Weight (g)",
        sampleValue: "12",
        takeFromModel: false,
    },
    grinder: {
        name: "Grinder",
        sampleValue: "Super Grinder XL",
        takeFromModel: true,
    },
    grindSetting: {
        name: "Grind Setting",
        sampleValue: "25",
        takeFromModel: true,
    },
    bloomTimeInSeconds: {
        name: "Bloom Time (s)",
        sampleValue: "45",
        takeFromModel: false,
    },
    brewTimeInSeconds: {
        name: "Brew Time (s)",
        sampleValue: "181",
        takeFromModel: false,
    },
    waterWeightInGrams: {
        name: "Water Weight (g)",
        sampleValue: "252.4",
        takeFromModel: false,
    },
    comment: { name: "Comment", sampleValue: "Yum", takeFromModel: false },
};

describe("BrewInputPanel", () => {
    const testUser = createTestUser();

    describe("when opened", () => {
        beforeEach(() => {
            render(
                <BrewInputPanel user={testUser} brewsApi={new MockBrewsApi()} />
            );
        });

        each(
            Object.entries(expectedFields).map(([fieldId, field]) => [
                fieldId,
                field.name,
                field.takeFromModel,
            ])
        ).describe("field %s", (fieldId, name, takeFromModel) => {
            let field: HTMLElement;
            beforeEach(() => {
                field = screen.getByLabelText(name);
            });

            it("exists", () => {
                expect(field).toBeInTheDocument();
            });

            it("has empty initial value", () => {
                expect(field.value).toEqual("");
            });
        });

        it("does not have any other Fields", () => {
            expect(screen.queryAllByRole("textbox").length).toEqual(
                Object.keys(expectedFields).length
            );
        });

        it("has a single button labelled Add Brew", () => {
            expect(screen.getByText("Add Brew")).toBeInTheDocument();
        });
    });

    describe("on pressing Add", () => {
        let brewsApi: MockBrewsApi;
        let addBrewButton: HTMLElement;
        beforeEach(async () => {
            brewsApi = new MockBrewsApi().setCapturePromises(true);
            render(<BrewInputPanel user={testUser} brewsApi={brewsApi} />);
            addBrewButton = screen.getByText("Add Brew");
            await act(async () => {
                for (const { name, sampleValue } of Object.values(
                    expectedFields
                )) {
                    user.type(screen.getByLabelText(name), sampleValue);
                }
                user.click(addBrewButton);
                await waitFor(() => {
                    expect(addBrewButton).toBeDisabled();
                });
            });
        });

        it("calls the BrewsApi", async () => {
            expect(brewsApi.addBrewForUser.mock.calls.length).toEqual(1);
        });

        each(
            Object.values(expectedFields).map((field) => [
                field.name,
                field.sampleValue,
            ])
        ).describe("field %s", (name, sampleValue) => {
            it("retains the input value", () => {
                expect(screen.getByLabelText(name).value).toEqual(sampleValue);
            });

            it("is disabled", async () => {
                expect(screen.getByLabelText(name)).toBeDisabled();
            });
        });

        describe("successful return", () => {
            beforeEach(async () => {
                await act(async () => {
                    brewsApi.addBrewForUserHandleNext((resolve) => {
                        resolve(true);
                    });
                    await waitFor(() => {
                        expect(addBrewButton).not.toBeDisabled();
                    });
                });
            });

            each(
                Object.values(expectedFields).map((field) => [field.name])
            ).describe("field %s", (name) => {
                it("is enabled", () => {
                    expect(screen.getByLabelText(name)).not.toBeDisabled();
                });

                it("is cleared out", () => {
                    expect(screen.getByLabelText(name).value).toEqual("");
                });
            });
        });

        describe("failed return", () => {
            beforeEach(async () => {
                await act(async () => {
                    brewsApi.addBrewForUserHandleNext((_, reject) => {
                        reject(Error("Some bad error!"));
                    });
                    await waitFor(() => {
                        expect(addBrewButton).not.toBeDisabled();
                    });
                });
            });

            each(
                Object.values(expectedFields).map((field) => [
                    field.name,
                    field.sampleValue,
                ])
            ).describe("field %s", (name, sampleValue) => {
                it("is enabled", () => {
                    expect(screen.getByLabelText(name)).not.toBeDisabled();
                });

                it("retains the input value", () => {
                    expect(screen.getByLabelText(name).value).toEqual(
                        sampleValue
                    );
                });
            });

            it("displays the error message", () => {
                expect(
                    screen.queryByText("Some bad error!")
                ).toBeInTheDocument();
            });
        });
    });

    each([
        ["Bean Weight (g)", "12g"],
        ["Grind Setting", "10.4"],
        ["Bloom Time (s)", "45s"],
        ["Brew Time (s)", "-200"],
        ["Water Weight (g)", "many"],
    ]).describe("with invalid values in %s", (fieldName, invalidValue) => {
        let brewsApi: MockBrewsApi;
        let field: HTMLElement;
        beforeEach(async () => {
            brewsApi = new MockBrewsApi();
            render(<BrewInputPanel user={testUser} brewsApi={brewsApi} />);
            field = screen.getByLabelText(fieldName);
            await act(async () => {
                user.type(field, invalidValue);
            });
            await act(async () => {
                user.type(
                    screen.getByLabelText("Comment"),
                    "Clicking somewhere else"
                );
            });
        });

        it("to be flagged invalid", () => {
            expect(field).toHaveClass("is-invalid");
        });

        it("shows an error message", () => {
            expect(
                field.parentElement!.querySelector(".invalid-feedback")
            ).toBeInTheDocument();
        });

        describe("on pressing add", () => {
            beforeEach(async () => {
                await act(async () => {
                    user.click(screen.getByText("Add Brew"));
                });
            });

            it("does not call the add brew API", () => {
                expect(brewsApi.hasBeenCalled()).toBeFalsy();
            });
        });
    });

    describe("with a ModelBrew", () => {
        let modelBrew: Brew;
        beforeEach(() => {
            modelBrew = new BrewBuilder()
                .withBean("Gesha")
                .withBeanWeightInGrams(15)
                .withGrinder("My Grinder")
                .withGrindSetting("22")
                .withComment("Yummy")
                .build();
            render(
                <BrewInputPanel
                    user={testUser}
                    brewsApi={new MockBrewsApi()}
                    modelBrew={modelBrew}
                />
            );
        });

        each(
            Object.entries(expectedFields).map(([fieldId, field]) => [
                fieldId,
                field.name,
                field.takeFromModel,
            ])
        ).describe("field %s", (fieldId, name, takeFromModel) => {
            let field: HTMLElement;
            beforeEach(() => {
                field = screen.getByLabelText(name);
            });
            if (takeFromModel) {
                it("takes it's initial value from the model brew", () => {
                    expect(field.value).toEqual(String(modelBrew[fieldId]));
                });
            } else {
                it("has empty initial value", () => {
                    expect(field.value).toEqual("");
                });
            }
        });

        it("does not have any other Fields", () => {
            expect(screen.queryAllByRole("textbox").length).toEqual(
                Object.keys(expectedFields).length
            );
        });

        it("has a single button labelled Add Brew", () => {
            expect(screen.getByText("Add Brew")).toBeInTheDocument();
        });
    });

    describe("with a changed ModelBrew", () => {
        let origModelBrew: Brew;
        let newModelBrew: Brew;
        const defaultedFieldId = "grindSetting";
        beforeEach(() => {
            const brewsApi = new MockBrewsApi();
            origModelBrew = new BrewBuilder()
                .withBean("Gesha")
                .withBeanWeightInGrams(15)
                .withGrinder("My Grinder")
                .withGrindSetting("22")
                .withComment("Yummy")
                .build();
            newModelBrew = new BrewBuilder()
                .withBean("New Gesha")
                .withBeanWeightInGrams(16)
                .withGrinder("My New Grinder")
                .withGrindSetting("23")
                .withComment("Yummy again")
                .build();
            const { rerender } = render(
                <BrewInputPanel
                    user={testUser}
                    brewsApi={brewsApi}
                    modelBrew={origModelBrew}
                />
            );
            rerender(
                <BrewInputPanel
                    user={testUser}
                    brewsApi={brewsApi}
                    modelBrew={newModelBrew}
                />
            );
        });

        each(
            Object.entries(expectedFields).map(([fieldId, field]) => [
                fieldId,
                field.name,
                field.takeFromModel,
            ])
        ).describe("field %s", (fieldId, name, takeFromModel) => {
            let field: HTMLElement;
            beforeEach(() => {
                field = screen.getByLabelText(name);
            });
            if (takeFromModel) {
                it("keeps its value from the original model brew", () => {
                    expect(field.value).toEqual(String(origModelBrew[fieldId]));
                });
            } else {
                it("keeps its empty initial value", () => {
                    expect(field.value).toEqual("");
                });
            }
        });
    });
});
