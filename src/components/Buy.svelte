<script>
    import { ethers } from "ethers";
    import { createEventDispatcher } from "svelte";

    import abi from "../utils/MyERC1155Token.json";
    const contractAddress = "0xaD8C01F7E87F7E180716416570A2ECcC1d7AdB1B";
    const contractABI = abi.abi;

    const dispatch = createEventDispatcher();

    let _amount = 0;
    let _tokenId = 1;
    // let nftQuant = 0;

    async function handleSubmit() {
        const formData = {
            _tokenId,
            _amount //, nftQuant
        };

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
                console.log(card.id);
console.log(`tokenid: ${_tokenId}, _amount: ${_amount}`)
                // let result = await myContract.buyToken(_tokenId, _amount);
                let amt = card.cost * _amount;
                let options = {value: amt};
                let result = await myContract.buyToken(_tokenId, _amount,options).then((transaction) => {console.log(transaction)});
                console.log(`Transaction response: ${JSON.stringify(result, null, 2)}`);
                await result.wait();
                console.log("Tokens purchased");
            } else {
                console.log("ETH window obj doesn't exist...");
            }
        } catch (error) {
            console.error(`Error purchasing tokens: ${error}`);
        }

        dispatch("submit", formData);
    }

    function handleCancel() {
        dispatch("cancel");
    }
</script>

<div class="modal">
    <div class="modal-content">
        <h2>Buy Token</h2>
        <form on:submit|preventDefault={handleSubmit}>
            <label for="_amount">
                FT Quant:
                <input
                    type="number"
                    id="_amount"
                    min="0"
                    max="1000"
                    size="4"
                    bind:value={_amount}
                    required
                /></label
            >

            <!-- <label for="nftQuant">NFT Quant:
            <input type="number" id="nftQuant" min="0" max="1000" size="4" bind:value={nftQuant} required></label> -->
<!-- <label for="imgURL">File: <input type="image" id="imgURL" bind:value={imgURL} required />  </label> -->
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
