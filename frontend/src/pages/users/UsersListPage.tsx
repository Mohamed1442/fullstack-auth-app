import { useUserList } from "@api/users/users.hooks";
import type { IUserResponse } from "@api/users/users.types";
import MainLoader from "@components/MainLoader/MainLoader";
import MainPaginator from "@components/MainPaginator/MainPaginator";
import useFilter from "@hooks/useFilter";
import { convertUnderscoreToTitleCase } from "@utils/convertUnderscoreToTitleCase";

const UsersListPage = () => {
  const { searchParams } = useFilter();

  const { data, isLoading } = useUserList({
    page: +(searchParams.get("page") ?? 1),
    take: +(searchParams.get("take") ?? 10),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      {isLoading && <MainLoader />}
      {!isLoading && (
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
            {data?.data?.map((user: IUserResponse) => (
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
      )}
      <div className="mt-4 justify-end flex">
        <MainPaginator total={data?.meta?.pageCount ?? 0} />
      </div>
    </div>
  );
};

export default UsersListPage;
