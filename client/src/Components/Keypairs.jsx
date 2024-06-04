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
