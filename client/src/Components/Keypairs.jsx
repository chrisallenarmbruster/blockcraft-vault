import { useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import KeypairDelete from "./KeypairDelete";
import { useNavigate } from "react-router-dom";
import FetchEntriesButton from "./FetchEntriesButton";

function Keypairs() {
  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];
  const entries = useSelector((state) => state.entries.data);
  const navigate = useNavigate();

  const formatKey = (key) => {
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  const total = keypairs.reduce((sum, keypair) => {
    const netAmount = entries[keypair.publicKey]?.meta?.netAmount || 0;
    return sum + netAmount;
  }, 0);

  return (
    <>
      <span className="h2 me-3 mb-3">Keychain</span>
      <Button variant="primary" onClick={() => navigate("/add-keypair")}>
        Add
      </Button>
      Total: {total}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Label</th>
            <th>Public Key</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keypairs.map((keypair) => (
            <tr key={keypair.nanoId}>
              <td>{keypair.label}</td>
              <td>{formatKey(keypair.publicKey)}</td>
              <td>{entries[keypair.publicKey]?.meta?.netAmount || "N/A"}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/update-keypair", { state: { keypair } })
                  }
                >
                  Update
                </Button>
                <KeypairDelete keypair={keypair} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <FetchEntriesButton />
    </>
  );
}

export default Keypairs;
