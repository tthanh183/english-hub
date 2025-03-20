import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

type CategoryCardProps = {
  title: string;
};

export default function CategoryCard(props: CategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>
          Master essential {props.title.toLowerCase()} skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          Interactive lessons and exercises to improve your{' '}
          {props.title.toLowerCase()}.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Start Learning</Button>
      </CardFooter>
    </Card>
  );
}
