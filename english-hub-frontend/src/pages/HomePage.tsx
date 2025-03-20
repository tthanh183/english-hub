import Footer from '@/components/Footer';
import Header from '../components/Header';
import CategoryCard from '@/components/CategoryCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Master English with EnglishMaster
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Interactive lessons, personalized learning, and real-world practice
          </p>
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Choose Your Learning Path
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Grammar', 'Vocabulary', 'Pronunciation'].map(category => (
              <CategoryCard key={category} title={category} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
