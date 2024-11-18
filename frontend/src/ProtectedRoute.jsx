import { Outlet, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function ProtectedRoute() {
  const [cookies, setCookie] = useCookies(['user']);  
  const user = cookies.user;

  return user ? <Outlet /> : <Navigate to="/login" />;
}
