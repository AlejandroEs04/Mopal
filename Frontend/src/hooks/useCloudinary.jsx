import { useContext } from "react";
import { CloudinaryScriptContext } from "../context/CloudinaryUploadWidget";

const useCloudinary = () => {
    return useContext(CloudinaryScriptContext);
}

export default useCloudinary;