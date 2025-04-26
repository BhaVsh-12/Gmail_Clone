import axios from "axios"
import { useDispatch } from "react-redux";
import { setEmails } from "../redux/appSlice";
import Api from "../Api";
const useGetAllEmails = () => {
    const dispatch = useDispatch();

    const getAllEmails = async () => {
        try {
            const res = await Api.get("/api/v1/email/getallemails", {
            });
            dispatch(setEmails(res.data.emails));
            return res.data.emails; // Optional: return the emails if needed
        } catch (error) {
            console.log(error);
            throw error; // Re-throw the error if you want to handle it in the component
        }
    };

    // Return the function so it can be called manually
    return { getAllEmails };
};

export default useGetAllEmails;