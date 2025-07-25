
const connectButton = document.getElementById("connectButton");
const claimButton = document.getElementById("claimButton");
const status = document.getElementById("status");

const contractAddress = "0xYourRealContractAddressHere";
const contractABI = [
  "function claimTokens() public",
  "function hasClaimed(address) public view returns (bool)"
];

let signer, contract;

connectButton.onclick = async () => {
  if (!window.ethereum) {
    alert("MetaMask is required.");
    return;
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  const network = await provider.getNetwork();
  if (network.chainId !== 421614) {
    status.textContent = "Please switch to Arbitrum Sepolia network.";
    return;
  }

  contract = new ethers.Contract(contractAddress, contractABI, signer);
  const address = await signer.getAddress();
  const alreadyClaimed = await contract.hasClaimed(address);

  if (alreadyClaimed) {
    status.textContent = "You have already claimed CMC.";
    claimButton.disabled = true;
  } else {
    status.textContent = "You can claim your CMC token.";
    claimButton.disabled = false;
  }
};

claimButton.onclick = async () => {
  try {
    const tx = await contract.claimTokens();
    await tx.wait();
    status.textContent = "CMC token claimed successfully!";
    claimButton.disabled = true;
  } catch (error) {
    console.error(error);
    status.textContent = "Transaction failed.";
  }
};
