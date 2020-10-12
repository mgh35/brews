import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type OnRecordSignature = {
    brewTotalTime?: number;
};

type Props = {
    onRecord?: (record: OnRecordSignature) => void;
};

const BrewTimer = ({ onRecord }: Props) => {
    const [time, setTime] = useState<number | undefined>(undefined);
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [startTime, setStartTime] = useState<number | undefined>(undefined);

    const toggleRunning = () => {
        if (isRunning) {
            setIsRunning(false);
            if (onRecord) {
                onRecord({
                    brewTotalTime: _elapsedTimeSince(startTime),
                });
            }
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
        if (onRecord) {
            onRecord({
                brewTotalTime: undefined,
            });
        }
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
                    <Col>
                        <div title="clock">{_displayTime(time)}</div>
                    </Col>
                    <Col>
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
