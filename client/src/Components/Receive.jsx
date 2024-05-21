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
