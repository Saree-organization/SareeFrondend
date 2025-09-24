import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "../../css/sareeDetail.css";

function AdminSareesDetails() {
    const { id, variantId } = useParams();
    const [saree, setSaree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const fetchSareeDetails = async () => {
            window.scrollTo(0, 0);
            try {
                const res = await API.get(`/sarees/${id}`);
                const sareeData = res.data;
                setSaree(sareeData);

                if (variantId) {
                    const index = sareeData.variants.findIndex(v => v.id === Number(variantId));
                    if (index !== -1) setSelectedVariantIndex(index);
                }

                setPrice(sareeData.variants[selectedVariantIndex]?.salesPrice || 0);
                setDiscount(sareeData.variants[selectedVariantIndex]?.discountPercent || 0);
            } catch (err) {
                console.error(err);
                setError("Failed to load saree details");
            } finally {
                setLoading(false);
            }
        };

        fetchSareeDetails();
    }, [id, variantId, selectedVariantIndex]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!saree) return <p>No details found</p>;

    const currentVariant = saree.variants?.[selectedVariantIndex];
    const mediaList = [...(currentVariant?.images || []), currentVariant?.video].filter(Boolean);

    const handleEditClick = () => setIsEditing(true);

    const handleSaveClick = async () => {
        setIsEditing(false);
        try {
            // API call to update variant
            API.put(`/admin/sarees/${id}/variants/${currentVariant.id}`, {
                salesPrice: price,
                discountPercent: discount
            })
                .then(res => {
                    alert(res.data)
                    // Update state locally after successful API call
                    const updatedVariants = [...saree.variants];
                    updatedVariants[selectedVariantIndex] = {
                        ...updatedVariants[selectedVariantIndex],
                        salesPrice: price,
                        discountPercent: discount,
                        priceAfterDiscount: price * (1 - discount / 100), // recalc locally
                    };
                    setSaree(prev => ({ ...prev, variants: updatedVariants }));
                })
                .catch(err => alert(err.date));


        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to save variant details");
        }
    };


    return (
        <>
            <div className="saree-detail-grid">
                <div className="media-thumbnails">
                    {mediaList.map((m, i) => (
                        <div
                            key={i}
                            className={`thumb ${i === selectedMediaIndex ? "active" : ""}`}
                            onClick={() => setSelectedMediaIndex(i)}
                        >
                            {m.endsWith(".mp4") ? <video src={m} muted /> : <img src={m} alt={`media-${i}`} />}
                        </div>
                    ))}
                </div>

                <div className="main-media">
                    {mediaList[selectedMediaIndex].endsWith(".mp4") ? (
                        <video src={mediaList[selectedMediaIndex]} controls />
                    ) : (
                        <img src={mediaList[selectedMediaIndex]} alt="main" />
                    )}
                </div>

                <div className="saree-info">
                    <h1>{saree.fabrics} - {saree.design}</h1>

                    <div className="saree-price-info">
                        {isEditing ? (
                            <>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    style={{ width: "100px", marginRight: "10px" }}
                                />
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                    style={{ width: "60px" }}
                                />%
                            </>
                        ) : (
                            <>
                                <span className="saree-sales-price">Rs {currentVariant.salesPrice}</span>
                                <span className="saree-discount">{currentVariant.discountPercent}% OFF</span>
                                <span className="sales-price-after-discount">{currentVariant.priceAfterDiscount}</span>
                            </>
                        )}
                        <span className="tax-info"> (Inclusive of all taxes)</span>
                    </div>

                    <p><strong>Name:</strong> {currentVariant.name}</p>
                    <p><strong>Category:</strong> {saree.category}</p>
                    <p><strong>Fabric:</strong> {saree.fabrics}</p>
                    <p><strong>Border:</strong> {saree.border}</p>
                    <p><strong>Description:</strong> {saree.description}</p>
                    <p><strong>Length:</strong> {saree.length} m</p>
                    <p><strong>Weight:</strong> {saree.weight} kg</p>
                    <p><strong>Color:</strong> {currentVariant.color}</p>
                    <p><strong>Design:</strong> {saree.design}</p>

                    <div style={{ marginTop: "10px" }}>
                        {isEditing ? (
                            <button onClick={handleSaveClick} className="add-btn add-to-cart">Save</button>
                        ) : (
                            <button onClick={handleEditClick} className="add-btn add-to-cart">Edit Price & Discount</button>
                        )}
                    </div>

                    <h3>Colors</h3>
                    <div className="variant-options">
                        {saree.variants?.map((v, i) => (
                            <button
                                key={i}
                                className={`variant-btn ${i === selectedVariantIndex ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedVariantIndex(i);
                                    setSelectedMediaIndex(0);
                                    setPrice(v.salesPrice);
                                    setDiscount(v.discountPercent);
                                    setIsEditing(false);
                                }}
                            >
                                <img src={v.images?.[0]} alt="" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminSareesDetails;
