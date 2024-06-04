# README.md

# blockcraft-vault

Blockcraft Vault is my app for keeping private information such as encryption keys secure, private and anonymous through the use of a zero-knowledge encryption scheme. The server never sees or stores your unhashed user id and password, or your unencrypted data. Moreover, the hashed password will not decrypt the data. It is ideal for such use cases as a blockchain wallet, blockchain voting ballot and beyond.


# client/README.md

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# client/package.json

```json
{
  "name": "blockcraft-vault-client",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint 'src/**/*.{js,jsx}' --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@reduxjs/toolkit": "^2.2.3",
    "@vitejs/plugin-react-refresh": "^1.3.6",
    "axios": "^1.6.8",
    "bcryptjs": "^2.4.3",
    "bootstrap": "^5.3.3",
    "buffer": "^6.0.3",
    "crypto": "^1.0.1",
    "dotenv": "^16.4.5",
    "elliptic": "^6.5.5",
    "nanoid": "^5.0.7",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.2",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.51.4",
    "react-icons": "^5.2.1",
    "react-qr-scanner": "^1.0.0-alpha.11",
    "react-qrcode": "^0.3.6",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.23.0",
    "react-select": "^5.8.0",
    "redux": "^5.0.1",
    "reselect": "^5.1.0",
    "yup": "^1.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vite-pwa/assets-generator": "^0.2.4",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0",
    "vite-plugin-pwa": "^0.20.0"
  }
}

```

# client/src/Components/AddressAdd.jsx

```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addAddress } from "../store/dataSlice";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { BsPersonAdd } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const selectAddresses = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.addresses || []
);

function AddressAdd() {
  const addresses = useSelector(selectAddresses);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) => !addresses.some((address) => address.label === value)
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    clearErrors("publicKey");
    try {
      await dispatch(addAddress(data)).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to add address", error);
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  return (
    <>
      <BsPersonAdd
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
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                {...register("label")}
                isInvalid={!!errors.label}
                title="Type a friendly name for this contact."
                placeholder="Type a friendly name for this contact"
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label>Public Key</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                  placeholder="Type, paste or scan"
                  title="Type or paste a public key, or scan a QR code."
                />
                <Button
                  variant="outline-secondary"
                  className="rounded-right"
                  title="Click to scan QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddressAdd;

```

# client/src/Components/AddressDelete.jsx

```javascript
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteAddress } from "../store/dataSlice";
import { BsTrash } from "react-icons/bs";
import PropTypes from "prop-types";

function AddressDelete({ address }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    dispatch(deleteAddress(address));
    handleClose();
  };

  return (
    <>
      <BsTrash className="cursor-pointer text-danger" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the {`"${address.label}"`} contact?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AddressDelete.propTypes = {
  address: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};

export default AddressDelete;

```

# client/src/Components/AddressUpdate.jsx

```javascript
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Form, Modal, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateAddress } from "../store/dataSlice";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import { BsPencil } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const selectAddresses = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.addresses || []
);

function AddressUpdate({ address }) {
  const addresses = useSelector(selectAddresses);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) =>
            !addresses.some(
              (ad) => ad.label === value && ad.nanoId !== address.nanoId
            )
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: address,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    reset(address);
  }, [address, reset]);

  const onSubmit = async (data) => {
    console.log(data);
    clearErrors("publicKey");
    try {
      await dispatch(updateAddress({ ...address, ...data })).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  return (
    <>
      <BsPencil className="cursor-pointer text-primary" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} className="text-start">
            <Form.Group className="mb-3" controlId="updateFormLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                {...register("label")}
                isInvalid={!!errors.label}
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label>Public Key</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                />
                <Button
                  variant="outline-secondary rounded-right"
                  title="Click to scan a different QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AddressUpdate.propTypes = {
  address: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
  }),
};

export default AddressUpdate;

```

# client/src/Components/Addresses.jsx

```javascript
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import AddressUpdate from "./AddressUpdate";
import AddressDelete from "./AddressDelete";
import AddressAdd from "./AddressAdd";
import { useNavigate } from "react-router-dom";

function Addresses() {
  const addresses =
    useSelector((state) => state.data.unencryptedData?.addresses) || [];
  const navigate = useNavigate();

  const formatKey = (key) => {
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  return (
    <Container>
      <div className="d-flex align-items-center mb-3 h2">
        <div className="me-3">Contacts</div>
        <div title="Add New Contact">
          <AddressAdd />
        </div>
      </div>
      <Container>
        <Row className="mt-3 mb-3 border-bottom fw-bold">
          <Col xs={5}>Label</Col>
          <Col xs={4}>Public Key</Col>
          <Col xs={3}></Col>
        </Row>
        {addresses.map((address) => (
          <Row key={address.nanoId} className="pb-3 mb-3 border-bottom">
            <Col xs={5}>{address.label}</Col>
            <Col xs={4} title={address.publicKey}>
              {formatKey(address.publicKey)}
            </Col>
            <Col xs={3} className="text-center d-flex ">
              <div className="me-2" title="Edit Contact">
                <AddressUpdate address={address} />
              </div>
              <div title="Delete Contact">
                <AddressDelete address={address} />
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </Container>
  );
}

export default Addresses;

```

# client/src/Components/App.jsx

```javascript
import { useEffect } from "react";
import Login from "./Login";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Keypairs from "./Keypairs";
import { Routes, Route, useNavigate } from "react-router-dom";
import Addresses from "./Addresses";
import NavBar from "./NavBar";
import Assets from "./Assets";
import Receive from "./Receive";
import QRCodeScanner from "./QRCodeScanner";

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <>
          <NavBar />
          <Container className="mt-3 mt-4rem mb-mobile-6rem container-xl mw-375 container-xs-gutter">
            <Routes>
              <Route path="/" element={<Assets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/keypairs" element={<Keypairs />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/receive" element={<Receive />} />
              <Route path="/scan" element={<QRCodeScanner />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </>
      )}
    </>
  );
}

export default App;

```

# client/src/Components/Assets.jsx

```javascript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Accordion, Row, Col, Container } from "react-bootstrap";
import { fetchEntriesForAllKeys } from "../store/entriesSlice";

function Assets() {
  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];
  const entries = useSelector((state) => state.entries.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEntriesForAllKeys());
  }, [dispatch]);

  const formatKey = (key) => {
    if (key === "INCENTIVE" || key === "ICO") return key;
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  const total = keypairs.reduce((sum, keypair) => {
    const netAmount = entries[keypair.publicKey]?.meta?.netAmount || 0;
    return sum + netAmount;
  }, 0);

  return (
    <>
      <Container className="mt-0 mb-3 container-left">
        <div className="h2 mb-3 text-secondary">
          Assets: <span className="text-light">{total}</span>
        </div>
        <Row className="ms-1 me-1 mb-3">
          <Col xs={4}>Account</Col>
          <Col xs={4}>Key</Col>
          <Col xs={2} className="text-end ">
            Balance
          </Col>
          <Col xs={2} className="text-end"></Col>
        </Row>
        {keypairs.map((keypair, index) => (
          <Accordion key={keypair.nanoId} className="mb-2">
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header>
                <Row style={{ width: "100%" }}>
                  <Col xs={4}>{keypair.label}</Col>
                  <Col xs={4}>{formatKey(keypair.publicKey)}</Col>
                  <Col xs={3} className="text-end">
                    {entries[keypair.publicKey]?.meta?.netAmount || "0"}
                  </Col>
                  <Col xs={1} className="text-end"></Col>
                </Row>
              </Accordion.Header>
              <Accordion.Body>
                <h6>Latest Entries:</h6>
                <Table striped bordered hover size="sm" variant="dark">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>From/To</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries[keypair.publicKey]?.entries?.map((entry) => {
                      const date = new Date(entry.initiationTimestamp);
                      const formattedDate = `${
                        date.getMonth() + 1
                      }/${date.getDate()}/${date
                        .getFullYear()
                        .toString()
                        .substr(-2)}`;
                      return (
                        <tr key={entry.entryId}>
                          <td>{formattedDate}</td>
                          <td>
                            {entry.from === keypair.publicKey
                              ? formatKey(entry.to)
                              : formatKey(entry.from)}
                          </td>
                          <td className="text-end">
                            {entry.from === keypair.publicKey
                              ? -entry.amount
                              : entry.amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <div className="text-center text-light">
                  See more in{" "}
                  <a
                    className="text-orange"
                    href={`${
                      import.meta.env.VITE_BLOCKCRAFT_NODE_URL
                    }/entries?publicKey=${keypair.publicKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blockcraft Explorer
                  </a>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </Container>
    </>
  );
}

export default Assets;

```

# client/src/Components/EntryAdd.jsx

```javascript
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

```

# client/src/Components/FetchEntriesButton.jsx

```javascript
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchEntriesForAllKeys } from "../store/entriesSlice";

const FetchEntriesButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(fetchEntriesForAllKeys());
  };

  return <Button onClick={handleClick}>Fetch Entries for All Keys</Button>;
};

export default FetchEntriesButton;

```

# client/src/Components/KeypairAdd.jsx

```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import elliptic from "elliptic";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addKeypair } from "../store/dataSlice";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { BsNodePlus, BsEye, BsEyeSlash } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const selectKeypairs = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.keypairs || []
);

function generateKeyPair() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate("hex");
  const publicKeyCompressed = keyPair.getPublic().encode("hex", true);
  return { privateKey, publicKeyCompressed };
}

