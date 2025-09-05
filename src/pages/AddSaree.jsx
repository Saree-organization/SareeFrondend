import React, { useState } from "react";
import API from "../api/API"; // make sure API is configured for your backend

function AddSaree() {
  const [step, setStep] = useState(1);
  const [sareeData, setSareeData] = useState({
    fabrics: "1", design: "1", length: "1", description: "1", border: "1", category: "1", weight: "1"
  });
  const [variants, setVariants] = useState([
    { skuCode: "1", name: "1", color: "1", salesPrice: "1", costPrice: "1", discountPercent: "1", stock: "1", images: [], videos: [] }
  ]);

  // Handle saree text input
  const handleSareeChange = (e) => {
    setSareeData({ ...sareeData, [e.target.name]: e.target.value });
  };

  // Handle variant text input
  const handleVariantChange = (index, e) => {
    const updated = [...variants];
    updated[index][e.target.name] = e.target.value;
    setVariants(updated);
  };

  // Handle file input
  const handleFileChange = (index, e, type) => {
    const updated = [...variants];
    updated[index][type] = Array.from(e.target.files);
    setVariants(updated);
  };

  // Add new variant
  const addVariant = () => {
    setVariants([...variants, { skuCode: "", name: "", color: "", salesPrice: "", costPrice: "", discountPercent: "", stock: "", images: [], videos: [] }]);
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

  // Step 2: Submit one variant
  const submitVariant = async (variant) => {
    const formData = new FormData();
    Object.keys(variant).forEach(key => {
      if (key !== "images" && key !== "videos") formData.append(key, variant[key] || "");
    });
    (variant.images || []).forEach(file => formData.append("images", file));
    (variant.videos || []).forEach(file => formData.append("videos", file));

    await API.post("/sarees/addVariant", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };

  // Step 2: Submit all variants
  const submitAllVariants = async () => {
    try {
      for (const v of variants) await submitVariant(v);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Error uploading variants");
    }
  };

  // Step 3: Final save
  const submitFinal = async () => {
    try {
      await API.post("/sarees/addSaree");
      setStep(1);
      setSareeData({ fabrics: "", design: "", length: "", description: "", border: "", category: "", weight: "" });
      setVariants([{ skuCode: "", name: "", color: "", salesPrice: "", costPrice: "", discountPercent: "", stock: "", images: [], videos: [] }]);
      alert("Saree saved successfully!");
    } catch {
      alert("Error in final save");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {step === 1 && (
        <div>
          <h3>Saree Details</h3>
          {Object.keys(sareeData).map(key => (
            <input key={key} name={key} value={sareeData[key]} onChange={handleSareeChange} placeholder={key} />
          ))}
          <br />
          <button onClick={submitSareeDetails}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3>Variants</h3>
          {variants.map((v, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              {["skuCode", "name", "color", "salesPrice", "costPrice", "discountPercent", "stock"].map(f => (
                <input key={f} name={f} value={v[f]} onChange={e => handleVariantChange(i, e)} placeholder={f} />
              ))}
              <input type="file" multiple accept="image/*" onChange={e => handleFileChange(i, e, "images")} />
              <input type="file" multiple accept="video/*" onChange={e => handleFileChange(i, e, "videos")} />
            </div>
          ))}
          <button onClick={addVariant}>Add Variant</button>
          <button onClick={submitAllVariants}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Final Save</h3>
          <button onClick={submitFinal}>Save Saree</button>
        </div>
      )}
    </div>
  );
}

export default AddSaree;
