


export const useAuth = () => {
    const role = window.sessionStorage.getItem('role');
    
    return { role };
  };
  