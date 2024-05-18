import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { BsQrCodeScan } from "react-icons/bs";
import QrScanner from "react-qr-scanner";

const QRCodeScanner = ({ onScanSuccess }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleScan = (data) => {
    if (data) {
      console.log("Scanned Data: ", data);
      onScanSuccess(data);
      handleClose();
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error: ", err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const videoConstraints = {
    facingMode: "environment", // Use the back camera
  };

  useEffect(() => {
    return () => {
      console.log("QRScanner component unmounted, camera should stop.");
    };
  }, []);

  return (
    <>
      <BsQrCodeScan
        className="cursor-pointer text-primary"
        onClick={handleShow}
      />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Scan QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {show && (
            <div className="mt-3 mb-2">
              <QrScanner
                delay={300}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
                constraints={{ video: videoConstraints }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QRCodeScanner;
