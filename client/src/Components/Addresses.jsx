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
        <span className="me-3">Contacts</span>
        <AddressAdd />
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
            <Col xs={4}>{formatKey(address.publicKey)}</Col>
            <Col xs={3} className="text-center d-flex ">
              <div className="me-2">
                <AddressUpdate address={address} />
              </div>
              <div>
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
