import React, { useEffect, useState } from 'react'
import API from '../api/API';
import SareeCard from './SareeCard';
import "../css/relatedSaree.css"

function SimilarSarees() {
    const [sarees, setSarees] = useState([]);


    useEffect(() => {
        API.get("/sarees/allSarees")
            .then((res) => {
                setSarees(res.data);

            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div className='related-saree-container'>
            <h3 className="reviews-title">Similar Saree's</h3>
            <div className='related-saree-list'>
            {sarees.map((s) => (
               <>
                <SareeCard key={s.id} saree={s} />
                <SareeCard key={s.id} saree={s} />
               </>
            ))}
            </div>

        </div>
    )
}

export default SimilarSarees;
