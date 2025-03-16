export const pannable = (node, params) => {
  let x;
  let y;
  
  function handleMousedown(event) {
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
  
  function handleMousemove(event) {
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    x = event.clientX;
    y = event.clientY;
    
    node.dispatchEvent(new CustomEvent('panmove', {
      detail: { x, y, dx, dy }
    }));
    
    params?.onPanMove?.(event, dx, dy);
  }
  
  function handleMouseup(event) {
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
    update(newParams) {
      params = newParams;
    },
    destroy() {
      node.removeEventListener('mousedown', handleMousedown);
    }
  };
};