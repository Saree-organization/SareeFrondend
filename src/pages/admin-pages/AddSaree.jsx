import React, { useState } from "react";
import API from "../../api/API.jsx";
import "../../css/AddSaree.css";
import ColorDropdown from "../../components/ColorDropdown.jsx";

import {
  fabricsOptions, designOptions, lengthOptions, borderOptions,
  categoryOptions, weightOptions,
} from "../../data/sareeAddOrFilters.js"; // create this file and put your arrays here

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
    if (!isConfirmed) return;

    try {
      await submitVariant(currentVariant);
      setVariants([...variants, currentVariant]);
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
      await submitVariant(currentVariant);
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

      {/* Step 1: Saree Details */}
      {step === 1 && (
        <div className="form-card">
          <h3 className="form-title">Saree Details</h3>
          <div className="form-grid">

            {/* Fabrics */}
            <select name="fabrics" value={sareeData.fabrics} onChange={handleSareeChange}>
              <option value="">Select Fabric</option>
              {fabricsOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            {/* Design */}
            <select name="design" value={sareeData.design} onChange={handleSareeChange}>
              <option value="">Select Design</option>
              {designOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Length */}
            <select name="length" value={sareeData.length} onChange={handleSareeChange}>
              <option value="">Select Length (ft)</option>
              {lengthOptions.map(l => <option key={l} value={l}>{l} ft</option>)}
            </select>

            {/* Border */}
            <select name="border" value={sareeData.border} onChange={handleSareeChange}>
              <option value="">Select Border</option>
              {borderOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            {/* Category */}
            <select name="category" value={sareeData.category} onChange={handleSareeChange}>
              <option value="">Select Category</option>
              {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Weight */}
            <select name="weight" value={sareeData.weight} onChange={handleSareeChange}>
              <option value="">Select Weight (g)</option>
              {weightOptions.map(w => <option key={w} value={w}>{w} g</option>)}
            </select>

            {/* Description */}
            <input
              type="text"
              name="description"
              value={sareeData.description}
              onChange={handleSareeChange}
              placeholder="Description"
            />

          </div>
          <button className="btn" onClick={submitSareeDetails}>
            Next →
          </button>
        </div>
      )}

      {/* Step 2: Variant */}
      {step === 2 && (
        <div className="form-card">
          <h3 className="form-title">Add Variant</h3>
          <input
            className="input-field"
            name="skuCode"
            value={currentVariant.skuCode}
            onChange={handleVariantChange}
            placeholder="SKU Code"
          />
          <input
            className="input-field"
            name="name"
            value={currentVariant.name}
            onChange={handleVariantChange}
            placeholder="Name"
          />

          {/* Color Dropdown */}


          <ColorDropdown
            selectedColor={currentVariant.color}
            onChange={(c) => setCurrentVariant({ ...currentVariant, color: c })}
          />




          <input
            className="input-field"
            name="salesPrice"
            value={currentVariant.salesPrice}
            onChange={handleVariantChange}
            placeholder="Sales Price"
          />
          <input
            className="input-field"
            name="costPrice"
            value={currentVariant.costPrice}
            onChange={handleVariantChange}
            placeholder="Cost Price"
          />
          <input
            className="input-field"
            name="discountPercent"
            value={currentVariant.discountPercent}
            onChange={handleVariantChange}
            placeholder="Discount %"
          />
          <input
            className="input-field"
            name="stock"
            value={currentVariant.stock}
            onChange={handleVariantChange}
            placeholder="Stock"
          />

          <div className="file-upload">
            <label>Upload Images:</label>
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "images")} />
          </div>
          <div className="file-upload">
            <label>Upload Videos:</label>
            <input type="file" multiple accept="video/*" onChange={(e) => handleFileChange(e, "videos")} />
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

      {/* Step 3: Final Save */}
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
