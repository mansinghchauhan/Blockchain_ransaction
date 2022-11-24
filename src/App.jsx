import { Contract, ethers, utils } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import Abi from "./abi.json";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";

const startPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    console.log(Abi);

    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    let walletName = "MetaMask";
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    if (!walletName) return;
    if (window.ethereum) {
      let ethProvider;
      if (!window.ethereum.providerMap) {
        if (walletName === "MetaMask") {
          ethProvider = window.ethereum;
        } else {
          return toast(`${walletName} not found!`, {
            type: "error",
            icon: () => <ErrorIcon />,
          });
        }
      } else {
        ethProvider = window.ethereum.providerMap.get(walletName);
      }
      const provider = new ethers.providers.Web3Provider(ethProvider, "any");
      await provider.send("wallet_switchEthereumChain", [
        { chainId: utils.hexValue(97) },
      ]);
      const chainId = await provider.send("eth_chainId");
      if (chainId !== utils.hexValue(97)) {
        return toast(`We only work with BNB.`, {
          type: "error",
          icon: () => <ErrorIcon />,
        });
      }

      // const accounts = await provider.send("eth_requestAccounts", []);
      // localStorage.setItem("wallet", walletName);
      // this.setSignatureDataAndLogin(provider, accounts);
      // ethProvider.on("accountsChanged", (accountList) => {
      //   this.setSignatureDataAndLogin(provider, accountList);
      // });

      // ethProvider.on("chainChanged", (_chainId) => {
      //   if (_chainId === networkMap.ETH_MAINNET.chainId) {
      //     this.walletSelect();
      //   } else {
      //     let getWalletName = localStorage.getItem("wallet");

      //     this.menuAction("logout");
      //     localStorage.setItem("wallet", getWalletName);

      //     this.props.resetWalletFromRedux();
      //   }
      // });
    } else {
      toast("Wallet not found! Install web3 wallet. ", {
        type: "error",
        icon: ({ theme, type }) => <ErrorIcon />,
      });
    }

    const account = await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const busd = new Contract(
      "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
      Abi,
      provider.getSigner()
    );
    await busd.transfer(addr, parseEther("0.00001"));
    await busd.transfer(addr, parseEther("0.00001"));

    await busd.transfer(addr, parseEther("0.00001"));

    // const signer = provider.getSigner();
    // ethers.utils.getAddress(addr);
    // const tx = await signer.sendTransaction({
    //   to: addr,
    //   value: ethers.utils.parseEther(ether),
    // });
    // console.log({ ether, addr });
    // console.log("tx", tx);
    // setTxs([tx]);
  } catch (err) {
    setError(err.message);
  }
};

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr"),
    });
  };

  return (
    <div
      className="d-flex justify-content-center "
      style={{ width: "175vh", height: "auto" }}
    >
      <Card>
        <Card.Header>Featured</Card.Header>
        <Card.Body>
          <Card.Title>Special title treatment</Card.Title>
          <form className="m-4" onSubmit={handleSubmit}>
            <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
              <main className="mt-4 p-4">
                <h1 className="text-xl font-semibold text-gray-700 text-center">
                  Send ETH payment
                </h1>
                <div className="">
                  <div className="my-3">
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Recipient Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="addr"
                        className="input input-bordered block w-full focus:ring focus:outline-none"
                        placeholder="Recipient Address"
                      />
                    </Form.Group>
                  </div>
                  <div className="my-3">
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Amount in ETH</Form.Label>
                      <Form.Control
                        name="ether"
                        type="text"
                        className="input input-bordered block w-full focus:ring focus:outline-none"
                        placeholder="Amount in ETH"
                      />
                    </Form.Group>
                  </div>
                </div>
              </main>
              <footer className="p-4">
                <button
                  type="submit"
                  className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                >
                  Pay now
                </button>
                <ErrorMessage message={error} />
                <TxList txs={txs} />
              </footer>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}