function KeypairAdd() {
  const keypairs = useSelector(selectKeypairs);
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) => !keypairs.some((keypair) => keypair.label === value)
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
      privateKey: yup
        .string()
        .matches(
          /^[a-fA-F0-9]{64}$/,
          "Private key must be a 64-character hexadecimal"
        )
        .required("Private Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    if (!validateKeyPair(data.privateKey, data.publicKey)) {
      setError("publicKey", {
        type: "manual",
        message: "Public key is not a cryptographic match for the private key",
      });
    } else {
      clearErrors("publicKey");
      try {
        await dispatch(addKeypair(data)).unwrap();
        handleClose();
      } catch (error) {
        console.error("Failed to add keypair:", error);
      }
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  function validateKeyPair(privateKey, publicKey) {
    try {
      const keyPair = ec.keyFromPrivate(privateKey);
      const derivedPublicKey = keyPair.getPublic().encode("hex", true);
      return derivedPublicKey === publicKey;
    } catch (error) {
      console.error("Failed to validate key pair:", error);
      return false;
    }
  }

  return (
    <>
      <BsNodePlus
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
          <Modal.Title>Add Keypair</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                {...register("label")}
                isInvalid={!!errors.label}
                title="Type a friendly name for this keypair."
                placeholder="Type a friendly name for this keypair"
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label className="d-flex justify-content-between">
                <div className="py-0">Public Key</div>
                <Button
                  title="If you don't have a keypair, you can generate one by clicking here."
                  variant="link"
                  className="py-0 text-orange"
                  onClick={() => {
                    const { privateKey, publicKeyCompressed } =
                      generateKeyPair();
                    setValue("publicKey", publicKeyCompressed);
                    setValue("privateKey", privateKey);
                  }}
                >
                  Generate New Keypair
                </Button>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                  placeholder="Type, paste, scan or generate"
                  title="Type a public key, scan a QR code or generate a new keypair."
                />
                <Button
                  variant="outline-secondary rounded-right"
                  title="Click to scan QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="updateFormPrivateKey">
              <Form.Label>Private Key</Form.Label>
              <InputGroup className="mbxs-5">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  {...register("privateKey")}
                  isInvalid={!!errors.privateKey}
                  placeholder="Type, paste or generate"
                  title="Type or paste private key here.."
                />
                <Button
                  variant="outline-secondary rounded-right"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Click to toggle private key visibility."
                >
                  {showPassword ? (
                    <BsEyeSlash className="text-light" />
                  ) : (
                    <BsEye className="text-light" />
                  )}
                </Button>

                <Form.Control.Feedback type="invalid">
                  {errors.privateKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KeypairAdd;

```

# client/src/Components/KeypairDelete.jsx

```javascript
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteKeypair } from "../store/dataSlice";
import { BsTrash } from "react-icons/bs";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

function KeypairDelete({ keypair }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    dispatch(deleteKeypair(keypair));
    handleClose();
  };

  return (
    <>
      <BsTrash className="cursor-pointer text-danger" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the {`"${keypair.label}"`} keypair?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

KeypairDelete.propTypes = {
  keypair: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};

export default KeypairDelete;

```

# client/src/Components/KeypairUpdate.jsx

```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import elliptic from "elliptic";
import { Modal, InputGroup, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateKeypair } from "../store/dataSlice";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import { BsPencil, BsEye, BsEyeSlash } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const selectKeypairs = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.keypairs || []
);

function KeypairUpdate({ keypair }) {
  const keypairs = useSelector(selectKeypairs);
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) =>
            !keypairs.some(
              (kp) => kp.label === value && kp.nanoId !== keypair.nanoId
            )
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
      privateKey: yup
        .string()
        .matches(
          /^[a-fA-F0-9]{64}$/,
          "Private key must be a 64-character hexadecimal"
        )
        .required("Private Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: keypair,
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    if (!validateKeyPair(data.privateKey, data.publicKey)) {
      setError("publicKey", {
        type: "manual",
        message: "Public key is not a cryptographic match for the private key",
      });
    } else {
      clearErrors("publicKey");
      try {
        await dispatch(updateKeypair({ ...keypair, ...data })).unwrap();
        handleClose();
      } catch (error) {
        console.error("Failed to update keypair:", error);
      }
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  function validateKeyPair(privateKey, publicKey) {
    try {
      const keyPair = ec.keyFromPrivate(privateKey);
      const derivedPublicKey = keyPair.getPublic().encode("hex", true);
      return derivedPublicKey === publicKey;
    } catch (error) {
      console.error("Failed to validate key pair:", error);
      return false;
    }
  }

  return (
    <>
      <BsPencil className="cursor-pointer text-primary" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Edit Keypair</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} className="text-start">
            <Form.Group className="mb-3" controlId="updateFormLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                {...register("label")}
                isInvalid={!!errors.label}
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label>Public Key</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                />
                <Button
                  variant="outline-secondary rounded-right"
                  title="Click to scan a different QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="updateFormPrivateKey">
              <Form.Label>Private Key</Form.Label>
              <InputGroup className="mb-5">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  {...register("privateKey")}
                  isInvalid={!!errors.privateKey}
                />
                <Button
                  variant="outline-secondary rounded-right"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Click to toggle private key visibility."
                >
                  {showPassword ? (
                    <BsEyeSlash className="text-light" />
                  ) : (
                    <BsEye className="text-light" />
                  )}
                </Button>

                <Form.Control.Feedback type="invalid">
                  {errors.privateKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

KeypairUpdate.propTypes = {
  keypair: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
  }),
};

export default KeypairUpdate;

```

# client/src/Components/Keypairs.jsx

```javascript
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import KeypairDelete from "./KeypairDelete";
import KeypairUpdate from "./KeypairUpdate";
import KeypairAdd from "./KeypairAdd";

function Keypairs() {
  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];

  const formatKey = (key) => {
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  return (
    <Container>
      <div className="d-flex align-items-center mb-3 h2">
        <div className="me-3">Keychain</div>
        <div title="Add New Keypair">
          <KeypairAdd />
        </div>
      </div>
      <Container>
        <Row className="mt-3 mb-3 border-bottom fw-bold">
          <Col xs={5}>Label</Col>
          <Col xs={4}>Public Key</Col>
          <Col xs={3}></Col>
        </Row>
        {keypairs.map((keypair) => (
          <Row key={keypair.nanoId} className="pb-3 mb-3 border-bottom">
            <Col xs={5}>{keypair.label}</Col>
            <Col xs={4} title={keypair.publicKey}>
              {formatKey(keypair.publicKey)}
            </Col>
            <Col xs={3} className="text-center d-flex ">
              <div className="me-2" title="Edit Keypair">
                <KeypairUpdate keypair={keypair} />
              </div>
              <div title="Delete Keypair">
                <KeypairDelete keypair={keypair} />
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </Container>
  );
}

export default Keypairs;

```

# client/src/Components/Login.jsx

```javascript
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { processCredentials } from "../store/cryptoMemStore";
import {
  login,
  register as registerThunk,
  resetError,
} from "../store/authSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { BsSafe } from "react-icons/bs";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup.string(),
});

function Login() {
  const isError = useSelector((state) => state.auth.error);

  const [mode, setMode] = useState("login");
  const [isMobile, setIsMobile] = useState(
    window.innerWidth > 576 ? false : true
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 576 ? false : true);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  }, [location, navigate]);

  const onSubmit = async (data) => {
    let { email, password, confirmPassword } = data;

    email = email.toLowerCase();

    if (mode === "register" && password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      await processCredentials(email, password);

      if (mode === "login") {
        dispatch(login());
      } else {
        dispatch(registerThunk());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal show={!isError} centered contentClassName="dark-modal">
        <Form onSubmit={handleSubmit(onSubmit)} className="px-2">
          <Modal.Body>
            {" "}
            <h1
              className={`${
                isMobile ? "display-4" : "h2"
              } mt-3 mb-1  d-flex align-items-center justify-content-center text-light fw-bold`}
            >
              <BsSafe className="me-2 text-light" /> Blockcraft Vault
            </h1>
            <h2
              className={`${
                isMobile ? "display-4" : "h2"
              } text-center mt-0 mb-5 text-secondary fw-bold`}
            >
              {mode === "login" ? "Login" : "Registration"}
            </h2>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={
                  mode === "login" ? 'try "demo@email.com"' : "Enter email ID"
                }
                {...register("email")}
                isInvalid={!!errors.email}
                tabIndex={1}
                title={
                  mode === "login"
                    ? "Enter your email ID to login or use 'demo@email.com' to test drive the app."
                    : "Enter a valid email address to use as your login id.  This will be hashed before being sent to the server and stored." +
                      " The server will never have access to your email address."
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                title={
                  mode === "login"
                    ? "Enter password.  If test driving the app with 'demo@email.com' use 'demo' as the password."
                    : "Enter a password to use for login. This will be hashed before being sent to the server " +
                      "and then hashed again by the server and stored. The server will never have access to to your password. " +
                      "This password will be used to log you in and encrypt/decrpyt your data before sending it to " +
                      "and after receiving it from the server. It is important to remember this password! " +
                      "This is a zero-knowledge encryption app that prioritizes privacy, anonymity and security over convenience. " +
                      "Your password cannot be recovered if lost. If you forget your password, you will need to register again and lose your data."
                }
                placeholder={mode === "login" ? 'try "demo"' : "Enter password"}
                {...register("password")}
                tabIndex={2}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            {mode === "register" && (
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  title="Re-enter the password you entered above to confirm it."
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  isInvalid={!!errors.confirmPassword}
                  tabIndex={3}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}{" "}
            <div className="d-flex justify-content-between w-100">
              <Button
                variant="link"
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-decoration-none"
                tabIndex={5}
              >
                {mode === "login" ? "Register Instead" : "Login Instead"}
              </Button>
              <Button variant="primary" type="submit" tabIndex={4}>
                {mode === "login" ? "Login" : "Register"}
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>

      <Modal
        show={isError}
        onHide={() => dispatch(resetError())}
        centered
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {mode === "login" ? "Login" : "Registration"} Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="my-3 text-center">{isError?.comment}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => dispatch(resetError())}
            tabIndex={1}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;

```

# client/src/Components/NavBar.jsx

```javascript
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Modal, Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  BsSafe,
  BsBoxArrowInDownRight,
  BsBoxArrowUpRight,
  BsPiggyBank,
  BsKey,
  BsPersonRolodex,
  BsPower,
} from "react-icons/bs";
import EntryAdd from "./EntryAdd";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    window.innerWidth > 576 ? false : true
  );
  const [show, setShow] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 576 ? false : true);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const checkViewportHeight = () => {
      const currentHeight = window.innerHeight;
      if (currentHeight !== viewportHeight) {
        setViewportHeight(currentHeight);
      }
    };

    const intervalId = setInterval(checkViewportHeight, 150); // Check every 150ms

    return () => {
      clearInterval(intervalId);
    };
  }, [viewportHeight]);

  return (
    <>
      {isMobile && (
        <Container className="d-flex align-items-center fs-5 mt-1 container-xl mw-375">
          <BsSafe className="me-2 text-light" /> Blockcraft Vault
        </Container>
      )}
      <Navbar
        variant="dark"
        fixed={isMobile ? "bottom" : "top"}
        className={`container-xl mw-375 ${isMobile ? "pb-0" : "pt-0"}`}
        style={isMobile ? { position: "fixed", bottom: 0, width: "100%" } : {}}
      >
        <Container>
          {!isMobile && (
            <Navbar.Brand
              as={Link}
              to="/assets"
              className="text-light d-none d-sm-block"
            >
              Blockcraft Vault
            </Navbar.Brand>
          )}
          <Nav
            className={`me-auto ${
              isMobile ? "w-100  d-flex justify-content-around" : ""
            }`}
          >
            <Nav.Link as={Link} to="/home">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPiggyBank size={30} />
                  <div className="fs-7 mt-1">Assets</div>
                </div>
              ) : (
                "Assets"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/keypairs">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsKey size={30} />
                  <div className="fs-7 mt-1">Keys</div>
                </div>
              ) : (
                "Keys"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/addresses">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPersonRolodex size={30} />
                  <div className="fs-7 mt-1">Contacts</div>
                </div>
              ) : (
                "Contacts"
              )}
            </Nav.Link>
            <Nav.Link onClick={handleShow}>
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsBoxArrowUpRight size={30} />
                  <div className="fs-7 mt-1">Send</div>
                </div>
              ) : (
                "Send"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/receive">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsBoxArrowInDownRight size={30} />
                  <div className="fs-7 mt-1">Receive</div>
                </div>
              ) : (
                "Receive"
              )}
            </Nav.Link>

            <Nav.Link
              as={Link}
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              {" "}
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPower size={30} />
                  <div className="fs-7 mt-1">Logout</div>
                </div>
              ) : (
                "Logout"
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <EntryAdd show={show} handleClose={handleClose} />
    </>
  );
}

