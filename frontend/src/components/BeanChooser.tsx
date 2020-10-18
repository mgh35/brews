import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";

import { BeanStore } from "application/beanStore";
import { Bean } from "models/brew";
import BeanInput from "./BeanInput";

interface Props {
    value: string | undefined;
    beanStore: BeanStore;
    onSelect: (beanId: string) => void;
}

const BeanChooser = ({ value, beanStore, onSelect }: Props) => {
    const [showBeanInput, setShowBeanInput] = useState(false);

    const makeLabelForBean = (bean: Bean | undefined) => {
        if (!bean) {
            return "{Select a bean}";
        }
        if (bean.beanRoastDate) {
            return `${bean.beanName} [${bean.beanRoastDate}]`;
        } else {
            return `${bean.beanName}`;
        }
    };

    const selectedBean = beanStore.getById(value);

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="secondary">
                    {makeLabelForBean(selectedBean)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {beanStore
                        .getAllBeans()
                        .filter((bean) => bean.beanId)
                        .map((bean) => (
                            <Dropdown.Item
                                key={bean.beanId}
                                as="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    onSelect(bean.beanId!);
                                }}
                            >
                                {makeLabelForBean(bean)}
                            </Dropdown.Item>
                        ))}
                    <Dropdown.Item
                        as="button"
                        onClick={(event) => {
                            event.preventDefault();
                            setShowBeanInput(true);
                        }}
                    >
                        Add Bean
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Modal show={showBeanInput}>
                <Modal.Header>
                    <Modal.Title>Add a Bean</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BeanInput
                        beanStore={beanStore}
                        onClose={(beanId) => {
                            setShowBeanInput(false);
                            if (beanId) {
                                onSelect(beanId);
                            }
                        }}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default BeanChooser;
