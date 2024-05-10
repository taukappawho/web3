<script>
    export let card;
    card.isEnlarged = false;

    import abi from "../utils/MyERC1155Token.json";
    const contractAddress = "0xaD8C01F7E87F7E180716416570A2ECcC1d7AdB1B";
    const contractABI = abi.abi;

    import Buy from "./Buy.svelte";
    import Mint from "./Mint.svelte";

    let isBuyOpen = false;
    let isMintOpen = false;

    function openBuy() {
        isBuyOpen = true;
    }

    function openMint() {
        isMintOpen = true;
    }

    function handleClose() {
        isBuyOpen = false;
        isMintOpen = false;
        card.isEnlarged = false;
    }

    function handleFormSubmit(event) {
        console.log("Form submitted with data:", event.detail);
        handleClose();
    }

    function toggleEnlarged() {
        console.log(`Card Clicked: ${card.id}`);
        if (isBuyOpen || isMintOpen) return;
        card.isEnlarged = !card.isEnlarged;
        if (card.isEnlarged) {
            if (typeof card.purpose === "undefined") {
                //we got a wannabe buyer
                //get contract details from blockchain using contract address
            } else {
                // we got a wannabe maker
                //display a form
            }
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="card" class:enlarged={card.isEnlarged} on:click={toggleEnlarged}>
    <div class="image-container">
        <!-- TODO here is the double http -->
        <img src={card.imgURL} alt={card.name} />
    </div>
    <div class="content">
        <h2 class="token-name">{card.name}</h2>
        <div class="info">
            <p class="desc">{card.desc}</p>
            <!-- <p class="owner">{card.ownerName}</p> -->
            <p class="id">{card.id}</p>
            <p class="cost">{card.cost} ETH</p>
            <p class="mints">{card.mintSold} / {card.mintTotal}</p>
        </div>
        {#if card.isEnlarged}
            {#if card.purpose === "mint"}
                <button on:click={openMint}>Mint</button>
                {#if isMintOpen}
                    <Mint
                        on:submit={handleFormSubmit}
                        on:cancel={handleClose}
                    />
                {/if}
            {:else}

                <button on:click={openBuy}>Buy</button>
                {#if isBuyOpen}
                    <Buy {card} on:submit={handleFormSubmit} on:cancel={handleClose} />
                {/if}
            {/if}
        {/if}
    </div>
</div>

<style>
    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        border-radius: 8px;
        box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.1),
            0 8px 24px rgba(0, 0, 0, 0.15);
        margin: 10px;
        transition: transform 0.3s ease-in-out;
        cursor: pointer;
    }

    .image-container {
        object-fit: cover;
        position: relative;
        width: calc(100% - 12px);
        margin: 6px;
        height: 310px;
    }

    .card img {
        width: calc(100% - 4px);
        margin: 2px;
        object-fit: cover;
        border-radius: 5px;
        height: 310px;
    }

    .content {
        padding: 10px;
        text-align: center;
    }

    .token-name {
        font-family: "Comic Sans MS", "Comic Sans", cursive, sans-serif;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        padding: 0px;
        border: 0px;
        margin: 0px;
    }

    .info {
        width: 100%;
        display: flex;
        justify-content: space-around;

        font-size: 14px;
    }

    .card:hover {
        transform: translateY(-10px);
        box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.2),
            0 12px 36px rgba(0, 0, 0, 0.28);
    }

    .card.enlarged {
        transform: scale(1.1);
        z-index: 2;
    }

    .desc,
    .id,
    .cost,
    .mints {
        margin: 4px 8px;
    }

    button {
        margin-top: 10px;
        padding: 8px 16px;
        font-size: 16px;
        cursor: pointer;
    }
</style>
