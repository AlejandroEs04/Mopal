import React, { useCallback, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import useApp from '../hooks/useApp';
import BackButton from '../components/BackButton';
import ObservationForm from '../components/ObservationForm';
import UserNotificationsContainer from '../components/UserNotificationsContainer';

const UserPage = () => {
    const [passwordInputType, setPasswordInputType] = useState('password')
    const [userInfo, setUserInfo] = useState({
        Name: '', 
        LastName: '', 
        Email: '', 
        Password: ''
    })
    const { auth } = useAuth();
    const { handleSaveUser, alerta, setAlerta } = useApp();

    const handleSubmit = (e) => {
        e.preventDefault()

        handleSaveUser(userInfo)

        setUserInfo({
            ...userInfo, 
            Password: ''
        })
    }

    const handleChangeInputType = () => {
        if(passwordInputType === 'password') {
            setPasswordInputType('text')
        } else {
            setPasswordInputType('password')
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        setUserInfo({
            ...userInfo, 
            [name]: value
        })
    }
    
    const checkInfo = useCallback(() => {
        var regularExpression  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,20}$/;

        return !regularExpression.test(userInfo?.Password)
    }, [userInfo])

    useEffect(() => {
        if(auth.ID) {
            setUserInfo(auth)
        }
    }, [auth])

    useEffect(() => {
        checkInfo()
    }, [userInfo])

    return (
        <div className='my-4'>
            <BackButton url='/admin' />
            <h1 className='m-0'>Porfile Information</h1>
            <p>See your porfile information, and setting your system</p>

            <div className='row g-5'>
                <div className='col-md-8'>
                    <UserNotificationsContainer />

                    <h3 className='mt-3'>Personal information</h3>

                    {alerta && (
                        <p className={`alert ${alerta.error ? 'alert-danger' : 'alert-success'}`}>{alerta.msg}</p>
                    )}

                    <form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
                        <div className="row g-2">
                            <Input className='col-6' label={'Name'} name={'Name'} value={userInfo.Name} disable  />
                            <Input className='col-6' label={'Last name'} name={'LastName'} value={userInfo.LastName} disable />
                        </div>
                        <Input type='email' label={'Email'} name={'Email'} value={userInfo.Email} disable />

                        <div>
                            <Input type={passwordInputType} label={'Password'} handleAction={handleChange} value={userInfo.Password} name={'Password'} placeholder={'New Password'} />

                            <div className='d-flex gap-1 mt-1'>
                                <input className='form-check-input' type="checkbox" name="passwordInputChange" id="passwordInputChange" onChange={handleChangeInputType} />
                                <label className='form-check-label' htmlFor="passwordInputChange">See Password</label>

                            </div>

                            {(checkInfo() && userInfo.Password) && (
                                <div className='mt-1'>
                                    <p className='m-0 fs-7'>The password must have a capital letter</p>
                                    <p className='m-0 fs-7'>The password must have a special character (#$!%*?&)</p>
                                    <p className='m-0 fs-7'>The password must have a length of 8 to 20 characters</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type='submit'
                                className='btn btn-sm btn-primary'
                                disabled={checkInfo()}
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                    
                    <h3 className='mt-3'>System information</h3>
                    <p className='m-0'><span className='fw-bold'>User Name: </span>{auth.UserName}</p>
                    <p className='m-0'><span className='fw-bold'>Rol: </span>{auth.RolName}</p>
                </div>
                
                <div className='col-md-4 text-start text-white'>
                    <div className='bg-secondary rounded px-3 py-4 shadow sticky top-0'>
                        <h3 className='m-0'>Personalization</h3>
                        <p>You can set your preferences for the system</p>

                        <ObservationForm />

                        {/* {(auth.RolID === 1 || auth.RolID === 3) && (
                            <div>
                                <Textarea 
                                    label={'Terms and conditions'}
                                    name={'TermsAndConditions'}
                                />

                                <button className='btn btn-sm btn-primary mt-2'>Save terms and conditions</button>

                                <p className='fw-light mt-2 m-0'>This informations will be on your quotations or sales</p>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserPage