<script>
  export let text;
  export let position = 'top';
</script>

<div class="tooltip">
  <slot></slot>
  <span class="tooltip-text {position}">{text}</span>
</div>

<style>
  .tooltip {
    position: relative;
    display: inline-block;
  }
  
  .tooltip-text {
    visibility: hidden;
    background-color: var(--neutral);
    color: var(--text);
    text-align: center;
    border-radius: var(--radius-md);
    padding: var(--spacing-xs) var(--spacing-sm);
    position: absolute;
    z-index: 100;
    opacity: 0;
    transition: opacity var(--transition-fast) ease-in-out;
    white-space: nowrap;
    font-size: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }
  
  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
  
  .top {
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .bottom {
    top: 125%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .left {
    right: 125%;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .right {
    left: 125%;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .top::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--neutral) transparent transparent transparent;
  }
  
  .bottom::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent var(--neutral) transparent;
  }
  
  .left::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent var(--neutral);
  }
  
  .right::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent var(--neutral) transparent transparent;
  }
</style>