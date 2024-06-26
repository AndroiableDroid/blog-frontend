import React, { useEffect, useState, useRef } from "react";
import styles from './adminPanel.module.css';
import { doc, setDoc } from 'firebase/firestore';
import { db, hosptialId } from "../../store/firebase";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from '../../store/registerSlice';
import { fetchPatients } from "../../store/patientsSlice";

export const AdminPanel = () => {

    const [isPatientAdding, setPatientAddStatus] = useState(false);
    const resetButtonRef = useRef(null);
    const [cookies] = useCookies(['jwtInCookie']);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const state = useSelector((state) => state.register);

    const handleAddPatient = async (event) => {
        console.log(event)
        event.preventDefault();
        const formData = new FormData(event.target); // Get form data
        const { id, name, mobile, address, date, doctorName } = Object.fromEntries(
            formData.entries()
        ); // Convert FormData to plain object
        console.log("data: ", id, name, mobile, address, date, doctorName)
        setPatientAddStatus(true);
        let email = name.toLowerCase().replace(/\s+/g, "") + id.toString() + "@" + hosptialId;
        console.log("email", email);
        let password = id.toString() + mobile.toString();
        setDoc(doc(db, 'patients', id), {
            name,
            mobile,
            address,
            date,
            doctorName,
            email
        }).then(() => {
            dispatch(register({ email, password, name, mobile }));
        }).finally(() => {
            alert("Patient Added!");
            setPatientAddStatus(false);
            resetButtonRef.current.click();
            dispatch(fetchPatients());
            navigate("/profile");
        })
    };

    const [currentDate, setCurrentDate] = useState(null);

    useEffect(() => {
        if (cookies.jwtInCookie) {
            let token = jwtDecode(cookies.jwtInCookie);
            if (token?.email?.substring(0, 5) !== 'admin') {
                navigate('/profile');
            }
        } else {
            navigate('/login');
        }
    }, [cookies]);

    useEffect(() => {
        const today = new Date();
        setCurrentDate(today.toISOString().substr(0, 10));
    }, [])

    useEffect(() => {
        console.log("Add Patient", state);
    }, [state])
    return (
        < div className={styles.root}>
            <div className={styles.subRoot}>
                <div className={styles.formContainer}>
                    <h2>Add Patient Information</h2>
                    <form onSubmit={handleAddPatient} className={styles.formMainContainer}>
                        <label>ID:</label>
                        <input type="text" name="id" id="id" placeholder="Ex. 123" />

                        <label>Name:</label>
                        <input type="text" name="name" id="name" placeholder="Ex. Mohammad, etc." />

                        <label>Mobile No:</label>
                        <input type="number" name="mobile" id="mobile" placeholder="Ex. 123456789" />

                        <label>Address:</label>
                        <input type="text" name="address" id="address" placeholder="Enter address" />

                        <label>Date:</label>
                        <input type="date" value={currentDate} name="date" id="date" />

                        <label>Doctor's Name:</label>
                        <input type="text" name="doctorName" id="doctorName" placeholder="Ex. Faraz, etc." />
                        <button type="submit" disabled={isPatientAdding}>{isPatientAdding ? "Adding Patient" : "Add Patient"}</button>
                        <button type="reset" ref={resetButtonRef}>Reset</button>
                    </form>
                </div>
            </div>
        </div >
    );
}