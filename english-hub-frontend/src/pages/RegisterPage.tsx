import { useState } from 'react';
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
import { register } from '@/services/authService';
import { RegisterRequest } from '@/types/authType';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';
import { UserResponse } from '@/types/userType';
import { ROUTES } from '@/constants/routes';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    username: '',
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (response: UserResponse) => {
      showSuccess(
        'User created successfully. Visit your email to verify your account.'
      );
      setTimeout(() => {
        navigate(ROUTES.VERIFY, { state: { email: response.email } });
      }, 1000);
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
    onSettled: () => {
      setFormData({
        email: '',
        password: '',
        username: '',
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      showError('Username is required');
      return;
    }
    if (!formData.email.trim()) {
      showError('Email is required');
      return;
    }
    if (!formData.password.trim()) {
      showError('Password is required');
      return;
    }

    mutation.mutate(formData);
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
          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started with EnglishHub
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User name</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="John Doe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
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
              {mutation.isPending ? <Spinner /> : 'Sign up'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
