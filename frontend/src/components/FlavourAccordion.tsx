import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { SCAFlavourWheel } from "models/flavours";

import styles from "./FlavourAccordion.module.css";

interface Props {
    value: Array<string> | undefined;
    onChange: (value: Array<string>) => void;
}

const FlavourAccordion = ({ value, onChange }: Props) => {
    const currentValue = value || [];
    return (
        <Accordion>
            {Object.entries(SCAFlavourWheel).map(
                ([innerCategory, nextLevel]) => (
                    <Card>
                        <Accordion.Toggle
                            as={Card.Header}
                            eventKey={innerCategory}
                        >
                            {innerCategory}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={innerCategory}>
                            <Card.Body>
                                {Object.keys(nextLevel).map(
                                    (secondCategory) => (
                                        <MultiSelect
                                            id={secondCategory}
                                            value={currentValue}
                                            onChange={onChange}
                                        />
                                    )
                                )}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )
            )}
        </Accordion>
    );
};

interface MultiSelectProps {
    id: string;
    value: Array<string>;
    onChange: (value: Array<string>) => void;
}

const MultiSelect = ({ id, value, onChange }: MultiSelectProps) => {
    return (
        <Button
            className={styles.button}
            variant="outline-secondary"
            active={value.includes(id)}
            onClick={() => {
                if (value.includes(id)) {
                    onChange(value.filter((x: string) => x !== id));
                } else {
                    onChange(value.concat(id));
                }
            }}
        >
            {id}
        </Button>
    );
};

export default FlavourAccordion;
