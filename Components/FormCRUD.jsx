import React, { useState, useEffect, useRef } from 'react'

import { Button, Card, Form, Row, Col } from 'react-bootstrap'

import { collection, addDoc, getDocs, query, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import { db, storage } from '../Connections/Firebase'

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

import { ToastContainer, toast } from 'react-toastify';

  import 'react-toastify/dist/ReactToastify.css';
import x from '../Images/x.png'
import edit from '../Images/edit.png'

function FormCRUD() {

    const [values, setValues] = useState();
    const [items, setItems] = useState();
    const [file, setFile] = useState("");
    const [fileu, setFileu] = useState();
    const [currentID, setCurrentID] = useState("");

    //campos de texto del formulario.
    const form = useRef();
    const nameF = useRef();
    const descF = useRef();
    const anteriorF = useRef();
    const nuevoF = useRef();
    const imgF = useRef();

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;

            console.log(name);
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    setFileu(progress)
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setValues((prev) => ({ ...prev, img: downloadURL }));
                    });
                }
            );
        };
        file && uploadFile();
    }, [file]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(currentID === ''){
            createItem(values)
            getItemsData();
            toast("Creado Correctamente", {type:"success", autoClose:"3000"})
        }else{
            handleEdit(currentID, values)
            getItemsData();
            toast("Editado Correctamente", {type:"warning", autoClose:"3000"})
            setCurrentID("")
        }
        resetForm()
    }


    const createItem = async (obj) => {
        const colRef = collection(db, 'items');
        const data = await addDoc(colRef, obj);
        return data.id;
    }

    const getItems = async () => {
        const result = await getDocs(query(collection(db, 'items')));
        return result;
    }


    const getItemsData = async () => {
        const i = await getItems();
        setItems(i.docs);
    }


    useEffect(() => {
        getItems();
        getItemsData();
    })

    const handleDelete = async (id, imgId) => {
        if(window.confirm("Seguro de Eliminar este Artículo?")){
            const colRef = collection(db, 'items');
            const storageRef = ref(storage, imgId);
            await deleteDoc(doc(colRef, id));
            await deleteObject(storageRef)
            toast("Eliminado Correctamente", {type:"error", autoClose:"3000"})
        }
    }

    const setFields = (id) =>{
        items.map( i =>
            nameF.current.value = (i.data().name)
        )
        items.map( i =>
            descF.current.value = (i.data().desc)
        )
        items.map( i =>
            anteriorF.current.value = (i.data().anterior)
        )
        items.map( i =>
            nuevoF.current.value = (i.data().nuevo)
        )
        setCurrentID(id)
    }

    const handleEdit = async (id, obj) =>{
        const colRef = collection(db, 'items');
        await updateDoc(doc(colRef, id), obj)
    }

    const resetForm = () => {
        nameF.current.value = ""
        descF.current.value = ""
        anteriorF.current.value = ""
        nuevoF.current.value = ""
        imgF.current.value = ""
    }


    return (
        <>
            <div className="container-fluid w-75 m-5">
                <Form ref={form} onSubmit={handleSubmit} id='form-med'>
                    <Form.Group>
                        <Form.Label>Nombre del Producto</Form.Label>
                        <Form.Control ref={nameF}  name='name' onChange={handleInputChange} type='text' placeholder='Nombre del Producto'></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Descripcion del Producto</Form.Label>
                        <Form.Control ref={descF} name='desc' onChange={handleInputChange} type='textarea' placeholder='Descripcion del Producto'></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Precio Actual del Producto</Form.Label>
                        <Form.Control ref={nuevoF} name='nuevo' onChange={handleInputChange} type='text' placeholder='Precio Actual '></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Precio Anterior del Producto</Form.Label>
                        <Form.Control ref={anteriorF} name='anterior' onChange={handleInputChange} type='text' placeholder='Precio Anterior '></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Imagen del Producto</Form.Label>
                        <Form.Control ref={imgF} name='img' onChange={(e) => setFile(e.target.files[0])} className='img-fluid' type='file'></Form.Control>
                    </Form.Group>
                    <Form.Group className='mt-2'>
                        <Button  type='submit' disabled={fileu != null && fileu < 100}>{currentID === '' ? 'Crear': "Actualizar"}</Button>
                    </Form.Group>

                </Form>
            </div>
            <div className="container-fluid m-5 w-75">
                <h1>Items</h1>
                <Row>
                    {
                        items && items.map(i =>
                            <Col md='4' sm='6' xs='12' className='mt-2 mb-2' key={i.id}>
                                <Card className='h-100'>
                                    <Card.Img variant="top" src={i.data().img} />
                                    <Card.Body>
                                        <Card.Title>{i.data().name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{i.id}</Card.Subtitle>

                                        <h4 className="text-muted ">Precio Anterior: <span className='text-decoration-line-through'>{i.data().anterior}</span></h4>
                                        <h2>Precio en Oferta: {i.data().nuevo}</h2>

                                    </Card.Body>
                                    <div className="container-fluid p-2 text-center border-top">
                                        <Row>
                                            <Col><img src={x} alt="" width='30' onClick={() => handleDelete(i.id, i.data().img)} style={{ cursor: "pointer" }} /></Col>
                                            <Col><img src={edit} alt="" width='30' onClick ={() => setFields(i.id)} style={{ cursor: "pointer" }}/></Col>
                                        </Row>
                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                </Row>

            </div>
            <ToastContainer />
        </>
    )
}

export default FormCRUD