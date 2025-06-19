export const useAuth = () => {
  const role = window.localStorage.getItem('role');
  // const adminRole = 'livreur';
  
  return { role };
};
  