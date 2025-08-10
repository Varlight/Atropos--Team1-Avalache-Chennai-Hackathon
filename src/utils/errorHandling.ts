export function getErrorMessage(error: any): string {
  if (!error) return 'Unknown error occurred';
  
  // Handle various error formats
  if (typeof error === 'string') return error;
  
  // Wagmi/Viem errors
  if (error.cause?.reason) return error.cause.reason;
  if (error.reason) return error.reason;
  if (error.shortMessage) return error.shortMessage;
  if (error.message) {
    // Clean up common error messages
    let message = error.message;
    
    // Remove transaction hash and other noise
    message = message.replace(/Transaction hash: 0x[a-fA-F0-9]+/g, '');
    message = message.replace(/Version: viem@[\d.]+/g, '');
    
    // Extract revert reason if present
    const revertMatch = message.match(/reverted with reason string '([^']+)'/);
    if (revertMatch) return revertMatch[1];
    
    const revertMatch2 = message.match(/reverted with the following reason:\s*(.+)/);
    if (revertMatch2) return revertMatch2[1].trim();
    
    // Extract execution reverted messages
    const executionMatch = message.match(/execution reverted: (.+)/i);
    if (executionMatch) return executionMatch[1].trim();
    
    // Clean up and return the message
    message = message.replace(/^Error: /, '');
    return message.trim() || 'Transaction failed';
  }
  
  // Fallback to error name or default
  return error.name || 'Transaction failed';
}

export function isInsufficientFundsError(error: any): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('insufficient funds') || 
         message.includes('insufficient balance') ||
         message.includes('exceeds balance');
}

export function isUserRejectedError(error: any): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('user rejected') || 
         message.includes('user denied') ||
         message.includes('cancelled');
}

export function isNetworkError(error: any): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('network') || 
         message.includes('connection') ||
         message.includes('timeout');
}

export function formatErrorForUser(error: any): string {
  if (isUserRejectedError(error)) {
    return 'Transaction was cancelled';
  }
  
  if (isInsufficientFundsError(error)) {
    return 'Insufficient AVAX balance';
  }
  
  if (isNetworkError(error)) {
    return 'Network error. Please try again.';
  }
  
  const message = getErrorMessage(error);
  
  // Common contract errors
  if (message.includes('Round just closed')) {
    return 'Round just closed. Please try again — your purchase will join the next round.';
  }
  
  if (message.includes('Already waiting')) {
    return 'You are already in a queue';
  }
  
  if (message.includes('Not waiting')) {
    return 'You are not in any queue';
  }
  
  if (message.includes('Round is full')) {
    return 'This round is full';
  }
  
  return message;
}