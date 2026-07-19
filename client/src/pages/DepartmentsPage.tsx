import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

type Department = {
  id: string;
  name: string;
  description: string | null;
};

function DepartmentsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get<Department[]>("/departments");
      return response.data;
    },
  });

  if (isLoading)
    return <p className="p-6 text-slate-500">Loading departments...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Failed to load departments.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Departments</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {data?.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-2xl shadow-md p-6 border border-slate-100"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              {dept.name}
            </h2>
            <p className="text-slate-500 mt-1">{dept.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentsPage;
