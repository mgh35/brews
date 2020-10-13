import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { BrewTrace, Recipe } from "models/brew";

type Props = {
    recipe?: Recipe;
    onRecord?: (record: BrewTrace) => void;
};

const BrewTimer = ({ recipe, onRecord }: Props) => {
    const [time, setTime] = useState<number | undefined>(undefined);
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [startTime, setStartTime] = useState<number | undefined>(undefined);
    const [stageTimes, setStageTimes] = useState<{ [key: number]: number }>({});

    const recordBrewTrace = () => {
        if (!onRecord) {
            return;
        }
        const brewStages =
            recipe && recipe.recipeStages
                ? recipe.recipeStages.map((_, i) => ({
                      name: undefined,
                      waterMass: undefined,
                      time: stageTimes[i],
                  }))
                : [];
        onRecord({
            brewTotalTime: _elapsedTimeSince(startTime),
            brewStages,
        });
    };

    const toggleRunning = () => {
        if (isRunning) {
            setIsRunning(false);
            recordBrewTrace();
        } else {
            setStartTime(Date.now());
            setIsRunning(true);
            setHasStarted(true);
        }
    };

    const reset = () => {
        setIsRunning(false);
        setHasStarted(false);
        setStartTime(undefined);
        setTime(undefined);
        setStageTimes({});
        recordBrewTrace();
    };

    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                setTime(_elapsedTimeSince(startTime));
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [isRunning, startTime, setTime]);

    return (
        <>
            <Container>
                <Row>
                    <Col xs="1">
                        <div title="clock">{_displayTime(time)}</div>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="2">
                        <Button
                            title="toggle"
                            variant="secondary"
                            onClick={toggleRunning}
                        >
                            {isRunning ? "Stop" : "Start"}
                        </Button>
                        {hasStarted && !isRunning ? (
                            <Button
                                title="reset"
                                variant="outline-secondary"
                                onClick={reset}
                            >
                                Reset
                            </Button>
                        ) : (
                            <></>
                        )}
                    </Col>
                </Row>
                {recipe && recipe.recipeStages && (
                    <Row>
                        <Col xs="1"></Col>
                        <Col xs="3">
                            <strong>Name</strong>
                        </Col>
                        <Col xs="1">
                            <strong>Mass</strong>
                        </Col>
                        <Col xs="1">
                            <strong>Target</strong>
                        </Col>
                        <Col xs="1">
                            <strong>Time</strong>
                        </Col>
                    </Row>
                )}
                {recipe &&
                    recipe.recipeStages &&
                    recipe.recipeStages.map((stage, i) => (
                        <Row key={`stage_${i}`}>
                            <Col xs="1"></Col>
                            <Col xs="3">{stage.name}</Col>
                            <Col xs="1">
                                {stage.waterMass
                                    ? `${Math.floor(stage.waterMass)}g`
                                    : ""}
                            </Col>
                            <Col xs="1">{_displayTime(stage.time)}</Col>
                            <Col xs="1">{_displayTime(stageTimes[i])}</Col>
                            <Col xs="1">
                                <Button
                                    variant="outline-secondary"
                                    title={`stage_${i}`}
                                    disabled={
                                        !startTime || Boolean(stageTimes[i])
                                    }
                                    onClick={() => {
                                        if (!startTime) {
                                            return;
                                        }
                                        setStageTimes({
                                            ...stageTimes,
                                            [i]: _elapsedTimeSince(startTime),
                                        });
                                    }}
                                >
                                    Reached
                                </Button>
                            </Col>
                        </Row>
                    ))}
            </Container>
        </>
    );
};

const _displayTime = (time: number | undefined): String => {
    if (time === undefined) {
        return "";
    }
    return `${Math.floor(time)}s`;
};

const _elapsedTimeSince = (since: number | undefined) => {
    if (since) {
        return (Date.now() - since) / 1000;
    } else {
        return NaN;
    }
};

export default BrewTimer;