export default NavBar;

```

# client/src/Components/QRCodeScanner.jsx

```javascript
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

```

# client/src/Components/Receive.jsx

```javascript
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Accordion, Container, Button } from "react-bootstrap";
import { QRCode } from "react-qrcode";

function Receive() {
  const [copiedKeys, setCopiedKeys] = useState({});
  const [activeKey, setActiveKey] = useState(null);
  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];

  const buttonRefs = useRef([]);

  useEffect(() => {
    if (activeKey !== null) {
      setTimeout(() => {
        buttonRefs.current[activeKey].focus();
      }, 0);
    }
  }, [activeKey]);

  const formatKey = (key) => {
    if (key === "INCENTIVE" || key === "ICO") return key;
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  const handleCopy = async (publicKey) => {
    await navigator.clipboard.writeText(publicKey);
    setCopiedKeys({ ...copiedKeys, [publicKey]: true });
    setTimeout(
      () => setCopiedKeys({ ...copiedKeys, [publicKey]: false }),
      2000
    );
  };

  return (
    <>
      <Container className="mt-0 mb-3 container-left container-xs-gutter">
        <div className="h2 mb-3 text-light">Receive Assets</div>
        <p>Select account to receive assets into:</p>
        {keypairs.map((keypair, index) => (
          <Accordion
            key={keypair.nanoId}
            className="mb-2"
            activeKey={activeKey}
            onSelect={(eventKey) =>
              setActiveKey(eventKey !== activeKey ? eventKey : null)
            }
          >
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header>
                {keypair.label} - {formatKey(keypair.publicKey)}
              </Accordion.Header>
              <Accordion.Body>
                <div className="text-center">
                  <div className="text-light fw-bold fs-4">Public Key</div>
                  <div className="my-3">
                    <QRCode value={keypair.publicKey} width="250" />
                  </div>

                  <div className="my-3 text-wrap text-break text-light">
                    {keypair.publicKey}
                  </div>
                  <Button
                    ref={(el) => (buttonRefs.current[index] = el)}
                    onClick={() => handleCopy(keypair.publicKey)}
                    title="Copy public key to clipboard."
                  >
                    {copiedKeys[keypair.publicKey]
                      ? "Copied!"
                      : "Copy to Clipboard"}
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </Container>
    </>
  );
}

export default Receive;

```

# client/src/main.jsx

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

```

# client/src/store/authSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getItem, removeItem } from "./cryptoMemStore";
import {
  fetchEncryptedData,
  resetData,
  updateEncryptedData,
} from "./dataSlice";
import axios from "axios";
import { fetchEntriesForAllKeys, resetEntries } from "./entriesSlice";

export const login = createAsyncThunk(
  "auth/login",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const clientHashedUserId = getItem("clientHashedUserId");
      const clientHashedPassword = getItem("clientHashedPassword");

      const response = await axios.post("/api/auth/login", {
        clientHashedUserId,
        clientHashedPassword,
      });

      await dispatch(fetchEncryptedData());
      dispatch(fetchEntriesForAllKeys());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const clientHashedUserId = getItem("clientHashedUserId");
      const clientHashedPassword = getItem("clientHashedPassword");

      const response = await axios.post("/api/auth/register", {
        clientHashedUserId,
        clientHashedPassword,
      });

      if (response.data.clientHashedUserId) {
        await dispatch(login());
      }

      dispatch(updateEncryptedData({ keypairs: [], addresses: [] }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    const response = await axios.post("/api/auth/logout");

    removeItem("clientHashedUserId");
    removeItem("clientHashedPassword");
    removeItem("encryptionKey");

    dispatch(resetData());
    dispatch(resetEntries());

    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false, error: null },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { resetError } = authSlice.actions;

export default authSlice.reducer;

```

# client/src/store/cryptoMemStore.js

```javascript
let memStore = {};

export function setItem(key, value) {
  memStore[key] = value;
}

export function getItem(key) {
  return memStore[key];
}

export function removeItem(key) {
  delete memStore[key];
}

async function hashFunction(input) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Hashing failed:", error);
    throw error;
  }
}

async function kdfFunction(email, password, pin = "") {
  try {
    const passwordBuffer = new TextEncoder().encode(password);
    const salt = new TextEncoder().encode(email + pin);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const deriveParams = {
      name: "PBKDF2",
      salt: salt,
      iterations: 10000,
      hash: "SHA-256",
    };

    const aesKey = await crypto.subtle.deriveKey(
      deriveParams,
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    return aesKey;
  } catch (error) {
    console.error("Error in kdfFunction:", error);
    throw error;
  }
}

export async function processCredentials(email, password, pin = "") {
  try {
    const clientHashedUserId = await hashFunction(email);
    const clientHashedPassword = await hashFunction(password);
    const encryptionKey = await kdfFunction(email, password, pin);

    memStore = { clientHashedUserId, clientHashedPassword, encryptionKey };
  } catch (error) {
    console.error("Error processing credentials:", error);
    throw error;
  }
}

export async function encryptData(unencryptedData) {
  try {
    const encryptionKey = getItem("encryptionKey");
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const unencryptedDataString = JSON.stringify(unencryptedData);
    const data = new TextEncoder().encode(unencryptedDataString);

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      encryptionKey,
      data
    );

    const encryptedDataWithIv = new Uint8Array(
      iv.length + encryptedData.byteLength
    );
    encryptedDataWithIv.set(iv);
    encryptedDataWithIv.set(new Uint8Array(encryptedData), iv.length);

    const base64String = btoa(String.fromCharCode(...encryptedDataWithIv));

    return base64String;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}

export async function decryptData(base64String) {
  try {
    const encryptionKey = getItem("encryptionKey");

    const encryptedData = Uint8Array.from(atob(base64String), (c) =>
      c.charCodeAt(0)
    );

    const iv = encryptedData.slice(0, 16);
    const data = encryptedData.slice(16);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      encryptionKey,
      data
    );

    const decryptedDataString = new TextDecoder().decode(
      new Uint8Array(decryptedData)
    );
    const decryptedDataObject = JSON.parse(decryptedDataString);
    return decryptedDataObject;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}

```

# client/src/store/dataSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "./cryptoMemStore";
import axios from "axios";
import { nanoid } from "nanoid";

export const fetchEncryptedData = createAsyncThunk(
  "data/fetchEncryptedData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/vault");
      if (response.data.encryptedData === null) {
        return null;
      }
      const decryptedData = await decryptData(response.data.encryptedData);
      return decryptedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateEncryptedData = createAsyncThunk(
  "data/updateEncryptedData",
  async (unencryptedData, thunkAPI) => {
    try {
      const encryptedData = await encryptData(unencryptedData);
      const response = await axios.put("/api/vault", { encryptedData });
      const decryptedData = await decryptData(response.data.encryptedData);
      return decryptedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteEncryptedData = createAsyncThunk(
  "data/deleteEncryptedData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.delete("/api/vault");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addKeypair = createAsyncThunk(
  "data/addKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const nanoId = nanoid();

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs.push({ ...keypair, nanoId });

    newUnencryptedData.keypairs.sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const deleteKeypair = createAsyncThunk(
  "data/deleteKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs = newUnencryptedData.keypairs
      .filter((item) => item.nanoId !== keypair.nanoId)
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const updateKeypair = createAsyncThunk(
  "data/updateKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs = newUnencryptedData.keypairs
      .map((item) => (item.nanoId === keypair.nanoId ? keypair : item))
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const addAddress = createAsyncThunk(
  "data/addAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const nanoId = nanoid();

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses.push({ ...address, nanoId });
    newUnencryptedData.addresses.sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const deleteAddress = createAsyncThunk(
  "data/deleteAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses = newUnencryptedData.addresses
      .filter((item) => item.nanoId !== address.nanoId)
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const updateAddress = createAsyncThunk(
  "data/updateAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses = newUnencryptedData.addresses
      .map((item) => (item.nanoId === address.nanoId ? address : item))
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

const initialState = { unencryptedData: null, loading: false, error: null };

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: { resetData: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEncryptedData.fulfilled, (state, action) => {
        state.loading = false;
        state.unencryptedData = action.payload;
      })
      .addCase(fetchEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEncryptedData.fulfilled, (state, action) => {
        state.unencryptedData = action.payload;
        state.loading = false;
      })
      .addCase(updateEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEncryptedData.fulfilled, (state) => {
        state.loading = false;
        state.unencryptedData = null;
      })
      .addCase(deleteEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetData } = dataSlice.actions;

export default dataSlice.reducer;

```

# client/src/store/entriesSlice.js

```javascript
import { createSlice, createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";
import elliptic from "elliptic";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  async (publicKey, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BLOCKCRAFT_NODE_URL
        }/api/entries?publicKey=${publicKey}&pageLimit=10&sort=desc`
      );
      return { publicKey, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchEntriesForAllKeys = createAsyncThunk(
  "entries/fetchEntriesForAllKeys",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const keypairs = getState().data.unencryptedData.keypairs;
    try {
      const results = await Promise.all(
        keypairs.map(({ publicKey }) =>
          dispatch(fetchEntries(publicKey)).then(unwrapResult)
        )
      );
      return results;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addEntry = createAsyncThunk(
  "entries/addEntry",
  async ({ from, to, amount, privateKey }, thunkAPI) => {
    try {
      const balance = await computeAccountBalance(from);
      if (balance < amount) {
        return thunkAPI.rejectWithValue("Insufficient Balance");
      }

      const unsignedEntry = {
        from,
        to,
        amount,
        type: "crypto",
        initiationTimestamp: Date.now(),
        data: `Wallet transaction @ ${new Date()
          .toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(", ", "-")}`,
      };

      const entryHash = await hashEntry(unsignedEntry);
      const entryToSign = {
        ...unsignedEntry,
        hash: entryHash,
      };

      const signature = await signEntry(entryToSign, privateKey);
      const signedEntry = {
        ...unsignedEntry,
        hash: entryHash,
        signature: signature,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BLOCKCRAFT_NODE_URL}/api/entries`,
        signedEntry
      );

      thunkAPI.dispatch(fetchEntries(from));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

async function computeAccountBalance(publicKey) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BLOCKCRAFT_NODE_URL
      }/api/entries?publicKey=${publicKey}`
    );
    return response.data.meta.netAmount;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

function signEntry(entry, privateKeyHex) {
  const keyPair = ec.keyFromPrivate(privateKeyHex);
  const signature = keyPair.sign(JSON.stringify(entry));
  return signature.toDER("hex");
}

async function hashEntry(entry) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(entry));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const entriesSlice = createSlice({
  name: "entries",
  initialState: { data: {}, status: "idle", error: null },
  reducers: {
    resetEntries: () => {
      return { data: {}, status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { publicKey, data } = action.payload;
        state.data[publicKey] = data;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetEntries } = entriesSlice.actions;

export default entriesSlice.reducer;

```

# client/src/store/index.js

```javascript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dataSlice from "./dataSlice";
import entriesSlice from "./entriesSlice";

const store = configureStore({
  reducer: { auth: authReducer, data: dataSlice, entries: entriesSlice },
});

export default store;

```

# client/vite.config.js

```javascript
/* global process */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { Buffer } from "buffer";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../server/.env") });

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Blockcraft Vault",
        short_name: "B-Vault",
        description: "Blockcraft Vault Digital Wallet",
        theme_color: "#212529",
        background_color: "#212529",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/mstile-150x150.png",
            sizes: "150x150",
            type: "image/png",
          },
        ],
      },
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              !url.pathname.startsWith("/api"),
            handler: "CacheFirst",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      iconPaths: {
        favicon: "favicon.ico",
        favicon32: "favicon-32x32.png",
        favicon16: "favicon-16x16.png",
        appleTouchIcon: "apple-touch-icon-180x180.png",
        maskIcon: "maskable-icon-512x512.png",
        msTileImage: "mstile-150x150.png",
      },
    }),
  ],
  define: {
    "process.env": process.env,
    "process.browser": true,
    Buffer: [Buffer, "Buffer"],
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    https: {
      key: fs.readFileSync(join(__dirname, "192.168.1.195+2-key.pem")),
      cert: fs.readFileSync(join(__dirname, "192.168.1.195+2.pem")),
    },
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      external: ["buffer"],
      output: {
        globals: {
          buffer: "Buffer",
        },
      },
    },
  },
});

```

# genSourceCode.js

```javascript
/*
  File: genSourceCode.js
  Description: This script generates a markdown file that includes all the source code of the application. It recursively finds all .js, .jsx, README.md, and package.json files in the project directory, excluding the node_modules, dist, and public directories. For each file found, it determines the language based on the file extension, reads the file content, and appends it to the markdown file with appropriate markdown formatting. The markdown file is saved in the same directory as this script.
*/

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, "vaultSourceCode.md");

async function findFiles(dir, filelist = []) {
  const excludeDirs = ["node_modules", "dist", "public"];

  if (excludeDirs.some((excludeDir) => dir.includes(excludeDir))) {
    return filelist;
  }

  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await findFiles(filePath, filelist);
    } else if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".jsx") ||
      ["README.md", "package.json"].includes(file.name)
    ) {
      filelist.push(filePath);
    }
  }
  return filelist;
}

