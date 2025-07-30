import { useState, useEffect } from "react"
import { Search, User, Plus } from "lucide-react"

function App() {
  const [characters, setCharacters] = useState([])
  const [filteredCharacters, setFilteredCharacters] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    realName: "",
    universe: "",
  })

  const API_BASE = "http://localhost:3000"

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${API_BASE}/characters`)
      if (response.ok) {
        const data = await response.json()
        setCharacters(data)
        setFilteredCharacters(data)
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCharacter = async (e) => {
    e.preventDefault()
    const method = formData.id ? "PUT" : "POST"
    const url = formData.id
      ? `${API_BASE}/characters/${formData.id}`
      : `${API_BASE}/characters`

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const savedCharacter = await response.json()
        const updatedCharacters = formData.id
          ? characters.map((c) => (c.id === savedCharacter.id ? savedCharacter : c))
          : [...characters, savedCharacter]
        setCharacters(updatedCharacters)
        setFilteredCharacters(updatedCharacters)
        setFormData({ name: "", realName: "", universe: "" })
        setShowAddModal(false)
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const deleteCharacter = async (id) => {
    try {
      await fetch(`${API_BASE}/characters/${id}`, { method: "DELETE" })
      const updated = characters.filter((char) => char.id !== id)
      setCharacters(updated)
      setFilteredCharacters(updated)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const handleEdit = (char) => {
    setFormData(char)
    setShowAddModal(true)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    if (value === "") {
      setFilteredCharacters(characters)
    } else {
      const filtered = characters.filter(
        (character) =>
          character.name.toLowerCase().includes(value.toLowerCase()) ||
          character.realName.toLowerCase().includes(value.toLowerCase()) ||
          character.universe.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredCharacters(filtered)
    }
  }

  const uniqueUniverses = [...new Set(characters.map((char) => char.universe))].length

  useEffect(() => {
    fetchCharacters()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Gestionnaire de Personnages Marvel</h1>
                <p className="text-sm text-gray-500">Gérez votre collection de super-héros</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData({ name: "", realName: "", universe: "" })
                setShowAddModal(true)
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau personnage</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Recherchez par nom, vrai nom ou univers</p>
          <p className="text-xs text-gray-400 mt-1">Ex: Spider-Man, Peter Parker, Earth-616...</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Personnages</h3>
            <p className="text-3xl font-bold text-gray-900">{characters.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Résultats</h3>
            <p className="text-3xl font-bold text-gray-900">{filteredCharacters.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Univers</h3>
            <p className="text-3xl font-bold text-gray-900">{uniqueUniverses}</p>
          </div>
        </div>

        {/* Liste des personnages */}
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun personnage trouvé</h3>
            <p className="text-gray-500 mb-6">Commencez par ajouter un personnage.</p>
            <button
              onClick={() => {
                setFormData({ name: "", realName: "", universe: "" })
                setShowAddModal(true)
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un personnage</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {filteredCharacters.map((character) => (
              <div
                key={character.id}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{character.name}</h3>
                  <span className="text-xs text-gray-500">#{character.id}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nom réel:</span> {character.realName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Univers:</span> {character.universe}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(character)}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteCharacter(character.id)}
                    className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {formData.id ? "Modifier le personnage" : "Ajouter un nouveau personnage"}
            </h2>
            <form onSubmit={addCharacter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du personnage</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="ex: Spider-Man"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom réel</label>
                <input
                  type="text"
                  required
                  value={formData.realName}
                  onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="ex: Peter Parker"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Univers</label>
                <input
                  type="text"
                  required
                  value={formData.universe}
                  onChange={(e) => setFormData({ ...formData, universe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="ex: Earth-616"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({ name: "", realName: "", universe: "" })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {formData.id ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
