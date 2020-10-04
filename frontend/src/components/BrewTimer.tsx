import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type OnRecordSignature = {
    totalTime: number;
};

type Props = {
    onRecord?: (record: OnRecordSignature) => void;
};

const BrewTimer = ({ onRecord }: Props) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    const toggleRunning = () => {
        if (isRunning) {
            setIsRunning(false);
            if (onRecord) {
                onRecord({
                    totalTime: _elapsedTimeSince(startTime),
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
        setStartTime(null);
        setTime(0);
        if (onRecord) {
            onRecord({
                totalTime: 0,
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
                        <Button title="toggle" onClick={toggleRunning}>
                            {isRunning ? "Stop" : "Start"}
                        </Button>
                        {hasStarted && !isRunning ? (
                            <Button
                                title="reset"
                                variant="outline-primary"
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

const _displayTime = (time: number): String => {
    return `${Math.floor(time)}s`;
};

const _elapsedTimeSince = (since: number | null) => {
    if (since) {
        return (Date.now() - since) / 1000;
    } else {
        return NaN;
    }
};

export default BrewTimer;
