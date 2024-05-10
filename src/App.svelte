<script>
    import { onMount } from "svelte";
    import Card from "./components/Card.svelte";
    import abi from "./utils/MyERC1155Token.json";
    import { ethers } from "ethers";

    const contractAddress = "0x518485F2f177Dc0115F366416125AFC1c56acAFF";
    const contractABI = abi.abi;

    let cards = [];
    let newCard = {
        imgURL: "https://white-fascinating-cardinal-894.mypinata.cloud/ipfs/QmSe33oFXwXSU5t3GUrM2GEk5jz64verJTNqYBo7iuUhMf",
        name: "ART",
        desc: "The Minting Pic",
        // ownerName: "Arthur",
        mintLeft: "?",
        mintTotal: "1000",
        cost: "?",
        id: "#?",
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

    // Allows to connect an auth'd wallet
    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Need an ETH wallet to connect to!");
                return;
            }

            // Makes request to connect to ETH account (Metamask wallet)
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);

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
                // let result = await myContract.getMetadata(1);   ****
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
    <h1>Kryptocist Artwerks</h1>
    <div class="cards">
        {#each cards as card}
            <Card {card} />
        {/each}
    </div>
    <div id="walletButton">
        <button on:click={connectWallet}>Connect Wallet</button>
    </div>
</div>

<style>
    .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 2fr));
        gap: 20px;
        padding: 8px;
    }
</style>
