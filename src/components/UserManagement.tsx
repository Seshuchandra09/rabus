import { useState } from "react";
import { Button, Typography, Container } from "@mui/material";
import DataTable from "./DataTable";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Inactive" },
  ]);

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: "New User",
      email: "new@example.com",
      role: "User",
      status: "Active"
    };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (userId: number) => {
    console.log(`Edit User: ${userId}`);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mb: 3 }}>User Management</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddUser} 
        sx={{ mb: 2 }}
      >
        Add User
      </Button>
      <DataTable
        rows={users}
        columns={[
          { field: "name", headerName: "Name", width: 200 },
          { field: "email", headerName: "Email", width: 250 },
          { field: "role", headerName: "Role", width: 150 },
          { field: "status", headerName: "Status", width: 150 },
        ]}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </Container>
  );
};

export default UserManagement;