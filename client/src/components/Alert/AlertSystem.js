// Simple alert system that works without complex state management
export const showAlert = (message, type = 'success') => {
  // Remove any existing alerts
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create alert element
  const alertDiv = document.createElement('div');
  alertDiv.className = 'custom-alert';
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : '#2196f3'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    min-width: 300px;
    max-width: 400px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: slideIn 0.3s ease-in-out;
  `;

  alertDiv.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; margin-left: 10px;">×</button>
  `;

  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(alertDiv);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (alertDiv.parentElement) {
      alertDiv.remove();
    }
  }, 3000);
};
