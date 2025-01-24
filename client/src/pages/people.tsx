import React, { useEffect, useState } from "react";
import axios from "axios";
import { Folder, Loader } from "lucide-react";
import ImageModal from "../components/ImageModal";
import { useParams } from "react-router-dom";
interface GroupedImagesResponse {
  success: boolean;
  groupedImages: {
    groups: string[][];
  };
}

const People: React.FC = () => {
  const { id } = useParams();
  const [groupedImages, setGroupedImages] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post<GroupedImagesResponse>(
          "http://localhost:3000/api/capsule/group-images",
          {
            capsuleId: id,
          }
        );
        if (response.data.success) {
          setGroupedImages(response.data.groupedImages.groups);
        } else {
          setError("Failed to fetch image groups");
        }
      } catch (err) {
        setError("Error connecting to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Groups</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groupedImages.map((group, index) => (
            <button
              key={index}
              onClick={() => setSelectedGroup(group)}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Folder className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Group {index + 1}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {group.length} images
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedGroup && (
        <ImageModal
          images={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};

export default People;
