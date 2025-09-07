import { useUserList } from "@api/users/users.hooks";
import MainLoader from "@components/MainLoader/MainLoader";
import MainPaginator from "@components/MainPaginator/MainPaginator";
import useFilter from "@hooks/useFilter";
import UsersTable from "./components/UsersTable";

const UsersListPage = () => {
  const { searchParams } = useFilter();

  const { data, isLoading } = useUserList({
    page: +(searchParams.get("page") ?? 1),
    take: +(searchParams.get("take") ?? 10),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      {isLoading && <MainLoader size="sm" />}
      {!isLoading && <UsersTable data={data?.data ?? []} />}
      <div className="mt-6 justify-end flex">
        <MainPaginator total={data?.meta?.pageCount ?? 0} />
      </div>
    </div>
  );
};

export default UsersListPage;
