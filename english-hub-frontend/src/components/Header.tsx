import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between">
        {/* Logo on the left */}
        <div className="flex-shrink-0 mr-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            EnglishMaster
          </Link>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/login">
            <Button
              variant="outline"
              className="bg-blue-400 text-white hover:bg-blue-300"
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
