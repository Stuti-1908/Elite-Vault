document.getElementById("createWallet").addEventListener("click", async () => {
    const response = await fetch("http://localhost:5000/create-wallet");
    const data = await response.json();

    localStorage.setItem("walletAddress", data.address);
    localStorage.setItem("privateKey", data.privateKey);

    document.getElementById("walletAddress").innerText = data.address;
    alert("Wallet Created! (Check Console for Private Key)");
    console.log("Private Key:", data.privateKey);
});

document.getElementById("getBalance").addEventListener("click", async () => {
    const address = localStorage.getItem("walletAddress");
    if (!address) return alert("No wallet found!");

    const response = await fetch(`http://localhost:5000/balance?address=${address}`);
    const data = await response.json();
    
    document.getElementById("walletBalance").innerText = `${data.balance} ETH`;
});

document.getElementById("sendETH").addEventListener("click", async () => {
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) return alert("No wallet found!");

    const to = document.getElementById("toAddress").value;
    const amount = document.getElementById("amount").value;

    const response = await fetch("http://localhost:5000/send-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privateKey, to, amount }),
    });

    const data = await response.json();
    if (data.txHash) {
        alert("Transaction Sent! Hash: " + data.txHash);
    } else {
        alert("Error: " + data.error);
    }
});

// Fetch and display prices
async function fetchPrices() {
    const ethResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const solResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const ethData = await ethResponse.json();
    const solData = await solResponse.json();

    document.getElementById("ethPrice").innerText = `$${ethData.ethereum.usd}`;
    document.getElementById("solPrice").innerText = `$${solData.solana.usd}`;
}
fetchPrices();

// Generate Wallet with Mnemonic
document.getElementById("generateWallet").addEventListener("click", async () => {
    const response = await fetch("http://localhost:5000/create-wallet");
    const data = await response.json();

    localStorage.setItem("walletAddress", data.address);
    localStorage.setItem("privateKey", data.privateKey);
    localStorage.setItem("mnemonic", data.mnemonic);

    document.getElementById("walletAddress").innerText = data.address;
    document.getElementById("mnemonicPhrase").innerText = data.mnemonic;
    alert("Wallet Created!");
});

// Clear Wallet
document.getElementById("clearWallet").addEventListener("click", () => {
    localStorage.clear();
    document.getElementById("walletAddress").innerText = "-";
    document.getElementById("walletBalance").innerText = "0 ETH";
    document.getElementById("mnemonicPhrase").innerText = "-";
    document.getElementById("decryptedPrivateKey").innerText = "-";
    alert("Wallet Cleared!");
});

// Decrypt Private Key
document.getElementById("decryptPrivateKey").addEventListener("click", () => {
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) return alert("No wallet found!");

    document.getElementById("decryptedPrivateKey").innerText = privateKey;
    alert("Private Key Decrypted!");
});
