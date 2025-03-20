import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { resendVerificationCode, verifyUser } from '@/services/authService';
import { showError, showSuccess } from '@/hooks/useToast';
import { isAxiosError } from 'axios';

export default function VerifyPage() {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text');

    const sanitizedData = pastedData.replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < sanitizedData.length; i++) {
      if (index + i < 6) {
        newCode[index + i] = sanitizedData[i];
      }
    }

    setCode(newCode);

    if (sanitizedData.length && index + sanitizedData.length < 6) {
      inputRefs.current[index + sanitizedData.length]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');

    if (!verificationCode || !email) return;
    try {
      const response = await verifyUser({
        email,
        verificationCode,
      });
      showSuccess(response.data.message);
      navigate('/login');
    } catch (error) {
      if (isAxiosError(error)) {
        showError("Verification code doesn't match");
      }
    } finally {
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      console.log(email);

      const response = await resendVerificationCode(email);
      showSuccess(response.data.message);
    } catch (error) {
      if (isAxiosError(error)) {
        showError(error.response?.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              EnglishMaster
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            We've sent a verification code to your email. Please enter it below.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to{' '}
                  <span className="font-medium">{email}</span>
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={el => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-12 h-12 text-center text-lg"
                    value={digit}
                    maxLength={1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(index, e)
                    }
                    onPaste={(e: ClipboardEvent<HTMLInputElement>) =>
                      handlePaste(e, index)
                    }
                    inputMode="numeric"
                  />
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Didn't receive a code?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={handleResend}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button type="submit" className="w-full" onClick={handleResend}>
              Verify
            </Button>
            <div className="text-center text-sm">
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