function determineLanguage(file) {
  if (file.endsWith(".md")) return "markdown";
  if (file.endsWith(".json")) return "json";
  if (file.endsWith(".js") || file.endsWith(".jsx")) return "javascript";
  return "plaintext";
}

async function appendFileContent(file, language) {
  try {
    const data = await fs.readFile(file, "utf8");
    const relativeFilePath = path.relative(__dirname, file);
    await fs.appendFile(
      outputFile,
      `# ${relativeFilePath}\n\n${
        language !== "markdown"
          ? `\`\`\`${language}\n${data}\n\`\`\`\n\n`
          : `${data}\n\n`
      }`
    );
    console.log(`Appended contents of ${relativeFilePath} to ${outputFile}`);
  } catch (err) {
    console.error(`Error processing file ${file}:`, err);
  }
}

async function processFiles() {
  try {
    await fs.writeFile(outputFile, "");

    const targetedDirs = [__dirname, path.join(__dirname, ".")];
    let files = [];
    for (const dir of targetedDirs) {
      const foundFiles = await findFiles(dir);
      files = files.concat(foundFiles);
    }

    for (const file of files) {
      const language = determineLanguage(file);
      await appendFileContent(file, language);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

processFiles();

```

# package.json

```json
{
  "name": "blockcraft-vault",
  "version": "0.1.8",
  "type": "module",
  "description": "\"Blockcraft-Vault is a secure, private, and anonymous application designed to store encryption keys and sensitive information using zero-knowledge encryption schemes. Ideal for blockchain wallets, voting systems, and other applications requiring high-security data management, this app ensures that sensitive data remains encrypted and the server never accesses unhashed user IDs, passwords, or data directly. Built on a PERN stack (PostgreSQL, Express, React, Node.js), this project leverages Redux for state management and Vite for building the front-end efficiently.\"",
  "main": "server/src/index.js",
  "scripts": {
    "build": "npm run build:client",
    "build:client": "cd client && npm run build",
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "lint": "concurrently \"npm run lint:client\" \"npm run lint:server\"",
    "lint:client": "cd client && npm run lint",
    "lint:server": "cd server && npm run lint",
    "test": "concurrently \"npm run test:client\" \"npm run test:server\"",
    "test:client": "cd client && npm run test",
    "test:server": "cd server && npm run test",
    "preview": "npm run build:client && cd client && npm run preview",
    "prod": "npm run build:client && cd server && npm run prod"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chrisallenarmbruster/blockcraft-vault.git"
  },
  "keywords": [
    "blockchain",
    "wallet"
  ],
  "author": "Chris Armbruster",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/chrisallenarmbruster/blockcraft-vault/issues"
  },
  "homepage": "https://github.com/chrisallenarmbruster/blockcraft-vault#readme",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}

```

# server/eslint.config.js

```javascript
import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Add your rules here
    },
  },
];

```

# server/package.json

```json
{
  "name": "blockcraft-vault-server",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "prod": "NODE_ENV=production node src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint"
  },
  "devDependencies": {
    "@eslint/js": "^9.2.0",
    "eslint": "^9.2.0",
    "globals": "^15.1.0",
    "nodemon": "^3.1.0"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "connect-session-sequelize": "^7.1.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "pg": "^8.11.5",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.3",
    "volleyball": "^1.5.1"
  }
}

```

# server/src/app.js

```javascript
import express from "express";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import passport from "passport";
import { sequelize } from "./db/index.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import routes from "./routes/index.js";
import "./routes/passportConfig.js";
import cors from "cors";
import volleyball from "volleyball";

const app = express();

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(cors());
app.use(volleyball);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "../../client/dist")));

app.use("/api", routes);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.log("error handler");
  console.error(error);
  if (!error.status) {
    error.status = 500;
  }
  res.status(error.status).json({
    status: error.status,
    message: error.message,
    name: error.name,
    comment: error.comment,
  });
});

export default app;

```

# server/src/db/index.js

```javascript
import Sequelize from "sequelize";
import UserModel from "./models/User.js";

import dotenv from "dotenv";
dotenv.config();

const config = { dialect: "postgres", protocol: "postgres", logging: false };

const sequelize = new Sequelize(process.env.DATABASE_URL, config);

const User = UserModel(sequelize, Sequelize.DataTypes);

async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

async function syncModels() {
  await sequelize.sync({ force: false });
  console.log("All database models were synchronized successfully.");
}

export { User, checkConnection, syncModels, sequelize };

```

# server/src/db/models/User.js

```javascript
import { Model } from "sequelize";

class User extends Model {}

const UserModel = (sequelize, DataTypes) => {
  User.init(
    {
      clientHashedUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      reHashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      encryptedData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

export default UserModel;

```

# server/src/index.js

```javascript
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

async function setUpDatabase() {
  try {
    const { checkConnection, syncModels } = await import("./db/index.js");
    await checkConnection();
    await syncModels();
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
}

async function startApp() {
  try {
    await setUpDatabase();
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the app:", error);
  }
}

startApp();

```

# server/src/routes/auth.js

```javascript
import express from "express";
import passport from "passport";
import { User } from "../db/index.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { clientHashedUserId, clientHashedPassword } = req.body;

    if (!clientHashedPassword) {
      const err = new Error("Password is required");
      err.status = 400;
      err.comment = "Password is required.";
      return next(err);
    }

    const existingUser = await User.findByPk(clientHashedUserId);
    if (existingUser) {
      const err = new Error("User already exists");
      err.status = 400;
      err.comment = "Provided email ID already in use.";
      return next(err);
    }

    const reHashedPassword = await bcrypt.hash(clientHashedPassword, 10);
    const newUser = await User.create({ clientHashedUserId, reHashedPassword });
    res.status(201).json(newUser);
  } catch (err) {
    err.status = 500;
    err.comment = "Server issue processing registration. Please try again.";
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      error.status = 400;
      error.comment = "Server issue processing login. Please try again.";
      return next(error);
    }
    if (!user) {
      const err = new Error(info.message);
      err.status = 404;
      err.comment = "No match for provided credentials.";
      return next(err);
    }
    req.logIn(user, (error) => {
      if (error) {
        error.status = 400;
        error.comment = "Server issue processing login. Please try again.";
        return next(error);
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  try {
    req.logout(() => {
      res.status(200).json({ message: "User logged out" });
    });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing POST /api/auth/logout route";
    next(error);
  }
});

router.get("/user-session", (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    } else {
      res.status(204).json({ message: "No user session" });
    }
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing GET /api/auth/user-session route";
    next(error);
  }
});

router.delete("/delete-user", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.clientHashedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.logout((error) => {
      if (error) {
        console.error(error);
        return next(error);
      }

      user
        .destroy()
        .then(() => {
          res.status(200).json({ message: "User account deleted" });
        })
        .catch((error) => {
          console.error(error);
          next(error);
        });
    });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing DEL /api/auth/delete-user route";
    next(error);
  }
});

export default router;

```

# server/src/routes/index.js

```javascript
import express from "express";
import auth from "./auth.js";
import vault from "./vault.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/vault", vault);

export default router;

```

# server/src/routes/passportConfig.js

```javascript
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../db/index.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "clientHashedUserId",
      passwordField: "clientHashedPassword",
    },
    async (clientHashedUserId, clientHashedPassword, done) => {
      try {
        const user = await User.findOne({ where: { clientHashedUserId } });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isValid = await bcrypt.compare(
          clientHashedPassword,
          user.reHashedPassword
        );

        if (!isValid) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.clientHashedUserId);
});

passport.deserializeUser(async (clientHashedUserId, done) => {
  try {
    const user = await User.findByPk(clientHashedUserId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

```

# server/src/routes/vault.js

```javascript
import express from "express";
import { User } from "../db/index.js";

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "User not authenticated" });
}

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.clientHashedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ encryptedData: user.encryptedData });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing GET /api/vault route";
    next(error);
  }
});

router.put("/", isAuthenticated, async (req, res, next) => {
  if (!req.body.encryptedData) {
    return res.status(400).json({ message: "Encrypted data is required" });
  }
  try {
    const [updated, [updatedUser]] = await User.update(
      { encryptedData: req.body.encryptedData },
      {
        where: { clientHashedUserId: req.user.clientHashedUserId },
        returning: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ encryptedData: updatedUser.encryptedData });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing PUT /api/vault route";
    next(error);
  }
});

router.delete("/", isAuthenticated, async (req, res, next) => {
  try {
    const [updated, [updatedUser]] = await User.update(
      { encryptedData: null },
      {
        where: { clientHashedUserId: req.user.clientHashedUserId },
        returning: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ encryptedData: updatedUser.encryptedData });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing DEL /api/vault route";
    next(error);
  }
});

export default router;

```

# README.md

# blockcraft-vault

Blockcraft Vault is my app for keeping private information such as encryption keys secure, private and anonymous through the use of a zero-knowledge encryption scheme. The server never sees or stores your unhashed user id and password, or your unencrypted data. Moreover, the hashed password will not decrypt the data. It is ideal for such use cases as a blockchain wallet, blockchain voting ballot and beyond.


# client/README.md

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# client/package.json

```json
{
  "name": "blockcraft-vault-client",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint 'src/**/*.{js,jsx}' --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@reduxjs/toolkit": "^2.2.3",
    "@vitejs/plugin-react-refresh": "^1.3.6",
    "axios": "^1.6.8",
    "bcryptjs": "^2.4.3",
    "bootstrap": "^5.3.3",
    "buffer": "^6.0.3",
    "crypto": "^1.0.1",
    "dotenv": "^16.4.5",
    "elliptic": "^6.5.5",
    "nanoid": "^5.0.7",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.2",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.51.4",
    "react-icons": "^5.2.1",
    "react-qr-scanner": "^1.0.0-alpha.11",
    "react-qrcode": "^0.3.6",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.23.0",
    "react-select": "^5.8.0",
    "redux": "^5.0.1",
    "reselect": "^5.1.0",
    "yup": "^1.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vite-pwa/assets-generator": "^0.2.4",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0",
    "vite-plugin-pwa": "^0.20.0"
  }
}

```

# client/src/Components/AddressAdd.jsx

```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addAddress } from "../store/dataSlice";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { BsPersonAdd } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const selectAddresses = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.addresses || []
);

function AddressAdd() {
  const addresses = useSelector(selectAddresses);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) => !addresses.some((address) => address.label === value)
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    clearErrors("publicKey");
    try {
      await dispatch(addAddress(data)).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to add address", error);
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  return (
    <>
      <BsPersonAdd
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
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                {...register("label")}
                isInvalid={!!errors.label}
                title="Type a friendly name for this contact."
                placeholder="Type a friendly name for this contact"
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label>Public Key</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                  placeholder="Type, paste or scan"
                  title="Type or paste a public key, or scan a QR code."
                />
                <Button
                  variant="outline-secondary"
                  className="rounded-right"
                  title="Click to scan QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddressAdd;

```

# client/src/Components/AddressDelete.jsx

```javascript
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteAddress } from "../store/dataSlice";
import { BsTrash } from "react-icons/bs";
import PropTypes from "prop-types";

function AddressDelete({ address }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    dispatch(deleteAddress(address));
    handleClose();
  };

  return (
    <>
      <BsTrash className="cursor-pointer text-danger" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the {`"${address.label}"`} contact?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AddressDelete.propTypes = {
  address: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};

export default AddressDelete;

```

# client/src/Components/AddressUpdate.jsx

```javascript
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Form, Modal, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateAddress } from "../store/dataSlice";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import { BsPencil } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const selectAddresses = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.addresses || []
);

function AddressUpdate({ address }) {
  const addresses = useSelector(selectAddresses);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) =>
            !addresses.some(
              (ad) => ad.label === value && ad.nanoId !== address.nanoId
            )
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: address,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    reset(address);
  }, [address, reset]);

  const onSubmit = async (data) => {
    console.log(data);
    clearErrors("publicKey");
    try {
      await dispatch(updateAddress({ ...address, ...data })).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  return (
    <>
      <BsPencil className="cursor-pointer text-primary" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} className="text-start">
            <Form.Group className="mb-3" controlId="updateFormLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                {...register("label")}
                isInvalid={!!errors.label}
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label>Public Key</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                />
                <Button
                  variant="outline-secondary rounded-right"
                  title="Click to scan a different QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AddressUpdate.propTypes = {
  address: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
  }),
};

export default AddressUpdate;

```

# client/src/Components/Addresses.jsx

```javascript
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import AddressUpdate from "./AddressUpdate";
import AddressDelete from "./AddressDelete";
import AddressAdd from "./AddressAdd";
import { useNavigate } from "react-router-dom";

function Addresses() {
  const addresses =
    useSelector((state) => state.data.unencryptedData?.addresses) || [];
  const navigate = useNavigate();

  const formatKey = (key) => {
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  return (
    <Container>
      <div className="d-flex align-items-center mb-3 h2">
        <div className="me-3">Contacts</div>
        <div title="Add New Contact">
          <AddressAdd />
        </div>
      </div>
      <Container>
        <Row className="mt-3 mb-3 border-bottom fw-bold">
          <Col xs={5}>Label</Col>
          <Col xs={4}>Public Key</Col>
          <Col xs={3}></Col>
        </Row>
        {addresses.map((address) => (
          <Row key={address.nanoId} className="pb-3 mb-3 border-bottom">
            <Col xs={5}>{address.label}</Col>
            <Col xs={4} title={address.publicKey}>
              {formatKey(address.publicKey)}
            </Col>
            <Col xs={3} className="text-center d-flex ">
              <div className="me-2" title="Edit Contact">
                <AddressUpdate address={address} />
              </div>
              <div title="Delete Contact">
                <AddressDelete address={address} />
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </Container>
  );
}

export default Addresses;

```

# client/src/Components/App.jsx

```javascript
import { useEffect } from "react";
import Login from "./Login";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Keypairs from "./Keypairs";
import { Routes, Route, useNavigate } from "react-router-dom";
import Addresses from "./Addresses";
import NavBar from "./NavBar";
import Assets from "./Assets";
import Receive from "./Receive";
import QRCodeScanner from "./QRCodeScanner";

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <>
          <NavBar />
          <Container className="mt-3 mt-4rem mb-mobile-6rem container-xl mw-375 container-xs-gutter">
            <Routes>
              <Route path="/" element={<Assets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/keypairs" element={<Keypairs />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/receive" element={<Receive />} />
              <Route path="/scan" element={<QRCodeScanner />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </>
      )}
    </>
  );
}

export default App;

```

# client/src/Components/Assets.jsx

```javascript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Accordion, Row, Col, Container } from "react-bootstrap";
import { fetchEntriesForAllKeys } from "../store/entriesSlice";

function Assets() {
  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];
  const entries = useSelector((state) => state.entries.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEntriesForAllKeys());
  }, [dispatch]);

  const formatKey = (key) => {
    if (key === "INCENTIVE" || key === "ICO") return key;
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  const total = keypairs.reduce((sum, keypair) => {
    const netAmount = entries[keypair.publicKey]?.meta?.netAmount || 0;
    return sum + netAmount;
  }, 0);

  return (
    <>
      <Container className="mt-0 mb-3 container-left">
        <div className="h2 mb-3 text-secondary">
          Assets: <span className="text-light">{total}</span>
        </div>
        <Row className="ms-1 me-1 mb-3">
          <Col xs={4}>Account</Col>
          <Col xs={4}>Key</Col>
          <Col xs={2} className="text-end ">
            Balance
          </Col>
          <Col xs={2} className="text-end"></Col>
        </Row>
        {keypairs.map((keypair, index) => (
          <Accordion key={keypair.nanoId} className="mb-2">
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header>
                <Row style={{ width: "100%" }}>
                  <Col xs={4}>{keypair.label}</Col>
                  <Col xs={4}>{formatKey(keypair.publicKey)}</Col>
                  <Col xs={3} className="text-end">
                    {entries[keypair.publicKey]?.meta?.netAmount || "0"}
                  </Col>
                  <Col xs={1} className="text-end"></Col>
                </Row>
              </Accordion.Header>
              <Accordion.Body>
                <h6>Latest Entries:</h6>
                <Table striped bordered hover size="sm" variant="dark">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>From/To</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries[keypair.publicKey]?.entries?.map((entry) => {
                      const date = new Date(entry.initiationTimestamp);
                      const formattedDate = `${
                        date.getMonth() + 1
                      }/${date.getDate()}/${date
                        .getFullYear()
                        .toString()
                        .substr(-2)}`;
                      return (
                        <tr key={entry.entryId}>
                          <td>{formattedDate}</td>
                          <td>
                            {entry.from === keypair.publicKey
                              ? formatKey(entry.to)
                              : formatKey(entry.from)}
                          </td>
                          <td className="text-end">
                            {entry.from === keypair.publicKey
                              ? -entry.amount
                              : entry.amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <div className="text-center text-light">
                  See more in{" "}
                  <a
                    className="text-orange"
                    href={`${
                      import.meta.env.VITE_BLOCKCRAFT_NODE_URL
                    }/entries?publicKey=${keypair.publicKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blockcraft Explorer
                  </a>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </Container>
    </>
  );
}

export default Assets;

```

# client/src/Components/EntryAdd.jsx

```javascript
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

```

# client/src/Components/FetchEntriesButton.jsx

```javascript
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchEntriesForAllKeys } from "../store/entriesSlice";

const FetchEntriesButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(fetchEntriesForAllKeys());
  };

  return <Button onClick={handleClick}>Fetch Entries for All Keys</Button>;
};

export default FetchEntriesButton;

```

# client/src/Components/KeypairAdd.jsx

```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import elliptic from "elliptic";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addKeypair } from "../store/dataSlice";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { BsNodePlus, BsEye, BsEyeSlash } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const selectKeypairs = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.keypairs || []
);

function generateKeyPair() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate("hex");
  const publicKeyCompressed = keyPair.getPublic().encode("hex", true);
  return { privateKey, publicKeyCompressed };
}

function KeypairAdd() {
  const keypairs = useSelector(selectKeypairs);
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) => !keypairs.some((keypair) => keypair.label === value)
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
      privateKey: yup
        .string()
        .matches(
          /^[a-fA-F0-9]{64}$/,
          "Private key must be a 64-character hexadecimal"
        )
        .required("Private Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    if (!validateKeyPair(data.privateKey, data.publicKey)) {
      setError("publicKey", {
        type: "manual",
        message: "Public key is not a cryptographic match for the private key",
      });
    } else {
      clearErrors("publicKey");
      try {
        await dispatch(addKeypair(data)).unwrap();
        handleClose();
      } catch (error) {
        console.error("Failed to add keypair:", error);
      }
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  function validateKeyPair(privateKey, publicKey) {
    try {
      const keyPair = ec.keyFromPrivate(privateKey);
      const derivedPublicKey = keyPair.getPublic().encode("hex", true);
      return derivedPublicKey === publicKey;
    } catch (error) {
      console.error("Failed to validate key pair:", error);
      return false;
    }
  }

  return (
    <>
      <BsNodePlus
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
          <Modal.Title>Add Keypair</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                {...register("label")}
                isInvalid={!!errors.label}
                title="Type a friendly name for this keypair."
                placeholder="Type a friendly name for this keypair"
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label className="d-flex justify-content-between">
                <div className="py-0">Public Key</div>
                <Button
                  title="If you don't have a keypair, you can generate one by clicking here."
                  variant="link"
                  className="py-0 text-orange"
                  onClick={() => {
                    const { privateKey, publicKeyCompressed } =
                      generateKeyPair();
                    setValue("publicKey", publicKeyCompressed);
                    setValue("privateKey", privateKey);
                  }}
                >
                  Generate New Keypair
                </Button>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                  placeholder="Type, paste, scan or generate"
                  title="Type a public key, scan a QR code or generate a new keypair."
                />
                <Button
                  variant="outline-secondary rounded-right"
                  title="Click to scan QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="updateFormPrivateKey">
              <Form.Label>Private Key</Form.Label>
              <InputGroup className="mbxs-5">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  {...register("privateKey")}
                  isInvalid={!!errors.privateKey}
                  placeholder="Type, paste or generate"
                  title="Type or paste private key here.."
                />
                <Button
                  variant="outline-secondary rounded-right"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Click to toggle private key visibility."
                >
                  {showPassword ? (
                    <BsEyeSlash className="text-light" />
                  ) : (
                    <BsEye className="text-light" />
                  )}
                </Button>

                <Form.Control.Feedback type="invalid">
                  {errors.privateKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KeypairAdd;

```

# client/src/Components/KeypairDelete.jsx

```javascript
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteKeypair } from "../store/dataSlice";
import { BsTrash } from "react-icons/bs";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

function KeypairDelete({ keypair }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    dispatch(deleteKeypair(keypair));
    handleClose();
  };

  return (
    <>
      <BsTrash className="cursor-pointer text-danger" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the {`"${keypair.label}"`} keypair?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

KeypairDelete.propTypes = {
  keypair: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};

export default KeypairDelete;

```

# client/src/Components/KeypairUpdate.jsx

```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import elliptic from "elliptic";
import { Modal, InputGroup, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateKeypair } from "../store/dataSlice";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import { BsPencil, BsEye, BsEyeSlash } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const selectKeypairs = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.keypairs || []
);

function KeypairUpdate({ keypair }) {
  const keypairs = useSelector(selectKeypairs);
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) =>
            !keypairs.some(
              (kp) => kp.label === value && kp.nanoId !== keypair.nanoId
            )
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
      privateKey: yup
        .string()
        .matches(
          /^[a-fA-F0-9]{64}$/,
          "Private key must be a 64-character hexadecimal"
        )
        .required("Private Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: keypair,
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    if (!validateKeyPair(data.privateKey, data.publicKey)) {
      setError("publicKey", {
        type: "manual",
        message: "Public key is not a cryptographic match for the private key",
      });
    } else {
      clearErrors("publicKey");
      try {
        await dispatch(updateKeypair({ ...keypair, ...data })).unwrap();
        handleClose();
      } catch (error) {
        console.error("Failed to update keypair:", error);
      }
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  function validateKeyPair(privateKey, publicKey) {
    try {
      const keyPair = ec.keyFromPrivate(privateKey);
      const derivedPublicKey = keyPair.getPublic().encode("hex", true);
      return derivedPublicKey === publicKey;
    } catch (error) {
      console.error("Failed to validate key pair:", error);
      return false;
    }
  }

  return (
    <>
      <BsPencil className="cursor-pointer text-primary" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Edit Keypair</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} className="text-start">
            <Form.Group className="mb-3" controlId="updateFormLabel">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                {...register("label")}
                isInvalid={!!errors.label}
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label>Public Key</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                />
                <Button
                  variant="outline-secondary rounded-right"
                  title="Click to scan a different QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="updateFormPrivateKey">
              <Form.Label>Private Key</Form.Label>
              <InputGroup className="mb-5">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  {...register("privateKey")}
                  isInvalid={!!errors.privateKey}
                />
                <Button
                  variant="outline-secondary rounded-right"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Click to toggle private key visibility."
                >
                  {showPassword ? (
                    <BsEyeSlash className="text-light" />
                  ) : (
                    <BsEye className="text-light" />
                  )}
                </Button>

                <Form.Control.Feedback type="invalid">
                  {errors.privateKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

KeypairUpdate.propTypes = {
  keypair: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
  }),
};

export default KeypairUpdate;

```

# client/src/Components/Keypairs.jsx

```javascript
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import KeypairDelete from "./KeypairDelete";
import KeypairUpdate from "./KeypairUpdate";
import KeypairAdd from "./KeypairAdd";

function Keypairs() {
  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];

  const formatKey = (key) => {
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  return (
    <Container>
      <div className="d-flex align-items-center mb-3 h2">
        <div className="me-3">Keychain</div>
        <div title="Add New Keypair">
          <KeypairAdd />
        </div>
      </div>
      <Container>
        <Row className="mt-3 mb-3 border-bottom fw-bold">
          <Col xs={5}>Label</Col>
          <Col xs={4}>Public Key</Col>
          <Col xs={3}></Col>
        </Row>
        {keypairs.map((keypair) => (
          <Row key={keypair.nanoId} className="pb-3 mb-3 border-bottom">
            <Col xs={5}>{keypair.label}</Col>
            <Col xs={4} title={keypair.publicKey}>
              {formatKey(keypair.publicKey)}
            </Col>
            <Col xs={3} className="text-center d-flex ">
              <div className="me-2" title="Edit Keypair">
                <KeypairUpdate keypair={keypair} />
              </div>
              <div title="Delete Keypair">
                <KeypairDelete keypair={keypair} />
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </Container>
  );
}

export default Keypairs;

```

# client/src/Components/Login.jsx

```javascript
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { processCredentials } from "../store/cryptoMemStore";
import {
  login,
  register as registerThunk,
  resetError,
} from "../store/authSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { BsSafe } from "react-icons/bs";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup.string(),
});

function Login() {
  const isError = useSelector((state) => state.auth.error);

  const [mode, setMode] = useState("login");
  const [isMobile, setIsMobile] = useState(
    window.innerWidth > 576 ? false : true
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 576 ? false : true);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  }, [location, navigate]);

  const onSubmit = async (data) => {
    let { email, password, confirmPassword } = data;

    email = email.toLowerCase();

    if (mode === "register" && password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      await processCredentials(email, password);

      if (mode === "login") {
        dispatch(login());
      } else {
        dispatch(registerThunk());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal show={!isError} centered contentClassName="dark-modal">
        <Form onSubmit={handleSubmit(onSubmit)} className="px-2">
          <Modal.Body>
            {" "}
            <h1
              className={`${
                isMobile ? "display-4" : "h2"
              } mt-3 mb-1  d-flex align-items-center justify-content-center text-light fw-bold`}
            >
              <BsSafe className="me-2 text-light" /> Blockcraft Vault
            </h1>
            <h2
              className={`${
                isMobile ? "display-4" : "h2"
              } text-center mt-0 mb-5 text-secondary fw-bold`}
            >
              {mode === "login" ? "Login" : "Registration"}
            </h2>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={
                  mode === "login" ? 'try "demo@email.com"' : "Enter email ID"
                }
                {...register("email")}
                isInvalid={!!errors.email}
                tabIndex={1}
                title={
                  mode === "login"
                    ? "Enter your email ID to login or use 'demo@email.com' to test drive the app."
                    : "Enter a valid email address to use as your login id.  This will be hashed before being sent to the server and stored." +
                      " The server will never have access to your email address."
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                title={
                  mode === "login"
                    ? "Enter password.  If test driving the app with 'demo@email.com' use 'demo' as the password."
                    : "Enter a password to use for login. This will be hashed before being sent to the server " +
                      "and then hashed again by the server and stored. The server will never have access to to your password. " +
                      "This password will be used to log you in and encrypt/decrpyt your data before sending it to " +
                      "and after receiving it from the server. It is important to remember this password! " +
                      "This is a zero-knowledge encryption app that prioritizes privacy, anonymity and security over convenience. " +
                      "Your password cannot be recovered if lost. If you forget your password, you will need to register again and lose your data."
                }
                placeholder={mode === "login" ? 'try "demo"' : "Enter password"}
                {...register("password")}
                tabIndex={2}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            {mode === "register" && (
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  title="Re-enter the password you entered above to confirm it."
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  isInvalid={!!errors.confirmPassword}
                  tabIndex={3}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}{" "}
            <div className="d-flex justify-content-between w-100">
              <Button
                variant="link"
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-decoration-none"
                tabIndex={5}
              >
                {mode === "login" ? "Register Instead" : "Login Instead"}
              </Button>
              <Button variant="primary" type="submit" tabIndex={4}>
                {mode === "login" ? "Login" : "Register"}
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>

      <Modal
        show={isError}
        onHide={() => dispatch(resetError())}
        centered
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {mode === "login" ? "Login" : "Registration"} Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="my-3 text-center">{isError?.comment}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => dispatch(resetError())}
            tabIndex={1}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;

```

# client/src/Components/NavBar.jsx

```javascript
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Modal, Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  BsSafe,
  BsBoxArrowInDownRight,
  BsBoxArrowUpRight,
  BsPiggyBank,
  BsKey,
  BsPersonRolodex,
  BsPower,
} from "react-icons/bs";
import EntryAdd from "./EntryAdd";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    window.innerWidth > 576 ? false : true
  );
  const [show, setShow] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 576 ? false : true);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const checkViewportHeight = () => {
      const currentHeight = window.innerHeight;
      if (currentHeight !== viewportHeight) {
        setViewportHeight(currentHeight);
      }
    };

    const intervalId = setInterval(checkViewportHeight, 150); // Check every 150ms

    return () => {
      clearInterval(intervalId);
    };
  }, [viewportHeight]);

  return (
    <>
      {isMobile && (
        <Container className="d-flex align-items-center fs-5 mt-1 container-xl mw-375">
          <BsSafe className="me-2 text-light" /> Blockcraft Vault
        </Container>
      )}
      <Navbar
        variant="dark"
        fixed={isMobile ? "bottom" : "top"}
        className={`container-xl mw-375 ${isMobile ? "pb-0" : "pt-0"}`}
        style={isMobile ? { position: "fixed", bottom: 0, width: "100%" } : {}}
      >
        <Container>
          {!isMobile && (
            <Navbar.Brand
              as={Link}
              to="/assets"
              className="text-light d-none d-sm-block"
            >
              Blockcraft Vault
            </Navbar.Brand>
          )}
          <Nav
            className={`me-auto ${
              isMobile ? "w-100  d-flex justify-content-around" : ""
            }`}
          >
            <Nav.Link as={Link} to="/home">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPiggyBank size={30} />
                  <div className="fs-7 mt-1">Assets</div>
                </div>
              ) : (
                "Assets"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/keypairs">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsKey size={30} />
                  <div className="fs-7 mt-1">Keys</div>
                </div>
              ) : (
                "Keys"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/addresses">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPersonRolodex size={30} />
                  <div className="fs-7 mt-1">Contacts</div>
                </div>
              ) : (
                "Contacts"
              )}
            </Nav.Link>
            <Nav.Link onClick={handleShow}>
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsBoxArrowUpRight size={30} />
                  <div className="fs-7 mt-1">Send</div>
                </div>
              ) : (
                "Send"
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/receive">
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsBoxArrowInDownRight size={30} />
                  <div className="fs-7 mt-1">Receive</div>
                </div>
              ) : (
                "Receive"
              )}
            </Nav.Link>

            <Nav.Link
              as={Link}
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              {" "}
              {isMobile ? (
                <div className="d-flex flex-column align-items-center text-light">
                  <BsPower size={30} />
                  <div className="fs-7 mt-1">Logout</div>
                </div>
              ) : (
                "Logout"
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <EntryAdd show={show} handleClose={handleClose} />
    </>
  );
}

