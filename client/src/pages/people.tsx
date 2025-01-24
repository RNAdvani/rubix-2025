import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
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
        const response = await axios.post(
          "http://localhost:3000/api/capsule/group-images",
          {
            capsuleId: id,
          }
        );

        const res = await fetch("http://127.0.0.1:5000/group-images", {
          method: "POST",
          body: JSON.stringify({ image_urls: response.data.imageUrls }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        console.log(data);

        if (data.success) {
          setGroupedImages(data.groups);
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
  }, [id]); // Added id to dependency array

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
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center"
            >
              <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg">
                <img
                  src={group[0]}
                  alt={`Group ${index + 1} thumbnail`}
                  className="w-full h-full object-cover"
                />
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
