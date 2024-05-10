<!-- Toast.svelte -->
<script>
    export let message;
    export let className;
    export let onClose;
  
    function handleClose() {
      onClose();
    }
  </script>
  
  <div class="toast {className}">
    <span>{message}</span>
    <button on:click={handleClose}>Close</button>
  </div>
  
  <style>
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: #fff;
      padding: 10px 20px;
      border-radius: 5px;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
  
    .show {
      opacity: 1;
    }
  
    button {
      background-color: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      position: absolute;
      top: 5px;
      right: 10px;
    }
  </style>
  