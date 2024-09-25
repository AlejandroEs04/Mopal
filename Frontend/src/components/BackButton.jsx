import { useNavigate } from "react-router-dom"

const BackButton = ({url = ''}) => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(url.length === 0 ? -1 : url)} className="backBtn mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>

            <p>Back</p>
        </button>
    )
}

export default BackButton