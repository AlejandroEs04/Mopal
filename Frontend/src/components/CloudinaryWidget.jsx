import { useState } from "react";
import CloudinaryUploadWidget from "../context/CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";

const CloudinaryWidget = ({setImagenUrl, completeBtn = false, text = "Seleccione una imagen", elementHandleChange}) => {
    const [publicId, setPublicId] = useState("");
    const [cloudName] = useState("dmap6p5wl");
    const [uploadPreset] = useState("hrj8ndzc");

    const [uwConfig] = useState({
        cloudName, 
        uploadPreset
    });

    // Create a Cloudinary instance and set your cloud name.
    const cld = new Cloudinary({
        cloud: {
            cloudName
        }
    });

    const myImage = cld.image(publicId);

    return (
        <>
            <CloudinaryUploadWidget text={text} completeBtn={completeBtn} uwConfig={uwConfig} setPublicId={setPublicId} setImageUrl={setImagenUrl} elementHandleChange={elementHandleChange} />
        </>
    )
}

export default CloudinaryWidget