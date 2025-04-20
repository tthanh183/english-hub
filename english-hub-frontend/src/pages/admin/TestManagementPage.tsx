import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';

type Test = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function TestManagementPage() {
  const [tests, setTests] = useState<Test[]>([
    { id: '1', name: 'TOEIC Test 1', description: 'Listening and Reading Test', createdAt: '2025-04-01' },
    { id: '2', name: 'TOEIC Test 2', description: 'Speaking and Writing Test', createdAt: '2025-04-10' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [newTest, setNewTest] = useState<Test>({
    id: '',
    name: '',
    description: '',
    createdAt: new Date().toISOString().split('T')[0],
  });

  const handleAddTest = () => {
    setTests((prev) => [...prev, { ...newTest, id: Date.now().toString() }]);
    setNewTest({ id: '', name: '', description: '', createdAt: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(false);
  };

  const handleEditTest = (test: Test) => {
    setEditingTest(test);
    setNewTest(test);
    setIsDialogOpen(true);
  };

  const handleUpdateTest = () => {
    setTests((prev) =>
      prev.map((test) => (test.id === newTest.id ? newTest : test))
    );
    setEditingTest(null);
    setNewTest({ id: '', name: '', description: '', createdAt: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(false);
  };

  const handleDeleteTest = (id: string) => {
    setTests((prev) => prev.filter((test) => test.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Management</h1>

      {/* Add Test Button */}
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        Add New Test
      </Button>

      {/* Test Table */}
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>{test.name}</td>
              <td>{test.description}</td>
              <td>{test.createdAt}</td>
              <td>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditTest(test)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTest(test.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Dialog for Add/Edit Test */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-semibold">
              {editingTest ? 'Edit Test' : 'Add New Test'}
            </h2>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Test Name"
              value={newTest.name}
              onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={newTest.description}
              onChange={(e) =>
                setNewTest({ ...newTest, description: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              onClick={editingTest ? handleUpdateTest : handleAddTest}
              className="bg-blue-600 text-white"
            >
              {editingTest ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
