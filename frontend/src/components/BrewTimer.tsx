import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import styles from "./BrewTimer.module.css";
import { BrewTrace, Recipe } from "models/brew";

type Props = {
    recipe?: Recipe;
    onRecord?: (record: BrewTrace) => void;
};

enum Status {
    INITIALIZED,
    RUNNING,
    STOPPED,
}

const BrewTimer = ({ recipe, onRecord }: Props) => {
    const [time, setTime] = useState<number | undefined>(undefined);
    const [status, setStatus] = useState(Status.INITIALIZED);
    const [startTime, setStartTime] = useState<number | undefined>(undefined);

    const start = () => {
        setStartTime(Date.now());
        setStatus(Status.RUNNING);
    };

    const stop = () => {
        setStatus(Status.STOPPED);
        if (onRecord) {
            onRecord({
                brewTotalTime: _elapsedTimeSince(startTime),
            });
        }
    };

    const reset = () => {
        setStatus(Status.INITIALIZED);
        setStartTime(undefined);
        setTime(undefined);
        if (onRecord) {
            onRecord({
                brewTotalTime: undefined,
            });
        }
    };

    useEffect(() => {
        if (status === Status.RUNNING) {
            setTime(_elapsedTimeSince(startTime));
            const interval = setInterval(() => {
                setTime(_elapsedTimeSince(startTime));
            }, 200);
            return () => {
                clearInterval(interval);
            };
        }
    }, [status, startTime, setTime]);

    const target = _getCurrentTarget(time, recipe);

    return (
        <>
            <Row>
                <div className={styles.clock}>
                    <pre>{_displayTime(time)}</pre>
                </div>
                <Button
                    className={styles.btnToggle}
                    variant="secondary"
                    onClick={status === Status.INITIALIZED ? start : stop}
                    disabled={status === Status.STOPPED}
                >
                    {status === Status.INITIALIZED ? "Start" : "Stop"}
                </Button>
                {status === Status.STOPPED && (
                    <Button
                        className={styles.btnReset}
                        variant="outline-secondary"
                        onClick={reset}
                    >
                        Reset
                    </Button>
                )}
            </Row>
            <Row>
                <div className={styles.targetWeight}>
                    <pre>{_displayMass(target.waterMass)}</pre>
                </div>
                <div className={styles.targetStage}>
                    <div className={styles.targetStageCurrent}>
                        {target.currentStageName}
                    </div>
                    {target.nextStageName &&
                        target.timeToNextStage &&
                        target.timeToNextStage < 10 && (
                            <div className={styles.targetStageNext}>
                                NEXT: {target.nextStageName} (
                                {_displayTime(target.timeToNextStage)})
                            </div>
                        )}
                </div>
            </Row>
        </>
    );
};

const _displayTime = (time: number | undefined): String => {
    if (time === undefined) {
        return "---s";
    }
    return String(Math.floor(time)).padStart(3, " ") + "s";
};

const _elapsedTimeSince = (since: number | undefined) => {
    if (since) {
        return (Date.now() - since) / 1000;
    } else {
        return undefined;
    }
};

interface CurrentTarget {
    waterMass?: number;
    currentStageName?: string;
    nextStageName?: string;
    timeToNextStage?: number;
}

const _getCurrentTarget = (
    currentTime: number | undefined,
    recipe: Recipe | undefined
): CurrentTarget => {
    if (currentTime === undefined || !recipe || !recipe.recipeStages) {
        return {};
    }
    const stages = recipe.recipeStages!;

    let indexOfCurrentStage = 0;
    for (; indexOfCurrentStage + 1 < stages.length; ++indexOfCurrentStage) {
        const nextStage = stages[indexOfCurrentStage + 1];
        if (nextStage.time && nextStage.time > currentTime) {
            break;
        }
    }

    const currentStage = stages[indexOfCurrentStage];
    const nextStage =
        indexOfCurrentStage + 1 < stages.length
            ? stages[indexOfCurrentStage + 1]
            : undefined;

    if (!nextStage) {
        return {
            waterMass: currentStage.waterMass,
            currentStageName: currentStage.name,
        };
    }
    const targetWaterMass =
        currentStage.waterMass +
        ((nextStage.waterMass - currentStage.waterMass) *
            (currentTime - currentStage.time)) /
            (nextStage.time - currentStage.time);

    return {
        waterMass: targetWaterMass,
        currentStageName: currentStage.name,
        nextStageName: nextStage.name,
        timeToNextStage: nextStage.time - currentTime,
    };
};

const _displayMass = (mass: number | undefined): String => {
    if (mass === undefined) {
        return "    g";
    }
    return String(Math.floor(mass)).padStart(4, " ") + "g";
};

export default BrewTimer;
