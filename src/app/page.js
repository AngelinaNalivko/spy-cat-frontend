"use client";
import "./styles.css";
import { useState, useEffect } from "react";

export default function SpyCatsDashboard() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    name: "",
    years_of_experience: "",
    breed: "",
    salary: "",
  });

  const [editId, setEditId] = useState(null);
  const [newSalary, setNewSalary] = useState("");

  const fetchCats = async () => {
    try {
      const res = await fetch("http://localhost:8000/spycats");
      const data = await res.json();
      setCats(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/spycats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          years_of_experience: parseInt(form.years_of_experience),
          breed: form.breed,
          salary: parseFloat(form.salary),
        }),
      });
      if (res.ok) {
        setForm({ name: "", years_of_experience: "", breed: "", salary: "" });
        fetchCats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/spycats/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id, currentSalary) => {
    setEditId(id);
    setNewSalary(currentSalary);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/spycats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salary: parseFloat(newSalary) }),
      });
      if (!res.ok && res.status !== 404) {
        throw new Error("Failed to update salary");
      }
      setEditId(null);
      fetchCats();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <main className="main-container">
      <h1 className="main-title">The Spy Cat Agency</h1>

      <div className="form-container">
        <h2 className="form-title">Add a New Spy Cat</h2>
        <div className="form-grid">
          <input
            className="form-input"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="form-input"
            placeholder="Years of Experience"
            name="years_of_experience"
            value={form.years_of_experience}
            onChange={handleChange}
          />
          <input
            className="form-input"
            placeholder="Breed"
            name="breed"
            value={form.breed}
            onChange={handleChange}
          />
          <input
            className="form-input"
            placeholder="Salary"
            name="salary"
            value={form.salary}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit} className="form-button">
          Add Spy Cat
        </button>
      </div>

      <div className="cat-list">
        {cats.map((cat) => (
          <div key={cat.id} className="cat-card">
            <h2 className="cat-name">{cat.name}</h2>
            <p>
              <strong>Breed:</strong> {cat.breed}
            </p>
            <p>
              <strong>Experience:</strong> {cat.years_of_experience} yrs
            </p>

            {editId === cat.id ? (
              <div className="salary-edit">
                <input
                  type="number"
                  className="salary-input"
                  placeholder="New Salary"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="save-button"
                >
                  Save
                </button>
              </div>
            ) : (
              <p>
                <strong>Salary:</strong> ${cat.salary}{" "}
                <button
                  onClick={() => {
                    setEditId(cat.id);
                    setNewSalary(cat.salary);
                  }}
                  className="edit-button"
                >
                  Edit
                </button>
              </p>
            )}

            <button
              onClick={() => handleDelete(cat.id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
