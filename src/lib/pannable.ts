import type { Action } from 'svelte/action';

interface PannableParams {
  onPanStart?: (event: MouseEvent) => void;
  onPanMove?: (event: MouseEvent, dx: number, dy: number) => void;
  onPanEnd?: (event: MouseEvent) => void;
}

export const pannable: Action<HTMLElement, PannableParams> = (node, params) => {
  let x: number;
  let y: number;
  
  function handleMousedown(event: MouseEvent) {
    if (event.button !== 0) return; // Only respond to left mouse button
    
    x = event.clientX;
    y = event.clientY;
    
    node.dispatchEvent(new CustomEvent('panstart', {
      detail: { x, y }
    }));
    
    params?.onPanStart?.(event);
    
    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('mouseup', handleMouseup);
  }
  
  function handleMousemove(event: MouseEvent) {
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    x = event.clientX;
    y = event.clientY;
    
    node.dispatchEvent(new CustomEvent('panmove', {
      detail: { x, y, dx, dy }
    }));
    
    params?.onPanMove?.(event, dx, dy);
  }
  
  function handleMouseup(event: MouseEvent) {
    x = event.clientX;
    y = event.clientY;
    
    node.dispatchEvent(new CustomEvent('panend', {
      detail: { x, y }
    }));
    
    params?.onPanEnd?.(event);
    
    window.removeEventListener('mousemove', handleMousemove);
    window.removeEventListener('mouseup', handleMouseup);
  }
  
  node.addEventListener('mousedown', handleMousedown);
  
  return {
    update(newParams: PannableParams) {
      params = newParams;
    },
    destroy() {
      node.removeEventListener('mousedown', handleMousedown);
    }
  };
};