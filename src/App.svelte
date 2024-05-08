<script>
    import { onMount } from "svelte";
    import Card from "./components/Card.svelte";
    import abi from "./utils/MyERC1155Token.json";
    import { ethers } from "ethers";
    import Toast from './Toast.svelte';
    import { pinFileToIPFS } from "./api/pinata.js"; // Importing pinFileToIPFS function from its new location


    const contractAddress = "0x518485F2f177Dc0115F366416125AFC1c56acAFF";
    const contractABI = abi.abi;
    const pinataUrl = "https://blue-improved-lemur-660.mypinata.cloud/ipfs/";

    let showUploadSection = false;
    let walletConnected = false;
    let showToast = false;
    let toastMessage = '';
    let cards = [];
    let newCard = {
        imgURL: "https://white-fascinating-cardinal-894.mypinata.cloud/ipfs/QmSe33oFXwXSU5t3GUrM2GEk5jz64verJTNqYBo7iuUhMf",
        name: "ART",
        desc: "The Minting Pic",
        // ownerName: "Arthur",
        // mintLeft: "???",
        // mintTotal: "???",
        // cost: "?",
        // royalty: "??",
        purpose: "mint",
    };
    var currentAccount = 0;
    var result;
    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("You don't have a wallet!");
                return;
            } else {
                console.log("ETH detected");
            }

            // Pulls array of accounts
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                currentAccount = account;
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log("EROR" + error);
        }
    };

    function showToastNotification(message) {
    toastMessage = message;
    showToast = true;
  }

  function handleCloseToast() {
    showToast = false;
  }

    function handleImageUpload(event) {
    const file = event.target.files[0];
    // Optionally, you can display the file name or other information to the user
    console.log("Selected file:", file.name);
}


    function toggleUploadSection() {
        showUploadSection = !showUploadSection;
    }

    async function pinImageToIPFS() {
    try {
        // Retrieve the file input element by its id
        const fileInput = document.getElementById('imageInput');

        // Get the selected file from the files array of the file input element
        const file = fileInput.files[0];

        // If no file is selected, exit the function
        if (!file) {
            return;
        }

        // Call pinFileToIPFS function with the selected file
        const response = await pinFileToIPFS(file);

        // Display alert after successful upload
        showToastNotification('File uploaded successfully!\nHere is the url to your image:\n' + pinataUrl + JSON.stringify(response).replace(/['"]+/g, '') + '\nPlease keep this link, as it is what you will use to mint this image.');

        // Clear the file input
        fileInput.value = ''; // Reset file input to clear the selected file
    } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error if necessary
    }
}


    

    // Allows to connect an auth'd wallet
    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Need an ETH wallet to connect to!");
                walletConnected = false;
                return;
            }

            // Makes request to connect to ETH account (Metamask wallet)
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);
            walletConnected = true;
            // Set the currAccount state within this component to know the address of the account
            currentAccount = accounts[0];
            document.getElementById("walletButton").innerHTML = "";
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const myContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer,
            );
            try {
                let result = await myContract.getMetadata(1);
                console.log("before\n", result, "\nafter");
                console.log(typeof result);
                let newResult = JSON.parse(result);
                console.log(typeof newResult);
                // const response = await fetch("http://localhost:5000/cards");
                // if (!response.ok) {
                //     throw new Error("Failed to fetch: " + response.statusText);
                // }
                // cards = await result.json();
                // cards = cards.map(card => {return {...card, isEnlarged: false};
                // });
                let index = 0;
                // let addProp = newResult.array.forEach(
                //     (element) => (element["_tokenId"] = index++),
                // );

                cards = [newResult, newCard];
                console.log("cards: " + typeof cards);
                console.log("***************\n", cards);
            } catch (error) {
                console.log("Error fetching cards:", error);
            }

            // getAllMetadata
            // retrieve file from ipfs
            // load cards with metadata and imgURL
        } catch (error) {
            console.log("ERROR1:   " + error);
            alert("Wallet could not be connected");
        }
    };

    // Fetch data from the backend when the component mounts
    onMount(async () => {
        console.log("onMount");
        checkIfWalletIsConnected();
        // try {
        //     result = await myContract.getAllMetadata();
        //     console.log(result);
        //     // const response = await fetch("http://localhost:5000/cards");
        //     // if (!response.ok) {
        //     //     throw new Error("Failed to fetch: " + response.statusText);
        //     // }
        //     cards = await result.json();
        //     // cards = cards.map(card => {return {...card, isEnlarged: false};
        //     // });
        //     cards = [...cards, newCard];
        // } catch (error) {
        //     console.log("Error fetching cards:", error);
        // }
    });
</script>

<div>
    {#if showToast}
  <Toast message={toastMessage} className="show" onClose={handleCloseToast}/>
    {/if}
    <h1>Kryptocist Artwerks</h1>
    <div class="cards">
        {#each cards as card}
            <Card {card} />
        {/each}
    </div>
    <div id="walletButton">
        <button on:click={connectWallet}>Connect Wallet</button>
    </div>
    {#if walletConnected}
        <div class="upload-section">
            <button on:click={toggleUploadSection}>Upload Image</button>
        </div>
    {/if}
    {#if showUploadSection}
        <div class="upload-section">
            <input id="imageInput" type="file" accept="image/*" onchange={handleImageUpload} style="background-color: white"/>
            <button on:click={pinImageToIPFS}>Upload</button>
        </div>
    {/if}
</div>

<style>
    .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 2fr));
        gap: 20px;
        padding: 8px;
    }
</style>
