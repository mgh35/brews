import React from "react";
import user from "@testing-library/user-event";
import { render, act } from "@testing-library/react";
import { screen, waitFor, waitForDomChange } from "@testing-library/dom";

import BrewTimer from "./BrewTimer";

describe("BrewTimer", () => {
    describe("on open", () => {
        beforeEach(() => {
            render(<BrewTimer />);
        });

        it("has a clock, initialized at 0s", () => {
            const clock = screen.getByTitle("clock");
            expect(clock).toBeInTheDocument();
            expect(clock.innerHTML).toEqual("0s");
        });

        it("has a toggle button, initialized to Start", () => {
            const toggle = screen.getByTitle("toggle");
            expect(toggle).toBeInTheDocument();
            expect(toggle.innerHTML).toEqual("Start");
        });

        it("does not have a Reset button", () => {
            expect(screen.queryByTitle("reset")).not.toBeInTheDocument();
        });
    });

    describe("on pressing Start", () => {
        let toggle: HTMLElement;
        let clock: HTMLElement;
        let onRecord: jest.Mock;
        beforeEach(async () => {
            onRecord = jest.fn();
            jest.useFakeTimers();
            mockTime(0);
            render(<BrewTimer onRecord={onRecord} />);
            toggle = screen.getByTitle("toggle");
            clock = screen.getByTitle("clock");
            await act(async () => {
                user.click(toggle);
                await waitFor(() => {
                    expect(toggle.innerHTML).toEqual("Stop");
                });
            });
        });

        it("still reads 0s on the clock", () => {
            expect(clock.innerHTML).toEqual("0s");
        });

        it("changes the toggle to Stop", () => {
            expect(toggle.innerHTML).toEqual("Stop");
        });

        it("still does not have a Reset button", () => {
            expect(screen.queryByTitle("reset")).not.toBeInTheDocument();
        });

        it("has not called onRecord", () => {
            expect(onRecord).not.toHaveBeenCalled();
        });

        describe("after 12.6s", () => {
            beforeEach(async () => {
                mockTime(12.6);
                await act(async () => {
                    jest.runOnlyPendingTimers();
                    await waitFor(() =>
                        expect(clock.innerHTML).not.toEqual("0s")
                    );
                });
            });

            it("reads 12s on the clock", () => {
                expect(clock.innerHTML).toEqual("12s");
            });

            it("still shows the toggle as Stop", () => {
                expect(toggle.innerHTML).toEqual("Stop");
            });

            it("still does not have a Reset button", () => {
                expect(screen.queryByTitle("reset")).not.toBeInTheDocument();
            });

            it("has not called onRecord", () => {
                expect(onRecord).not.toHaveBeenCalled();
            });
        });

        describe("on pressing Stop after 45.9s", () => {
            beforeEach(async () => {
                mockTime(45.9);
                await act(async () => {
                    jest.runOnlyPendingTimers();
                    await waitFor(() =>
                        expect(clock.innerHTML).not.toEqual("12s")
                    );
                    user.click(toggle);
                    await waitFor(() =>
                        expect(toggle.innerHTML).toEqual("Start")
                    );
                });
            });

            it("reads 45s on the clock", () => {
                expect(clock.innerHTML).toEqual("45s");
            });

            it("changes the toggle to Start", () => {
                expect(toggle.innerHTML).toEqual("Start");
            });

            it("called the onRecord callback", () => {
                expect(onRecord).toHaveBeenCalledTimes(1);
                expect(onRecord).toHaveBeenCalledWith({
                    totalTime: 45.9,
                });
            });

            it("has a Reset button", () => {
                expect(screen.queryByTitle("reset")).toBeInTheDocument();
            });

            describe("on pressing Reset", () => {
                beforeEach(async () => {
                    onRecord.mockReset();
                    await act(async () => {
                        user.click(screen.getByTitle("reset"));
                        await waitFor(() =>
                            expect(
                                screen.queryByTitle("reset")
                            ).not.toBeInTheDocument()
                        );
                    });
                });

                it("reads 0s on the clock", () => {
                    expect(clock.innerHTML).toEqual("0s");
                });

                it("still shows the toggle as Start", () => {
                    expect(toggle.innerHTML).toEqual("Start");
                });

                it("called the onRecord callback", () => {
                    expect(onRecord).toHaveBeenCalledTimes(1);
                    expect(onRecord).toHaveBeenCalledWith({
                        totalTime: 0,
                    });
                });

                it("does not have a Reset button", () => {
                    expect(
                        screen.queryByTitle("reset")
                    ).not.toBeInTheDocument();
                });
            });
        });
    });
});

const mockTime = (offsetSeconds: number): void => {
    const base = new Date("2020-01-01");
    jest.spyOn(Date, "now").mockReturnValue(
        base.valueOf() + 1000 * offsetSeconds
    );
};
