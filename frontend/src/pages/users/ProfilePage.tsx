import { useCurrentUserInfo } from "@api/users/users.hooks";
import type { ERole } from "@api/users/users.types";
import MainLoader from "@components/MainLoader/MainLoader";
import { convertUnderscoreToTitleCase } from "@utils/convertUnderscoreToTitleCase";

const ProfilePage = () => {
  const { data, isLoading } = useCurrentUserInfo();

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 rounded-xl shadow-lg bg-white font-sans">
      <h2 className="mb-6 font-semibold text-2xl text-gray-800">Profile</h2>
      <div className="mb-4">
        <strong className="block text-gray-700">Name:</strong>
        <div className="text-gray-600 mt-1">{data?.name}</div>
      </div>
      <div className="mb-4">
        <strong className="block text-gray-700">Email:</strong>
        <div className="text-gray-600 mt-1">{data?.email}</div>
      </div>
      <div>
        <strong className="block text-gray-700">Role:</strong>
        <div className="inline-block bg-blue-50 text-primary px-3 py-1 rounded-lg mt-1 font-medium">
          {convertUnderscoreToTitleCase(data?.role as ERole)}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
