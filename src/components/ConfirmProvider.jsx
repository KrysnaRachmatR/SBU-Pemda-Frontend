import React, { createContext, useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});

  const confirm = ({ message, onYes, onNo }) => {
    setMessage(message);
    setOnConfirm(() => () => {
      onYes?.();
      setShow(false);
    });
    setOnCancel(() => () => {
      onNo?.();
      setShow(false);
    });
    setShow(true);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="success" onClick={onConfirm}>
            Ya, Lanjutkan
          </Button>
        </Modal.Footer>
      </Modal>
    </ConfirmContext.Provider>
  );
};
