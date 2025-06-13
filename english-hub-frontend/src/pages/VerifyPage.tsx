import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { resendVerificationCode, verifyEmail } from '@/services/authService';
import { showError, showSuccess } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';
import { ROUTES } from '@/constants/routes';

export default function VerifyPage() {
  const [code, setCode] = useState('');

  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (response: string) => {
      showSuccess(response);
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
    onSettled: () => {
      setCode('');
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: (response: string) => {
      showSuccess(response);
    },
    onError: error => {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      } else {
        showError('Something went wrong');
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !email) {
      showError('Please enter verification code');
      return;
    }

    verifyMutation.mutate({ email, verificationCode: code });
  };

  const handleResend = () => {
    if (resendMutation.isPending) return;
    resendMutation.mutate(email);
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
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            Enter the verification code sent to {email}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? <Spinner /> : 'Verify'}
            </Button>

            <div className="text-center text-sm">
              Didn't receive a code?{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={handleResend}
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending ? 'Sending...' : 'Resend'}
              </button>
            </div>

            <div className="text-center text-sm">
              <Link
                to={ROUTES.LOGIN}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