export default NavBar;

```

# client/src/Components/QRCodeScanner.jsx

```javascript
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

```

# client/src/Components/Receive.jsx

```javascript
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Accordion, Container, Button } from "react-bootstrap";
import { QRCode } from "react-qrcode";

function Receive() {
  const [copiedKeys, setCopiedKeys] = useState({});
  const [activeKey, setActiveKey] = useState(null);
  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];

  const buttonRefs = useRef([]);

  useEffect(() => {
    if (activeKey !== null) {
      setTimeout(() => {
        buttonRefs.current[activeKey].focus();
      }, 0);
    }
  }, [activeKey]);

  const formatKey = (key) => {
    if (key === "INCENTIVE" || key === "ICO") return key;
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  const handleCopy = async (publicKey) => {
    await navigator.clipboard.writeText(publicKey);
    setCopiedKeys({ ...copiedKeys, [publicKey]: true });
    setTimeout(
      () => setCopiedKeys({ ...copiedKeys, [publicKey]: false }),
      2000
    );
  };

  return (
    <>
      <Container className="mt-0 mb-3 container-left container-xs-gutter">
        <div className="h2 mb-3 text-light">Receive Assets</div>
        <p>Select account to receive assets into:</p>
        {keypairs.map((keypair, index) => (
          <Accordion
            key={keypair.nanoId}
            className="mb-2"
            activeKey={activeKey}
            onSelect={(eventKey) =>
              setActiveKey(eventKey !== activeKey ? eventKey : null)
            }
          >
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header>
                {keypair.label} - {formatKey(keypair.publicKey)}
              </Accordion.Header>
              <Accordion.Body>
                <div className="text-center">
                  <div className="text-light fw-bold fs-4">Public Key</div>
                  <div className="my-3">
                    <QRCode value={keypair.publicKey} width="250" />
                  </div>

                  <div className="my-3 text-wrap text-break text-light">
                    {keypair.publicKey}
                  </div>
                  <Button
                    ref={(el) => (buttonRefs.current[index] = el)}
                    onClick={() => handleCopy(keypair.publicKey)}
                    title="Copy public key to clipboard."
                  >
                    {copiedKeys[keypair.publicKey]
                      ? "Copied!"
                      : "Copy to Clipboard"}
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </Container>
    </>
  );
}

export default Receive;

```

# client/src/main.jsx

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

```

# client/src/store/authSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getItem, removeItem } from "./cryptoMemStore";
import {
  fetchEncryptedData,
  resetData,
  updateEncryptedData,
} from "./dataSlice";
import axios from "axios";
import { fetchEntriesForAllKeys, resetEntries } from "./entriesSlice";

export const login = createAsyncThunk(
  "auth/login",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const clientHashedUserId = getItem("clientHashedUserId");
      const clientHashedPassword = getItem("clientHashedPassword");

      const response = await axios.post("/api/auth/login", {
        clientHashedUserId,
        clientHashedPassword,
      });

      await dispatch(fetchEncryptedData());
      dispatch(fetchEntriesForAllKeys());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const clientHashedUserId = getItem("clientHashedUserId");
      const clientHashedPassword = getItem("clientHashedPassword");

      const response = await axios.post("/api/auth/register", {
        clientHashedUserId,
        clientHashedPassword,
      });

      if (response.data.clientHashedUserId) {
        await dispatch(login());
      }

      dispatch(updateEncryptedData({ keypairs: [], addresses: [] }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    const response = await axios.post("/api/auth/logout");

    removeItem("clientHashedUserId");
    removeItem("clientHashedPassword");
    removeItem("encryptionKey");

    dispatch(resetData());
    dispatch(resetEntries());

    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false, error: null },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { resetError } = authSlice.actions;

export default authSlice.reducer;

```

# client/src/store/cryptoMemStore.js

```javascript
let memStore = {};

export function setItem(key, value) {
  memStore[key] = value;
}

export function getItem(key) {
  return memStore[key];
}

export function removeItem(key) {
  delete memStore[key];
}

async function hashFunction(input) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Hashing failed:", error);
    throw error;
  }
}

async function kdfFunction(email, password, pin = "") {
  try {
    const passwordBuffer = new TextEncoder().encode(password);
    const salt = new TextEncoder().encode(email + pin);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const deriveParams = {
      name: "PBKDF2",
      salt: salt,
      iterations: 10000,
      hash: "SHA-256",
    };

    const aesKey = await crypto.subtle.deriveKey(
      deriveParams,
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    return aesKey;
  } catch (error) {
    console.error("Error in kdfFunction:", error);
    throw error;
  }
}

export async function processCredentials(email, password, pin = "") {
  try {
    const clientHashedUserId = await hashFunction(email);
    const clientHashedPassword = await hashFunction(password);
    const encryptionKey = await kdfFunction(email, password, pin);

    memStore = { clientHashedUserId, clientHashedPassword, encryptionKey };
  } catch (error) {
    console.error("Error processing credentials:", error);
    throw error;
  }
}

export async function encryptData(unencryptedData) {
  try {
    const encryptionKey = getItem("encryptionKey");
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const unencryptedDataString = JSON.stringify(unencryptedData);
    const data = new TextEncoder().encode(unencryptedDataString);

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      encryptionKey,
      data
    );

    const encryptedDataWithIv = new Uint8Array(
      iv.length + encryptedData.byteLength
    );
    encryptedDataWithIv.set(iv);
    encryptedDataWithIv.set(new Uint8Array(encryptedData), iv.length);

    const base64String = btoa(String.fromCharCode(...encryptedDataWithIv));

    return base64String;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}

export async function decryptData(base64String) {
  try {
    const encryptionKey = getItem("encryptionKey");

    const encryptedData = Uint8Array.from(atob(base64String), (c) =>
      c.charCodeAt(0)
    );

    const iv = encryptedData.slice(0, 16);
    const data = encryptedData.slice(16);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      encryptionKey,
      data
    );

    const decryptedDataString = new TextDecoder().decode(
      new Uint8Array(decryptedData)
    );
    const decryptedDataObject = JSON.parse(decryptedDataString);
    return decryptedDataObject;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}

```

# client/src/store/dataSlice.js

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "./cryptoMemStore";
import axios from "axios";
import { nanoid } from "nanoid";

export const fetchEncryptedData = createAsyncThunk(
  "data/fetchEncryptedData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/vault");
      if (response.data.encryptedData === null) {
        return null;
      }
      const decryptedData = await decryptData(response.data.encryptedData);
      return decryptedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateEncryptedData = createAsyncThunk(
  "data/updateEncryptedData",
  async (unencryptedData, thunkAPI) => {
    try {
      const encryptedData = await encryptData(unencryptedData);
      const response = await axios.put("/api/vault", { encryptedData });
      const decryptedData = await decryptData(response.data.encryptedData);
      return decryptedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteEncryptedData = createAsyncThunk(
  "data/deleteEncryptedData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.delete("/api/vault");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addKeypair = createAsyncThunk(
  "data/addKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const nanoId = nanoid();

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs.push({ ...keypair, nanoId });

    newUnencryptedData.keypairs.sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const deleteKeypair = createAsyncThunk(
  "data/deleteKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs = newUnencryptedData.keypairs
      .filter((item) => item.nanoId !== keypair.nanoId)
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const updateKeypair = createAsyncThunk(
  "data/updateKeypair",
  async (keypair, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.keypairs = newUnencryptedData.keypairs
      .map((item) => (item.nanoId === keypair.nanoId ? keypair : item))
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const addAddress = createAsyncThunk(
  "data/addAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const nanoId = nanoid();

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses.push({ ...address, nanoId });
    newUnencryptedData.addresses.sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const deleteAddress = createAsyncThunk(
  "data/deleteAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses = newUnencryptedData.addresses
      .filter((item) => item.nanoId !== address.nanoId)
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

export const updateAddress = createAsyncThunk(
  "data/updateAddress",
  async (address, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { unencryptedData } = getState().data;

    const newUnencryptedData = JSON.parse(JSON.stringify(unencryptedData));

    newUnencryptedData.addresses = newUnencryptedData.addresses
      .map((item) => (item.nanoId === address.nanoId ? address : item))
      .sort((a, b) => a.label.localeCompare(b.label));

    return dispatch(updateEncryptedData(newUnencryptedData));
  }
);

const initialState = { unencryptedData: null, loading: false, error: null };

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: { resetData: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEncryptedData.fulfilled, (state, action) => {
        state.loading = false;
        state.unencryptedData = action.payload;
      })
      .addCase(fetchEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEncryptedData.fulfilled, (state, action) => {
        state.unencryptedData = action.payload;
        state.loading = false;
      })
      .addCase(updateEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEncryptedData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEncryptedData.fulfilled, (state) => {
        state.loading = false;
        state.unencryptedData = null;
      })
      .addCase(deleteEncryptedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetData } = dataSlice.actions;

export default dataSlice.reducer;

```

# client/src/store/entriesSlice.js

```javascript
import { createSlice, createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";
import elliptic from "elliptic";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  async (publicKey, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BLOCKCRAFT_NODE_URL
        }/api/entries?publicKey=${publicKey}&pageLimit=10&sort=desc`
      );
      return { publicKey, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchEntriesForAllKeys = createAsyncThunk(
  "entries/fetchEntriesForAllKeys",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const keypairs = getState().data.unencryptedData.keypairs;
    try {
      const results = await Promise.all(
        keypairs.map(({ publicKey }) =>
          dispatch(fetchEntries(publicKey)).then(unwrapResult)
        )
      );
      return results;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addEntry = createAsyncThunk(
  "entries/addEntry",
  async ({ from, to, amount, privateKey }, thunkAPI) => {
    try {
      const balance = await computeAccountBalance(from);
      if (balance < amount) {
        return thunkAPI.rejectWithValue("Insufficient Balance");
      }

      const unsignedEntry = {
        from,
        to,
        amount,
        type: "crypto",
        initiationTimestamp: Date.now(),
        data: `Wallet transaction @ ${new Date()
          .toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(", ", "-")}`,
      };

      const entryHash = await hashEntry(unsignedEntry);
      const entryToSign = {
        ...unsignedEntry,
        hash: entryHash,
      };

      const signature = await signEntry(entryToSign, privateKey);
      const signedEntry = {
        ...unsignedEntry,
        hash: entryHash,
        signature: signature,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BLOCKCRAFT_NODE_URL}/api/entries`,
        signedEntry
      );

      thunkAPI.dispatch(fetchEntries(from));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

async function computeAccountBalance(publicKey) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BLOCKCRAFT_NODE_URL
      }/api/entries?publicKey=${publicKey}`
    );
    return response.data.meta.netAmount;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

function signEntry(entry, privateKeyHex) {
  const keyPair = ec.keyFromPrivate(privateKeyHex);
  const signature = keyPair.sign(JSON.stringify(entry));
  return signature.toDER("hex");
}

async function hashEntry(entry) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(entry));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const entriesSlice = createSlice({
  name: "entries",
  initialState: { data: {}, status: "idle", error: null },
  reducers: {
    resetEntries: () => {
      return { data: {}, status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { publicKey, data } = action.payload;
        state.data[publicKey] = data;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetEntries } = entriesSlice.actions;

export default entriesSlice.reducer;

```

# client/src/store/index.js

```javascript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dataSlice from "./dataSlice";
import entriesSlice from "./entriesSlice";

const store = configureStore({
  reducer: { auth: authReducer, data: dataSlice, entries: entriesSlice },
});

export default store;

```

# client/vite.config.js

```javascript
/* global process */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { Buffer } from "buffer";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../server/.env") });

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Blockcraft Vault",
        short_name: "B-Vault",
        description: "Blockcraft Vault Digital Wallet",
        theme_color: "#212529",
        background_color: "#212529",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/mstile-150x150.png",
            sizes: "150x150",
            type: "image/png",
          },
        ],
      },
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              !url.pathname.startsWith("/api"),
            handler: "CacheFirst",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      iconPaths: {
        favicon: "favicon.ico",
        favicon32: "favicon-32x32.png",
        favicon16: "favicon-16x16.png",
        appleTouchIcon: "apple-touch-icon-180x180.png",
        maskIcon: "maskable-icon-512x512.png",
        msTileImage: "mstile-150x150.png",
      },
    }),
  ],
  define: {
    "process.env": process.env,
    "process.browser": true,
    Buffer: [Buffer, "Buffer"],
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    https: {
      key: fs.readFileSync(join(__dirname, "192.168.1.195+2-key.pem")),
      cert: fs.readFileSync(join(__dirname, "192.168.1.195+2.pem")),
    },
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      external: ["buffer"],
      output: {
        globals: {
          buffer: "Buffer",
        },
      },
    },
  },
});

```

# genSourceCode.js

```javascript
/*
  File: genSourceCode.js
  Description: This script generates a markdown file that includes all the source code of the application. It recursively finds all .js, .jsx, README.md, and package.json files in the project directory, excluding the node_modules, dist, and public directories. For each file found, it determines the language based on the file extension, reads the file content, and appends it to the markdown file with appropriate markdown formatting. The markdown file is saved in the same directory as this script.
*/

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, "vaultSourceCode.md");

async function findFiles(dir, filelist = []) {
  const excludeDirs = ["node_modules", "dist", "public"];

  if (excludeDirs.some((excludeDir) => dir.includes(excludeDir))) {
    return filelist;
  }

  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await findFiles(filePath, filelist);
    } else if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".jsx") ||
      ["README.md", "package.json"].includes(file.name)
    ) {
      filelist.push(filePath);
    }
  }
  return filelist;
}

