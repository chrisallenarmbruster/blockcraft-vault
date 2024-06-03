import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addEntry } from "../store/entriesSlice";
import { Modal, Form, Button, ButtonGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import Select from "react-select";
import Creatable from "react-select/creatable";
import QRCodeScanner from "./QRCodeScanner";

const schema = yup.object().shape({
  from: yup
    .string()
    .required("From field is required")
    .matches(/^(02|03)[a-fA-F0-9]{64}$/, "Invalid public key"),
  privateKey: yup.string().required("Private key is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be a positive number")
    .integer("Amount must be an integer")
    .required("Amount is required"),
  to: yup
    .string()
    .required("To field is required")
    .matches(/^(02|03)[a-fA-F0-9]{64}$/, "Invalid public key"),
});

function EntryAdd({ show, handleClose }) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const [selectedPrivateKey, setSelectedPrivateKey] = useState("");
  const [selectedFromOption, setSelectedFromOption] = useState(null);
  const [selectedToOption, setSelectedToOption] = useState(null);
  const [toInputValue, setToInputValue] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalHeader, setResultModalHeader] = useState("");
  const [resultModalMessage, setResultModalMessage] = useState("");

  const addresses = useSelector(
    (state) => state.data.unencryptedData?.addresses || []
  );

  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];

  useEffect(() => {
    if (show) {
      setSelectedPrivateKey("");
      reset();
      setSelectedToOption(null);
      setSelectedFromOption(null);
    }
  }, [show, reset]);

  useEffect(() => {
    setValue("privateKey", selectedPrivateKey);
  }, [selectedPrivateKey, setValue]);

  useEffect(() => {
    register("from");
    register("to");
  }, [register]);

  const onSubmit = async (data) => {
    clearErrors("from");
    try {
      await dispatch(addEntry(data)).unwrap();
      setResultModalHeader("Entry Succeeded!");
      setResultModalMessage(
        `<p>From: <br/>${data.from}</p><p>To:<br/> ${data.to}</p><p>Amount: ${data.amount}</p>`
      );
      setShowResultModal(true);
      handleClose();
    } catch (error) {
      setResultModalHeader("Entry Failed!");
      if (error instanceof Error) {
        setResultModalMessage(`<p>${error.message}</p>`);
        setShowResultModal(true);
      } else {
        setResultModalMessage(`<p>${error}</p>`);
        setShowResultModal(true);
      }
    }
  };

  const handleFromSelectChange = (selectedFromOption) => {
    setSelectedFromOption(selectedFromOption);
    setValue("from", selectedFromOption.value);
    clearErrors("from");
    const selectedKeypair = keypairs.find(
      (keypair) => keypair.publicKey === selectedFromOption.value
    );
    setSelectedPrivateKey(selectedKeypair ? selectedKeypair.privateKey : "");
    trigger("from");
  };

  const handleToSelectChange = async (selectedToOption) => {
    setSelectedToOption(selectedToOption);
    setValue("to", selectedToOption ? selectedToOption.value : "", {
      shouldValidate: true,
    });
    trigger("to");
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("to", data.text);
    setSelectedToOption({ value: data.text, label: data.text });
  };

  const options = addresses.map((address) => ({
    value: address.publicKey,
    label: `${address.label} - ${address.publicKey.slice(
      0,
      4
    )}...${address.publicKey.slice(-4)}`,
  }));

  return (
    <>
      <Modal
        centered
        show={show && !showResultModal}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Send Assets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formFrom">
              <Form.Label>From</Form.Label>
              <Select
                options={keypairs.map((keypair) => ({
                  value: keypair.publicKey,
                  label: `${keypair.label} - ${keypair.publicKey.slice(
                    0,
                    4
                  )}...${keypair.publicKey.slice(-4)}`,
                }))}
                isInvalid={!!errors.from}
                onChange={handleFromSelectChange}
                value={selectedFromOption}
                placeholder="Select keypair to send from"
                title="Select keypair to send from."
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: "100%",
                    flex: 1,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }),
                  container: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  option: (provided) => ({
                    ...provided,
                    color: "hsl(0, 0%, 20%)",
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: "hsl(0, 0%, 20%)",
                  }),
                }}
              />
              {errors.from && (
                <div className="invalid-feedback d-block">
                  {errors.from.message}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPrivateKey">
              <Form.Control
                type="hidden"
                {...register("privateKey")}
                value={selectedPrivateKey}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTo">
              <Form.Label>To</Form.Label>
              <ButtonGroup style={{ width: "100%", display: "flex" }}>
                <Creatable
                  options={options}
                  isInvalid={!!errors.to}
                  onChange={handleToSelectChange}
                  onInputChange={(value) => setToInputValue(value)}
                  inputValue={toInputValue}
                  value={selectedToOption}
                  placeholder="Select contact, type key or scan"
                  title="Select contact, type key or scan QR code to send to."
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: "100%",
                      flex: 1,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }),
                    container: (provided) => ({
                      ...provided,
                      width: "100%",
                    }),

                    option: (provided) => ({
                      ...provided,
                      color: "hsl(0, 0%, 20%)",
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "hsl(0, 0%, 20%)",
                    }),
                  }}
                />
                <Button
                  variant="outline-secondary"
                  className="flex-grow-0 rounded-right"
                  title="Click to scan a QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
              </ButtonGroup>
              {errors.to && (
                <div className="invalid-feedback d-block">
                  {errors.to.message}
                </div>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.to?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                {...register("amount")}
                isInvalid={!!errors.amount}
                className="text-end"
                placeholder="Enter numeric amount to send"
                title="Enter numeric amount to send.      "
              />
              <Form.Control.Feedback type="invalid">
                {errors.amount?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
      {showResultModal && (
        <Modal
          show={showResultModal}
          onHide={() => setShowResultModal(false)}
          centered
          contentClassName="dark-modal"
        >
          <Modal.Header>
            <Modal.Title>{resultModalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body
            dangerouslySetInnerHTML={{ __html: resultModalMessage }}
            className={`text-break ${
              resultModalHeader === "Entry Succeeded!" ? "" : "text-center my-3"
            }`}
          />
          <Modal.Footer>
            <Button
              variant={
                resultModalHeader === "Entry Succeeded!" ? "primary" : "danger"
              }
              onClick={() => setShowResultModal(false)}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

EntryAdd.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EntryAdd;
