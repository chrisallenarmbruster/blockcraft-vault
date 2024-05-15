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
      <Container className="mt-0 mb-3 container-md container-left" fluid="md">
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
                        <tr key={entry.nanoId}>
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
                <div className="text-center">
                  See more in{" "}
                  <a
                    className="text-light"
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
