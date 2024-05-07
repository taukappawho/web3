<script>
    import { onMount } from "svelte";
    import Card from "./components/Card.svelte";
    import abi from "./utils/MyERC1155Token.json";

    const contractAddress = "0xFC4c754e07264431827d99bDe6eD7AC6B4b0E598";
    const contractABI = abi.abi;

    let cards = [];
    let newCard = {
        imgUrl: "0",
        tokenName: "ART",
        ownerName: "Arthur",
        mintLeft: "???",
        mintTotal: "???",
        cost: "?",
        royalty: "??",
        purpose: "mint",
    };
    var currentAccount = 0;

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
        try {
            const response = await fetch("http://localhost:5000/cards");
            if (!response.ok) {
                throw new Error("Failed to fetch: " + response.statusText);
            }
            cards = await response.json();
            // cards = cards.map(card => {return {...card, isEnlarged: false};
            // });
            cards = [...cards, newCard];
        } catch (error) {
            console.log("Error fetching cards:", error);
        }
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
