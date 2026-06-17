import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function Dashboard() {
  return (
    <Layout currentPage="dashboard">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-scout-purple mb-2">
          لوحة التحكم
        </h1>
        <p className="text-gray-600">
          إدارة النظام والأعضاء
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents Management Card */}
        <Link
          to="/admin/documents"
          className="bg-white rounded-lg shadow-md p-6 border-r-4 border-blue-600 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                إدارة المستندات
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                إعادة إنشاء ملفات PDF ورموز QR للأعضاء
              </p>
              <span className="inline-block bg-blue-100 text-blue-700 font-bold py-1 px-3 rounded text-sm">
                اذهب →
              </span>
            </div>
            <span className="text-3xl">📄</span>
          </div>
        </Link>

        {/* Other admin features can be added here */}
      </div>
    </Layout>
  );
}
