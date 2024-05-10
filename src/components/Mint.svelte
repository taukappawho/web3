<script>
    import { createEventDispatcher } from "svelte";
    import { ethers } from "ethers";
    import abi from "../utils/MyERC1155Token.json";
    const contractAddress = "0xaD8C01F7E87F7E180716416570A2ECcC1d7AdB1B";
    const contractABI = abi.abi;

    const dispatch = createEventDispatcher();

    let description = "";
    let tokenName = "";
    // let id = "";
    let price = "";
    let ftQuant = "";
    // let nftQuant = "";
    let picURL = "";

    async function handleSubmit() {
        const formData = {
            price,
            ftQuant,
            tokenName,
            description,
            picURL,
        };
        //
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = await provider.getSigner();
                const myContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                //   function mint(uint256 _tokenId, uint256 _amount, uint256 _price, string memory _metadata)
                let result = await myContract.mint(
                    ftQuant,
                    price,
                    `{"name": "${tokenName}","desc":"${description}", "imgURL": "${picURL}"}`,
                );
                console.log(result);
                //todo
                //   mint needs uri field (can be "")
                // onsuccess
                //   save metadata siomewhere
                //   get returned uri
                //    post image file to uri
            } else {
                console.log("ETH window obj doesn't exist...");
            }
        } catch (error) {
            alert("error: " + error);
            console.log(error);
        }
        //
        dispatch("submit", formData);
    }

    function handleCancel() {
        dispatch("cancel");
    }
</script>

<div class="modal">
    <div class="modal-content">
        <h2>Mint Token</h2>
        <form on:submit|preventDefault={handleSubmit}>
            <!-- <label for="ownerName"
                >Owner's Name:
                <input
                    type="text"
                    id="ownerName"
                    bind:value={ownerName}
                /></label
            > -->
            <label for="tokenName"
                >Token Name:
                <input
                    type="text"
                    id="tokenName"
                    bind:value={tokenName}
                    required
                /></label
            >
            <label for="description"
                >Token Description
                <input
                    type="text"
                    id="description"
                    bind:value={description}
                    required
                /></label
            >
            <!-- <label for="royalty">Royalty:
            <input type="number" id="royalty" min="0" max="20" bind:value={royalty} required /></label> -->
            <label for="price"
                >Price:
                <input
                    type="number"
                    id="price"
                    min="1"
                    max="10"
                    bind:value={price}
                    required
                /></label
            >
            <label for="ftQuant"
                >FT Quant:
                <input
                    type="number"
                    id="ftQuant"
                    min="0"
                    max="1000"
                    bind:value={ftQuant}
                    required
                /></label
            >
            <!-- <label for="nftQuant">NFT Quant:
            <input type="number" id="nftQuant" min="0" max="1000" bind:value={nftQuant} required /></label> -->
            <label for="picURL"
                >Picture URL:
                <input
                    type="text"
                    id="picURL"
                    accept="image/jpeg, image/png"
                    bind:value={picURL}
                    required
                /></label
            >

            <div class="buttons">
                <button type="button" on:click={handleCancel}>Cancel</button>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input {
        margin-bottom: 10px;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
    }

    button {
        padding: 8px 16px;
        font-size: 16px;
        cursor: pointer;
    }
</style>
