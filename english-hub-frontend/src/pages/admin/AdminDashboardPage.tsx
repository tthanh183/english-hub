import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Users, BookOpen, HelpCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  // In a real app, you would fetch this data from your API
  const [stats, setStats] = useState({
    totalUsers: 1248,
    activeUsers: 876,
    totalLessons: 124,
    totalTests: 32,
    supportRequests: 15,
    newUsersToday: 24,
  });

  const userActivityData = [
    { name: 'Mon', users: 120 },
    { name: 'Tue', users: 145 },
    { name: 'Wed', users: 160 },
    { name: 'Thu', users: 180 },
    { name: 'Fri', users: 220 },
    { name: 'Sat', users: 240 },
    { name: 'Sun', users: 190 },
  ];

  const lessonCompletionData = [
    { name: 'Listening', value: 35 },
    { name: 'Reading', value: 30 },
    { name: 'Speaking', value: 15 },
    { name: 'Writing', value: 10 },
    { name: 'Grammar', value: 5 },
    { name: 'Vocabulary', value: 5 },
  ];

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ];

  const [recentUsers, setRecentUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      joinDate: '2023-06-15',
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      joinDate: '2023-06-14',
      status: 'active',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      joinDate: '2023-06-13',
      status: 'inactive',
    },
  ]);

  const [recentSupportRequests, setRecentSupportRequests] = useState([
    {
      id: 1,
      user: 'John Doe',
      subject: 'Cannot access test results',
      status: 'open',
      date: '2023-06-15',
    },
    {
      id: 2,
      user: 'Jane Smith',
      subject: 'Payment issue',
      status: 'in-progress',
      date: '2023-06-14',
    },
    {
      id: 3,
      user: 'Bob Johnson',
      subject: 'Account verification',
      status: 'closed',
      date: '2023-06-13',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button>
            <Link to="/admin/users/new">Add New User</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsersToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of
              total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Support Requests
            </CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.supportRequests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.supportRequests > 0
                ? 'Requires attention'
                : 'All resolved'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>
              Daily active users over the past week
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lesson Completion</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lessonCompletionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {lessonCompletionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New users who joined recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {user.joinDate}
                    </span>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/users">
              <Button variant="ghost">View all users</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Support Requests</CardTitle>
            <CardDescription>Recent support tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSupportRequests.map(request => (
                <div
                  key={request.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {request.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      By {request.user}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {request.date}
                    </span>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        request.status === 'open'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {request.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/admin/support">
              <Button variant="ghost">View all requests</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
