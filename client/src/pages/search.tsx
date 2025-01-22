import SearchBar from "../components/SearchBar"
import ImageResults from "../components/ImageResults"
import PeopleResults from "../components/PeopleResults"
import TimeCapsules from "../components/TimeCapsules"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ImageResults />
        <PeopleResults />
      </div>
      <TimeCapsules />
    </div>
  )
}

