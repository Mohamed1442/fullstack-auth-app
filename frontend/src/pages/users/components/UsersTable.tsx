import type { IUserResponse } from "@api/users/users.types";
import { convertUnderscoreToTitleCase } from "@utils/convertUnderscoreToTitleCase";
import React from "react";

interface UsersTableProps {
  data: IUserResponse[];
}

const UsersTable: React.FC<UsersTableProps> = ({ data }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b text-left">ID</th>
          <th className="px-4 py-2 border-b text-left">Name</th>
          <th className="px-4 py-2 border-b text-left">Email</th>
          <th className="px-4 py-2 border-b justify-center">Role</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((user: IUserResponse) => (
          <tr key={user.id} className="hover:bg-gray-100 transition-colors">
            <td className="px-4 py-2 border-b">{user.id}</td>
            <td className="px-4 py-2 border-b">{user.name}</td>
            <td className="px-4 py-2 border-b">{user.email}</td>
            <td className="px-4 py-2 border-b flex justify-center">
              <span className="bg-blue-50 text-primary rounded-lg font-medium px-2 py-1">
                {convertUnderscoreToTitleCase(user.role)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
