/** @format */

// GET /characters ==> Get all characters
// POST /characters ==> Create a new character
// GET /characters/:id ==> Get a character by ID
// PUT /characters/:id ==> Update a character by ID
// DELETE /characters/:id ==> Delete a character by ID
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


// Route GET /characters
app.get("/characters", (req, res) => {
	fs.readFile("user.json", "utf8", (err, data) => {
		if (err) {
			console.error("Erreur lecture fichier :", err);
			return res.status(500).json({ error: "Erreur lecture fichier JSON" });
		}

		try {
			const json = JSON.parse(data);
			res.json(json.characters);
		} catch (e) {
			console.error("Erreur parsing JSON :", e);
			res.status(500).json({ error: "Erreur parsing JSON" });
		}
	});
});

// GET /characters/:id ==> Get a character by ID
app.get("/characters/:id", (req, res) => {
	fs.readFile("user.json", "utf8", (err, data) => {
		if (err) {
			console.error("Erreur lecture fichier :", err);
			return res.status(500).json({ error: "Erreur lecture fichier JSON" });
		}
		try {
			const json = JSON.parse(data);
			const id = req.params.id;

			const character = json.characters.find(objet => objet.id == id);

			if (character) {
				res.json(character);
			} else {
				res.status(404).json({ error: "Personnage non trouvé" });
			}
		} catch (error) {
			console.error("Erreur parsing JSON :", error);
			res.status(500).json({ error: "Erreur lors de l'analyse du fichier JSON" });
		}
	});
});

// POST /characters ==> Create a new character
app.post("/characters", (req, res) => {
	fs.readFile("user.json", "utf8", (err, data) => {
		if (err) {
			console.error("Erreur lecture fichier :", err);
			return res.status(500).json({ error: "Erreur lecture fichier JSON" });
		}
		try {
			const json = JSON.parse(data);
			const newCharacter = req.body;
			// Générer un nouvel ID unique
			const maxId = json.characters.reduce((max, c) => c.id > max ? c.id : max, 0);
			newCharacter.id = maxId + 1;
			json.characters.push(newCharacter);
			fs.writeFile("user.json", JSON.stringify(json, null, 2), err => {
				if (err) {
					console.error("Erreur écriture fichier :", err);
					return res.status(500).json({ error: "Erreur écriture fichier JSON" });
				}
				res.status(201).json(newCharacter);
			});
		} catch (e) {
			console.error("Erreur parsing JSON :", e);
			res.status(500).json({ error: "Erreur parsing JSON" });
		}
	});
});
// DELETE /characters/:id ==> Delete a character by ID
app.delete("/characters/:id", (req, res) => {
	fs.readFile("user.json", "utf8", (err, data) => {
		if (err) {
			console.error("Erreur lecture fichier :", err);
			return res.status(500).json({ error: "Erreur lecture fichier JSON" });
		}
		try {
			const json = JSON.parse(data);
			const id = parseInt(req.params.id);
			const index = json.characters.findIndex(c => c.id === id);
			if (index === -1) {
				return res.status(404).json({ error: "Personnage non trouvé" });
			}
			const deleted = json.characters.splice(index, 1)[0];
			fs.writeFile("user.json", JSON.stringify(json, null, 2), err => {
				if (err) {
					console.error("Erreur écriture fichier :", err);
					return res.status(500).json({ error: "Erreur écriture fichier JSON" });
				}
				res.json(deleted);
			});
		} catch (e) {
			console.error("Erreur parsing JSON :", e);
			res.status(500).json({ error: "Erreur parsing JSON" });
		}
	});
});
// PUT /characters/:id ==> Update a character by ID
app.put("/characters/:id", (req, res) => {
	fs.readFile("user.json", "utf8", (err, data) => {
		if (err) {
			console.error("Erreur lecture fichier :", err);
			return res.status(500).json({ error: "Erreur lecture fichier JSON" });
		}
		try {
			const json = JSON.parse(data);
			const id = parseInt(req.params.id);
			const index = json.characters.findIndex(c => c.id === id);
			if (index === -1) {
				return res.status(404).json({ error: "Personnage non trouvé" });
			}
			const updatedCharacter = { ...json.characters[index], ...req.body, id };
			json.characters[index] = updatedCharacter;
			fs.writeFile("user.json", JSON.stringify(json, null, 2), err => {
				if (err) {
					console.error("Erreur écriture fichier :", err);
					return res.status(500).json({ error: "Erreur écriture fichier JSON" });
				}
				res.json(updatedCharacter);
			});
		} catch (e) {
			console.error("Erreur parsing JSON :", e);
			res.status(500).json({ error: "Erreur parsing JSON" });
		}
	});
});

app.listen(port, () => {
	console.log(`Serveur en ligne : http://localhost:${port}`);
});