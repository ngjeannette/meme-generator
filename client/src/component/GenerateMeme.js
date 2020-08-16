import React, { useState, useEffect, useRef } from 'react';
import '../App.scss';
import Draggable from 'react-draggable';
import { useHistory } from "react-router-dom";
import axios from 'axios';
const { uuid } = require('uuidv4');

function GenerateMeme() {
    const history = useHistory();

    const [newImage, setNewImage] = useState(null);
    const [imageInfo, setImageInfo] = useState(null);
    const [text, setText] = useState([]);
    const [clickIndex, setClickIndex] = useState(null);
    const [message, displayMessage] = useState(false);
    const inputEl = useRef(null);

    const uploadedImage = (item) => {
        const uploadedImage = window.URL.createObjectURL(item.target.files[0]);
        setNewImage(uploadedImage)
        setImageInfo(item.target.files)
    };

    const addText = () => {
        const item = {
            title: 'memestory',
            positionY: ''
        }
        if (text.length < 4) {
            setText([...text, item])
            displayMessage(false)
        } else {
            displayMessage(true)
        }
    }

    useEffect(() => {
    }, [newImage, clickIndex, message, text]);

    //when drag stops, set positioning
    const handleStop = (event) => {
        if (inputEl.current) {

            if ((event.y < (inputEl.current.getBoundingClientRect().top))) {
                text[clickIndex].positionY = 0;
            } else if ((event.y > (inputEl.current.getBoundingClientRect().bottom))) {
                text[clickIndex].positionY = inputEl.current.getBoundingClientRect().bottom;
            } else {
                text[clickIndex].positionY = event.target.getBoundingClientRect().top - inputEl.current.getBoundingClientRect().top;
            }
            setText([...text]);
        }
    }

    const deleteItem = (index) => {
        text.splice(index, 1);
        setText([...text])
    }

    // use value and index and update the text for positioning
    const updateInput = (value, index) => {
        text[index].title = value;
        setText([...text]);
    }

    // take the text and image, and save image onto amazon & mongo 
    const onSave = (e) => {
        e.preventDefault();
        var bodyFormData = new FormData();
        bodyFormData.append('image', imageInfo[0]);
        bodyFormData.set('userID', uuid());
        bodyFormData.set('text', JSON.stringify(text));

        axios({
            method: 'post',
            url: '/savememe',
            data: bodyFormData,
        })
            .then(function (response) {
                history.push("/");
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }

    // check image is upload or cancelled
    const setUpload = (e) => {
        if (e.target.value.length) {
            uploadedImage(e);
        } else {
            setNewImage(null);
            setImageInfo(null)
        }
    }

    return (
        <>
            <h1>Create Memestory</h1>
            <h2>Upload a photo to get started</h2>
            <div className="generate-Container">
                <form onSubmit={(e) => { onSave(e) }}>
                    <input className="input" accept="image/*" type="file" name="image" onChange={(e) => { setUpload(e) }} />
                    {
                        newImage &&
                        <>
                            <div className="options">
                                <input className="button is-primary" onClick={() => { addText() }} value="Create Text" type="button" />
                                {
                                    text.length === 4 && <p>Display 4 titles only</p>
                                }
                            </div>
                            <div className="options">
                                <button className="button is-info" type="submit">save</button>
                            </div>
                        </>
                    }
                </form>
                <div className="newImages">
                    {
                        newImage &&
                        <img src={newImage} ref={inputEl} alt="Uploaded" />
                    }
                    {
                        text.length > 0 && text.map((item, index) => (
                            <div onMouseDown={() => { setClickIndex(index) }} key={index} >
                                <Draggable
                                    onStop={handleStop}
                                    bounds={{ top: (-250 + (index * 20)), left: 0, right: 0, bottom: 0 }}
                                >
                                    <div>
                                        <input maxLength={15} className="drag-box" value={item.title} onChange={(e) => { updateInput(e.target.value, index) }} />
                                        <div className="delete-item" onClick={() => { deleteItem(index) }}><span>x</span></div>
                                    </div>
                                </Draggable>
                            </div>

                        ))
                    }
                </div>
            </div>
        </>
    )
}
export default GenerateMeme;