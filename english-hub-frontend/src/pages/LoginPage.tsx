import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { login, resendVerificationCode } from '@/services/authService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';
import { LoginResponse } from '@/types/authType';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearAuth();
  }, [clearAuth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }

  };

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response: LoginResponse) => {
      const { accessToken, refreshToken } = response;
      setAuth(accessToken, refreshToken);
      showSuccess('Login successful');
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        showError(errorMessage);

        if (error.response?.data?.code === 1012) {
          resendVerificationCode(email);
          navigate(ROUTES.VERIFY, { state: { email } });
        }
      } else {
        showError('Something went wrong');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showError('Email and password are required');
      return;
    }

    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link to={ROUTES.HOME} className="text-2xl font-bold text-blue-600">
              EnglishHub
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="********"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Spinner /> : 'Sign in'}
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