function determineLanguage(file) {
  if (file.endsWith(".md")) return "markdown";
  if (file.endsWith(".json")) return "json";
  if (file.endsWith(".js") || file.endsWith(".jsx")) return "javascript";
  return "plaintext";
}

async function appendFileContent(file, language) {
  try {
    const data = await fs.readFile(file, "utf8");
    const relativeFilePath = path.relative(__dirname, file);
    await fs.appendFile(
      outputFile,
      `# ${relativeFilePath}\n\n${
        language !== "markdown"
          ? `\`\`\`${language}\n${data}\n\`\`\`\n\n`
          : `${data}\n\n`
      }`
    );
    console.log(`Appended contents of ${relativeFilePath} to ${outputFile}`);
  } catch (err) {
    console.error(`Error processing file ${file}:`, err);
  }
}

async function processFiles() {
  try {
    await fs.writeFile(outputFile, "");

    const targetedDirs = [__dirname, path.join(__dirname, ".")];
    let files = [];
    for (const dir of targetedDirs) {
      const foundFiles = await findFiles(dir);
      files = files.concat(foundFiles);
    }

    for (const file of files) {
      const language = determineLanguage(file);
      await appendFileContent(file, language);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

processFiles();

```

# package.json

```json
{
  "name": "blockcraft-vault",
  "version": "0.1.8",
  "type": "module",
  "description": "\"Blockcraft-Vault is a secure, private, and anonymous application designed to store encryption keys and sensitive information using zero-knowledge encryption schemes. Ideal for blockchain wallets, voting systems, and other applications requiring high-security data management, this app ensures that sensitive data remains encrypted and the server never accesses unhashed user IDs, passwords, or data directly. Built on a PERN stack (PostgreSQL, Express, React, Node.js), this project leverages Redux for state management and Vite for building the front-end efficiently.\"",
  "main": "server/src/index.js",
  "scripts": {
    "build": "npm run build:client",
    "build:client": "cd client && npm run build",
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "lint": "concurrently \"npm run lint:client\" \"npm run lint:server\"",
    "lint:client": "cd client && npm run lint",
    "lint:server": "cd server && npm run lint",
    "test": "concurrently \"npm run test:client\" \"npm run test:server\"",
    "test:client": "cd client && npm run test",
    "test:server": "cd server && npm run test",
    "preview": "npm run build:client && cd client && npm run preview",
    "prod": "npm run build:client && cd server && npm run prod"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chrisallenarmbruster/blockcraft-vault.git"
  },
  "keywords": [
    "blockchain",
    "wallet"
  ],
  "author": "Chris Armbruster",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/chrisallenarmbruster/blockcraft-vault/issues"
  },
  "homepage": "https://github.com/chrisallenarmbruster/blockcraft-vault#readme",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}

```

# server/eslint.config.js

```javascript
import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Add your rules here
    },
  },
];

```

# server/package.json

```json
{
  "name": "blockcraft-vault-server",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "prod": "NODE_ENV=production node src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint"
  },
  "devDependencies": {
    "@eslint/js": "^9.2.0",
    "eslint": "^9.2.0",
    "globals": "^15.1.0",
    "nodemon": "^3.1.0"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "connect-session-sequelize": "^7.1.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "pg": "^8.11.5",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.3",
    "volleyball": "^1.5.1"
  }
}

```

# server/src/app.js

```javascript
import express from "express";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import passport from "passport";
import { sequelize } from "./db/index.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import routes from "./routes/index.js";
import "./routes/passportConfig.js";
import cors from "cors";
import volleyball from "volleyball";

const app = express();

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(cors());
app.use(volleyball);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "../../client/dist")));

app.use("/api", routes);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.log("error handler");
  console.error(error);
  if (!error.status) {
    error.status = 500;
  }
  res.status(error.status).json({
    status: error.status,
    message: error.message,
    name: error.name,
    comment: error.comment,
  });
});

export default app;

```

# server/src/db/index.js

```javascript
import Sequelize from "sequelize";
import UserModel from "./models/User.js";

import dotenv from "dotenv";
dotenv.config();

const config = { dialect: "postgres", protocol: "postgres", logging: false };

const sequelize = new Sequelize(process.env.DATABASE_URL, config);

const User = UserModel(sequelize, Sequelize.DataTypes);

async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

async function syncModels() {
  await sequelize.sync({ force: false });
  console.log("All database models were synchronized successfully.");
}

export { User, checkConnection, syncModels, sequelize };

```

# server/src/db/models/User.js

```javascript
import { Model } from "sequelize";

class User extends Model {}

const UserModel = (sequelize, DataTypes) => {
  User.init(
    {
      clientHashedUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      reHashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      encryptedData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

export default UserModel;

```

# server/src/index.js

```javascript
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

async function setUpDatabase() {
  try {
    const { checkConnection, syncModels } = await import("./db/index.js");
    await checkConnection();
    await syncModels();
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
}

async function startApp() {
  try {
    await setUpDatabase();
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the app:", error);
  }
}

startApp();

```

# server/src/routes/auth.js

```javascript
import express from "express";
import passport from "passport";
import { User } from "../db/index.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { clientHashedUserId, clientHashedPassword } = req.body;

    if (!clientHashedPassword) {
      const err = new Error("Password is required");
      err.status = 400;
      err.comment = "Password is required.";
      return next(err);
    }

    const existingUser = await User.findByPk(clientHashedUserId);
    if (existingUser) {
      const err = new Error("User already exists");
      err.status = 400;
      err.comment = "Provided email ID already in use.";
      return next(err);
    }

    const reHashedPassword = await bcrypt.hash(clientHashedPassword, 10);
    const newUser = await User.create({ clientHashedUserId, reHashedPassword });
    res.status(201).json(newUser);
  } catch (err) {
    err.status = 500;
    err.comment = "Server issue processing registration. Please try again.";
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      error.status = 400;
      error.comment = "Server issue processing login. Please try again.";
      return next(error);
    }
    if (!user) {
      const err = new Error(info.message);
      err.status = 404;
      err.comment = "No match for provided credentials.";
      return next(err);
    }
    req.logIn(user, (error) => {
      if (error) {
        error.status = 400;
        error.comment = "Server issue processing login. Please try again.";
        return next(error);
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  try {
    req.logout(() => {
      res.status(200).json({ message: "User logged out" });
    });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing POST /api/auth/logout route";
    next(error);
  }
});

router.get("/user-session", (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    } else {
      res.status(204).json({ message: "No user session" });
    }
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing GET /api/auth/user-session route";
    next(error);
  }
});

router.delete("/delete-user", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.clientHashedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.logout((error) => {
      if (error) {
        console.error(error);
        return next(error);
      }

      user
        .destroy()
        .then(() => {
          res.status(200).json({ message: "User account deleted" });
        })
        .catch((error) => {
          console.error(error);
          next(error);
        });
    });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing DEL /api/auth/delete-user route";
    next(error);
  }
});

export default router;

```

# server/src/routes/index.js

```javascript
import express from "express";
import auth from "./auth.js";
import vault from "./vault.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/vault", vault);

export default router;

```

# server/src/routes/passportConfig.js

```javascript
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../db/index.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "clientHashedUserId",
      passwordField: "clientHashedPassword",
    },
    async (clientHashedUserId, clientHashedPassword, done) => {
      try {
        const user = await User.findOne({ where: { clientHashedUserId } });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isValid = await bcrypt.compare(
          clientHashedPassword,
          user.reHashedPassword
        );

        if (!isValid) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.clientHashedUserId);
});

passport.deserializeUser(async (clientHashedUserId, done) => {
  try {
    const user = await User.findByPk(clientHashedUserId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

```

# server/src/routes/vault.js

```javascript
import express from "express";
import { User } from "../db/index.js";

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "User not authenticated" });
}

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.clientHashedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ encryptedData: user.encryptedData });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing GET /api/vault route";
    next(error);
  }
});

router.put("/", isAuthenticated, async (req, res, next) => {
  if (!req.body.encryptedData) {
    return res.status(400).json({ message: "Encrypted data is required" });
  }
  try {
    const [updated, [updatedUser]] = await User.update(
      { encryptedData: req.body.encryptedData },
      {
        where: { clientHashedUserId: req.user.clientHashedUserId },
        returning: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ encryptedData: updatedUser.encryptedData });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing PUT /api/vault route";
    next(error);
  }
});

router.delete("/", isAuthenticated, async (req, res, next) => {
  try {
    const [updated, [updatedUser]] = await User.update(
      { encryptedData: null },
      {
        where: { clientHashedUserId: req.user.clientHashedUserId },
        returning: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ encryptedData: updatedUser.encryptedData });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing DEL /api/vault route";
    next(error);
  }
});

export default router;

```

