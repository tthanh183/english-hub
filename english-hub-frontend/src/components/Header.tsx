import { GiGiftOfKnowledge } from 'react-icons/gi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Header: React.FC = () => {
  return (
    <header className="bg-white p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <GiGiftOfKnowledge className="text-4xl text-blue-500" />
        <h1 className="text-black text-2xl font-bold">EnglishHub</h1>
      </div>

      <div className="flex justify-center gap-6 flex-grow mx-4">
        <Label>Listening & Reading</Label>
        <Label>Writing & Speaking</Label>
        <Label>Mock Test</Label>
        <Label>Grammar</Label>
        <Label>Vocabulary</Label>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="bg-blue-400 hover:bg-blue-300">
          Login
        </Button>
      </div>
    </header>
  );
};

export default Header;
