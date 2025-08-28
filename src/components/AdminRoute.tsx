import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/admin/LoginPage';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { currentUser } = useAuth();

  return currentUser ? <>{children}</> : <LoginPage />;
}