import React, { useState } from "react";
import API from "../../api/API.jsx";
import "../../css/AddSaree.css";
import ColorDropdown from "../../components/ColorDropdown.jsx";
import {
  fabricsOptions,
  designOptions,
  lengthOptions,
  borderOptions,
  categoryOptions,
  weightOptions,
} from "../../data/sareeAddOrFilters.js";

function AddSaree() {
  const [step, setStep] = useState(1);
  const [sareeData, setSareeData] = useState({
    fabrics: "",
    design: "",
    length: "",
    description: "",
    border: "",
    category: "",
    weight: "",
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
    videos: [],
  });

  const handleSareeChange = (e) => {
    setSareeData({ ...sareeData, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (e) => {
    setCurrentVariant({ ...currentVariant, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    setCurrentVariant({
      ...currentVariant,
      [type]: Array.from(e.target.files),
    });
  };

  const submitSareeDetails = async () => {
    try {
      await API.post("/sarees/addSareeDetails", sareeData);
      setStep(2);
    } catch {
      alert("Error saving saree details");
    }
  };

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
        videos: [],
      });
      alert("Variant saved! You can add another.");
    } catch (err) {
      console.error(err);
      alert("Error saving variant");
    }
  };

  const submitVariant = async (variant) => {
    const formData = new FormData();
    Object.keys(variant).forEach((key) => {
      if (key !== "images" && key !== "videos")
        formData.append(key, variant[key] || "");
    });
    (variant.images || []).forEach((file) => formData.append("images", file));
    (variant.videos || []).forEach((file) => formData.append("videos", file));

    await API.post("/sarees/addVariant", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

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
        weight: "",
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
        videos: [],
      });
      alert("Saree saved successfully!");
    } catch {
      alert("Error in final save");
    }
  };

  return (
    <div className="add-saree-container">

      {/* Step 1: Saree Details */}
      {step === 1 && (
        <div className="add-saree-card">
          <h3 className="add-saree-title">Saree Details</h3>
          <div className="add-saree-grid">

            {/* Fabric */}
            <label>Fabric:</label>
            <input
              list="fabricsList"
              name="fabrics"
              value={sareeData.fabrics}
              onChange={handleSareeChange}
              placeholder="Select or type Fabric"
            />
            <datalist id="fabricsList">
              {fabricsOptions.map(f => <option key={f} value={f} />)}
            </datalist>

            {/* Design */}
            <label>Design:</label>
            <input
              list="designList"
              name="design"
              value={sareeData.design}
              onChange={handleSareeChange}
              placeholder="Select or type Design"
            />
            <datalist id="designList">
              {designOptions.map(d => <option key={d} value={d} />)}
            </datalist>

            {/* Length */}
            <label>Length:</label>
            <select name="length" value={sareeData.length} onChange={handleSareeChange}>
              <option value="">Select Length (ft)</option>
              {lengthOptions.map(l => <option key={l} value={l}>{l} ft</option>)}
            </select>

            {/* Border */}
            <label>Border:</label>
            <input
              list="borderList"
              name="border"
              value={sareeData.border}
              onChange={handleSareeChange}
              placeholder="Select or type Border"
            />
            <datalist id="borderList">
              {borderOptions.map(b => <option key={b} value={b} />)}
            </datalist>

            {/* Category */}
            <label>Category:</label>
            <input
              list="categoryList"
              name="category"
              value={sareeData.category}
              onChange={handleSareeChange}
              placeholder="Select or type Category"
            />
            <datalist id="categoryList">
              {categoryOptions.map(c => <option key={c} value={c} />)}
            </datalist>

            {/* Weight */}
            <label>Weight:</label>
            <select name="weight" value={sareeData.weight} onChange={handleSareeChange}>
              <option value="">Select Weight (g)</option>
              {weightOptions.map(w => <option key={w} value={w}>{w} g</option>)}
            </select>

            {/* Description */}
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={sareeData.description}
              onChange={handleSareeChange}
              placeholder="Enter description"
            />
          </div>
          <button className="add-saree-btn" onClick={submitSareeDetails}>
            Next →
          </button>
        </div>
      )}

      {/* Step 2: Variant */}
      {step === 2 && (
        <div className="add-saree-card">
          <h3 className="add-saree-title">Add Variant</h3>

          <label>SKU Code:</label>
          <input
            className="add-saree-input"
            name="skuCode"
            value={currentVariant.skuCode}
            onChange={handleVariantChange}
            placeholder="SKU Code"
          />

          <label>Variant Name:</label>
          <input
            className="add-saree-input"
            name="name"
            value={currentVariant.name}
            onChange={handleVariantChange}
            placeholder="Name"
          />

          <label>Color:</label>
          <ColorDropdown
            selectedColor={currentVariant.color}
            onChange={(c) => setCurrentVariant({ ...currentVariant, color: c })}
          />

          <label>Sales Price:</label>
          <input
            className="add-saree-input"
            name="salesPrice"
            value={currentVariant.salesPrice}
            onChange={handleVariantChange}
            placeholder="Sales Price"
          />

          <label>Cost Price:</label>
          <input
            className="add-saree-input"
            name="costPrice"
            value={currentVariant.costPrice}
            onChange={handleVariantChange}
            placeholder="Cost Price"
          />

          <label>Discount %:</label>
          <input
            className="add-saree-input"
            name="discountPercent"
            value={currentVariant.discountPercent}
            onChange={handleVariantChange}
            placeholder="Discount %"
          />

          <label>Stock:</label>
          <input
            className="add-saree-input"
            name="stock"
            value={currentVariant.stock}
            onChange={handleVariantChange}
            placeholder="Stock"
          />

          <label>Upload Images:</label>
          <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "images")} />

          <label>Upload Videos:</label>
          <input type="file" multiple accept="video/*" onChange={(e) => handleFileChange(e, "videos")} />

          <div className="add-saree-btn-row">
            <button className="add-saree-btn secondary" onClick={addVariant}>
              + Add Another Variant
            </button>
            <button className="add-saree-btn gray" onClick={() => setStep(1)}>
              ← Previous
            </button>
            <button className="add-saree-btn" onClick={() => setStep(3)}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Final Save */}
      {step === 3 && (
        <div className="add-saree-card">
          <h3 className="add-saree-title">Final Save</h3>
          <div className="add-saree-btn-row">
            <button className="add-saree-btn gray" onClick={() => setStep(2)}>
              ← Previous
            </button>
            <button className="add-saree-btn" onClick={submitFinal}>
              ✅ Save Saree
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSaree;
