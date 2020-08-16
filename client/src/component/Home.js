import React, { useEffect, useState } from 'react';
import '../App.scss';
import axios from 'axios';

function Home() {
    // display everything from mongo/aws
    const [meme, setMemes] = useState(null);

    useEffect(() => {
        setDisplay();
    }, []);

    const setDisplay = async () => {
        try {
            const updateDate = await axiosGetDisplay();
            setMemes(updateDate);
        }
        catch (error) {
        }
    };

    const axiosGetDisplay = () => {
        return axios.get('/displaymeme')
    }

    return (
        <>
            <h1>MemeStory</h1>
            <div className="description">
                <p>Create, upload photos, and generate a new meme to join the memestory </p>
            </div>

            <div className="description-container">
                {meme !== null &&
                    meme.data.map((item, index) => (
                        <div className="card" key={index}>
                            <div className="card-image">
                                <figure className="image is-4by3 memeContainer">
                                    {
                                        item.text && item.text.map((textItem, i) => (
                                            Number(textItem.positionY) ?
                                                <div className="memeTitle home" key={i} style={{ top: textItem.positionY + 'px', zIndex: i + 1 }} > {textItem.title} </div> :
                                                <div className="memeTitle home" key={i} style={{ top: 0 + 'px', zIndex: i + 1 }} > {textItem.title} </div>
                                        ))
                                    }
                                    <img src={item.image[0].location} alt={item.image[0].originalname} />
                                </figure>
                            </div>
                            <div className="card-content">
                                <div className="content">
                                    {item.text && String(item.text.title) && item.text.title}
                                    <time dateTime={item.updatedAt.substring(0, 10)}>{item.updatedAt.substring(0, 10)}</time>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
export default Home;