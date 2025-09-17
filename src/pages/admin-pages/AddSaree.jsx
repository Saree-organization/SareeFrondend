import React, { useState } from "react";
import API from "../../api/API.jsx";
import "../../css/AddSaree.css";

function AddSaree() {
  const [step, setStep] = useState(1);
  const [sareeData, setSareeData] = useState({
    fabrics: "",
    design: "",
    length: "",
    description: "",
    border: "",
    category: "",
    weight: ""
  });

  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    skuCode: "",
    name: "",
    color: "",
    salesPrice: "",
    costPrice: "",
    discountPercent: "",
    stock: "",
    images: [],
    videos: []
  });

  // Handle saree text input
  const handleSareeChange = (e) => {
    setSareeData({ ...sareeData, [e.target.name]: e.target.value });
  };

  // Handle variant text input
  const handleVariantChange = (e) => {
    setCurrentVariant({ ...currentVariant, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e, type) => {
    setCurrentVariant({
      ...currentVariant,
      [type]: Array.from(e.target.files)
    });
  };

  // Step 1: Submit saree details
  const submitSareeDetails = async () => {
    try {
      await API.post("/sarees/addSareeDetails", sareeData);
      setStep(2);
    } catch {
      alert("Error saving saree details");
    }
  };

  // Save current variant and open new form
  const addVariant = async () => {
    const isConfirmed = window.confirm("Do you want to save this variant?");
    if (!isConfirmed) return; // stop if user cancels

    try {
      await submitVariant(currentVariant);
      setVariants([...variants, currentVariant]);
      setCurrentVariant({skuCode: "",name: "",color: "",salesPrice: "",costPrice: "",discountPercent: "",stock: "",images: [],videos: []
      });
      alert("Variant saved! You can add another.");
    } catch (err) {
      console.error(err);
      alert("Error saving variant");
    }
  };

  // Send one variant to backend
  const submitVariant = async (variant) => {
    const formData = new FormData();
    Object.keys(variant).forEach((key) => {
      if (key !== "images" && key !== "videos")
        formData.append(key, variant[key] || "");
    });
    (variant.images || []).forEach((file) => formData.append("images", file));
    (variant.videos || []).forEach((file) => formData.append("videos", file));

    await API.post("/sarees/addVariant", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };

  // Final save
  const submitFinal = async () => {
    try {
      await submitVariant(currentVariant); // save last filled variant if not empty
      setVariants([...variants, currentVariant]);
      await API.post("/sarees/addSaree");
      setStep(1);
      setSareeData({
        fabrics: "",
        design: "",
        length: "",
        description: "",
        border: "",
        category: "",
        weight: ""
      });
      setVariants([]);
      setCurrentVariant({
        skuCode: "",
        name: "",
        color: "",
        salesPrice: "",
        costPrice: "",
        discountPercent: "",
        stock: "",
        images: [],
        videos: []
      });
      alert("Saree saved successfully!");
    } catch {
      alert("Error in final save");
    }
  };

  return (
    <div className="form-container">
      {step === 1 && (
        <div className="form-card">
          <h3 className="form-title">Saree Details</h3>
          <div className="form-grid">
            {Object.keys(sareeData).map((key) => (
              <input
                key={key}
                className="input-field"
                name={key}
                value={sareeData[key]}
                onChange={handleSareeChange}
                placeholder={key}
              />
            ))}
          </div>
          <button className="btn" onClick={submitSareeDetails}>
            Next →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="form-card">
          <h3 className="form-title">Add Variant</h3>
          {[
            "skuCode",
            "name",
            "color",
            "salesPrice",
            "costPrice",
            "discountPercent",
            "stock"
          ].map((f) => (
            <input
              key={f}
              className="input-field"
              name={f}
              value={currentVariant[f]}
              onChange={handleVariantChange}
              placeholder={f}
            />
          ))}

          <div className="file-upload">
            <label>Upload Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "images")}
            />
          </div>
          <div className="file-upload">
            <label>Upload Videos:</label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, "videos")}
            />
          </div>

          <div className="btn-row">
            <button className="btn secondary" onClick={addVariant}>
              + Add Another Variant
            </button>
            <button className="btn gray" onClick={() => setStep(1)}>
              ← Previous
            </button>
            <button className="btn" onClick={() => setStep(3)}>
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="form-card">
          <h3 className="form-title">Final Save</h3>
          <div className="btn-row">
            <button className="btn gray" onClick={() => setStep(2)}>
              ← Previous
            </button>
            <button className="btn" onClick={submitFinal}>
              ✅ Save Saree
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSaree;
