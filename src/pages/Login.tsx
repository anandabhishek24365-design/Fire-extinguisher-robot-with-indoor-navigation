import AuthSwitch from '@/components/ui/auth-switch';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  return <AuthSwitch onLogin={onLogin} onSignUp={onLogin} />;
}
